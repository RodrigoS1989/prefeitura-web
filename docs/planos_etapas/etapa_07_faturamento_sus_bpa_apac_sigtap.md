# Plano Detalhado de Execução: Etapa 07 - Faturamento SUS Municipal (BPA, APAC, SIA/SIH e SIGTAP)

> **Status**: Pronto para Execução  
> **Documento Vinculado**: [DOCUMENTO_MESTRE_REFATORACAO.md](file:///d:/Projetos/Delphi/refatoracao/documentacao/DOCUMENTO_MESTRE_REFATORACAO.md)  
> **Dependências**: [Etapa 00 (Infraestrutura e RBAC)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_00_infraestrutura_layout_rbac.md) | [Etapa 01 (Cidadãos)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_01_cidadaos_pessoas_cadunico.md) | [Etapa 03 (Unidades e Profissionais)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_03_unidades_profissionais_lotacoes.md) | [Etapa 04 (Atendimento Clínico e PEP)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_04_atendimento_clinico_pep.md) | [Etapa 06 (Agendamento e Regulação)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_06_agendamento_regulacao_tfd.md)  
> **Stack Oficial**: AdonisJS v6, Lucid ORM, Inertia.js v2, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Redis 7, BullMQ

---

## 1. Visão Geral e Alinhamento com o Projeto Original

A **Etapa 07** consolida o núcleo financeiro e assistencial do município junto ao Ministério da Saúde e ao Sistema Único de Saúde (SUS). O objetivo é apurar toda a produção clínica, ambulatorial, de enfermagem e odontológica gerada nos módulos anteriores (PEP, Atendimentos Rápidos, Procedimentos, Farmácia e Vacinas), submeter cada registro ao motor oficial de regras de consistência da **Tabela Unificada SIGTAP** (Sistema de Gerenciamento da Tabela de Procedimentos, Medicamentos e OPM do SUS) e gerar os arquivos magnéticos oficiais de faturamento nos padrões federais:
1. **BPA-C (Boletim de Produção Ambulatorial Consolidado)**: Agrupamento quantitativo por CBO x Procedimento para atendimentos sem exigência de identificação nominal.
2. **BPA-I (Boletim de Produção Ambulatorial Individualizado)**: Registro nominal com CNS do paciente, CPF, CBO do profissional executante, CID-10 e comprovação de atendimento.
3. **APAC (Autorização de Procedimentos de Alta Complexidade)**: Laudos de solicitação, autorização pelo médico auditor e faturamento mensal de procedimentos continuados (bariatria, nefrologia, oncologia e reabilitação física/intelectual).
4. **Exportação Magnética DATASUS e FTP**: Geração de arquivos posicionais `.bpa` e remessas para validação no software federal SIA/SUS.

No acervo Delphi legado, além das **23 telas catalogadas** em `07_Faturamento_SUS.md`, a regra de negócio residia no subsistema autônomo **`refatoracao/IntegraFaturamento`** (`IntegraFaturamento.dpr`, `UExportaFaturamentoBPAMagnetivoUBS`, `UITF000`, `UITF001`, `UITF003`):

---

### 1.1. Mapeamento dos Formulários e Telas Delphi Legadas (23 Telas + IntegraFaturamento)

| # | Formulário / Unit Delphi Original | Caption / Função no Delphi 7 | Papel Arquitetural na Stack Web Moderna (AdonisJS + React) |
| :-: | :--- | :--- | :--- |
| 1 | `Prefeitura.View.Form.Faturamento.Exportacao` | PM1008 - Exportação do Faturamento | Modal e assistente de fechamento de competência e exportação de lote BPA/APAC |
| 2 | `Prefeitura.View.Form.FtpDatasus` | FTP - Datasus | Serviço de transmissão segura e conexão SFTP/Webservice com o portal do DATASUS |
| 3 | `UPM278` | PM278 - Manutenção no Faturamento | Painel operacional de auditoria e correção de itens com glosa ou inconsistência |
| 4 | `UPM720` | PM720 - Cadastro de Orgão de Destino do BPA | Configuração do Órgão de Destino do BPA (Secretaria Estadual/Regional de Saúde) |
| 5 | `UPM721` | PM721 - Pesquisa de Orgão de Destino do BPA | Componente de busca e seleção de órgãos de destino do BPA |
| 6 | `UPM722` | PM722 - Cadastro de Orgãos Responsáveis pelo BPA | Cadastro do Órgão Responsável pelo Faturamento (Secretaria Municipal de Saúde) |
| 7 | `UPM723` | PM723 - Pesquisa de Orgãos Responsaveis pelo BPA | Componente de busca e seleção de órgãos emissores e responsáveis |
| 8 | `UPM771` | PM771 - Relatório de Faturamento - Tabela Unificada | Filtros de apuração financeira e quantitativa da produção mensal por tabela SIGTAP |
| 9 | `UPM771R` | PM771R - Relatório de Faturamento - Tabela Unificada | Visualizador e emissor em PDF/Excel do espelho financeiro de faturamento |
| 10 | `UPM792` | PM792 - Cadastro de Doenças - SIAB | Cadastro e correlação de agravos e códigos de morbidade do faturamento básico |
| 11 | `UPM792R` | PM792R - Relação de Doenças SIAB | Relatório analítico de patologias e códigos de faturamento |
| 12 | `UPM793` | PM793 - Pesquisa de Doenças - SIAB | Diálogo de busca rápida de patologias para faturamento |
| 13 | `UPM794` | PM794 - Cadastro de Segmentos - SIAB | Parametrização territorial de segmentos assistenciais de produção |
| 14 | `UPM795` | PM795 - Pesquisa de Segmento SIAB | Diálogo de consulta de segmentos assistenciais |
| 15 | `UPM796` | PM796 - Cadastros de Área - SIAB | Parametrização de áreas de produção para apuração descentralizada |
| 16 | `UPM796R` | PM796R - Relação de Área SIAB | Relatório de áreas territoriais de faturamento |
| 17 | `UPM797` | PM797 - Pesquisa de Áreas - SIAB | Modal de pesquisa de áreas |
| 18 | `UPM798` | PM798 - Cadastro de Micro-Área - SIAB | Mapeamento de micro-áreas de atuação das equipes de ESF |
| 19 | `UPM798R` | PM798R - Relação de Micro Área SIAB | Relatório impresso de micro-áreas de produção |
| 20 | `UPM799` | PM799 - Pesquisa de Micro Área - SIAB | Componente de autocompletar de micro-áreas |
| 21 | `UPM799R` | PM799R - Relação de Micro Área SIAB | Relatório complementar de micro-áreas |
| 22 | `UPM801` | PM801 - Outras Informações - SIAB | Parametrizações adicionais e metadados de fechamento de lote |
| 23 | `UPM802` | PM802 - Doenças SIAB | Tabela de classificação nosológica para apuração |
| 24 | `UExportaFaturamentoBPAMagnetivoUBS` | Geração do Arquivo Magnético BPA-I/BPA-C | Engine em TypeScript: serializador oficial do arquivo texto posicional `.bpa` |
| 25 | `UITF000` / `UITF001` / `UITF003` | Integração Faturamento e Fechamento | Dashboard web de apuração, validação prévia de glosas e remessas |

---

## 2. Modelagem Relacional do Banco de Dados (PostgreSQL / Lucid ORM)

```sql
-- 1. Tabela Unificada SIGTAP (Procedimentos, Valores e Regras)
CREATE TABLE sigtap_procedimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_procedimento VARCHAR(10) NOT NULL, -- Código oficial 10 dígitos (Ex: 0301010072)
    nome VARCHAR(255) NOT NULL,
    complexidade VARCHAR(2) NOT NULL, -- 'AB' (Atenção Básica), 'MC' (Média), 'AC' (Alta)
    sexo_permitido CHAR(1) NOT NULL DEFAULT 'I', -- 'M', 'F', 'I' (Indiferente)
    idade_minima_meses INTEGER NOT NULL DEFAULT 0,
    idade_maxima_meses INTEGER NOT NULL DEFAULT 1320, -- Até 110 anos
    instrumento_registro VARCHAR(2) NOT NULL, -- '01' BPA-C, '02' BPA-I, '03' APAC, '04' AIH
    pontos NUMERIC(10, 2) DEFAULT 0,
    valor_sa NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- Serviço Ambulatorial
    valor_sp NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- Serviço Profissional
    competencia_vigencia VARCHAR(6) NOT NULL, -- YYYYMM
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_sigtap_proc_comp UNIQUE (codigo_procedimento, competencia_vigencia)
);

CREATE INDEX idx_sigtap_cod ON sigtap_procedimentos(codigo_procedimento);
CREATE INDEX idx_sigtap_instrumento ON sigtap_procedimentos(instrumento_registro);

-- 2. Compatibilidades CBO x Procedimento SIGTAP
CREATE TABLE sigtap_cbos_compativeis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_procedimento VARCHAR(10) NOT NULL,
    cbo_codigo VARCHAR(6) NOT NULL, -- Ex: 225125 (Médico Clínico)
    cbo_descricao VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_sigtap_cbo UNIQUE (codigo_procedimento, cbo_codigo)
);

CREATE INDEX idx_sigtap_cbo_busca ON sigtap_cbos_compativeis(codigo_procedimento, cbo_codigo);

-- 3. Compatibilidades CID-10 x Procedimento SIGTAP
CREATE TABLE sigtap_cids_compativeis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_procedimento VARCHAR(10) NOT NULL,
    cid_codigo VARCHAR(4) NOT NULL, -- Ex: 'I10', 'E11'
    principal BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_sigtap_cid UNIQUE (codigo_procedimento, cid_codigo)
);

-- 4. Órgãos Responsáveis e Destinos do BPA (UPM720, UPM722)
CREATE TABLE faturamento_orgaos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo VARCHAR(20) NOT NULL, -- 'RESPONSAVEL_EMISSOR', 'DESTINO_BPA'
    codigo_orgao VARCHAR(10) NOT NULL,
    nome_orgao VARCHAR(150) NOT NULL,
    sigla VARCHAR(20),
    cnes_orgao VARCHAR(7),
    cidade VARCHAR(100),
    uf CHAR(2),
    responsavel_nome VARCHAR(100),
    responsavel_cpf VARCHAR(11),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Lotes e Remessas de Faturamento (BPA e APAC)
CREATE TABLE remessas_faturamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competencia VARCHAR(6) NOT NULL, -- YYYYMM
    tipo_remessa VARCHAR(10) NOT NULL, -- 'BPA_INDIVIDUAL', 'BPA_CONSOLIDADO', 'APAC'
    unidade_id UUID NOT NULL REFERENCES unidades_saude(id),
    orgao_responsavel_id UUID REFERENCES faturamento_orgaos(id),
    orgao_destino_id UUID REFERENCES faturamento_orgaos(id),
    sequencial_remessa INTEGER NOT NULL DEFAULT 1,
    total_registros INTEGER NOT NULL DEFAULT 0,
    total_folhas INTEGER NOT NULL DEFAULT 1,
    valor_total_producao NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'EM_APURACAO', -- 'EM_APURACAO', 'VALIDADO_COM_ERROS', 'APROVADO', 'EXPORTADO'
    arquivo_nome VARCHAR(100),
    arquivo_conteudo TEXT,
    arquivo_hash_md5 VARCHAR(32),
    usuario_fechamento_id UUID REFERENCES usuarios(id),
    data_fechamento TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Itens de Produção Apurados (BPA-I e BPA-C)
CREATE TABLE itens_faturamento_producao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remessa_id UUID REFERENCES remessas_faturamento(id) ON DELETE CASCADE,
    atendimento_id UUID REFERENCES atendimentos(id),
    origem_registro VARCHAR(30) NOT NULL, -- 'PEP_CONSULTA', 'PROCEDIMENTO_ENFERMAGEM', 'ODONTO', 'VACINA', 'EXAME'
    cnes_unidade VARCHAR(7) NOT NULL,
    competencia VARCHAR(6) NOT NULL,
    data_atendimento DATE NOT NULL,
    
    -- Profissional
    profissional_id UUID NOT NULL REFERENCES profissionais(id),
    cns_profissional VARCHAR(15) NOT NULL,
    cbo_profissional VARCHAR(6) NOT NULL,
    
    -- Paciente (Obrigatório em BPA-I)
    cidadao_id UUID REFERENCES cidadaos(id),
    cns_cidadao VARCHAR(15),
    cpf_cidadao VARCHAR(11),
    sexo_cidadao CHAR(1),
    data_nascimento_cidadao DATE,
    municipio_residencia_ibge VARCHAR(6),
    
    -- Procedimento e Diagnóstico
    codigo_procedimento VARCHAR(10) NOT NULL,
    cid_principal VARCHAR(4),
    carater_atendimento VARCHAR(2) NOT NULL DEFAULT '01', -- '01' Eletivo, '02' Urgência
    quantidade INTEGER NOT NULL DEFAULT 1,
    valor_unitario NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    valor_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    
    -- Consistência SIGTAP
    status_validacao VARCHAR(20) NOT NULL DEFAULT 'PENDENTE', -- 'VALIDO', 'GLOSADO', 'ADVERTENCIA'
    inconsistencias JSONB, -- Array de erros: [{ "campo": "cbo", "erro": "CBO incompatível com procedimento 0301010072" }]
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_itens_fat_rem ON itens_faturamento_producao(remessa_id);
CREATE INDEX idx_itens_fat_val ON itens_faturamento_producao(status_validacao);

-- 7. Controle de Laudos e Autorizações APAC
CREATE TABLE laudos_apac (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_apac VARCHAR(15) UNIQUE, -- Número único da autorização
    unidade_solicitante_id UUID NOT NULL REFERENCES unidades_saude(id),
    cidadao_id UUID NOT NULL REFERENCES cidadaos(id),
    profissional_solicitante_id UUID NOT NULL REFERENCES profissionais(id),
    procedimento_principal VARCHAR(10) NOT NULL,
    cid_principal VARCHAR(4) NOT NULL,
    cid_secundario VARCHAR(4),
    carater_atendimento VARCHAR(2) NOT NULL DEFAULT '01',
    data_solicitacao DATE NOT NULL,
    data_autorizacao DATE,
    data_validade_inicio DATE,
    data_validade_fim DATE,
    medico_autorizador_nome VARCHAR(100),
    medico_autorizador_cns VARCHAR(15),
    status VARCHAR(30) NOT NULL DEFAULT 'SOLICITADA', -- 'SOLICITADA', 'AUTORIZADA', 'FATURADA', 'ENCERRADA', 'NEGADA'
    justificativa_clinica TEXT NOT NULL,
    observacoes_regulador TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Arquitetura de Backend e Motores de Negócio (AdonisJS v6)

### 3.1. `ValidadorSigtapService.ts`
Implementa a matriz oficial de consistências antes da consolidação do BPA:
1. **Regra CBO x Procedimento**: Garante que o profissional executante tem habilitação profissional para registrar aquele código SIGTAP (`sigtap_cbos_compativeis`).
2. **Regra Sexo x Procedimento**: Bloqueia procedimentos exclusivos femininos (ex: parto, citopatológico) para sexo masculino e vice-versa.
3. **Regra Idade x Procedimento**: Converte a data de nascimento em meses e valida `idade_minima_meses <= idade <= idade_maxima_meses`.
4. **Regra CID x Procedimento**: Checa se o CID informado consta na tabela de compatibilidade estrita do procedimento.
5. **Regra de Unicidade Diária**: Alerta caso haja duplicidade de procedimento individualizado no mesmo paciente no mesmo dia por profissionais distintos sem justificativa de repetição.

### 3.2. `ExportadorBpaService.ts`
Serializa as linhas para o layout fixo posicional oficial do DATASUS (`02` Individualizado / `01` Consolidado):
- **Header do Arquivo**: CNES do estabelecimento, competência YYYYMM, tipo de órgão, total de folhas, assinatura e versão do layout `BPA-01.00`.
- **Linha de Registro BPA-I (Linha de 160 colunas)**:
  - Posições 01-02: Tipo (`02`)
  - Posições 03-09: CNES Unidade
  - Posições 10-15: Competência YYYYMM
  - Posições 16-30: CNS do Profissional (15 dígitos)
  - Posições 31-36: CBO (6 dígitos)
  - Posições 37-44: Data do Atendimento (YYYYMMDD)
  - Posições 45-50: Folha e Linha
  - Posições 51-60: Código do Procedimento (10 dígitos)
  - Posições 61-75: CNS do Paciente (15 dígitos)
  - Posições 76-76: Sexo (M/F)
  - Posições 77-82: Município de Residência IBGE (6 dígitos)
  - Posições 83-86: CID-10 Principal
  - Posições 87-89: Idade do Paciente
  - Posições 90-95: Quantidade
  - Posições 96-97: Caráter de Atendimento (01 Eletivo / 02 Urgência)
  - Posições 98-108: CPF do Paciente

---

## 4. Frontend em React 19 + Inertia.js v2 + Tailwind v4 + shadcn/ui

1. **`/faturamento/dashboard` (`DashboardFaturamento.tsx`)**:
   - Cards executivos de produção apurada na competência, valor estimado em R$, taxa de inconsistências (%) e comparativo com o teto MAC/PAB pactuado.
2. **`/faturamento/apuracao` (`ApuracaoProducaoView.tsx`)**:
   - Motor de apuração que varre todos os atendimentos do mês da unidade, roda a consistência SIGTAP em background com barra de progresso em WebSockets e exibe a matriz de registros válidos e glosas.
3. **`/faturamento/manutencao-glosas` (`ManutencaoGlosasTable.tsx`)** (Substitui `UPM278`):
   - Grid de edição rápida em lote para correção de CBOs divergentes, complementação de CIDs obrigatórios e inclusão de CNS do paciente sem necessidade de reabrir o prontuário.
4. **`/faturamento/remessas-bpa` (`RemessasBpaView.tsx`)**:
   - Geração do arquivo posicional oficial `.bpa`, cálculo de Hash MD5, download direto e espelho BPA impresso em PDF.
5. **`/faturamento/apac` (`GestaoApacView.tsx`)**:
   - Emissão de Laudos de Solicitação de APAC, controle de validade trimestral/semestral e apuração de procedimentos de alta complexidade.
6. **`/faturamento/tabela-sigtap` (`ImportadorSigtapModal.tsx`)**:
   - Importador oficial dos arquivos de release mensal do DATASUS (`TabelaUnificada_YYYYMM.zip`) atualizando valores, descrições e regras.

---

## 5. Critérios de Homologação da Etapa 07

1. **Paridade com Validador Oficial DATASUS**: O arquivo `.bpa` gerado pelo sistema web deve ser importado no software SIA/SUS do Ministério da Saúde sem erros estruturais ou de layout.
2. **Auditoria Prévia de Glosas**: 100% dos erros de compatibilidade CBO x Procedimento x CID x Idade devem ser sinalizados na interface web antes do fechamento do lote.
3. **Segurança e Imutabilidade**: Remessas faturadas e transmitidas são congeladas e recebem bloqueio total de edição para auditoria do DENASUS.
