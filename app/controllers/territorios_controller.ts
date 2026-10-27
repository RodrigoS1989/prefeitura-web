import type { HttpContext } from '@adonisjs/core/http'
import Bairro from '#models/bairro'
import Logradouro from '#models/logradouro'
import Secretaria from '#models/secretaria'
import Municipio from '#models/municipio'
import cacheService from '#services/cache_service'
import {
  createBairroValidator,
  createLogradouroValidator,
  createSecretariaValidator,
} from '#validators/territorio_validator'

export default class TerritoriosController {
  async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '')
    const activeTab = request.input('tab', 'logradouros')

    // Bairros
    const bairrosQuery = Bairro.query().preload('municipio')
    if (search && activeTab === 'bairros') {
      bairrosQuery.where('nome', 'like', `%${search}%`)
    }
    const bairros = await bairrosQuery.orderBy('nome', 'asc')

    // Logradouros (Paginados)
    const logradourosQuery = Logradouro.query().preload('bairro').preload('municipio')
    if (search && activeTab === 'logradouros') {
      logradourosQuery.where((q) => {
        q.where('nome', 'like', `%${search}%`)
          .orWhere('cep', 'like', `%${search}%`)
      })
    }
    const logradouros = await logradourosQuery.orderBy('nome', 'asc').paginate(page, 15)

    // Secretarias
    const secretariasQuery = Secretaria.query()
    if (search && activeTab === 'secretarias') {
      secretariasQuery.where((q) => {
        q.where('nome', 'like', `%${search}%`)
          .orWhere('sigla', 'like', `%${search}%`)
      })
    }
    const secretarias = await secretariasQuery.orderBy('nome', 'asc')

    // Municípios disponíveis
    const municipios = await Municipio.all()

    return inertia.render('territorio/index', {
      bairros,
      logradouros: logradouros.all().map((l) => ({
        id: l.id,
        tipo: l.tipo,
        nome: l.nome,
        cep: l.cep,
        bairroId: l.bairroId,
        bairroNome: l.bairro?.nome || 'Não vinculado',
        municipioNome: l.municipio?.nome || 'Município Sede',
      })),
      secretarias,
      municipios,
      pagination: {
        total: logradouros.total,
        perPage: logradouros.perPage,
        currentPage: logradouros.currentPage,
        lastPage: logradouros.lastPage,
      },
      filters: { search, tab: activeTab },
    })
  }

  async storeBairro({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createBairroValidator)
    await Bairro.create(payload)
    await cacheService.delete('api:bairros:all')
    return response.redirect().back()
  }

  async destroyBairro({ params, response }: HttpContext) {
    const bairro = await Bairro.findOrFail(params.id)
    await bairro.delete()
    await cacheService.delete('api:bairros:all')
    return response.redirect().back()
  }

  async storeLogradouro({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createLogradouroValidator)
    await Logradouro.create(payload)
    await cacheService.delete('api:logradouros:all')
    return response.redirect().back()
  }

  async destroyLogradouro({ params, response }: HttpContext) {
    const logradouro = await Logradouro.findOrFail(params.id)
    await logradouro.delete()
    await cacheService.delete('api:logradouros:all')
    return response.redirect().back()
  }

  async storeSecretaria({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createSecretariaValidator)
    await Secretaria.create(payload)
    return response.redirect().back()
  }

  async destroySecretaria({ params, response }: HttpContext) {
    const secretaria = await Secretaria.findOrFail(params.id)
    await secretaria.delete()
    return response.redirect().back()
  }

  // API ultrarrápida para autocomplete de logradouros / CEP
  async apiSearch({ request, response }: HttpContext) {
    const q = request.input('q', '').trim()
    if (!q) {
      return response.json([])
    }

    const cacheKey = `search:logradouro:${q}`
    const cached = await cacheService.get<any[]>(cacheKey)
    if (cached) {
      return response.json(cached)
    }

    const results = await Logradouro.query()
      .preload('bairro')
      .where('nome', 'like', `%${q}%`)
      .orWhere('cep', 'like', `%${q}%`)
      .limit(10)

    const formatted = results.map((l) => ({
      id: l.id,
      label: `${l.tipo} ${l.nome} - ${l.bairro?.nome || ''} (${l.cep || 'Sem CEP'})`,
      tipo: l.tipo,
      nome: l.nome,
      cep: l.cep,
      bairro: l.bairro?.nome || '',
    }))

    await cacheService.set(cacheKey, formatted, 3600)
    return response.json(formatted)
  }
}
