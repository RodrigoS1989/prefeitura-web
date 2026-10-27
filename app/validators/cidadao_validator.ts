import vine from '@vinejs/vine'

export const createCidadaoValidator = vine.compile(
  vine.object({
    cpf: vine.string().trim().optional(),
    cns: vine.string().trim().optional(),
    nis: vine.string().trim().optional(),
    rg: vine.string().trim().optional(),
    rgOrgaoEmissor: vine.string().trim().optional(),
    nomeCompleto: vine.string().trim().minLength(3).maxLength(150),
    nomeSocial: vine.string().trim().maxLength(150).optional(),
    nomeMae: vine.string().trim().maxLength(150).optional(),
    nomePai: vine.string().trim().maxLength(150).optional(),
    dataNascimento: vine.string().trim(),
    sexo: vine.enum(['M', 'F', 'O']).optional(),
    racaCor: vine.string().trim().optional(),
    nacionalidade: vine.string().trim().optional(),
    cep: vine.string().trim().optional(),
    logradouro: vine.string().trim().maxLength(150).optional(),
    numero: vine.string().trim().maxLength(20).optional(),
    complemento: vine.string().trim().maxLength(50).optional(),
    bairro: vine.string().trim().maxLength(80).optional(),
    municipio: vine.string().trim().maxLength(80).optional(),
    uf: vine.string().trim().maxLength(2).optional(),
    telefoneCelular: vine.string().trim().maxLength(20).optional(),
    telefoneFixo: vine.string().trim().maxLength(20).optional(),
    email: vine.string().email().trim().optional(),
    unidadeSaude: vine.string().trim().optional(),
    situacaoCadastral: vine.enum(['ativo', 'inativo', 'obito']).optional(),
    observacoes: vine.string().trim().optional(),
  })
)

export const updateCidadaoValidator = createCidadaoValidator
