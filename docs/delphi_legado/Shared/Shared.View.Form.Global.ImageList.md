---
unit: Shared.View.Form.Global.ImageList
projeto: Shared
tipo: Form
fonte: Shared\view\Shared.View.Form.Global.ImageList.pas
dfm: Shared\view\Shared.View.Form.Global.ImageList.dfm
revisao: r14853
atualizado: 2026-10-07
---

# Shared.View.Form.Global.ImageList

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Form de imagens globais dos botões (`FormGlobalImageList`, caption "Image List - Global"). As telas usam `FormGlobalImageList.imgBotoes` no `Images` dos page controls e botões.

## Contexto de uso

As fichas e-SUS passaram a apontar `Images = FormGlobalImageList.imgBotoes` e usam `ImageIndex = 37` na aba de inconsistências quando há texto. O botão e-SUS da PM483 usa `ImageIndex = 55`.

## Superfície pública

`imgBotoes` e o form `FormGlobalImageList`. O `.pas` não mudou de conteúdo; a lista está no dfm.

## Fluxo principal

1. O form é criado com o executável.
2. Botões e abas leem o índice da lista.

## Regras de negócio

Não se aplica ao código. A revisão trocou o bitmap da lista.

## Dados

Não se aplica.

## Interface

- `FormGlobalImageList` — caption "Image List - Global".
- A lista de botões teve `ColorDepth` definido como `cd32Bit` e o bloco de bitmap substituído.

## Dependências

Referenciado por `Shared.View.Form.Global.ImageList` nas uses das fichas e da PM483.

## Cuidados ao alterar

O dfm é Windows-1252 e o bitmap é grande. Regravar o dfm em UTF-8 corrompe a lista. O índice 37 e o 55 passam a apontar para outro desenho se a ordem dos ícones mudar.

## Alteração na revisão

Só o dfm: `ColorDepth = cd32Bit` e substituição do bitmap. O diff tem milhares de linhas hexadecimais; o desenho não foi interpretado.

## Limites

Não foi conferido qual ícone novo ocupa o índice 37 ou o 55. O `.pas` (cerca de 95 linhas) não entrou no diff de conteúdo.
