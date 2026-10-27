import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Agendamento from '#models/agendamento'
import CotaAgendamento from '#models/cota_agendamento'
import UnidadeSaude from '#models/unidade_saude'
import Profissional from '#models/profissional'
import Cidadao from '#models/cidadao'
import AgendamentoRegulacaoService from '#services/agendamento_regulacao_service'

export default class AgendamentosController {
  /**
   * Listagem de Agendamentos e Mapa de Cotas de Regulação Municipal.
   */
  public async index({ request, inertia }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 15)
      const tipo = request.input('tipo')
      const status = request.input('status')
      const search = request.input('search')

      const agendamentosQuery = Agendamento.query()
        .preload('cidadao')
        .preload('unidadeSolicitante')
        .preload('unidadeExecutante')
        .preload('profissional')
        .orderBy('dataHora', 'desc')

      if (tipo) {
        agendamentosQuery.where('tipo', tipo)
      }

      if (status) {
        agendamentosQuery.where('status', status)
      }

      if (search) {
        agendamentosQuery.whereHas('cidadao', (q) => {
          q.where('nomeCompleto', 'like', `%${search}%`)
            .orWhere('cpf', 'like', `%${search}%`)
            .orWhere('cns', 'like', `%${search}%`)
        }).orWhere('protocolo', 'like', `%${search}%`)
      }

      const agendamentos = await agendamentosQuery.paginate(page, limit)

      // Mapa de cotas do mês corrente
      const mesAtual = DateTime.now().toFormat('yyyy-MM')
      const cotas = await CotaAgendamento.query()
        .where('mesAno', mesAtual)
        .preload('unidadeSolicitante')
        .orderBy('especialidadeOuExame', 'asc')

      // Dados de apoio para modais
      const unidades = await UnidadeSaude.query().where('ativa', true).orderBy('nomeFantasia', 'asc')
      const profissionais = await Profissional.query().where('status', 'ativo').orderBy('nome', 'asc')
      const cidadaosRecentes = await Cidadao.query().orderBy('nomeCompleto', 'asc').limit(20)

      return inertia.render('agendamentos/index', {
        agendamentos: agendamentos.serialize(),
        cotas: cotas.map((c) => ({
          ...c.serialize(),
          saldoDisponivel: c.saldoDisponivel,
        })),
        unidades: unidades.map((u) => u.serialize()),
        profissionais: profissionais.map((p) => p.serialize()),
        cidadaosRecentes: cidadaosRecentes.map((c) => c.serialize()),
        filters: { tipo, status, search },
        mesAtual,
      })
    } catch (err: any) {
      console.error('ERROR NO CONTROLLER INDEX:', err)
      throw err
    }
  }

  /**
   * Criação de novo agendamento via modal com verificação atômica de cota e lock.
   */
  public async store({ request, response, session }: HttpContext) {
    const payload = request.only([
      'cidadaoId',
      'unidadeSolicitanteId',
      'unidadeExecutanteId',
      'profissionalId',
      'tipo',
      'especialidadeOuExame',
      'dataHora',
      'prioridade',
      'observacoes',
    ])

    try {
      const agendamento = await AgendamentoRegulacaoService.agendar({
        cidadaoId: Number(payload.cidadaoId),
        unidadeSolicitanteId: Number(payload.unidadeSolicitanteId),
        unidadeExecutanteId: Number(payload.unidadeExecutanteId),
        profissionalId: payload.profissionalId ? Number(payload.profissionalId) : null,
        tipo: payload.tipo,
        especialidadeOuExame: payload.especialidadeOuExame,
        dataHora: payload.dataHora,
        prioridade: payload.prioridade || 'NORMAL',
        observacoes: payload.observacoes,
      })

      session.flash('success', `Agendamento regulado com sucesso! Protocolo: ${agendamento.protocolo}`)
      return response.redirect().toPath('/agendamentos')
    } catch (err: any) {
      session.flash('error', err.message || 'Erro ao processar agendamento.')
      return response.redirect().back()
    }
  }

  /**
   * Cancelamento de agendamento e liberação de cota.
   */
  public async cancelar({ params, request, response, session }: HttpContext) {
    const motivo = request.input('motivo', 'Cancelado pelo operador municipal')
    try {
      await AgendamentoRegulacaoService.cancelar(params.id, motivo)
      session.flash('success', 'Agendamento cancelado e cota estornada com sucesso.')
      return response.redirect().toPath('/agendamentos')
    } catch (err: any) {
      session.flash('error', err.message || 'Erro ao cancelar agendamento.')
      return response.redirect().back()
    }
  }

  /**
   * Confirmação de comparecimento do munícipe.
   */
  public async confirmar({ params, response, session }: HttpContext) {
    try {
      await AgendamentoRegulacaoService.confirmar(params.id)
      session.flash('success', 'Presença confirmada no agendamento.')
      return response.redirect().toPath('/agendamentos')
    } catch (err: any) {
      session.flash('error', err.message || 'Erro ao confirmar agendamento.')
      return response.redirect().back()
    }
  }

  /**
   * API JSON para consultar saldo de cota em tempo real.
   */
  public async apiCotas({ request, response }: HttpContext) {
    const unidadeId = request.input('unidadeId')
    const tipo = request.input('tipo')
    const especialidadeOuExame = request.input('especialidadeOuExame')
    const mesAno = request.input('mesAno', DateTime.now().toFormat('yyyy-MM'))

    const cota = await CotaAgendamento.query()
      .where('unidadeSolicitanteId', unidadeId)
      .where('tipo', tipo)
      .where('especialidadeOuExame', especialidadeOuExame)
      .where('mesAno', mesAno)
      .first()

    return response.json({
      existeCota: !!cota,
      cotaMensal: cota?.cotaMensal ?? null,
      cotaUtilizada: cota?.cotaUtilizada ?? 0,
      saldoDisponivel: cota ? cota.saldoDisponivel : null,
    })
  }
}
