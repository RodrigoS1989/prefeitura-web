/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

// Landing institucional e apresentação
router.on('/').renderInertia('home', {}).as('home')

// Autenticação (Guest)
router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

// Módulos do Sistema Municipal
router.on('/dashboard').renderInertia('dashboard', {}).as('dashboard')

// Módulo Cidadãos (Etapa 1: Refatoração de UPM002.pas)
router.get('/cidadaos', [controllers.Cidadaos, 'index']).as('cidadaos.index')
router.get('/cidadaos/novo', [controllers.Cidadaos, 'create']).as('cidadaos.create')
router.post('/cidadaos', [controllers.Cidadaos, 'store']).as('cidadaos.store')
router.get('/cidadaos/:id', [controllers.Cidadaos, 'show']).as('cidadaos.show')
router.get('/cidadaos/:id/editar', [controllers.Cidadaos, 'edit']).as('cidadaos.edit')
router.put('/cidadaos/:id', [controllers.Cidadaos, 'update']).as('cidadaos.update')
router.delete('/cidadaos/:id', [controllers.Cidadaos, 'destroy']).as('cidadaos.destroy')

// Domínio Território, Geografia & Parâmetros (Etapa 2: Refatoração de UPM983, UPM985, UPM393, ARQ001)
const TerritoriosController = () => import('#controllers/territorios_controller')
const ParametrosController = () => import('#controllers/parametros_controller')

router.get('/territorio', [TerritoriosController, 'index']).as('territorio.index')
router.post('/territorio/bairros', [TerritoriosController, 'storeBairro']).as('territorio.bairros.store')
router.delete('/territorio/bairros/:id', [TerritoriosController, 'destroyBairro']).as('territorio.bairros.destroy')
router.post('/territorio/logradouros', [TerritoriosController, 'storeLogradouro']).as('territorio.logradouros.store')
router.delete('/territorio/logradouros/:id', [TerritoriosController, 'destroyLogradouro']).as('territorio.logradouros.destroy')
router.post('/territorio/secretarias', [TerritoriosController, 'storeSecretaria']).as('territorio.secretarias.store')
router.delete('/territorio/secretarias/:id', [TerritoriosController, 'destroySecretaria']).as('territorio.secretarias.destroy')
router.get('/api/logradouros/search', [TerritoriosController, 'apiSearch']).as('api.logradouros.search')

// Parâmetros Institucionais da Prefeitura
router.get('/configuracoes/parametros', [ParametrosController, 'index']).as('parametros.index')
router.put('/configuracoes/parametros', [ParametrosController, 'update']).as('parametros.update')

// Domínio Profissionais, Especialidades (CBO) & Unidades de Saúde (Etapa 3: Refatoração de UPM020, UPM024, UPM457)
const UnidadesController = () => import('#controllers/unidades_controller')
const ProfissionaisController = () => import('#controllers/profissionais_controller')

router.get('/unidades', [UnidadesController, 'index']).as('unidades.index')
router.post('/unidades', [UnidadesController, 'store']).as('unidades.store')
router.put('/unidades/:id', [UnidadesController, 'update']).as('unidades.update')
router.patch('/unidades/:id/toggle', [UnidadesController, 'toggleStatus']).as('unidades.toggle')

router.get('/profissionais', [ProfissionaisController, 'index']).as('profissionais.index')
router.post('/profissionais', [ProfissionaisController, 'store']).as('profissionais.store')
router.put('/profissionais/:id', [ProfissionaisController, 'update']).as('profissionais.update')
router.get('/api/profissionais/search', [ProfissionaisController, 'apiSearch']).as('api.profissionais.search')

// Sessão & Logout (Etapa 00)
router.post('logout', [controllers.Session, 'destroy'])
