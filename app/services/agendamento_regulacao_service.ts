import db from '@adonisjs/lucid/services/db'
import redis from '@adonisjs/redis/services/main'
import { DateTime } from 'luxon'
import Agendamento from '#models/agendamento'
import CotaAgendamento from '#models/cota_agendamento'

export interface CriarAgendamentoDTO {
  cidadaoId: number
  unidadeSolicitanteId: number
  unidadeExecutanteId: number
  profissionalId?: number | null
  tipo: 'CONSULTA' | 'EXAME'
  especialidadeOuExame: string
  dataHora: string // ISO string ou YYYY-MM-DD HH:mm:ss
  prioridade?: 'NORMAL' | 'URGENTE' | 'PREFERENCIAL'
  observacoes?: string | null
}

export default class AgendamentoRegulacaoService {
  /**
   * Realiza o agendamento de consulta ou exame com bloqueio distribuído (Redis Lock)
   * e controle estrito de cotas municipais de regulação SUS.
   */
  public static async agendar(dados: CriarAgendamentoDTO): Promise<Agendamento> {
    const dataHoraLuxon = DateTime.fromISO(dados.dataHora)
    const dataHoraStr = dataHoraLuxon.isValid
      ? dataHoraLuxon.toFormat('yyyy-MM-dd HH:mm:ss')
      : dados.dataHora

    const lockKey = `lock:agendamento:${dados.unidadeExecutanteId}:${dataHoraStr}:${dados.profissionalId || 'geral'}`
    let lockAdquirido = true

    // 1. Tenta adquirir Lock no Redis para evitar concorrência dupla no mesmo slot (se não estiver em test)
    if (process.env.NODE_ENV !== 'test') {
      try {
        const res = await redis.set(lockKey, 'locked', 'EX', 10, 'NX')
        lockAdquirido = res === 'OK'
      } catch {
        lockAdquirido = true
      }
    }

    if (!lockAdquirido) {
      throw new Error('Este horário está sendo agendado por outro operador no momento. Tente novamente em instantes.')
    }

    try {
      return await db.transaction(async (trx) => {
        // 2. Verifica se a vaga já está ocupada no banco de dados no mesmo minuto
        const minutoSlot = (dataHoraLuxon.isValid ? dataHoraLuxon : DateTime.now()).toFormat('yyyy-MM-dd HH:mm')

        const agendamentoExistente = await Agendamento.query({ client: trx })
          .where('unidade_executante_id', dados.unidadeExecutanteId)
          .where('data_hora', 'like', `${minutoSlot}%`)
          .if(dados.profissionalId, (q) => q.where('profissional_id', dados.profissionalId!))
          .whereNot('status', 'CANCELADO')
          .first()

        if (agendamentoExistente) {
          throw new Error('Horário já ocupado por outro agendamento ativo nesta unidade/profissional.')
        }

        // 3. Validação de Cotas Municipais de Regulação
        const mesAno = (dataHoraLuxon.isValid ? dataHoraLuxon : DateTime.now()).toFormat('yyyy-MM')
        const cota = await CotaAgendamento.query({ client: trx })
          .where('unidade_solicitante_id', dados.unidadeSolicitanteId)
          .where('tipo', dados.tipo)
          .where('especialidade_ou_exame', dados.especialidadeOuExame)
          .where('mes_ano', mesAno)
          .forUpdate()
          .first()

        if (cota && cota.cotaUtilizada >= cota.cotaMensal) {
          throw new Error(
            `Cota mensal esgotada para ${dados.especialidadeOuExame} na unidade solicitante (${cota.cotaUtilizada}/${cota.cotaMensal} vagas utilizadas no mês ${mesAno}).`
          )
        }

        // 4. Criação do Agendamento com Protocolo Único
        const randomNum = Math.floor(1000 + Math.random() * 9000)
        const protocolo = `REG-${DateTime.now().toFormat('yyyyMMdd')}-${randomNum}`

        const agendamento = await Agendamento.create(
          {
            protocolo,
            cidadaoId: dados.cidadaoId,
            unidadeSolicitanteId: dados.unidadeSolicitanteId,
            unidadeExecutanteId: dados.unidadeExecutanteId,
            profissionalId: dados.profissionalId || null,
            tipo: dados.tipo,
            especialidadeOuExame: dados.especialidadeOuExame,
            dataHora: dataHoraLuxon.isValid ? dataHoraLuxon : DateTime.now(),
            status: 'AGENDADO',
            prioridade: dados.prioridade || 'NORMAL',
            observacoes: dados.observacoes || null,
          },
          { client: trx }
        )

        // 5. Incremento atômico da cota utilizada
        if (cota) {
          cota.cotaUtilizada += 1
          await cota.useTransaction(trx).save()
        }

        return agendamento
      })
    } finally {
      // 6. Liberação do Lock no Redis
      if (process.env.NODE_ENV !== 'test') {
        try {
          await redis.del(lockKey)
        } catch {
          // Ignora erro de liberação se redis offline
        }
      }
    }
  }

  /**
   * Cancela um agendamento e estorna a cota municipal correspondente.
   */
  public static async cancelar(id: number, motivo: string): Promise<Agendamento> {
    return await db.transaction(async (trx) => {
      const agendamento = await Agendamento.findOrFail(id, { client: trx })

      if (agendamento.status === 'CANCELADO') {
        throw new Error('Este agendamento já se encontra cancelado.')
      }

      agendamento.status = 'CANCELADO'
      agendamento.motivoCancelamento = motivo
      await agendamento.useTransaction(trx).save()

      // Estorna a cota utilizada se houver cota registrada
      const mesAno = agendamento.dataHora.toFormat('yyyy-MM')
      const cota = await CotaAgendamento.query({ client: trx })
        .where('unidade_solicitante_id', agendamento.unidadeSolicitanteId)
        .where('tipo', agendamento.tipo)
        .where('especialidade_ou_exame', agendamento.especialidadeOuExame)
        .where('mes_ano', mesAno)
        .forUpdate()
        .first()

      if (cota && cota.cotaUtilizada > 0) {
        cota.cotaUtilizada -= 1
        await cota.useTransaction(trx).save()
      }

      return agendamento
    })
  }

  /**
   * Confirma a presença ou chegada do munícipe para a consulta/exame.
   */
  public static async confirmar(id: number): Promise<Agendamento> {
    const agendamento = await Agendamento.findOrFail(id)
    agendamento.status = 'CONFIRMADO'
    await agendamento.save()
    return agendamento
  }
}
