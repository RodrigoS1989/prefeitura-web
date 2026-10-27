import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Medicamento from '#models/medicamento'
import UnidadeSaude from '#models/unidade_saude'
import MovimentacaoEstoque from '#models/movimentacao_estoque'

export default class LoteMedicamento extends BaseModel {
  public static table = 'lotes_medicamentos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare medicamentoId: number

  @column()
  declare unidadeSaudeId: number

  @column()
  declare numeroLote: string

  @column()
  declare fabricante: string | null

  @column.date()
  declare dataFabricacao: DateTime | null

  @column.date()
  declare dataValidade: DateTime

  @column()
  declare quantidadeInicial: number

  @column()
  declare quantidadeAtual: number

  @column()
  declare precoUnitarioCompra: number | null

  @column()
  declare numeroNotaFiscal: string | null

  @column()
  declare fornecedorCnpj: string | null

  @column()
  declare status: 'ATIVO' | 'QUARENTENA' | 'VENCIDO' | 'ESGOTADO' | 'BLOQUEADO_ANVISA'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Medicamento, { foreignKey: 'medicamentoId' })
  declare medicamento: BelongsTo<typeof Medicamento>

  @belongsTo(() => UnidadeSaude, { foreignKey: 'unidadeSaudeId' })
  declare unidadeSaude: BelongsTo<typeof UnidadeSaude>

  @hasMany(() => MovimentacaoEstoque, { foreignKey: 'loteId' })
  declare movimentacoes: HasMany<typeof MovimentacaoEstoque>
}
