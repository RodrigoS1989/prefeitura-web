import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ParametroPrefeitura extends BaseModel {
  public static table = 'parametros_prefeitura'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare razaoSocial: string

  @column()
  declare nomeFantasia: string | null

  @column()
  declare cnpj: string | null

  @column()
  declare prefeito: string | null

  @column()
  declare telefone: string | null

  @column()
  declare email: string | null

  @column()
  declare endereco: string | null

  @column()
  declare cep: string | null

  @column()
  declare cidade: string

  @column()
  declare uf: string

  @column()
  declare brasaoUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
