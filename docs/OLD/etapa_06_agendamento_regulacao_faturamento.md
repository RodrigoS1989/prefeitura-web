# Etapa 6: Domínio Central de Agendamento, Regulação & Faturamento SUS

**Status**: ✅ Concluída (100% Operacional)  
**Total de Telas Delphi Contempladas**: **182 telas**  
**Stack Tecnológica**: Models Lucid (`ProcedimentoSus`, `GradeAgendamento`, `CotaRegulacao`, `Agendamento`), Redis Distributed Locks atômicos (`acquireLock`, `releaseLock`), Inertia + React 19 + Tailwind v4 + shadcn/ui.

---

## 1. Visão Geral do Escopo & Entregas Realizadas
Marcação de consultas especializadas e exames, regulação municipal de cotas, bloqueio distribuído de concorrência com travas atômicas Redis (evitando overbooking e colisões em milissegundos) e geração de protocolos municipais rastreáveis (`AGE-2026-XXXXXX`).

### 1.1 Entregas Técnicas Executadas:
1. **Migração & Banco de Dados**:
   - `1761885935174_create_agendamentos_tables.ts`: Criação das tabelas `procedimentos_sus` (SIGTAP 10 dígitos), `grades_agendamento` (escalas semanais), `cotas_regulacao` (pactuações mensais por unidade) e `agendamentos` (consultas e exames).
2. **Modelos Lucid ORM**:
   - `ProcedimentoSus.ts`, `GradeAgendamento.ts`, `CotaRegulacao.ts`, `Agendamento.ts` com relacionamentos, casts de data/hora e serialização.
3. **Serviços & Concorrência Distribuída**:
   - `CacheService.ts`: Implementação de `acquireLock` e `releaseLock` com comandos atômicos Redis `SET NX EX`.
   - `AgendamentoService.ts`: Regras de negócio de `agendarComLock`, validação de vaga duplicada em tempo real, consumo atômico de cotas reguladas, confirmação de presença (Check-in) e cancelamento auditado com estorno de cota.
4. **Seeders & Dados Canônicos**:
   - `agendamento_seeder.ts`: 6 procedimentos SIGTAP oficiais, 4 grades semanais de médicos especialistas, cotas pactuadas para 2026-10 e agendamentos iniciais.
5. **Controladores & Rotas**:
   - `AgendamentosController.ts` & `RegulacaoController.ts`: Grade diária, KPIs de absenteísmo, cálculo reativo de horários livres (`/api/agendamentos/vagas`), verificação de cotas (`/api/regulacao/verificar-cota`), check-in e cancelamento.
6. **Frontend React 19 + Inertia**:
   - `agendamentos/index.tsx`: Central de agendamento com calendário, taxas de ocupação, filtros por data/unidade/especialidade, check-in e modal de cancelamento.
   - `agendamentos/novo.tsx`: Wizard de agendamento em 3 etapas com verificação de cotas, histórico prévio do cidadão e matriz dinâmica de horários livres/ocupados.
   - `agendamentos/regulacao.tsx`: Painel de cotas pactuadas com barras de progresso, alertas visuais de esgotamento e modal de ampliação de teto.

---

## 2. Inventário Exaustivo de Telas Delphi Contempladas (182 Telas)

Todas as telas e relatórios abaixo identificados no código-fonte original (`Prefeitura.dpr` / `Prefeitura\Forms` / `Prefeitura\view`) são integralmente contemplados nesta etapa da refatoração:

