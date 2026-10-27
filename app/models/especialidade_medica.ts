import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import VinculoLotacao from './vinculo_lotacao.js'

export default class EspecialidadeMedica extends BaseModel {
  public static table = 'especialidades_medicas'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigo: string

  @column()
  declare nome: string

  @column()
  declare descricao: string | null

  @column()
  declare registroConselho: string | null

  @hasMany(() => VinculoLotacao)
  declare vinculos: HasMany<typeof VinculoLotacao>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
