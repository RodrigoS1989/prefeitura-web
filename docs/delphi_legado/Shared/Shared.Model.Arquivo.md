---
unit: Shared.Model.Arquivo
projeto: Shared
tipo: Model
fonte: Shared\model\Shared.Model.Arquivo.pas
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Shared.Model.Arquivo

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Representa um arquivo em memória (`FBytesStream`) para leitura e gravação no sistema.

## Contexto de uso

Usado por fluxos que carregam bytes de arquivo. O chamador desta revisão não foi identificado; o diff é de uma linha.

## Superfície pública

O teste de conteúdo vazio do stream. O nome do método não aparece no diff, só a expressão de `Result`.

## Fluxo principal

1. O arquivo é carregado em `FBytesStream`.
2. A checagem de vazio consulta o tamanho do stream.

## Regras de negócio

- Arquivo vazio é `FBytesStream.Size = 0`, e não mais `Length(FBytesStream.Bytes) = 0`.

## Dados

Não se aplica. Bytes em memória.

## Interface

Não se aplica. Unit sem form.

## Dependências

Não alteradas no diff. A unit tem cerca de 662 linhas.

## Cuidados ao alterar

Fonte Windows-1252. `Length(Bytes)` pode não refletir o tamanho real do stream; a revisão trocou de propósito para `Size`.

## Alteração na revisão

Uma linha: `Result := FBytesStream.Size = 0`.

## Limites

O nome do método e o restante da classe não foram lidos.
