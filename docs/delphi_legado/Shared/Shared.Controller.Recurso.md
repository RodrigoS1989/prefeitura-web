---
unit: Shared.Controller.Recurso
projeto: Shared
tipo: Controller
fonte: Shared\controller\Shared.Controller.Recurso.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Shared.Controller.Recurso

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Carrega recursos embutidos no executável (scripts e DLLs, entre eles OpenSSL) para a pasta de trabalho.

## Contexto de uso

Chamado na subida dos sistemas que usam recurso RCDATA e HTTPS. O método exato não foi nomeado além do diff. O Prontuário passou a linkar `OpenSSL.rc` na mesma revisão.

## Superfície pública

O fluxo localiza o recurso, copia para stream e configura o caminho do OpenSSL (`IdOpenSSLSetLibPath(PASTA_OPENSSL)`). A assinatura pública completa não foi transcrita.

## Fluxo principal

1. Procura o recurso em `MainInstance`.
2. Se não achar, procura em `HInstance`.
3. Cria `TResourceStream` nesse módulo e copia para o stream.
4. Reposiciona o stream em 0 antes de carregar.
5. Se as DLLs `libeay32.dll` e `ssleay32.dll` já existirem em `PASTA_OPENSSL`, não extrai de novo.

## Regras de negócio

- O módulo do executável (`MainInstance`) tem prioridade sobre `HInstance`, porque a unit Shared pode estar noutro módulo (`FindResource`).
- `SaveToStream` deixa a posição no fim; sem `Position := 0` o carregamento lê zero bytes.
- Se `Recursos.Count > 0`, o método sai antes de repetir a extração.

## Dados

Não se aplica. Lê recurso do executável, não tabela.

## Interface

Não se aplica. Unit sem form.

## Dependências

`SysInit` deixou de ser a origem do handle. Indy OpenSSL (`IdOpenSSLSetLibPath`). `Util.Arquivo.Exists`.

## Cuidados ao alterar

Fonte Windows-1252. Voltar a usar só `HInstance` faz o recurso não ser achado quando o Shared não é o módulo principal. Não remover o reset da posição do stream.

## Alteração na revisão

Troca de `SysInit.HInstance` por `MainInstance` com fallback, reset do stream e saída antecipada quando as DLLs do OpenSSL já estão na pasta.

## Limites

O método que contém esse trecho não foi nomeado na leitura. A unit tem cerca de 313 linhas; o restante não foi transcrito.
