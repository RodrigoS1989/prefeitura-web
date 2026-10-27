import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Municipio from './municipio.js'
import Logradouro from './logradouro.js'

export default class Bairro extends BaseModel {
  public static table = 'bairros'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare zona: 'urbana' | 'rural'

  @column()
  declare municipioId: number | null

  @belongsTo(() => Municipio)
  declare municipio: BelongsTo<typeof Municipio>

  @hasMany(() => Logradouro)
  declare logradouros: HasMany<typeof Logradouro>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
