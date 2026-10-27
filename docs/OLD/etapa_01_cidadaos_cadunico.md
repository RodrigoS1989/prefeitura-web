# Etapa 1: Módulo Principal Cidadão (Cadastro Único Municipal & Cartão SUS)

**Status**: ✅ Concluída e Operacional  
**Total de Telas Delphi Contempladas**: **25 telas**  
**Stack Tecnológica**: Model Lucid Cidadao, VineJS Validator, Redis Cache, React shadcn/ui (Table, Badges, Tabs, Dialog)  

---

## 1. Visão Geral do Escopo
Cadastro unificado do munícipe, documentos civis (CPF, RG, Certidões), dados socioeconômicos, visualização 360° integrada, integração com ViaCEP e histórico multiprofissional.

---

## 2. Inventário Exaustivo de Telas Delphi Contempladas (25 Telas)

Todas as telas e relatórios abaixo identificados no código-fonte original (`Prefeitura.dpr` / `Prefeitura\Forms` / `Prefeitura\view`) são integralmente contemplados nesta etapa da refatoração:

| # | Unit Delphi | Formulário / Objeto | Título da Tela (Caption) | Caminho Relativo |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `Educacao.View.Form.EscolaImpresso` | `Formulário / Módulo` | Geraçã'o de Documentos Escolares | `view\educacao\Educacao.View.Form.EscolaImpresso.dfm` |
| 2 | `Prefeitura.View.Relatorio.Etiqueta.Identificacao.Simplificado.UPA` | `Formulário / Módulo` | RelatorioEtiquetaIdentificacaoUPASimplificado | `view\relatorios\Prefeitura.View.Relatorio.Etiqueta.Identificacao.Simplificado.UPA.dfm` |
| 3 | `Prefeitura.View.Relatorio.Etiqueta.Identificacao.UPA` | `Formulário / Módulo` | RelatorioEtiquetaIdentificacaoUPA | `view\relatorios\Prefeitura.View.Relatorio.Etiqueta.Identificacao.UPA.dfm` |
| 4 | `Saude.View.Form.Cidadao.Anexo` | `Formulário / Módulo` | PM1020 - Inclusão de Anexo | `view\saude\Saude.View.Form.Cidadao.Anexo.dfm` |
| 5 | `UCO002` | `CO002: TCO002` | CO002 - Nova Mensagem | `Forms\UCO002.dfm` |
| 6 | `UJuncaoPessoa` | `frmJuncaoPessoa: TfrmJuncaoPessoa` | PM1026 - Junçã'o de Cadastro de Pessoas | `Forms\UJuncaoPessoa.dfm` |
| 7 | `UPesquisaJuncao` | `frmPesquisaJuncao: TfrmPesquisaJuncao` | PM1027 - Pesquisa de Pessoas | `Forms\UPesquisaJuncao.dfm` |
| 8 | `UPesquisaJuncaoEndereco` | `Formulário / Módulo` | PM1005 - Pesquisa de endereços para junçã'o | `Forms\UPesquisaJuncaoEndereco.dfm` |
| 9 | `UPM001` | `PM001: TPM001` | PM001 - Cadastro de Parentesco | `Forms\UPM001.dfm` |
| 10 | `UPM001R` | `PM001R: TPM001R` | PM001R - Relaçã'o de Parentesco | `Forms\UPM001R.dfm` |
| 11 | `UPM003` | `PM003: TPM003` | PM003 - Pesquisa de Parentesco | `Forms\UPM003.dfm` |
| 12 | `UPM015` | `PM015: TPM015` | PM015 - Cadastro de Vicios | `Forms\UPM015.dfm` |
| 13 | `UPM015R` | `PM015R: TPM015R` | PM015R - Relaçã'o de Vicios | `Forms\UPM015R.dfm` |
| 14 | `UPM029` | `PM029: TPM029` | PM029 - Pesquisa de Nacionalidade | `Forms\UPM029.dfm` |
| 15 | `UPM088` | `PM088: TPM088` | PM088 - Cadastro de Identificador Nacional de Equipes | `Forms\UPM088.dfm` |
| 16 | `UPM311` | `PM311: TPM311` | PM311 - Cadastro de Documentos | `Forms\UPM311.dfm` |
| 17 | `UPM311R` | `PM311R: TPM311R` | PM311R - Relaçã'o de Documentos | `Forms\UPM311R.dfm` |
| 18 | `UPM312` | `PM312: TPM312` | PM312 - Pesquisa de Documentos | `Forms\UPM312.dfm` |
| 19 | `UPM330` | `Formulário / Módulo` | PM330 - Bloco de Documentos | `Forms\UPM330.dfm` |
| 20 | `UPM331` | `Formulário / Módulo` | PM331 - Pesquisa de Bloco de Documentos | `Forms\UPM331.dfm` |
| 21 | `UPM438` | `PM438: TPM438` | PM438 - Identificaçã'o de Matricula | `Forms\UPM438.dfm` |
| 22 | `UPM495` | `Formulário / Módulo` | PM495 - Inclusão de documentos | `Forms\UPM495.dfm` |
| 23 | `UPM582` | `PM582: TPM582` | PM582 - Inclusão de Documentos | `Forms\UPM582.dfm` |
| 24 | `UPM707` | `Formulário / Módulo` | PM707 - Salvar documento | `Forms\UPM707.dfm` |
| 25 | `UPM894` | `PM894: TPM894` | PM894 - Impressão de Documentos/Termos | `Forms\UPM894.dfm` |

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
