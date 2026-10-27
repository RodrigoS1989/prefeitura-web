import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Tabela de Cotas Mensais de Regulação por Unidade Solicitante
    this.schema.createTable('cotas_agendamentos', (table) => {
      table.increments('id').primary()
      table
        .integer('unidade_solicitante_id')
        .unsigned()
        .references('id')
        .inTable('unidades_saude')
        .onDelete('CASCADE')
      table.string('tipo', 20).notNullable() // 'CONSULTA' | 'EXAME'
      table.string('especialidade_ou_exame', 150).notNullable() // ex: 'Cardiologia', 'Ultrassonografia Geral'
      table.string('mes_ano', 7).notNullable() // 'YYYY-MM'
      table.integer('cota_mensal').unsigned().defaultTo(0).notNullable()
      table.integer('cota_utilizada').unsigned().defaultTo(0).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()

      table.unique(['unidade_solicitante_id', 'tipo', 'especialidade_ou_exame', 'mes_ano'])
    })

    // Tabela de Agendamentos e Vagas Reguladas (Consultas e Exames SUS)
    this.schema.createTable('agendamentos', (table) => {
      table.increments('id').primary()
      table.string('protocolo', 30).unique().notNullable()
      table
        .integer('cidadao_id')
        .unsigned()
        .references('id')
        .inTable('cidadaos')
        .onDelete('RESTRICT')
      table
        .integer('unidade_solicitante_id')
        .unsigned()
        .references('id')
        .inTable('unidades_saude')
        .onDelete('RESTRICT')
      table
        .integer('unidade_executante_id')
        .unsigned()
        .references('id')
        .inTable('unidades_saude')
        .onDelete('RESTRICT')
      table
        .integer('profissional_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('profissionais')
        .onDelete('SET NULL')

      table.string('tipo', 20).notNullable() // 'CONSULTA' | 'EXAME'
      table.string('especialidade_ou_exame', 150).notNullable()
      table.timestamp('data_hora', { useTz: true }).notNullable()
      table.string('status', 20).defaultTo('AGENDADO').notNullable() // 'AGENDADO', 'CONFIRMADO', 'CANCELADO', 'ATENDIDO', 'FALTOU'
      table.string('prioridade', 20).defaultTo('NORMAL').notNullable() // 'NORMAL', 'URGENTE', 'PREFERENCIAL'
      table.text('motivo_cancelamento').nullable()
      table.text('observacoes').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()

      // Índice para buscas e conferência de concorrência
      table.index(['unidade_executante_id', 'data_hora'])
      table.index(['cidadao_id'])
      table.index(['status'])
    })
  }

  async down() {
    this.schema.dropTable('agendamentos')
    this.schema.dropTable('cotas_agendamentos')
  }
}