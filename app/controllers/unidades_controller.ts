import type { HttpContext } from '@adonisjs/core/http'
import UnidadeSaude from '#models/unidade_saude'
import Bairro from '#models/bairro'
import cacheService from '#services/cache_service'
import {
  createUnidadeValidator,
  updateUnidadeValidator,
} from '#validators/unidade_validator'

export default class UnidadesController {
  async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '')
    const tipo = request.input('tipo', '')
    const status = request.input('status', '')

    const query = UnidadeSaude.query()
      .preload('bairro')
      .preload('lotacoes', (q) => {
        q.where('ativo', true).preload('profissional').preload('especialidade')
      })

    if (search) {
      query.where((q) => {
        q.where('nome_fantasia', 'like', `%${search}%`)
          .orWhere('razao_social', 'like', `%${search}%`)
          .orWhere('cnes', 'like', `%${search}%`)
          .orWhere('diretor_tecnico', 'like', `%${search}%`)
      })
    }

    if (tipo) {
      query.where('tipo_unidade', tipo)
    }

    if (status !== '') {
      query.where('ativa', status === 'ativo' || status === 'true')
    }

    const unidades = await query.orderBy('nome_fantasia', 'asc').paginate(page, 10)

    // Estatísticas
    const totalUnidades = await UnidadeSaude.query().count('* as total')
    const totalUbs = await UnidadeSaude.query().whereIn('tipo_unidade', ['UBS', 'USF']).count('* as total')
    const totalUpa = await UnidadeSaude.query().where('tipo_unidade', 'UPA').count('* as total')
    const totalCaps = await UnidadeSaude.query().where('tipo_unidade', 'CAPS').count('* as total')

    const stats = {
      total: Number(totalUnidades[0].$extras.total || 0),
      ubs: Number(totalUbs[0].$extras.total || 0),
      upa: Number(totalUpa[0].$extras.total || 0),
      caps: Number(totalCaps[0].$extras.total || 0),
    }

    // Bairros para seleção
    const bairros = await Bairro.query().orderBy('nome', 'asc')

    return inertia.render('unidades/index', {
      unidades: {
        data: unidades.all().map((u) => ({
          id: u.id,
          cnes: u.cnes,
          razaoSocial: u.razaoSocial,
          nomeFantasia: u.nomeFantasia,
          tipoUnidade: u.tipoUnidade,
          diretorTecnico: u.diretorTecnico,
          telefone: u.telefone,
          email: u.email,
          endereco: u.endereco,
          bairroId: u.bairroId,
          bairroNome: u.bairro?.nome || 'Não informado',
          horarioFuncionamento: u.horarioFuncionamento,
          ativa: Boolean(u.ativa),
          totalProfissionais: u.lotacoes?.length || 0,
          equipe: u.lotacoes?.slice(0, 3).map((l) => ({
            id: l.id,
            nome: l.profissional?.nome || 'Profissional',
            cargo: l.cargo || l.especialidade?.nome || 'Plantão',
          })) || [],
        })),
        meta: {
          total: unidades.total,
          perPage: unidades.perPage,
          currentPage: unidades.currentPage,
          lastPage: unidades.lastPage,
        },
      },
      stats,
      bairros: bairros.map((b) => ({ id: b.id, nome: b.nome })),
      filters: { search, tipo, status },
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createUnidadeValidator)

    await UnidadeSaude.create({
      cnes: payload.cnes,
      razaoSocial: payload.razaoSocial,
      nomeFantasia: payload.nomeFantasia,
      tipoUnidade: payload.tipoUnidade,
      diretorTecnico: payload.diretorTecnico || null,
      telefone: payload.telefone || null,
      email: payload.email || null,
      endereco: payload.endereco || null,
      bairroId: payload.bairroId || null,
      horarioFuncionamento: payload.horarioFuncionamento || '07:00 às 17:00',
      ativa: payload.ativa ?? true,
    })

    await cacheService.delete('unidades:all')
    session.flash('success', 'Unidade de Saúde cadastrada com sucesso!')
    return response.redirect().toRoute('unidades.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const unidade = await UnidadeSaude.findOrFail(params.id)
    const payload = await request.validateUsing(updateUnidadeValidator)

    unidade.merge(payload)
    await unidade.save()

    await cacheService.delete('unidades:all')
    session.flash('success', 'Unidade de Saúde atualizada com sucesso!')
    return response.redirect().toRoute('unidades.index')
  }

  async toggleStatus({ params, response, session }: HttpContext) {
    const unidade = await UnidadeSaude.findOrFail(params.id)
    unidade.ativa = !unidade.ativa
    await unidade.save()

    await cacheService.delete('unidades:all')
    session.flash('success', `Unidade ${unidade.ativa ? 'ativada' : 'desativada'} com sucesso!`)
    return response.redirect().toRoute('unidades.index')
  }
}
