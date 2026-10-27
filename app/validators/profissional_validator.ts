import vine from '@vinejs/vine'

export const createProfissionalValidator = vine.compile(
  vine.object({
    nome: vine.string().trim().minLength(3).maxLength(150),
    cpf: vine.string().trim().maxLength(14),
    cns: vine.string().trim().maxLength(15).optional(),
    email: vine.string().email().trim().optional(),
    telefone: vine.string().trim().maxLength(20).optional(),
    conselhoId: vine.number().optional(),
    numeroConselho: vine.string().trim().maxLength(30).optional(),
    cboId: vine.number().optional(),
    status: vine.enum(['ativo', 'inativo', 'afastado']).optional(),
    unidadeId: vine.number().optional(),
    especialidadeId: vine.number().optional(),
    cargaHoraria: vine.number().min(1).max(60).optional(),
    cargo: vine.string().trim().maxLength(80).optional(),
  })
)

export const updateProfissionalValidator = vine.compile(
  vine.object({
    nome: vine.string().trim().minLength(3).maxLength(150).optional(),
    cpf: vine.string().trim().maxLength(14).optional(),
    cns: vine.string().trim().maxLength(15).optional(),
    email: vine.string().email().trim().optional(),
    telefone: vine.string().trim().maxLength(20).optional(),
    conselhoId: vine.number().optional(),
    numeroConselho: vine.string().trim().maxLength(30).optional(),
    cboId: vine.number().optional(),
    status: vine.enum(['ativo', 'inativo', 'afastado']).optional(),
  })
)
