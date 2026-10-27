---
unit: Prontuario.View.Frame.Esus.ProblemasCondicoes
projeto: ProntuarioEletronico
tipo: Frame
fonte: ProntuarioEletronico\view\esus\Prontuario.View.Frame.Esus.ProblemasCondicoes.pas
dfm: ProntuarioEletronico\view\esus\Prontuario.View.Frame.Esus.ProblemasCondicoes.dfm
revisao: r14853
atualizado: 2026-10-07
---

# Prontuario.View.Frame.Esus.ProblemasCondicoes

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Especialização, no prontuário, do frame de problemas e condições. Classe `TFrameProblemasCondicoesProntuario`, herda `TFrameEsusProblemasCondicoes`. Ajusta a lista AB conforme o tipo da ficha.

## Contexto de uso

Usado nas fichas do prontuário (FAI, FAO, FAD). O form que cria o frame não foi lido. O frame base está em `Saude.View.Frame.Esus.ProblemasCondicoes`.

## Superfície pública

- `procedure AtualizarTipoFicha(const AFichaTipo: TEsusFichaTipo)`
- `procedure ModoVisualizacao`
- `procedure SetTipoFicha(const AValue: TEsusFichaTipo)` — override
- `procedure RemoverCiapsAB` — privado

## Fluxo principal

1. `SetTipoFicha` chama o herdado.
2. Se o tipo for `eftpFai`, `SyncGridCheckList`.
3. Se for `eftpFao` ou `eftpFad`, `RemoverCiapsAB`.
4. `RemoverCiapsAB` percorre `cdsProblemas` e apaga a linha cuja `ds_CiapExibicao` começa com `AB`. No fim, `CheckListAbp.UncheckAll`.

## Regras de negócio

- Ficha odontológica e atendimento domiciliar não mantêm CIAP de atenção básica (prefixo `AB`) na grade.
- Ficha de atendimento individual sincroniza o checklist com a grade (`SyncGridCheckList`, método do frame base).

## Dados

`cdsProblemas.ds_CiapExibicao`. Sem SQL nesta unit.

## Interface

Labels "Situação" (`Label2`) e o título de `Label3` (caption vazio no esqueleto). O restante é herdado: `CheckListAbp`, `rgSituacao`, `FrameCiap`, `FrameCid`, `gridProblemas`. O dfm não mudou de conteúdo; só o `.pas`.

## Dependências

`Saude.View.Frame.Esus.ProblemasCondicoes`, `Shared.Controller.Helpers`, `Saude.Controller.Tipos`.

## Cuidados ao alterar

Fonte Windows-1252. A unit é pequena (cerca de 85 linhas). `RemoverCiapsAB` apaga registros do client dataset; chamar de novo num tipo FAI some problemas que a FAI deveria manter.

## Alteração na revisão

`RemoverCiapsAB`, override de `SetTipoFicha` e a uses de `Shared.Controller.Helpers`.

## Limites

`AtualizarTipoFicha` e `ModoVisualizacao` não tiveram o corpo extraído. `SyncGridCheckList` está no frame base e não foi lido.
