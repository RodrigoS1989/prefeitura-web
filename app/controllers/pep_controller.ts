import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import Atendimento from '#models/atendimento'
import EvolucaoClinica from '#models/evolucao_clinica'
import DiagnosticoAtendimento from '#models/diagnostico_atendimento'
import PrescricaoMedicamento from '#models/prescricao_medicamento'
import SolicitacaoExame from '#models/solicitacao_exame'
import AtestadoMedico from '#models/atestado_medico'
import {
  evolucaoSoapValidator,
  prescricaoValidator,
  solicitacaoExameValidator,
  atestadoValidator,
} from '#validators/pep_validator'

export default class PepController {
  /**
   * Retorna os dados clínicos completos do atendimento para o Prontuário Eletrônico (PEP)
   */
  async show({ params, response }: HttpContext) {
    const atendimento = await Atendimento.query()
      .where('id', params.id)
      .preload('cidadao')
      .preload('sinaisVitais')
      .preload('profissional')
      .preload('unidadeSaude')
      .preload('evolucao')
      .preload('diagnosticos')
      .preload('prescricoes')
      .preload('exames')
      .preload('atestados')
      .firstOrFail()

    // Histórico prévio de consultas do paciente na rede
    const historicoAnterior = await Atendimento.query()
      .where('cidadao_id', atendimento.cidadaoId)
      .whereNot('id', atendimento.id)
      .where('status', 'FINALIZADO')
      .preload('evolucao')
      .preload('diagnosticos')
      .preload('prescricoes')
      .preload('profissional')
      .preload('unidadeSaude')
      .orderBy('data_hora_chegada', 'desc')
      .limit(5)

    return response.json({
      atendimento: atendimento.toJSON(),
      historicoAnterior: historicoAnterior.map((h) => h.toJSON()),
    })
  }

  /**
   * Registro da Anamnese e Evolução Médica SOAP (UPM045)
   */
  async storeEvolucao({ params, request, response, session }: HttpContext) {
    const atendimento = await Atendimento.findOrFail(params.id)
    const payload = await request.validateUsing(evolucaoSoapValidator)

    const profId = payload.profissionalId || atendimento.profissionalId || 1

    let evolucao = await EvolucaoClinica.findBy('atendimentoId', atendimento.id)
    if (!evolucao) {
      evolucao = new EvolucaoClinica()
      evolucao.atendimentoId = atendimento.id
    }

    evolucao.profissionalId = profId
    evolucao.subjetivo = payload.subjetivo
    evolucao.objetivo = payload.objetivo
    evolucao.avaliacao = payload.avaliacao
    evolucao.planoConduta = payload.planoConduta
    evolucao.assinadoDigitalmente = true
    evolucao.dataHoraAssinatura = DateTime.now()
    await evolucao.save()

    // Registra diagnóstico principal se informado
    if (payload.cid10Codigo && payload.cid10Descricao) {
      const diagExistente = await DiagnosticoAtendimento.query()
        .where('atendimentoId', atendimento.id)
        .where('tipo', 'PRINCIPAL')
        .first()

      if (diagExistente) {
        diagExistente.cid10Codigo = payload.cid10Codigo
        diagExistente.cid10Descricao = payload.cid10Descricao
        await diagExistente.save()
      } else {
        await DiagnosticoAtendimento.create({
          atendimentoId: atendimento.id,
          cid10Codigo: payload.cid10Codigo,
          cid10Descricao: payload.cid10Descricao,
          tipo: 'PRINCIPAL',
        })
      }
    }

    if (request.header('accept')?.includes('application/json') && !request.header('x-inertia')) {
      return response.json({ success: true, message: 'Evolução clínica SOAP salva com sucesso!' })
    }

    session.flash('success', 'Evolução clínica SOAP salva com sucesso!')
    return response.redirect().back()
  }

  /**
   * Prescrição de Medicamentos no Prontuário
   */
  async storePrescricao({ params, request, response, session }: HttpContext) {
    const atendimento = await Atendimento.findOrFail(params.id)
    const payload = await request.validateUsing(prescricaoValidator)

    const codigoReceita = `REC-${atendimento.id}-${DateTime.now().toMillis().toString().slice(-6)}`

    const prescricao = await PrescricaoMedicamento.create({
      atendimentoId: atendimento.id,
      nomeMedicamento: payload.nomeMedicamento,
      posologia: payload.posologia,
      quantidadePrescrita: payload.quantidadePrescrita,
      viaAdministracao: payload.viaAdministracao || 'ORAL',
      usoContinuo: payload.usoContinuo || false,
      orientacoes: payload.orientacoes || null,
      codigoAutenticidadeReceita: codigoReceita,
    })

    if (request.header('accept')?.includes('application/json') && !request.header('x-inertia')) {
      return response.json({
        success: true,
        message: `Item ${payload.nomeMedicamento} adicionado à prescrição!`,
        prescricao: prescricao.toJSON(),
      })
    }

    session.flash('success', `Item ${payload.nomeMedicamento} adicionado à prescrição!`)
    return response.redirect().back()
  }

  /**
   * Solicitação de Exames Complementares (UPM341)
   */
  async storeExame({ params, request, response, session }: HttpContext) {
    const atendimento = await Atendimento.findOrFail(params.id)
    const payload = await request.validateUsing(solicitacaoExameValidator)

    const exame = await SolicitacaoExame.create({
      atendimentoId: atendimento.id,
      descricaoExame: payload.descricaoExame,
      tipoExame: payload.tipoExame || 'LABORATORIAL',
      justificativaClinica: payload.justificativaClinica || null,
      urgente: payload.urgente || false,
      status: 'SOLICITADO',
    })

    if (request.header('accept')?.includes('application/json') && !request.header('x-inertia')) {
      return response.json({
        success: true,
        message: `Pedido de exame (${payload.descricaoExame}) registrado!`,
        exame: exame.toJSON(),
      })
    }

    session.flash('success', `Pedido de exame (${payload.descricaoExame}) registrado!`)
    return response.redirect().back()
  }

  /**
   * Emissão de Atestado Médico (PM1044 / UPM876)
   */
  async storeAtestado({ params, request, response, session }: HttpContext) {
    const atendimento = await Atendimento.findOrFail(params.id)
    const payload = await request.validateUsing(atestadoValidator)

    const codigoAutenticidade = crypto.randomUUID()

    const atestado = await AtestadoMedico.create({
      atendimentoId: atendimento.id,
      profissionalId: atendimento.profissionalId || 1,
      cidadaoId: atendimento.cidadaoId,
      tipoAtestado: (payload.tipoAtestado as any) || 'AFASTAMENTO',
      diasAfastamento: payload.diasAfastamento,
      dataInicioAfastamento: payload.dataInicioAfastamento
        ? DateTime.fromISO(payload.dataInicioAfastamento)
        : DateTime.now(),
      cid10Codigo: payload.cid10Codigo || null,
      autorizaDivulgacaoCid: payload.autorizaDivulgacaoCid !== false,
      observacoes: payload.observacoes || null,
      codigoAutenticidade,
    })

    if (request.header('accept')?.includes('application/json') && !request.header('x-inertia')) {
      return response.json({
        success: true,
        message: `Atestado emitido com sucesso! Código: ${codigoAutenticidade.slice(0, 8).toUpperCase()}`,
        atestado: atestado.toJSON(),
      })
    }

    session.flash('success', `Atestado emitido com sucesso! Código: ${codigoAutenticidade.slice(0, 8).toUpperCase()}`)
    return response.redirect().back()
  }
}
