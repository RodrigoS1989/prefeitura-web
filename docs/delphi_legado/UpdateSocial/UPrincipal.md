---
unit: UPrincipal
projeto: UpdateSocial
tipo: Form
fonte: UpdateSocial\UPrincipal.pas
dfm: UpdateSocial\UPrincipal.dfm
revisao: r14853
atualizado: 2026-10-07
---

# UPrincipal

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Tela principal do atualizador de versões (`frmPrincipal`, caption "Atualizador de Versões"). Depois de atualizar, abre de novo o executável do sistema.

## Contexto de uso

`Prefeitura.dpr`, no ramo `MODO`, chama `Util.ChamarUpdateSocial` e `Util.AtualizarUpdateSocial` antes da produção e-SUS. Esta unit é quem relança o executável. O método exato do `ShellExecute` não foi nomeado além do diff.

## Superfície pública

O form relança o executável (`ShellExecute`) com ou sem parâmetros de linha de comando.

## Fluxo principal

1. `Util.CarregarModo` lê os parâmetros já definidos (`MODO_ESUS`, `MODO_ACS`, `MODO_AGENDAMENTO`, `MODO_SED`, `ESUS_COMPETENCIA`).
2. Monta `LParam` com `INIT_ESUS`, competência `-YYYYMM` se houver, `INIT_ACS`, `INIT_AGENDAMENTO` e `INIT_SED`.
3. Se `LParam` estiver vazio, `ShellExecute` abre o executável sem argumentos.
4. Caso contrário, abre com esses argumentos.

## Regras de negócio

- Modo e-SUS repassado na reabertura usa a constante `INIT_ESUS` (`-esus`).
- Se `ESUS_COMPETENCIA` não estiver vazia, acrescenta `-<competência>`.
- Os outros modos (`-acs`, `-agendamento`, `-sed`) só entram se o flag correspondente estiver ligado.

## Dados

Não se aplica. Só linha de comando.

## Interface

- `frmPrincipal` / `TfrmPrincipal` — caption "Atualizador de Versões". Eventos `OnCreate` e `OnShow`.

O controle que dispara o `ShellExecute` não foi nomeado no diff.

## Dependências

`Shared.Controller.Consts` (`MODO_*`, `INIT_*`, `ESUS_COMPETENCIA`) e `Shared.Controller.Uteis` (`Util.CarregarModo`).

## Cuidados ao alterar

Fonte Windows-1252. Esquecer de repassar `INIT_ESUS` faz o Prefeitura voltar do atualizador sem o modo robô e não chamar `TEsus.GerarProducaoAPIInicializacao`.

## Alteração na revisão

`Util.CarregarModo` passou a ser chamado, e o `ShellExecute` passou a receber os parâmetros dos modos automáticos.

## Limites

O restante da tela (download de arquivos, progresso) não foi lido. A unit tem cerca de 505 linhas. O `.dproj` do UpdateSocial não mudou de conteúdo nesta revisão.
