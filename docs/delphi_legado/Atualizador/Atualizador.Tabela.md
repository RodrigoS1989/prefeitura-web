---
unit: Atualizador.Controller.Tabela
projeto: Atualizador
tipo: Controller
fonte: Atualizador\controller\Atualizador.Controller.Tabela.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Atualizador.Tabela

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

Cobre o controller de tabelas e `Atualizador.Model.SQL.Tabela`.

## Propósito

Cria e ajusta tabelas do banco na atualização. O model expõe scripts `CREATE TABLE` estáticos, consumidos pelo controller.

## Contexto de uso

O controller percorre definições e chama `CriaTabela`. O ponto que dispara essa lista não foi lido.

## Superfície pública

- Controller: criação de tabelas via `NovaTabela.SetNome(...).SetScriptCriacao(...).CriaTabela`.
- Model: `class function Create_tb_...` em `TSQLTabela`.

## Fluxo principal

1. O controller registra cada tabela com nome e script do model.
2. `CriaTabela` aplica o script no banco.

## Regras de negócio

- A tabela `tb_EsusGestores` deixou de ser criada por este fluxo (`Atualizador.Controller.Tabela`).

## Dados

Até a revisão anterior, `TSQLTabela.Create_tb_EsusGestores` criava `tb_EsusGestores` com `cd_Sequencia`, `cd_Gestor`, usuários e datas de inclusão/exclusão, chave `PK_tb_EsusGestores` em `cd_Sequencia`. Esse script foi removido. As demais tabelas do model não foram lidas.

## Interface

Não se aplica. Units sem form.

## Dependências

`Atualizador.Controller.Tabela` e `Atualizador.Model.SQL.Tabela`.

## Cuidados ao alterar

Fonte Windows-1252. Recolocar `tb_EsusGestores` aqui reabre a tabela que as telas (PM483, correio, fichas) deixaram de usar na mesma revisão. O model tem cerca de 3000 linhas; a remoção foi só desse script.

## Alteração na revisão

Removidos a chamada `NovaTabela.SetNome('tb_EsusGestores')` e o método `Create_tb_EsusGestores`.

## Limites

As outras tabelas criadas pelo controller não foram listadas.
