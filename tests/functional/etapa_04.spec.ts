import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import Atendimento from '#models/atendimento'
import Cidadao from '#models/cidadao'
import UnidadeSaude from '#models/unidade_saude'
import Profissional from '#models/profissional'
import EvolucaoClinica from '#models/evolucao_clinica'
import PrescricaoMedicamento from '#models/prescricao_medicamento'
import SolicitacaoExame from '#models/solicitacao_exame'
import AtestadoMedico from '#models/atestado_medico'

test.group('Etapa 04: Recepção, Triagem Manchester e Atendimento Clínico / PEP', () => {
  test('deve renderizar a tela de atendimentos com a fila da unidade', async ({ client, assert }) => {
    const response = await client.get('/atendimentos')
    response.assertStatus(200)

    const atendimentosCount = await Atendimento.query().count('* as total')
    assert.isAbove(Number(atendimentosCount[0].$extras.total), 0)
  })

  test('deve abrir um novo atendimento (FAA) na recepção com emissão de senha', async ({ client, assert }) => {
    const cidadao = await Cidadao.firstOrFail()
    const unidade = await UnidadeSaude.firstOrFail()

    const response = await client.post('/atendimentos').form({
      cidadaoId: cidadao.id,
      unidadeSaudeId: unidade.id,
      tipoAtendimento: 'DEMANDA_ESPONTANEA',
      queixaPrincipal: 'Cefaleia e febre moderada há 2 dias',
      sigiloso: false,
    })

    assert.include([200, 302], response.status())

    const atendimento = await Atendimento.query()
      .where('cidadao_id', cidadao.id)
      .orderBy('id', 'desc')
      .first()

    assert.isNotNull(atendimento)
    assert.equal(atendimento?.status, 'AGUARDANDO_TRIAGEM')
    assert.isTrue(atendimento?.numeroAtendimento.startsWith('FAA-'))
  })

  test('deve registrar triagem clínica Manchester com sinais vitais e cálculo de IMC', async ({ client, assert }) => {
    const atendimento = await Atendimento.query()
      .where('status', 'AGUARDANDO_TRIAGEM')
      .firstOrFail()

    const response = await client.post(`/atendimentos/${atendimento.id}/triagem`).form({
      prioridadeManchester: 'AMARELO',
      discriminadorManchester: 'Febre persistente com dor moderada',
      paSistolica: 130,
      paDiastolica: 85,
      frequenciaCardiaca: 82,
      frequenciaRespiratoria: 18,
      temperatura: 38.2,
      saturacaoO2: 97,
      peso: 72.5,
      altura: 1.75,
      glicemiaCapilar: 105,
      escalaDor: 6,
      observacoesTriagem: 'Paciente lúcido, febril ao toque, hidratado.',
    })

    assert.include([200, 302], response.status())

    await atendimento.refresh()
    assert.equal(atendimento.prioridadeManchester, 'AMARELO')
    assert.equal(atendimento.status, 'AGUARDANDO_ATENDIMENTO')
    assert.equal(atendimento.tempoAlvoMinutos, 60)

    await atendimento.load('sinaisVitais')
    assert.isNotNull(atendimento.sinaisVitais)
    assert.equal(atendimento.sinaisVitais?.paSistolica, 130)
    assert.isAbove(Number(atendimento.sinaisVitais?.imc), 20)
  })

  test('deve chamar o paciente para o consultório médico', async ({ client, assert }) => {
    const atendimento = await Atendimento.query()
      .where('status', 'AGUARDANDO_ATENDIMENTO')
      .firstOrFail()
    const profissional = await Profissional.firstOrFail()

    const response = await client.post(`/atendimentos/${atendimento.id}/chamar`).form({
      profissionalId: profissional.id,
    })

    assert.include([200, 302], response.status())

    await atendimento.refresh()
    assert.equal(atendimento.status, 'EM_ATENDIMENTO')
    assert.equal(atendimento.profissionalId, profissional.id)
  })

  test('deve retornar dados completos do prontuário eletrônico via API PEP', async ({ client, assert }) => {
    const atendimento = await Atendimento.firstOrFail()

    const response = await client.get(`/api/pep/${atendimento.id}`)
    response.assertStatus(200)

    const json = response.body()
    assert.isObject(json.atendimento)
    assert.equal(json.atendimento.id, atendimento.id)
    assert.isArray(json.historicoAnterior)
  })

  test('deve registrar evolução clínica SOAP com CID-10 no prontuário', async ({ client, assert }) => {
    const atendimento = await Atendimento.query()
      .where('status', 'EM_ATENDIMENTO')
      .firstOrFail()
    const profissional = await Profissional.firstOrFail()

    const response = await client
      .post(`/atendimentos/${atendimento.id}/pep/evolucao`)
      .header('Accept', 'application/json')
      .json({
        profissionalId: profissional.id,
        subjetivo: 'Paciente refere melhora após medicação prévia. Persiste coriza hialina.',
        objetivo: 'Oroscopia sem exsudato. Ausculta pulmonar limpa com murmúrio vesicular universal.',
        avaliacao: 'Quadro clínico compatível com Rinofaringite Aguda Viral.',
        planoConduta: 'Sintomáticos, hidratação oral vigorosa e repouso.',
        cid10Codigo: 'J00',
        cid10Descricao: 'Nasofaringite aguda (resfriado comum)',
      })

    response.assertStatus(200)

    const evolucao = await EvolucaoClinica.findBy('atendimentoId', atendimento.id)
    assert.isNotNull(evolucao)
    assert.equal(evolucao?.atendimentoId, atendimento.id)
    assert.isTrue(Boolean(evolucao?.assinadoDigitalmente))
  })

  test('deve prescrever medicamento no prontuário eletrônico', async ({ client, assert }) => {
    const atendimento = await Atendimento.firstOrFail()

    const response = await client
      .post(`/atendimentos/${atendimento.id}/pep/prescricao`)
      .header('Accept', 'application/json')
      .json({
        nomeMedicamento: 'Paracetamol 500mg',
        posologia: 'Tomar 1 comprimido de 6 em 6 horas se dor ou febre',
        quantidadePrescrita: 1,
        viaAdministracao: 'ORAL',
        usoContinuo: false,
        orientacoes: 'Não ultrapassar 4g ao dia.',
      })

    response.assertStatus(200)

    const prescricoes = await PrescricaoMedicamento.query()
      .where('atendimentoId', atendimento.id)
      .where('nomeMedicamento', 'Paracetamol 500mg')
    assert.isAbove(prescricoes.length, 0)
  })

  test('deve solicitar exame complementar', async ({ client, assert }) => {
    const atendimento = await Atendimento.firstOrFail()

    const response = await client
      .post(`/atendimentos/${atendimento.id}/pep/exame`)
      .header('Accept', 'application/json')
      .json({
        descricaoExame: 'Hemograma Completo',
        tipoExame: 'LABORATORIAL',
        justificativaClinica: 'Controle de infecção de vias aéreas',
        urgente: false,
      })

    response.assertStatus(200)

    const exames = await SolicitacaoExame.query()
      .where('atendimentoId', atendimento.id)
      .where('descricaoExame', 'Hemograma Completo')
    assert.isAbove(exames.length, 0)
  })

  test('deve emitir atestado médico auditado com código de autenticidade', async ({ client, assert }) => {
    const atendimento = await Atendimento.firstOrFail()

    const response = await client
      .post(`/atendimentos/${atendimento.id}/pep/atestado`)
      .header('Accept', 'application/json')
      .json({
        tipoAtestado: 'AFASTAMENTO',
        diasAfastamento: 2,
        cid10Codigo: 'J00',
        autorizaDivulgacaoCid: true,
        observacoes: 'Necessidade de isolamento domiciliar e repouso.',
      })

    response.assertStatus(200)

    const atestados = await AtestadoMedico.query().where('atendimentoId', atendimento.id)
    assert.isAbove(atestados.length, 0)
    assert.isNotNull(atestados[0].codigoAutenticidade)
  })

  test('deve finalizar o atendimento clínico', async ({ client, assert }) => {
    const atendimento = await Atendimento.query()
      .where('status', 'EM_ATENDIMENTO')
      .firstOrFail()

    const response = await client.post(`/atendimentos/${atendimento.id}/finalizar`)

    assert.include([200, 302], response.status())

    await atendimento.refresh()
    assert.equal(atendimento.status, 'FINALIZADO')
    assert.isNotNull(atendimento.dataHoraFinalizacao)
  })

  test('deve cancelar atendimento com justificativa auditada', async ({ client, assert }) => {
    const cidadao = await Cidadao.firstOrFail()
    const unidade = await UnidadeSaude.firstOrFail()

    const novoAtendimento = await Atendimento.create({
      numeroAtendimento: `FAA-TEST-${Date.now().toString().slice(-6)}`,
      codigoBarras: `789${Date.now().toString().slice(-6)}`,
      senhaPainel: 'TST-99',
      cidadaoId: cidadao.id,
      unidadeSaudeId: unidade.id,
      tipoAtendimento: 'DEMANDA_ESPONTANEA',
      caraterAtendimento: '01',
      status: 'AGUARDANDO_TRIAGEM',
      prioridadeManchester: 'VERDE',
      tempoAlvoMinutos: 120,
      dataHoraChegada: DateTime.now(),
    })

    const response = await client.post(`/atendimentos/${novoAtendimento.id}/cancelar`).form({
      motivoCancelamento: 'Desistência voluntária do paciente devido a compromisso pessoal urgente',
    })

    assert.include([200, 302], response.status())

    await novoAtendimento.refresh()
    assert.equal(novoAtendimento.status, 'CANCELADO')
    assert.isNotNull(novoAtendimento.motivoCancelamento)
  })
})
