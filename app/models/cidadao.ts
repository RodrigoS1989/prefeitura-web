import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Cidadao extends BaseModel {
  public static table = 'cidadaos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cpf: string | null

  @column()
  declare cns: string | null

  @column()
  declare nis: string | null

  @column()
  declare rg: string | null

  @column()
  declare rgOrgaoEmissor: string | null

  @column()
  declare nomeCompleto: string

  @column()
  declare nomeSocial: string | null

  @column()
  declare nomeMae: string | null

  @column()
  declare nomePai: string | null

  @column.date()
  declare dataNascimento: DateTime

  @column()
  declare sexo: string

  @column()
  declare racaCor: string | null

  @column()
  declare nacionalidade: string

  @column()
  declare cep: string | null

  @column()
  declare logradouro: string | null

  @column()
  declare numero: string | null

  @column()
  declare complemento: string | null

  @column()
  declare bairro: string | null

  @column()
  declare municipio: string

  @column()
  declare uf: string

  @column()
  declare telefoneCelular: string | null

  @column()
  declare telefoneFixo: string | null

  @column()
  declare email: string | null

  @column()
  declare unidadeSaude: string

  @column()
  declare situacaoCadastral: 'ativo' | 'inativo' | 'obito'

  @column()
  declare observacoes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
