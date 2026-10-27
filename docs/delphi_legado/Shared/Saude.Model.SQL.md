---
unit: Saude.Model.SQL
projeto: Shared
tipo: SQL
fonte: Shared\model\saude\Saude.Model.SQL.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Saude.Model.SQL

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Catálogo de SQL do módulo de saúde. Tem cerca de 4756 linhas. Nesta revisão mudaram o filtro de CIAP da atenção básica e a coluna do parâmetro de validação e-SUS.

## Contexto de uso

O SELECT de parâmetros alimenta `Saude.Controller.Parametro`. O filtro de CIAP é usado quando `AIsFai` é verdadeiro. As telas PM036 e ME003 repetem a mesma condição no próprio fonte.

## Superfície pública

Funções de SQL da unit. Os nomes dos métodos alterados não aparecem no diff, só as linhas de script.

## Fluxo principal

1. Quem lista CIAP da FAI pede o script com `AIsFai`.
2. O script exclui CIAP que seja vínculo ABP (feminino, masculino ou genérico).
3. O SELECT de parâmetros devolve `fl_UsaValidacaoSqlEsus`.

## Regras de negócio

- Na FAI, some da lista o CIAP que exista em `tb_EsusCiap.ds_CodigoCiapVinculo`, `ds_CodigoCiapVinculoFeminino` ou `ds_CodigoCiapVinculoMasculino`.
- Antes a exclusão era só `b.ds_CodigoCiapVinculo IS NULL`.

## Dados

- `tb_EsusCiap`: `ds_CodigoCiapVinculo`, `ds_CodigoCiapVinculoFeminino`, `ds_CodigoCiapVinculoMasculino`.
- Coluna `fl_UsaValidacaoSqlEsus`, com `IsNull(..., 0)`, no SELECT de parâmetros.

## Interface

Não se aplica. Unit sem form.

## Dependências

Consumida pelo controller de parâmetro e pelas telas que montam lista de CIAP. `Util.IIf` escolhe o trecho quando `AIsFai`.

## Cuidados ao alterar

Fonte Windows-1252. O mesmo predicado foi copiado em `UPM036`, `UME003` e aqui. Ajustar só um deles deixa a pesquisa de CIAP diferente da geração.

## Alteração na revisão

Troca do filtro `ds_CodigoCiapVinculo IS NULL` pelo `NOT EXISTS` em `tb_EsusCiap`, e inclusão de `fl_UsaValidacaoSqlEsus` no SELECT de parâmetros.

## Limites

O nome da função que contém cada script não foi lido. O restante do catálogo SQL não foi transcrito.
