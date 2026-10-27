---
unit: Shared.Esus
projeto: Shared
tipo: Unit
fonte: Shared\src\Shared.Esus.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Shared.Esus

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Controla a produção e-SUS PEC/LEDI: valida fichas, gera o transporte serializado, grava ZIP ou envia para a API do e-SUS. É a unit nova desta revisão (cerca de 11014 linhas). As units de layout Thrift são dependência e não estão documentadas à parte.

## Contexto de uso

- `TFormEsusProducao.btGerarClick` chama `EnviarProducaoApiLote` ou o fluxo de arquivo.
- Telas de ficha e o Prontuário chamam `TEsus.NovoControlador.EnviarFichaApi`.
- `Prefeitura.dpr`, com parâmetro `-esus`, chama `TEsus.GerarProducaoAPIInicializacao`.
- `TFrameEsusInconsistencias` usa `FormatEsusApiErroValidacao` e `TEsusTipoFicha`.

## Superfície pública

Tipos:

- `TEsusTipoFicha` — `etfFAP` 1, `etfFAV` 2, `etfFAI` 3, `etfFAO` 4, `etfFAC` 5, `etfCadDom` 6, `etfCadInd` 7, `etfFAM` 8, `etfFAE` 9, `etfFAD` 10, `etfFCZ` 11, `etfVAC` 12, `etfFCC` 13.
- `TEsusTipoFichaHelper` — `ToInteger`, `ToName`, `ToAbrev`, `GetProcName`, `GetAlias`, `GetTable`, `GetFieldCode`.
- `TEsusConfig` — lote, pasta, operador, tipos de ficha, unidade e equipamento.
- `TEsusProducaoResultado` — sucesso, totais, caminho do ZIP e mensagem de erro.
- `IEsusProducao` — contrato do controlador.

`TEsus`:

- `class function NovoControlador: IEsusProducao`
- `class procedure GerarProducaoAPIInicializacao(ASistema: ISistema)`
- `class function CaminhoLogModoEsus: string`
- `class procedure IniciarLogModoEsus`
- `class procedure GravarLogModoEsus(const AMensagem: string)`

`IEsusProducao` / `TEsusProducao`:

- `SetConfig`, `SetOnLog`, `SetOnProgresso`, `SetOnProgressoFicha`
- `ValidarFichas` — stored procedure `sp_ValidaEsusXXX`; preenche `tb_EsusProducaoFichas` com as fichas válidas do GUID do lote
- `ValidarFichasRelatorio`
- `GerarArquivos` — Thrift, ZIP e log das fichas já validadas
- `MarcarFichasEnviadas` — `fl_Envio = 1` na tabela de cada ficha
- `GetFichasGeradas`
- `GerarFichaSerializada` — um transporte, sem ZIP; vazio se falhar `sp_ValidaEsusFichaApi`
- `EnviarFichaApi` — uma ficha ainda pendente (`fl_Envio` 0, nulo ou N); não propaga exceção
- `EnvioAutomaticoAtivo` — lê `ARQ000.fl_EsusApiEnvioAutomatico`
- `EnviarProducaoApi` — lote das pendentes da competência; se `AExigirEnvioAutomatico` for verdadeiro, não faz nada com o flag desligado
- `EnviarProducaoApiLote` — lote da PM1047 / modo `-esus`: valida e serializa por tipo, HTTP sequencial, persiste sucessos e inconsistências só no fim

`TEsusApiClient` fala com a API (credenciais, envio, log, inconsistência). `TEsusApiLog` estende `TLogWebservice`.

## Fluxo principal

1. A tela ou o modo `-esus` monta `TEsusConfig` (competência, tipos, pasta, operador).
2. `ValidarFichas` chama a procedure de validação do tipo e guarda as fichas válidas.
3. Geração de arquivo: `GerarArquivos` monta o transporte de cada tipo (`GerarFichasFAP`, `FAI`, `FAO`, `FAD`, `FAV`, `FAC`, `FAM`, `FAE`, `FCZ`, `CadDom`, `CadInd`), compacta ZIP e marca envio.
4. Geração por API em lote: `EnviarProducaoApiLote` serializa, envia e só então grava sucesso e inconsistência.
5. Envio de uma ficha salva na tela: `EnviarFichaApi`. Falha vai para `tb_EsusAPILog` / `tb_EsusInconsistencia`.

## Regras de negócio

- `EnviarFichaApi` só envia ficha pendente e engole a exceção (`IEsusProducao`).
- `EnvioAutomaticoAtivo` depende de `ARQ000.fl_EsusApiEnvioAutomatico`.
- `EnviarProducaoApiLote` é o caminho da PM1047 e do parâmetro `-esus`. A tela chama com `AExigirEnvioAutomatico = False`.
- CPF do cidadão entra no transporte pelas sobrecargas `AplicarCpfThrift` quando o CPF está preenchido.
- INE vazio não é enviado no finalizador da observação (regra também ajustada na unit de integração).
- IVCF na ficha de procedimentos só entra se não for escuta inicial, houver data de nascimento e idade em `ESUS_IDADE_IVCF` (60).
- Vacinação usa `condicaoMaternal` (`ESUS_VAC_COND_MATERNAL_NENHUMA`, `GESTANTE`, `PUERPERA`). Gestante e puérpera como flags antigas foram descontinuados no comentário do código de integração (LEDI 7.2+).

## Dados

- Validação: procedures `sp_ValidaEsusXXX` e `sp_ValidaEsusFichaApi`; tabela `tb_EsusProducaoFichas`.
- Lote: `vw_EsusLote` (`nr_Lote`), competência em `tb_Competencia`.
- Envio: `fl_Envio` na tabela devolvida por `TEsusTipoFicha.GetTable` / `GetFieldCode`.
- API: credenciais (usuário, senha e URL) lidas pelo client; log em `tb_EsusAPILog`; inconsistência em `tb_EsusInconsistencia` (`fl_API`).
- A senha e a URL existem em `CarregarCredenciais`. Os valores não são documentados.

## Interface

Não se aplica. Unit sem form. A PM1047 é `TFormEsusProducao`.

## Dependências

ADO, Indy HTTP/SSL, Thrift e os layouts `br.gov.saude.esusab.ras.*` e `dadotransp`. Implementação usa `Shared.Controller.Globais`, `Helpers`, `Tipos`, `Consts` e `Saude.Controller.Consts` / `Globais`.

## Cuidados ao alterar

Fonte Windows-1252. A unit é o núcleo da geração LEDI e da API. Mudar `GetTable` / `GetFieldCode` quebra a aba de inconsistências e o envio por ficha. `EnviarFichaApi` é chamado depois do commit em outra conexão (`UME002`); chamar dentro da transação da tela não enxerga a ficha. Não documentar nem colar credencial da API.

## Alteração na revisão

Arquivo adicionado no trunk, copiado da branch da OS 59513. `Shared.dpr` e `Shared.dproj` passaram a referenciar `src\Shared.Esus.pas`.

## Limites

Os montadores Thrift de cada ficha não foram lidos método a método. O corpo de `GerarProducaoAPIInicializacao`, `EnviarFichaApi` e `EnviarProducaoApiLote` não foi extraído; as regras acima vêm dos comentários da interface e do esqueleto. Layouts Thrift ficaram de fora.
