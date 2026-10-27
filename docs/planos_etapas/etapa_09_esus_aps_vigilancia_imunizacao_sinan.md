# Plano Detalhado de Execução: Etapa 09 - e-SUS APS, Vigilância Epidemiológica, Imunização/Vacinas e SINAN

> **Status**: Pronto para Execução  
> **Documento Vinculado**: [DOCUMENTO_MESTRE_REFATORACAO.md](file:///d:/Projetos/Delphi/refatoracao/documentacao/DOCUMENTO_MESTRE_REFATORACAO.md)  
> **Dependências**: [Etapa 00 (Infraestrutura e RBAC)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_00_infraestrutura_layout_rbac.md) | [Etapa 01 (Cidadãos e CadÚnico)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_01_cidadaos_pessoas_cadunico.md) | [Etapa 02 (Território)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_02_territorio_parametros.md) | [Etapa 03 (Unidades e Profissionais)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_03_unidades_profissionais_lotacoes.md) | [Etapa 04 (Atendimento Clínico e PEP)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_04_atendimento_clinico_pep.md) | [Etapa 05 (Farmácia e Estoque)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_05_farmacia_remume_dispensacao_fefo.md)  
> **Stack Oficial**: AdonisJS v6, Lucid ORM, Inertia.js v2, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Redis 7, Apache Thrift v0.20, RNDS FHIR

---

## 1. Visão Geral e Alinhamento com o Projeto Original

A **Etapa 09** representa a camada de integração do ecossistema municipal com a atenção primária federal (**e-SUS APS**) e a vigilância em saúde nacional (**PNI / SI-PNI**, **SINAN** e **RNDS**). Trata-se do segundo maior catálogo de telas do acervo Delphi legado, com **117 formulários auditados** em `09_eSUS_Vigilancia_Vacinas.md`.

O núcleo operacional desta etapa é estruturado em 4 pilares:
1. **As 7 Fichas Oficiais CDS / PEC do e-SUS APS**:
   - FAI (Ficha de Atendimento Individual - Médicos e Enfermeiros)
   - FAP (Ficha de Procedimentos Coletivos e Individuais da Enfermagem)
   - FAO (Ficha de Atendimento Odontológico Individual e Odontograma)
   - FAC (Ficha de Atividade Coletiva - Educação em Saúde e Grupos)
   - CadInd (Cadastro Individual e Condições de Saúde pelo Agente Comunitário)
   - CadDom (Cadastro Domiciliar, Territorial e Famílias pelo ACS)
   - FAD / FAM / Visita (Ficha de Atendimento Domiciliar, Marcadores de Consumo Alimentar e Visitas Domiciliares)
2. **Motor Oficial de Serialização e Validação Apache Thrift**:
   - Geração dos pacotes binários compactados `.zip` conforme a versão oficial dos schemas Thrift do e-SUS APS (v5.x/v6.x) com assinatura digital e envio para o Centralizador Municipal ou diretamente para o Ministério da Saúde.
3. **Módulo Completo de Imunização e Vacinação**:
   - Carteira de vacinação digital do cidadão baseada no Calendário Oficial do Programa Nacional de Imunizações (PNI).
   - Aplicação de doses com controle rigoroso de lote, validade, fabricante e via de administração.
   - Monitoramento contínuo da cadeia de frio (temperatura entre +2°C e +8°C) em câmaras frias e refrigeradores de vacina.
   - Envio de eventos RIA (Registro de Imunobiológico Administrado) para a RNDS.
4. **Vigilância Epidemiológica e Notificações SINAN**:
   - Fichas de Notificação Compulsória e Investigação de Agravos (Dengue, Chikungunya, Tuberculose, Hanseníase, Violências e Intoxicações).

---

### 1.1. Mapeamento dos Formulários e Telas Delphi Legadas (117 Telas)

O plano substitui e consolida todas as 117 telas legadas em módulos modernos, reativos e centralizados:
- **Telas de Configuração e Exportação e-SUS**: `Prefeitura.View.Form.EsusConfig` (PM1052), `Prefeitura.View.Form.EsusProducao` (PM1047), `UPM134`, `UPM134R`, `UPM185`, `UPM257`, `Prefeitura.View.Frame.Esus.Inconsistencias`.
- **Fichas e Atendimentos e-SUS**: `UPM123`, `UPM124` (FAI), `UPM090`, `UPM091` (FAP), `UPM092` (FAO), `UPM083_30` (FAC), `UPM079_21`, `UPM080` (CadInd), `UPM132_21`, `UPM133` (CadDom), `UPM152_30` (FAD), `UPM148_30` (Consumo Alimentar), `UPM081_21`, `UPM082` (Visita ACS), `Prefeitura.View.Form.Esus.FIC` (Cuidado Compartilhado).
- **Vulnerabilidade e Escalas Familiares**: `Saude.View.Form.VulnerabilidadeFAM` (PM1017 - EVFAM-BR), `UPM294`, `UPM294R` (Escala de Risco Coelho-Savassi), `UPM035`, `UPM044R`, `UPM800`, `UPM803`, `UPM804`, `UPM883`.
- **Vacinação, Doses e Carteira Vacinal**: `UPM198`, `UPM199`, `UPM522`, `UPM522R`, `UPM523`, `UPM854` a `UPM870` (Cadastro completo de doses, medidas, grupos, faixas etárias e carteiras), `Prefeitura.View.Form.CampanhaVacinal`, `Prefeitura.View.Relatorio.Vacinas.*` (RNDS Simplificado e Detalhado).
- **Odontologia e Odontograma e-SUS**: `UPM828`, `UPM828R`, `UPM829`, `UPM839` (Cadastro e pesquisa de faces dos dentes e dentes permanentes/decíduos).
- **Vigilância, Almoxarifado e Relatórios**: `Prefeitura.View.Form.AjusteFracao`, `Prefeitura.View.Form.ImplantacaoAlmoxarifado`, `UPM713`, `UPM727`, `UPM917`, `UPM918`, `UPM299` (Conferência BPA x e-SUS), `UPM497` (Vínculos BPA x e-SUS).

---

## 2. Modelagem Relacional do Banco de Dados (PostgreSQL / Lucid ORM)

```sql
-- 1. Catálogo Oficial de Imunobiológicos (PNI / RNDS)
CREATE TABLE vacinas_catalogo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_sipni VARCHAR(10) NOT NULL UNIQUE,
    codigo_rnds VARCHAR(20),
    nome_vacina VARCHAR(150) NOT NULL,
    sigla VARCHAR(20) NOT NULL,
    tipo VARCHAR(30) NOT NULL, -- 'VIRAL_ATENUADA', 'INATIVADA', 'RECOMBINANTE', 'SORO', 'IMUNOGLOBULINA'
    calendario_tipo VARCHAR(20) NOT NULL, -- 'CRIANCA', 'ADOLESCENTE', 'ADULTO_IDOSO', 'GESTANTE', 'ESPECIAL'
    idade_recomendada_meses INTEGER,
    intervalo_minimo_dias INTEGER DEFAULT 30,
    doses_obrigatorias INTEGER NOT NULL DEFAULT 1,
    via_administracao VARCHAR(30) NOT NULL, -- 'INTRAMUSCULAR', 'SUBCUTANEA', 'ORAL', 'INTRADERMICA'
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Doses de Vacinas e Lotes em Câmaras Frias
CREATE TABLE vacinas_lotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vacina_id UUID NOT NULL REFERENCES vacinas_catalogo(id),
    unidade_saude_id UUID NOT NULL REFERENCES unidades_saude(id),
    numero_lote VARCHAR(50) NOT NULL,
    fabricante VARCHAR(100) NOT NULL,
    data_fabricacao DATE,
    data_validade DATE NOT NULL,
    quantidade_doses_inicial INTEGER NOT NULL,
    quantidade_doses_saldo INTEGER NOT NULL,
    camara_fria_identificador VARCHAR(50) NOT NULL,
    temperatura_armazenamento_c NUMERIC(4, 1) DEFAULT 4.0,
    status VARCHAR(20) NOT NULL DEFAULT 'DISPONIVEL', -- 'DISPONIVEL', 'QUERENTENA', 'EXPIRADO', 'ESGOTADO'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Registro de Aplicação de Vacinas (Carteira Vacinal Digital)
CREATE TABLE vacinas_aplicacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cidadao_id UUID NOT NULL REFERENCES cidadaos(id),
    unidade_saude_id UUID NOT NULL REFERENCES unidades_saude(id),
    vacina_id UUID NOT NULL REFERENCES vacinas_catalogo(id),
    lote_id UUID NOT NULL REFERENCES vacinas_lotes(id),
    profissional_id UUID NOT NULL REFERENCES profissionais(id),
    cns_profissional VARCHAR(15) NOT NULL,
    data_aplicacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    estrategia_vacinacao VARCHAR(30) NOT NULL DEFAULT 'ROTINA', -- 'ROTINA', 'CAMPANHA', 'BLOQUEIO', 'ESPECIAL'
    dose_aplicada VARCHAR(20) NOT NULL, -- 'DOSE_1', 'DOSE_2', 'DOSE_3', 'REFORCO_1', 'REFORCO_2', 'DOSE_UNICA'
    local_aplicacao VARCHAR(30) NOT NULL, -- 'DELTOIDE_ESQUERDO', 'DELTOIDE_DIREITO', 'VASTO_LATERAL_COXA', 'ORAL'
    data_proxima_dose DATE,
    rnds_status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE', -- 'PENDENTE', 'ENVIADO', 'ERRO'
    rnds_id VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vac_cid ON vacinas_aplicacoes(cidadao_id);

-- 4. Monitoramento da Cadeia de Frio (Câmaras Frias e Geladeiras)
CREATE TABLE camaras_frias_leituras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unidade_saude_id UUID NOT NULL REFERENCES unidades_saude(id),
    equipamento_identificador VARCHAR(50) NOT NULL,
    data_hora_leitura TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    temperatura_atual NUMERIC(4, 1) NOT NULL,
    temperatura_minima NUMERIC(4, 1) NOT NULL,
    temperatura_maxima NUMERIC(4, 1) NOT NULL,
    responsavel_leitura_id UUID NOT NULL REFERENCES profissionais(id),
    alerta_excursao_termica BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE se < +2°C ou > +8°C
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Fichas e-SUS APS e Pacotes de Exportação Thrift
CREATE TABLE esus_remessas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cnes_unidade VARCHAR(7) NOT NULL,
    ine_equipe VARCHAR(10),
    competencia VARCHAR(6) NOT NULL, -- YYYYMM
    tipo_pacote VARCHAR(30) NOT NULL, -- 'LOTE_FICHAS_CDS', 'PEC_CENTRALIZADOR'
    versao_thrift VARCHAR(10) NOT NULL DEFAULT '5.3.0',
    total_fichas INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'EM_PROCESSAMENTO', -- 'EM_PROCESSAMENTO', 'VALIDADO', 'ENVIADO', 'COM_INCONSISTENCIAS'
    arquivo_zip_conteudo BYTEA,
    arquivo_hash_sha256 VARCHAR(64),
    log_inconsistencias JSONB,
    data_envio TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Notificações Compulsórias SINAN (Vigilância Epidemiológica)
CREATE TABLE sinan_notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_notificacao VARCHAR(15) UNIQUE NOT NULL,
    unidade_notificadora_id UUID NOT NULL REFERENCES unidades_saude(id),
    cidadao_id UUID NOT NULL REFERENCES cidadaos(id),
    profissional_notificador_id UUID NOT NULL REFERENCES profissionais(id),
    agravo_codigo_cid VARCHAR(6) NOT NULL, -- Ex: 'A90' (Dengue), 'A15' (Tuberculose)
    agravo_nome VARCHAR(100) NOT NULL,
    data_primeiros_sintomas DATE NOT NULL,
    data_notificacao DATE NOT NULL,
    classificacao_final VARCHAR(30) DEFAULT 'EM_INVESTIGACAO', -- 'CONFIRMADO_LAB', 'CONFIRMADO_CLINICO', 'DESCARTADO'
    evolucao_caso VARCHAR(30) DEFAULT 'EM_TRATAMENTO', -- 'CURA', 'OBITO_AGRAVO', 'OBITO_OUTRAS_CAUSAS'
    dados_especificos_agravo JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Motor de Serialização Apache Thrift e Integração RNDS

1. **Compilação e Suporte a Schemas Thrift**:
   - Geração de código TypeScript a partir dos arquivos `.thrift` oficiais do e-SUS APS para todas as fichas (`FichaAtendimentoIndividualMasterThrift`, `FichaAtendimentoOdontologicoMasterThrift`, `FichaProcedimentoMasterThrift`, etc.).
   - Assinatura digital da remessa utilizando chave e certificado A1 ICP-Brasil do município.
2. **Webhooks e Workers de Envio (BullMQ)**:
   - Worker assíncrono `EsusExportWorker` que compacta em lote as fichas validadas, serializa via Thrift, empacota em `.zip` e realiza o upload via mTLS para o servidor Centralizador e-SUS da Secretaria de Estado da Saúde.
3. **Barramento RNDS (FHIR / HL7)**:
   - Toda aplicação de vacina salva na tabela `vacinas_aplicacoes` dispara um job no BullMQ para serializar o recurso FHIR `Immunization` e enviar via REST à RNDS com token JWT assinado.

---

## 4. Frontend em React 19 + Inertia.js v2 + Tailwind v4 + shadcn/ui

1. **`/imunizacao/carteira/:cidadaoId` (`CarteiraVacinacaoDigital.tsx`)**:
   - Carteira de vacinação dinâmica colorida por status (Em dia, Em atraso, Reforço agendado, Aplicada), com cálculo automático de aprazamento de doses baseado na idade do paciente.
2. **`/imunizacao/sala-vacinas` (`SalaVacinasApp.tsx`)**:
   - Registro de aplicação de doses em 3 etapas com leitor de código de barras do frasco da vacina para preenchimento instantâneo de lote e validade.
3. **`/imunizacao/camaras-frias` (`MonitoramentoCamaraFria.tsx`)**:
   - Gráfico de temperatura contínua em tempo real (linha verde entre +2°C e +8°C) com alertas sonoros e visuais de excursão térmica e formulário de ocorrência.
4. **`/esus/painel-producao` (`PainelEsusProducao.tsx`)**:
   - Validador em tela com grade de fichas geradas por equipe/profissional e diagnóstico visual de inconsistências (campos em vermelho com explicação clara antes da exportação).
5. **`/vigilancia/sinan` (`NotificacaoSinanView.tsx`)**:
   - Formulário ágil de notificação compulsória com preenchimento automático a partir de confirmação diagnóstica no PEP.

---

## 5. Critérios de Homologação da Etapa 09

1. **Validação Estrutural Thrift 100% Compatível**: Os arquivos binários `.zip` gerados devem ser aceitos pelo Centralizador e-SUS APS oficial sem recusa de schema ou dados corrompidos.
2. **Consistência de Aprazamento Vacinal**: O sistema não deve permitir o registro de dose de reforço antes do intervalo mínimo de dias preconizado pelo PNI sem justificativa de bloqueio vacinal.
3. **Rastreabilidade da Cadeia de Frio**: Toda aplicação de imunobiológico deve rastrear obrigatoriamente o lote e a câmara fria de procedência.
