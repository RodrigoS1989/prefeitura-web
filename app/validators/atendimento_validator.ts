import vine from '@vinejs/vine'

export const createAtendimentoValidator = vine.compile(
  vine.object({
    cidadaoId: vine.number().positive(),
    unidadeSaudeId: vine.number().positive(),
    tipoAtendimento: vine.enum([
      'DEMANDA_ESPONTANEA',
      'CONSULTA_AGENDADA',
      'URGENCIA_EMERGENCIA',
      'RETORNO',
      'PRE_NATAL',
      'PUERICULTURA',
      'PROCEDIMENTO_ENFERMAGEM',
      'ODONTOLOGIA',
    ]),
    queixaPrincipal: vine.string().trim().optional(),
    sigiloso: vine.boolean().optional(),
  })
)

export const triagemValidator = vine.compile(
  vine.object({
    prioridadeManchester: vine.enum(['VERMELHO', 'LARANJA', 'AMARELO', 'VERDE', 'AZUL']),
    discriminadorManchester: vine.string().trim(),
    tempoAlvoMinutos: vine.number().optional(),
    paSistolica: vine.number().optional(),
    paDiastolica: vine.number().optional(),
    frequenciaCardiaca: vine.number().optional(),
    frequenciaRespiratoria: vine.number().optional(),
    temperatura: vine.number().optional(),
    saturacaoO2: vine.number().optional(),
    peso: vine.number().optional(),
    altura: vine.number().optional(),
    glicemiaCapilar: vine.number().optional(),
    escalaDor: vine.number().optional(),
    observacoesTriagem: vine.string().trim().optional(),
  })
)

export const cancelarAtendimentoValidator = vine.compile(
  vine.object({
    motivoCancelamento: vine.string().trim().minLength(3),
  })
)
