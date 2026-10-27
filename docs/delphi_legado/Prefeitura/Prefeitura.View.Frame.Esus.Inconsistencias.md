---
unit: Prefeitura.View.Frame.Esus.Inconsistencias
projeto: Prefeitura
tipo: Frame
fonte: Prefeitura\view\Prefeitura.View.Frame.Esus.Inconsistencias.pas
dfm: Prefeitura\view\Prefeitura.View.Frame.Esus.Inconsistencias.dfm
revisao: r14853
atualizado: 2026-10-07
---

# Prefeitura.View.Frame.Esus.Inconsistencias

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Mostra as inconsistências de uma ficha e-SUS num memo. Separa o que foi gerado localmente do que voltou da API.

## Contexto de uso

Cada ficha da revisão cria `TFrameEsusInconsistencias`, coloca o frame em `tbsInconsistencias` com `Align = alClient` e chama `Carregar` ao abrir a ficha. `Limpar` roda ao limpar a tela. As fichas estão listadas no documento de cada PM.

## Superfície pública

- `procedure Carregar(ACodigoFicha, ATipoFicha: Integer; ADataFicha: TDateTime; AExportada: Boolean)`
- `procedure Limpar`

## Fluxo principal

1. `Carregar` chama `Limpar`. Se `ACodigoFicha <= 0`, sai.
2. Consulta `tb_EsusInconsistencia` da ficha, do tipo e da competência que contém `ADataFicha`.
3. Se `AExportada` for verdadeiro, o SQL fica só com `fl_API = 1`.
4. Linha local: `ds_Campo: ds_Inconsistencia`.
5. Linha de API: `FormatEsusApiErroValidacao` sobre `ds_Inconsistencia`, agrupada depois do separador `--- Inconsistências da API ---`.

## Regras de negócio

- Ficha já exportada mostra só inconsistência de API (`AExportada`).
- Ordem: `ISNULL(fl_API, 0)`, depois `cd_Inconsistencia`.
- A competência é a de `tb_Competencia` em que a data da ficha está entre `dt_Inicial` e `dt_Final`.

## Dados

`tb_EsusInconsistencia` (`ds_Campo`, `ds_Inconsistencia`, `fl_API`, `cd_Ficha`, `cd_TipoFicha`, `cd_Competencia`, `cd_Inconsistencia`) e `tb_Competencia` (`cd_Sequencia`, `dt_Inicial`, `dt_Final`). Acesso por `conFabrica.Model.IntfDao.Consultar`.

## Interface

- `memoInconsistencias: TMemo` — único controle do frame.

## Dependências

`Shared.Controller.Uteis`, `Shared.Controller.Globais`, `Shared.Esus` (`FormatEsusApiErroValidacao`, `TEsusTipoFicha`).

## Cuidados ao alterar

Fonte Windows-1252. O frame é criado em código nas fichas; mudar a assinatura de `Carregar` quebra todas as PM que ganharam a aba. O ícone da aba (índice 37) fica na tela, não aqui: a tela olha `memoInconsistencias.Lines.Count`.

## Alteração na revisão

Unit e dfm adicionados no trunk, copiados da branch da OS 59513. Registrados no `.dpr` e no `.dproj`.

## Limites

`FormatEsusApiErroValidacao` está em `Shared.Esus` e o corpo não foi lido.
