import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Municipio from '#models/municipio'
import Bairro from '#models/bairro'
import Logradouro from '#models/logradouro'
import Secretaria from '#models/secretaria'
import ParametroPrefeitura from '#models/parametro_prefeitura'

export default class extends BaseSeeder {
  async run() {
    // 1. Município Sede
    const mun = await Municipio.firstOrCreate(
      { nome: 'Santa Maria das Águas', uf: 'SP' },
      {
        codigoIbge: '3545803',
        nome: 'Santa Maria das Águas',
        uf: 'SP',
      }
    )

    // 2. Bairros
    const bairrosData = [
      { nome: 'Centro', zona: 'urbana' as const },
      { nome: 'Jardim Alvorada', zona: 'urbana' as const },
      { nome: 'Vila Esperança', zona: 'urbana' as const },
      { nome: 'Parque das Nações', zona: 'urbana' as const },
      { nome: 'Distrito Industrial', zona: 'urbana' as const },
      { nome: 'Assentamento Boa Vista', zona: 'rural' as const },
    ]

    const createdBairros: Bairro[] = []
    for (const b of bairrosData) {
      const bairro = await Bairro.firstOrCreate(
        { nome: b.nome, municipioId: mun.id },
        { nome: b.nome, zona: b.zona, municipioId: mun.id }
      )
      createdBairros.push(bairro)
    }

    // 3. Logradouros
    const centro = createdBairros[0]
    const alvorada = createdBairros[1]
    const vilaEsperanca = createdBairros[2]

    const logradourosData = [
      { tipo: 'Avenida', nome: 'Brasil', cep: '13100-000', bairroId: centro.id },
      { tipo: 'Rua', nome: 'XV de Novembro', cep: '13100-010', bairroId: centro.id },
      { tipo: 'Praça', nome: 'da Matriz', cep: '13100-020', bairroId: centro.id },
      { tipo: 'Rua', nome: 'das Flores', cep: '13105-100', bairroId: alvorada.id },
      { tipo: 'Avenida', nome: 'das Palmeiras', cep: '13105-200', bairroId: alvorada.id },
      { tipo: 'Rua', nome: 'Três Irmãos', cep: '13108-050', bairroId: vilaEsperanca.id },
      { tipo: 'Travessa', nome: 'da Paz', cep: '13108-060', bairroId: vilaEsperanca.id },
    ]

    for (const l of logradourosData) {
      await Logradouro.firstOrCreate(
        { nome: l.nome, tipo: l.tipo, bairroId: l.bairroId },
        {
          tipo: l.tipo,
          nome: l.nome,
          cep: l.cep,
          bairroId: l.bairroId,
          municipioId: mun.id,
        }
      )
    }

    // 4. Secretarias Municipais
    const secretariasData = [
      {
        nome: 'Secretaria Municipal de Saúde',
        sigla: 'SMS',
        responsavel: 'Dra. Helena Moreira Guimarães',
        email: 'saude@prefeitura.gov.br',
        telefone: '(19) 3455-8100',
        endereco: 'Av. Brasil, 450 - Centro',
      },
      {
        nome: 'Secretaria Municipal de Promoção Social (CRAS/CREAS)',
        sigla: 'SMPS',
        responsavel: 'Marcelo Castro Vieira',
        email: 'social@prefeitura.gov.br',
        telefone: '(19) 3455-8200',
        endereco: 'Rua das Flores, 120 - Jd. Alvorada',
      },
      {
        nome: 'Secretaria de Administração e Governo',
        sigla: 'SMAG',
        responsavel: 'Carlos Eduardo Ferreira',
        email: 'governo@prefeitura.gov.br',
        telefone: '(19) 3455-8000',
        endereco: 'Praça da Matriz, 1 - Centro',
      },
      {
        nome: 'Secretaria de Educação e Cultura',
        sigla: 'SMEC',
        responsavel: 'Profa. Fernanda Lopes',
        email: 'educacao@prefeitura.gov.br',
        telefone: '(19) 3455-8300',
        endereco: 'Rua XV de Novembro, 780 - Centro',
      },
    ]

    for (const s of secretariasData) {
      await Secretaria.firstOrCreate(
        { nome: s.nome },
        s
      )
    }

    // 5. Parâmetros Gerais da Prefeitura
    await ParametroPrefeitura.firstOrCreate(
      { id: 1 },
      {
        razaoSocial: 'Prefeitura Municipal de Santa Maria das Águas',
        nomeFantasia: 'Prefeitura Municipal',
        cnpj: '45.123.456/0001-89',
        prefeito: 'Dr. Roberto Silveira Martins',
        telefone: '(19) 3455-8000',
        email: 'gabinete@prefeitura.gov.br',
        endereco: 'Praça da Matriz, nº 1',
        cep: '13100-000',
        cidade: 'Santa Maria das Águas',
        uf: 'SP',
        brasaoUrl: '/images/brasao_municipal.png',
      }
    )
  }
}
