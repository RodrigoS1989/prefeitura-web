import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import CotaAgendamento from '#models/cota_agendamento'
import Agendamento from '#models/agendamento'
import UnidadeSaude from '#models/unidade_saude'
import Cidadao from '#models/cidadao'
import Profissional from '#models/profissional'

export default class extends BaseSeeder {
  async run() {
    const mesAtual = DateTime.now().toFormat('yyyy-MM')

    const unidades = await UnidadeSaude.all()
    if (unidades.length === 0) {
      return
    }

    const ubsCentral = unidades[0]
    const usfFlores = unidades[1] || unidades[0]
    const upaZonaSul = unidades[2] || unidades[0]

    const cidadao1 = await Cidadao.first()
    const medico1 = await Profissional.first()

    // 1. Cotas de Regulação Municipal
    const cotasData = [
      {
        unidadeSolicitanteId: ubsCentral.id,
        tipo: 'CONSULTA' as const,
        especialidadeOuExame: 'Cardiologia',
        mesAno: mesAtual,
        cotaMensal: 20,
        cotaUtilizada: 5,
      },
      {
        unidadeSolicitanteId: ubsCentral.id,
        tipo: 'CONSULTA' as const,
        especialidadeOuExame: 'Pediatria',
        mesAno: mesAtual,
        cotaMensal: 30,
        cotaUtilizada: 12,
      },
      {
        unidadeSolicitanteId: ubsCentral.id,
        tipo: 'EXAME' as const,
        especialidadeOuExame: 'Ultrassonografia de Abdome Total',
        mesAno: mesAtual,
        cotaMensal: 15,
        cotaUtilizada: 14,
      },
      {
        unidadeSolicitanteId: usfFlores.id,
        tipo: 'CONSULTA' as const,
        especialidadeOuExame: 'Cardiologia',
        mesAno: mesAtual,
        cotaMensal: 10,
        cotaUtilizada: 2,
      },
      {
        unidadeSolicitanteId: usfFlores.id,
        tipo: 'EXAME' as const,
        especialidadeOuExame: 'Raio-X de Tórax',
        mesAno: mesAtual,
        cotaMensal: 25,
        cotaUtilizada: 8,
      },
    ]

    for (const c of cotasData) {
      await CotaAgendamento.updateOrCreate(
        {
          unidadeSolicitanteId: c.unidadeSolicitanteId,
          tipo: c.tipo,
          especialidadeOuExame: c.especialidadeOuExame,
          mesAno: c.mesAno,
        },
        c
      )
    }

    // 2. Agendamentos Pré-existentes
    if (cidadao1) {
      const dataAmanha = DateTime.now().plus({ days: 1 }).set({ hour: 9, minute: 0, second: 0 })
      const dataDepois = DateTime.now().plus({ days: 2 }).set({ hour: 14, minute: 30, second: 0 })

      await Agendamento.updateOrCreate(
        { protocolo: 'REG-20261027-1001' },
        {
          protocolo: 'REG-20261027-1001',
          cidadaoId: cidadao1.id,
          unidadeSolicitanteId: ubsCentral.id,
          unidadeExecutanteId: upaZonaSul ? upaZonaSul.id : ubsCentral.id,
          profissionalId: medico1 ? medico1.id : null,
          tipo: 'CONSULTA',
          especialidadeOuExame: 'Cardiologia',
          dataHora: dataAmanha,
          status: 'AGENDADO',
          prioridade: 'NORMAL',
          observacoes: 'Paciente com histórico de hipertensão essencial e arritmia.',
        }
      )

      await Agendamento.updateOrCreate(
        { protocolo: 'REG-20261027-1002' },
        {
          protocolo: 'REG-20261027-1002',
          cidadaoId: cidadao1.id,
          unidadeSolicitanteId: ubsCentral.id,
          unidadeExecutanteId: ubsCentral.id,
          profissionalId: null,
          tipo: 'EXAME',
          especialidadeOuExame: 'Ultrassonografia de Abdome Total',
          dataHora: dataDepois,
          status: 'CONFIRMADO',
          prioridade: 'URGENTE',
          observacoes: 'Jejum obrigatório de 8 horas antes do procedimento.',
        }
      )
    }
  }
}
