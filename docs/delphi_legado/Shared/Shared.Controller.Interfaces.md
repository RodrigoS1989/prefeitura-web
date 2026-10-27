---
unit: Shared.Controller.Interfaces
projeto: Shared
tipo: Controller
fonte: Shared\controller\Shared.Controller.Interfaces.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Shared.Controller.Interfaces

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

A implementação de `InitialCatalog` está documentada em `Shared.Model.Conexao.md`.

## Propósito

Contratos compartilhados (`IConexao` e outras interfaces). Tem cerca de 2873 linhas.

## Contexto de uso

`TConexao` implementa `IConexao`. O modo automático do Prefeitura mexe na conexão, mas não foi confirmado o uso de `InitialCatalog` nesse fluxo.

## Superfície pública

Incluído na r14853, em `IConexao`:

- `function InitialCatalog: String`
- `function InitialCatalog(ADatabase: String): IConexao`

## Fluxo principal

1. O chamador define o catálogo pelo overload com parâmetro.
2. `TConexao` usa esse valor na connection string, se não estiver vazio.

## Regras de negócio

- Catálogo informado substitui o banco do parâmetro. Vazio mantém o banco padrão. Detalhe em `Shared.Model.Conexao`.

## Dados

A connection string é montada no model. Credencial não é reproduzida aqui.

## Interface

Não se aplica. Unit sem form.

## Dependências

Implementação em `Shared.Model.Conexao`.

## Cuidados ao alterar

Fonte Windows-1252. A unit concentra muitas interfaces. Incluir método em `IConexao` obriga implementar em `TConexao`.

## Alteração na revisão

Só as duas assinaturas de `InitialCatalog`.

## Limites

As demais interfaces da unit não foram lidas.
