# Etapa 0: Setup da Infraestrutura Docker & Layout Mestre Web

**Status**: ✅ Concluída e Operacional  
**Total de Telas Delphi Contempladas**: **8 telas**  
**Stack Tecnológica**: AdonisJS v6, Inertia.js, React 19, Tailwind CSS v4, Lucide React, Docker Compose  

---

## 1. Visão Geral do Escopo
Estruturação dos contêineres Docker (MySQL 8 e Redis 7), inicialização do projeto AdonisJS v6 com Inertia.js, React 19, Tailwind CSS v4, shadcn/ui e casca mestre de navegação (Menu/Shell).

---

## 2. Inventário Exaustivo de Telas Delphi Contempladas (8 Telas)

Todas as telas e relatórios abaixo identificados no código-fonte original (`Prefeitura.dpr` / `Prefeitura\Forms` / `Prefeitura\view`) são integralmente contemplados nesta etapa da refatoração:

| # | Unit Delphi | Formulário / Objeto | Título da Tela (Caption) | Caminho Relativo |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `UFR000` | `FR000: TFR000` | lbMensagem | `Frames\UFR000.dfm` |
| 2 | `UME000` | `ME000: TME000` | Menu de Opçõ'es | `Forms\UME000.dfm` |
| 3 | `UModGeral` | `ModGeral: TModGeral` | *(Sem título explícito)* | `DataModulos\UModGeral.dfm` |
| 4 | `UModInterface` | `ModInterface: TModInterface` | *(Sem título explícito)* | `DataModulos\UModInterface.dfm` |
| 5 | `UPM017` | `PM017: TPM017` | PM017 - Tela de Abertura | `Forms\UPM017.dfm` |
| 6 | `UPMCadastroPadrao` | `PMCadastroPadrao: TPMCadastroPadrao` | PM487 - Cadastro de Despesas das Familias | `Forms\UPMCadastroPadrao.dfm` |
| 7 | `UPMPesquisaPadrao` | `PMPesquisaPadrao: TPMPesquisaPadrao` | PM003 - Pesquisa de Parentesco | `Forms\UPMPesquisaPadrao.dfm` |
| 8 | `UPMRelatorioPadrao` | `PMRelatorioPadrao: TPMRelatorioPadrao` | PMRelatorioPadrao | `Forms\UPMRelatorioPadrao.dfm` |

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
