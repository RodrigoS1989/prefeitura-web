import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Atendimento from '#models/atendimento'
import SinalVital from '#models/sinal_vital'
import UnidadeSaude from '#models/unidade_saude'
import Profissional from '#models/profissional'
import Cidadao from '#models/cidadao'
import {
  createAtendimentoValidator,
  triagemValidator,
  cancelarAtendimentoValidator,
} from '#validators/atendimento_validator'

export default class AtendimentosController {
  /**
   * Painel Geral da Recepção, Fila Manchester e Atendimentos do Dia (UPM067 / UPM764)
   */
  async index({ request, inertia }: HttpContext) {
    const search = request.input('search', '')?.trim()
    const unidadeId = request.input('unidadeId', '')
    const status = request.input('status', '')
    const prioridade = request.input('prioridade', '')
    const tab = request.input('tab', 'todos')

    const unidades = await UnidadeSaude.query().where('ativa', true).orderBy('nome_fantasia', 'asc')
    const activeUnidadeId = unidadeId ? Number(unidadeId) : unidades[0]?.id || 1

    const query = Atendimento.query()
      .preload('cidadao')
      .preload('sinaisVitais')
      .preload('profissional')
      .preload('unidadeSaude')
      .where('unidade_saude_id', activeUnidadeId)

    if (search) {
      query.where((q) => {
        q.whereILike('numero_atendimento', `%${search}%`)
          .orWhereILike('senha_painel', `%${search}%`)
          .orWhereHas('cidadao', (cQ) => {
            cQ.whereILike('nome_completo', `%${search}%`)
              .orWhereILike('cpf', `%${search}%`)
              .orWhereILike('cns', `%${search}%`)
          })
      })
    }

    if (status) {
      query.where('status', status)
    }

    if (prioridade) {
      query.where('prioridade_manchester', prioridade)
    }

    // Filtros rápidos de abas do fluxo assistencial
    if (tab === 'triagem') {
      query.whereIn('status', ['AGUARDANDO_TRIAGEM', 'EM_TRIAGEM'])
    } else if (tab === 'consultorio') {
      query.whereIn('status', ['AGUARDANDO_ATENDIMENTO', 'EM_ATENDIMENTO'])
    } else if (tab === 'observacao') {
      query.where('status', 'EM_OBSERVACAO')
    } else if (tab === 'finalizados') {
      query.whereIn('status', ['FINALIZADO', 'CANCELADO'])
    }

    // Ordenação clínica de prioridade (Manchester e Tempo)
    query
      .orderByRaw(`
        CASE prioridade_manchester
          WHEN 'VERMELHO' THEN 1
          WHEN 'LARANJA' THEN 2
          WHEN 'AMARELO' THEN 3
          WHEN 'VERDE' THEN 4
          WHEN 'AZUL' THEN 5
          ELSE 6
        END ASC
      `)
      .orderBy('data_hora_chegada', 'asc')

    const atendimentos = await query

    // Estatísticas em tempo real para a Unidade
    const allAtendimentosHoje = await Atendimento.query().where('unidade_saude_id', activeUnidadeId)

    const stats = {
      totalHoje: allAtendimentosHoje.length,
      aguardandoTriagem: allAtendimentosHoje.filter((a) => a.status === 'AGUARDANDO_TRIAGEM').length,
      aguardandoAtendimento: allAtendimentosHoje.filter((a) => a.status === 'AGUARDANDO_ATENDIMENTO').length,
      emAtendimento: allAtendimentosHoje.filter((a) => a.status === 'EM_ATENDIMENTO').length,
      finalizados: allAtendimentosHoje.filter((a) => a.status === 'FINALIZADO').length,
      manchester: {
        vermelho: allAtendimentosHoje.filter((a) => a.prioridadeManchester === 'VERMELHO').length,
        laranja: allAtendimentosHoje.filter((a) => a.prioridadeManchester === 'LARANJA').length,
        amarelo: allAtendimentosHoje.filter((a) => a.prioridadeManchester === 'AMARELO').length,
        verde: allAtendimentosHoje.filter((a) => a.prioridadeManchester === 'VERDE').length,
        azul: allAtendimentosHoje.filter((a) => a.prioridadeManchester === 'AZUL').length,
      },
    }

    // Profissionais de plantão para vinculação no consultório
    const profissionais = await Profissional.query()
      .where('status', 'ativo')
      .preload('conselho')
      .preload('cbo')
      .orderBy('nome', 'asc')

    // Cidadãos para seleção rápida na abertura de atendimento (Recepção)
    const cidadaosIniciais = await Cidadao.query()
      .where('situacao_cadastral', 'ativo')
      .orderBy('nome_completo', 'asc')
      .limit(15)

    return inertia.render('atendimentos/index', {
      atendimentos: atendimentos.map((a) => a.toJSON()),
      unidades: unidades.map((u) => u.toJSON()),
      profissionais: profissionais.map((p) => p.toJSON()),
      cidadaos: cidadaosIniciais.map((c) => c.toJSON()),
      activeUnidadeId,
      stats,
      filters: { search, unidadeId: String(activeUnidadeId), status, prioridade, tab },
    })
  }

