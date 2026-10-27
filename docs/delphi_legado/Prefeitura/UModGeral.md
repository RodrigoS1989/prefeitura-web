---
unit: UModGeral
projeto: Prefeitura
tipo: Model
fonte: Prefeitura\DataModulos\UModGeral.pas
dfm: Prefeitura\DataModulos\UModGeral.dfm
revisao: r14853
atualizado: 2026-10-07
---

# UModGeral

Documentação para agentes de IA. Descreve o código; não substitui o fonte na hora de editar.

## Propósito

Data module geral da Prefeitura (`TModGeral`). Concentra datasets ADO usados pelas telas, entre eles `Arq000` (parâmetros) e, até esta revisão, `tb_EsusGestores`.

## Contexto de uso

Criado no `Prefeitura.dpr` (`Application.CreateForm(TModGeral, ModGeral)`) no ramo com interface. As telas leem `ModGeral.Arq000`.

## Superfície pública

Campos novos em `Arq000`:

- `Arq000fl_UsaValidacaoSqlEsus: TBooleanField`
- `Arq000ds_EsusApiUsuario: TStringField`
- `Arq000ds_EsusApiSenha: TStringField`
- `Arq000ds_EsusApiBaseUrl: TStringField`
- `Arq000fl_EsusApiEnvioAutomatico: TBooleanField`

Campos renomeados com sufixo `2` no pas e no dfm:

- `Arq000fl_QuestionarAltaObservacao2`
- `Arq000fl_FiltrarTipoAtendimentoPE2`
- `Arq000fl_Protocolo_PermitirAlterarExameRecepcao2`
- `Arq000fl_DataAtualRecepcao2`
- `Arq000fl_FiltrarEspecialidadeFilaUnica2`

O dataset `tb_EsusGestores` e seus campos saíram do data module.

## Fluxo principal

1. O data module abre na subida do sistema com interface.
2. `Arq000` expõe os parâmetros, inclusive os da API e-SUS.
3. A PM1052 grava esses campos.

## Regras de negócio

- `fl_UsaValidacaoSqlEsus` escolhe a tela nova de produção (ver `UME000`).
- `fl_EsusApiEnvioAutomatico` é lido por `EnvioAutomaticoAtivo` em `Shared.Esus`.
- A senha da API fica em `Arq000ds_EsusApiSenha`. O valor não é documentado.

## Dados

`Arq000`, campos acima. Tamanhos no dfm: usuário 100, senha 100, URL 255. `tb_EsusGestores` (`Select * From tb_EsusGestores`) foi removido do dfm.

O dfm também alterou a connection string de um dataset (catálogo e servidor). Há usuário de banco nesse texto. O valor não é reproduzido. Não tratar essa troca como regra de negócio.

## Interface

Não se aplica. Data module, sem tela.

## Dependências

Conexão `CidCard` era a do dataset de gestores. `Arq000` é o dataset dos parâmetros.

## Cuidados ao alterar

Fonte Windows-1252. Quem ainda referencia `Arq000fl_QuestionarAltaObservacao` (sem o `2`) não compila. O sufixo parece efeito de merge do IDE, não uma coluna nova: o `FieldName` desses itens não foi mostrado como alterado no trecho lido, só o nome do componente. Conferir o `FieldName` antes de usar o componente `*2`. Não gravar a connection string do dfm em documentação nem em log.

## Alteração na revisão

Campos da API e do flag de validação SQL, remoção de `tb_EsusGestores`, renomeação dos cinco componentes com sufixo `2` e troca da connection string no dfm.

## Limites

A unit tem cerca de 8583 linhas. Só o diff foi lido. Não foi confirmado se o `FieldName` dos componentes `*2` continua igual ao nome antigo da coluna.
