---
unit: Prefeitura.View.Form.EsusConfig
projeto: Prefeitura
tipo: Form
fonte: Prefeitura\view\Prefeitura.View.Form.EsusConfig.pas
dfm: Prefeitura\view\Prefeitura.View.Form.EsusConfig.dfm
revisao: r14853
atualizado: 2026-10-07
---

# Prefeitura.View.Form.EsusConfig

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

PM1052, configurações de integração com o e-SUS. Substitui a aba e-SUS que saiu da PM483. Grava flags em `Arq000` e as credenciais da API.

## Contexto de uso

`TPrefeituraFabricaView.FormEsusConfig` cria o form e dá `ShowModal`. A PM483 chama isso em `btEsusClick` (`conFabricaPrefeitura.View.FormEsusConfig`).

## Superfície pública

- `constructor Create(AOwner: TComponent)`
- `procedure AtivarControles` — override
- `procedure Gravar` — override; chama `GravarConfigApi`, `Post` e `UpdateBatch` em `Arq000`
- `procedure LimparControles` — override
- `CarregarConfigApi` e `GravarConfigApi` — privados

Eventos: `FormShow`, `btAlterarClick`, `btConfirmarClick`, `btCancelarClick`, `chkUtilizaEsusClick`.

## Fluxo principal

1. `FormShow` carrega a configuração (o corpo não foi extraído além da existência do método).
2. `chkUtilizaEsusClick` habilita os demais grupos só se a integração estiver marcada.
3. `btConfirmarClick` pergunta se confirma a gravação. Se sim, `Gravar` e `AtivarControles`.
4. `Gravar` edita `Arq000` se não estiver em edição, grava a API, dá `Post` e `UpdateBatch`. Erro cancela o dataset e relança.

## Regras de negócio

- Os checkboxes e grupos de atividade coletiva, defasagem e versão só ficam habilitados com `chkUtilizaEsus` marcado (`chkUtilizaEsusClick`).
- Senha vazia não sobrescreve a senha já gravada (`GravarConfigApi`).
- A senha da API existe na tela e em `Arq000ds_EsusApiSenha`. O valor não é documentado. A gravação passa por criptografia; a leitura, por descriptografia.

## Dados

DataSource `ds_Arq000`. Campos ligados no dfm:

- `fl_IntegraESUS`, `fl_MudarCursorPosConsulta`, `fl_AtivaBPAFichaProcedimento`, `fl_MudarLayoutFAO`, `fl_GravarHistoricoCns`, `fl_ExibirHiperdiaFav`
- `fl_ForcarVinculoMicroAreaFichas`, `fl_DesabilitaIntegracaoEsusPM002`, `fl_ImportarEquipesXmlCnes`
- `fl_PriorizarCpfExportacaoEsus`, `fl_UsaValidacaoSqlEsus`, `fl_FiltrarTipoAtendimentoPE`
- `nr_MaxProfissionaisParticipantesAtivCol`, `nr_DiasDefasagemFichaESUS`, `cd_VersaoEsus`
- API, sem DataField: `ds_EsusApiUsuario`, `ds_EsusApiSenha`, `ds_EsusApiBaseUrl`, `fl_EsusApiEnvioAutomatico`

## Interface

Caption: "PM1052 - Configurações de Integração com o e-SUS". Herda `TFormCadastro`.

- Aba Configurações: checkboxes acima e grupos de atividade coletiva, defasagem e versão (`dbcVersaoEsus`).
- Aba API: `edEsusApiUsuario`, `edEsusApiSenha`, `edEsusApiBaseUrl`, `chkEsusApiEnvioAutomatico` ("Envio Automático das Produções para a API").
- `chkUsaValidacaoSqlEsus` — caption "Ativar nova forma de geração das fichas do e-SUS".
- Botões herdados: `btAlterar`, `btConfirmar`, `btCancelar`.

## Dependências

`UFuncao`, `UModGeral`, `Saude.Controller.Globais`, `Shared.Controller.Consts`, `Globais`, `Tipos`, `Helpers`. Fábrica em `Prefeitura.Controller.Fabrica`.

## Cuidados ao alterar

Fonte Windows-1252. A senha não pode ir para log nem para este documento. `EnvioAutomaticoAtivo` em `Shared.Esus` lê o mesmo flag. Desligar `fl_UsaValidacaoSqlEsus` devolve o menu para a PM134.

## Alteração na revisão

Unit e dfm adicionados. A PM483 deixou de editar esses campos e passou a abrir esta tela.

## Limites

`FormShow`, `AtivarControles`, `LimparControles` e `btAlterarClick` não tiveram o corpo extraído.