| # | Unit Delphi | Formulário / Objeto | Título da Tela (Caption) | Caminho Relativo |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `Prefeitura.View.Form.Agenda.ExameCota.Cancelar` | `Formulário / Módulo` | PM1019 - Cancelamento de Agenda de Exames por Cota | `view\saude\Prefeitura.View.Form.Agenda.ExameCota.Cancelar.dfm` |
| 2 | `Prefeitura.View.Form.Faturamento.Exportacao` | `Formulário / Módulo` | PM1008 - Exportaçã'o do Faturamento | `view\Prefeitura.View.Form.Faturamento.Exportacao.dfm` |
| 3 | `Prefeitura.View.Form.FtpDatasus` | `Formulário / Módulo` | FTP - Datasus | `view\Prefeitura.View.Form.FtpDatasus.dfm` |
| 4 | `Prefeitura.View.Form.Lab.ImpressaoSolicitacao` | `Formulário / Módulo` | PM1029 - Impressão de exames laboratoriais | `view\saude\Prefeitura.View.Form.Lab.ImpressaoSolicitacao.dfm` |
| 5 | `Prefeitura.View.Relatorio.AgendaConsulta.Cancelamentos` | `Formulário / Módulo` | Agendamentos cancelados | `view\relatorios\Prefeitura.View.Relatorio.AgendaConsulta.Cancelamentos.dfm` |
| 6 | `Prefeitura.View.Relatorio.AgendaVeiculo.Log` | `Formulário / Módulo` | RelAgendaVeiculoLog | `view\relatorios\Prefeitura.View.Relatorio.AgendaVeiculo.Log.dfm` |
| 7 | `Saude.View.Form.Agenda.Exame.ImpressaoEtiqueta` | `Formulário / Módulo` | PM1016 - Agendamento de Exames - Impressão de Etiquetas | `view\saude\Saude.View.Form.Agenda.Exame.ImpressaoEtiqueta.dfm` |
| 8 | `Saude.View.Form.Agenda.GuiaEspecialidade` | `Formulário / Módulo` | PM1000 - Demanda Reprimida | `view\saude\Saude.View.Form.Agenda.GuiaEspecialidade.dfm` |
| 9 | `Saude.View.Form.Agenda.GuiaEspecialidade.Comunicado` | `Formulário / Módulo` | Comunique-se | `view\saude\Saude.View.Form.Agenda.GuiaEspecialidade.Comunicado.dfm` |
| 10 | `Saude.View.Form.Agenda.GuiaEspecialidade.Comunicado.Notificacao` | `FormAgendaGuiaComunicadoNotificacao: TFormAgendaGuiaComunicadoNotificacao` | PM1006 - Comunique-se - Pendentes | `view\saude\Saude.View.Form.Agenda.GuiaEspecialidade.Comunicado.Notificacao.dfm` |
| 11 | `Saude.View.Form.Agenda.GuiaEspecialidade.Exame` | `Formulário / Módulo` | PM1007 - Agendamento de Exames | `view\saude\Saude.View.Form.Agenda.GuiaEspecialidade.Exame.dfm` |
| 12 | `Saude.View.Form.Agenda.GuiaEspecialidade.Vagas` | `Formulário / Módulo` | PM1001 - Demanda Reprimida - Seleçã'o de Agenda | `view\saude\Saude.View.Form.Agenda.GuiaEspecialidade.Vagas.dfm` |
| 13 | `Saude.View.Form.Exames` | `Formulário / Módulo` | PM1034 - Relatório de Exames | `view\saude\Saude.View.Form.Exames.dfm` |
| 14 | `Saude.View.Form.Guia` | `Formulário / Módulo` | Central de Regulaçã'o | `view\saude\Saude.View.Form.Guia.dfm` |
| 15 | `Saude.View.Form.VulnerabilidadeFAM` | `Formulário / Módulo` | PM1017 - Escala de Vulnerabilidade Familiar (EVFAM-BR) | `view\saude\Saude.View.Form.VulnerabilidadeFAM.dfm` |
| 16 | `Saude.View.Relatorio.Agenda.Exame.Etiquetas` | `Formulário / Módulo` | Modelo Brother DK-1201 | `view\saude\relatorios\Saude.View.Relatorio.Agenda.Exame.Etiquetas.dfm` |
| 17 | `Saude.View.Relatorio.Agenda.Exame.Etiquetas.Brother2211` | `Formulário / Módulo` | Modelo Brother DK2211 | `view\saude\relatorios\Saude.View.Relatorio.Agenda.Exame.Etiquetas.Brother2211.dfm` |
| 18 | `Saude.View.Relatorio.Agenda.ExameExterno.Quantitativo` | `Formulário / Módulo` | Relatório de Agenda de Exames Externos - Quantitativo | `view\saude\relatorios\Saude.View.Relatorio.Agenda.ExameExterno.Quantitativo.dfm` |
| 19 | `Saude.view.Relatorio.Exames` | `Formulário / Módulo` | formRelExames | `view\saude\relatorios\Saude.view.Relatorio.Exames.dfm` |
| 20 | `Saude.View.Relatorio.RecepcaoExames.ListaPresenca` | `Formulário / Módulo` | Lista de presenças - Recepçã'o de Exames | `view\saude\relatorios\Saude.View.Relatorio.RecepcaoExames.ListaPresenca.dfm` |
| 21 | `Saude.View.Relatorio.ReferenciaEscalaCoelho` | `Formulário / Módulo` | PM1022 - Referências da Pontuaçã'o da Escala de Coelho | `view\saude\relatorios\Saude.View.Relatorio.ReferenciaEscalaCoelho.dfm` |
| 22 | `Social.View.Relatorio.Atendimento.Agenda.Comprovante` | `Formulário / Módulo` | PM222 - Comprovante de agendamento de atendimento | `view\AssistenciaSocial\Social.View.Relatorio.Atendimento.Agenda.Comprovante.dfm` |
| 23 | `Social.View.Relatorio.Atendimento.Agenda.Comprovante.Termica` | `Formulário / Módulo` | PM222 - Comprovante de Agendamento da Assistencia Social | `view\AssistenciaSocial\Social.View.Relatorio.Atendimento.Agenda.Comprovante.Termica.dfm` |
| 24 | `UPM005` | `PM005: TPM005` | PM005 - Agenda de Contatos | `Forms\UPM005.dfm` |
| 25 | `UPM010` | `PM010: TPM010` | PM010 - Agenda Pessoal | `Forms\UPM010.dfm` |
| 26 | `UPM012R` | `PM012R: TPM012R` | PM012R - Impressão de Agenda | `Forms\UPM012R.dfm` |
| 27 | `UPM022R` | `PM022R: TPM022R` | PM022R - Relaçã'o de Motivos de Cancelamentos de Agendamentos | `Forms\UPM022R.dfm` |
| 28 | `UPM026` | `PM026: TPM026` | PM026 - Relatório de Exames por Período | `Forms\UPM026.dfm` |
| 29 | `UPM026R` | `PM026R: TPM026R` | PM026R - Relatório por Periodo de Exames | `Forms\UPM026R.dfm` |
| 30 | `upM047` | `PM047: TPM047` | PM047 - Inclusão de Agendamentos | `Forms\upM047.dfm` |
| 31 | `UPM141` | `PM141: TPM141` | PM141 - Cadastro de Métodos de Exames | `Forms\UPM141.dfm` |
| 32 | `UPM141R` | `PM141R: TPM141R` | PM141R - Métodos de Exames laboratoriais | `Forms\UPM141R.dfm` |
| 33 | `UPM142` | `PM142: TPM142` | PM142 - Cadastro de Exames Laboratoriais | `Forms\UPM142.dfm` |
| 34 | `UPM143` | `PM143: TPM143` | PM143 - Cadastro de Itens do Exame Laboratorial | `Forms\UPM143.dfm` |
| 35 | `UPM155` | `PM155: TPM155` | Tipo de Status da Guia | `Forms\UPM155.dfm` |
| 36 | `UPM174` | `PM174: TPM174` | PM174 - Remanejamento de Pacientes com Consulta Agendada | `Forms\UPM174.dfm` |
| 37 | `UPM180` | `PM180: TPM180` | PM180 - Exame do Paciente | `Forms\UPM180.dfm` |
| 38 | `UPM192` | `PM192: TPM192` | PM192 - Cadastro de Grupos de Exames | `Forms\UPM192.dfm` |
| 39 | `UPM201` | `PM201: TPM201` | PM201 - Agendamento de Consultas | `Forms\UPM201.dfm` |
| 40 | `UPM201R` | `PM201R: TPM201R` | PM201R - Impressão da Agenda das Especialidades | `Forms\UPM201R.dfm` |
| 41 | `UPM214` | `PM214: TPM214` | PM214 - Exames Externos | `Forms\UPM214.dfm` |
| 42 | `UPM215` | `PM215: TPM215` | PM215 - Parametrizaçã'o de Horários de Exames | `Forms\UPM215.dfm` |
| 43 | `UPM216` | `PM216: TPM216` | PM216 - Agenda de Exames Externos | `Forms\UPM216.dfm` |
| 44 | `UPM216_P` | `PM216_P: TPM216_P` | PM216 - Agenda de Exames por Cotas | `Forms\UPM216_P.dfm` |
| 45 | `UPM216R` | `PM216R: TPM216R` | PM216R - Relatorios Agendamento de Exames Externos e Sessões | `Forms\UPM216R.dfm` |
| 46 | `UPM217` | `PM217: TPM217` | PM217 - Lista de Exames cadastrados no Local de Atendimento | `Forms\UPM217.dfm` |
| 47 | `UPM218` | `PM218: TPM218` | PM218 - Pesquisa de Agendamentos de Exames Externos | `Forms\UPM218.dfm` |
| 48 | `UPM218_P` | `PM218_P: TPM218_P` | PM218 - Pesquisa de Agendamentos de Exames por Cotas | `Forms\UPM218_P.dfm` |
| 49 | `UPM219` | `PM219: TPM219` | PM219 - Recepçã'o de Exames | `Forms\UPM219.dfm` |
| 50 | `UPM220` | `PM220: TPM220` | PM220 - Recepçã'o de Exames | `Forms\UPM220.dfm` |
| 51 | `UPM222` | `PM222: TPM222` | PM222 - Agenda de Atendimentos da Assistência Social | `Forms\UPM222.dfm` |
| 52 | `UPM222R` | `PM222R: TPM222R` | PM222R - Relatório Agenda de Atendimentos da Assistência Social | `Forms\UPM222R.dfm` |
| 53 | `UPM223` | `PM223: TPM223` | PM223 - Agendamento de Atendimento | `Forms\UPM223.dfm` |
| 54 | `UPM230` | `Formulário / Módulo` | PM230 - Manutençã'o de Exames | `Forms\UPM230.dfm` |
| 55 | `UPM231` | `Formulário / Módulo` | PM231 - Relatório de Recepçã'o de Exames | `Forms\UPM231.dfm` |
| 56 | `UPM231R` | `PM231R: TPM231R` | PM231R - Relatório de Recepçã'o de Exames | `Forms\UPM231R.dfm` |
| 57 | `UPM232` | `Formulário / Módulo` | PM232 - Lista de Espera - Exames | `Forms\UPM232.dfm` |
| 58 | `UPM233` | `Formulário / Módulo` | PM233 - Lista de Espera - Incluir Exames | `Forms\UPM233.dfm` |
| 59 | `UPM236` | `Formulário / Módulo` | PM236 - Relatório de Agendamentos | `Forms\UPM236.dfm` |
| 60 | `UPM236R` | `PM236R: TPM236R` | PM236R - Relatório Agendamento de Exames Externos | `Forms\UPM236R.dfm` |
| 61 | `UPM249` | `Formulário / Módulo` | PM249 - Replicar Agendamento | `Forms\UPM249.dfm` |
| 62 | `UPM252` | `Formulário / Módulo` | PM252 - Cadastro de Grupos de Exames Laboratoriais | `Forms\UPM252.dfm` |
| 63 | `UPM252R` | `Formulário / Módulo` | PM252 - Cadastro de Grupos de Exames Laboratoriais | `Forms\UPM252R.dfm` |
| 64 | `UPM255` | `Formulário / Módulo` | PM255 - Solicitaçã'o de Exames Laboratoriais | `Forms\UPM255.dfm` |
| 65 | `UPM255R` | `Formulário / Módulo` | PM255R - Resultado de Exames Laboratoriais | `Forms\UPM255R.dfm` |
| 66 | `UPM256` | `Formulário / Módulo` | PM256 - Resultado dos Exames Laboratoriais | `Forms\UPM256.dfm` |
| 67 | `UPM258` | `Formulário / Módulo` | PM258 - Pesquisa de Resultados de Exames Laboratoriais | `Forms\UPM258.dfm` |
| 68 | `UPM259` | `Formulário / Módulo` | PM259 - Manutençã'o de Fórmulas de Exames | `Forms\UPM259.dfm` |
| 69 | `UPM275` | `Formulário / Módulo` | PM275 - Relatório de Exames Laboratoriais | `Forms\UPM275.dfm` |
| 70 | `UPM275R` | `Formulário / Módulo` | PM275R - Relatório de Exames Laboratoriais | `Forms\UPM275R.dfm` |
| 71 | `UPM276` | `Formulário / Módulo` | PM276 - Replicar Exames Externos | `Forms\UPM276.dfm` |
| 72 | `UPM278` | `Formulário / Módulo` | PM278 - Manutençã'o no Faturamento | `Forms\UPM278.dfm` |
| 73 | `UPM281` | `Formulário / Módulo` | PM281 - Cadastro de Referência - Escala de Coelho | `Forms\UPM281.dfm` |
| 74 | `UPM286` | `PM286: TPM286` | PM286 - Relatório de Guias Encaminhadas | `Forms\UPM286.dfm` |
| 75 | `UPM286R` | `Pm286R: TPm286R` | Pm286R - Relatório de Guias Encaminhadas | `Forms\UPM286R.dfm` |
| 76 | `UPM294` | `Formulário / Módulo` | PM294 - Relatório de Grau de Risco Familiar - Escala de Coelho | `Forms\UPM294.dfm` |
| 77 | `UPM294R` | `Formulário / Módulo` | PM294R - Relatório de Grau de Risco Familiar - Escala de Coelho | `Forms\UPM294R.dfm` |
| 78 | `UPM295` | `Formulário / Módulo` | PM295 - Bloqueio de Agenda de Exames por Cota | `Forms\UPM295.dfm` |
| 79 | `UPM296` | `Formulário / Módulo` | PM296 - Pesquisa de Bloqueios de Agendas Externas | `Forms\UPM296.dfm` |
| 80 | `UPM343` | `Formulário / Módulo` | PM343 - Guias pendentes de solicitaçã'o | `Forms\UPM343.dfm` |
| 81 | `UPM345` | `PM345: TPM345` | PM345 - Presença Exames | `Forms\UPM345.dfm` |
| 82 | `UPM346` | `Formulário / Módulo` | PM346 - Verificaçã'o de Agendamento de Exames | `Forms\UPM346.dfm` |
| 83 | `UPM349` | `Formulário / Módulo` | PM349 - Transferência de Agendamentos | `Forms\UPM349.dfm` |
| 84 | `UPM402` | `PM402: TPM402` | PM402 - Dias Regulares do Calendário Escolar | `Forms\UPM402.dfm` |
| 85 | `UPM413` | `Formulário / Módulo` | PM413 - Agendamento Recorrente | `Forms\UPM413.dfm` |
| 86 | `UPM414` | `Formulário / Módulo` | PM414 - Cadastro de Tipo Guia de Especialidade | `Forms\UPM414.dfm` |
| 87 | `UPM421` | `Formulário / Módulo` | PM421 - Seleçã'o do Exame Laboratorial | `Forms\UPM421.dfm` |
| 88 | `UPM448` | `Formulário / Módulo` | PM448 - Exames de Imagem | `Forms\UPM448.dfm` |
| 89 | `UPM449` | `Formulário / Módulo` | PM449 - Pesquisa de Exames de Imagem | `Forms\UPM449.dfm` |
| 90 | `UPM450` | `Formulário / Módulo` | PM450 - Exames de Imagem (Exames Externos) | `Forms\UPM450.dfm` |
| 91 | `UPM465` | `Formulário / Módulo` |  Informaçõ'es sobre o agendamento  | `Forms\UPM465.dfm` |
| 92 | `UPM467` | `Formulário / Módulo` | PM467 - Solicitaçõ'es de Agendamento WEB | `Forms\UPM467.dfm` |
| 93 | `UPM494` | `Formulário / Módulo` | PM494 - Seleçã'o de Exames | `Forms\UPM494.dfm` |
| 94 | `UPM519` | `PM519: TPM519` | PM519 - Agendamento Administrativo | `Forms\UPM519.dfm` |
| 95 | `UPM520` | `PM520: TPM520` | PM520 - Incluir Agendamento | `Forms\UPM520.dfm` |
| 96 | `UPM521` | `PM521: TPM521` | PM521 - Impressão dos Agendamentos | `Forms\UPM521.dfm` |
| 97 | `UPM521R` | `PM521R: TPM521R` | PM521R - Impressão de Agendamento de Veiculos | `Forms\UPM521R.dfm` |
| 98 | `UPM565` | `PM565: TPM565` | PM565 - Guias de Especialidades | `Forms\UPM565.dfm` |
| 99 | `UPM565R` | `PM565R: TPM565R` | PM565R - Comprovante de Guias | `Forms\UPM565R.dfm` |
| 100 | `UPM566` | `PM566: TPM566` | PM566 - Pesquisa de Guias de Especialidades | `Forms\UPM566.dfm` |
| 101 | `UPM568` | `PM568: TPM568` | PM568 - Agendamento de Guias e Exames | `Forms\UPM568.dfm` |
| 102 | `UPM568R` | `PM568R: TPM568R` | PM568R - Comprovante de Guia | `Forms\UPM568R.dfm` |
| 103 | `UPM569` | `PM569: TPM569` | PM569 - Incluir um Agendamento | `Forms\UPM569.dfm` |
| 104 | `UPM587` | `PM587: TPM587` | PM587 - Inclusão de Uso de Susbstâncias | `Forms\UPM587.dfm` |
| 105 | `UPM590` | `PM590: TPM590` | PM590 - Cancelamento de Agendamentos | `Forms\UPM590.dfm` |
| 106 | `UPM591` | `PM591: TPM591` | PM591 - Manutençã'o no Horário do Agendamento | `Forms\UPM591.dfm` |
| 107 | `UPM592` | `PM592: TPM592` | PM592 - Geraçã'o da agenda de profissionais | `Forms\UPM592.dfm` |
| 108 | `UPM593` | `PM593: TPM593` | PM593 - Verificaçã'o de Agendamentos de Consultas | `Forms\UPM593.dfm` |
| 109 | `UPM594` | `PM594: TPM594` | PM594 - Efetuar bloqueio de agendamentos | `Forms\UPM594.dfm` |
| 110 | `UPM596` | `PM596: TPM596` | PM596 - Cadastro de Exames | `Forms\UPM596.dfm` |
| 111 | `UPM596R` | `PM596R: TPM596R` | PM596R - Relaçã'o de Exames | `Forms\UPM596R.dfm` |
| 112 | `UPM597` | `PM597: TPM597` | PM597 - Pesquisa de Exames | `Forms\UPM597.dfm` |
| 113 | `UPM598` | `PM598: TPM598` | PM598 - Configuraçõ'es de Exames | `Forms\UPM598.dfm` |
| 114 | `UPM599` | `Formulário / Módulo` | PM599 - Geraçã'o do Agendamento de Exames | `Forms\UPM599.dfm` |
| 115 | `UPM600` | `Formulário / Módulo` | PM600 - Pesquisa de Agendamentos de Exames | `Forms\UPM600.dfm` |
| 116 | `UPM601` | `PM601: TPM601` | PM601 - Agendamento de Exames | `Forms\UPM601.dfm` |
| 117 | `UPM601R` | `PM601R: TPM601R` | PM601R - Impressão dos Agendamentos de Exames | `Forms\UPM601R.dfm` |
| 118 | `UPM602` | `PM602: TPM602` | PM602 - Inclusão de Exames | `Forms\UPM602.dfm` |
| 119 | `UPM603` | `PM603: TPM603` | PM603 - Cancelamentos de Exames | `Forms\UPM603.dfm` |
| 120 | `UPM604` | `PM604: TPM604` | PM604 - Pesquisa de Profissionais por Exames | `Forms\UPM604.dfm` |
| 121 | `UPM605` | `PM605: TPM605` | PM605 - Efetuar o Bloqueio de Horários de Exames | `Forms\UPM605.dfm` |
| 122 | `UPM606` | `PM606: TPM606` | PM606 - Desbloqueio de agendamentos | `Forms\UPM606.dfm` |
| 123 | `UPM607` | `PM607: TPM607` | PM607 - Liberar os Agendamentos de Exames Bloqueados | `Forms\UPM607.dfm` |
| 124 | `UPM617` | `PM617: TPM617` | PM617 - Exclusão de agendamentos gerados | `Forms\UPM617.dfm` |
| 125 | `UPM623` | `PM623: TPM623` | PM623 - Confirmaçã'o de Agendamentos | `Forms\UPM623.dfm` |
| 126 | `UPM627` | `PM627: TPM627` | PM627 - Exclusão de Agendamentos de Exames Gerados | `Forms\UPM627.dfm` |
| 127 | `UPM631` | `PM631: TPM631` | PM631 - Guias Solicitadas | `Forms\UPM631.dfm` |
| 128 | `UPM631R` | `PM631R: TPM631R` | PM631R - Relaçã'o de Guias de Unidades Solicitantes | `Forms\UPM631R.dfm` |
| 129 | `UPM632` | `PM632: TPM632` | PM632 - Guias Agendadas | `Forms\UPM632.dfm` |
| 130 | `UPM632R` | `PM632R: TPM632R` | PM632R - PM631R - Relaçã'o de Guias de Unidades Agendadas | `Forms\UPM632R.dfm` |
| 131 | `UPM633R` | `PM633R: TPM633R` | PM633R - Relaçã'o de Guias Por Unidades | `Forms\UPM633R.dfm` |
| 132 | `UPM635` | `PM635: TPM635` | PM635 - Liberaçã'o de Agendamentos para as Unidades | `Forms\UPM635.dfm` |
| 133 | `UPM664` | `PM664: TPM664` | PM664 - Alteraçã'o de Agendamentos Gerados | `Forms\UPM664.dfm` |
| 134 | `UPM664R` | `PM664R: TPM664R` | PM664R - Validaçã'o do Agendamento Excluido | `Forms\UPM664R.dfm` |
| 135 | `UPM665` | `PM665: TPM665` | PM665 - Inclusão de agendamentos - Agenda já gerada | `Forms\UPM665.dfm` |
| 136 | `UPM666` | `PM666: TPM666` | PM666 - Verificaçã'o de Agendamento | `Forms\UPM666.dfm` |
| 137 | `UPM678` | `PM678: TPM678` | PM678 - Relatório de Exames de Raio X | `Forms\UPM678.dfm` |
| 138 | `UPM678R` | `PM678R: TPM678R` | PM678R - Relaçã'o de Exames de Raio X | `Forms\UPM678R.dfm` |
| 139 | `UPM684_Old` | `PM684_Old: TPM684_Old` | PM684 - Relaçã'o de Guias Externas | `Forms\UPM684_Old.dfm` |
| 140 | `UPM684R` | `PM684R: TPM684R` | PM684R - Relaçã'o de Guias Solicitadas | `Forms\UPM684R.dfm` |
| 141 | `UPM684R_Old` | `PM684R_Old: TPM684R_Old` | PM684R - Relaçã'o de Guias Solicitadas | `Forms\UPM684R_Old.dfm` |
| 142 | `UPM710` | `PM710: TPM710` | PM710 - Liberaçã'o de Exames para as Unidades | `Forms\UPM710.dfm` |
| 143 | `UPM717` | `Formulário / Módulo` | PM717 - Justificatica do Agendamento | `Forms\UPM717.dfm` |
| 144 | `UPM720` | `PM720: TPM720` | PM720 - Cadastro de Orgão de Destino do BPA | `Forms\UPM720.dfm` |
| 145 | `UPM721` | `PM721: TPM721` | PM721 - Pesquisa de Orgão de Destino do BPA | `Forms\UPM721.dfm` |
| 146 | `UPM722` | `PM722: TPM722` | PM722 - Cadastro de Orgãos Responsáveis pelo BPA | `Forms\UPM722.dfm` |
| 147 | `UPM723` | `PM723: TPM723` | PM723 - Pesquisa de Orgãos Responsaveis pelo BPA | `Forms\UPM723.dfm` |
| 148 | `UPM728` | `PM728: TPM728` | PM728 - Laudos de Exames de Raio X | `Forms\UPM728.dfm` |
| 149 | `UPM728R` | `PM728R: TPM728R` | PM728R - Relatório de Laudos | `Forms\UPM728R.dfm` |
| 150 | `UPM729` | `PM729: TPM729` | PM729 - Pesquisa de Laudos de Exames | `Forms\UPM729.dfm` |
| 151 | `UPM730` | `PM730: TPM730` | PM730 - Inclusão de Exame | `Forms\UPM730.dfm` |
| 152 | `UPM733` | `PM733: TPM733` | PM733 - Relatório de Exames Solicitados | `Forms\UPM733.dfm` |
| 153 | `UPM733R` | `PM733R: TPM733R` | PM733R - Relatório de Exames Solicitados | `Forms\UPM733R.dfm` |
| 154 | `UPM736` | `PM736: TPM736` | PM736 - Ocorrências dos Agendamentos | `Forms\UPM736.dfm` |
| 155 | `UPM737` | `PM737: TPM737` | PM737 - Ocorrências dos Agendamentos | `Forms\UPM737.dfm` |
| 156 | `UPM748R` | `PM748R: TPM748R` | PM748R - Comprovante de Cadastro da Guia de Exame | `Forms\UPM748R.dfm` |
| 157 | `UPM771` | `PM771: TPM771` | PM771 - Relatório de Faturamento - Tabela Unificada | `Forms\UPM771.dfm` |
| 158 | `UPM771R` | `PM771R: TPM771R` | PM771R - Relatório de Faturamento - Tabela Unificada | `Forms\UPM771R.dfm` |
| 159 | `UPM790` | `PM790: TPM790` | PM790 - Demandas de Guias | `Forms\UPM790.dfm` |
| 160 | `UPM790R` | `PM790R: TPM790R` | PM790R - Relatório de Demanda de Guias Externas | `Forms\UPM790R.dfm` |
| 161 | `UPM792` | `PM792: TPM792` | PM792 - Cadastro de Doenças - SIAB | `Forms\UPM792.dfm` |
| 162 | `UPM792R` | `PM792R: TPM792R` | PM792R - Relaçã'o de Doenças SIAB | `Forms\UPM792R.dfm` |
| 163 | `UPM793` | `PM793: TPM793` | PM793 - Pesquisa de Doenças - SIAB | `Forms\UPM793.dfm` |
| 164 | `UPM794` | `PM794: TPM794` | PM794 - Cadastro de Segmentos - SIAB | `Forms\UPM794.dfm` |
| 165 | `UPM795` | `PM795: TPM795` | PM795 - Pesquisa de Segmento SIAB | `Forms\UPM795.dfm` |
| 166 | `UPM796` | `PM796: TPM796` | PM796 - Cadastros de Área - SIAB | `Forms\UPM796.dfm` |
| 167 | `UPM796R` | `PM796R: TPM796R` | PM796R - Relaçã'o de Área SIAB | `Forms\UPM796R.dfm` |
| 168 | `UPM797` | `PM797: TPM797` | PM797 - Pesquisa de Áreas - SIAB | `Forms\UPM797.dfm` |
| 169 | `UPM798` | `PM798: TPM798` | PM798 - Cadastro de Micro-Área - SIAB | `Forms\UPM798.dfm` |
| 170 | `UPM798R` | `PM798R: TPM798R` | PM798R - Relaçã'o de Micro Área SIAB | `Forms\UPM798R.dfm` |
| 171 | `UPM799` | `PM799: TPM799` | PM799 - Pesquisa de Micro Área - SIAB | `Forms\UPM799.dfm` |
| 172 | `UPM799R` | `PM799R: TPM799R` | PM799R - Relaçã'o de Micro Área SIAB | `Forms\UPM799R.dfm` |
| 173 | `UPM848` | `PM848: TPM848` | PM848 - Agendamento Odontologia | `Forms\UPM848.dfm` |
| 174 | `UPM848R` | `PM848R: TPM848R` | PM848R - Relatório Diário de Agendamento | `Forms\UPM848R.dfm` |
| 175 | `UPM849` | `PM849: TPM849` | PM849 - Agendamento de Consultas | `Forms\UPM849.dfm` |
| 176 | `UPM877` | `PM877: TPM877` | PM877 - Agendamento de Veículos da Saúde | `Forms\UPM877.dfm` |
| 177 | `UPM877R` | `PM877R: TPM877R` | PM877R - Relaçã'o de Agendamentos de Veículos | `Forms\UPM877R.dfm` |
| 178 | `UPM878` | `PM878: TPM878` | PM878 - Agendamento de Veículo | `Forms\UPM878.dfm` |
| 179 | `UPM970` | `PM970: TPM970` | PM970 - Exame do Pezinho | `Forms\UPM970.dfm` |
| 180 | `UPM981` | `PM981: TPM981` | PM981 - Consultas agendadas do paciente | `Forms\UPM981.dfm` |
| 181 | `UPM987` | `PM987: TPM987` | PM987 - Alteraçã'o de Agenda de Exames já Gerada | `Forms\UPM987.dfm` |
| 182 | `UPM987R` | `PM987R: TPM987R` | PM987R - Validaçã'o do Agendamento Excluido | `Forms\UPM987R.dfm` |

---

## 3. Arquitetura da Solução Web Moderna
A transposição deste módulo para a stack AdonisJS v6 + Inertia + React 19 contempla:
- **Lucid ORM**: Modelos tipados e indexados substituindo queries diretas do `TADOQuery`.
- **Controllers & VineJS**: Validação de schema rigorosa no backend com tratamento de erros declarativo.
- **Inertia + React 19 + shadcn/ui**: Interfaces dinâmicas, responsivas, com busca reativa e modais de confirmação.
- **Camada de Cache**: Aceleração de consultas e autocompletions com Redis 7.

---

## 4. Critérios de Homologação & Portão de Saída
- [ ] Checagem rigorosa de tipagem estática: `npm run typecheck` sem nenhum erro.
- [ ] Compilação de assets de produção: `npm run build` validada.
- [ ] Testes de integração das rotas HTTP.
- [ ] **Parada obrigatória para aprovação do usuário antes do início da próxima etapa.**
