# Plano de Execução — Etapa 8: Domínio e-SUS Atenção Primária, Vigilância & Vacinas

> **Status**: 🚀 **Em Execução**  
> **Escopo Delphi Legado**: 129 telas mapeadas (`UPM289_30.pas`, `UPM522.pas`, `UPM199.pas`, `UPM132_21.pas`, `UPM079_21.pas`, `UPM123.pas`, `UPM081_21.pas`, `UPM134.pas`, etc.)  
> **Tabelas Canônicas no `social_SMA`**: `tb_EsusVacina`, `tb_Sipni_Lote`, `tb_EsusFichaVacinacao`, `tb_EsusFichaVacPacienteVacina`, `tb_EsusCadDom`, `tb_EsusCadInd`, `tb_EsusFAI`, `tb_EsusFAV`, `tb_EsusMotivoVisita`, `tb_EsusInconsistencia`.

---

## 1. Arquitetura da Solução & Modelagem de Dados

### 1.1 Tabelas Relacionais a Criar (`database/migrations/1761885935175_create_esus_vacinas_tables.ts`):
1. **`imunobiologicos`** (Catálogo oficial SIPNI/PNI):
   - `id`: PK auto-incremento.
   - `codigo_sipni`: Código oficial do imunobiológico (ex: 22, 23, 42, 85).
   - `nome`: Nome da vacina (ex: "Poliomielite VIP", "Pentavalente", "Tríplice Viral", "Febre Amarela", "COVID-19").
   - `sigla`: Sigla (ex: "VIP", "Penta", "SCR", "FA", "COVID").
   - `publico_alvo`: Descrição do público-alvo (Criança, Adolescente, Adulto, Idoso, Gestante).
   - `esquema_basico`: Resumo do esquema (ex: "3 doses + 2 reforços").
   - `ativo`: Booleano indicando vacina ativa no calendário municipal.

2. **`lotes_imunobiologico`** (Controle de lotes e validade na sala de vacina):
   - `id`: PK auto-incremento.
   - `imunobiologico_id`: FK para `imunobiologicos`.
   - `unidade_id`: FK para `unidades_saude`.
   - `numero_lote`: String identificadora do lote.
   - `fabricante`: Laboratório fabricante (ex: "Bio-Manguinhos / Fiocruz", "Instituto Butantan", "Pfizer", "Sanofi").
   - `data_validade`: Data de expiração do lote.
   - `quantidade_recebida`: Total de doses recebidas.
   - `quantidade_saldo`: Saldo atual disponível para aplicação.
   - `status`: Enum `'disponivel' | 'esgotado' | 'vencido' | 'quarentena'`.

3. **`vacinacoes_registro`** (Registro Nominal de Aplicação e-SUS/SIPNI):
   - `id`: PK auto-incremento.
   - `cidadao_id`: FK para `cidadaos`.
   - `imunobiologico_id`: FK para `imunobiologicos`.
   - `lote_id`: FK para `lotes_imunobiologico`.
   - `unidade_id`: FK para `unidades_saude`.
   - `profissional_id`: FK para `profissionais` (vacinador/enfermeiro).
   - `data_aplicacao`: Data e hora da administração da dose.
   - `dose`: Enum `'D1' | 'D2' | 'D3' | 'Reforco' | 'Reforco_2' | 'Dose_Unica' | 'Anual'`.
   - `estrategia`: Enum `'rotina' | 'campanha' | 'bloqueio' | 'especial'`.
   - `via_administracao`: Enum `'intramuscular' | 'subcutanea' | 'oral' | 'intradermica'`.
   - `local_aplicacao`: Enum `'deltoide_direito' | 'deltoide_esquerdo' | 'vasto_lateral_direito' | 'vasto_lateral_esquerdo' | 'oral' | 'outro'`.
   - `proxima_dose_aprazamento`: Data prevista para o próximo reforço/dose.
   - `observacoes`: Anotações clínicas sobre reações adversas ou lote.

