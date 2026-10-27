import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import UnidadeSaude from '#models/unidade_saude'

export default class CotaAgendamento extends BaseModel {
  public static table = 'cotas_agendamentos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare unidadeSolicitanteId: number

  @column()
  declare tipo: 'CONSULTA' | 'EXAME'

  @column()
  declare especialidadeOuExame: string

  @column()
  declare mesAno: string

  @column()
  declare cotaMensal: number

  @column()
  declare cotaUtilizada: number

  @belongsTo(() => UnidadeSaude, { foreignKey: 'unidadeSolicitanteId' })
  declare unidadeSolicitante: BelongsTo<typeof UnidadeSaude>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  public get saldoDisponivel(): number {
    return Math.max(0, this.cotaMensal - this.cotaUtilizada)
  }
}
