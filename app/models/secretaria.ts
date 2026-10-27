import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Secretaria extends BaseModel {
  public static table = 'secretarias'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare sigla: string | null

  @column()
  declare responsavel: string | null

  @column()
  declare email: string | null

  @column()
  declare telefone: string | null

  @column()
  declare endereco: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
