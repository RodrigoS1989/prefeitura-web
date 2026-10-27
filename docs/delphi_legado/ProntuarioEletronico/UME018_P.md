---
unit: UME018_P
projeto: ProntuarioEletronico
tipo: Form
fonte: ProntuarioEletronico\Forms\UME018_P.pas
dfm: ProntuarioEletronico\Forms\UME018_P.dfm
revisao: r14853
atualizado: 2026-10-07
---

# UME018_P

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Protocolo da guia. Caption: "ME018 - Protocolo". Classe `TME018_P`.

## Contexto de uso

Aberto junto da guia de especialidade. O chamador não foi lido.

## Superfície pública

Não houve método novo. Mudou visibilidade de CID/CIAP, a replicação e a validação.

## Fluxo principal

1. `pnCiap` e `pnCid` ficam visíveis.
2. Na confirmação, se os dois códigos estiverem vazios, `Util.Msg.Info` pede CID ou CIAP e foca `btPesquisaCid`.
3. A replicação do protocolo não olha mais o CBO.

## Regras de negócio

- CID e CIAP aparecem juntos. Saiu o `IIf` que mostrava só um deles conforme `ValidaCboInformeCid`.
- `ValidaCboInformeCid` fica `True` sem chamar `ValidaCboCid10FAI`.
- Saiu o aviso que impedia replicar protocolo com CIAP quando o usuário atual informa CID.
- Mensagem atual: "Informe o CID ou o CIAP." (`Util.Msg.Info`).

## Dados

`edCodigoCid`, `edCodigoCiap`, `edNumeroGuia`. Sem SQL novo.

## Interface

- `ME018_P` — caption "ME018 - Protocolo".
- `pnCid`, `pnCiap`, `btPesquisaCid`.

## Dependências

`Shared.Controller.Helpers` ou a unit de `Util.Msg` já usada no projeto. `SaudeUtil.Esus` saiu desse teste.

## Cuidados ao alterar

Fonte Windows-1252. A unit tem cerca de 2283 linhas. A mesma regra está na ME018 e na PM474.

## Alteração na revisão

Painéis CID e CIAP sempre visíveis, validação "CID ou CIAP" e fim da trava de replicação por CBO.

## Limites

O método que atribui `Visible` não foi nomeado. O dfm não mudou de conteúdo.
