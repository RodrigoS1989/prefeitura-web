import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Medicamento from '#models/medicamento'

export default class GrupoMedicamento extends BaseModel {
  public static table = 'grupos_medicamentos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigo: string

  @column()
  declare nome: string

  @column()
  declare tipoControleEspecial:
    | 'COMUM'
    | 'PORTARIA_344_A'
    | 'PORTARIA_344_B'
    | 'PORTARIA_344_C'
    | 'ANTIMICROBIANO'
    | 'ALTO_CUSTO'

  @column()
  declare ativo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Medicamento, { foreignKey: 'grupoId' })
  declare medicamentos: HasMany<typeof Medicamento>
}
