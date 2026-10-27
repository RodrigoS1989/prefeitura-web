import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ConselhoProfissional from './conselho_profissional.js'
import Cbo from './cbo.js'
import VinculoLotacao from './vinculo_lotacao.js'

export default class Profissional extends BaseModel {
  public static table = 'profissionais'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codope: number | null

  @column()
  declare nome: string

  @computed()
  get nomeCompleto() {
    return this.nome
  }

  @column()
  declare cpf: string

  @column()
  declare cns: string | null

  @column()
  declare email: string | null

  @column()
  declare telefone: string | null

  @column()
  declare conselhoId: number | null

  @belongsTo(() => ConselhoProfissional, { foreignKey: 'conselhoId' })
  declare conselho: BelongsTo<typeof ConselhoProfissional>

  @column()
  declare numeroConselho: string | null

  @column()
  declare cboId: number | null

  @belongsTo(() => Cbo, { foreignKey: 'cboId' })
  declare cbo: BelongsTo<typeof Cbo>

  @column()
  declare status: 'ativo' | 'inativo' | 'afastado'

  @hasMany(() => VinculoLotacao)
  declare lotacoes: HasMany<typeof VinculoLotacao>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
