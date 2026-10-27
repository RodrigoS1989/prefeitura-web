# Walkthrough: Etapa 8 (e-SUS Atenção Primária, Vigilância & Vacinas) e Barra de Menus Moderna

## 1. Visão Geral das Entregas

Em conformidade com a solicitação do usuário (**"POR HORA PULE A ETAPA 7, SIGA PARA A 8"** e **"na barra dos menus, coloque um scroll, caso tenha uma solução melhor, implemente"**), realizamos duas frentes essenciais:
1. **Modernização Completa da Barra de Menus**: Implementação de rolagem horizontal contínua com botões de chevron suaves, máscaras de gradiente para indicador de overflow, conversão de roda do mouse (`wheel`) em scroll horizontal, centralização automática no item ativo e menu dropdown estruturado por macrodomínios.
2. **Refatoração Integral da Etapa 8 (129 telas legadas)**: Transposição dos fluxos do e-SUS APS (FCD, FAV, FAI), Sala de Vacinas (SIPNI) com controle de lotes e temperatura da cadeia de frio, Carteira de Vacinação Digital do SUS e Notificações Compulsórias de Vigilância Epidemiológica (SINAN).

---

## 2. Modernização da Barra de Menus

Arquivo: [inertia/components/navigation_bar.tsx](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/inertia/components/navigation_bar.tsx) e [inertia/css/app.css](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/inertia/css/app.css)

### Recursos Implementados:
- **Rolagem Horizontal Fluida (`useRef` + `scrollTo({ behavior: 'smooth' })`)**: Permite navegar confortavelmente mesmo em telas compactas (notebooks ou resoluções padrão de postos de saúde).
- **Botões de Chevron com Desvanecimento Automático**: Botões de avanço e recuo surgem suavemente quando há transbordamento de itens à esquerda ou à direita.
- **Gradientes de Máscara (Overflow Fade Masks)**: Indicadores visuais elegantes nas pontas indicando conteúdo adjacente.
- **Scroll Inteligente com a Roda do Mouse (`onWheel`)**: Intercepta eventos de roda vertical e os converte em rolagem horizontal uniforme quando o cursor está sobre a barra.
- **Centralização Automática da Rota Ativa**: Ao carregar a página ou navegar, a barra executa `scrollIntoView({ behavior: 'smooth', inline: 'center' })` garantindo que o módulo em uso esteja sempre visível.
- **Menu Dropdown "Módulos"**: Acesso rápido categorizado por macrodomínio:
  - *Geral*: Início, Visão Geral, Cidadãos.
  - *Gestão & Território*: Território, Profissionais & UBS.
  - *Atenção à Saúde*: Recepção & PEP, e-SUS & Vacinas.
  - *Farmácia & Regulação*: Farmácia Municipal, Central de Regulação.

---

## 3. Arquitetura da Etapa 8: e-SUS, Vigilância & Vacinas

### A. Banco de Dados e Migrations
Migration executada: [1761885935175_create_esus_vacinas_tables.ts](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/database/migrations/1761885935175_create_esus_vacinas_tables.ts)
- `imunobiologicos`: Catálogo de 11 vacinas do PNI (código SIPNI, público-alvo, intervalo de doses, esquema básico).
- `lotes_imunobiologico`: Rastreabilidade de lotes com controle térmico da cadeia de frio (+2°C a +8°C), validade e saldo atômico.
- `vacinacoes_registro`: Histórico de doses aplicadas com aprazamento automático da próxima dose.
- `esus_cadastros_domiciliares`: Ficha de Cadastro Domiciliar e-SUS APS (tipo de moradia, abastecimento, saneamento, microárea).
- `esus_visitas_domiciliares`: Ficha de Visita Domiciliar do ACS (FAV e-SUS APS) com registro de desfecho e sinais vitais (PA e glicemia).
- `vigilancia_notificacoes`: Notificações compulsórias com protocolo SINAN (`SIN-AAAA-NNNNNN`), classificação e status de investigação.

### B. Modelos Lucid ORM
- [Imunobiologico](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/imunobiologico.ts)
- [LoteImunobiologico](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/lote_imunobiologico.ts)
- [VacinacaoRegistro](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/vacinacao_registro.ts)
- [EsusCadastroDomiciliar](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/esus_cadastro_domiciliar.ts)
- [EsusVisitaDomiciliar](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/esus_visita_domiciliar.ts)
- [VigilanciaNotificacao](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/vigilancia_notificacao.ts)

### C. Serviço Central de Negócios
- [EsusService](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/services/esus_service.ts):
  - `aplicarVacina`: Débito atômico de saldo, validação de validade do lote, aprazamento de próxima dose calculado com base no intervalo do imunobiológico.
  - `obterCarteiraVacinal`: Histórico completo de imunização do cidadão.
  - `registrarVisita`: Lançamento das atividades dos Agentes Comunitários de Saúde (ACS).
  - `notificarSinan`: Criação de ficha com protocolo único sequencial e cálculo de limite de investigação de 60 dias.

### D. Telas Web em React 19 + Inertia
1. [inertia/pages/esus/index.tsx](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/inertia/pages/esus/index.tsx):
   - Dashboard e-SUS APS com indicadores de imunização mensal, visitas ACS, notificações ativas e monitoramento da temperatura de câmaras frias.
2. [inertia/pages/esus/vacinas.tsx](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/inertia/pages/esus/vacinas.tsx):
   - Sala de Vacinação com visualização de estoque por lote, registro de aplicação em modal reativo com busca dinâmica de lotes ativos, e **Carteira de Vacinação Digital do SUS** com design oficial.
3. [inertia/pages/esus/visitas.tsx](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/inertia/pages/esus/visitas.tsx):
   - Gestão territorial dos ACS com filtros por motivo de visita, listagem de domicílios visitados e modal para registro de novas visitas com triagem de sinais vitais.
4. [inertia/pages/esus/notificacoes.tsx](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/inertia/pages/esus/notificacoes.tsx):
   - Centro de Vigilância Epidemiológica SINAN com alerta preventivo de arboviroses (Dengue, Chikungunya, Zika), status de investigação e modal de notificação compulsória.

---

## 4. Validação & Resultados dos Testes

### Verificação de Tipagem Estática:
```bash
npm run typecheck
> tsc --noEmit
# 0 erros encontrados em todos os arquivos AdonisJS e Inertia/React
```

### Testes de Integração de Endpoints:
```
GET /esus                  -> 200 OK (Dashboard e métricas)
GET /esus/vacinas          -> 200 OK (Sala de vacinas e lotes)
GET /esus/visitas          -> 200 OK (Gestão de visitas ACS)
GET /esus/notificacoes     -> 200 OK (Painel SINAN)
GET /api/esus/carteira/1   -> 200 OK (Carteira digital do cidadão)
GET /api/esus/lotes/3      -> 200 OK (Lotes com saldo disponível)
POST /esus/vacinas/aplicar -> 201 Created (Saldo debitado de 195 para 194)
POST /esus/visitas         -> 201 Created (Visita com PA e glicemia)
POST /esus/notificacoes    -> 201 Created (Protocolo SIN-2026-000002)
```
