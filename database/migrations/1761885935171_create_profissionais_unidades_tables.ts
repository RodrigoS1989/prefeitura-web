import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('unidades_saude', (table) => {
      table.increments('id').primary()
      table.string('cnes', 7).notNullable().unique().index()
      table.string('razao_social', 150).notNullable()
      table.string('nome_fantasia', 150).notNullable().index()
      table
        .enum('tipo_unidade', [
          'UBS',
          'USF',
          'UPA',
          'CAPS',
          'POLICLINICA',
          'FARMACIA',
          'CENTRO_ESPECIALIDADES',
          'HOSPITAL_MUNICIPAL',
        ])
        .defaultTo('UBS')
      table.string('diretor_tecnico', 120).nullable()
      table.string('telefone', 20).nullable()
      table.string('email', 100).nullable()
      table.string('endereco', 200).nullable()
      table
        .integer('bairro_id')
        .unsigned()
        .references('id')
        .inTable('bairros')
        .onDelete('SET NULL')
        .nullable()
      table.string('horario_funcionamento', 100).defaultTo('07:00 às 17:00')
      table.boolean('ativa').defaultTo(true).index()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('conselhos_profissionais', (table) => {
      table.increments('id').primary()
      table.string('sigla', 15).notNullable().index()
      table.string('nome', 120).notNullable()
      table.string('uf', 2).defaultTo('SP')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('especialidades_medicas', (table) => {
      table.increments('id').primary()
      table.string('codigo', 20).notNullable().index()
      table.string('nome', 120).notNullable().index()
      table.text('descricao').nullable()
      table.string('registro_conselho', 50).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('cbos', (table) => {
      table.increments('id').primary()
      table.string('codigo', 10).notNullable().index()
      table.string('ocupacao', 150).notNullable().index()
      table.string('tipo', 50).defaultTo('Saúde')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('profissionais', (table) => {
      table.increments('id').primary()
      table.integer('codope').nullable().index()
      table.string('nome', 150).notNullable().index()
      table.string('cpf', 14).notNullable().unique().index()
      table.string('cns', 15).nullable().index()
      table.string('email', 100).nullable()
      table.string('telefone', 20).nullable()
      table
        .integer('conselho_id')
        .unsigned()
        .references('id')
        .inTable('conselhos_profissionais')
        .onDelete('SET NULL')
        .nullable()
      table.string('numero_conselho', 30).nullable().index()
      table
        .integer('cbo_id')
        .unsigned()
        .references('id')
        .inTable('cbos')
        .onDelete('SET NULL')
        .nullable()
      table.enum('status', ['ativo', 'inativo', 'afastado']).defaultTo('ativo').index()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('vinculos_lotacoes', (table) => {
      table.increments('id').primary()
      table
        .integer('profissional_id')
        .unsigned()
        .references('id')
        .inTable('profissionais')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('unidade_saude_id')
        .unsigned()
        .references('id')
        .inTable('unidades_saude')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('especialidade_id')
        .unsigned()
        .references('id')
        .inTable('especialidades_medicas')
        .onDelete('SET NULL')
        .nullable()
      table.integer('carga_horaria').defaultTo(40)
      table.string('cargo', 80).nullable()
      table.boolean('ativo').defaultTo(true).index()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable('vinculos_lotacoes')
    this.schema.dropTable('profissionais')
    this.schema.dropTable('cbos')
    this.schema.dropTable('especialidades_medicas')
    this.schema.dropTable('conselhos_profissionais')
    this.schema.dropTable('unidades_saude')
  }
}
