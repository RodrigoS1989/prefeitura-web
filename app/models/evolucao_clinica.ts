import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Atendimento from '#models/atendimento'
import Profissional from '#models/profissional'

export default class EvolucaoClinica extends BaseModel {
  public static table = 'evolucoes_clinicas'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare atendimentoId: number

  @column()
  declare profissionalId: number

  @column()
  declare subjetivo: string

  @column()
  declare objetivo: string

  @column()
  declare avaliacao: string

  @column()
  declare planoConduta: string

  @column()
  declare assinadoDigitalmente: boolean

  @column.dateTime()
  declare dataHoraAssinatura: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Atendimento, { foreignKey: 'atendimentoId' })
  declare atendimento: BelongsTo<typeof Atendimento>

  @belongsTo(() => Profissional, { foreignKey: 'profissionalId' })
  declare profissional: BelongsTo<typeof Profissional>
}
