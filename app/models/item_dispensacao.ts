import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Dispensacao from '#models/dispensacao'
import Medicamento from '#models/medicamento'
import LoteMedicamento from '#models/lote_medicamento'

export default class ItemDispensacao extends BaseModel {
  public static table = 'itens_dispensacao'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare dispensacaoId: number

  @column()
  declare medicamentoId: number

  @column()
  declare loteId: number

  @column()
  declare quantidadePrescrita: number

  @column()
  declare quantidadeDispensada: number

  @column()
  declare posologia: string | null

  @column()
  declare tempoTratamentoDias: number | null

  @column.date()
  declare proximaDispensacaoEm: DateTime | null

  @column()
  declare estornado: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Dispensacao, { foreignKey: 'dispensacaoId' })
  declare dispensacao: BelongsTo<typeof Dispensacao>

  @belongsTo(() => Medicamento, { foreignKey: 'medicamentoId' })
  declare medicamento: BelongsTo<typeof Medicamento>

  @belongsTo(() => LoteMedicamento, { foreignKey: 'loteId' })
  declare lote: BelongsTo<typeof LoteMedicamento>
}
