# Módulo 05: Farmácia Municipal, Estoque e Dispensação

> **Descrição**: Telas de catálogo REMUME, controle de estoques, lotes, validades, movimentações de entrada/saída, perdas e dispensação FEFO.
> **Total de Telas Catalogadas**: **50**

--- 

## Lista Completa de Formulários

| Código / Unit | Classe | Título / Caption Original | Tipo de Tela | Origem no Delphi |
| :--- | :--- | :--- | :--- | :--- |
| `Prefeitura.View.Form.Farmacia.MedicamentosEmUso` | `TFlowPanel` | PM1003 - Medicamentos em uso | Cadastro / Apoio | `view/Prefeitura.View.Form.Farmacia.MedicamentosEmUso.dfm` |
| `Prefeitura.View.Form.Rnds.Redfm` | `TBitBtn` | PM1040 - Produção do REDFM - Registro Eletrônico de Dispensação | Operação / Movimentação | `view/Prefeitura.View.Form.Rnds.Redfm.dfm` |
| `Prefeitura.View.Relatorio.DispensacaoProxEntrega` | `TQRGroup` | RelDispensacaoProximaEntrega | Relatório / Impressão | `view/relatorios/Prefeitura.View.Relatorio.DispensacaoProxEntrega.dfm` |
| `Saude.View.Form.CadastroPosologia` | `TPanel` | PM1037 - Cadasto de Posologia de Medicamentos | Cadastro / Apoio | `view/saude/Saude.View.Form.CadastroPosologia.dfm` |
| `Saude.View.Form.Farmacia.Produto.AjustaValorUnitario` | `TPanel` | PM1035 - Ajustar valor unitário | Cadastro / Apoio | `view/saude/Saude.View.Form.Farmacia.Produto.AjustaValorUnitario.dfm` |
| `Saude.View.Form.Farmacia.Receita.Estorno` | `TPanel` | PM1002 - Estorno parcial de receita | Cadastro / Apoio | `view/saude/Saude.View.Form.Farmacia.Receita.Estorno.dfm` |
| `Saude.View.Form.Farmacia.ReceitaAvulsa.MedsSemelhantes` | `TPanel` | PM1025 - Medicamentos semelhantes já cadastrados | Cadastro / Apoio | `view/saude/Saude.View.Form.Farmacia.ReceitaAvulsa.MedsSemelhantes.dfm` |
| `Saude.View.Form.Farmacia.RecepcaoChamado` | `TFormFarmaciaRecepcaoChamado` | PM1046 - Recepção/Chamada da Farmácia | Operação / Movimentação | `view/saude/Saude.View.Form.Farmacia.RecepcaoChamado.dfm` |
| `Saude.View.Relatorio.ProcJud.Medicamentos` | `TQRBand` | Relatorio de Processo Judicial - Pacientes por Medicamentos | Relatório / Impressão | `view/saude/relatorios/Saude.View.Relatorio.ProcJud.Medicamentos.dfm` |
| `Saude.View.Relatorio.ProcJud.Medicamentos.Consumo` | `TQRGroup` | Processo Judicial - Consumo de medicamentos | Relatório / Impressão | `view/saude/relatorios/Saude.View.Relatorio.ProcJud.Medicamentos.Consumo.dfm` |
| `Saude.View.Relatorio.ProcJud.Medicamentos.Pacientes` | `TQRBand` | Relatório Processo Judicial - Medicamentos por Paciente | Relatório / Impressão | `view/saude/relatorios/Saude.View.Relatorio.ProcJud.Medicamentos.Pacientes.dfm` |
| `UPM084` | `TPanel` | PM084 - Pesquisa de Produtos ou Medicamentos | Cadastro / Apoio | `Forms/UPM084.dfm` |
| `UPM175` | `TPM175` | PM175 - Pesquisa de Usuários da Farmácia | Cadastro / Apoio | `Forms/UPM175.dfm` |
| `UPM183` | `TPM183` | PM183 - Relatório de Dispensação | Operação / Movimentação | `Forms/UPM183.dfm` |
| `UPM210R` | `TPM210R` | PM210R - Relatório de Cadastro de Medicamentos | Relatório / Impressão | `Forms/UPM210R.dfm` |
| `UPM228` | `TPanel` | PM228 - Inclusão de Medicamentos no Processo Judicial | Cadastro / CRUD | `Forms/UPM228.dfm` |
| `UPM266` | `TPM266` | PM266 - Cadastro de Medicamentos | Cadastro / CRUD | `Forms/UPM266.dfm` |
| `UPM266R` | `TPM266R` | PM266R - Relatório de Cadastro de Medicamentos | Relatório / Impressão | `Forms/UPM266R.dfm` |
| `UPM271` | `TPM271` | PM271 - Entrega de Medicamentos | Cadastro / Apoio | `Forms/UPM271.dfm` |
| `UPM273` | `TPM273` | PM273 - Doação do Medicamento | Cadastro / Apoio | `Forms/UPM273.dfm` |
| `UPM274` | `TPanel` | PM274 - Informações para Medicamento Especializado | Cadastro / Apoio | `Forms/UPM274.dfm` |
| `UPM284` | `TPM284` | PM284 - Extrato de Medicamentos por Pessoa | Cadastro / Apoio | `Forms/UPM284.dfm` |
| `UPM327` | `TPanel` | PM327 - Visualização do saldo do medicamento em outros locais de | Cadastro / Apoio | `Forms/UPM327.dfm` |
| `UPM360` | `TPanel` | PM360 - Medicamentos Não Padronizados | Cadastro / Apoio | `Forms/UPM360.dfm` |
| `UPM360R` | `TQRDBText` | PM360R - Relatório de Medicamentos Não Padronizados | Relatório / Impressão | `Forms/UPM360R.dfm` |
| `UPM428` | `TPanel` | PM428 - Cadastro de Grupo de Medicamentos | Cadastro / CRUD | `Forms/UPM428.dfm` |
| `UPM429` | `TPanel` | PM429 - Relatório de Dispensação para Pacientes em Observação | Operação / Movimentação | `Forms/UPM429.dfm` |
| `UPM429R` | `TQRLabel` | PM429R - Relatório de Dispensação para Pacientes em Observação | Relatório / Impressão | `Forms/UPM429R.dfm` |
| `UPM473` | `TPanel` | PM473 - Inclusão de medicamentos | Cadastro / CRUD | `Forms/UPM473.dfm` |
| `UPM699` | `TPM699` | PM699 - Pesquisa de Medicamentos | Cadastro / Apoio | `Forms/UPM699.dfm` |
| `UPM725` | `TPM725` | PM725 - Pesquisa de Unidade de Medicamento | Cadastro / Apoio | `Forms/UPM725.dfm` |
| `UPM726` | `TPM726` | PM726 - Pesquisa de Via de Medicamento | Cadastro / Apoio | `Forms/UPM726.dfm` |
| `UPM734` | `TPM734` | PM734 - Inclusão de Medicamentos | Cadastro / CRUD | `Forms/UPM734.dfm` |
| `UPM820R` | `TPM820R` | PM820R - Relação de Unidades de Medicamentos | Relatório / Impressão | `Forms/UPM820R.dfm` |
| `UPM885` | `TPM885` | PM885 - Medicamentos de Alto Custo | Cadastro / Apoio | `Forms/UPM885.dfm` |
| `UPM888` | `TPM888` | PM888 - Pesquisa de Medicamentos de Alto Custo Lançados | Cadastro / Apoio | `Forms/UPM888.dfm` |
| `UPM889` | `TPM889` | PM889 - Relação de Medicamentos de Alto Custo Lançados | Cadastro / Apoio | `Forms/UPM889.dfm` |
| `UPM908` | `TPM908` | PM908 - Lote e Validade | Cadastro / Apoio | `Forms/UPM908.dfm` |
| `UPM908R` | `TPM908R` | PM908R - Relatorios de Lote e Validade | Relatório / Impressão | `Forms/UPM908R.dfm` |
| `UPM909` | `TPM909` | PM909 - Lote e Validade | Cadastro / Apoio | `Forms/UPM909.dfm` |
| `UPM915` | `TPM915` | PM915 - Lotes de Medicamentos | Cadastro / Apoio | `Forms/UPM915.dfm` |
| `UPM931` | `TPM931` | PM931 - Pesquisa de Farmácias de Manipulação Locais | Cadastro / Apoio | `Forms/UPM931.dfm` |
| `UPM937` | `TPM937` | PM937 - Cadastro de Medicamentos | Cadastro / CRUD | `Forms/UPM937.dfm` |
| `UPM938` | `TPM938` | PM938 - Pesquisa de Medicamentos | Cadastro / Apoio | `Forms/UPM938.dfm` |
| `UPM939` | `TPM939` | PM939 - Inclusão de Matéria-Prima no Medicamento | Cadastro / CRUD | `Forms/UPM939.dfm` |
| `UPM945` | `TPM945` | PM945 - Produção de Lotes de Medicamentos | Cadastro / Apoio | `Forms/UPM945.dfm` |
| `UPM950` | `TPM950` | PM950 - Prontuários de Farmácias | Cadastro / Apoio | `Forms/UPM950.dfm` |
| `UPM953` | `TPM953` | PM953 - Inclusão de Medicamentos na Receita | Cadastro / CRUD | `Forms/UPM953.dfm` |
| `UPM956` | `TPM956` | PM956 - Relatórios Farmácia Manipulação | Cadastro / Apoio | `Forms/UPM956.dfm` |
| `UPM967` | `TPM967` | PM967 - Entrega de Medicamentos da Receita | Cadastro / Apoio | `Forms/UPM967.dfm` |

---
*Gerado automaticamente pelo inventário oficial de refatoração do sistema Delphi Prefeitura.*
