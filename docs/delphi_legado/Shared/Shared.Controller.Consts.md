---
unit: Shared.Controller.Consts
projeto: Shared
tipo: Controller
fonte: Shared\controller\Shared.Controller.Consts.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Shared.Controller.Consts

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Constantes e variáveis globais compartilhadas. Nesta revisão entrou o modo de execução automática (robô) por parâmetro de linha de comando.

## Contexto de uso

`TUtil.CarregarModo` preenche os flags. `Prefeitura.dpr` e `UPrincipal` leem `MODO`, `MODO_ESUS` e `ESUS_COMPETENCIA`.

## Superfície pública

Novos nesta revisão:

- `MODO: Boolean` — verdadeiro se qualquer modo automático estiver ligado.
- `MODO_ESUS`, `MODO_ACS`, `MODO_AGENDAMENTO`, `MODO_SED: Boolean`.
- `ESUS_COMPETENCIA: string` — competência `YYYYMM` opcional do `-esus`. Vazio significa a competência atual.
- `INIT_ESUS = '-esus'`, `INIT_ACS = '-acs'`, `INIT_AGENDAMENTO = '-agendamento'`, `INIT_SED = '-sed'`.

O restante das constantes da unit não foi transcrito (cerca de 602 linhas).

## Fluxo principal

1. O executável sobe e `CarregarModo` compara `ParamStr` com `INIT_*`.
2. Um parâmetro `-YYYYMM` válido preenche `ESUS_COMPETENCIA`.
3. Quem relança o processo (`UPrincipal`, `ChamarUpdateSocial`) devolve os mesmos `INIT_*`.

## Regras de negócio

- `MODO_AGENDAMENTO` é o envio de notificações de agendamento (comentário no fonte).
- Competência do e-SUS só é aceita como seis dígitos `AAAAMM`, mês 1 a 12, ano 2000 a 2100 (`EhCompetenciaEsus` em `TUtil.CarregarModo`).

## Dados

Não se aplica.

## Interface

Não se aplica. Unit sem form.

## Dependências

Lida por `Shared.Controller.Uteis`, `Prefeitura.dpr` e `UpdateSocial\UPrincipal`.

## Cuidados ao alterar

Fonte Windows-1252. Renomear `INIT_ESUS` sem ajustar `UPrincipal` e `CarregarModo` quebra o modo robô.

## Alteração na revisão

Incluídos os flags `MODO*`, `ESUS_COMPETENCIA` e as constantes `INIT_*`.

## Limites

As constantes que já existiam na unit não foram listadas.
