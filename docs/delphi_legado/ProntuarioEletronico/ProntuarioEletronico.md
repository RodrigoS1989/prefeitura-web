---
unit: ProntuarioEletronico
projeto: ProntuarioEletronico
tipo: Projeto
fonte: ProntuarioEletronico\ProntuarioEletronico.dpr
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# ProntuarioEletronico

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

Cobre `ProntuarioEletronico.dpr` e `ProntuarioEletronico.dproj`.

## Propósito

Programa do prontuário eletrônico. Nesta revisão passou a embutir as DLLs do OpenSSL e a enxergar as pastas Thrift do e-SUS no search path.

## Contexto de uso

O atendimento (`UME002`) envia fichas por HTTPS. O recurso OpenSSL é o que `Shared.Controller.Recurso` extrai para `PASTA_OPENSSL`.

## Superfície pública

- `{$R 'OpenSSL.res' '..\Resources\OpenSSL.rc'}` no `.dpr`, ao lado do recurso do assinador que já existia.
- `DCC_UnitSearchPath` do `.dproj` ganhou as pastas Thrift.
- `RcCompile` de `..\Resources\OpenSSL.rc` com form `OpenSSL.res`.

## Fluxo principal

1. O compilador liga `OpenSSL.res` no executável.
2. Na execução, o carregamento de recurso copia `libeay32.dll` e `ssleay32.dll` se ainda não estiverem na pasta.
3. O search path permite compilar os layouts `br.gov.saude.esusab.*` usados por `Shared.Esus`.

## Regras de negócio

Não se aplica ao projeto. O envio da ficha está em `UME002` e `Shared.Esus`.

## Dados

Não se aplica.

## Interface

Não se aplica.

## Dependências

Pastas acrescentadas ao search path:

- `..\Shared\controller\saude\esus\integracao\thrift\src`
- `..\Shared\controller\saude\esus\integracao\thrift\layouts\camada-transport`
- `..\Shared\controller\saude\esus\integracao\thrift\layouts\cidadao`
- `..\Shared\controller\saude\esus\integracao\thrift\layouts\ras`

Recurso: `..\Resources\OpenSSL.rc`.

## Cuidados ao alterar

O `.dpr` é Windows-1252. Remover o `{$R}` sem remover o `RcCompile` (ou o inverso) deixa o projeto sem o recurso que a API precisa. As units Thrift em si não foram documentadas.

## Alteração na revisão

Recurso OpenSSL no `.dpr` e no `.dproj`, e o search path das pastas Thrift.

## Limites

Não foi lido o conteúdo de `OpenSSL.rc`. O restante do `.dpr` (cerca de 168 linhas) não foi listado.
