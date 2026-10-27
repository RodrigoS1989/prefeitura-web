import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // 1. Tabela de Grupos de Medicamentos (UPM428)
    this.schema.createTable('grupos_medicamentos', (table) => {
      table.increments('id').primary()
      table.string('codigo', 10).notNullable()
      table.string('nome', 100).notNullable()
      table
        .enum('tipo_controle_especial', [
          'COMUM',
          'PORTARIA_344_A',
          'PORTARIA_344_B',
          'PORTARIA_344_C',
          'ANTIMICROBIANO',
          'ALTO_CUSTO',
        ])
        .defaultTo('COMUM')
      table.boolean('ativo').defaultTo(true)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    // 2. Tabela Mestre de Medicamentos / Catálogo REMUME (UPM266, UPM473, UPM734)
    this.schema.createTable('medicamentos', (table) => {
      table.increments('id').primary()
      table.string('codigo', 30).notNullable().unique().index()
      table.string('catmat_codigo', 30).nullable().index()
      table.string('nome_comercial', 150).nullable()
      table.string('principio_ativo', 150).notNullable().index()
      table.string('concentracao', 80).notNullable()
      table.string('forma_farmaceutica', 80).notNullable()
      table.string('via_administracao', 50).notNullable()
      table.string('unidade_fornecimento', 30).defaultTo('COMPRIMIDO')

      table
        .integer('grupo_id')
        .unsigned()
        .references('id')
        .inTable('grupos_medicamentos')
        .onDelete('SET NULL')
        .nullable()
        .index()

      table
        .enum('tipo_controle', [
          'COMUM',
          'CONTROLADO_PORTARIA_344',
          'ANTIMICROBIANO',
          'ALTO_CUSTO',
          'JUDICIAL',
        ])
        .defaultTo('COMUM')
        .index()

      table.boolean('pertence_remume').defaultTo(true).index()
      table.boolean('cesta_basica').defaultTo(true)
      table.boolean('permite_fracionamento').defaultTo(false)
      table.boolean('exige_receita_retida').defaultTo(false)

      table.integer('estoque_minimo').defaultTo(100)
      table.integer('estoque_ideal').defaultTo(500)
      table.decimal('custo_medio_ponderado', 10, 4).defaultTo(0.0)
      table.string('codigo_barras', 50).nullable().index()

      table.boolean('bloqueado').defaultTo(false)
      table.string('motivo_bloqueio', 200).nullable()
      table.boolean('ativo').defaultTo(true).index()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    // 3. Tabela de Lotes, Validades e Algoritmo FEFO (UPM908, UPM915)
    this.schema.createTable('lotes_medicamentos', (table) => {
      table.increments('id').primary()

      table
        .integer('medicamento_id')
        .unsigned()
        .references('id')
        .inTable('medicamentos')
        .onDelete('RESTRICT')
        .notNullable()
        .index()

      table
        .integer('unidade_saude_id')
        .unsigned()
        .references('id')
        .inTable('unidades_saude')
        .onDelete('RESTRICT')
        .notNullable()
        .index()

      table.string('numero_lote', 50).notNullable().index()
      table.string('fabricante', 120).nullable()
      table.date('data_fabricacao').nullable()
      table.date('data_validade').notNullable().index() // Fundamental para o algoritmo FEFO

      table.integer('quantidade_inicial').notNullable()
      table.integer('quantidade_atual').notNullable().defaultTo(0)
      table.decimal('preco_unitario_compra', 10, 4).nullable()
      table.string('numero_nota_fiscal', 50).nullable()
      table.string('fornecedor_cnpj', 18).nullable()

      table
        .enum('status', ['ATIVO', 'QUARENTENA', 'VENCIDO', 'ESGOTADO', 'BLOQUEADO_ANVISA'])
        .defaultTo('ATIVO')
        .index()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    // 4. Kardex e Auditoria de Movimentações de Estoque (UPM183, UPM273)
    this.schema.createTable('movimentacoes_estoque', (table) => {
      table.increments('id').primary()

      table
        .integer('medicamento_id')
        .unsigned()
        .references('id')
        .inTable('medicamentos')
        .onDelete('RESTRICT')
        .notNullable()
        .index()

      table
        .integer('lote_id')
        .unsigned()
        .references('id')
        .inTable('lotes_medicamentos')
        .onDelete('RESTRICT')
        .notNullable()
        .index()

      table
        .integer('unidade_saude_id')
        .unsigned()
        .references('id')
        .inTable('unidades_saude')
        .onDelete('RESTRICT')
        .notNullable()
        .index()

      table
        .enum('tipo_movimentacao', [
          'ENTRADA_NOTA_FISCAL',
          'DISPENSACAO_PACIENTE',
          'TRANSFERENCIA_SAIDA',
          'TRANSFERENCIA_ENTRADA',
          'DOACAO_ENTRADA',
          'PERDA_AVARIA',
          'PERDA_VALIDADE_EXPIRADA',
          'ESTORNO_DISPENSACAO',
          'AJUSTE_INVENTARIO',
        ])
        .notNullable()
        .index()

      table.integer('quantidade').notNullable()
      table.integer('saldo_anterior').notNullable()
      table.integer('saldo_posterior').notNullable()

      table.string('numero_documento', 50).nullable()
      table.text('motivo_ajuste').nullable()

      table
        .integer('usuario_operador_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
    })

    // 5. Dispensações de Balcão (UPM271, UPM967)
    this.schema.createTable('dispensacoes', (table) => {
      table.increments('id').primary()
      table.string('numero_dispensacao', 30).notNullable().unique().index()

      table
        .integer('cidadao_id')
        .unsigned()
        .references('id')
        .inTable('cidadaos')
        .onDelete('RESTRICT')
        .notNullable()
        .index()

      table
        .integer('unidade_saude_id')
        .unsigned()
        .references('id')
        .inTable('unidades_saude')
        .onDelete('RESTRICT')
        .notNullable()
        .index()

      table
        .integer('profissional_prescritor_id')
        .unsigned()
        .references('id')
        .inTable('profissionais')
        .onDelete('SET NULL')
        .nullable()
        .index()

      table
        .integer('atendimento_id')
        .unsigned()
        .references('id')
        .inTable('atendimentos')
        .onDelete('SET NULL')
        .nullable()
        .index()

      table
        .integer('farmaceutico_dispensador_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .nullable()

      table
        .enum('tipo_dispensacao', [
          'RECEITA_AMBULATORIAL',
          'USO_CONTINUO',
          'JUDICIAL',
          'RECEITA_AVULSA',
          'PACIENTE_OBSERVACAO',
        ])
        .defaultTo('RECEITA_AMBULATORIAL')

      table.string('numero_receita', 50).nullable().index()
      table.date('data_receita').nullable()
      table
        .enum('status', ['CONCLUIDA', 'ESTORNADA_TOTAL', 'ESTORNADA_PARCIAL'])
        .defaultTo('CONCLUIDA')
        .index()

      table.text('observacoes').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    // 6. Itens da Dispensação (UPM953)
    this.schema.createTable('itens_dispensacao', (table) => {
      table.increments('id').primary()

      table
        .integer('dispensacao_id')
        .unsigned()
        .references('id')
        .inTable('dispensacoes')
        .onDelete('CASCADE')
        .notNullable()
        .index()

      table
        .integer('medicamento_id')
        .unsigned()
        .references('id')
        .inTable('medicamentos')
        .onDelete('RESTRICT')
        .notNullable()
        .index()

      table
        .integer('lote_id')
        .unsigned()
        .references('id')
        .inTable('lotes_medicamentos')
        .onDelete('RESTRICT')
        .notNullable()
        .index()

      table.integer('quantidade_prescrita').notNullable()
      table.integer('quantidade_dispensada').notNullable()
      table.string('posologia', 255).nullable()
      table.integer('tempo_tratamento_dias').nullable()
      table.date('proxima_dispensacao_em').nullable()
      table.boolean('estornado').defaultTo(false)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTableIfExists('itens_dispensacao')
    this.schema.dropTableIfExists('dispensacoes')
    this.schema.dropTableIfExists('movimentacoes_estoque')
    this.schema.dropTableIfExists('lotes_medicamentos')
    this.schema.dropTableIfExists('medicamentos')
    this.schema.dropTableIfExists('grupos_medicamentos')
  }
}
