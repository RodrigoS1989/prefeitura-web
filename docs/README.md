# Central de Documentação da Refatoração Web (Ciclo 2.0)

Bem-vindo ao portal oficial e canônico de documentação técnica, arquitetura e engenharia de software da modernização do sistema **Delphi Prefeitura** para a stack web moderna (**AdonisJS 6 + React 19 + Inertia.js + Lucid ORM + Tailwind CSS v4 + shadcn/ui + Redis**).

---

## 1. Documentos Principais e Oficiais (Marco Zero)

| Documento | Descrição e Finalidade |
| :--- | :--- |
| 📑 [**`DOCUMENTO_MESTRE_REFATORACAO.md`**](file:///d:/Projetos/Delphi/refatoracao/documentacao/DOCUMENTO_MESTRE_REFATORACAO.md) | **Guia Supremo do Projeto**: Especificação arquitetural, visão geral das 12 etapas consecutivas, models, rotas, telas e critérios de aceitação. |
| 📊 [**`catalogo_mestre_telas_prefeitura.md`**](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_mestre_telas_prefeitura.md) | **Censo Integral de Telas**: Auditoria matemática exaustiva de **100% das 1.467 telas** do Delphi original (1.334 em `Forms` e 133 em `view`). |
| 💾 [**`telas_inventario.json`**](file:///d:/Projetos/Delphi/refatoracao/documentacao/telas_inventario.json) | Base de dados em formato JSON contendo todos os metadados estruturados das 1.467 telas para automações. |

---

## 2. Catálogo Analítico por Domínio Funcional (`catalogo_telas/`)

Cada documento abaixo contém a tabela completa com código da unit, classe do formulário, caption original decodificado e tipologia:

| Módulo / Domínio Funcional | Telas Auditadas | Documento Dedicado |
| :--- | :---: | :--- |
| **01. Cidadãos, Pessoas e CadÚnico** | 34 telas | [`01_Cidadaos_e_Social.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/01_Cidadaos_e_Social.md) |
| **02. Território, Logradouros e Estrutura Municipal** | 29 telas | [`02_Territorio_e_Logradouros.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/02_Territorio_e_Logradouros.md) |
| **03. Unidades de Saúde e Profissionais** | 45 telas | [`03_Profissionais_e_Unidades.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/03_Profissionais_e_Unidades.md) |
| **04. Atendimento Clínico, Triagem e PEP** | 66 telas | [`04_Atendimento_Clinico_PEP.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/04_Atendimento_Clinico_PEP.md) |
| **05. Farmácia Municipal, REMUME e Dispensação FEFO** | 50 telas | [`05_Farmacia_e_Medicamentos.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/05_Farmacia_e_Medicamentos.md) |
| **06. Agendamento Ambulatorial e Regulação de Cotas** | 95 telas | [`06_Agendamento_e_Regulacao.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/06_Agendamento_e_Regulacao.md) |
| **07. Faturamento SUS (BPA, APAC, SIA/SIH)** | 23 telas | [`07_Faturamento_SUS.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/07_Faturamento_SUS.md) |
| **08. Assistência Social / SUAS, CIPTEA e PAEFI** | 32 telas | [`08_Assistencia_Social_SUAS.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/08_Assistencia_Social_SUAS.md) |
| **09. e-SUS APS, Vigilância Epidemiológica e Vacinas** | 117 telas | [`09_eSUS_Vigilancia_Vacinas.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/09_eSUS_Vigilancia_Vacinas.md) |
| **10. Frota Municipal, Ambulâncias e Transporte** | 10 telas | [`10_Frota_e_Transporte.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/10_Frota_e_Transporte.md) |
| **11. Cadastros de Apoio, Segurança e Configurações** | 606 telas | [`11_Apoio_Seguranca_Configuracoes.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/11_Apoio_Seguranca_Configuracoes.md) |
| **12. Relatórios Gerenciais, Impressos e Estatísticas** | 360 telas | [`12_Relatorios_e_Estatisticas.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/12_Relatorios_e_Estatisticas.md) |
| **TOTAL GERAL CONSOLIDADO** | **1.467 telas** | **100,0% de Cobertura sem Omissões** |

---

## 3. Planos Detalhados de Execução por Etapa (`planos_etapas/`)

Cada etapa do projeto possui um documento técnico de planejamento de engenharia minucioso, detalhando DDLs, models Lucid, schemas Zod, rotas, controllers e componentes React:

| Etapa | Título do Planejamento Detalhado | Status | Link do Documento |
| :---: | :--- | :---: | :--- |
| **Etapa 00** | Fundação Arquitetural, Layout Reativo, Multi-Tenancy Municipal e RBAC | ✅ Pronto para Execução | [`etapa_00_infraestrutura_layout_rbac.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_00_infraestrutura_layout_rbac.md) |
| **Etapa 01** | Gestão de Cidadãos, Pessoas e Identificação Social (CadÚnico) | ✅ Pronto para Execução | [`etapa_01_cidadaos_pessoas_cadunico.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_01_cidadaos_pessoas_cadunico.md) |
| **Etapa 02** | Divisão Territorial, Logradouros, Estrutura Municipal e Parâmetros | ✅ Pronto para Execução | [`etapa_02_territorio_parametros.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_02_territorio_parametros.md) |
| **Etapas 03 a 11** | Planejamentos das etapas subsequentes | ⏳ Em elaboração por demanda | `planos_etapas/` |

---

## 4. Estrutura do Diretório

```
refatoracao/documentacao/
├── README.md                              # Este portal e índice consolidado
├── DOCUMENTO_MESTRE_REFATORACAO.md        # Documento mestre da nova refatoração (Etapas 00 a 11)
├── catalogo_mestre_telas_prefeitura.md    # Censo e auditoria consolidada de 1.467 telas
├── telas_inventario.json                  # Base estruturada em JSON
├── planos_etapas/                         # Planejamentos detalhados de engenharia por etapa
│   ├── etapa_00_infraestrutura_layout_rbac.md
│   ├── etapa_01_cidadaos_pessoas_cadunico.md
│   └── etapa_02_territorio_parametros.md
├── catalogo_telas/                        # 12 Catálogos analíticos setoriais
│   ├── 01_Cidadaos_e_Social.md
│   ├── 02_Territorio_e_Logradouros.md
│   ├── ...
│   └── 12_Relatorios_e_Estatisticas.md
├── delphi_legado/                         # Mapeamento reverso dos módulos Delphi
└── OLD/                                   # Arquivo histórico dos ciclos anteriores
    ├── etapa_00 a etapa_10 legadas (11 arquivos)
    ├── planos de execução e refatoração anteriores (12 arquivos)
    └── walkthroughs_antigos/ (8 arquivos)
```

## 5. Histórico Preservado (`OLD/`)

Os documentos elaborados em ciclos anteriores de migração que continham inconsistências ou omissões foram preservados na íntegra na pasta:
👉 [`refatoracao/documentacao/OLD/`](file:///d:/Projetos/Delphi/refatoracao/documentacao/OLD/)

Essa preservação assegura a rastreabilidade histórica e integridade de registros, ao mesmo tempo que mantém a pasta raiz da documentação organizada e focada no **Ciclo 2.0**.
