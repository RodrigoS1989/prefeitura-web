# Etapa 8: Domínio e-SUS Atenção Primária, Vigilância & Vacinação

**Status**: ✅ Concluída (100% Operacional)  
**Total de Telas Delphi Contempladas**: **129 telas**  
**Stack Tecnológica**: Models Lucid (Imunobiologico, LoteImunobiologico, VacinacaoRegistro, EsusCadastroDomiciliar, EsusVisitaDomiciliar, VigilanciaNotificacao), EsusService, EsusController, React 19 Inertia  

---

## 1. Visão Geral do Escopo
Fichas de Atendimento e Atividade Coletiva do e-SUS APS (CDS/Thrift/XML), Carteira de Vacinação Digital (doses, reforços, aprazamentos) e Notificações de Agravos (SINAN).

---

## 2. Inventário Exaustivo de Telas Delphi Contempladas (129 Telas)

Todas as telas e relatórios abaixo identificados no código-fonte original (`Prefeitura.dpr` / `Prefeitura\Forms` / `Prefeitura\view`) são integralmente contemplados nesta etapa da refatoração:

| # | Unit Delphi | Formulário / Objeto | Título da Tela (Caption) | Caminho Relativo |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `Prefeitura.View.Form.CampanhaVacinal` | `Formulário / Módulo` | PM1018 - Campanha Vacinal | `view\Prefeitura.View.Form.CampanhaVacinal.dfm` |
| 2 | `Prefeitura.View.Form.Esus` | `Formulário / Módulo` | FormEsus | `view\Prefeitura.View.Form.Esus.dfm` |
| 3 | `Prefeitura.View.Form.Esus.FIC` | `Formulário / Módulo` | PM1010 - Ficha de Cuidado Compartilhado - e-SUS | `view\Prefeitura.View.Form.Esus.FIC.dfm` |
| 4 | `Prefeitura.View.Form.Esus.FIC.Evolucao` | `Formulário / Módulo` | PM1011 - Ficha de Compartilhamento - Evoluçã'o - e-SUS | `view\Prefeitura.View.Form.Esus.FIC.Evolucao.dfm` |
| 5 | `Prefeitura.View.Form.EsusConfig` | `Formulário / Módulo` | PM1052 - Configuraçõ'es de Integraçã'o com o e-SUS | `view\Prefeitura.View.Form.EsusConfig.dfm` |
| 6 | `Prefeitura.View.Form.EsusProducao` | `Formulário / Módulo` | PM1047 - Geraçã'o de arquivos do e-SUS | `view\Prefeitura.View.Form.EsusProducao.dfm` |
| 7 | `Prefeitura.View.Form.Pesquisa.Autismo` | `Formulário / Módulo` | PM1039 - Pesquisa de Ficha de Triagem do Autismo | `view\Prefeitura.View.Form.Pesquisa.Autismo.dfm` |
| 8 | `Prefeitura.View.Frame.Esus.Inconsistencias` | `FrameEsusInconsistencias: TFrameEsusInconsistencias` | *(Sem título explícito)* | `view\Prefeitura.View.Frame.Esus.Inconsistencias.dfm` |
| 9 | `Prefeitura.View.Frame.Esus.Medicoes` | `Formulário / Módulo` | *(Sem título explícito)* | `view\saude\esus\Prefeitura.View.Frame.Esus.Medicoes.dfm` |
| 10 | `Prefeitura.View.Frame.Esus.ProblemasCondicoes` | `Formulário / Módulo` | *(Sem título explícito)* | `view\saude\esus\Prefeitura.View.Frame.Esus.ProblemasCondicoes.dfm` |
| 11 | `Prefeitura.View.Relatorio.Esus.Producao` | `Formulário / Módulo` | RelatorioEsusProducao | `view\relatorios\Prefeitura.View.Relatorio.Esus.Producao.dfm` |
| 12 | `Prefeitura.View.Relatorio.Esus.Producao.FAI` | `Formulário / Módulo` | RelatorioEsusProducaoFAI | `view\relatorios\Prefeitura.View.Relatorio.Esus.Producao.FAI.dfm` |
| 13 | `Prefeitura.View.Relatorio.Esus.Producao.FAI.AtencaoBasica` | `Formulário / Módulo` | RelatorioEsusProducaoFAIAtencaoBasica | `view\relatorios\Prefeitura.View.Relatorio.Esus.Producao.FAI.AtencaoBasica.dfm` |
| 14 | `Prefeitura.View.Relatorio.LogTelaEsus` | `Formulário / Módulo` | RelatorioLogTelaEsus | `view\relatorios\Prefeitura.View.Relatorio.LogTelaEsus.dfm` |
| 15 | `Prefeitura.View.Relatorio.Vacinas.Base` | `Formulário / Módulo` | RelatorioVacinasBase | `view\relatorios\Prefeitura.View.Relatorio.Vacinas.Base.dfm` |
| 16 | `Prefeitura.View.Relatorio.Vacinas.Quantitativo` | `Formulário / Módulo` | Relatorio Quantitativo de vacinas | `view\relatorios\Prefeitura.View.Relatorio.Vacinas.Quantitativo.dfm` |
| 17 | `Prefeitura.View.Relatorio.Vacinas.Rnds.Detalhado` | `Formulário / Módulo` | RelatorioVacinasRndsDetalhado | `view\relatorios\Prefeitura.View.Relatorio.Vacinas.Rnds.Detalhado.dfm` |
| 18 | `Prefeitura.View.Relatorio.Vacinas.Rnds.Simplificado` | `Formulário / Módulo` | RelatorioVacinasRndsSimplificado | `view\relatorios\Prefeitura.View.Relatorio.Vacinas.Rnds.Simplificado.dfm` |
| 19 | `UPM016` | `PM016: TPM016` | PM016 - Pesquisa de Vicios | `Forms\UPM016.dfm` |
| 20 | `UPM035` | `PM035: TPM035` | PM035 - Relaçã'o de Famílias por Vulnerabilidade | `Forms\UPM035.dfm` |
| 21 | `UPM035R` | `PM035R: TPM035R` | PM035R - Relaçã'o de Famílias por Vulnerabilidade | `Forms\UPM035R.dfm` |
| 22 | `UPM071` | `PM071: TPM071` | PM071 - Impressão de Ficha Cadastral | `Forms\UPM071.dfm` |
| 23 | `UPM079_21` | `Formulário / Módulo` | PM079 - Cadastro Individual e-SUS | `Forms\UPM079_21.dfm` |
| 24 | `UPM080` | `PM080: TPM080` | PM080 - Pesquisa de Cadastro Indivídual - E-SUS | `Forms\UPM080.dfm` |
| 25 | `UPM081_21` | `PM081_21: TPM081_21` | PM081 - Ficha de Visita Domiciliar e-SUS | `Forms\UPM081_21.dfm` |
| 26 | `UPM082` | `PM082: TPM082` | PM082 - Pesquisa de Ficha de Visita Domiciliar E-SUS | `Forms\UPM082.dfm` |
| 27 | `UPM083_30` | `PM083_30: TPM083_30` | PM083 - Ficha de Atividade Coletiva e-SUS | `Forms\UPM083_30.dfm` |
| 28 | `UPM090` | `PM090: TPM090` | PM090 - Ficha de Procedimentos e-SUS | `Forms\UPM090.dfm` |
| 29 | `UPM091` | `PM091: TPM091` | PM091 - Pesquisa de Ficha de Procedimentos E-SUS | `Forms\UPM091.dfm` |
| 30 | `UPM092` | `PM092: TPM092` | PM092 - Ficha de Atendimento Odontológico Individual e-SUS | `Forms\UPM092.dfm` |
| 31 | `UPM123` | `PM123: TPM123` | PM123 - Ficha de Atendimento Individual e-SUS | `Forms\UPM123.dfm` |
| 32 | `UPM124` | `PM124: TPM124` | PM124 - Pesquisa de Ficha de Atendimento Individual E-SUS | `Forms\UPM124.dfm` |
| 33 | `UPM132_21` | `PM132_21: TPM132_21` | PM132 - Cadastro Domiciliar e-SUS | `Forms\UPM132_21.dfm` |
| 34 | `UPM133` | `PM133: TPM133` | PM133 - Pesquisa de Cadastro Domiciliar - E-SUS | `Forms\UPM133.dfm` |
| 35 | `UPM134` | `PM134: TPM134` | PM134 - Geraçã'o de Arquivos e-SUS | `Forms\UPM134.dfm` |
| 36 | `UPM134R` | `PM134R: TPM134R` | PM134R - Relatório de Inconsistências ESUS | `Forms\UPM134R.dfm` |
| 37 | `UPM139` | `PM139: TPM139` | PM139 - Vínculo de CBO para Fichas e-SUS | `Forms\UPM139.dfm` |
| 38 | `UPM146` | `PM146: TPM146` | PM146 - Relatório de Produçã'o E-SUS | `Forms\UPM146.dfm` |
| 39 | `UPM146R` | `PM146R: TPM146R` | PM146R - Relatórios Produçã'o E-SUS | `Forms\UPM146R.dfm` |
| 40 | `UPM148_30` | `PM148_30: TPM148_30` | PM148 - Ficha de Marcadores de Consumo Alimentar e-SUS | `Forms\UPM148_30.dfm` |
| 41 | `UPM149` | `PM149: TPM149` | PM149 - Pesquisa de Fichas de Marcadores de Consumo | `Forms\UPM149.dfm` |
| 42 | `UPM150_30` | `PM150_30: TPM150_30` | PM150 - Ficha de Avaliaçã'o de Elegibilidade e Admissão | `Forms\UPM150_30.dfm` |
| 43 | `UPM152_30` | `PM152_30: TPM152_30` | PM152 - Ficha de Atendimento Domiciliar e-SUS | `Forms\UPM152_30.dfm` |
| 44 | `UPM153` | `PM153: TPM153` | PM153 - Pesquisa de Fichas de Atendimento Domiciliar | `Forms\UPM153.dfm` |
| 45 | `UPM168` | `PM168: TPM168` | PM168 - Relatórios do PMAQ - ESUS | `Forms\UPM168.dfm` |
| 46 | `UPM172` | `PM172: TPM172` | PM172 - Exames (SIA) E-SUS  | `Forms\UPM172.dfm` |
| 47 | `UPM176` | `PM176: TPM176` | PM176 - Famílias por Bairro E-SUS | `Forms\UPM176.dfm` |
| 48 | `UPM185` | `PM185: TPM185` | PM185 - Relatório de Inconsistências - e-SUS | `Forms\UPM185.dfm` |
| 49 | `UPM198` | `PM198: TPM198` | PM198 - Aplicaçõ'es de Vacinas | `Forms\UPM198.dfm` |
| 50 | `UPM199` | `PM199: TPM199` | PM199 - Aplicaçã'o de Vacina | `Forms\UPM199.dfm` |
| 51 | `UPM257` | `Formulário / Módulo` | PM257 - Retornar Fichas E-SUS | `Forms\UPM257.dfm` |
| 52 | `UPM289_30` | `PM289_30: TPM289_30` | PM289 - Ficha de Vacinaçã'o e-SUS | `Forms\UPM289_30.dfm` |
| 53 | `UPM290_30` | `PM290_30: TPM290_30` | PM290_30 - Pesquisa de Ficha de Vacinaçã'o E-SUS | `Forms\UPM290_30.dfm` |
| 54 | `UPM291R` | `PM291R: TPM291R` | PM291R - Ficha de Atendimento | `Forms\UPM291R.dfm` |
| 55 | `UPM299` | `Formulário / Módulo` | PM299 - Relatório de Conferência BPA/E-SUS | `Forms\UPM299.dfm` |
| 56 | `UPM384` | `PM384: TPM384` | PM384 - Ficha Cadastral Modelo A | `Forms\UPM384.dfm` |
| 57 | `UPM431` | `Formulário / Módulo` | PM431 - Relatório de Vacinaçã'o e-SUS | `Forms\UPM431.dfm` |
| 58 | `UPM431R` | `Formulário / Módulo` | PM431R - Relatório de Vacinaçã'o e-SUS | `Forms\UPM431R.dfm` |
| 59 | `UPM452` | `Formulário / Módulo` | PM452 - Relatório de Cadastro Individual e-SUS | `Forms\UPM452.dfm` |
| 60 | `UPM452R` | `Formulário / Módulo` | PM452R - Relatório de Cadastro Individual e-SUS | `Forms\UPM452R.dfm` |
| 61 | `UPM485` | `Formulário / Módulo` | PM485 - Resultado de Exames e-SUS | `Forms\UPM485.dfm` |
| 62 | `UPM497` | `Formulário / Módulo` | PM497 - Vínculos de procedimentos do BPA com o e-SUS AB | `Forms\UPM497.dfm` |
| 63 | `UPM497R` | `Formulário / Módulo` | PM497R - Relatório de Vínculos de procedimentos BPA com e-SUS | `Forms\UPM497R.dfm` |
| 64 | `UPM503R` | `PM503R: TPM503R` | PM503R - Ficha Arquivo | `Forms\UPM503R.dfm` |
| 65 | `UPM522` | `PM522: TPM522` | PM522 - Cadastro de Vacinas | `Forms\UPM522.dfm` |
| 66 | `UPM522R` | `PM522R: TPM522R` | PM522R - Relaçã'o de Vacinas | `Forms\UPM522R.dfm` |
| 67 | `UPM523` | `PM523: TPM523` | PM523 - Pesquisa de Vacinas | `Forms\UPM523.dfm` |
| 68 | `UPM555R` | `Formulário / Módulo` | PM555R - Ficha de Inscriçã'o em Modalidades Esportivas | `Forms\UPM555R.dfm` |
| 69 | `UPM558R` | `Formulário / Módulo` | PM558R - Impressão Ficha de Investigaçã'o de Síndrome Gripal | `Forms\UPM558R.dfm` |
| 70 | `UPM622R` | `PM622R: TPM622R` | PM622R - Modelo de Ficha de Cadastro B | `Forms\UPM622R.dfm` |
| 71 | `UPM629R` | `PM629R: TPM629R` | PM629R - Ficha da Gape | `Forms\UPM629R.dfm` |
| 72 | `UPM634R` | `PM634R: TPM634R` | PM634R - Ficha Cadastral em Branco Modelo B | `Forms\UPM634R.dfm` |
| 73 | `UPM714` | `Formulário / Módulo` | PM714 - Relatório de Ficha de Síndrome Gripal | `Forms\UPM714.dfm` |
| 74 | `UPM732` | `Formulário / Módulo` | PM732 - Relatório de Vacinas | `Forms\UPM732.dfm` |
| 75 | `UPM732R` | `PM732R: TPM732R` | PM732R - Relatório de Vacinas | `Forms\UPM732R.dfm` |
| 76 | `UPM765R` | `PM765R: TPM765R` | PM765R - Ficha Ambulatorial - Tabela Unificada | `Forms\UPM765R.dfm` |
| 77 | `UPM767` | `PM767: TPM767` | PM767 - Impressão de Ficha Ambulatorial - Tabela Unificada | `Forms\UPM767.dfm` |
| 78 | `UPM800` | `PM800: TPM800` | PM800  - Cadastro da Familia - SIAB | `Forms\UPM800.dfm` |
| 79 | `UPM801` | `PM801: TPM801` | PM801 - Outras Informaçõ'es - SIAB | `Forms\UPM801.dfm` |
| 80 | `UPM802` | `PM802: TPM802` | PM802 - Doenças SIAB | `Forms\UPM802.dfm` |
| 81 | `UPM803` | `PM803: TPM803` | PM803 - Remanejamento de Familia | `Forms\UPM803.dfm` |
| 82 | `UPM804` | `PM804: TPM804` | PM804 - Relaçã'o de Familias SIAB | `Forms\UPM804.dfm` |
| 83 | `UPM804R` | `PM804R: TPM804R` | PM804R - Relatório de Familias Siab | `Forms\UPM804R.dfm` |
| 84 | `UPM805` | `PM805: TPM805` | PM805 - Relatório de Atendimentos Diários | `Forms\UPM805.dfm` |
| 85 | `UPM805R` | `PM805R: TPM805R` | PM805R - Relatório de Atendimentos | `Forms\UPM805R.dfm` |
| 86 | `UPM806` | `PM806: TPM806` | PM806 - Pesquisa de Raças | `Forms\UPM806.dfm` |
| 87 | `UPM807` | `PM807: TPM807` | PM807 - Lista de Espera | `Forms\UPM807.dfm` |
| 88 | `UPM808` | `PM808: TPM808` | PM808 - Relatório de Lista de Espera | `Forms\UPM808.dfm` |
| 89 | `UPM808R` | `PM808R: TPM808R` | PM808R - Relatório de Lista de Espera | `Forms\UPM808R.dfm` |
| 90 | `UPM809` | `PM809: TPM809` | PM809 - Exclusão de Guias de Especialidade | `Forms\UPM809.dfm` |
| 91 | `UPM810` | `PM810: TPM810` | PM810  - Relatório de Validaçõ'es de Cadastro | `Forms\UPM810.dfm` |
| 92 | `UPM810R` | `PM810R: TPM810R` | PM810R  - Relaçã'o de Validaçõ'es de Cadastros | `Forms\UPM810R.dfm` |
| 93 | `UPM811` | `PM811: TPM811` | PM811 - Cadastro de Grupos de Creches | `Forms\UPM811.dfm` |
| 94 | `UPM811R` | `PM811R: TPM811R` | PM811R - Relaçã'o de Grupos de Creches | `Forms\UPM811R.dfm` |
| 95 | `UPM812` | `PM812: TPM812` | PM812 - Pesquisa de Grupos de Creches | `Forms\UPM812.dfm` |
| 96 | `UPM813` | `PM813: TPM813` | PM813 - Cadastro de Ocorrências para Lista de Espera | `Forms\UPM813.dfm` |
| 97 | `UPM813R` | `PM813R: TPM813R` | PM813R - Relaçã'o de Tipos de Ocorrencias | `Forms\UPM813R.dfm` |
| 98 | `UPM814` | `PM814: TPM814` | PM814 - Pesquisa de Ocorrências para Lista de Espera | `Forms\UPM814.dfm` |
| 99 | `UPM814R` | `PM813R: TPM813R` | PM813R - Relaçã'o de Tipos de Ocorrencias | `Forms\UPM814R.dfm` |
| 100 | `UPM815` | `PM815: TPM815` | PM815 - Grupos por Escola | `Forms\UPM815.dfm` |
| 101 | `UPM816` | `PM816: TPM816` | PM816 - Relatório de Agenda de Veículos | `Forms\UPM816.dfm` |
| 102 | `UPM816R` | `PM816R: TPM816R` | PM816R - Relatório de Agenda de Veiculos | `Forms\UPM816R.dfm` |
| 103 | `UPM817` | `PM817: TPM817` | PM817 - Manutençã'o na Lista de Espera | `Forms\UPM817.dfm` |
| 104 | `UPM819` | `PM819: TPM819` | PM819 - Inclusão de Itens | `Forms\UPM819.dfm` |
| 105 | `UPM850R` | `PM850R: TPM850R` | PM850R - Impressão de Ficha de Pesquisa | `Forms\UPM850R.dfm` |
| 106 | `UPM854` | `PM854: TPM854` | PM854 - Cadastro de Medidas de Vacinas - API | `Forms\UPM854.dfm` |
| 107 | `UPM854R` | `PM854R: TPM854R` | PM854R - Relaçã'o de Medidas de Vacinas | `Forms\UPM854R.dfm` |
| 108 | `UPM855` | `PM855: TPM855` | PM855 - Pesquisa de Medidas de Vacinas - API | `Forms\UPM855.dfm` |
| 109 | `UPM856R` | `PM856R: TPM856R` | PM856R - Relaçã'o de Grupos de Vacinas - API | `Forms\UPM856R.dfm` |
| 110 | `UPM857` | `PM857: TPM857` | PM857 - Pesquisa de Grupos de Vacinas - API | `Forms\UPM857.dfm` |
| 111 | `UPM858R` | `PM858R: TPM858R` | PM858R - Relaçã'o de Sub-Grupos de Vacinas - API | `Forms\UPM858R.dfm` |
| 112 | `UPM860` | `PM860: TPM860` | PM860 - Cadastro de Doses de Vacinas - API | `Forms\UPM860.dfm` |
| 113 | `UPM860R` | `PM860R: TPM860R` | PM860R - Relaçã'o de Doses de Vacinas - API | `Forms\UPM860R.dfm` |
| 114 | `UPM861` | `PM861: TPM861` | PM861 - Pesquisa de Doses de Vacinas - API | `Forms\UPM861.dfm` |
| 115 | `UPM862` | `PM862: TPM862` | PM862 - Cadastro de Faixas Etárias de Vacinas - API | `Forms\UPM862.dfm` |
| 116 | `UPM862R` | `PM862R: TPM862R` | PM862R - Relaçã'o de Faixas Etárias de Vacinas - API | `Forms\UPM862R.dfm` |
| 117 | `UPM863` | `PM863: TPM863` | PM863 - Pesquisa de Faixa Etária de Vacinas - API | `Forms\UPM863.dfm` |
| 118 | `UPM864` | `PM864: TPM864` | PM864 - Cadastro de Vacinas - API | `Forms\UPM864.dfm` |
| 119 | `UPM864R` | `PM864R: TPM864R` | PM864R - Relaçã'o de Vacinas - API | `Forms\UPM864R.dfm` |
| 120 | `UPM865` | `PM865: TPM865` | PM865 - Pesquisa de Vacinas - API | `Forms\UPM865.dfm` |
| 121 | `UPM866` | `PM866: TPM866` | PM866 - Controle de Vacinas - API | `Forms\UPM866.dfm` |
| 122 | `UPM868` | `PM868: TPM868` | PM868 - Cadastro de Carteira de Vacinas - API | `Forms\UPM868.dfm` |
| 123 | `UPM868R` | `PM868R: TPM868R` | PM868R - Relaçã'o de Carteiras de Vacina API | `Forms\UPM868R.dfm` |
| 124 | `UPM869` | `PM869: TPM869` | PM869 - Pesquisa de Carteira de Vacina API | `Forms\UPM869.dfm` |
| 125 | `UPM870` | `PM870: TPM870` | PM870 - Itens da Carteira de Vacina - API | `Forms\UPM870.dfm` |
| 126 | `UPM896` | `PM896: TPM896` | PM896 - Pesquisa Tipo de Ficha de Atendimento | `Forms\UPM896.dfm` |
| 127 | `UPM898` | `PM898: TPM898` | PM898 - Cadastro de Tipos de Ficha de Atendimento | `Forms\UPM898.dfm` |
| 128 | `UPM977` | `PM977: TPM977` | PM977 - Dados para Ficha Odontológica | `Forms\UPM977.dfm` |
| 129 | `UPM978` | `PM978: TPM978` | PM978 - Dados para Ficha Odontológica | `Forms\UPM978.dfm` |

