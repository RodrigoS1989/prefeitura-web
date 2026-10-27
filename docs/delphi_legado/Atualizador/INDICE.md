# Índice — documentação para agentes

Revisão SVN r14853 (trunk). Thrift, scripts `.sql` e `.rc` não foram documentados.

| Unit | Tipo | Documento | Resumo |
|------|------|-----------|--------|
| Atualizador.ResourcesHelper | Unit | Atualizador.ResourcesHelper.md | Executa script de recurso no banco e passa a falhar se o ADO registrar erro |
| Atualizador.Controller.StoredProcedures | Controller | Atualizador.StoredProcedures.md | Grava `FProcedures.sql` em UTF-8 na pasta do executável |
| Atualizador.Model.SQL.StoredProcedures | SQL | Atualizador.StoredProcedures.md | Mesmo documento; na r14853 só ganhou uma linha em branco |
| Atualizador.Controller.Tabela | Controller | Atualizador.Tabela.md | Deixou de criar `tb_EsusGestores` |
| Atualizador.Model.SQL.Tabela | SQL | Atualizador.Tabela.md | Removeu o script `Create_tb_EsusGestores` |
| Atualizador.Model.SQL | SQL | Atualizador.Model.SQL.md | Só reordenou a cláusula uses |
| untAtualizaDados | Form | untAtualizaDados.md | Passa a executar o recurso `Social_Types` no banco escolhido |
