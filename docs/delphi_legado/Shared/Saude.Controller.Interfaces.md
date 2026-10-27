---
unit: Saude.Controller.Interfaces
projeto: Shared
tipo: Controller
fonte: Shared\controller\saude\Saude.Controller.Interfaces.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Saude.Controller.Interfaces

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

A implementação está em `Saude.Parametro.md`.

## Propósito

Contratos do módulo de saúde, inclusive `IParametroSaude`. Tem cerca de 3726 linhas.

## Contexto de uso

`TParametroSaude` implementa o flag. `UME000` lê o valor para escolher a tela de produção e-SUS.

## Superfície pública

Incluído na r14853:

- `function GetUsaValidacaoSqlEsus: Boolean`
- `function SetUsaValidacaoSqlEsus(const AValue: Boolean): IParametroSaude`

## Fluxo principal

1. O controller de parâmetro chama `SetUsaValidacaoSqlEsus` com a coluna da query.
2. O menu consulta `GetUsaValidacaoSqlEsus`.

## Regras de negócio

- Ver `Saude.Parametro.md`. O flag escolhe PM1047 ou PM134.

## Dados

Coluna `fl_UsaValidacaoSqlEsus`.

## Interface

Não se aplica. Unit sem form.

## Dependências

`Saude.Model.Parametro` e `Saude.Controller.Parametro`.

## Cuidados ao alterar

Fonte Windows-1252. A unit é só contrato; esquecer o model deixa o projeto sem implementação.

## Alteração na revisão

Duas assinaturas em `IParametroSaude`.

## Limites

O restante das interfaces não foi lido.
