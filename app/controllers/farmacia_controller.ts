import type { HttpContext } from '@adonisjs/core/http'
import Medicamento from '#models/medicamento'
import GrupoMedicamento from '#models/grupo_medicamento'
import LoteMedicamento from '#models/lote_medicamento'
import UnidadeSaude from '#models/unidade_saude'
import Dispensacao from '#models/dispensacao'
import { FefoDispensacaoService } from '#services/fefo_dispensacao_service'
import { DateTime } from 'luxon'

export default class FarmaciaController {
  private fefoService = new FefoDispensacaoService()

  /**
   * Renderiza a página principal da Farmácia Municipal (Catálogo REMUME, Lotes FEFO e Dispensação)
   */
  public async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 15)
    const search = request.input('q', '')
    const grupoId = request.input('grupoId')
    const apenasRemume = request.input('remume', true)

    const query = Medicamento.query()
      .preload('grupo')
      .preload('lotes', (q) => q.where('quantidadeAtual', '>', 0).orderBy('dataValidade', 'asc'))
      .where('ativo', true)

    if (search) {
      query.where((q) => {
        q.whereILike('principioAtivo', `%${search}%`)
          .orWhereILike('nomeComercial', `%${search}%`)
          .orWhereILike('codigo', `%${search}%`)
          .orWhereILike('catmatCodigo', `%${search}%`)
      })
    }

    if (grupoId) {
      query.where('grupoId', grupoId)
    }

    if (apenasRemume && apenasRemume !== 'false') {
      query.where('pertenceRemume', true)
    }

    const medicamentos = await query.orderBy('principioAtivo', 'asc').paginate(page, limit)

    const grupos = await GrupoMedicamento.query().where('ativo', true).orderBy('nome', 'asc')
    const unidades = await UnidadeSaude.query().where('ativa', true).orderBy('nomeFantasia', 'asc')

    // Estatísticas da Assistência Farmacêutica
    const hoje = DateTime.now().startOf('day')
    const noventaDias = hoje.plus({ days: 90 })

    const totalMedicamentosRemume = await Medicamento.query()
      .where('pertenceRemume', true)
      .andWhere('ativo', true)
      .count('* as total')

    const totalLotes = await LoteMedicamento.query().where('quantidadeAtual', '>', 0).count('* as total')

    const lotesVencimentoProximo = await LoteMedicamento.query()
      .where('quantidadeAtual', '>', 0)
      .where('dataValidade', '>=', hoje.toISODate()!)
      .where('dataValidade', '<=', noventaDias.toISODate()!)
      .count('* as total')

    const ultimasDispensacoes = await Dispensacao.query()
      .preload('cidadao')
      .preload('unidadeSaude')
      .preload('itens', (q) => q.preload('medicamento').preload('lote'))
      .orderBy('createdAt', 'desc')
      .limit(10)

    return inertia.render('farmacia/index', {
      medicamentos: medicamentos.serialize(),
      grupos: grupos.map((g) => g.serialize()),
      unidades: unidades.map((u) => u.serialize()),
      estatisticas: {
        totalRemume: Number(totalMedicamentosRemume[0]?.$extras?.total || 0),
        totalLotes: Number(totalLotes[0]?.$extras?.total || 0),
        lotesCriticos: Number(lotesVencimentoProximo[0]?.$extras?.total || 0),
      },
      ultimasDispensacoes: ultimasDispensacoes.map((d) => d.serialize()),
      filtros: { search, grupoId, apenasRemume },
    })
  }

  /**
   * API: Consulta lotes disponíveis de um medicamento ordenados pelo algoritmo FEFO
   */
  public async lotesPorMedicamento({ request, response }: HttpContext) {
    const medicamentoId = request.param('id')
    const unidadeSaudeId = request.input('unidadeSaudeId', 1)

    try {
      const lotes = await this.fefoService.getLotesFefo(
        Number(medicamentoId),
        Number(unidadeSaudeId)
      )
      return response.ok(lotes)
    } catch (error: any) {
      return response.badRequest({ message: 'Erro ao consultar lotes FEFO', error: error.message })
    }
  }

  /**
   * Executa a dispensação atômica aplicando o algoritmo FEFO
   */
  public async dispensar({ request, response, session }: HttpContext) {
    const payload = request.only([
      'cidadaoId',
      'unidadeSaudeId',
      'profissionalPrescritorId',
      'atendimentoId',
      'tipoDispensacao',
      'numeroReceita',
      'dataReceita',
      'observacoes',
      'itens',
    ])

    try {
      const dispensacao = await this.fefoService.dispensar(payload)

      session.flash('success', `Dispensação ${dispensacao.numeroDispensacao} concluída com sucesso!`)

      if (request.header('accept')?.includes('application/json')) {
        return response.created(dispensacao)
      }

      return response.redirect().toPath('/farmacia')
    } catch (error: any) {
      session.flash('error', error.message)

      if (request.header('accept')?.includes('application/json')) {
        return response.badRequest({ message: error.message })
      }

      return response.redirect().back()
    }
  }

  /**
   * Cadastra novo medicamento no catálogo REMUME
   */
  public async storeMedicamento({ request, response, session }: HttpContext) {
    const data = request.only([
      'codigo',
      'catmatCodigo',
      'nomeComercial',
      'principioAtivo',
      'concentracao',
      'formaFarmaceutica',
      'viaAdministracao',
      'unidadeFornecimento',
      'grupoId',
      'tipoControle',
      'pertenceRemume',
      'cestaBasica',
      'estoqueMinimo',
      'estoqueIdeal',
      'codigoBarras',
    ])

    const medicamento = await Medicamento.create(data)

    session.flash('success', `Medicamento ${medicamento.principioAtivo} cadastrado com sucesso!`)

    if (request.header('accept')?.includes('application/json')) {
      return response.created(medicamento)
    }

    return response.redirect().toPath('/farmacia')
  }

  /**
   * Registra entrada de novo lote com validade
   */
  public async storeLote({ request, response, session }: HttpContext) {
    const data = request.only([
      'medicamentoId',
      'unidadeSaudeId',
      'numeroLote',
      'fabricante',
      'dataFabricacao',
      'dataValidade',
      'quantidadeInicial',
      'precoUnitarioCompra',
      'numeroNotaFiscal',
      'fornecedorCnpj',
    ])

    const lote = await LoteMedicamento.create({
      ...data,
      quantidadeAtual: data.quantidadeInicial,
      status: 'ATIVO',
    })

    session.flash('success', `Lote ${lote.numeroLote} registrado com sucesso para dispensação FEFO!`)

    if (request.header('accept')?.includes('application/json')) {
      return response.created(lote)
    }

    return response.redirect().toPath('/farmacia')
  }
}
