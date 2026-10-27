import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cidadaos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      // Identificação Civil & SUS
      table.string('cpf', 14).nullable().unique().index()
      table.string('cns', 15).nullable().index() // Cartão Nacional de Saúde
      table.string('nis', 11).nullable().index() // CadÚnico / PIS / PASEP
      table.string('rg', 20).nullable()
      table.string('rg_orgao_emissor', 20).nullable()

      // Dados Pessoais
      table.string('nome_completo', 150).notNullable().index()
      table.string('nome_social', 150).nullable()
      table.string('nome_mae', 150).nullable()
      table.string('nome_pai', 150).nullable()
      table.date('data_nascimento').notNullable()
      table.string('sexo', 1).defaultTo('O') // M, F, O
      table.string('raca_cor', 30).nullable()
      table.string('nacionalidade', 50).defaultTo('Brasileira')

      // Endereço & Localização
      table.string('cep', 9).nullable()
      table.string('logradouro', 150).nullable()
      table.string('numero', 20).nullable()
      table.string('complemento', 50).nullable()
      table.string('bairro', 80).nullable()
      table.string('municipio', 80).defaultTo('São Paulo')
      table.string('uf', 2).defaultTo('SP')

      // Contato
      table.string('telefone_celular', 20).nullable()
      table.string('telefone_fixo', 20).nullable()
      table.string('email', 100).nullable()

      // Vínculos Municipais
      table.string('unidade_saude', 100).defaultTo('UBS Central')
      table.string('situacao_cadastral', 20).defaultTo('ativo') // ativo, inativo, obito
      table.text('observacoes').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
