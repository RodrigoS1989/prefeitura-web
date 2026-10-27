import vine from '@vinejs/vine'

export const evolucaoSoapValidator = vine.compile(
  vine.object({
    subjetivo: vine.string().trim().minLength(3),
    objetivo: vine.string().trim().minLength(3),
    avaliacao: vine.string().trim().minLength(3),
    planoConduta: vine.string().trim().minLength(3),
    profissionalId: vine.number().positive().optional(),
    cid10Codigo: vine.string().trim().optional(),
    cid10Descricao: vine.string().trim().optional(),
  })
)

export const prescricaoValidator = vine.compile(
  vine.object({
    nomeMedicamento: vine.string().trim().minLength(2),
    posologia: vine.string().trim().minLength(3),
    quantidadePrescrita: vine.number().positive(),
    viaAdministracao: vine.string().optional(),
    usoContinuo: vine.boolean().optional(),
    orientacoes: vine.string().optional(),
  })
)

export const solicitacaoExameValidator = vine.compile(
  vine.object({
    descricaoExame: vine.string().trim().minLength(3),
    tipoExame: vine.enum(['LABORATORIAL', 'IMAGEM', 'GRAFICO', 'ENDOSCOPIA']).optional(),
    justificativaClinica: vine.string().trim().optional(),
    urgente: vine.boolean().optional(),
  })
)

export const atestadoValidator = vine.compile(
  vine.object({
    tipoAtestado: vine.string().optional(),
    diasAfastamento: vine.number().min(0),
    dataInicioAfastamento: vine.string().optional(),
    cid10Codigo: vine.string().optional(),
    autorizaDivulgacaoCid: vine.boolean().optional(),
    observacoes: vine.string().optional(),
  })
)
