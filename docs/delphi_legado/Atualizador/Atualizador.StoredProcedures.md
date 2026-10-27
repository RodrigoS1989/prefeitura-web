---
unit: Atualizador.Controller.StoredProcedures
projeto: Atualizador
tipo: Controller
fonte: Atualizador\controller\Atualizador.Controller.StoredProcedures.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Atualizador.StoredProcedures

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

Cobre o controller e o SQL de procedures. O model só ganhou uma linha em branco nesta revisão.

## Propósito

O controller aplica as stored procedures do Atualizador. O model `Atualizador.Model.SQL.StoredProcedures` concentra o texto SQL dessas procedures.

## Contexto de uso

O chamador do fluxo de atualização não foi lido. A gravação do arquivo `FProcedures.sql` ocorre no próprio controller.

## Superfície pública

- Controller: fluxo que mantém `FProcedures` e, nesta revisão, grava esse conteúdo em disco.
- Model: `Atualizador.Model.SQL.StoredProcedures` — scripts estáticos das procedures. A lista completa de métodos não foi transcrita.

## Fluxo principal

1. O controller monta ou executa as procedures.
2. Grava `FProcedures` em `PASTA_DO_EXECUTAVEL_EM_EXECUCAO + 'FProcedures.sql'`, em UTF-8 (`SaveToFile`).

## Regras de negócio

- O arquivo de procedures ao lado do executável é UTF-8 (`SaveToFile` no controller).

## Dados

O SQL das procedures fica em `Atualizador.Model.SQL.StoredProcedures`. Não foi colado aqui.

## Interface

Não se aplica. Units sem form.

## Dependências

Controller e `Atualizador.Model.SQL.StoredProcedures`.

## Cuidados ao alterar

Fonte Windows-1252. Mudar o encoding do `SaveToFile` altera o arquivo que o processo deixa na pasta do executável. O model tem milhares de linhas; um diff só de linha em branco não muda script.

## Alteração na revisão

- Controller: passou a gravar `FProcedures.sql` em UTF-8 na pasta do executável em execução.
- `Atualizador.Model.SQL.StoredProcedures`: apenas uma linha em branco no fim do arquivo.

## Limites

O catálogo de procedures do model (cerca de 1645 linhas) não foi lido. Não se sabe em que método do controller o `SaveToFile` está, só que a linha foi incluída na r14853.
