---
unit: Saude.Parametro
projeto: Shared
tipo: Controller
fonte: Shared\controller\saude\Saude.Controller.Parametro.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Saude.Parametro

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

Cobre `Saude.Controller.Parametro`, `Saude.Model.Parametro` e as duas assinaturas novas em `Saude.Controller.Interfaces`.

## Propósito

Carrega os parâmetros do módulo de saúde (`IParametroSaude` / `TParametroSaude`) a partir da consulta de configuração. O flag novo escolhe a geração de fichas e-SUS por validação SQL.

## Contexto de uso

`UME000` lê `conParametroSaude.GetParametro.GetUsaValidacaoSqlEsus` para abrir a PM1047 (`TFormEsusProducao`) no lugar da PM134. A tela PM1052 grava o campo `fl_UsaValidacaoSqlEsus` em `Arq000`.

## Superfície pública

- `function GetUsaValidacaoSqlEsus: Boolean`
- `function SetUsaValidacaoSqlEsus(const AValue: Boolean): IParametroSaude`
- Campo `FUsaValidacaoSqlEsus` em `TParametroSaude`

Declarados na interface e implementados no model. O controller aplica o valor vindo da query.

## Fluxo principal

1. A consulta de parâmetros inclui `IsNull(fl_UsaValidacaoSqlEsus,0) as fl_UsaValidacaoSqlEsus` (`Saude.Model.SQL`).
2. O controller faz `.SetUsaValidacaoSqlEsus(LQry.FieldByName('fl_UsaValidacaoSqlEsus').AsBoolean)`.
3. O menu de produção e-SUS consulta `GetUsaValidacaoSqlEsus`.

## Regras de negócio

- Flag nulo no banco vale falso por causa do `IsNull(..., 0)` no SQL.
- Com o flag ligado, o menu abre `TFormEsusProducao`; desligado, continua na PM134 (`UME000`).

## Dados

Coluna `fl_UsaValidacaoSqlEsus` no SELECT de parâmetros em `Saude.Model.SQL`. A tabela desse SELECT não foi nomeada no trecho lido (o campo também existe em `Arq000` no data module).

## Interface

Não se aplica. O checkbox da PM1052 é `chkUsaValidacaoSqlEsus` (`DataField=fl_UsaValidacaoSqlEsus`).

## Dependências

`Saude.Controller.Interfaces`, `Saude.Controller.Parametro`, `Saude.Model.Parametro`, `Saude.Model.SQL`.

## Cuidados ao alterar

Fonte Windows-1252. Renomear o campo sem ajustar o SELECT, o `Arq000` e o checkbox da PM1052 desalinha o menu da produção.

## Alteração na revisão

Propriedade nova de ponta a ponta: interface, model, atribuição no controller e coluna no SELECT de `Saude.Model.SQL`.

## Limites

`Saude.Controller.Interfaces` tem cerca de 3726 linhas. Só as duas assinaturas novas foram lidas. O SELECT completo de parâmetros não foi transcrito.
