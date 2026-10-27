import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Atendimento from '#models/atendimento'

export default class SolicitacaoExame extends BaseModel {
  public static table = 'solicitacoes_exames'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare atendimentoId: number

  @column()
  declare procedimentoSigtapCodigo: string | null

  @column()
  declare descricaoExame: string

  @column()
  declare tipoExame: 'LABORATORIAL' | 'IMAGEM' | 'GRAFICO' | 'ENDOSCOPIA'

  @column()
  declare justificativaClinica: string | null

  @column()
  declare urgente: boolean

  @column()
  declare status: 'SOLICITADO' | 'COLETADO' | 'EM_ANALISE' | 'CONCLUIDO' | 'CANCELADO'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Atendimento, { foreignKey: 'atendimentoId' })
  declare atendimento: BelongsTo<typeof Atendimento>
}
