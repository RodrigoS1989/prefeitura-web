---
unit: untAtualizaDados
projeto: Atualizador
tipo: Form
fonte: Atualizador\untAtualizaDados.pas
dfm: Atualizador\untAtualizaDados.dfm
revisao: r14853
atualizado: 2026-10-07
---

# untAtualizaDados

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Tela de atualização do banco de dados do Atualizador (`frmAtualizaDados`, caption "Atualização no Banco de Dados"). O operador escolhe o banco e dispara scripts de atualização.

## Contexto de uso

Aberta pelo fluxo do Atualizador. O menu que a chama não foi lido.

## Superfície pública

Form com eventos de tela. O trecho novo é a chamada a `TResourceScriptExecutor.ExecutarScript`.

## Fluxo principal

1. O usuário informa o banco (`cbBancos`).
2. A atualização executa os scripts de recurso, inclusive `Social_Types`.

## Regras de negócio

- O script do recurso `Social_Types` roda no banco selecionado em `cbBancos` (`TResourceScriptExecutor.ExecutarScript`).

## Dados

O conteúdo do script não está nesta unit. Ele vem do recurso `Social_Types` (arquivo SQL fora deste documento).

## Interface

- `frmAtualizaDados` / `TfrmAtualizaDados` — caption "Atualização no Banco de Dados".
- `cbBancos` — banco alvo do script.

Os demais controles do dfm não foram listados.

## Dependências

`Atualizador.ResourcesHelper` (`TResourceScriptExecutor`). O par `.dfm` existe. O dfm não mudou de conteúdo nesta revisão.

## Cuidados ao alterar

Fonte Windows-1252. Remover a chamada deixa de aplicar types SQL na atualização de dados.

## Alteração na revisão

Incluída a linha `TResourceScriptExecutor.ExecutarScript('Social_Types', cbBancos.Text)`.

## Limites

O restante do fluxo de atualização (quais scripts já rodavam antes) não foi lido. A unit tem cerca de 649 linhas.
