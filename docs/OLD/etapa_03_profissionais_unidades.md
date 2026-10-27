# Etapa 3: Domínio Profissionais, Especialidades (CBO) & Unidades de Saúde

**Status**: ✅ Concluída  
**Total de Telas Delphi Contempladas**: **46 telas**  
**Tabelas Canônicas `social_SMA`**: `ARQ020` (Profissionais), `ARQ005` (Unidades/CNES), `PMD006` (Especialidades), `PMD024` (Conselhos), `tb_CBOUnificado` (CBO), `UnidadeUsuario` (Lotações)  
**Stack Tecnológica**: Models Lucid (UnidadeSaude, Profissional, EspecialidadeMedica, ConselhoProfissional, Cbo, VinculoLotacao)  

---

## 1. Visão Geral do Escopo
Rede física municipal de saúde (UBS, Postos, CAPS, Unidades 24h), lotação de equipes, catálogo oficial de especialidades médicas (`PMD006`), conselhos de classe profissional (`PMD024` - CRM, COREN, CRO, etc.), catálogo CBO 2002 do Ministério da Saúde (`tb_CBOUnificado`) e cadastro mestre de profissionais e operadores (`ARQ020`).

---

## 2. Inventário Exaustivo de Telas Delphi Contempladas (46 Telas)

Todas as telas e relatórios abaixo identificados no código-fonte original (`Prefeitura.dpr` / `Prefeitura\Forms` / `Prefeitura\view`) são integralmente contemplados nesta etapa da refatoração:

