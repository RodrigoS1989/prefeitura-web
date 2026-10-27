# Plano de Execução - Etapa 6: Central de Agendamento, Regulação & Faturamento SUS

## 1. Visão Geral & Escopo
A **Etapa 6** tem como meta refatorar todo o núcleo de agendamento ambulatorial e regulação do ecossistema Delphi Social / Prefeitura, substituindo **182 telas legadas** por uma plataforma reativa de alta performance.
O agendamento ambulatorial no SUS é um ponto de alta sensibilidade para a gestão municipal devido a:
1. **Concorrência simultânea**: dezenas de unidades básicas de saúde (UBS/USF) tentam reservar os mesmos slots de especialistas escassos (ex: Neurologista, Oftalmologista, Cardiologista) ou exames de média/alta complexidade (Ressonância, Ultrassom, Tomografia).
2. **Regulação de Cotas**: cada unidade de saúde municipal possui um teto mensal de cotas pactuadas para evitar que uma única unidade monopolize a agenda.
3. **Faturamento SUS (BPA / APAC)**: cada procedimento agendado e realizado deve estar estritamente referenciado à Tabela Unificada de Procedimentos do SUS (**SIGTAP - 10 dígitos**) para posterior geração e exportação de BPA e APAC.

---

## 2. Telas Delphi & Tabelas Canônicas Mapeadas

