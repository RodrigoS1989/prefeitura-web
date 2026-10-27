# Etapa 2: Domínio Território, Geografia & Parâmetros Municipais

**Status**: ✅ Concluída e Operacional  
**Total de Telas Delphi Contempladas**: **31 telas**  
**Stack Tecnológica**: Models Lucid (Bairro, Logradouro, Municipio, ParametroPrefeitura), Serviços de Geocodificação e Autocomplete rápido  

---

## 1. Visão Geral do Escopo
Gestão de divisões administrativas territoriais (Bairros, Logradouros, Municípios, Zonas Censitárias, Imóveis) e Parâmetros Institucionais da Prefeitura.

---

## 2. Inventário Exaustivo de Telas Delphi Contempladas (31 Telas)

Todas as telas e relatórios abaixo identificados no código-fonte original (`Prefeitura.dpr` / `Prefeitura\Forms` / `Prefeitura\view`) são integralmente contemplados nesta etapa da refatoração:

| # | Unit Delphi | Formulário / Objeto | Título da Tela (Caption) | Caminho Relativo |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `Prefeitura.View.Form.NovoAtestado` | `Formulário / Módulo` | PM1044 - Atestado Médico | `view\Prefeitura.View.Form.NovoAtestado.dfm` |
| 2 | `UCO008` | `CO008: TCO008` | CO008 - Mensagens para Secretarias | `Forms\UCO008.dfm` |
| 3 | `UJuncaoEndereco` | `Formulário / Módulo` | PM1004 - Junçã'o de Endereços | `Forms\UJuncaoEndereco.dfm` |
| 4 | `UPM005R` | `PM005R: TPM005R` | PM005R - Relaçã'o de Contatos | `Forms\UPM005R.dfm` |
| 5 | `UPM008` | `PM008: TPM008` | PM008 - Pesquisa de Secretarias | `Forms\UPM008.dfm` |
| 6 | `UPM009R` | `PM009R: TPM009R` | PM009R - Relaçã'o de Secretarias | `Forms\UPM009R.dfm` |
| 7 | `UPM040` | `PM040: TPM040` | PM040 - Pesquisa de Imóveis | `Forms\UPM040.dfm` |
| 8 | `UPM206` | `PM206: TPM206` | PM206 - Cadastro de Fornecedores ou Prestadores | `Forms\UPM206.dfm` |
| 9 | `UPM237` | `Formulário / Módulo` | PM237 - Relatório de Prestador de Serviços | `Forms\UPM237.dfm` |
| 10 | `UPM237R` | `PM237R: TPM237R` | PM237R - Relatório de Prestador de Serviços | `Forms\UPM237R.dfm` |
| 11 | `UPM317` | `PM317: TPM317` | PM317 - Cadastro da Frota Municipal | `Forms\UPM317.dfm` |
| 12 | `UPM318` | `PM318: TPM318` | PM318 - Pesquisa da Frota Municipal | `Forms\UPM318.dfm` |
| 13 | `UPM323R` | `PM323R: TPM323R` | PM323R - Relaçã'o de Secretarias | `Forms\UPM323R.dfm` |
| 14 | `UPM358` | `Formulário / Módulo` | PM358 - Relatório de Junçã'o de Endereço | `Forms\UPM358.dfm` |
| 15 | `UPM358R` | `Formulário / Módulo` | PM358R - Relatorio de Junçã'o de Endereço | `Forms\UPM358R.dfm` |
| 16 | `UPM393` | `PM393: TPM393` | PM393 - Cadastro de Secretaria | `Forms\UPM393.dfm` |
| 17 | `UPM445` | `Formulário / Módulo` | PM445 - Junçã'o de Endereços | `Forms\UPM445.dfm` |
| 18 | `UPM460` | `Formulário / Módulo` | PM460 - Indicadores Municipais da Atençã'o Básica | `Forms\UPM460.dfm` |
| 19 | `UPM460R` | `Formulário / Módulo` | PM460R - Relatórios Indicadores Municipal da atençã'o básica | `Forms\UPM460R.dfm` |
| 20 | `UPM471` | `Formulário / Módulo` | PM471 - Importaçã'o de dados da Secretaria Escolar Digital - SED | `Forms\UPM471.dfm` |
| 21 | `UPM508RC` | `PM508RC: TPM508RC` | PM508RC - Relaçã'o de Projetos por Bairros | `Forms\UPM508RC.dfm` |
| 22 | `UPM530` | `PM530: TPM530` | PM530 - Registros Inconsistentes com dos Profissionais | `Forms\UPM530.dfm` |
| 23 | `UPM679` | `PM679: TPM679` | PM679 - Transferências de Alunos para outra Escola do Município | `Forms\UPM679.dfm` |
| 24 | `UPM874R` | `PM874R: TPM874R` | PM874R - Impressão Declaraçã'o / Atestado | `Forms\UPM874R.dfm` |
| 25 | `UPM876` | `PM876: TPM876` | PM876 - Atestado Médico | `Forms\UPM876.dfm` |
| 26 | `UPM983` | `PM983: TPM983` | PM983 - Cadastro de Logradouros | `Forms\UPM983.dfm` |
| 27 | `UPM983R` | `PM983R: TPM983R` | PM983R - Relaçã'o de Logradouros | `Forms\UPM983R.dfm` |
| 28 | `UPM984` | `PM984: TPM984` | PM984 - Pesquisa de Logradouro | `Forms\UPM984.dfm` |
| 29 | `UPM985` | `PM985: TPM985` | PM985 - Cadastro de Bairros | `Forms\UPM985.dfm` |
| 30 | `UPM985R` | `PM985R: TPM985R` | PM985R - Relatório de Bairros | `Forms\UPM985R.dfm` |
| 31 | `UPM986` | `PM986: TPM986` | PM986 - Pesquisa de Bairros | `Forms\UPM986.dfm` |

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
