---
unit: Shared.View.Testes.RNDS
projeto: Shared
tipo: Form
fonte: Shared\view\testes\Shared.View.Testes.RNDS.pas
dfm: Shared\view\testes\Shared.View.Testes.RNDS.dfm
revisao: r14853
atualizado: 2026-10-07
---

# Shared.View.Testes.RNDS

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Tela de testes da integração RNDS. Caption: "Tela de testes da integração com o RNDS".

## Contexto de uso

Form de teste. Não foi visto chamador de produção nesta revisão.

## Superfície pública

O `.pas` não mudou de conteúdo. O dfm perdeu o BOM e renomeou um label.

## Fluxo principal

Não se aplica à revisão. O fluxo da tela de teste não foi lido.

## Regras de negócio

Não se aplica. A revisão não alterou regra.

## Dados

Não se aplica ao diff.

## Interface

- `FormTesteRnds` / `TFormTesteRnds`.
- O label cujo nome era acentuado (`Farmácia`) passou a se chamar `Farmacia`.

## Dependências

Não lidas. A unit tem cerca de 384 linhas.

## Cuidados ao alterar

O dfm é Windows-1252. O arquivo tinha BOM UTF-8 no início (`object` precedido da marca). A revisão removeu essa marca. Não gravar o dfm de novo como UTF-8.

## Alteração na revisão

Só o dfm: removido o BOM e renomeado o componente do label para `Farmacia`.

## Limites

O código do teste RNDS não foi lido. Não foi conferido se o caption do label mudou ou só o nome do componente.
