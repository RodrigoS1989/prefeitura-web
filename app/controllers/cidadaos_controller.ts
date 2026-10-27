import type { HttpContext } from '@adonisjs/core/http'
import Cidadao from '#models/cidadao'
import { createCidadaoValidator, updateCidadaoValidator } from '#validators/cidadao_validator'
import { CacheService } from '#services/cache_service'
import { DateTime } from 'luxon'

export default class CidadaosController {
  /**
   * Listagem paginada de cidadãos com busca e filtros
   */
  async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')?.trim()
    const situacao = request.input('situacao', '')
    const unidade = request.input('unidade', '')

    const cacheKey = `cidadaos:p${page}:l${limit}:s${search}:st${situacao}:u${unidade}`

    const cidadaos = await CacheService.getOrSet(cacheKey, 30, async () => {
      const query = Cidadao.query().orderBy('nome_completo', 'asc')

      if (search) {
        query.where((q) => {
          q.whereILike('nome_completo', `%${search}%`)
            .orWhereILike('cpf', `%${search}%`)
            .orWhereILike('cns', `%${search}%`)
            .orWhereILike('nis', `%${search}%`)
            .orWhereILike('email', `%${search}%`)
        })
      }

      if (situacao) {
        query.where('situacao_cadastral', situacao)
      }

      if (unidade) {
        query.where('unidade_saude', unidade)
      }

      const paginated = await query.paginate(page, limit)
      return paginated.toJSON()
    })

