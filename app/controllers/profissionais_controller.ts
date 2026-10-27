import type { HttpContext } from '@adonisjs/core/http'
import Profissional from '#models/profissional'
import ConselhoProfissional from '#models/conselho_profissional'
import EspecialidadeMedica from '#models/especialidade_medica'
import Cbo from '#models/cbo'
import UnidadeSaude from '#models/unidade_saude'
import VinculoLotacao from '#models/vinculo_lotacao'
import cacheService from '#services/cache_service'
import {
  createProfissionalValidator,
  updateProfissionalValidator,
} from '#validators/profissional_validator'

export default class ProfissionaisController {
  async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '')
    const conselhoId = request.input('conselhoId', '')
    const unidadeId = request.input('unidadeId', '')
    const status = request.input('status', '')

    const query = Profissional.query()
      .preload('conselho')
      .preload('cbo')
      .preload('lotacoes', (q) => {
        q.where('ativo', true).preload('unidadeSaude').preload('especialidade')
      })

    if (search) {
      query.where((q) => {
        q.where('nome', 'like', `%${search}%`)
          .orWhere('cpf', 'like', `%${search}%`)
          .orWhere('cns', 'like', `%${search}%`)
          .orWhere('numero_conselho', 'like', `%${search}%`)
      })
    }

    if (conselhoId) {
      query.where('conselho_id', conselhoId)
    }

    if (status) {
      query.where('status', status)
    }

    if (unidadeId) {
      query.whereHas('lotacoes', (q) => {
        q.where('unidade_saude_id', unidadeId).where('ativo', true)
      })
    }

    const profissionais = await query.orderBy('nome', 'asc').paginate(page, 10)

    // Estatísticas
    const totalGeral = await Profissional.query().count('* as total')
    const totalMedicos = await Profissional.query()
      .whereHas('conselho', (c) => c.where('sigla', 'CRM'))
      .count('* as total')
    const totalEnfermeiros = await Profissional.query()
      .whereHas('conselho', (c) => c.where('sigla', 'COREN'))
      .count('* as total')
    const totalAtivos = await Profissional.query().where('status', 'ativo').count('* as total')

    const stats = {
      total: Number(totalGeral[0].$extras.total || 0),
      medicos: Number(totalMedicos[0].$extras.total || 0),
      enfermeiros: Number(totalEnfermeiros[0].$extras.total || 0),
      ativos: Number(totalAtivos[0].$extras.total || 0),
    }

    // Listas auxiliares para filtros e modais
    const conselhos = await ConselhoProfissional.query().orderBy('sigla', 'asc')
    const especialidades = await EspecialidadeMedica.query().orderBy('nome', 'asc')
    const cbos = await Cbo.query().orderBy('ocupacao', 'asc')
    const unidades = await UnidadeSaude.query().where('ativa', true).orderBy('nome_fantasia', 'asc')

    return inertia.render('profissionais/index', {
      profissionais: {
        data: profissionais.all().map((p) => ({
          id: p.id,
          codope: p.codope,
          nome: p.nome,
          cpf: p.cpf,
          cns: p.cns,
          email: p.email,
          telefone: p.telefone,
          conselhoSigla: p.conselho?.sigla || null,
          numeroConselho: p.numeroConselho,
          cboCodigo: p.cbo?.codigo || null,
          cboOcupacao: p.cbo?.ocupacao || null,
          status: p.status,
          lotacoes: p.lotacoes?.map((l) => ({
            id: l.id,
            unidadeId: l.unidadeSaudeId,
            unidadeNome: l.unidadeSaude?.nomeFantasia || 'Unidade',
            especialidadeNome: l.especialidade?.nome || 'Geral',
            cargaHoraria: l.cargaHoraria,
            cargo: l.cargo,
          })) || [],
        })),
        meta: {
          total: profissionais.total,
          perPage: profissionais.perPage,
          currentPage: profissionais.currentPage,
          lastPage: profissionais.lastPage,
        },
      },
      stats,
      conselhos: conselhos.map((c) => ({ id: c.id, sigla: c.sigla, nome: c.nome })),
      especialidades: especialidades.map((e) => ({ id: e.id, codigo: e.codigo, nome: e.nome })),
      cbos: cbos.map((c) => ({ id: c.id, codigo: c.codigo, ocupacao: c.ocupacao })),
      unidades: unidades.map((u) => ({ id: u.id, nome: u.nomeFantasia, cnes: u.cnes })),
      filters: { search, conselhoId, unidadeId, status },
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createProfissionalValidator)

    // Simula sequenciador ARQ999 CodOpe se não fornecido
    const maxCod = await Profissional.query().max('codope as max_cod')
    const nextCodOpe = (Number(maxCod[0]?.$extras.max_cod) || 100) + 1

    const profissional = await Profissional.create({
      codope: nextCodOpe,
      nome: payload.nome,
      cpf: payload.cpf,
      cns: payload.cns || null,
      email: payload.email || null,
      telefone: payload.telefone || null,
      conselhoId: payload.conselhoId || null,
      numeroConselho: payload.numeroConselho || null,
      cboId: payload.cboId || null,
      status: payload.status || 'ativo',
    })

    // Se unidadeId foi informada, criar o vínculo inicial
    if (payload.unidadeId) {
      await VinculoLotacao.create({
        profissionalId: profissional.id,
        unidadeSaudeId: payload.unidadeId,
        especialidadeId: payload.especialidadeId || null,
        cargaHoraria: payload.cargaHoraria || 40,
        cargo: payload.cargo || 'Profissional de Saúde',
        ativo: true,
      })
    }

    await cacheService.delete('profissionais:search')
    session.flash('success', 'Profissional cadastrado com sucesso!')
    return response.redirect().toRoute('profissionais.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const profissional = await Profissional.findOrFail(params.id)
    const payload = await request.validateUsing(updateProfissionalValidator)

    profissional.merge(payload)
    await profissional.save()

    await cacheService.delete('profissionais:search')
    session.flash('success', 'Profissional atualizado com sucesso!')
    return response.redirect().toRoute('profissionais.index')
  }

  // API de busca com cache Redis para autocomplete em outros módulos
  async apiSearch({ request, response }: HttpContext) {
    const q = request.input('q', '').trim()

    if (!q || q.length < 2) {
      return response.json([])
    }

    const cacheKey = `profissionais:search:${q.toLowerCase()}`
    const cached = await cacheService.get<any[]>(cacheKey)
    if (cached) {
      return response.json(cached)
    }

    const profissionais = await Profissional.query()
      .where('status', 'ativo')
      .where((query) => {
        query.where('nome', 'like', `%${q}%`)
          .orWhere('cpf', 'like', `%${q}%`)
          .orWhere('numero_conselho', 'like', `%${q}%`)
      })
      .preload('conselho')
      .preload('cbo')
      .preload('lotacoes', (lotQuery) => {
        lotQuery.where('ativo', true).preload('unidadeSaude').preload('especialidade')
      })
      .limit(10)

    const result = profissionais.map((p) => ({
      id: p.id,
      codope: p.codope,
      nome: p.nome,
      cpf: p.cpf,
      conselho: p.conselho?.sigla,
      numeroConselho: p.numeroConselho,
      cbo: p.cbo?.ocupacao,
      unidades: p.lotacoes.map((l) => l.unidadeSaude?.nomeFantasia),
    }))

    await cacheService.set(cacheKey, result, 300)
    return response.json(result)
  }
}
