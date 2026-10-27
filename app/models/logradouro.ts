import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Bairro from './bairro.js'
import Municipio from './municipio.js'

export default class Logradouro extends BaseModel {
  public static table = 'logradouros'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tipo: string

  @column()
  declare nome: string

  @column()
  declare cep: string | null

  @column()
  declare bairroId: number | null

  @column()
  declare municipioId: number | null

  @belongsTo(() => Bairro)
  declare bairro: BelongsTo<typeof Bairro>

  @belongsTo(() => Municipio)
  declare municipio: BelongsTo<typeof Municipio>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
