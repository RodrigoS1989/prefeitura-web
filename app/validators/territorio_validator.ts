import vine from '@vinejs/vine'

export const createBairroValidator = vine.compile(
  vine.object({
    nome: vine.string().trim().minLength(2).maxLength(100),
    zona: vine.enum(['urbana', 'rural']),
    municipioId: vine.number().optional(),
  })
)

export const createLogradouroValidator = vine.compile(
  vine.object({
    tipo: vine.string().trim().maxLength(30),
    nome: vine.string().trim().minLength(2).maxLength(150),
    cep: vine.string().trim().maxLength(10).optional(),
    bairroId: vine.number().optional(),
    municipioId: vine.number().optional(),
  })
)

export const createSecretariaValidator = vine.compile(
  vine.object({
    nome: vine.string().trim().minLength(3).maxLength(150),
    sigla: vine.string().trim().maxLength(20).optional(),
    responsavel: vine.string().trim().maxLength(120).optional(),
    email: vine.string().email().trim().optional(),
    telefone: vine.string().trim().maxLength(20).optional(),
    endereco: vine.string().trim().maxLength(200).optional(),
  })
)

export const updateParametroValidator = vine.compile(
  vine.object({
    razaoSocial: vine.string().trim().minLength(3).maxLength(150),
    nomeFantasia: vine.string().trim().maxLength(150).optional(),
    cnpj: vine.string().trim().maxLength(20).optional(),
    prefeito: vine.string().trim().maxLength(120).optional(),
    telefone: vine.string().trim().maxLength(20).optional(),
    email: vine.string().email().trim().optional(),
    endereco: vine.string().trim().maxLength(200).optional(),
    cep: vine.string().trim().maxLength(10).optional(),
    cidade: vine.string().trim().maxLength(100),
    uf: vine.string().trim().maxLength(2),
  })
)
