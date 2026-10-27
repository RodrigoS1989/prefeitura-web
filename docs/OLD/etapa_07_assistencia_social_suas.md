# Etapa 7: Domínio Assistência Social, CRAS, CREAS & Benefícios

**Status**: ⏳ Pendente (Aguardando Etapa 6)  
**Total de Telas Delphi Contempladas**: **27 telas**  
**Stack Tecnológica**: Models Lucid (FamiliaSocial, MembroFamilia, BeneficioSocial, VisitaDomiciliar), Laudos socioeconômicos  

---

## 1. Visão Geral do Escopo
Acompanhamento socioassistencial de famílias em vulnerabilidade (CRAS/CREAS), cálculo de renda per capita, visitas domiciliares, benefícios eventuais e acolhimento institucional.

---

## 2. Inventário Exaustivo de Telas Delphi Contempladas (27 Telas)

Todas as telas e relatórios abaixo identificados no código-fonte original (`Prefeitura.dpr` / `Prefeitura\Forms` / `Prefeitura\view`) são integralmente contemplados nesta etapa da refatoração:

| # | Unit Delphi | Formulário / Objeto | Título da Tela (Caption) | Caminho Relativo |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `Prefeitura.View.Form.IVCF` | `Formulário / Módulo` | PM1021 - Índice de Vulnerabilidade Clínico-Funcional (IVCF-20) | `view\saude\Prefeitura.View.Form.IVCF.dfm` |
| 2 | `Saude.View.Relatorio.Quantitativo.Familias` | `Formulário / Módulo` | Relatório Consolidado de Famílias | `view\relatorios\Saude.View.Relatorio.Quantitativo.Familias.dfm` |
| 3 | `Social.View.Form.RelatoriosCiptea` | `Formulário / Módulo` | Requerimentos de Ciptea | `view\AssistenciaSocial\Social.View.Form.RelatoriosCiptea.dfm` |
| 4 | `Social.View.Form.RequerimentoCiptea` | `Formulário / Módulo` | Requerimento de CIPTEA | `view\AssistenciaSocial\Social.View.Form.RequerimentoCiptea.dfm` |
| 5 | `Social.View.Relatorio.Ciptea` | `Formulário / Módulo` | RelatorioCiptea | `view\AssistenciaSocial\Social.View.Relatorio.Ciptea.dfm` |
| 6 | `Social.View.Relatorio.Ciptea.Analitico` | `Formulário / Módulo` | RelatorioCipteaAnalitico | `view\AssistenciaSocial\Social.View.Relatorio.Ciptea.Analitico.dfm` |
| 7 | `Social.View.Relatorio.Ciptea.Requerimento` | `Formulário / Módulo` | Relatório de Requerimento Ciptea | `view\AssistenciaSocial\Social.View.Relatorio.Ciptea.Requerimento.dfm` |
| 8 | `Social.View.Relatorio.Ciptea.Sintetico` | `Formulário / Módulo` | Relatório Sintético de Requerimento de Ciptea | `view\AssistenciaSocial\Social.View.Relatorio.Ciptea.Sintetico.dfm` |
| 9 | `Social.View.Relatorio.Paefi.FamiliasCadastradasIndividuos` | `Formulário / Módulo` | PAEFI - Relatório de Famílias Cadastradas por Individuos | `view\AssistenciaSocial\Social.View.Relatorio.Paefi.FamiliasCadastradasIndividuos.dfm` |
| 10 | `Social.View.Relatorio.Paefi.Historico` | `Formulário / Módulo` | RelatorioPaefiHistorico | `view\AssistenciaSocial\Social.View.Relatorio.Paefi.Historico.dfm` |
| 11 | `UPM030` | `PM030: TPM030` | PM030 - Cadastro de Vulnerabilidades | `Forms\UPM030.dfm` |
| 12 | `UPM030R` | `PM030R: TPM030R` | PM030R - Relaçã'o de Vicios | `Forms\UPM030R.dfm` |
| 13 | `UPM031` | `PM031: TPM031` | PM031 - Pesquisa de Vulnerabilidades | `Forms\UPM031.dfm` |
| 14 | `UPM032` | `PM032: TPM032` | PM032 - Inclusão de Vulnerabilidades | `Forms\UPM032.dfm` |
| 15 | `UPM044` | `PM044: TPM044` | PM044 - PAIF | `Forms\UPM044.dfm` |
| 16 | `UPM044R` | `PM044R: TPM044R` | PM044R - Relaçã'o de Famílias por Vulnerabilidade | `Forms\UPM044R.dfm` |
| 17 | `UPM050` | `PM050: TPM050` | PM050 - Parecer Social | `Forms\UPM050.dfm` |
| 18 | `UPM050R` | `PM050R: TPM050R` | PM050R - Relaçã'o de Especialidades | `Forms\UPM050R.dfm` |
| 19 | `UPM051` | `PM051: TPM051` | PM051 - Pesquisa de Parecer Social | `Forms\UPM051.dfm` |
| 20 | `UPM069` | `PM069: TPM069` | PM069 - Inclusão de Cotas/Valor do Projeto Social | `Forms\UPM069.dfm` |
| 21 | `UPM197` | `PM197: TPM197` | PM197 - Configuraçã'o das Abas da Assistência Social | `Forms\UPM197.dfm` |
| 22 | `UPM262` | `Formulário / Módulo` | PM262 - Log - Assistência Social | `Forms\UPM262.dfm` |
| 23 | `UPM328` | `Formulário / Módulo` | PM328 - Tipos Encaminhamentos da Assistência Social | `Forms\UPM328.dfm` |
| 24 | `UPM464` | `Formulário / Módulo` | PM464 - Cadastro de Usuários API Social | `Forms\UPM464.dfm` |
| 25 | `UPM508` | `PM508: TPM508` | PM508 - Relaçã'o dos Projetos Sociais - Assistência Social | `Forms\UPM508.dfm` |
| 26 | `UPM516` | `Formulário / Módulo` | PM516 - Inclusão de Rede Social do membro | `Forms\UPM516.dfm` |
| 27 | `UPM928` | `PM928: TPM928` | PM928 - Conselho Tutelar | `Forms\UPM928.dfm` |

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