| # | Unit Delphi | Formulário / Objeto | Título da Tela (Caption) | Caminho Relativo |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `Prefeitura.View.Form.ClonarConfigEspExa` | `Formulário / Módulo` | PM1045 - Passar configuraçã'o de bloqueio para outras unidades | `view\Prefeitura.View.Form.ClonarConfigEspExa.dfm` |
| 2 | `Prefeitura.View.Frame.Selecao.Unidade` | `Formulário / Módulo` | *(Sem título explícito)* | `view\frames\Prefeitura.View.Frame.Selecao.Unidade.dfm` |
| 3 | `Saude.View.Form.CadastroSala` | `Formulário / Módulo` | Cadastro de salas da unidade | `view\saude\Saude.View.Form.CadastroSala.dfm` |
| 4 | `Saude.View.Form.Defasagem` | `Formulário / Módulo` | Unidade: | `view\saude\Saude.View.Form.Defasagem.dfm` |
| 5 | `UPM020` | `PM020: TPM020` | PM020 - Pesquisa de Usuários | `Forms\UPM020.dfm` |
| 6 | `UPM024` | `PM024: TPM024` | PM024 - Relatório por Período | `Forms\UPM024.dfm` |
| 7 | `UPM024R` | `PM024R: TPM024R` | PM024R - Relatório por Periodo de Consultas | `Forms\UPM024R.dfm` |
| 8 | `UPM025` | `PM025: TPM025` | PM025 - Pesquisa de Profissões | `Forms\UPM025.dfm` |
| 9 | `UPM028` | `PM028: TPM028` | PM028 - Pesquisa de CBO | `Forms\UPM028.dfm` |
| 10 | `UPM033` | `PM033: TPM033` | PM033 - Cadastro de Especialidade | `Forms\UPM033.dfm` |
| 11 | `UPM033R` | `PM033R: TPM033R` | PM033R - Relaçã'o de Especialidades | `Forms\UPM033R.dfm` |
| 12 | `UPM034` | `PM034: TPM034` | PM034 - Pesquisa de Especialidades | `Forms\UPM034.dfm` |
| 13 | `UPM059R` | `PM059R: TPM059R` | PM059R - Impressão dos Horários do Profissional | `Forms\UPM059R.dfm` |
| 14 | `UPM089` | `PM089: TPM089` | PM089 - Inclusão de Equipe INE por Profissional | `Forms\UPM089.dfm` |
| 15 | `UPM156` | `PM156: TPM156` | PM156 - SI-PNI - CBOS | `Forms\UPM156.dfm` |
| 16 | `UPM161` | `PM161: TPM161` | PM161 - SI-PNI - Unidade | `Forms\UPM161.dfm` |
| 17 | `UPM173` | `PM173: TPM173` |  Unidade  | `Forms\UPM173.dfm` |
| 18 | `UPM177` | `PM177: TPM177` |   Dados da Unidade e do Profissional   | `Forms\UPM177.dfm` |
| 19 | `UPM253` | `Formulário / Módulo` | PM253 - Cadastro de Unidades de Medidas Laboratoriais | `Forms\UPM253.dfm` |
| 20 | `UPM314` | `Formulário / Módulo` |  Unidade  | `Forms\UPM314.dfm` |
| 21 | `UPM325` | `Formulário / Módulo` | PM325 - Cadastro de Setores da Unidade | `Forms\UPM325.dfm` |
| 22 | `UPM325R` | `Formulário / Módulo` | PM325R - Relaçã'o de Setores da Unidade | `Forms\UPM325R.dfm` |
| 23 | `UPM341` | `Formulário / Módulo` | lbUnidade | `Forms\UPM341.dfm` |
| 24 | `UPM356` | `PM356: TPM356` | PM356 - Cadastro de Unidades Municipais | `Forms\UPM356.dfm` |
| 25 | `UPM356R` | `PM356R: TPM356R` | PM356R - Relaçã'o das Unidades Municipais | `Forms\UPM356R.dfm` |
| 26 | `UPM357` | `PM357: TPM357` | PM357 - Pesquisa de Unidades Municipais | `Forms\UPM357.dfm` |
| 27 | `UPM420` | `Formulário / Módulo` | PM420 - Cadastro de Protocolos x Especialidades | `Forms\UPM420.dfm` |
| 28 | `UPM457` | `Formulário / Módulo` | PM457 - Cadastro de Grupo de Usuários | `Forms\UPM457.dfm` |
| 29 | `UPM457R` | `Formulário / Módulo` | PM457R | `Forms\UPM457R.dfm` |
| 30 | `UPM506R` | `PM506R: TPM506R` | PM506R - Relaçã'o de Equipamentos  por Unidades | `Forms\UPM506R.dfm` |
| 31 | `UPM575` | `Formulário / Módulo` | PM575 - Alta por Especialidade | `Forms\UPM575.dfm` |
| 32 | `UPM588` | `PM588: TPM588` | PM588 - Pesquisa de Especialidades por Unidade | `Forms\UPM588.dfm` |
| 33 | `UPM589` | `PM589: TPM589` | PM589 - Pesquisa de Profissionais por Especialidade e Unidade | `Forms\UPM589.dfm` |
| 34 | `UPM618` | `PM618: TPM618` | PM618 - Relaçã'o das Unidades | `Forms\UPM618.dfm` |
| 35 | `UPM630` | `Formulário / Módulo` | PM630 - Inclusão de Unidade | `Forms\UPM630.dfm` |
| 36 | `UPM655` | `Formulário / Módulo` |  Unidade  | `Forms\UPM655.dfm` |
| 37 | `UPM747` | `PM747: TPM747` | PM747 - Pesquisa de CBO | `Forms\UPM747.dfm` |
| 38 | `UPM758` | `PM758: TPM758` | PM758 - Pesquisa de CBO por Profissional - Tabela Unificada | `Forms\UPM758.dfm` |
| 39 | `UPM763` | `Formulário / Módulo` | PM763 - Inclusão de Ocupaçõ'es para o Profissional | `Forms\UPM763.dfm` |
| 40 | `UPM770` | `PM770: TPM770` | PM770 - Pesquisa de CBO - Tabela Unificada | `Forms\UPM770.dfm` |
| 41 | `UPM778` | `PM778: TPM778` | PM778 - Cadastro de Unidades Formadoras | `Forms\UPM778.dfm` |
| 42 | `UPM778R` | `PM778R: TPM778R` | PM778R - Relaçã'o de Unidades Formadoras | `Forms\UPM778R.dfm` |
| 43 | `UPM779` | `PM779: TPM779` | PM779 - Pesquisa de Unidades Formadoras | `Forms\UPM779.dfm` |
| 44 | `UPM820` | `PM820: TPM820` | PM820 - Cadastro de Unidades de Itens | `Forms\UPM820.dfm` |
| 45 | `UPM899` | `PM899: TPM899` | PM899 - Pesquisa de Especialidades por Profissional | `Forms\UPM899.dfm` |
| 46 | `UPM925` | `PM925: TPM925` | PM925 - Conselho de Classe | `Forms\UPM925.dfm` |

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