4. **`esus_cadastros_domiciliares`** (Ficha de Cadastro Domiciliar e Territorial - FCD):
   - `id`: PK auto-incremento.
   - `bairro_id`: FK para `bairros`.
   - `logradouro_id`: FK para `logradouros`.
   - `numero`: String do número do imóvel.
   - `complemento`: String opcional.
   - `unidade_id`: FK para `unidades_saude`.
   - `microarea`: Código da microárea de atuação do ACS (ex: "01", "02").
   - `tipo_imovel`: Enum `'domicilio' | 'comercio' | 'terreno_baldio' | 'ponto_estrategico' | 'escola' | 'outro'`.
   - `tipo_domicilio`: Enum `'casa' | 'apartamento' | 'comodo' | 'outro'`.
   - `situacao_moradia`: Enum `'proprio' | 'financiado' | 'alugado' | 'cedido' | 'ocupacao' | 'situacao_rua'`.
   - `abastecimento_agua`: Enum `'rede_encanada' | 'poco' | 'cisterna' | 'carro_pipa' | 'outro'`.
   - `destino_lixo`: Enum `'coletado' | 'queimado' | 'enterrado' | 'ceu_aberto'`.
   - `animais_domicilio`: Booleano indicando presença de animais.
   - `quantidade_animais`: Quantidade declarada de animais (gato, cão, pássaro).

5. **`esus_visitas_domiciliares`** (Ficha de Visita Domiciliar e Territorial - FAV do ACS):
   - `id`: PK auto-incremento.
   - `cidadao_id`: FK para `cidadaos` (opcional caso seja visita geral ao imóvel).
   - `cadastro_domiciliar_id`: FK para `esus_cadastros_domiciliares`.
   - `profissional_id`: FK para `profissionais` (Agente Comunitário de Saúde).
   - `unidade_id`: FK para `unidades_saude`.
   - `data_visita`: Data e hora da visita.
   - `desfecho`: Enum `'realizada' | 'recusada' | 'ausente'`.
   - `motivo_visita`: Enum `'cadastramento' | 'gestante' | 'puerpera' | 'recem_nascido' | 'crianca' | 'hipertenso' | 'diabetico' | 'saude_mental' | 'busca_ativa_vacina' | 'controle_vetorial' | 'outro'`.
   - `peso_aferido`: Decimal para vigilância antropométrica.
   - `pressao_arterial`: String com PA aferida.
   - `glicemia_capilar`: Inteiro com glicemia capilar se coletada.
   - `observacoes`: Relato sucinto do ACS.

6. **`vigilancia_notificacoes`** (Notificações Compulsórias de Agravos e Doenças - SINAN):
   - `id`: PK auto-incremento.
   - `protocolo_sinan`: Protocolo de notificação (`SIN-AAAA-NNNNNN`).
   - `cidadao_id`: FK para `cidadaos`.
   - `unidade_notificadora_id`: FK para `unidades_saude`.
   - `profissional_notificador_id`: FK para `profissionais`.
   - `agravo_doenca`: Enum `'dengue' | 'chikungunya' | 'zika' | 'covid_sindrome_gripal' | 'tuberculose' | 'hanseniase' | 'violencia' | 'intoxicacao_exogena' | 'outro'`.
   - `data_notificacao`: Data do preenchimento da ficha.
   - `data_primeiros_sintomas`: Data de início do quadro clínico.
   - `status_investigacao`: Enum `'em_investigacao' | 'confirmado_laboratorial' | 'confirmado_clinico_epidemiologico' | 'descartado' | 'concluido'`.
   - `observacoes`: Resumo clínico epidemiológico.

---

## 2. Modelos Lucid ORM
- `app/models/imunobiologico.ts`
- `app/models/lote_imunobiologico.ts`
- `app/models/vacinacao_registro.ts`
- `app/models/esus_cadastro_domiciliar.ts`
- `app/models/esus_visita_domiciliar.ts`
- `app/models/vigilancia_notificacao.ts`

---

