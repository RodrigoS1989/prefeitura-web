import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import GrupoMedicamento from '#models/grupo_medicamento'
import LoteMedicamento from '#models/lote_medicamento'
import MovimentacaoEstoque from '#models/movimentacao_estoque'

export default class Medicamento extends BaseModel {
  public static table = 'medicamentos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigo: string

  @column()
  declare catmatCodigo: string | null

  @column()
  declare nomeComercial: string | null

  @column()
  declare principioAtivo: string

  @column()
  declare concentracao: string

  @column()
  declare formaFarmaceutica: string

  @column()
  declare viaAdministracao: string

  @column()
  declare unidadeFornecimento: string

  @column()
  declare grupoId: number | null

  @column()
  declare tipoControle:
    | 'COMUM'
    | 'CONTROLADO_PORTARIA_344'
    | 'ANTIMICROBIANO'
    | 'ALTO_CUSTO'
    | 'JUDICIAL'

  @column()
  declare pertenceRemume: boolean

  @column()
  declare cestaBasica: boolean

  @column()
  declare permiteFracionamento: boolean

  @column()
  declare exigeReceitaRetida: boolean

  @column()
  declare estoqueMinimo: number

  @column()
  declare estoqueIdeal: number

  @column()
  declare custoMedioPonderado: number

  @column()
  declare codigoBarras: string | null

  @column()
  declare bloqueado: boolean

  @column()
  declare motivoBloqueio: string | null

  @column()
  declare ativo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => GrupoMedicamento, { foreignKey: 'grupoId' })
  declare grupo: BelongsTo<typeof GrupoMedicamento>

  @hasMany(() => LoteMedicamento, { foreignKey: 'medicamentoId' })
  declare lotes: HasMany<typeof LoteMedicamento>

  @hasMany(() => MovimentacaoEstoque, { foreignKey: 'medicamentoId' })
  declare movimentacoes: HasMany<typeof MovimentacaoEstoque>
}
