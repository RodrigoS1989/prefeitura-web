import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import Cidadao from '#models/cidadao'
import UnidadeSaude from '#models/unidade_saude'
import Profissional from '#models/profissional'
import CotaAgendamento from '#models/cota_agendamento'
import Agendamento from '#models/agendamento'

test.group('Etapa 06: Agendamento & Regulação de Consultas/Exames (TFD, Cotas e Redis Locks)', (group) => {
  let cidadao: Cidadao
  let ubsCentral: UnidadeSaude
  let upaZonaSul: UnidadeSaude
  let medico: Profissional

  group.setup(async () => {
    cidadao = await Cidadao.firstOrFail()
    const unidades = await UnidadeSaude.query().limit(2)
    ubsCentral = unidades[0]
    upaZonaSul = unidades[1] || unidades[0]
    medico = await Profissional.firstOrFail()
  })

  test('deve renderizar a página de agendamentos com listagem e mapa de cotas', async ({ client, assert }) => {
    const response = await client.get('/agendamentos')
    response.assertStatus(200)

    const agendamentosCount = await Agendamento.query().count('* as total')
    assert.isNotNull(agendamentosCount)
  })

  test('deve realizar um agendamento com protocolo único e incrementar a cota municipal', async ({ client, assert }) => {
    const uniqueMinute = Math.floor(Math.random() * 50) + 5
    const dataAgendamento = DateTime.now().plus({ days: 12 }).set({ hour: 10, minute: uniqueMinute, second: 0, millisecond: 0 })
    const mesAgendamento = dataAgendamento.toFormat('yyyy-MM')

    // Garante cota de teste no mês do agendamento
    const cota = await CotaAgendamento.updateOrCreate(
      {
        unidadeSolicitanteId: ubsCentral.id,
        tipo: 'CONSULTA',
        especialidadeOuExame: 'Oftalmologia',
        mesAno: mesAgendamento,
      },
      {
        cotaMensal: 5,
        cotaUtilizada: 1,
      }
    )

    const cotaAntes = cota.cotaUtilizada

    const response = await client
      .post('/agendamentos')
      .form({
        cidadaoId: cidadao.id,
        unidadeSolicitanteId: ubsCentral.id,
        unidadeExecutanteId: upaZonaSul.id,
        profissionalId: medico.id,
        tipo: 'CONSULTA',
        especialidadeOuExame: 'Oftalmologia',
        dataHora: dataAgendamento.toISO(),
        prioridade: 'NORMAL',
        observacoes: 'Teste automatizado de agendamento regulado',
      })

    assert.include([200, 302], response.status())

    // Verifica que o agendamento foi salvo
    const agendamento = await Agendamento.query()
      .where('cidadaoId', cidadao.id)
      .where('especialidadeOuExame', 'Oftalmologia')
      .orderBy('id', 'desc')
      .firstOrFail()

    assert.include(agendamento.protocolo, 'REG-')
    assert.equal(agendamento.status, 'AGENDADO')

    // Verifica incremento atômico da cota
    await cota.refresh()
    assert.equal(cota.cotaUtilizada, cotaAntes + 1)
  })

  test('deve bloquear agendamento duplicado no mesmo horário (proteção de concorrência)', async ({ client, assert }) => {
    const uniqueId = Date.now()
    const uniqueMinute = Math.floor(Math.random() * 50) + 5
    const dataHoraSlot = DateTime.now().plus({ days: 20 }).set({ hour: 11, minute: uniqueMinute, second: 0, millisecond: 0 })
    const minutoSlot = dataHoraSlot.toFormat('yyyy-MM-dd HH:mm')

    await Agendamento.create({
      protocolo: `REG-TEST-DUP-${uniqueId}`,
      cidadaoId: cidadao.id,
      unidadeSolicitanteId: ubsCentral.id,
      unidadeExecutanteId: ubsCentral.id,
      profissionalId: medico.id,
      tipo: 'CONSULTA',
      especialidadeOuExame: 'Cardiologia',
      dataHora: dataHoraSlot,
      status: 'AGENDADO',
      prioridade: 'NORMAL',
    })
    // Tenta agendar no mesmo slot exato
    const response = await client
      .post('/agendamentos')
      .form({
        cidadaoId: cidadao.id,
        unidadeSolicitanteId: ubsCentral.id,
        unidadeExecutanteId: ubsCentral.id,
        profissionalId: medico.id,
        tipo: 'CONSULTA',
        especialidadeOuExame: 'Cardiologia',
        dataHora: dataHoraSlot.toISO(),
        prioridade: 'NORMAL',
      })

    // O sistema redireciona de volta com erro
    assert.include([200, 302], response.status())
    const totalNoSlot = await Agendamento.query()
      .where('unidade_executante_id', ubsCentral.id)
      .where('data_hora', 'like', `${minutoSlot}%`)
      .where('profissional_id', medico.id)
      .whereNot('status', 'CANCELADO')

    assert.equal(totalNoSlot.length, 1)
  })

  test('deve cancelar um agendamento e estornar a cota municipal utilizada', async ({ client, assert }) => {
    const uniqueId = Date.now()
    const dataHora = DateTime.now().plus({ days: 22 }).set({ hour: 8, minute: 30, second: 0, millisecond: 0 })
    const mesAgendamento = dataHora.toFormat('yyyy-MM')

    // Cria cota com 3 utilizadas no mês do agendamento
    const cota = await CotaAgendamento.updateOrCreate(
      {
        unidadeSolicitanteId: ubsCentral.id,
        tipo: 'EXAME',
        especialidadeOuExame: 'Eletrocardiograma (ECG)',
        mesAno: mesAgendamento,
      },
      {
        cotaMensal: 10,
        cotaUtilizada: 3,
      }
    )

    const agendamento = await Agendamento.create({
      protocolo: `REG-TEST-CANC-${uniqueId}`,
      cidadaoId: cidadao.id,
      unidadeSolicitanteId: ubsCentral.id,
      unidadeExecutanteId: ubsCentral.id,
      profissionalId: null,
      tipo: 'EXAME',
      especialidadeOuExame: 'Eletrocardiograma (ECG)',
      dataHora: dataHora,
      status: 'AGENDADO',
      prioridade: 'NORMAL',
    })

    const response = await client
      .post(`/agendamentos/${agendamento.id}/cancelar`)
      .form({
        motivo: 'Paciente solicitou remarcação por motivos de viagem',
      })

    assert.include([200, 302], response.status())

    await agendamento.refresh()
    assert.equal(agendamento.status, 'CANCELADO')
    assert.include(agendamento.motivoCancelamento!, 'viagem')

    // Confere que cota foi estornada
    await cota.refresh()
    assert.equal(cota.cotaUtilizada, 2)
  })
})
