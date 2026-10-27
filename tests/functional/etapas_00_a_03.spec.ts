import { test } from '@japa/runner'
import Cidadao from '#models/cidadao'
import Bairro from '#models/bairro'
import Logradouro from '#models/logradouro'
import UnidadeSaude from '#models/unidade_saude'
import Profissional from '#models/profissional'

test.group('Etapa 00: Fundação Arquitetural, Layout e Rotas Base', () => {
  test('deve renderizar a landing page municipal com sucesso', async ({ client }) => {
    const response = await client.get('/')
    response.assertStatus(200)
  })

  test('deve renderizar a tela de login do sistema', async ({ client }) => {
    const response = await client.get('/login')
    response.assertStatus(200)
  })

  test('deve renderizar o dashboard administrativo municipal', async ({ client }) => {
    const response = await client.get('/dashboard')
    response.assertStatus(200)
  })
})

test.group('Etapa 01: Módulo Cidadãos e CadÚnico', () => {
  test('deve listar os cidadãos cadastrados com paginação', async ({ client, assert }) => {
    const response = await client.get('/cidadaos')
    response.assertStatus(200)
    
    // Verifica se há cidadãos no banco
    const count = await Cidadao.query().count('* as total')
    assert.isAbove(Number(count[0].$extras.total), 0)
  })

  test('deve renderizar o formulário de cadastro de novo cidadão', async ({ client }) => {
    const response = await client.get('/cidadaos/novo')
    response.assertStatus(200)
  })

  test('deve exibir os detalhes do primeiro cidadão existente', async ({ client, assert }) => {
    const cidadao = await Cidadao.first()
    assert.isNotNull(cidadao)

    if (cidadao) {
      const response = await client.get(`/cidadaos/${cidadao.id}`)
      response.assertStatus(200)
    }
  })
})

test.group('Etapa 02: Território, Geografia e Parâmetros Municipais', () => {
  test('deve renderizar a página de gestão de território com bairros e logradouros', async ({ client, assert }) => {
    const response = await client.get('/territorio')
    response.assertStatus(200)

    const bairrosCount = await Bairro.query().count('* as total')
    const logradourosCount = await Logradouro.query().count('* as total')

    assert.isAbove(Number(bairrosCount[0].$extras.total), 0)
    assert.isAbove(Number(logradourosCount[0].$extras.total), 0)
  })

  test('deve responder à API de busca dinâmica de logradouros', async ({ client }) => {
    const response = await client.get('/api/logradouros/search?q=Avenida')
    response.assertStatus(200)
  })

  test('deve renderizar a tela de parâmetros institucionais da prefeitura', async ({ client }) => {
    const response = await client.get('/configuracoes/parametros')
    response.assertStatus(200)
  })
})

test.group('Etapa 03: Unidades de Saúde, Profissionais e Lotações', () => {
  test('deve listar as unidades de saúde municipais', async ({ client, assert }) => {
    const response = await client.get('/unidades')
    response.assertStatus(200)

    const unidadesCount = await UnidadeSaude.query().count('* as total')
    assert.isAbove(Number(unidadesCount[0].$extras.total), 0)
  })

  test('deve listar os profissionais de saúde com seus vínculos e CBOs', async ({ client, assert }) => {
    const response = await client.get('/profissionais')
    response.assertStatus(200)

    const profissionaisCount = await Profissional.query().count('* as total')
    assert.isAbove(Number(profissionaisCount[0].$extras.total), 0)
  })

  test('deve responder à API de autocompletar e busca de profissionais', async ({ client }) => {
    const response = await client.get('/api/profissionais/search?q=Dr')
    response.assertStatus(200)
  })
})
