import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Cidadao from '#models/cidadao'
import UnidadeSaude from '#models/unidade_saude'
import Profissional from '#models/profissional'
import Atendimento from '#models/atendimento'
import User from '#models/user'
import ItemDispensacao from '#models/item_dispensacao'

export default class Dispensacao extends BaseModel {
  public static table = 'dispensacoes'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare numeroDispensacao: string

  @column()
  declare cidadaoId: number

  @column()
  declare unidadeSaudeId: number

  @column()
  declare profissionalPrescritorId: number | null

  @column()
  declare atendimentoId: number | null

  @column()
  declare farmaceuticoDispensadorId: number | null

  @column()
  declare tipoDispensacao:
    | 'RECEITA_AMBULATORIAL'
    | 'USO_CONTINUO'
    | 'JUDICIAL'
    | 'RECEITA_AVULSA'
    | 'PACIENTE_OBSERVACAO'

  @column()
  declare numeroReceita: string | null

  @column.date()
  declare dataReceita: DateTime | null

  @column()
  declare status: 'CONCLUIDA' | 'ESTORNADA_TOTAL' | 'ESTORNADA_PARCIAL'

  @column()
  declare observacoes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Cidadao, { foreignKey: 'cidadaoId' })
  declare cidadao: BelongsTo<typeof Cidadao>

  @belongsTo(() => UnidadeSaude, { foreignKey: 'unidadeSaudeId' })
  declare unidadeSaude: BelongsTo<typeof UnidadeSaude>

  @belongsTo(() => Profissional, { foreignKey: 'profissionalPrescritorId' })
  declare profissionalPrescritor: BelongsTo<typeof Profissional>

  @belongsTo(() => Atendimento, { foreignKey: 'atendimentoId' })
  declare atendimento: BelongsTo<typeof Atendimento>

  @belongsTo(() => User, { foreignKey: 'farmaceuticoDispensadorId' })
  declare farmaceuticoDispensador: BelongsTo<typeof User>

  @hasMany(() => ItemDispensacao, { foreignKey: 'dispensacaoId' })
  declare itens: HasMany<typeof ItemDispensacao>
}