    return inertia.render('cidadaos/index', {
      cidadaos,
      filters: { search, situacao, unidade },
    })
  }

  /**
   * Formulário de novo cadastro
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('cidadaos/form', {
      cidadao: null,
    })
  }

  /**
   * Grava novo cidadão
   */
  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createCidadaoValidator)

    const cidadao = new Cidadao()
    cidadao.nomeCompleto = payload.nomeCompleto
    cidadao.nomeSocial = payload.nomeSocial || null
    cidadao.cpf = payload.cpf || null
    cidadao.cns = payload.cns || null
    cidadao.nis = payload.nis || null
    cidadao.rg = payload.rg || null
    cidadao.rgOrgaoEmissor = payload.rgOrgaoEmissor || null
    cidadao.nomeMae = payload.nomeMae || null
    cidadao.nomePai = payload.nomePai || null
    cidadao.dataNascimento = DateTime.fromISO(payload.dataNascimento)
    cidadao.sexo = payload.sexo || 'O'
    cidadao.racaCor = payload.racaCor || null
    cidadao.nacionalidade = payload.nacionalidade || 'Brasileira'
    cidadao.cep = payload.cep || null
    cidadao.logradouro = payload.logradouro || null
    cidadao.numero = payload.numero || null
    cidadao.complemento = payload.complemento || null
    cidadao.bairro = payload.bairro || null
    cidadao.municipio = payload.municipio || 'São Paulo'
    cidadao.uf = payload.uf || 'SP'
    cidadao.telefoneCelular = payload.telefoneCelular || null
    cidadao.telefoneFixo = payload.telefoneFixo || null
    cidadao.email = payload.email || null
    cidadao.unidadeSaude = payload.unidadeSaude || 'UBS Central'
    cidadao.situacaoCadastral = (payload.situacaoCadastral as 'ativo' | 'inativo' | 'obito') || 'ativo'
    cidadao.observacoes = payload.observacoes || null

    await cidadao.save()
    await CacheService.delPattern('cidadaos:*')

    session.flash('success', 'Cidadão cadastrado com sucesso!')
    return response.redirect().toPath('/cidadaos')
  }

  /**
   * Perfil 360° do Cidadão
   */
  async show({ params, inertia }: HttpContext) {
    const cidadao = await Cidadao.findOrFail(params.id)

    // Dados consolidados para visão 360° (Prontuário, Dispensações, Benefícios)
    const historicoClinico = [
      {
        id: 101,
        data: '15/10/2026 09:30',
        tipo: 'Consulta Médica - Clínica Geral',
        profissional: 'Dr. Roberto Mendes (CRM 142.890)',
        unidade: cidadao.unidadeSaude,
        diagnostico: 'I10 - Hipertensão essencial (primária)',
        conduta: 'Manter Losartana 50mg 1x/dia. Solicitado ECG e perfil lipídico de rotina.',
      },
      {
        id: 98,
        data: '22/08/2026 14:15',
        tipo: 'Acolhimento & Triagem (Manchester)',
        profissional: 'Enf. Juliana Vasconcelos (COREN 234.567)',
        unidade: cidadao.unidadeSaude,
        diagnostico: 'Classificação Verde (Pouco Urgente)',
        conduta: 'PA 130x85 mmHg, Glicemia capilar 104 mg/dL. Encaminhada para consulta agendada.',
      },
    ]

    const dispensacoes = [
      {
        id: 501,
        data: '15/10/2026',
        medicamento: 'Losartana Potássica 50mg',
        quantidade: 60,
        unidadeMedida: 'Comprimidos',
        posologia: 'Tomar 1 comprimido pela manhã em jejum',
        farmaceutico: 'Farm. Carlos Eduardo (CRF 89.123)',
        lote: 'L-2026-X89',
      },
      {
        id: 489,
        data: '15/09/2026',
        medicamento: 'Losartana Potássica 50mg',
        quantidade: 60,
        unidadeMedida: 'Comprimidos',
        posologia: 'Tomar 1 comprimido pela manhã em jejum',
        farmaceutico: 'Farm. Carlos Eduardo (CRF 89.123)',
        lote: 'L-2026-W42',
      },
    ]

    const programasSociais = [
      {
        programa: 'Programa Bolsa Família',
        nis: cidadao.nis || 'Não informado',
        status: cidadao.nis ? 'Ativo e Regular' : 'Não Vinculado',
        faixaRenda: 'Extrema Pobreza / Baixa Renda',
        ultimaAtualizacaoCadUnico: '10/08/2026',
      },
      {
        programa: 'Programa Farmácia Popular / Municipal',
        status: 'Habilitado',
        observacao: 'Dispensação gratuita de medicamentos anti-hipertensivos e antidiabéticos',
      },
    ]

    return inertia.render('cidadaos/show', {
      cidadao: cidadao.toJSON(),
      historicoClinico,
      dispensacoes,
      programasSociais,
    })
  }

  /**
   * Formulário de edição
   */
  async edit({ params, inertia }: HttpContext) {
    const cidadao = await Cidadao.findOrFail(params.id)

    return inertia.render('cidadaos/form', {
      cidadao: cidadao.toJSON(),
    })
  }

  /**
   * Atualização de cidadão
   */
  async update({ params, request, response, session }: HttpContext) {
    const cidadao = await Cidadao.findOrFail(params.id)
    const payload = await request.validateUsing(updateCidadaoValidator)

    cidadao.nomeCompleto = payload.nomeCompleto
    cidadao.nomeSocial = payload.nomeSocial || null
    cidadao.cpf = payload.cpf || null
    cidadao.cns = payload.cns || null
    cidadao.nis = payload.nis || null
    cidadao.rg = payload.rg || null
    cidadao.rgOrgaoEmissor = payload.rgOrgaoEmissor || null
    cidadao.nomeMae = payload.nomeMae || null
    cidadao.nomePai = payload.nomePai || null
    cidadao.dataNascimento = DateTime.fromISO(payload.dataNascimento)
    cidadao.sexo = payload.sexo || 'O'
    cidadao.racaCor = payload.racaCor || null
    cidadao.nacionalidade = payload.nacionalidade || 'Brasileira'
    cidadao.cep = payload.cep || null
    cidadao.logradouro = payload.logradouro || null
    cidadao.numero = payload.numero || null
    cidadao.complemento = payload.complemento || null
    cidadao.bairro = payload.bairro || null
    cidadao.municipio = payload.municipio || 'São Paulo'
    cidadao.uf = payload.uf || 'SP'
    cidadao.telefoneCelular = payload.telefoneCelular || null
    cidadao.telefoneFixo = payload.telefoneFixo || null
    cidadao.email = payload.email || null
    cidadao.unidadeSaude = payload.unidadeSaude || 'UBS Central'
    cidadao.situacaoCadastral = (payload.situacaoCadastral as 'ativo' | 'inativo' | 'obito') || 'ativo'
    cidadao.observacoes = payload.observacoes || null

    await cidadao.save()
    await CacheService.delPattern('cidadaos:*')

    session.flash('success', 'Cadastro atualizado com sucesso!')
    return response.redirect().toPath('/cidadaos')
  }

  /**
   * Inativação cadastral
   */
  async destroy({ params, response, session }: HttpContext) {
    const cidadao = await Cidadao.findOrFail(params.id)
    cidadao.situacaoCadastral = 'inativo'
    await cidadao.save()

    await CacheService.delPattern('cidadaos:*')

    session.flash('success', 'Cidadão inativado com sucesso.')
    return response.redirect().toPath('/cidadaos')
  }
}
