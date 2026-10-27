import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Bairro from './bairro.js'
import VinculoLotacao from './vinculo_lotacao.js'

export default class UnidadeSaude extends BaseModel {
  public static table = 'unidades_saude'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cnes: string

  @column()
  declare razaoSocial: string

  @column()
  declare nomeFantasia: string

  @computed()
  get nome() {
    return this.nomeFantasia
  }

  @column()
  declare tipoUnidade:
    | 'UBS'
    | 'USF'
    | 'UPA'
    | 'CAPS'
    | 'POLICLINICA'
    | 'FARMACIA'
    | 'CENTRO_ESPECIALIDADES'
    | 'HOSPITAL_MUNICIPAL'

  @column()
  declare diretorTecnico: string | null

  @column()
  declare telefone: string | null

  @column()
  declare email: string | null

  @column()
  declare endereco: string | null

  @column()
  declare bairroId: number | null

  @belongsTo(() => Bairro)
  declare bairro: BelongsTo<typeof Bairro>

  @column()
  declare horarioFuncionamento: string

  @column()
  declare ativa: boolean

  @hasMany(() => VinculoLotacao)
  declare lotacoes: HasMany<typeof VinculoLotacao>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
