---
unit: Shared.View.Testes.InconsistenciaCsvPEC
projeto: Shared
tipo: Form
fonte: Shared\view\testes\Shared.View.Testes.InconsistenciaCsvPEC.pas
dfm: Shared\view\testes\Shared.View.Testes.InconsistenciaCsvPEC.dfm
revisao: r14853
atualizado: 2026-10-07
---

# Shared.View.Testes.InconsistenciaCsvPEC

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Tela de teste para devolver fichas marcadas como inconsistentes a partir do CSV do PEC e-SUS. Caption: "Voltar fichas inconsistences via CSV PEC e-SUS".

## Contexto de uso

Form de teste em `Shared\view\testes`. Não foi visto chamador de produção.

## Superfície pública

O mapa `LFichaInfo` associa um trecho do nome do arquivo CSV à tabela e à coluna de código da ficha.

## Fluxo principal

1. O teste identifica o tipo pelo nome do arquivo (`_RAS_...`).
2. Localiza a ficha na tabela correspondente.

## Regras de negócio

Chaves novas do mapa (`TFichaInfo.Create(tabela, campo)`):

| Trecho | Tabela | Campo |
| --- | --- | --- |
| `_RAS_FAP_` | `tb_EsusFAP` | `cd_FAP` |
| `_RAS_FAV_` | `tb_EsusFAV` | `cd_FAV` |
| `_RAS_FAI_` | `tb_EsusFAI` | `cd_FAI` |
| `_RAS_FAO_` | `tb_EsusFAO` | `cd_FAO` |
| `_RAS_FAC_` | `tb_EsusFAC` | `cd_FAC` |
| `_RAS_CadDom_` | `tb_EsusCadDom` | `cd_CadDom` |
| `_RAS_CadInd_` | `tb_EsusCadInd` | `cd_CadInd` |
| `_RAS_FAM_` | `tb_EsusFAM` | `cd_FAM` |
| `_RAS_FAE_` | `tb_EsusFAE` | `cd_FAE` |
| `_RAS_FAD_` | `tb_EsusFAD` | `cd_FAD` |
| `_RAS_FCZ_` | `tb_EsusFichaCompZika` | `cd_FichaCompZika` |
| `_RAS_VAC_` | `tb_EsusFichaVacinacao` | `cd_FichaVacinacao` |

As chaves antigas eram nomes longos (`_RAS_Procedimentos_`, `_RAS_Visita_Domiciliar_`, e assim por diante) para as mesmas tabelas.

## Dados

Tabelas e campos da tabela acima.

## Interface

`FormInconsistenciaCsvPEC` — caption "Voltar fichas inconsistences via CSV PEC e-SUS". O texto do caption está assim no dfm, com a palavra "inconsistences".

## Dependências

`TFichaInfo`. O restante da uses não foi transcrito. A unit tem cerca de 224 linhas.

## Cuidados ao alterar

Fonte Windows-1252. CSV do PEC com o nome antigo de arquivo deixa de casar com a chave.

## Alteração na revisão

Renomeadas as doze chaves do mapa para a sigla da ficha.

## Limites

Não foi lido como o nome do arquivo é comparado com a chave (contém, igual, sufixo).
