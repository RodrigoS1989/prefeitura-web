# Índice — documentação para agentes

Revisão SVN r14853 (trunk). Units Thrift não foram documentadas. Model e Controller do mesmo assunto estão no mesmo arquivo.

| Unit | Tipo | Documento | Resumo |
|------|------|-----------|--------|
| Shared.dpr | Projeto | Shared.md | Inclui `Shared.Esus` |
| Shared.dproj | Projeto | Shared.md | `DCCReference` de `src\Shared.Esus.pas` |
| Shared.Esus | Unit | Shared.Esus.md | Validação, ZIP e API da produção e-SUS |
| Shared.Controller.Consts | Controller | Shared.Controller.Consts.md | Flags de modo automático (`-esus`, `-acs`, `-agendamento`, `-sed`) |
| Shared.Controller.Interfaces | Controller | Shared.Controller.Interfaces.md | `IConexao.InitialCatalog` |
| Shared.Controller.Recurso | Controller | Shared.Controller.Recurso.md | Recurso lido do executável e DLLs do OpenSSL |
| Shared.Controller.Uteis | Controller | Shared.Controller.Uteis.md | `CarregarModo` e chamada do UpdateSocial |
| Shared.Model.Arquivo | Model | Shared.Model.Arquivo.md | Arquivo vazio passa a usar `Stream.Size` |
| Shared.Model.Conexao | Model | Shared.Model.Conexao.md | Catálogo inicial opcional na connection string |
| Saude.Controller.Consts | Controller | Saude.Controller.Consts.md | Idade do IVCF, condição maternal e caracteres de CNPJ |
| Saude.Controller.Interfaces | Controller | Saude.Controller.Interfaces.md | `GetUsaValidacaoSqlEsus` em `IParametroSaude` |
| Saude.Controller.Parametro | Controller | Saude.Parametro.md | Carrega `fl_UsaValidacaoSqlEsus` |
| Saude.Model.Parametro | Model | Saude.Parametro.md | Campo do parâmetro de validação SQL e-SUS |
| Saude.Controller.Uteis.Esus | Controller | Saude.Controller.Uteis.Esus.md | CBO da FAI sempre válido; CNPJ por conjunto de caracteres |
| Saude.Controller.Esus.Integracao | Controller | Saude.Esus.Integracao.md | INE vazio, IVCF, vacina e fim da trava de CBO no encaminhamento |
| Saude.Model.Esus.Integracao.DataModule | Model | Saude.Esus.Integracao.md | SQL do INE passou a usar `ds_CodigoINE` |
| Saude.Model.SQL | SQL | Saude.Model.SQL.md | Filtro de CIAP ABP e coluna `fl_UsaValidacaoSqlEsus` |
| Saude.View.Frame.Esus.ProblemasCondicoes | Frame | Saude.View.Frame.Esus.ProblemasCondicoes.md | ABP localizado pelo código do CIAP |
| Shared.View.Form.Global.ImageList | Form | Shared.View.Form.Global.ImageList.md | Lista de ícones em 32 bits; o bitmap foi trocado |
| Shared.View.Testes.InconsistenciaCsvPEC | Form | Shared.View.Testes.InconsistenciaCsvPEC.md | Chaves do CSV do PEC passaram a usar a sigla da ficha |
| Shared.View.Testes.RNDS | Form | Shared.View.Testes.RNDS.md | Dfm perdeu o BOM e o label deixou de ter nome acentuado |
