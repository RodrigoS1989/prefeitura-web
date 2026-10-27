---
unit: Prefeitura
projeto: Prefeitura
tipo: Projeto
fonte: Prefeitura\Prefeitura.dpr
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Prefeitura

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

Cobre `Prefeitura.dpr` e `Prefeitura.dproj`.

## Propósito

Programa principal da Prefeitura. Sobe o data module e o menu, ou, com parâmetro de modo, roda sem interface e pode gerar a produção e-SUS.

## Contexto de uso

Atalho ou agendador chama o executável com `-esus`, `-acs`, `-agendamento` ou `-sed`. O UpdateSocial devolve esses parâmetros ao relançar (`UPrincipal`).

## Superfície pública

Bloco inicial do `.dpr`. Unidades novas no uses:

- `Prefeitura.View.Frame.Esus.Inconsistencias`
- `Prefeitura.View.Form.EsusConfig`
- `Prefeitura.View.Form.EsusProducao`
- `Shared.Esus`

## Fluxo principal

1. `Util.CarregarModo`.
2. Se `MODO` é verdadeiro, o comentário do fonte chama isso de execução especial, sem interação, modo robô.
3. Abre conexão master e principal, carrega a empresa e define pastas.
4. Em máquina de desenvolvimento (`RANGE_USUARIO_DESENV`), a chave da empresa vem de `GetEmpresaProprietaria`. Nos demais, vem da pasta acima do executável.
5. Se `MODO_ESUS`, inicia o log e-SUS.
6. `Util.AtualizarUpdateSocial` e `Util.ChamarUpdateSocial`.
7. Se `MODO_ESUS`, `TEsus.GerarProducaoAPIInicializacao` e `Halt`.
8. Erro nesse modo grava log e `Halt(1)`.
9. Sem `MODO`, segue o caminho antigo: `Application.Initialize`, título "Carregando", cria `TModGeral` e `TME000`, e `Application.Run` se `strConecta = 'S'`.

## Regras de negócio

- Modo e-SUS não abre o menu. Gera a produção pela API e encerra (`Halt`).
- Falha crítica no modo e-SUS não mostra diálogo; grava `TEsus.GravarLogModoEsus` e sai com código 1.

## Dados

Conexão master (`tcMaster`) e principal (`tcPrincipal`). Há credencial na conexão do sistema; não é reproduzida aqui. Base usada nas chamadas do UpdateSocial: `DBAcessoSistemas`.

## Interface

Não se aplica ao ramo `MODO`. O ramo normal abre o menu `ME000`.

## Dependências

`Shared.Esus`, `Shared.Controller.Uteis`, `Shared.Controller.Consts`, `Saude.Controller.Consts`, `System.StrUtils`, `System.IOUtils`, `ADODB`.

O `.dproj` ganhou `DCCReference` de:

- `view\Prefeitura.View.Frame.Esus.Inconsistencias.pas` (`FrameEsusInconsistencias`)
- `view\Prefeitura.View.Form.EsusConfig.pas` (`FormEsusConfig`)
- `view\Prefeitura.View.Form.EsusProducao.pas` (`FormEsusProducao`)

Vários `<FormType>dfm</FormType>` foram removidos de referências que já existiam.

## Cuidados ao alterar

O `.dpr` é Windows-1252. Tirar o `Halt` depois de `GerarProducaoAPIInicializacao` deixa o processo seguir para a interface no modo robô. O `.dproj` precisa das três referências alinhadas ao uses.

## Alteração na revisão

Uses qualificado (`Vcl.Forms`, `Winapi.Windows`, `System.SysUtils`), units do e-SUS e o ramo `MODO` antes do `Application.Initialize`.

## Limites

`GerarProducaoAPIInicializacao` está em `Shared.Esus` e o corpo não foi lido. Não foi conferido o que `AtualizarUpdateSocial` faz por dentro.
