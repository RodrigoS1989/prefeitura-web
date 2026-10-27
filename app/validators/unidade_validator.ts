import vine from '@vinejs/vine'

export const createUnidadeValidator = vine.compile(
  vine.object({
    cnes: vine.string().trim().minLength(7).maxLength(7),
    razaoSocial: vine.string().trim().minLength(3).maxLength(150),
    nomeFantasia: vine.string().trim().minLength(3).maxLength(150),
    tipoUnidade: vine.enum([
      'UBS',
      'USF',
      'UPA',
      'CAPS',
      'POLICLINICA',
      'FARMACIA',
      'CENTRO_ESPECIALIDADES',
      'HOSPITAL_MUNICIPAL',
    ]),
    diretorTecnico: vine.string().trim().maxLength(120).optional(),
    telefone: vine.string().trim().maxLength(20).optional(),
    email: vine.string().email().trim().optional(),
    endereco: vine.string().trim().maxLength(200).optional(),
    bairroId: vine.number().optional(),
    horarioFuncionamento: vine.string().trim().maxLength(100).optional(),
    ativa: vine.boolean().optional(),
  })
)

export const updateUnidadeValidator = vine.compile(
  vine.object({
    cnes: vine.string().trim().minLength(7).maxLength(7).optional(),
    razaoSocial: vine.string().trim().minLength(3).maxLength(150).optional(),
    nomeFantasia: vine.string().trim().minLength(3).maxLength(150).optional(),
    tipoUnidade: vine
      .enum([
        'UBS',
        'USF',
        'UPA',
        'CAPS',
        'POLICLINICA',
        'FARMACIA',
        'CENTRO_ESPECIALIDADES',
        'HOSPITAL_MUNICIPAL',
      ])
      .optional(),
    diretorTecnico: vine.string().trim().maxLength(120).optional(),
    telefone: vine.string().trim().maxLength(20).optional(),
    email: vine.string().email().trim().optional(),
    endereco: vine.string().trim().maxLength(200).optional(),
    bairroId: vine.number().optional(),
    horarioFuncionamento: vine.string().trim().maxLength(100).optional(),
    ativa: vine.boolean().optional(),
  })
)