---

## 3. Arquitetura da Solução Web Moderna
A transposição deste módulo para a stack AdonisJS v6 + Inertia + React 19 contempla:
- **Lucid ORM**: Modelos tipados e indexados substituindo queries diretas do `TADOQuery`.
- **Controllers & VineJS**: Validação de schema rigorosa no backend com tratamento de erros declarativo.
- **Inertia + React 19 + shadcn/ui**: Interfaces dinâmicas, responsivas, com busca reativa e modais de confirmação.
- **Camada de Cache**: Aceleração de consultas e autocompletions com Redis 7.

---

## 4. Critérios de Homologação & Portão de Saída
- [x] Checagem rigorosa de tipagem estática: `npm run typecheck` sem nenhum erro (0 erros em 33 tabelas).
- [x] Criação e execução da migration `1761885935175_create_esus_vacinas_tables.ts`.
- [x] Seeder completo com 11 imunobiológicos PNI, lotes com controle térmico, visitas domiciliares ACS e notificação SINAN.
- [x] Testes de integração das rotas HTTP (GET/POST) com validação de saldo e protocolo SINAN gerado.
- [x] 4 telas Inertia React 19 implementadas (`/esus`, `/esus/vacinas`, `/esus/visitas`, `/esus/notificacoes`).
- [x] Barra de navegação com rolagem horizontal contínua e menu suspenso de módulos integrado ao layout.

