import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // 1. Tabela Central de Atendimentos (FAA - Ficha de Atendimento Ambulatorial / UPM067, UPM764)
    this.schema.createTable('atendimentos', (table) => {
      table.increments('id').primary()
      table.string('numero_atendimento', 25).notNullable().unique().index()
      table.string('codigo_barras', 30).nullable().index()
      table.string('senha_painel', 10).notNullable().index()

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
        .integer('profissional_id')
        .unsigned()
        .references('id')
        .inTable('profissionais')
        .onDelete('SET NULL')
        .nullable()
        .index()

      table
        .enum('tipo_atendimento', [
          'DEMANDA_ESPONTANEA',
          'CONSULTA_AGENDADA',
          'URGENCIA_EMERGENCIA',
          'RETORNO',
          'PRE_NATAL',
          'PUERICULTURA',
          'PROCEDIMENTO_ENFERMAGEM',
          'ODONTOLOGIA',
        ])
        .defaultTo('DEMANDA_ESPONTANEA')

      table.string('carater_atendimento', 2).defaultTo('01')

      table
        .enum('status', [
          'AGUARDANDO_TRIAGEM',
          'EM_TRIAGEM',
          'AGUARDANDO_ATENDIMENTO',
          'EM_ATENDIMENTO',
          'EM_OBSERVACAO',
          'FINALIZADO',
          'CANCELADO',
          'ENCAMINHADO',
        ])
        .defaultTo('AGUARDANDO_TRIAGEM')
        .index()

      table.string('motivo_cancelamento', 255).nullable()

      table
        .enum('prioridade_manchester', ['VERMELHO', 'LARANJA', 'AMARELO', 'VERDE', 'AZUL'])
        .defaultTo('VERDE')
        .index()

      table.string('discriminador_manchester', 100).nullable()
      table.integer('tempo_alvo_minutos').defaultTo(120)
      table.text('queixa_principal').nullable()
      table.boolean('sigiloso').defaultTo(false)

      table.timestamp('data_hora_chegada').notNullable().index()
      table.timestamp('data_hora_triagem').nullable()
      table.timestamp('data_hora_inicio_atendimento').nullable()
      table.timestamp('data_hora_finalizacao').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    // 2. Sinais Vitais e Biometria da Triagem (UPM976)
    this.schema.createTable('sinais_vitais', (table) => {
      table.increments('id').primary()
      table
        .integer('atendimento_id')
        .unsigned()
        .references('id')
        .inTable('atendimentos')
        .onDelete('CASCADE')
        .notNullable()
        .index()

      table
        .integer('triador_profissional_id')
        .unsigned()
        .references('id')
        .inTable('profissionais')
        .onDelete('SET NULL')
        .nullable()

      table.integer('pa_sistolica').nullable()
      table.integer('pa_diastolica').nullable()
      table.integer('frequencia_cardiaca').nullable()
      table.integer('frequencia_respiratoria').nullable()
      table.decimal('temperatura', 4, 1).nullable()
      table.integer('saturacao_o2').nullable()
      table.decimal('peso', 5, 2).nullable()
      table.decimal('altura', 4, 2).nullable()
      table.decimal('imc', 4, 1).nullable()
      table.decimal('perimetro_cefalico', 4, 1).nullable()
      table.integer('glicemia_capilar').nullable()
      table.integer('escala_dor').nullable()
      table.text('observacoes_triagem').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    // 3. Evoluções Clínicas do Prontuário Eletrônico - Método SOAP (UPM045)
    this.schema.createTable('evolucoes_clinicas', (table) => {
      table.increments('id').primary()
      table
        .integer('atendimento_id')
        .unsigned()
        .references('id')
        .inTable('atendimentos')
        .onDelete('CASCADE')
        .notNullable()
        .index()

      table
        .integer('profissional_id')
        .unsigned()
        .references('id')
        .inTable('profissionais')
        .onDelete('RESTRICT')
        .notNullable()
        .index()

      table.text('subjetivo').notNullable()
      table.text('objetivo').notNullable()
      table.text('avaliacao').notNullable()
      table.text('plano_conduta').notNullable()

      table.boolean('assinado_digitalmente').defaultTo(false)
      table.timestamp('data_hora_assinatura').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    // 4. Diagnósticos Clínicos (CID-10 / CIAP-2)
    this.schema.createTable('diagnosticos_atendimento', (table) => {
      table.increments('id').primary()
      table
        .integer('atendimento_id')
        .unsigned()
        .references('id')
        .inTable('atendimentos')
        .onDelete('CASCADE')
        .notNullable()
        .index()

      table.string('cid10_codigo', 10).notNullable().index()
      table.string('cid10_descricao', 255).notNullable()
      table.string('ciap2_codigo', 10).nullable()
      table.enum('tipo', ['PRINCIPAL', 'SECUNDARIO', 'HIPOTESE']).defaultTo('PRINCIPAL')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    // 5. Prescrições de Medicamentos (Receituário Digital Ambulatorial)
    this.schema.createTable('prescricoes_medicamentos', (table) => {
      table.increments('id').primary()
      table
        .integer('atendimento_id')
        .unsigned()
        .references('id')
        .inTable('atendimentos')
        .onDelete('CASCADE')
        .notNullable()
        .index()

      table.string('nome_medicamento', 150).notNullable()
      table.string('forma_farmaceutica', 50).nullable()
      table.string('concentracao_dosagem', 60).nullable()
      table.string('via_administracao', 30).defaultTo('ORAL')
      table.string('posologia', 200).notNullable()
      table.integer('quantidade_prescrita').notNullable()
      table.integer('duracao_dias').nullable()
      table.boolean('uso_continuo').defaultTo(false)
      table.text('orientacoes').nullable()
      table.string('codigo_autenticidade_receita', 30).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    // 6. Solicitações de Exames Complementares (UPM341)
    this.schema.createTable('solicitacoes_exames', (table) => {
      table.increments('id').primary()
      table
        .integer('atendimento_id')
        .unsigned()
        .references('id')
        .inTable('atendimentos')
        .onDelete('CASCADE')
        .notNullable()
        .index()

      table.string('procedimento_sigtap_codigo', 10).nullable()
      table.string('descricao_exame', 150).notNullable()
      table.string('tipo_exame', 30).defaultTo('LABORATORIAL')
      table.text('justificativa_clinica').nullable()
      table.boolean('urgente').defaultTo(false)
      table.string('status', 20).defaultTo('SOLICITADO')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    // 7. Atestados Médicos com Autenticidade (PM1044 / UPM876)
    this.schema.createTable('atestados_medicos', (table) => {
      table.increments('id').primary()
      table
        .integer('atendimento_id')
        .unsigned()
        .references('id')
        .inTable('atendimentos')
        .onDelete('CASCADE')
        .notNullable()
        .index()

      table
        .integer('profissional_id')
        .unsigned()
        .references('id')
        .inTable('profissionais')
        .onDelete('RESTRICT')
        .notNullable()

      table
        .integer('cidadao_id')
        .unsigned()
        .references('id')
        .inTable('cidadaos')
        .onDelete('RESTRICT')
        .notNullable()

      table.string('tipo_atestado', 30).defaultTo('AFASTAMENTO')
      table.integer('dias_afastamento').defaultTo(0)
      table.date('data_inicio_afastamento').nullable()
      table.string('cid10_codigo', 10).nullable()
      table.boolean('autoriza_divulgacao_cid').defaultTo(true)
      table.text('observacoes').nullable()
      table.string('codigo_autenticidade', 36).notNullable().unique()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTableIfExists('atestados_medicos')
    this.schema.dropTableIfExists('solicitacoes_exames')
    this.schema.dropTableIfExists('prescricoes_medicamentos')
    this.schema.dropTableIfExists('diagnosticos_atendimento')
    this.schema.dropTableIfExists('evolucoes_clinicas')
    this.schema.dropTableIfExists('sinais_vitais')
    this.schema.dropTableIfExists('atendimentos')
  }
}
