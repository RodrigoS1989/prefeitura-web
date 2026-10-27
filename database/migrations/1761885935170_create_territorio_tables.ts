import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('municipios', (table) => {
      table.increments('id').primary()
      table.string('codigo_ibge', 7).nullable().index()
      table.string('nome', 120).notNullable().index()
      table.string('uf', 2).notNullable().index()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('bairros', (table) => {
      table.increments('id').primary()
      table.string('nome', 100).notNullable().index()
      table.enum('zona', ['urbana', 'rural']).defaultTo('urbana')
      table.integer('municipio_id').unsigned().references('id').inTable('municipios').onDelete('SET NULL').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('logradouros', (table) => {
      table.increments('id').primary()
      table.string('tipo', 30).defaultTo('Rua') // Rua, Avenida, Praça, Travessa, Alameda, Rodovia
      table.string('nome', 150).notNullable().index()
      table.string('cep', 10).nullable().index()
      table.integer('bairro_id').unsigned().references('id').inTable('bairros').onDelete('SET NULL').nullable()
      table.integer('municipio_id').unsigned().references('id').inTable('municipios').onDelete('SET NULL').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('secretarias', (table) => {
      table.increments('id').primary()
      table.string('nome', 150).notNullable().index()
      table.string('sigla', 20).nullable()
      table.string('responsavel', 120).nullable()
      table.string('email', 100).nullable()
      table.string('telefone', 20).nullable()
      table.string('endereco', 200).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('parametros_prefeitura', (table) => {
      table.increments('id').primary()
      table.string('razao_social', 150).notNullable()
      table.string('nome_fantasia', 150).nullable()
      table.string('cnpj', 20).nullable()
      table.string('prefeito', 120).nullable()
      table.string('telefone', 20).nullable()
      table.string('email', 100).nullable()
      table.string('endereco', 200).nullable()
      table.string('cep', 10).nullable()
      table.string('cidade', 100).defaultTo('Município Sede')
      table.string('uf', 2).defaultTo('SP')
      table.string('brasao_url', 255).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable('parametros_prefeitura')
    this.schema.dropTable('secretarias')
    this.schema.dropTable('logradouros')
    this.schema.dropTable('bairros')
    this.schema.dropTable('municipios')
  }
}
