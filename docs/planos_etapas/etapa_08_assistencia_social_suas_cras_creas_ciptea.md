# Plano Detalhado de Execução: Etapa 08 - Assistência Social / SUAS, CRAS, CREAS, CIPTEA e Benefícios

> **Status**: Pronto para Execução  
> **Documento Vinculado**: [DOCUMENTO_MESTRE_REFATORACAO.md](file:///d:/Projetos/Delphi/refatoracao/documentacao/DOCUMENTO_MESTRE_REFATORACAO.md)  
> **Dependências**: [Etapa 00 (Infraestrutura e RBAC)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_00_infraestrutura_layout_rbac.md) | [Etapa 01 (Cidadãos e CadÚnico)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_01_cidadaos_pessoas_cadunico.md) | [Etapa 02 (Território)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_02_territorio_parametros.md) | [Etapa 03 (Profissionais e Lotações)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_03_unidades_profissionais_lotacoes.md)  
> **Stack Oficial**: AdonisJS v6, Lucid ORM, Inertia.js v2, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Redis 7

---

## 1. Visão Geral e Alinhamento com o Projeto Original

A **Etapa 08** materializa a gestão de toda a política de Assistência Social do município sob as diretrizes do **SUAS (Sistema Único de Assistência Social)** e do Ministério do Desenvolvimento e Assistência Social, Família e Combate à Fome (MDS). O objetivo é fornecer suporte operacional às equipes técnicas multidisciplinares (Assistentes Sociais com registro no CRESS e Psicólogos com registro no CRP) em suas atuações na Proteção Social Básica (**CRAS - Centro de Referência de Assistência Social**) e Proteção Social Especial de Média e Alta Complexidade (**CREAS - Centro de Referência Especializado de Assistência Social** e Unidades de Acolhimento).

O escopo compreende:
1. **Prontuário SUAS Eletrônico**: Diagnóstico familiar socioeconômico e territorial unificado ao CadÚnico, histórico de atendimentos e plano de acompanhamento familiar (PAIF).
2. **PAEFI (Proteção e Atendimento Especializado a Famílias e Indivíduos)**: Módulo de atenção a famílias com direitos violados (violência doméstica, abuso/exploração sexual, trabalho infantil, negligência a idosos), articulado com Conselho Tutelar, Ministério Público e Poder Judiciário.
3. **Concessão de Benefícios Eventuais**: Fluxo auditado de solicitação, avaliação de vulnerabilidade, emissão de parecer social e deferimento de benefícios (cesta básica, auxílio-natalidade, auxílio-funeral, aluguel social temporário).
4. **CIPTEA (Carteira de Identificação da Pessoa com Transtorno do Espectro Autista)**: Sistema municipal conforme a Lei Federal nº 13.977/2020 (Lei Romeo Mion), com requerimento digital, upload de laudo médico com CID-10/CID-11, emissão da carteira com foto e validação pública instantânea por **QR Code**.
5. **Integração Saúde x Social**: Compartilhamento regulado de indicadores de vulnerabilidade familiar com a Estratégia Saúde da Família (ESF) preservando o sigilo profissional (UPM716).

---

### 1.1. Mapeamento dos Formulários e Telas Delphi Legadas (32 Telas)

| # | Formulário / Unit Delphi Original | Caption / Função no Delphi 7 | Papel Arquitetural na Stack Web Moderna (AdonisJS + React) |
| :-: | :--- | :--- | :--- |
| 1 | `Prefeitura.View.Frame.Cidadao.Social` | Programas Sociais e Informações de Renda Familiar | Aba Social no Prontuário do Cidadão (Bolsa Família, BPC, Renda per Capita) |
| 2 | `Social.View.Form.RelatoriosCiptea` | Requerimentos de Ciptea | Painel de monitoramento e auditoria de carteiras CIPTEA solicitadas e emitidas |
| 3 | `Social.View.Form.RequerimentoCiptea` | Requerimento de CIPTEA | Formulário de solicitação de carteira do autista com upload de laudo e foto |
| 4 | `Social.View.Relatorio.Atendimento.Agenda.Comprovante` | PM222 - Comprovante de agendamento de atendimento | Comprovante de agendamento no CRAS/CREAS em formato A4 |
| 5 | `Social.View.Relatorio.Atendimento.Agenda.Comprovante.Termica` | PM222 - Comprovante Térmico de Agendamento | Emissão de ticket de agendamento para impressora térmica de 80mm |
| 6 | `Social.View.Relatorio.Ciptea` | RelatorioCiptea | Documento oficial da Carteirinha CIPTEA (formato crachá/cartão com QR Code) |
| 7 | `Social.View.Relatorio.Ciptea.Analitico` | RelatorioCipteaAnalitico | Relatório analítico de carteiras CIPTEA por faixa etária, bairro e grau |
| 8 | `Social.View.Relatorio.Ciptea.Requerimento` | Relatório de Requerimento Ciptea | Espelho do formulário de requerimento com termo de consentimento LGPD |
| 9 | `Social.View.Relatorio.Ciptea.Sintetico` | Relatório Sintético de Requerimento de Ciptea | Indicadores gerenciais de emissão de carteirinhas de autismo |
| 10 | `Social.View.Relatorio.Paefi.FamiliasCadastradasIndividuos` | PAEFI - Relatório de Famílias por Indivíduos | Relatório de casos em acompanhamento pelo CREAS por tipo de violação |
| 11 | `Social.View.Relatorio.Paefi.Historico` | RelatorioPaefiHistorico | Histórico confidencial de intervenções e relatórios enviados ao Judiciário |
| 12 | `UPM050` | PM050 - Parecer Social | Editor do Parecer Técnico do Assistente Social com assinatura digital |
| 13 | `UPM051` | PM051 - Pesquisa de Parecer Social | Consulta e busca textual de pareceres sociais emitidos |
| 14 | `UPM069` | PM069 - Inclusão de Cotas/Valor do Projeto Social | Gestão orçamentária de projetos e programas socioassistenciais |
| 15 | `UPM197` | PM197 - Configuração das Abas da Assistência Social | Parametrização dinâmica das seções e abas do prontuário social |
| 16 | `UPM222` | PM222 - Agenda de Atendimentos da Assistência Social | Grade de agendamento de escutas e acolhidas técnicas no CRAS/CREAS |
| 17 | `UPM222R` | PM222R - Relatório Agenda de Atendimentos | Relatório diário de atendimentos agendados na assistência social |
| 18 | `UPM262` | PM262 - Log - Assistência Social | Trilha rigorosa de auditoria de acessos e visualizações do prontuário social |
| 19 | `UPM328` | PM328 - Tipos Encaminhamentos da Assistência Social | Tabela de encaminhamentos (Rede socioassistencial, Saúde, Educação, Tutela) |
| 20 | `UPM332` | PM332 - Cadastro de Grupos de Atendimentos - PAEFI | Categorias macro de atendimentos especializados do CREAS |
| 21 | `UPM332R` | PM332R - Relatório de Grupo de Atendimento PAEFI | Relatório descritivo de grupos do PAEFI |
| 22 | `UPM333` | PM333 - Cadastro de Subgrupos de Atendimentos - PAEFI | Subcategorias de classificação do agravo no CREAS |
| 23 | `UPM333R` | PM333R - Cadastro de Subgrupos de Atendimentos - PAEFI | Relatório impresso de subgrupos do PAEFI |
| 24 | `UPM334` | PM334 - Cadastro de Itens de Atendimentos - PAEFI | Itens detalhados de intervenção técnica socioassistencial |
| 25 | `UPM334R` | PM334R - Cadastro de Itens de Atendimentos - PAEFI | Relatório analítico de itens de atendimento do PAEFI |
| 26 | `UPM335` | PM335 - Inclusão de Indivíduos - PAEFI | Vinculação do membro violado ao processo do CREAS |
| 27 | `UPM336` | PM336 - PAEFI | Painel central de gestão do prontuário PAEFI no CREAS |
| 28 | `UPM336R` | PM336R - PAEFI | Relatório do Plano de Acompanhamento Familiar e Individual do CREAS |
| 29 | `UPM464` | PM464 - Cadastro de Usuários API Social | Gestão de credenciais de integração com sistemas do MDS/CadÚnico |
| 30 | `UPM508` | PM508 - Relação dos Projetos Sociais | Catálogo de projetos socioassistenciais mantidos pelo município |
| 31 | `UPM516` | PM516 - Inclusão de Rede Social do membro | Mapeamento de redes de apoio comunitário e vínculos familiares |
| 32 | `UPM716` | PM716 - Atendimentos Saúde e Social | Painel de intersetorialidade: cruzamento de dados Saúde (ESF) x SUAS (CRAS) |

---

## 2. Modelagem Relacional do Banco de Dados (PostgreSQL / Lucid ORM)

```sql
-- 1. Unidades Socioassistenciais (CRAS, CREAS, Centro POP, Acolhimento)
CREATE TABLE unidades_suas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150) NOT NULL,
    tipo VARCHAR(30) NOT NULL, -- 'CRAS', 'CREAS', 'CENTRO_POP', 'ABRIGO', 'SEDE_SECRETARIA'
    codigo_cadsus_ibge VARCHAR(10),
    endereco_completo VARCHAR(255) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    coordenador_nome VARCHAR(100),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Prontuário SUAS Familiar
CREATE TABLE familias_suas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_prontuario VARCHAR(20) UNIQUE NOT NULL, -- Identificador único do prontuário
    unidade_suas_id UUID NOT NULL REFERENCES unidades_suas(id),
    responsavel_familiar_id UUID NOT NULL REFERENCES cidadaos(id),
    codigo_familiar_cadunico VARCHAR(11),
    renda_total_familiar NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    renda_per_capita NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    faixa_renda VARCHAR(30) NOT NULL, -- 'EXTREMA_POBREZA', 'POBREZA', 'BAIXA_RENDA', 'ACIMA_MEIO_SM'
    situacao_moradia VARCHAR(30), -- 'PROPRIA', 'ALUGADA', 'CEDIDA', 'OCUPACAO', 'SITUACAO_RUA'
    vulnerabilidades JSONB, -- ['ISOLAMENTO', 'DESEMPREGO', 'ACESSO_PRECARIO_AGUA', 'ANALFABETISMO']
    status_acompanhamento VARCHAR(20) NOT NULL DEFAULT 'EM_OBSERVACAO', -- 'EM_OBSERVACAO', 'PAIF_ATIVO', 'PAEFI_ATIVO', 'DESLIGADO'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Membros da Família no SUAS
CREATE TABLE membros_familia_suas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    familia_suas_id UUID NOT NULL REFERENCES familias_suas(id) ON DELETE CASCADE,
    cidadao_id UUID NOT NULL REFERENCES cidadaos(id),
    parentesco VARCHAR(30) NOT NULL, -- 'RESPONSAVEL', 'CONJUGE', 'FILHO', 'ENTEADO', 'PAI_MAE', 'OUTRO'
    possui_deficiencia BOOLEAN NOT NULL DEFAULT FALSE,
    tipo_deficiencia VARCHAR(50),
    recebe_bpc BOOLEAN NOT NULL DEFAULT FALSE,
    frequenta_escola BOOLEAN NOT NULL DEFAULT TRUE,
    trabalho_infantil_identificado BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Atendimentos Técnicos e Escutas Qualificadas (CRAS / CREAS)
CREATE TABLE atendimentos_suas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    familia_suas_id UUID NOT NULL REFERENCES familias_suas(id),
    unidade_suas_id UUID NOT NULL REFERENCES unidades_suas(id),
    profissional_id UUID NOT NULL REFERENCES profissionais(id),
    cress_crp VARCHAR(20),
    data_atendimento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tipo_atendimento VARCHAR(30) NOT NULL, -- 'ACOLHIDA', 'ATENDIMENTO_INDIVIDUAL', 'VISITA_DOMICILIAR', 'REUNIAO_GRUPO'
    servico_origem VARCHAR(20) NOT NULL, -- 'PAIF', 'PAEFI', 'BENEFICIO_EVENTUAL'
    parecer_social TEXT NOT NULL,
    orientacoes_encaminhamentos TEXT,
    sigiloso BOOLEAN NOT NULL DEFAULT FALSE, -- Restringe a leitura somente aos profissionais envolvidos
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Concessão de Benefícios Eventuais (Cesta Básica, Funeral, Natalidade)
CREATE TABLE beneficios_eventuais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_processo VARCHAR(20) UNIQUE NOT NULL,
    familia_suas_id UUID NOT NULL REFERENCES familias_suas(id),
    cidadao_requerente_id UUID NOT NULL REFERENCES cidadaos(id),
    assistente_social_id UUID NOT NULL REFERENCES profissionais(id),
    tipo_beneficio VARCHAR(30) NOT NULL, -- 'CESTA_BASICA', 'AUXILIO_NATALIDADE', 'AUXILIO_FUNERAL', 'ALUGUEL_SOCIAL', 'DOCUMENTACAO'
    motivo_solicitacao TEXT NOT NULL,
    parecer_concessao TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SOLICITADO', -- 'SOLICITADO', 'EM_ANALISE', 'DEFERIDO', 'INDEFERIDO', 'ENTREGUE'
    valor_estimado NUMERIC(10, 2),
    data_deferimento DATE,
    data_entrega DATE,
    comprovante_entrega_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Carteiras CIPTEA (Lei Romeo Mion - Lei 13.977/2020)
CREATE TABLE carteiras_ciptea (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_carteira VARCHAR(20) UNIQUE NOT NULL, -- Ex: 'CIPTEA-2026-000123'
    cidadao_id UUID NOT NULL REFERENCES cidadaos(id),
    responsavel_legal_id UUID NOT NULL REFERENCES cidadaos(id),
    grau_autismo VARCHAR(20) NOT NULL, -- 'LEVE', 'MODERADO', 'SEVERO'
    tipo_sanguineo VARCHAR(5),
    contato_emergencia_nome VARCHAR(100) NOT NULL,
    contato_emergencia_telefone VARCHAR(20) NOT NULL,
    medico_laudador_nome VARCHAR(100) NOT NULL,
    medico_crm VARCHAR(20) NOT NULL,
    cid_diagnostico VARCHAR(6) NOT NULL, -- 'F84.0', 'F84.1', etc.
    laudo_anexo_url VARCHAR(255) NOT NULL,
    foto_3x4_url VARCHAR(255) NOT NULL,
    qr_code_token VARCHAR(64) UNIQUE NOT NULL, -- Token seguro para validação pública da carteira
    status VARCHAR(20) NOT NULL DEFAULT 'SOLICITADA', -- 'SOLICITADA', 'EM_ANALISE', 'EMITIDA', 'REJEITADA'
    motivo_rejeicao TEXT,
    data_emissao DATE,
    data_validade DATE, -- Validade de 5 anos segundo a legislação
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PAEFI - Gestão de Violação de Direitos (CREAS)
CREATE TABLE paefi_acompanhamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_caso VARCHAR(20) UNIQUE NOT NULL,
    familia_suas_id UUID NOT NULL REFERENCES familias_suas(id),
    membro_violado_id UUID NOT NULL REFERENCES cidadaos(id),
    tipo_violacao VARCHAR(40) NOT NULL, -- 'VIOLENCIA_FISICA', 'VIOLENCIA_PSICOLOGICA', 'ABUSO_SEXUAL', 'EXPLORACAO_TRABALHO', 'NEGLIGENCIA'
    orgao_demandante VARCHAR(50) NOT NULL, -- 'CONSELHO_TUTELAR', 'VARA_INFANCIA', 'MINISTERIO_PUBLICO', 'DISQUE_100', 'DEMANDA_ESPONTANEA'
    numero_oficio_origem VARCHAR(50),
    data_abertura_caso DATE NOT NULL,
    tecnico_referencia_id UUID NOT NULL REFERENCES profissionais(id),
    plano_individual_atendimento TEXT NOT NULL,
    status_caso VARCHAR(20) NOT NULL DEFAULT 'EM_ACOMPANHAMENTO', -- 'EM_ACOMPANHAMENTO', 'SUSPENSO', 'ENCERRADO_SUPERADO'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Segurança e Sigilo Ético (LGPD e Resoluções CFESS/CFP)

1. **Prontuário Social Sigiloso**: Registros marcados como `sigiloso = TRUE` ou casos do **PAEFI** só podem ser lidos por profissionais que possuam CBO compatível com Assistente Social (2516-05) ou Psicólogo (2515-10) devidamente lotados no respectivo CRAS ou CREAS.
2. **Trilha Imutável de Auditoria (UPM262)**: Qualquer visualização ou emissão de relatório contendo histórico de violações gera um log obrigatório com `usuario_id`, `ip_address`, `timestamp` e `justificativa_acesso`.
3. **Portal Público de Validação CIPTEA**: Rota pública `/validar-ciptea/:token` que lê o QR Code da carteirinha física e retorna somente o nome do portador, foto oficial, data de validade e confirmação de autenticidade da Prefeitura, sem expor dados médicos ou laudos clínicos.

---

## 4. Frontend em React 19 + Inertia.js v2 + Tailwind v4 + shadcn/ui

1. **`/social/familias` (`ProntuarioFamiliarView.tsx`)**:
   - Diagnóstico sociodemográfico da família, membros, benefícios federais e linha do tempo de atendimentos no CRAS/CREAS.
2. **`/social/beneficios-eventuais` (`BeneficiosEventuaisManager.tsx`)**:
   - Pipeline visual estilo Kanban com colunas (Solicitado, Em Análise pelo Assistente Social, Aprovado, Entregue) com controle de estoque de cestas e comprovante digital com assinatura.
3. **`/social/ciptea` (`GestaoCipteaView.tsx`)**:
   - Central de aprovação de requerimentos de carteiras de autismo com comparador lado a lado de laudo médico e dados, emissão gráfica em PDF no padrão cartão PVC/crachá frente e verso.
4. **`/social/paefi` (`CasosPaefiView.tsx`)**:
   - Módulo restrito e criptografado do CREAS para acompanhamento sigiloso de medidas socioeducativas, relatórios circunstanciados ao Ministério Público e plano individual de atendimento.

---

## 5. Critérios de Homologação da Etapa 08

1. **Conformidade com a Lei Romeo Mion (CIPTEA)**: A carteira física gerada deve conter obrigatoriamente nome, foto, CID, tipo sanguíneo, contatos de emergência e QR Code funcional de validação pública.
2. **Restrição Absoluta de Acesso ao Prontuário PAEFI**: Usuários comuns ou profissionais de outras secretarias recebem `403 Forbidden` ao tentar consultar atendimentos confidenciais do CREAS.
3. **Fluxo Completo de Benefício Eventual**: Todo benefício concedido deve possuir parecer social fundamentado por assistente social com CRESS ativo.
