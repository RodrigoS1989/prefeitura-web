# Catálogo Mestre de Telas do Projeto Delphi (Prefeitura)

Este catálogo documenta o **censo integral de 100% das telas do sistema Delphi original**, auditadas diretamente no repositório de código fonte nas pastas [`refatoracao/Prefeitura/Forms`](file:///d:/Projetos/Delphi/refatoracao/Prefeitura/Forms) e [`refatoracao/Prefeitura/view`](file:///d:/Projetos/Delphi/refatoracao/Prefeitura/view).

---

## 1. Resumo Executivo da Auditoria Matemática

| Indicador | Quantidade Auditada | Percentual | Observação |
| :--- | :---: | :---: | :--- |
| **Total de Telas em `Prefeitura/Forms`** | **1.334** | 90,93% | Formulários legados centrais do sistema |
| **Total de Telas em `Prefeitura/view`** | **133** | 9,07% | Telas modernas estruturadas |
| **TOTAL GERAL DE TELAS CATALOGADAS** | **1.467** | **100,0%** | **Auditado sem omissões** |
| **Total de Telas com Caption Explícito** | **1.467** | 100,0% | Captions decodificados e catalogados |
| **Base em Formato Estruturado JSON** | [telas_inventario.json](file:///d:/Projetos/Delphi/refatoracao/documentacao/telas_inventario.json) | - | Base de dados estruturada disponível |

---

## 2. Distribuição por Domínio Funcional

| Módulo / Domínio Funcional | Quantidade de Telas | Percentual | Documento Analítico Detalhado |
| :--- | :---: | :---: | :--- |
| **01 Cidadaos e Social** | **34** | 2.32% | [Módulo 01: Cidadãos, Pessoas e Identificação Social](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/01_Cidadaos_e_Social.md) |
| **02 Territorio e Logradouros** | **29** | 1.98% | [Módulo 02: Território, Logradouros e Estrutura Municipal](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/02_Territorio_e_Logradouros.md) |
| **03 Profissionais e Unidades** | **45** | 3.07% | [Módulo 03: Unidades de Saúde e Profissionais](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/03_Profissionais_e_Unidades.md) |
| **04 Atendimento Clinico PEP** | **66** | 4.50% | [Módulo 04: Recepção, Triagem e Atendimento Clínico (PEP)](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/04_Atendimento_Clinico_PEP.md) |
| **05 Farmacia e Medicamentos** | **50** | 3.41% | [Módulo 05: Farmácia Municipal, Estoque e Dispensação](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/05_Farmacia_e_Medicamentos.md) |
| **06 Agendamento e Regulacao** | **95** | 6.48% | [Módulo 06: Agendamento Ambulatorial e Regulação de Vagas](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/06_Agendamento_e_Regulacao.md) |
| **07 Faturamento SUS** | **23** | 1.57% | [Módulo 07: Faturamento SUS (BPA, APAC, SIA/SIH)](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/07_Faturamento_SUS.md) |
| **08 Assistencia Social SUAS** | **32** | 2.18% | [Módulo 08: Assistência Social / SUAS e Benefícios](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/08_Assistencia_Social_SUAS.md) |
| **09 eSUS Vigilancia Vacinas** | **117** | 7.98% | [Módulo 09: e-SUS APS, Vigilância Epidemiológica e Vacinas](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/09_eSUS_Vigilancia_Vacinas.md) |
| **10 Frota e Transporte** | **10** | 0.68% | [Módulo 10: Gestão de Frota, Ambulâncias e Transporte](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/10_Frota_e_Transporte.md) |
| **11 Apoio Seguranca Configuracoes** | **606** | 41.31% | [Módulo 11: Cadastros de Apoio, Segurança e Configurações Gerais](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/11_Apoio_Seguranca_Configuracoes.md) |
| **12 Relatorios e Estatisticas** | **360** | 24.54% | [Módulo 12: Relatórios Gerenciais, Impressos e Estatísticas](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/12_Relatorios_e_Estatisticas.md) |
| **TOTAL CONSOLIDADO** | **1467** | **100,0%** | **12 Documentos Modulares Gerados** |

---

## 3. Distribuição por Tipologia de Interface

| Tipo de Interface | Quantidade | Percentual | Papel na Migração Web (AdonisJS + React) |
| :--- | :---: | :---: | :--- |
| **Cadastros Gerais e Apoio** | **597** | 40,70% | Formulários reativos com validação Zod e schemas Lucid ORM |
| **Relatórios e Impressões** | **371** | 25,29% | Visualizadores de impressão PDF e exportações Excel/CSV |
| **Cadastros Principais (CRUD)** | **226** | 15,41% | Telas de manutenção de entidades com controle de concorrência |
| **Consultas e Pesquisas** | **140** | 9,54% | Modais e páginas de busca com paginação assíncrona e filtros |
| **Operações e Movimentações** | **94** | 6,41% | Workflows complexos (Atendimento, Triagem, Dispensação, Faturamento) |
| **Configurações e Parâmetros** | **38** | 2,59% | Painéis administrativos de configuração municipal |
| **Menu Principal e Navegação** | **1** | 0,07% | Dashboard e sidebar reativa do layout do sistema web |
| **TOTAL** | **1.467** | **100,0%** | **100% de correspondência arquitetural** |

---

## 4. Próximos Passos na Modernização

Com o censo de 100% das telas fechado e auditado, a nova documentação estabelece o roteiro sequencial no documento oficial:
👉 **[DOCUMENTO_MESTRE_REFATORACAO.md](file:///d:/Projetos/Delphi/refatoracao/documentacao/DOCUMENTO_MESTRE_REFATORACAO.md)**
