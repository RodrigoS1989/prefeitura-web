import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Atendimento from '#models/atendimento'
import Profissional from '#models/profissional'
import Cidadao from '#models/cidadao'

export default class AtestadoMedico extends BaseModel {
  public static table = 'atestados_medicos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare atendimentoId: number

  @column()
  declare profissionalId: number

  @column()
  declare cidadaoId: number

  @column()
  declare tipoAtestado:
    | 'AFASTAMENTO'
    | 'COMPARECIMENTO'
    | 'APTIDAO_FISICA'
    | 'SANIDADE_MENTAL'
    | 'ACOMPANHAMENTO'

  @column()
  declare diasAfastamento: number

  @column.date()
  declare dataInicioAfastamento: DateTime | null

  @column({ columnName: 'cid10_codigo' })
  declare cid10Codigo: string | null

  @column()
  declare autorizaDivulgacaoCid: boolean

  @column()
  declare observacoes: string | null

  @column()
  declare codigoAutenticidade: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Atendimento, { foreignKey: 'atendimentoId' })
  declare atendimento: BelongsTo<typeof Atendimento>

  @belongsTo(() => Profissional, { foreignKey: 'profissionalId' })
  declare profissional: BelongsTo<typeof Profissional>

  @belongsTo(() => Cidadao, { foreignKey: 'cidadaoId' })
  declare cidadao: BelongsTo<typeof Cidadao>
}
