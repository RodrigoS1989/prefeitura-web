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

// Módulo Recepção, Triagem Manchester & PEP (Etapa 4: Refatoração de UPM067, UPM976, UPM045, UPM764)
const AtendimentosController = () => import('#controllers/atendimentos_controller')
const PepController = () => import('#controllers/pep_controller')

router.get('/atendimentos', [AtendimentosController, 'index']).as('atendimentos.index')
router.post('/atendimentos', [AtendimentosController, 'store']).as('atendimentos.store')
router.post('/atendimentos/:id/triagem', [AtendimentosController, 'triagem']).as('atendimentos.triagem')
router.post('/atendimentos/:id/chamar', [AtendimentosController, 'chamar']).as('atendimentos.chamar')
router.post('/atendimentos/:id/cancelar', [AtendimentosController, 'cancelar']).as('atendimentos.cancelar')
router.post('/atendimentos/:id/finalizar', [AtendimentosController, 'finalizar']).as('atendimentos.finalizar')
router.get('/api/cidadaos/search', [AtendimentosController, 'apiSearchCidadaos']).as('api.cidadaos.search')

// PEP (Prontuário Eletrônico do Paciente)
router.get('/api/pep/:id', [PepController, 'show']).as('api.pep.show')
router.post('/atendimentos/:id/pep/evolucao', [PepController, 'storeEvolucao']).as('pep.evolucao')
router.post('/atendimentos/:id/pep/prescricao', [PepController, 'storePrescricao']).as('pep.prescricao')
router.post('/atendimentos/:id/pep/exame', [PepController, 'storeExame']).as('pep.exame')
router.post('/atendimentos/:id/pep/atestado', [PepController, 'storeAtestado']).as('pep.atestado')

// Módulo Farmácia Municipal, Estoque REMUME e Dispensação FEFO (Etapa 05: UPM266, UPM908, UPM271)
const FarmaciaController = () => import('#controllers/farmacia_controller')

router.get('/farmacia', [FarmaciaController, 'index']).as('farmacia.index')
router.post('/farmacia/medicamentos', [FarmaciaController, 'storeMedicamento']).as('farmacia.medicamentos.store')
router.post('/farmacia/lotes', [FarmaciaController, 'storeLote']).as('farmacia.lotes.store')
router.get('/api/farmacia/medicamentos/:id/lotes', [FarmaciaController, 'lotesPorMedicamento']).as('api.farmacia.lotes')
router.post('/farmacia/dispensar', [FarmaciaController, 'dispensar']).as('farmacia.dispensar')

// Módulo Agendamento & Regulação de Consultas/Exames (Etapa 06: UPM216, UPM201, PMD044)
const AgendamentosController = () => import('#controllers/agendamentos_controller')

router.get('/agendamentos', [AgendamentosController, 'index']).as('agendamentos.index')
router.post('/agendamentos', [AgendamentosController, 'store']).as('agendamentos.store')
router.post('/agendamentos/:id/cancelar', [AgendamentosController, 'cancelar']).as('agendamentos.cancelar')
router.post('/agendamentos/:id/confirmar', [AgendamentosController, 'confirmar']).as('agendamentos.confirmar')
router.get('/api/agendamentos/cotas', [AgendamentosController, 'apiCotas']).as('api.agendamentos.cotas')

// Sessão & Logout (Etapa 00)
router.post('logout', [controllers.Session, 'destroy'])