  /**
   * API para busca dinâmica de cidadãos por Nome, CPF ou CNS (Autocompletar na Recepção)
   */
  async apiSearchCidadaos({ request, response }: HttpContext) {
    const query = request.input('q', '')?.trim()
    if (!query || query.length < 2) {
      return response.json([])
    }

    const cidadaos = await Cidadao.query()
      .where('situacao_cadastral', 'ativo')
      .where((q) => {
        q.whereILike('nome_completo', `%${query}%`)
          .orWhereILike('cpf', `%${query}%`)
          .orWhereILike('cns', `%${query}%`)
      })
      .orderBy('nome_completo', 'asc')
      .limit(10)

    return response.json(cidadaos.map((c) => c.toJSON()))
  }

  /**
   * Recepção & Abertura de FAA (Ficha de Atendimento Ambulatorial)
   */
  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createAtendimentoValidator)

    const totalHoje = await Atendimento.query().count('* as total')
    const proximoNum = Number(totalHoje[0].$extras.total || 0) + 1
    const anoAtual = DateTime.now().year

    const prefix = payload.tipoAtendimento === 'URGENCIA_EMERGENCIA' ? 'URG' : 'ESP'
    const senha = `${prefix}-${proximoNum.toString().padStart(2, '0')}`

    const atendimento = await Atendimento.create({
      numeroAtendimento: `FAA-${anoAtual}-${proximoNum.toString().padStart(6, '0')}`,
      codigoBarras: `789${anoAtual}${proximoNum.toString().padStart(6, '0')}`,
      senhaPainel: senha,
      cidadaoId: payload.cidadaoId,
      unidadeSaudeId: payload.unidadeSaudeId,
      tipoAtendimento: payload.tipoAtendimento,
      caraterAtendimento: '01',
      status: 'AGUARDANDO_TRIAGEM',
      prioridadeManchester: payload.tipoAtendimento === 'URGENCIA_EMERGENCIA' ? 'LARANJA' : 'VERDE',
      tempoAlvoMinutos: payload.tipoAtendimento === 'URGENCIA_EMERGENCIA' ? 10 : 120,
      queixaPrincipal: payload.queixaPrincipal || null,
      sigiloso: payload.sigiloso || false,
      dataHoraChegada: DateTime.now(),
    })

    session.flash('success', `Atendimento ${atendimento.numeroAtendimento} aberto com sucesso! Senha: ${senha}`)
    return response.redirect().back()
  }

  /**
   * Registro de Triagem com Classificação de Risco Manchester (UPM976)
   */
  async triagem({ params, request, response, session }: HttpContext) {
    const atendimento = await Atendimento.findOrFail(params.id)
    const payload = await request.validateUsing(triagemValidator)

    // Cálculo do IMC se peso e altura estiverem preenchidos
    let imcCalculado: number | null = null
    if (payload.peso && payload.altura && payload.altura > 0) {
      imcCalculado = Number((payload.peso / (payload.altura * payload.altura)).toFixed(1))
    }

    // Grava ou atualiza os Sinais Vitais
    let sinais = await SinalVital.findBy('atendimentoId', atendimento.id)
    if (!sinais) {
      sinais = new SinalVital()
      sinais.atendimentoId = atendimento.id
    }

    sinais.paSistolica = payload.paSistolica || null
    sinais.paDiastolica = payload.paDiastolica || null
    sinais.frequenciaCardiaca = payload.frequenciaCardiaca || null
    sinais.frequenciaRespiratoria = payload.frequenciaRespiratoria || null
    sinais.temperatura = payload.temperatura || null
    sinais.saturacaoO2 = payload.saturacaoO2 || null
    sinais.peso = payload.peso || null
    sinais.altura = payload.altura || null
    sinais.imc = imcCalculado
    sinais.glicemiaCapilar = payload.glicemiaCapilar || null
    sinais.escalaDor = payload.escalaDor || null
    sinais.observacoesTriagem = payload.observacoesTriagem || null
    await sinais.save()

    // Tempos alvo do Protocolo de Manchester
    const temposAlvo = {
      VERMELHO: 0,
      LARANJA: 10,
      AMARELO: 60,
      VERDE: 120,
      AZUL: 240,
    }

    const prefixes = {
      VERMELHO: 'VERM',
      LARANJA: 'LAR',
      AMARELO: 'AMAR',
      VERDE: 'VER',
      AZUL: 'AZU',
    }

    // Atualiza atendimento com a cor Manchester e avança para a fila médica
    atendimento.prioridadeManchester = payload.prioridadeManchester
    atendimento.discriminadorManchester = payload.discriminadorManchester
    atendimento.tempoAlvoMinutos = temposAlvo[payload.prioridadeManchester] || 120
    atendimento.dataHoraTriagem = DateTime.now()
    atendimento.status = 'AGUARDANDO_ATENDIMENTO'

    // Atualiza prefixo da senha com a cor Manchester
    const numPart = atendimento.senhaPainel.split('-')[1] || '01'
    atendimento.senhaPainel = `${prefixes[payload.prioridadeManchester]}-${numPart}`

    await atendimento.save()

    session.flash('success', `Triagem concluída: Classificação ${payload.prioridadeManchester} (Alvo: ${atendimento.tempoAlvoMinutos} min)`)
    return response.redirect().back()
  }

  /**
   * Chamada do paciente para o consultório / Início do Atendimento
   */
  async chamar({ params, request, response, session }: HttpContext) {
    const atendimento = await Atendimento.findOrFail(params.id)
    const profissionalId = request.input('profissionalId')

    atendimento.status = 'EM_ATENDIMENTO'
    atendimento.dataHoraInicioAtendimento = DateTime.now()
    if (profissionalId) {
      atendimento.profissionalId = Number(profissionalId)
    }

    await atendimento.save()

    session.flash('success', `Paciente ${atendimento.senhaPainel} chamado para o consultório.`)
    return response.redirect().back()
  }

  /**
   * Cancelamento com Justificativa Auditada (UPM177)
   */
  async cancelar({ params, request, response, session }: HttpContext) {
    const atendimento = await Atendimento.findOrFail(params.id)
    const payload = await request.validateUsing(cancelarAtendimentoValidator)

    atendimento.status = 'CANCELADO'
    atendimento.motivoCancelamento = payload.motivoCancelamento
    atendimento.dataHoraFinalizacao = DateTime.now()
    await atendimento.save()

    session.flash('success', `Atendimento ${atendimento.numeroAtendimento} cancelado.`)
    return response.redirect().back()
  }

  /**
   * Finalização do atendimento
   */
  async finalizar({ params, response, session }: HttpContext) {
    const atendimento = await Atendimento.findOrFail(params.id)
    atendimento.status = 'FINALIZADO'
    atendimento.dataHoraFinalizacao = DateTime.now()
    await atendimento.save()

    session.flash('success', `Atendimento ${atendimento.numeroAtendimento} finalizado com sucesso!`)
    return response.redirect().back()
  }
}
