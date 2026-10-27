---
unit: Shared.Controller.Uteis
projeto: Shared
tipo: Controller
fonte: Shared\controller\Shared.Controller.Uteis.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Shared.Controller.Uteis

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Utilitários gerais (`TUtil` e `TVersao`). Nesta revisão passaram a reconhecer o modo automático e a chamar o UpdateSocial antes do robô.

## Contexto de uso

`Prefeitura.dpr` chama `Util.CarregarModo`, `Util.AtualizarUpdateSocial` e `Util.ChamarUpdateSocial` quando `MODO` é verdadeiro. `UPrincipal` também chama `CarregarModo`.

## Superfície pública

Incluídos ou ajustados na r14853:

- `class procedure TUtil.CarregarModo` — lê a linha de comando e liga `MODO_*`.
- `class procedure TUtil.ChamarUpdateSocial(ASistema, ABaseDados, ACaminhoComponentes, ANomeEmpresaFornecedora)` — abre o atualizador repassando os `INIT_*`.
- `class procedure TUtil.AtualizarUpdateSocial(ASistema, ABaseDados, ACaminhoComponentes)` — verifica se o executável precisa atualizar antes.
- `class function TUtil.GetEmpresaProprietaria(ABaseDados: String): String`.
- `TVersao.GetFileVersion` ganhou overload sem nome de arquivo (`Int64`) e `GetFileVersionFormated`.

## Fluxo principal

1. `CarregarModo` percorre `ParamStr`.
2. `-esus`, `-acs`, `-agendamento` e `-sed` ligam o flag correspondente.
3. Um parâmetro `-YYYYMM` válido (função interna `EhCompetenciaEsus`) grava `ESUS_COMPETENCIA`.
4. `MODO` fica verdadeiro se qualquer flag estiver ligado.
5. No Prefeitura em modo automático, primeiro `AtualizarUpdateSocial`, depois `ChamarUpdateSocial`, e só então a produção e-SUS.

## Regras de negócio

- `EhCompetenciaEsus`: tamanho 7, começa com `-`, seis dígitos, mês de 1 a 12, ano de 2000 a 2100.
- `ChamarUpdateSocial` acrescenta à linha de comando só os modos que estiverem ligados, inclusive `INIT_ESUS`.

## Dados

`GetEmpresaProprietaria` usa a base informada. O SQL não foi lido.

## Interface

Não se aplica. Unit sem form.

## Dependências

`ADODB` entrou na uses. Flags em `Shared.Controller.Consts`.

## Cuidados ao alterar

Fonte Windows-1252. A unit tem cerca de 2396 linhas. Mudar a regra de `EhCompetenciaEsus` muda qual competência o modo `-esus` processa.

## Alteração na revisão

Entraram `CarregarModo`, `ChamarUpdateSocial`, `AtualizarUpdateSocial`, `GetEmpresaProprietaria` e os overloads de versão de arquivo.

## Limites

O corpo de `AtualizarUpdateSocial`, `GetEmpresaProprietaria` e dos overloads de versão não foi lido por inteiro. Só o diff e as assinaturas.
