# Plano Detalhado de Execução: Etapa 11 - Cadastros de Apoio, Segurança, Configurações Gerais e Central de Relatórios

> **Status**: Pronto para Execução  
> **Documento Vinculado**: [DOCUMENTO_MESTRE_REFATORACAO.md](file:///d:/Projetos/Delphi/refatoracao/documentacao/DOCUMENTO_MESTRE_REFATORACAO.md)  
> **Dependências**: [Etapas 00 a 10 (Todas as Etapas Anteriores)](file:///d:/Projetos/Delphi/refatoracao/documentacao/DOCUMENTO_MESTRE_REFATORACAO.md)  
> **Stack Oficial**: AdonisJS v6, Lucid ORM, Inertia.js v2, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Redis 7, Puppeteer / Chromium Headless (PDF Generator), ExcelJS

---

## 1. Visão Geral e Alinhamento com o Projeto Original

A **Etapa 11** conclui formalmente a modernização integral do sistema legado Delphi `Prefeitura.exe`. Esta etapa absorve o maior volume cumulativo de formulários do acervo legado:
- **606 Telas** catalogadas em [`11_Apoio_Seguranca_Configuracoes.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/11_Apoio_Seguranca_Configuracoes.md) (Tabelas de apoio, parametrizações gerais, parâmetros por unidade, configurações de integração e mensageria interna).
- **360 Telas e Relatórios de Impressão** catalogados em [`12_Relatorios_e_Estatisticas.md`](file:///d:/Projetos/Delphi/refatoracao/documentacao/catalogo_telas/12_Relatorios_e_Estatisticas.md) (Formulários QuickReport, FortesReport e relatórios estatísticos consolidados de Saúde, Educação, Social e Finanças).

Para garantir uma arquitetura sustentável e evitar a duplicação mecânica de centenas de controladores CRUD idênticos, a Etapa 11 introduz duas inovações arquiteturais de alto padrão na stack moderna:
1. **Engine Orientado a Metadados para Tabelas de Apoio (Dynamic Lookup Table Engine)**:
   - Um serviço central (`DynamicLookupService.ts`) que consome definições de schema (colunas, tipos, regras de validação e foreign keys) e provê endpoints REST padronizados e uma interface genérica de alta performance em React 19 para todos os cadastros auxiliares municipais (CIDs, CIAP-2, Escolaridades, Parentescos, Tipos de Logradouro, Nacionalidades, Feriados, Convênios, etc.).
2. **Central Unificada de Relatórios e Motor de Impressão Headless (Reporting Hub)**:
   - Substituição completa dos componentes desktop QuickReport (`TQRBand`, `TQRLabel`) e FortesReport (`TRLBand`) por um motor moderno de renderização baseado em templates HTML5/Tailwind v4 gerados via **Chromium Headless (Puppeteer)** para PDFs perfeitos e **ExcelJS** para planilhas analíticas, com suporte a filtros dinâmicos, quebras de página, cabeçalhos municipais oficiais com brasão e assinatura digital.
3. **Módulo de Mensageria e Correio Interno Municipal (UCO001 a UCO010)**:
   - Modernização do sistema de mensagens internas da Prefeitura com envio de notificações instantâneas via WebSockets, alertas de circulares e confirmação de leitura para comunicados da gestão.
4. **Trilha Unificada de Auditoria e Governança LGPD (Audit Trail)**:
   - Registro imutável de todas as ações de leitura de dados sensíveis e modificações no banco de dados com gravação de diff (JSONB antes/depois), IP, navegador e ID do operador.

---

### 1.1. Mapeamento das Telas e Módulos Consolidados

| Categoria Legada | Telas Delphi Catalogadas | Estratégia de Migração para a Stack Web Moderna |
| :--- | :--- | :--- |
| **Tabelas de Apoio Gerais** | Centenas de formulários (ex: `UPM001` a `UPM100`, CIDs, CIAPs, Feriados, Bairros, Profissões) | **Engine de Metadados (`/configuracoes/tabelas-apoio/:tabela`)**: Interface única e dinâmica com busca rápida, exportação e validação de duplicidade. |
| **Parâmetros e Configurações** | `Prefeitura.View.Form.Rnds`, `EsusConfig`, `UPM197`, `UParametro` | **Painel Central de Configurações (`/configuracoes/sistema`)**: Gestão de variáveis globais, certificados digitais A1 e chaves de API. |
| **Correio Interno da Prefeitura** | `UCO001`, `UCO002`, `UCO003`, `UCO005`, `UCO007`, `UCO010` | **Central de Mensagens e Circulares (`/mensageria`)**: Chat assíncrono interno entre setores com avisos em tempo real via WebSockets. |
| **Relatórios da Saúde e Farmácia** | `Prefeitura.View.Relatorio.Bnafar.*`, `Redfm.*`, `Comorbidade`, `Ivcf`, `Defasagem.*`, `Vacinas.*` | **Hub de Relatórios da Saúde (`/relatorios/saude`)**: Emissão em PDF/Excel com pré-visualização em tela. |
| **Relatórios de Educação e Boletins** | `Educacao.View.Relatorio.Boletim`, `Consolidado.Critica`, `Fiap.ModeloA`, `Fiap.ModeloB` | **Módulo de Documentos Escolares (`/relatorios/educacao`)**: Emissão de boletins e fichas de rendimento escolar. |
| **Relatórios de Estatísticas e Gestão** | 360 relatórios listados em `12_Relatorios_e_Estatisticas.md` | **Central Unificada de Relatórios (`/relatorios/central`)**: Motor de relatórios sob demanda com agendamento de envio por e-mail no BullMQ. |

---

## 2. Modelagem Relacional do Banco de Dados (PostgreSQL / Lucid ORM)

```sql
-- 1. Definições de Metadados para Tabelas de Apoio Dinâmicas
CREATE TABLE sistema_tabelas_apoio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identificador VARCHAR(50) UNIQUE NOT NULL, -- Ex: 'tipos_logradouro', 'nacionalidades', 'escolaridades'
    nome_exibicao VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL, -- 'SAUDE', 'EDUCACAO', 'SOCIAL', 'GERAL'
    tabela_banco VARCHAR(50) NOT NULL,
    permite_insercao BOOLEAN NOT NULL DEFAULT TRUE,
    permite_edicao BOOLEAN NOT NULL DEFAULT TRUE,
    permite_exclusao BOOLEAN NOT NULL DEFAULT FALSE,
    schema_campos JSONB NOT NULL, -- Metadados dos campos: labels, tipos, obrigatoriedade
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Mensageria e Circulares Internas da Prefeitura (UCO001 a UCO010)
CREATE TABLE mensagens_internas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remetente_id UUID NOT NULL REFERENCES usuarios(id),
    assunto VARCHAR(150) NOT NULL,
    conteudo TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'INDIVIDUAL', -- 'INDIVIDUAL', 'SETORIAL', 'CIRCULAR_GERAL'
    prioridade VARCHAR(10) NOT NULL DEFAULT 'NORMAL', -- 'NORMAL', 'URGENTE', 'ALERTA'
    anexo_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE mensagens_destinatarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mensagem_id UUID NOT NULL REFERENCES mensagens_internas(id) ON DELETE CASCADE,
    destinatario_usuario_id UUID REFERENCES usuarios(id),
    destinatario_secretaria_id UUID REFERENCES secretarias(id),
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    data_leitura TIMESTAMPTZ,
    arquivada BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Catálogo e Agendamento de Relatórios da Central
CREATE TABLE relatorios_catalogo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(30) UNIQUE NOT NULL, -- Ex: 'REL_SAUDE_ABSENTEISMO', 'REL_FARM_FEFO', 'REL_VAC_COBERTURA'
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    modulo VARCHAR(30) NOT NULL, -- 'SAUDE', 'FARMACIA', 'REGULACAO', 'SOCIAL', 'FROTA', 'FATURAMENTO'
    parametros_disponiveis JSONB NOT NULL, -- Filtros suportados: período, unidade, profissional, bairro
    formatos_permitidos VARCHAR(20)[] NOT NULL DEFAULT ARRAY['PDF', 'XLSX', 'CSV'],
    perfil_minimo_acesso VARCHAR(30) NOT NULL DEFAULT 'OPERADOR',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE relatorios_execucoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relatorio_codigo VARCHAR(30) NOT NULL,
    usuario_solicitante_id UUID NOT NULL REFERENCES usuarios(id),
    parametros_utilizados JSONB NOT NULL,
    formato VARCHAR(10) NOT NULL, -- 'PDF', 'XLSX', 'CSV'
    status VARCHAR(20) NOT NULL DEFAULT 'PROCESSANDO', -- 'PROCESSANDO', 'CONCLUIDO', 'FALHA'
    arquivo_url VARCHAR(255),
    tamanho_bytes INTEGER,
    tempo_execucao_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Trilha Unificada de Auditoria Global (LGPD / Segurança)
CREATE TABLE auditoria_geral (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id),
    usuario_nome VARCHAR(100),
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    modulo VARCHAR(50) NOT NULL,
    acao VARCHAR(30) NOT NULL, -- 'CONSULTA_DADO_SENSIVEL', 'INSERCAO', 'ALTERACAO', 'EXCLUSAO', 'EXPORTACAO'
    recurso_tabela VARCHAR(50) NOT NULL,
    registro_id VARCHAR(50),
    dados_anteriores JSONB,
    dados_novos JSONB,
    justificativa TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_auditoria_usuario ON auditoria_geral(usuario_id);
CREATE INDEX idx_auditoria_recurso ON auditoria_geral(recurso_tabela, registro_id);
CREATE INDEX idx_auditoria_data ON auditoria_geral(created_at);
```

---

## 3. Arquitetura de Relatórios Headless e Metadados

### 3.1. `PdfReportService.ts` (Headless Chromium)
Gera relatórios institucionais com perfeição milimétrica:
1. Renderiza componentes React/HTML com **Tailwind CSS v4** em modo impressão (`@media print`).
2. Adiciona automaticamente cabeçalho institucional com brasão municipal, CNPJ da Prefeitura e dados da secretaria competente.
3. Insere numeração de páginas automática ("Página X de Y"), carimbo de data/hora oficial e hash SHA-256 para verificação de autenticidade do documento.

### 3.2. `ExcelReportService.ts` (ExcelJS)
Gera planilhas ricas em formatação:
1. Cabeçalhos fixos com estilos institucionais, colunas auto-dimensionadas e tipagem adequada de dados (moeda, data, inteiros).
2. Fórmulas automáticas de soma e média nas linhas de totalizador.

---

## 4. Frontend em React 19 + Inertia.js v2 + Tailwind v4 + shadcn/ui

1. **`/configuracoes/tabelas-apoio` (`GerenciadorTabelasApoio.tsx`)**:
   - Interface universal onde o administrador seleciona a tabela de apoio desejada em um menu lateral categorizado e gerencia registros com edição em linha (inline editing) e validação em tempo real.
2. **`/relatorios/central` (`CentralRelatoriosView.tsx`)**:
   - Hub visual estilo catálogo com busca rápida por palavra-chave ou categoria, drawer lateral para seleção de filtros e geração imediata com pré-visualizador de PDF embutido ou download de planilha Excel.
3. **`/mensageria` (`MensageriaInternaApp.tsx`)**:
   - Caixa de entrada municipal moderna com separadores (Entrada, Enviadas, Circulares, Avisos Importantes) e editor de texto com suporte a anexos de memorandos e ofícios.
4. **`/auditoria/painel-lgpd` (`PainelAuditoriaLgpd.tsx`)**:
   - Painel de controle do Encarregado de Proteção de Dados (DPO) com linha do tempo de acessos a dados sensíveis de pacientes e cidadãos.

---

## 5. Critérios de Homologação da Etapa 11

1. **Paridade de Dados dos Relatórios**: 100% dos dados apurados nos relatórios legados QuickReport/FortesReport devem ser emitidos com exatidão na nova central web.
2. **Desempenho na Geração de Documentos**: Relatórios de grande volume (ex: relação municipal de famílias ou histórico de dispensação) processam de forma assíncrona com notificação via WebSocket para não travar a navegação do usuário.
3. **Auditoria Inviolável**: Toda e qualquer alteração de cadastro ou visualização de prontuário clínico/social gera registro persistido na tabela `auditoria_geral`.