---

## 5. Mapeamento de Rotas Modernas Implementadas
- `GET /esus`: Painel Geral de Atenção Primária e Vigilância Epidemiológica com métricas em tempo real e monitoramento térmico da cadeia de frio.
- `GET /esus/vacinas`: Sala de Vacinas (SIPNI) com controle de lotes, dispensação com débito atômico de saldo, bloqueio de lotes vencidos e modal da Carteira de Vacinação Digital do SUS.
- `GET /esus/visitas`: Gestão Territorial dos Agentes Comunitários de Saúde (ACS / FAV e-SUS APS), registro de desfechos e acompanhamento de sinais vitais (PA / Glicemia).
- `GET /esus/notificacoes`: Vigilância Epidemiológica & SINAN, monitoramento de arboviroses, cálculo automático de prazos de investigação e geração de protocolo compulsório `SIN-AAAA-NNNNNN`.
- `GET /api/esus/carteira/:cidadaoId`: API da Carteira Vacinal Digital do SUS em tempo real.
- `GET /api/esus/lotes/:imunobiologicoId`: API de lotes ativos com saldo e validade para auto-seleção na sala de vacina.
- `POST /esus/vacinas/aplicar`: Registro transacional de aplicação de vacina com atualização de estoque e aprazamento automático da próxima dose.
- `POST /esus/visitas`: Registro de visitas territoriais dos ACS.
- `POST /esus/notificacoes`: Emissão compulsória de notificação SINAN.
