---
unit: Saude.Controller.Uteis.Esus
projeto: Shared
tipo: Controller
fonte: Shared\controller\saude\Saude.Controller.Uteis.Esus.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Saude.Controller.Uteis.Esus

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Funções de validação usadas na montagem das fichas e-SUS (`TSaudeUtilEsus`).

## Contexto de uso

A integração e as telas de encaminhamento (PM474, ME018, ME018_P) deixaram de depender de `ValidaCboCid10FAI` para esconder CID ou CIAP. O método continua existindo e passou a aceitar qualquer CBO.

## Superfície pública

- `class function ValidaCboCid10FAI(const AValueCbo: string): Boolean`
- `class function ValidaCNSCaracteres(const AValueCns: string): Boolean`
- `class function ValidaCnpjCaracteres(const AValue: string): Boolean`
- `class function ValidaNumeroDo(const AValue: string): Boolean`

Só os dois primeiros itens do diff foram alterados de fato. Os outros dois aparecem no arquivo; não foi confirmado se o corpo deles mudou.

## Fluxo principal

1. `ValidaCboCid10FAI` retorna verdadeiro sem consultar lista de CBO.
2. `ValidaCnpjCaracteres` percorre cada caractere e recusa o que não estiver em `CHAR_VALIDOS_CNPJ`.

## Regras de negócio

- Qualquer CBO pode informar CID10 na ficha de atendimento individual (`ValidaCboCid10FAI`). A lista fixa de 34 CBOs foi removida.
- CNPJ deixa de passar pelo validador de dígito (`Validador.CNPJ.Validar`) e passa a aceitar letras e números de `CHAR_VALIDOS_CNPJ` (`ValidaCnpjCaracteres`).

## Dados

Não se aplica.

## Interface

Não se aplica. Unit sem form.

## Dependências

`Saude.Controller.Consts` (`CHAR_VALIDOS_CNPJ`).

## Cuidados ao alterar

Fonte Windows-1252. Voltar a lista de CBO reativa a inconsistência de encaminhamento que a unit de integração também removeu. As telas de guia passaram a mostrar CID e CIAP juntos.

## Alteração na revisão

`ValidaCboCid10FAI` sempre verdadeiro. `ValidaCnpjCaracteres` valida só o conjunto de caracteres.

## Limites

Não foi lido o corpo de `ValidaCNSCaracteres` nem de `ValidaNumeroDo`. A unit tem cerca de 1452 linhas.
