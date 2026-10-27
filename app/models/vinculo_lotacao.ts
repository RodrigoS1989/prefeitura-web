import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Profissional from './profissional.js'
import UnidadeSaude from './unidade_saude.js'
import EspecialidadeMedica from './especialidade_medica.js'

export default class VinculoLotacao extends BaseModel {
  public static table = 'vinculos_lotacoes'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare profissionalId: number

  @belongsTo(() => Profissional, { foreignKey: 'profissionalId' })
  declare profissional: BelongsTo<typeof Profissional>

  @column()
  declare unidadeSaudeId: number

  @belongsTo(() => UnidadeSaude, { foreignKey: 'unidadeSaudeId' })
  declare unidadeSaude: BelongsTo<typeof UnidadeSaude>

  @column()
  declare especialidadeId: number | null

  @belongsTo(() => EspecialidadeMedica, { foreignKey: 'especialidadeId' })
  declare especialidade: BelongsTo<typeof EspecialidadeMedica>

  @column()
  declare cargaHoraria: number

  @column()
  declare cargo: string | null

  @column()
  declare ativo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
