---
unit: Shared.Model.Conexao
projeto: Shared
tipo: Model
fonte: Shared\model\Shared.Model.Conexao.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Shared.Model.Conexao

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

A interface `IConexao.InitialCatalog` foi declarada em `Shared.Controller.Interfaces` e implementada aqui.

## Propósito

Monta a conexão ADO do sistema. Passa a permitir um catálogo inicial diferente do banco padrão do parâmetro.

## Contexto de uso

`Prefeitura.dpr`, no modo automático, ajusta a conexão master/principal antes de chamar o e-SUS. Não foi confirmado se esse caminho usa `InitialCatalog`.

## Superfície pública

- `function InitialCatalog: String` — lê o catálogo forçado.
- `function InitialCatalog(ADatabase: String): IConexao` — define `FInitialCatalog` e devolve `Self`.

As mesmas assinaturas entraram em `IConexao` (`Shared.Controller.Interfaces`).

## Fluxo principal

1. O chamador pode definir o catálogo com `InitialCatalog(nome)`.
2. Na montagem da connection string, se `FInitialCatalog` não estiver vazio, ele substitui `FParametro.GetBanco`.
3. Usuário, servidor e demais trechos continuam vindo do parâmetro.

## Regras de negócio

- Catálogo vazio mantém o banco do parâmetro de conexão (`InitialCatalog`).

## Dados

A connection string é montada nesta unit. Usuário e servidor existem no texto. Os valores não são documentados.

## Interface

Não se aplica. Unit sem form.

## Dependências

`IConexao` em `Shared.Controller.Interfaces`. `FParametro` da própria conexão.

## Cuidados ao alterar

Fonte Windows-1252. Mudar a ordem dos pedaços da connection string quebra todo sistema que abre banco por esta classe. Não gravar connection string de exemplo com credencial.

## Alteração na revisão

Campo `FInitialCatalog` e os dois métodos. A string passou a usar esse catálogo quando preenchido. Em `Shared.Controller.Interfaces` só entraram as duas assinaturas de `InitialCatalog`; o restante da unit de interfaces (cerca de 2873 linhas) não mudou.

## Limites

Não foi lido quem chama `InitialCatalog` além da declaração. O catálogo de outras interfaces de `Shared.Controller.Interfaces` não foi transcrito.
