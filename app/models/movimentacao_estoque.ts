import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Medicamento from '#models/medicamento'
import LoteMedicamento from '#models/lote_medicamento'
import UnidadeSaude from '#models/unidade_saude'
import User from '#models/user'

export default class MovimentacaoEstoque extends BaseModel {
  public static table = 'movimentacoes_estoque'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare medicamentoId: number

  @column()
  declare loteId: number

  @column()
  declare unidadeSaudeId: number

  @column()
  declare tipoMovimentacao:
    | 'ENTRADA_NOTA_FISCAL'
    | 'DISPENSACAO_PACIENTE'
    | 'TRANSFERENCIA_SAIDA'
    | 'TRANSFERENCIA_ENTRADA'
    | 'DOACAO_ENTRADA'
    | 'PERDA_AVARIA'
    | 'PERDA_VALIDADE_EXPIRADA'
    | 'ESTORNO_DISPENSACAO'
    | 'AJUSTE_INVENTARIO'

  @column()
  declare quantidade: number

  @column()
  declare saldoAnterior: number

  @column()
  declare saldoPosterior: number

  @column()
  declare numeroDocumento: string | null

  @column()
  declare motivoAjuste: string | null

  @column()
  declare usuarioOperadorId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Medicamento, { foreignKey: 'medicamentoId' })
  declare medicamento: BelongsTo<typeof Medicamento>

  @belongsTo(() => LoteMedicamento, { foreignKey: 'loteId' })
  declare lote: BelongsTo<typeof LoteMedicamento>

  @belongsTo(() => UnidadeSaude, { foreignKey: 'unidadeSaudeId' })
  declare unidadeSaude: BelongsTo<typeof UnidadeSaude>

  @belongsTo(() => User, { foreignKey: 'usuarioOperadorId' })
  declare usuarioOperador: BelongsTo<typeof User>
}
