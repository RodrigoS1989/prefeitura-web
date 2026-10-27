---
unit: Atualizador.ResourcesHelper
projeto: Atualizador
tipo: Unit
fonte: Atualizador\Atualizador.ResourcesHelper.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Atualizador.ResourcesHelper

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Executa no banco do Atualizador um script SQL embutido como recurso do executável. O nome do recurso é a chave; o texto do script pode conter o marcador `#DATABASE_NAME`, trocado pelo banco informado.

## Contexto de uso

`untAtualizaDados` chama `TResourceScriptExecutor.ExecutarScript` durante a atualização de dados. Outros chamadores não foram rastreados nesta revisão.

## Superfície pública

- `class function ObterScript(const ANomeRecurso: string): string` — devolve o texto do recurso.
- `class procedure ExecutarScript(const ANomeRecurso: string; ABanco: string)` — substitui `#DATABASE_NAME` e executa o script na conexão `tcAtualizador`, com `ParamCheck = False` e `CommandTimeout = 0`.

## Fluxo principal

1. `ExecutarScript` obtém o script, monta o comando ADO e executa.
2. Se `Connection.Errors` tiver itens, dispara exceção com a descrição do último erro.
3. Qualquer falha é relançada com o nome do recurso e a mensagem original.
4. O comando é liberado em `finally`.

## Regras de negócio

- Erro de conexão ADO depois do `Execute` interrompe a atualização (`ExecutarScript`).
- O banco alvo entra no script só pelo marcador `#DATABASE_NAME`.

## Dados

Não monta SQL de tabela. O texto vem do recurso (nesta revisão, `Social_Types` é um dos chamados). A conexão é a do sistema em modo `tcAtualizador`.

## Interface

Não se aplica. Unit sem form.

## Dependências

`Atualizador.Controller.Globais`, `Shared.Controller.Tipos`, `Shared.Controller.Consts`, `Shared.Controller.Globais`.

## Cuidados ao alterar

O fonte é Windows-1252. Tirar a checagem de `Connection.Errors` faz o Atualizador seguir mesmo com erro de script. O `Free` do comando precisa permanecer no `finally`.

## Alteração na revisão

A r14853 passou a ler `Connection.Errors` após o `Execute` e a liberar o comando no `finally`. Entrou `Shared.Controller.Consts` na uses.

## Limites

O corpo de `ObterScript` não foi extraído. Não foi conferido quais recursos existem além de `Social_Types`.
