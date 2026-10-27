import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Atendimento from '#models/atendimento'
import Profissional from '#models/profissional'

export default class SinalVital extends BaseModel {
  public static table = 'sinais_vitais'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare atendimentoId: number

  @column()
  declare triadorProfissionalId: number | null

  @column()
  declare paSistolica: number | null

  @column()
  declare paDiastolica: number | null

  @column()
  declare frequenciaCardiaca: number | null

  @column()
  declare frequenciaRespiratoria: number | null

  @column()
  declare temperatura: number | null

  @column({ columnName: 'saturacao_o2' })
  declare saturacaoO2: number | null

  @column()
  declare peso: number | null

  @column()
  declare altura: number | null

  @column()
  declare imc: number | null

  @column()
  declare perimetroCefalico: number | null

  @column()
  declare glicemiaCapilar: number | null

  @column()
  declare escalaDor: number | null

  @column()
  declare observacoesTriagem: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Atendimento, { foreignKey: 'atendimentoId' })
  declare atendimento: BelongsTo<typeof Atendimento>

  @belongsTo(() => Profissional, { foreignKey: 'triadorProfissionalId' })
  declare triador: BelongsTo<typeof Profissional>
}