## 3. Serviços de Regras de Negócio (`app/services/esus_service.ts`)
- `aplicarVacinaComBaixa`:
  - Valida se o lote está dentro do prazo de validade e possui saldo suficiente.
  - Deduz 1 dose do saldo do lote atomicamente via transação.
  - Calcula o aprazamento da próxima dose (ex: Pentavalente D1 -> D2 após 60 dias).
  - Registra a vacinação e devolve o comprovante nominal.
- `registrarVisitaAcs`:
  - Registra a visita do ACS com os indicadores da Atenção Primária.
- `notificarAgravoSinan`:
  - Gera protocolo único sequencial de notificação de vigilância em saúde.
- `obterCarteiraVacinal(cidadaoId)`:
  - Recupera todo o histórico de doses aplicadas com status de cobertura (Completo, Em atraso, No prazo).
- `auditarConsistenciaEsus`:
  - Verifica regras sanitárias do e-SUS APS (CNS do profissional, INE da equipe, CPF do cidadão, microárea válida).

---

## 4. Controladores e Endpoints RESTful
- `app/controllers/esus_controller.ts`:
  - `GET /esus`: Dashboard integrado da Atenção Básica (Fichas, Cobertura Vacinal e Vigilância SINAN).
  - `GET /esus/vacinas`: Painel da sala de vacinas com estoque de lotes, calendário e botão de registro.
  - `GET /esus/vacinas/carteira/:cidadaoId`: Carteira de Vacinação Digital nominal com aprazamentos.
  - `POST /esus/vacinas/aplicar`: Registro de nova aplicação com dedução de estoque.
  - `GET /esus/visitas`: Registro e listagem das visitas dos ACSs por microárea.
  - `POST /esus/visitas`: Cadastro de visita domiciliar territorial.
  - `GET /esus/notificacoes`: Painel de agravos e investigação epidemiológica do SINAN.
  - `POST /esus/notificacoes`: Envio de notificação compulsória de agravo.
  - `GET /api/esus/lotes-vacina/:imunobiologicoId`: Retorna lotes com saldo ativo para o imunobiológico selecionado.

---

## 5. Frontend React 19 + Inertia
1. **`inertia/pages/esus/index.tsx`**:
   - Painel Geral do e-SUS APS e Vigilância com KPIs de visitas de ACS, doses aplicadas no mês, notificações ativas no SINAN e taxa de cobertura vacinal infantil.
   - Navegação por abas ou subseções (Vacinação, Visitas Domiciliares, Vigilância Epidemiológica).
2. **`inertia/pages/esus/vacinas.tsx`**:
   - Sala de vacina municipal: Gestão de lotes em câmara fria (com validade e alertas de lote crítico).
   - Modal/Formulário de **Aplicação de Vacina**: Busca do munícipe, seleção da vacina do calendário PNI, escolha do lote ativo, via/local de aplicação e aprazamento.
   - Modal de **Carteira de Vacinação Digital**: Exibição da caderneta de vacina do cidadão com selo do SUS.
3. **`inertia/pages/esus/visitas.tsx`**:
   - Gestão territorial das visitas domiciliares dos ACSs com filtros por microárea, equipe de saúde da família e desfecho da visita.
   - Modal para apontamento rápido de visita territorial.
4. **`inertia/pages/esus/notificacoes.tsx`**:
   - Mapa e tabela de notificações compulsórias do SINAN (Dengue, COVID-19, Tuberculose, etc.) com status de investigação e evolução clínica.

---

## 6. Critérios de Validação & Homologação
- Migração executada sem conflito de esquema.
- Seeders populando o calendário vacinal do Ministério da Saúde (BCG, VIP, Penta, Meningo, Pneumo, Tríplice Viral, HPV, COVID) com lotes reais.
- `npm run typecheck` com 0 erros estáticos.
- Teste de aplicação de vacina com dedução atômica de saldo no lote e aprazamento de próxima dose.
- Teste de registro de visita do ACS e notificação compulsória SINAN com protocolo gerado.
- Parada para homologação do usuário antes de seguir para a próxima etapa.
