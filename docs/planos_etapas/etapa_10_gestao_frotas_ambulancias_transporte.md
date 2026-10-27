# Plano Detalhado de Execução: Etapa 10 - Gestão de Frotas, Ambulâncias, Viagens e Abastecimento

> **Status**: Pronto para Execução  
> **Documento Vinculado**: [DOCUMENTO_MESTRE_REFATORACAO.md](file:///d:/Projetos/Delphi/refatoracao/documentacao/DOCUMENTO_MESTRE_REFATORACAO.md)  
> **Dependências**: [Etapa 00 (Infraestrutura e RBAC)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_00_infraestrutura_layout_rbac.md) | [Etapa 01 (Cidadãos e Servidores)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_01_cidadaos_pessoas_cadunico.md) | [Etapa 02 (Território)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_02_territorio_parametros.md) | [Etapa 03 (Unidades e Secretarias)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_03_unidades_profissionais_lotacoes.md) | [Etapa 06 (TFD e Transporte de Pacientes)](file:///d:/Projetos/Delphi/refatoracao/documentacao/planos_etapas/etapa_06_agendamento_regulacao_tfd.md)  
> **Stack Oficial**: AdonisJS v6, Lucid ORM, Inertia.js v2, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Redis 7

---

## 1. Visão Geral e Alinhamento com o Projeto Original

A **Etapa 10** tem por missão unificar e modernizar toda a gestão logística, veicular e operacional do patrimônio móvel da Prefeitura Municipal. No acervo Delphi legado, além das telas catalogadas no módulo `07_Frota_e_Transporte.md`, essa área constituía um sistema desktop completo e autônomo denominado **`Frota.dpr`** (com mais de **356 arquivos de código-fonte** em `d:/Projetos/Delphi/refatoracao/Frota`).

O objetivo é substituir o executável legado por um módulo web moderno integrado ao ERP municipal, com controle rigoroso de custos públicos, rastreabilidade e segurança veicular:
1. **Cadastro Central de Veículos e Máquinas Pesadas**:
   - Ambulâncias (UTI Móvel e Suporte Básico do SAMU/Pronto Atendimento), vans de TFD, veículos leves da Saúde/Assistência Social, ônibus escolares, caminhões coletores, caçambas e maquinários de obras (retroescavadeiras, tratores e motoniveladoras).
   - Documentação de trânsito (CRLV, RENAVAM, Chassi, IPVA, Licenciamento, Seguro Obrigatório e Apólices de Sinistro).
2. **Controle de Condutores e Motoristas**:
   - Gestão de CNH (categoria, pontuação, data de renovação e bloqueio automático de motoristas com CNH vencida).
   - Certificados obrigatórios (Curso de Condução de Veículos de Emergência - CONTRAN, Transporte Coletivo de Passageiros e Transporte Escolar).
   - Apuração de infrações e multas de trânsito com identificação do condutor responsável.
3. **Diário de Bordo Eletrônico e Roteiros**:
   - Solicitação de veículos pelas secretarias com autorização do setor de transportes.
   - Registro de saída e retorno com leitura do odômetro/horímetro, destino, passageiros e motivo oficial da viagem.
4. **Gestão de Abastecimento e Consumo (km/l)**:
   - Abastecimento em tanques próprios do município ou em postos credenciados através de cartões de combustível (Ticket Log, Prime, Good Card).
   - Algoritmo de consistência de média de consumo (km/litro ou litros/hora) com detecção e alerta instantâneo de fraudes ou desvios de combustível.
5. **Manutenção Preventiva e Corretiva (Ordens de Serviço)**:
   - Plano de manutenção programada por odômetro/tempo (troca de óleo, filtros, correias dentadas, pastilhas de freio e pneus).
   - Ordens de Serviço (OS) com controle de peças do almoxarifado, serviços de oficinas terceirizadas e custos acumulados por centro de custo.
6. **Tacógrafo, Caçambas e Segurança**:
   - Controle de substituição e arquivo dos discos/fitas de tacógrafo, laudo de aferição do cronotacógrafo pelo INMETRO e validade de extintores.

---

### 1.1. Mapeamento das Telas e Módulos do Subsistema Delphi Frota

| Formulário / Unit Delphi Original | Função no Sistema Legado | Papel Arquitetural na Stack Web Moderna |
| :--- | :--- | :--- |
| `UVeiculo` / `UrelVeiculo` / `UrelFichaVeiculo` | Cadastro Geral de Veículos e Ficha do Veículo | Painel de Ativos da Frota com dados técnicos, fotos e status operacional |
| `UMaquina` / `UrelMaquina` / `UAbastecimentoMaquina` | Cadastro e Controle de Máquinas Pesadas | Gestão de Maquinário com controle por horímetro e centro de custos |
| `UCadastroMotorista` / `UMotorista` / `UBuscaMultaMotorista` | Cadastro de Condutores, CNH e Multas | Gestão de Motoristas com alertas de validade de CNH e histórico de multas |
| `USolicitacaoVeiculo` / `URelconSolicitacaoVeiculo` | Solicitação de Veículos pelas Secretarias | Workflow de requisição, autorização e despacho de veículos |
| `URoteiro` / `URoteiroControle` / `UPessoasRoteiro` | Diário de Bordo e Roteiro de Viagens | Diário de bordo eletrônico com registro de saída/chegada e passageiros |
| `UAbastecimento` / `UPrecoCombustivel` / `UrelAbastecimento` | Lançamento de Abastecimentos e Preços | Lançamento de abastecimento com cálculo de média e trava de odômetro |
| `UTanque` / `UrelMovimentoTanque` | Controle de Tanques e Bombas Próprias | Estoque de combustível nos tanques da garagem municipal |
| `UOrdemServico` / `UrelOrdemServico` / `UrelRevisaoVeiculo` | Manutenção, Revisão e Ordens de Serviço | Módulo de Manutenção Veicular com cronograma preventivo por km |
| `UControleTacografo` / `UTipoCertificadoTacografo` | Controle de Laudos de Tacógrafo INMETRO | Alertas de aferição de tacógrafo e conformidade com o CONTRAN |
| `UCacamba` / `UMovimentoCacamba` / `UItensMovimentoCacamba` | Locação e Movimentação de Caçambas | Gestão de caçambas de entulho e limpeza pública com mapa de localização |
| `UPrimeImportacao` | Importação de Faturas de Cartão Combustível | Parser e importador de extratos de abastecimento (cartão frota) |
| `UPM348` / `UPM546` / `UPM673` / `UPM962` | Telas Integradas no Executável Prefeitura | Integração nativa com o módulo de regulação e TFD |

---

## 2. Modelagem Relacional do Banco de Dados (PostgreSQL / Lucid ORM)

```sql
-- 1. Veículos e Máquinas da Frota Municipal
CREATE TABLE frotas_veiculos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_patrimonio VARCHAR(20) UNIQUE NOT NULL,
    tipo VARCHAR(30) NOT NULL, -- 'AMBULANCIA_UTI', 'AMBULANCIA_BASICA', 'VAN_TFD', 'ONIBUS_ESCOLAR', 'VEICULO_LEVE', 'CAMINHAO', 'MAQUINA_PESADA'
    placa VARCHAR(8) UNIQUE, -- Formato Mercosul (ABC1D23)
    renavam VARCHAR(15) UNIQUE,
    chassi VARCHAR(25) UNIQUE,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    ano_fabricacao INTEGER NOT NULL,
    ano_modelo INTEGER NOT NULL,
    cor VARCHAR(30) NOT NULL,
    tipo_combustivel VARCHAR(20) NOT NULL, -- 'FLEX', 'GASOLINA', 'DIESEL_S10', 'DIESEL_S500', 'ETANOL', 'ELETRICO'
    secretaria_proprietaria_id UUID NOT NULL REFERENCES secretarias(id),
    unidade_vinculada_id UUID REFERENCES unidades_saude(id),
    capacidade_passageiros INTEGER NOT NULL DEFAULT 5,
    odometro_atual INTEGER NOT NULL DEFAULT 0,
    horimetro_atual NUMERIC(10, 1) DEFAULT 0.0,
    situacao_operacional VARCHAR(20) NOT NULL DEFAULT 'DISPONIVEL', -- 'DISPONIVEL', 'EM_VIAGEM', 'MANUTENCAO', 'SINISTRADO', 'DESATIVADO'
    apolice_seguro_numero VARCHAR(50),
    seguradora_nome VARCHAR(100),
    seguro_validade DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Motoristas e Condutores Oficiais
CREATE TABLE frotas_motoristas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    servidor_id UUID NOT NULL REFERENCES servidores(id),
    cnh_numero VARCHAR(15) UNIQUE NOT NULL,
    cnh_categoria VARCHAR(5) NOT NULL, -- 'B', 'C', 'D', 'E', 'AB', 'AD', 'AE'
    cnh_validade DATE NOT NULL,
    cnh_primeira_habilitacao DATE,
    possui_curso_emergencia BOOLEAN NOT NULL DEFAULT FALSE, -- Habilitação para ambulâncias
    possui_curso_transporte_coletivo BOOLEAN NOT NULL DEFAULT FALSE,
    possui_curso_transporte_escolar BOOLEAN NOT NULL DEFAULT FALSE,
    pontos_cnh INTEGER NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    bloqueado_operacao BOOLEAN NOT NULL DEFAULT FALSE,
    motivo_bloqueio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Diário de Bordo, Roteiros e Viagens
CREATE TABLE frotas_viagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_viagem VARCHAR(20) UNIQUE NOT NULL,
    veiculo_id UUID NOT NULL REFERENCES frotas_veiculos(id),
    motorista_id UUID NOT NULL REFERENCES frotas_motoristas(id),
    secretaria_solicitante_id UUID NOT NULL REFERENCES secretarias(id),
    finalidade_viagem TEXT NOT NULL,
    destino_cidade VARCHAR(100) NOT NULL,
    destino_uf CHAR(2) NOT NULL,
    data_hora_saida TIMESTAMPTZ NOT NULL,
    odometro_saida INTEGER NOT NULL,
    data_hora_retorno TIMESTAMPTZ,
    odometro_retorno INTEGER,
    km_percorrido INTEGER GENERATED ALWAYS AS (odometro_retorno - odometro_saida) STORED,
    status VARCHAR(20) NOT NULL DEFAULT 'EM_ANDAMENTO', -- 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'
    observacoes_ocorrencias TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Abastecimento e Consumo de Combustível
CREATE TABLE frotas_abastecimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    veiculo_id UUID NOT NULL REFERENCES frotas_veiculos(id),
    motorista_id UUID NOT NULL REFERENCES frotas_motoristas(id),
    viagem_id UUID REFERENCES frotas_viagens(id),
    tipo_origem VARCHAR(20) NOT NULL, -- 'TANQUE_PROPRIO', 'POSTO_CREDENCIADO_CARTAO'
    posto_fornecedor_nome VARCHAR(100) NOT NULL,
    tipo_combustivel VARCHAR(20) NOT NULL,
    data_hora_abastecimento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    odometro_momento INTEGER NOT NULL,
    quantidade_litros NUMERIC(8, 2) NOT NULL,
    valor_litro NUMERIC(6, 3) NOT NULL,
    valor_total NUMERIC(10, 2) NOT NULL,
    numero_cupom_fiscal VARCHAR(50),
    km_rodados_desde_ultimo_abastecimento INTEGER,
    consumo_medio_kml NUMERIC(6, 2), -- Litros / km
    alerta_anomalia_consumo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Ordens de Serviço e Manutenções Veiculares
CREATE TABLE frotas_manutencoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_os VARCHAR(20) UNIQUE NOT NULL,
    veiculo_id UUID NOT NULL REFERENCES frotas_veiculos(id),
    tipo_manutencao VARCHAR(20) NOT NULL, -- 'PREVENTIVA', 'CORRETIVA', 'EMERGENCIAL'
    oficina_prestadora VARCHAR(150) NOT NULL,
    data_abertura DATE NOT NULL,
    data_conclusao DATE,
    odometro_manutencao INTEGER NOT NULL,
    descricao_problema TEXT NOT NULL,
    descricao_servico_executado TEXT,
    custo_pecas NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    custo_mao_obra NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    custo_total NUMERIC(12, 2) GENERATED ALWAYS AS (custo_pecas + custo_mao_obra) STORED,
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTA', -- 'ABERTA', 'EM_EXECUCAO', 'CONCLUIDA', 'CANCELADA'
    proxima_revisao_odometro INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Algoritmos de Consistência e Regras de Negócio

1. **Trava Automática de CNH Vencida**:
   - O sistema bloqueia a abertura de diário de bordo caso a CNH do condutor esteja com validade expirada ou com mais de 20 pontos de infrações ativas.
2. **Consistência de Odômetro Contínuo**:
   - O odômetro informado na saída de uma viagem ou no abastecimento não pode ser menor que o último odômetro registrado na base de dados para aquele veículo.
3. **Detecção Inteligente de Anomalias de Abastecimento**:
   - Cada modelo de veículo possui uma faixa de consumo esperado (ex: Van Diesel: 9 a 13 km/l). Caso o cálculo da média do abastecimento atual divirja mais de 25% do histórico médio do veículo, o sistema grava `alerta_anomalia_consumo = TRUE` e notifica o gestor de frotas para auditoria.

---

## 4. Frontend em React 19 + Inertia.js v2 + Tailwind v4 + shadcn/ui

1. **`/frota/painel-ativos` (`PainelVeiculosFrota.tsx`)**:
   - Painel com cards interativos de todos os veículos e ambulâncias com badges de status (Disponível, Em Viagem, Em Oficina), nível de combustível e odômetro atual.
2. **`/frota/diario-bordo` (`DiarioBordoManager.tsx`)**:
   - Interface rápida para portaria/garagem registrar saída e retorno de veículos com leitor de código de barras do crachá do motorista.
3. **`/frota/abastecimento` (`AbastecimentoView.tsx`)**:
   - Lançamento ágil de abastecimentos e importador de faturas de cartões de combustível (Prime/Ticket Log).
4. **`/frota/manutencoes-os` (`OrdensServicoView.tsx`)**:
   - Cronograma visual de revisões por quilometragem e controle de OS abertas em oficinas credenciadas.

---

## 5. Critérios de Homologação da Etapa 10

1. **Rastreabilidade de Despesas**: 100% dos custos de combustível e manutenção vinculados obrigatoriamente a um veículo e centro de custos.
2. **Bloqueio de Condutores Irregulares**: O sistema impede a emissão de ordem de tráfego para motoristas sem CNH válida ou sem curso específico de transporte de emergência para ambulâncias.
3. **Auditoria de Hodômetro**: Impossibilidade de lançar quilometragem regressiva ou inconsistente sem autorização do administrador da frota.
