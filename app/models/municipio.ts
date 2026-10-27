import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Bairro from './bairro.js'
import Logradouro from './logradouro.js'

export default class Municipio extends BaseModel {
  public static table = 'municipios'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigoIbge: string | null

  @column()
  declare nome: string

  @column()
  declare uf: string

  @hasMany(() => Bairro)
  declare bairros: HasMany<typeof Bairro>

  @hasMany(() => Logradouro)
  declare logradouros: HasMany<typeof Logradouro>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
