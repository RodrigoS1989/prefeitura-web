import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Cidadao from '#models/cidadao'
import UnidadeSaude from '#models/unidade_saude'
import Profissional from '#models/profissional'

export default class Agendamento extends BaseModel {
  public static table = 'agendamentos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare protocolo: string

  @column()
  declare cidadaoId: number

  @column()
  declare unidadeSolicitanteId: number

  @column()
  declare unidadeExecutanteId: number

  @column()
  declare profissionalId: number | null

  @column()
  declare tipo: 'CONSULTA' | 'EXAME'

  @column()
  declare especialidadeOuExame: string

  @column.dateTime()
  declare dataHora: DateTime

  @column()
  declare status: 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'ATENDIDO' | 'FALTOU'

  @column()
  declare prioridade: 'NORMAL' | 'URGENTE' | 'PREFERENCIAL'

  @column()
  declare motivoCancelamento: string | null

  @column()
  declare observacoes: string | null

  @belongsTo(() => Cidadao, { foreignKey: 'cidadaoId' })
  declare cidadao: BelongsTo<typeof Cidadao>

  @belongsTo(() => UnidadeSaude, { foreignKey: 'unidadeSolicitanteId' })
  declare unidadeSolicitante: BelongsTo<typeof UnidadeSaude>

  @belongsTo(() => UnidadeSaude, { foreignKey: 'unidadeExecutanteId' })
  declare unidadeExecutante: BelongsTo<typeof UnidadeSaude>

  @belongsTo(() => Profissional, { foreignKey: 'profissionalId' })
  declare profissional: BelongsTo<typeof Profissional>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
