---
unit: Prefeitura.View.Form.EsusProducao
projeto: Prefeitura
tipo: Form
fonte: Prefeitura\view\Prefeitura.View.Form.EsusProducao.pas
dfm: Prefeitura\view\Prefeitura.View.Form.EsusProducao.dfm
revisao: r14853
atualizado: 2026-10-07
---

# Prefeitura.View.Form.EsusProducao

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

PM1047, geração de arquivos do e-SUS. O usuário escolhe competência, tipos de ficha e destino (pasta ou API) e dispara a produção por `IEsusProducao`.

## Contexto de uso

`UME000` abre este form quando `GetUsaValidacaoSqlEsus` é verdadeiro. Caso contrário abre a PM134. Há também `ModoRelatorio` para impressão de inconsistências.

## Superfície pública

- `constructor Create(AOwner: TComponent)`
- `property ModoRelatorio: Boolean`
- `btGerarClick` — gera arquivo ou envia o lote
- `ValidarTela`, `MontarConfig`, `DestinoApi` — usados por esse botão

Outros métodos privados: carga de tipo de ficha, competência e pasta, SQL de inconsistências, progresso e log.

## Fluxo principal

1. `FormShow` carrega tipos, competência atual e pasta.
2. `ValidarTela` exige o que `ValidarTelaImpressao` pede. Destino API dispensa pasta. Destino arquivo exige pasta e tenta criá-la.
3. `btGerarClick` pede confirmação: o processo não pode ser parado.
4. `MontarConfig` gera o GUID do lote, lê `nr_Lote` de `vw_EsusLote`, competência do combo, operador, unidade e equipamento, e os tipos marcados. `CodFicha` fica 0.
5. Se o destino for API (`rgDestino.ItemIndex = 1`), chama `EnviarProducaoApiLote(LConfig, False)`.
6. Sucesso mostra enviadas, falhas e inconsistências. Se houver inconsistência, abre o relatório sem exigir mensagem de "sem registro".
7. O ramo de geração de arquivo (ZIP) continua no mesmo `btGerarClick`; o corpo depois do bloco da API não foi extraído.

## Regras de negócio

- API não exige pasta (`ValidarTela` / `DestinoApi`).
- Competência inexistente no dataset dispara "Competência Não encontrada." (`MontarConfig`).
- `EnviarProducaoApiLote` é chamado com `AExigirEnvioAutomatico = False`: a tela envia mesmo com o flag de envio automático desligado.
- Botões e o painel de seleção ficam desabilitados durante o processo.

## Dados

- `tb_Competencia`: `cd_Sequencia`, `ds_Competencia`, `dt_Inicial`, `dt_Final`.
- `vw_EsusLote.nr_Lote`.
- `cdsTipoFicha`: `cd_TipoFicha`, `ds_TipoFicha`, `cd_EsusTipoFicha`, `fl_Marcado`.
- Inconsistências: métodos `MontarSqlInconsistencias`, `PossuiInconsistencias`, `ContarInconsistencias`. O SQL não foi colado.

## Interface

Caption: "PM1047 - Geração de arquivos do e-SUS". Herda `TFormPrefeitura`.

- `dblCompetencia` (`TJvDBLookupCombo`), `btPesquisaCompetencia`
- `GradeTipoFicha`, `chbTodos`
- `rgDestino` — item 1 é API
- `edPastaDestino`, `btPesquisaPasta`
- `btGerar`, `btInconsistencias`, `btSair`
- `pbProgresso`, `lbStatusExportacao`, `memoLog`

## Dependências

`Shared.Esus`, `UModGeral`, `UFuncao`, `UFuncaoAtualizaArquivos`, `UPM134R`, `UPM564`, globais de saúde e prefeitura.

## Cuidados ao alterar

Fonte Windows-1252. `EnviarProducaoApiLote` com o segundo parâmetro verdadeiro passa a obedecer `fl_EsusApiEnvioAutomatico` e a tela pode não enviar nada. O form tem cerca de 867 linhas.

## Alteração na revisão

Unit e dfm adicionados e registrados no `.dpr` e no `.dproj`.

## Limites

O ramo de ZIP dentro de `btGerarClick` (depois da linha do envio API) não foi extraído. `ValidarTela` foi lido até a criação da pasta; o retorno verdadeiro final não apareceu no extrato. `CarregarTipoFicha` não foi lido.
