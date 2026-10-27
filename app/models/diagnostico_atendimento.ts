import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Atendimento from '#models/atendimento'

export default class DiagnosticoAtendimento extends BaseModel {
  public static table = 'diagnosticos_atendimento'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare atendimentoId: number

  @column({ columnName: 'cid10_codigo' })
  declare cid10Codigo: string

  @column({ columnName: 'cid10_descricao' })
  declare cid10Descricao: string

  @column({ columnName: 'ciap2_codigo' })
  declare ciap2Codigo: string | null

  @column()
  declare tipo: 'PRINCIPAL' | 'SECUNDARIO' | 'HIPOTESE'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Atendimento, { foreignKey: 'atendimentoId' })
  declare atendimento: BelongsTo<typeof Atendimento>
}
