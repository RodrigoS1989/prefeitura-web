import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Atendimento from '#models/atendimento'

export default class PrescricaoMedicamento extends BaseModel {
  public static table = 'prescricoes_medicamentos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare atendimentoId: number

  @column()
  declare nomeMedicamento: string

  @column()
  declare formaFarmaceutica: string | null

  @column()
  declare concentracaoDosagem: string | null

  @column()
  declare viaAdministracao: string

  @column()
  declare posologia: string

  @column()
  declare quantidadePrescrita: number

  @column()
  declare duracaoDias: number | null

  @column()
  declare usoContinuo: boolean

  @column()
  declare orientacoes: string | null

  @column()
  declare codigoAutenticidadeReceita: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Atendimento, { foreignKey: 'atendimentoId' })
  declare atendimento: BelongsTo<typeof Atendimento>
}
