---
unit: Shared
projeto: Shared
tipo: Projeto
fonte: Shared\Shared.dpr
dfm: Não se aplica
revisao: r14853
atualizado: 2026-10-07
---

# Shared

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

Cobre `Shared.dpr` e `Shared.dproj`.

## Propósito

Projeto das units compartilhadas (controllers, models e views de saúde e outros módulos). O executável de Shared referencia as units; os sistemas Prefeitura e Prontuário compilam contra essa pasta.

## Contexto de uso

A r14853 incluiu `Shared.Esus` no programa e no projeto para a unit passar a fazer parte do pacote Shared.

## Superfície pública

- `Shared.dpr` lista as units do programa.
- `Shared.dproj` lista `DCCReference` de cada unit.

## Fluxo principal

1. O projeto compila `src\Shared.Esus.pas` junto com as demais units.
2. Quem usa o pacote enxerga `TEsus`, `TEsusTipoFicha` e a API de produção.

## Regras de negócio

Não se aplica ao projeto em si. As regras estão em `Shared.Esus`.

## Dados

Não se aplica.

## Interface

Não se aplica. Projeto sem tela própria nesta alteração.

## Dependências

Unit nova: `Shared.Esus in 'src\Shared.Esus.pas'`.

## Cuidados ao alterar

O `.dpr` é Windows-1252. O `.dproj` é XML. Tirar o `DCCReference` sem tirar o `uses` do `.dpr` (ou o inverso) deixa o projeto inconsistente.

## Alteração na revisão

- `.dpr`: `Shared.Esus in 'src\Shared.Esus.pas'` após `Shared.View.Form.CadastroAcesso`.
- `.dproj`: `<DCCReference Include="src\Shared.Esus.pas"/>`.

## Limites

O restante das units do `.dpr` (cerca de 552 linhas) não foi listado.
