---
unit: Atualizador.Model.SQL
projeto: Atualizador
tipo: SQL
fonte: Atualizador\model\Atualizador.Model.SQL.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Atualizador.Model.SQL

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Unit de fachada do SQL do Atualizador. Declara uses para os scripts especializados (tabela, procedure, view e outros). Tem cerca de 772 linhas na r14853.

## Contexto de uso

Consumida pelos controllers do Atualizador. Os chamadores não foram lidos.

## Superfície pública

Não houve método novo nesta revisão. A superfície é a das units de SQL referenciadas. Não foi transcrita.

## Fluxo principal

1. A unit agrega os módulos de SQL do Atualizador.
2. Controllers usam esses scripts na atualização.

## Regras de negócio

Não se aplica à r14853. O diff só reordenou a cláusula uses.

## Dados

Os scripts permanecem nas units `Atualizador.Model.SQL.*`. Nada de tabela foi alterado neste arquivo.

## Interface

Não se aplica. Unit sem form.

## Dependências

`System.SysUtils`, `System.Classes`, `Atualizador.Controller.Interfaces`.

## Cuidados ao alterar

Fonte Windows-1252. A ordem da uses mudou; não misturar com alteração funcional sem conferir o diff.

## Alteração na revisão

Uses reorganizada: `System.SysUtils` e `System.Classes` na interface, `Atualizador.Controller.Interfaces` em seguida. Sem mudança de script.

## Limites

O miolo da unit (tipos e funções) não foi lido. Só o diff da r14853 e o cabeçalho do esqueleto.
