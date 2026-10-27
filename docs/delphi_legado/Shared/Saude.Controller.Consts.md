---
unit: Saude.Controller.Consts
projeto: Shared
tipo: Controller
fonte: Shared\controller\saude\Saude.Controller.Consts.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Saude.Controller.Consts

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Constantes do módulo de saúde, inclusive regras numéricas do e-SUS.

## Contexto de uso

`Shared.Esus` e a unit de integração usam `ESUS_IDADE_IVCF` e `ESUS_VAC_COND_MATERNAL_*`. `ValidaCnpjCaracteres` usa `CHAR_VALIDOS_CNPJ`.

## Superfície pública

Novas ou repetidas na r14853:

- `CHAR_VALIDOS_CNPJ` — dígitos e letras maiúsculas e minúsculas.
- `ESUS_IDADE_CID_CIAP_ABP_PRE_NATAL = 9` — já existia; CIDs, CIAPs e códigos ABP de gravidez só a partir dessa idade. O comentário foi regravado na revisão.
- `ESUS_IDADE_IVCF = 60`
- `ESUS_TIPO_ATENDIMENTO_ESCUTA_INICIAL = 4`
- `ESUS_VAC_COND_MATERNAL_NENHUMA = 1`
- `ESUS_VAC_COND_MATERNAL_GESTANTE = 2`
- `ESUS_VAC_COND_MATERNAL_PUERPERA = 3`

## Fluxo principal

Não se aplica. São constantes lidas por quem monta a ficha.

## Regras de negócio

- IVCF só é considerado a partir dos 60 anos (`ESUS_IDADE_IVCF`).
- Condição maternal da vacina: 1 nenhuma, 2 gestante, 3 puérpera.

## Dados

Não se aplica.

## Interface

Não se aplica. Unit sem form.

## Dependências

Consumida por `Shared.Esus`, `Saude.Controller.Uteis.Esus` e `Saude.Controller.Esus.Integracao`.

## Cuidados ao alterar

Fonte Windows-1252. Mudar o valor de `ESUS_VAC_COND_MATERNAL_*` muda o código enviado na ficha de vacinação.

## Alteração na revisão

Incluídas as constantes de IVCF, escuta inicial, condição maternal e o conjunto de caracteres de CNPJ.

## Limites

As outras constantes da unit (cerca de 532 linhas) não foram listadas.
