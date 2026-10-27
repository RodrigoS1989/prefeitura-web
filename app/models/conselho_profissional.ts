import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Profissional from './profissional.js'

export default class ConselhoProfissional extends BaseModel {
  public static table = 'conselhos_profissionais'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sigla: string

  @column()
  declare nome: string

  @column()
  declare uf: string

  @hasMany(() => Profissional)
  declare profissionais: HasMany<typeof Profissional>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
