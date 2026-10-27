import type { HttpContext } from '@adonisjs/core/http'
import ParametroPrefeitura from '#models/parametro_prefeitura'
import { updateParametroValidator } from '#validators/territorio_validator'

export default class ParametrosController {
  async index({ inertia }: HttpContext) {
    let parametros = await ParametroPrefeitura.find(1)
    if (!parametros) {
      parametros = await ParametroPrefeitura.create({
        id: 1,
        razaoSocial: 'Prefeitura Municipal',
        cidade: 'Município Sede',
        uf: 'SP',
      })
    }

    return inertia.render('configuracoes/parametros', {
      parametros: parametros.toJSON(),
    })
  }

  async update({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(updateParametroValidator)
    let parametros = await ParametroPrefeitura.find(1)
    if (!parametros) {
      parametros = new ParametroPrefeitura()
      parametros.id = 1
    }

    parametros.merge(payload)
    await parametros.save()

    session.flash('success', 'Parâmetros institucionais da prefeitura atualizados com sucesso!')
    return response.redirect().toRoute('parametros.index')
  }
}
