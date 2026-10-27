---
unit: Saude.Controller.Esus.Integracao
projeto: Shared
tipo: Controller
fonte: Shared\controller\saude\esus\integracao\Saude.Controller.Esus.Integracao.pas
dfm: Shared\model\saude\esus\integracao\Saude.Model.Esus.Integracao.DataModule.dfm
revisao: r14853
atualizado: 2026-10-07
---

# Saude.Esus.Integracao

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

Cobre o controller de integração e o data module cujo dfm mudou. Os layouts Thrift não têm documento próprio.

## Propósito

Monta o transporte da produção e-SUS a partir das queries do data module e grava inconsistência de ficha quando a regra local falha. É o caminho anterior de exportação, ainda usado ao lado de `Shared.Esus`.

## Contexto de uso

Chamado pela geração de fichas. O data module fornece os datasets (`Modulo.*`). O chamador de cada `Gerar*` não foi lido.

## Superfície pública

A unit tem cerca de 17299 linhas. A superfície não foi transcrita. Os pontos alterados são a montagem do atendimento individual, da ficha de procedimentos, da vacinação e da glicemia.

## Fluxo principal

1. O data module abre as fichas da competência.
2. O controller preenche o transporte e, se a regra falhar, marca `FLAG_INCONSISTENCIA` e chama `GravarInconsistenciaFicha`.

## Regras de negócio

- INE do finalizador da observação só é enviado se `FAIPacienteProfissionalIne` não estiver vazio.
- `FAIPacienteds_INE` também só segue se a string não estiver vazia (antes testava `IsNull`).
- Encaminhamento da FAI não rejeita mais CID10 nem CIAP2 por causa do CBO. As inconsistências "CBO não liberado para CID10" e "CBO liberado apenas para CID10" foram removidas.
- IVCF na ficha de procedimentos só é preenchido se não for escuta inicial (`fl_EscutaInicial <> 1`), houver data de nascimento e a idade na data da ficha for pelo menos `ESUS_IDADE_IVCF`.
- Vacinação grava `CondicaoMaternal` com `ESUS_VAC_COND_MATERNAL_PUERPERA`, `GESTANTE` ou `NENHUMA`. O comentário no fonte diz que gestante/puérpera antigos foram descontinuados no LEDI 7.2+.
- Glicemia: se `ds_GlicemiaCapilar` vier nulo ou vazio, o tipo vai nulo; senão usa `cd_TipoGlicemiaCapilar` ou 3. `TipoGlicemiaCapilar` também cai em 3 nesse ramo.
- Inconsistência de gestante continua podendo ser gravada (`DESC_CAMPO = 'Gestante'`). O critério completo desse `if` não foi lido.

## Dados

O dfm do data module trocou o campo de INE no SQL: `ine.ds_CodigoINE as ds_INE` no lugar de `ine.ds_INE`. O `.pas` do data module não mudou de conteúdo.

## Interface

Não se aplica ao controller. O data module é de dados, sem tela.

## Dependências

Datasets do `Saude.Model.Esus.Integracao.DataModule`, constantes de `Saude.Controller.Consts` e tipos Thrift. Essas units de layout não foram documentadas.

## Cuidados ao alterar

Fonte Windows-1252. O `.pas` da integração é enorme. Reintroduzir a trava de CBO no encaminhamento diverge das telas, que agora aceitam CID ou CIAP. O dfm é Windows-1252; a alteração foi só o alias do INE.

## Alteração na revisão

Ajustes de INE, remoção da trava de CBO no encaminhamento, IVCF condicionado na FAP, condição maternal na vacina, tipo de glicemia e o alias `ds_CodigoINE` no dfm.

## Limites

Só foram lidos os trechos do diff (cerca de 171 linhas de diff, amostra das regras). O restante da unit e o SQL completo do data module não foram lidos. Há connection string ou comando longo no data module que não foi aberto.
