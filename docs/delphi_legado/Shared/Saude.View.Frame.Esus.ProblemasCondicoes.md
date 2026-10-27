---
unit: Saude.View.Frame.Esus.ProblemasCondicoes
projeto: Shared
tipo: Frame
fonte: Shared\view\saude\Saude.View.Frame.Esus.ProblemasCondicoes.pas
dfm: Shared\view\saude\Saude.View.Frame.Esus.ProblemasCondicoes.dfm
revisao: r14853
atualizado: 2026-10-07
---

# Saude.View.Frame.Esus.ProblemasCondicoes

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Frame de problemas e condições (CIAP, CID e lista ABP) usado nas fichas e-SUS. A revisão passou a marcar o item AB pelo código do CIAP, e não pela descrição.

## Contexto de uso

Herdado por `TFrameProblemasCondicoesProntuario` no Prontuário. Também entra nas fichas da Prefeitura (PM123 e outras). Os pontos de criação não foram todos rastreados.

## Superfície pública

- `function AtualizarProblemaCondicaoAbp(const ACodigoCiap: string; AIncluir: Boolean): Boolean` — inclui ou remove o problema ABP. Antes recebia a descrição e era procedure.
- `procedure MarcarAB(ACiapCodigo: String)`
- `function ResolverCiapAbp(const ACodigoAbp: string): string`
- `function DescricaoCiap(const ACodigo: string): string`
- `procedure LimparCheckListAbp`
- Classe auxiliar `TCiapDado` com a property `Codigo`.

## Fluxo principal

1. Ao sincronizar a grade, se o tipo da ficha for `eftpFai`, chama `MarcarAB` com `ds_CiapCodigo`.
2. `AtualizarProblemaCondicaoAbp` localiza o ABP em `FCiapsAbp` pelo campo `ds_CodigoCiap`.
3. Na exclusão, `ResolverCiapAbp` acha o CIAP vinculado e apaga o registro da grade por `ds_CiapCodigo`.

## Regras de negócio

- A lista ABP é localizada por código (`ds_CodigoCiap`), não por `ds_Ciap`.
- Se `FCiapsAbp` for nulo ou o código não existir, a função sai com `Result = True`.
- O frame do Prontuário, ao mudar o tipo para FAO ou FAD, remove CIAPs cuja exibição começa com `AB`.

## Dados

`FCiapsAbp` (campos `ds_CodigoCiap`, `ds_Ciap` e vínculos). Grade `cdsProblemas` com `ds_CiapCodigo` e `ds_CiapExibicao`. O SQL que popula `FCiapsAbp` não foi lido neste frame.

## Interface

O dfm herdado tem `CheckListAbp`, abas de CIAP/CID, `rgSituacao`, datas e `gridProblemas`. Posição e fonte não importam. O caption do frame no esqueleto veio vazio.

## Dependências

`Saude.Controller.Tipos` (`TEsusFichaTipo`, `eftpFai`). O frame do Prontuário está em `Prontuario.View.Frame.Esus.ProblemasCondicoes`.

## Cuidados ao alterar

Fonte Windows-1252. A assinatura de `AtualizarProblemaCondicaoAbp` mudou de descrição para código e passou a ser função. Quem ainda passa a descrição não compila. O frame tem cerca de 1174 linhas.

## Alteração na revisão

Novo `TCiapDado`, métodos `MarcarAB`, `ResolverCiapAbp`, `DescricaoCiap` e `LimparCheckListAbp`, e a troca da chave do ABP para `ds_CodigoCiap`.

## Limites

O corpo completo de `ResolverCiapAbp` (vínculo por sexo) não foi lido até o fim. O dfm não mudou de conteúdo nesta revisão; só o `.pas`.
