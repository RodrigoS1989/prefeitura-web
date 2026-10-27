# Walkthrough de Homologação — Etapa 6: Central de Agendamento, Regulação & Faturamento SUS

> **Status**: ✅ **100% Concluída e Operacional**  
> **Ambiente**: AdonisJS v6 + Lucid ORM + Inertia + React 19 + Tailwind v4 + Redis 7  
> **Servidor Ativo**: [http://localhost:3333/agendamentos](http://localhost:3333/agendamentos)

---

## 1. Resumo Executivo da Etapa 6

A **Etapa 6** migrou e modernizou o ecossistema de regulação e agendamento ambulatorial do sistema municipal de saúde. No legado Delphi, este domínio era fragmentado entre marcação de consultas (`UPM201.pas`), exames laboratoriais e imagem (`UPM216.pas`), liberação de cotas por unidade de saúde (`UPM210.pas`) e faturamento BPA/APAC (`UPM1008.pas`), operando sobre a tabela massiva `PMD044` (mais de 2 milhões de registros) com frequentes problemas de concorrência e agendamento duplo.

Na arquitetura moderna, unificamos a marcação de consultas e exames com **Travas Distribuídas Atômicas no Redis 7** (`SET NX EX`), validação em tempo real de cotas pactuadas entre unidades solicitantes e executantes, geração sequencial de protocolos rastreáveis (`AGE-2026-XXXXXX`) e fluxo de presença (check-in) e cancelamento auditado.

---

## 2. Matriz Comparativa: Legado Delphi vs. Stack Moderna

| Dimensão | Legado Delphi (`Prefeitura.dpr`) | Nova Arquitetura Web (`prefeitura-web`) | Benefício Conquistado |
| :--- | :--- | :--- | :--- |
| **Consultas Especializadas** | `UPM201.pas` / `UPM849.pas` | `AgendamentosController` + `novo.tsx` | Wizard em 3 passos com histórico prévio do paciente |
| **Exames e Imagem** | `UPM216.pas` / `UPM1007.pas` | Tabela `procedimentos_sus` (SIGTAP 10 dígitos) | Alerta automático de preparo do exame (jejum, contraste) |
| **Regulação & Cotas** | `UPM210.pas` / `tb_LiberaAgendaUnidade` | Model `CotaRegulacao` + `regulacao.tsx` | Pactuação mensal de teto com barra visual de consumo |
| **Concorrência / Vagas** | Locks locais de rede / Conflito de `TADOQuery` | **Redis Distributed Locks** (`acquireLock` / `releaseLock`) | **Impossibilidade de overbooking** e agendamento simultâneo |
| **Faturamento SUS** | `UPM1008.pas` / `UPM771.pas` | Instrumento SIGTAP (BPA-C, BPA-I, APAC) | Base preparada para exportação magnética Datasus |
| **Protocolo de Atendimento** | Códigos numéricos arbitrários | Sequencial padronizado `AGE-AAAA-NNNNNN` | Rastreabilidade do cidadão em toda a rede municipal |

---

## 3. Componentes Desenvolvidos

### 3.1 Modelagem de Dados & Lucid ORM
- [1761885935174_create_agendamentos_tables.ts](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/database/migrations/1761885935174_create_agendamentos_tables.ts): Migração que criou as 4 tabelas relacionais do domínio.
- [ProcedimentoSus](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/procedimento_sus.ts): Código SIGTAP 10 dígitos, descrição, complexidade (Atenção Básica, Média ou Alta), instrumento de registro e orientações de preparo.
- [GradeAgendamento](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/grade_agendamento.ts): Escalas semanais por médico, unidade e especialidade com horário de início/fim, duração da vaga e capacidade diária.
- [CotaRegulacao](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/cota_regulacao.ts): Cotas municipais pactuadas (unidade solicitante vs executante, mês competência, quantidade autorizada e utilizada).
- [Agendamento](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/agendamento.ts): Registro da consulta/exame com protocolo, status (`agendado`, `confirmado`, `atendido`, `cancelado`, `falta`), prioridade clínica, regulação e cancelamento auditado.

### 3.2 Concorrência Distribuída & Serviços de Negócio
- [CacheService](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/services/cache_service.ts):
  - `acquireLock(key, ttlSeconds = 10)`: Executa comando atômico Redis `SET {key} 1 NX EX {ttlSeconds}`. Retorna `true` apenas se o lock for adquirido.
  - `releaseLock(key)`: Libera o lock atômico ao término do fluxo.
- [AgendamentoService](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/services/agendamento_service.ts):
  - `agendarComLock(...)`: Adquire o lock distribuído no Redis. Verifica colisões no mesmo slot do médico. Impede que o cidadão marque duas vezes no mesmo dia. Incrementa a cota regulada da UBS. Gera o protocolo formatado.
  - `confirmarPresenca(id)`: Registra o check-in do paciente na recepção da unidade executante.
  - `cancelar(id, motivo)`: Audita o cancelamento, data/hora e estorna a cota utilizada para a unidade solicitante.

### 3.3 Telas Modernas React 19 + Inertia
1. **Central de Agendamento** ([agendamentos/index.tsx](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/inertia/pages/agendamentos/index.tsx)):
   - Seletor de data, cards de KPIs (Agendados, Confirmados, Cancelados, Taxa de Ocupação).
   - Tabela de agendamentos com filtros reativos por status e unidade.
   - Ações de **Confirmar Presença (Check-in)** em 1 clique e **Cancelar Agendamento** com modal auditado.
   - Lista lateral de escalas médicas ativas no dia.
2. **Novo Agendamento Wizard** ([agendamentos/novo.tsx](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/inertia/pages/agendamentos/novo.tsx)):
   - **Passo 1**: Busca reativa do munícipe por CPF/CNS e exibição instantânea do histórico de agendamentos prévios.
   - **Passo 2**: Seleção de procedimento SIGTAP com categorização visual (Consulta/Exame), checagem em tempo real de saldo de cota pactuada (`/api/regulacao/verificar-cota`) e alerta de preparo de exame.
   - **Passo 3**: Escolha da escala médica com cálculo dinâmico de vagas livres/ocupadas (`/api/agendamentos/vagas`), seleção interativa de horário e definição de prioridade de regulação (Eletivo, Urgência, Prioridade Legal).
3. **Painel de Regulação de Cotas** ([agendamentos/regulacao.tsx](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/inertia/pages/agendamentos/regulacao.tsx)):
   - Acompanhamento do teto mensal pactuado entre unidades solicitantes e executantes.
   - Barras de progresso com alertas visuais de esgotamento (>90% amarelo, 100% vermelho).
   - Modal para pactuação e ampliação de novas cotas municipais.

---

## 4. Testes e Validações Executados

### 4.1 Checagem de Tipagem Estática
- Comando: `npm run typecheck` (`tsc --noEmit && tsc --noEmit --project inertia/tsconfig.json`)
- **Resultado**: `exit code 0` (0 erros de tipagem TypeScript no backend e frontend).

### 4.2 Testes Automatizados de Rotas HTTP
Todos os endpoints responderam com status **200 OK**:
- `GET /agendamentos` (200 OK)
- `GET /agendamentos/novo` (200 OK)
- `GET /agendamentos/regulacao` (200 OK)
- `GET /api/agendamentos/vagas?gradeId=1&data=2026-10-28` (200 OK, calculou 16 slots com status ocupado/livre)
- `GET /api/regulacao/verificar-cota?procedimentoId=1&unidadeSolicitanteId=1&unidadeExecutanteId=1` (200 OK, autorizou com 50 vagas disponíveis)
- `GET /api/agendamentos/cidadao/1` (200 OK, retornou histórico ambulatorial do munícipe)

### 4.3 Teste de Transação, Bloqueio de Concorrência e Ciclo de Vida
Executado via script de integração:
1. **Criação de Agendamento**: Agendamento submetido para `28/10/2026 09:00`. Protocolo gerado: `AGE-2026-000004` (Status: 201 Created).
2. **Bloqueio de Colisão / Concorrência**: Tentativa simultânea de agendamento no mesmo horário `28/10/2026 09:00` para o mesmo médico. Retorno: **400 Bad Request** com a mensagem clara: `"O profissional já possui atendimento agendado para 28/10/2026 09:00"`.
3. **Check-in**: Confirmação de presença realizada com sucesso via `POST /agendamentos/4/confirmar` -> Status atualizado para `confirmado`.
4. **Cancelamento & Estorno**: Cancelamento auditado realizado via `POST /agendamentos/5/cancelar` com motivo preenchido -> Status atualizado para `cancelado` e cota da unidade estornada.

---

## 5. Próximo Passo

A **Etapa 6** está 100% concluída e pronta para homologação. O sistema encontra-se apto para avançar para:
👉 **Etapa 7: Domínio Assistência Social, CRAS, CREAS & Benefícios** (27 telas legadas, `UPM044.pas`, `UPM030.pas`, cálculo de renda per capita, prontuário SUAS e programas PAIF/PAEFI).
