---
unit: Prefeitura.Controller.Fabrica
projeto: Prefeitura
tipo: Controller
fonte: Prefeitura\controller\Prefeitura.Controller.Fabrica.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Prefeitura.Controller.Fabrica

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Fábrica de telas e relatórios da Prefeitura (`TPrefeituraFabricaView`, `TPrefeituraFabricaReport`). Abre cada form em modal e libera no fim.

## Contexto de uso

A PM483 chama `conFabricaPrefeitura.View.FormEsusConfig` no clique do botão e-SUS. Os outros `Form*` já existiam; a unit tem cerca de 1110 linhas.

## Superfície pública

Novo nesta revisão:

- `class procedure TPrefeituraFabricaView.FormEsusConfig` — cria `TFormEsusConfig`, `ShowModal`, `Util.Liberar`.

Há dezenas de outros `class procedure Form...` (RNDS, BNAFAR, vacina, relatórios). Não foram listados.

## Fluxo principal

1. O chamador pede `FormEsusConfig`.
2. O form abre modal.
3. Ao fechar, é liberado.

## Regras de negócio

Não se aplica além de abrir a PM1052. As regras de gravação estão em `Prefeitura.View.Form.EsusConfig`.

## Dados

Não se aplica.

## Interface

Não se aplica. A tela aberta é a PM1052.

## Dependências

`Prefeitura.View.Form.EsusConfig`.

## Cuidados ao alterar

Fonte Windows-1252. `Util.Liberar` precisa permanecer no `finally` para não vazar o form.

## Alteração na revisão

Uses, declaração e corpo de `FormEsusConfig`.

## Limites

O catálogo das outras telas da fábrica não foi transcrito.
