import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import Cidadao from '#models/cidadao'
import UnidadeSaude from '#models/unidade_saude'
import Profissional from '#models/profissional'
import SinalVital from '#models/sinal_vital'
import EvolucaoClinica from '#models/evolucao_clinica'
import DiagnosticoAtendimento from '#models/diagnostico_atendimento'
import PrescricaoMedicamento from '#models/prescricao_medicamento'
import SolicitacaoExame from '#models/solicitacao_exame'
import AtestadoMedico from '#models/atestado_medico'

export default class Atendimento extends BaseModel {
  public static table = 'atendimentos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare numeroAtendimento: string

  @column()
  declare codigoBarras: string | null

  @column()
  declare senhaPainel: string

  @column()
  declare cidadaoId: number

  @column()
  declare unidadeSaudeId: number

  @column()
  declare profissionalId: number | null

  @column()
  declare tipoAtendimento:
    | 'DEMANDA_ESPONTANEA'
    | 'CONSULTA_AGENDADA'
    | 'URGENCIA_EMERGENCIA'
    | 'RETORNO'
    | 'PRE_NATAL'
    | 'PUERICULTURA'
    | 'PROCEDIMENTO_ENFERMAGEM'
    | 'ODONTOLOGIA'

  @column()
  declare caraterAtendimento: string

  @column()
  declare status:
    | 'AGUARDANDO_TRIAGEM'
    | 'EM_TRIAGEM'
    | 'AGUARDANDO_ATENDIMENTO'
    | 'EM_ATENDIMENTO'
    | 'EM_OBSERVACAO'
    | 'FINALIZADO'
    | 'CANCELADO'
    | 'ENCAMINHADO'

  @column()
  declare motivoCancelamento: string | null

  @column()
  declare prioridadeManchester: 'VERMELHO' | 'LARANJA' | 'AMARELO' | 'VERDE' | 'AZUL'

  @column()
  declare discriminadorManchester: string | null

  @column()
  declare tempoAlvoMinutos: number

  @column()
  declare queixaPrincipal: string | null

  @column()
  declare sigiloso: boolean

  @column.dateTime()
  declare dataHoraChegada: DateTime

  @column.dateTime()
  declare dataHoraTriagem: DateTime | null

  @column.dateTime()
  declare dataHoraInicioAtendimento: DateTime | null

  @column.dateTime()
  declare dataHoraFinalizacao: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Cidadao, { foreignKey: 'cidadaoId' })
  declare cidadao: BelongsTo<typeof Cidadao>

  @belongsTo(() => UnidadeSaude, { foreignKey: 'unidadeSaudeId' })
  declare unidadeSaude: BelongsTo<typeof UnidadeSaude>

  @belongsTo(() => Profissional, { foreignKey: 'profissionalId' })
  declare profissional: BelongsTo<typeof Profissional>

  @hasOne(() => SinalVital, { foreignKey: 'atendimentoId' })
  declare sinaisVitais: HasOne<typeof SinalVital>

  @hasOne(() => EvolucaoClinica, { foreignKey: 'atendimentoId' })
  declare evolucao: HasOne<typeof EvolucaoClinica>

  @hasMany(() => DiagnosticoAtendimento, { foreignKey: 'atendimentoId' })
  declare diagnosticos: HasMany<typeof DiagnosticoAtendimento>

  @hasMany(() => PrescricaoMedicamento, { foreignKey: 'atendimentoId' })
  declare prescricoes: HasMany<typeof PrescricaoMedicamento>

  @hasMany(() => SolicitacaoExame, { foreignKey: 'atendimentoId' })
  declare exames: HasMany<typeof SolicitacaoExame>

  @hasMany(() => AtestadoMedico, { foreignKey: 'atendimentoId' })
  declare atestados: HasMany<typeof AtestadoMedico>
}