### 2.1 Telas Delphi Mapeadas (182 Telas)
- [UPM201.pas](file:///d:/Projetos/Delphi/Social/Prefeitura/Forms/UPM201.pas) - Agendamento de Consultas Médicas e Odontológicas
- [UPM216.pas](file:///d:/Projetos/Delphi/Social/Prefeitura/Forms/UPM216.pas) - Central de Agendamento de Exames Laboratoriais e Imagem
- [UPM210.pas](file:///d:/Projetos/Delphi/Social/Prefeitura/Forms/UPM210.pas) - Regulação de Cotas de Exames por Estabelecimento
- [UPM1001.pas](file:///d:/Projetos/Delphi/Social/Prefeitura/view/saude/Saude.View.Form.Agenda.GuiaEspecialidade.Vagas.dfm) - Demanda Reprimida / Seleção de Agenda
- [UPM1007.pas](file:///d:/Projetos/Delphi/Social/Prefeitura/view/saude/Saude.View.Form.Agenda.GuiaEspecialidade.Exame.dfm) - Agendamento de Exames Regulados
- [UPM1008.pas](file:///d:/Projetos/Delphi/Social/Prefeitura/view/Prefeitura.View.Form.Faturamento.Exportacao.dfm) - Exportação do Faturamento SUS (BPA / APAC)
- [UPM174.pas](file:///d:/Projetos/Delphi/Social/Prefeitura/Forms/UPM174.pas) - Remanejamento e Transferência de Pacientes Agendados
- [UPM047.pas](file:///d:/Projetos/Delphi/Social/Prefeitura/Forms/upM047.pas) - Inclusão Ágil de Agendamentos

### 2.2 Tabelas Canônicas do Banco de Dados (`social_SMA`)
- `PMD044` — Cabeçalho e registros de agendamento de consultas e exames
- `tb_AgendaExame` / `tb_AgendaExameExterno` — Marcações de exames especializados
- `tb_AgendamentoGuia` — Vínculo de guia de encaminhamento / regulação municipal
- `tb_ValidaAgenda` / `tb_LiberaAgendaUnidade` — Controle de liberação de datas e grades
- `tb_CancelamentoAgenda` — Trilha de auditoria e motivos de cancelamento
- `tb_InstrumentoRegistroUnificadoBPA` / `tb_LancamentoProcedimentoApac` — Dados de faturamento

---

## 3. Arquitetura da Solução Moderna (Stack AdonisJS 6 + React 19 + Redis 7)

### 3.1 Modelo de Dados (Lucid ORM)
1. **`procedimentos_sus`**:
   - `codigo_sigtap` (10 dígitos, ex: `0301010072` - Consulta Médica Especializada)
   - `nome`
   - `complexidade` (`atencao_basica`, `media_complexidade`, `alta_complexidade`)
   - `instrumento_registro` (`BPA-C`, `BPA-I`, `APAC`)
   - `valor_ambulatorial_sus` (decimal)
   - `cbo_exigido` (referência ao CBO)
   - `tempo_estimado_minutos`
2. **`grades_agendamento`** (Escalas de Atendimento):
   - `profissional_id`
   - `unidade_saude_id`
   - `especialidade_id`
   - `procedimento_id` (opcional ou genérico)
   - `dia_semana` (0=Domingo, 1=Segunda ... 6=Sábado)
   - `hora_inicio` (ex: '07:30')
   - `hora_fim` (ex: '11:30')
   - `duracao_minutos` (ex: 20 min)
   - `vagas_totais`
   - `tipo` (`consulta`, `exame`, `procedimento`)
   - `ativo` (boolean)
3. **`cotas_regulacao`**:
   - `unidade_solicitante_id` (UBS/USF que encaminha)
   - `unidade_executante_id` (Policlínica/Centro de Especialidades que realiza)
   - `especialidade_id`
   - `procedimento_id`
   - `mes_competencia` (ex: '2026-10')
   - `quantidade_cota` (limite mensal autorizado)
   - `quantidade_utilizada` (contagem em tempo real)
4. **`agendamentos`**:
   - `numero_protocolo` (ex: `AGE-2026-000001`)
   - `cidadao_id`
   - `profissional_id`
   - `unidade_saude_id`
   - `especialidade_id`
   - `procedimento_id`
   - `grade_agendamento_id`
   - `data_hora` (timestamp com fuso)
   - `status` (`agendado`, `confirmado`, `atendido`, `cancelado`, `falta`)
   - `prioridade` (`eletivo`, `prioritario`, `urgente`)
   - `motivo_cancelamento`
   - `observacoes`

### 3.2 Prevenção de Race Conditions com Redis Distributed Locks
Para eliminar agendamentos duplicados no mesmo minuto para o mesmo profissional/sala:
- Lock Key: `lock:agendamento:prof:${profissionalId}:data:${dataHoraIso}`
- Lock TTL: 5 segundos
- Se duas requisições chegarem simultaneamente, a segunda recebe `409 Conflict: Horário acabou de ser selecionado por outro operador`.

### 3.3 Telas Frontend (React 19 + shadcn/ui)
1. **Central Geral (`/agendamentos`)**:
   - Calendário semanal com visualização das grades ativas por unidade e especialidade.
   - Indicadores de ocupação, taxa de absenteísmo (faltas) e lista do dia.
   - Ações rápidas de confirmação de presença (Check-in) e cancelamento com justificativa.
2. **Nova Marcação / Wizard (`/agendamentos/novo`)**:
   - Passo 1: Seleção do Munícipe com busca reativa (CPF/CNS) e verificação de agendamentos duplicados no mesmo mês.
   - Passo 2: Seleção de Procedimento SIGTAP / Especialidade e verificação de Cota da Regulação.
   - Passo 3: Matriz de Vagas e Horários Disponíveis com confirmação atômica.
3. **Painel de Regulação & Cotas (`/agendamentos/regulacao`)**:
   - Monitoramento do saldo de cotas de cada UBS (utilizadas vs autorizadas).
   - Ajuste rápido de cotas por mês de competência.
   - Visão de procedimentos de alta e média complexidade com maior fila de espera.

---

## 4. Fases de Execução
1. **Migration & Models Lucid**: Criar migração `1761885935174_create_agendamentos_tables.ts` e modelos Lucid.
2. **Serviço de Agendamento & Regulação**: Criar `AgendamentoService.ts` com travas de concorrência e validação de cotas.
3. **Seeder**: Popular catálogo SIGTAP (consultas e exames reais), grades semanais por UBS/Especialistas e cotas para 2026-10.
4. **Controladores e Rotas**: Implementar `AgendamentosController.ts` e endpoints auxiliares de vagas e cotas.
5. **Frontend**: Criar telas `/agendamentos`, `/agendamentos/novo`, `/agendamentos/regulacao`.
6. **Validação**: `npm run typecheck`, testes de HTTP 200, teste de reserva com concorrência e confirmação de presença.
7. **Documentação & Portão de Saída**: Walkthrough e pausa para o usuário.
