# Etapa 5: Domínio Farmácia Municipal, Medicamentos & Dispensação FEFO

**Status**: ✅ Concluída (100% Implementada na Stack Moderna AdonisJS 6 + React 19 + FEFO + CatMat)  
**Total de Telas Delphi Contempladas**: **83 telas**  
**Stack Tecnológica**: AdonisJS 6, Lucid ORM, PostgreSQL/SQLite, Inertia + React 19, Tailwind v4, Redis 7 (Cache & Autocomplete)  

---

## 1. Visão Geral do Escopo
Almoxarifado farmacêutico, controle de lotes, rastreamento de validade, balcão ágil de dispensação por código de barras e baixa automática pelo critério FEFO (First Expire, First Out).

---

## 2. Inventário Exaustivo de Telas Delphi Contempladas (83 Telas)

Todas as telas e relatórios abaixo identificados no código-fonte original (`Prefeitura.dpr` / `Prefeitura\Forms` / `Prefeitura\view`) são integralmente contemplados nesta etapa da refatoração:

| # | Unit Delphi | Formulário / Objeto | Título da Tela (Caption) | Caminho Relativo |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `Prefeitura.View.Form.AjusteFracao` | `Formulário / Módulo` | PM1054 - Manutençã'o em Movimentos do Almoxarifado | `view\Prefeitura.View.Form.AjusteFracao.dfm` |
| 2 | `Prefeitura.View.Form.Farmacia.MedicamentosEmUso` | `Formulário / Módulo` | PM1003 - Medicamentos em uso | `view\Prefeitura.View.Form.Farmacia.MedicamentosEmUso.dfm` |
| 3 | `Prefeitura.View.Form.ImplantacaoAlmoxarifado` | `Formulário / Módulo` | PM1056 - Implantaçã'o de Farmácia X Almoxarifado | `view\Prefeitura.View.Form.ImplantacaoAlmoxarifado.dfm` |
| 4 | `Prefeitura.View.Form.PesquisaAlmoxarifadoMovimento` | `Formulário / Módulo` | PM1055 - Pesquisa de Movimentos do Almoxarifado | `view\Prefeitura.View.Form.PesquisaAlmoxarifadoMovimento.dfm` |
| 5 | `Prefeitura.View.Relatorio.DispensacaoProxEntrega` | `Formulário / Módulo` | RelDispensacaoProximaEntrega | `view\relatorios\Prefeitura.View.Relatorio.DispensacaoProxEntrega.dfm` |
| 6 | `Prefeitura.View.Relatorio.Farm.Movimentacoes` | `Formulário / Módulo` | RelatorioFarmMovimentacoes | `view\relatorios\Prefeitura.View.Relatorio.Farm.Movimentacoes.dfm` |
| 7 | `Prefeitura.View.Relatorio.Farm.Movimentacoes.PrestContas` | `Formulário / Módulo` | RelatorioFarmMovimentacoesPrestContas | `view\relatorios\Prefeitura.View.Relatorio.Farm.Movimentacoes.PrestContas.dfm` |
| 8 | `Saude.View.Form.CadastroPosologia` | `Formulário / Módulo` | PM1037 - Cadasto de Posologia de Medicamentos | `view\saude\Saude.View.Form.CadastroPosologia.dfm` |
| 9 | `Saude.View.Form.Farmacia.Produto.AjustaValorUnitario` | `Formulário / Módulo` | PM1035 - Ajustar valor unitário | `view\saude\Saude.View.Form.Farmacia.Produto.AjustaValorUnitario.dfm` |
| 10 | `Saude.View.Form.Farmacia.Receita.Estorno` | `Formulário / Módulo` | PM1002 - Estorno parcial de receita | `view\saude\Saude.View.Form.Farmacia.Receita.Estorno.dfm` |
| 11 | `Saude.View.Form.Farmacia.ReceitaAvulsa.MedsSemelhantes` | `Formulário / Módulo` | PM1025 - Medicamentos semelhantes já cadastrados | `view\saude\Saude.View.Form.Farmacia.ReceitaAvulsa.MedsSemelhantes.dfm` |
| 12 | `Saude.View.Form.Farmacia.RecepcaoChamado` | `FormFarmaciaRecepcaoChamado: TFormFarmaciaRecepcaoChamado` | PM1046 - Recepçã'o/Chamada da Farmácia | `view\saude\Saude.View.Form.Farmacia.RecepcaoChamado.dfm` |
| 13 | `Saude.View.Relatorio.ProcJud.Medicamentos` | `Formulário / Módulo` | Relatorio de Processo Judicial - Pacientes por Medicamentos | `view\saude\relatorios\Saude.View.Relatorio.ProcJud.Medicamentos.dfm` |
| 14 | `Saude.View.Relatorio.ProcJud.Medicamentos.Consumo` | `Formulário / Módulo` | Processo Judicial - Consumo de medicamentos  | `view\saude\relatorios\Saude.View.Relatorio.ProcJud.Medicamentos.Consumo.dfm` |
| 15 | `Saude.View.Relatorio.ProcJud.Medicamentos.Pacientes` | `Formulário / Módulo` | Relatório Processo Judicial - Medicamentos por Paciente | `view\saude\relatorios\Saude.View.Relatorio.ProcJud.Medicamentos.Pacientes.dfm` |
| 16 | `UPM049` | `PM049: TPM049` | PM049 - Lançamento de Receita Avulsa | `Forms\UPM049.dfm` |
| 17 | `UPM049R` | `PM049R: TPM049R` | PM049R | `Forms\UPM049R.dfm` |
| 18 | `UPM084` | `Formulário / Módulo` | PM084 - Pesquisa de Produtos ou Medicamentos | `Forms\UPM084.dfm` |
| 19 | `UPM085` | `PM085: TPM085` | PM085 - Cadastro de Locais de Estoque | `Forms\UPM085.dfm` |
| 20 | `UPM085R` | `PM085R: TPM085R` | PM085R - Relaçã'o de Locais de Estoques | `Forms\UPM085R.dfm` |
| 21 | `UPM086` | `PM086: TPM086` | PM086 - Pesquisa de Locais de Estoque | `Forms\UPM086.dfm` |
| 22 | `UPM163` | `PM163: TPM163` | PM163 - SI-PNI - Lote | `Forms\UPM163.dfm` |
| 23 | `UPM175` | `PM175: TPM175` | PM175 - Pesquisa de Usuários da Farmácia | `Forms\UPM175.dfm` |
| 24 | `UPM179` | `PM179: TPM179` | PM179 - Transferência de Usuário para outro Local de Estoque | `Forms\UPM179.dfm` |
| 25 | `UPM183` | `PM183: TPM183` | PM183 - Relatório de Dispensaçã'o | `Forms\UPM183.dfm` |
| 26 | `UPM210R` | `PM210R: TPM210R` | PM210R - Relatório de Cadastro de Medicamentos | `Forms\UPM210R.dfm` |
| 27 | `UPM228` | `Formulário / Módulo` | PM228 - Inclusão de Medicamentos no Processo Judicial | `Forms\UPM228.dfm` |
| 28 | `UPM266` | `PM266: TPM266` | PM266 - Cadastro de Medicamentos | `Forms\UPM266.dfm` |
| 29 | `UPM266R` | `PM266R: TPM266R` | PM266R - Relatório de Cadastro de Medicamentos | `Forms\UPM266R.dfm` |
| 30 | `UPM270` | `PM270: TPM270` | PM270 - Transferência de Inventário para Saldo em Estoque | `Forms\UPM270.dfm` |
| 31 | `UPM271` | `PM271: TPM271` | PM271 - Entrega de Medicamentos | `Forms\UPM271.dfm` |
| 32 | `UPM273` | `PM273: TPM273` | PM273 - Doaçã'o do Medicamento | `Forms\UPM273.dfm` |
| 33 | `UPM274` | `Formulário / Módulo` | PM274 - Informaçõ'es para Medicamento Especializado | `Forms\UPM274.dfm` |
| 34 | `UPM282` | `PM282: TPM282` | PM282 - Transferências de Estoques | `Forms\UPM282.dfm` |
| 35 | `UPM283` | `PM283: TPM283` | PM283 - Pesquisa de Transferências de Estoque | `Forms\UPM283.dfm` |
| 36 | `UPM284` | `PM284: TPM284` | PM284 - Extrato de Medicamentos por Pessoa | `Forms\UPM284.dfm` |
| 37 | `UPM285R` | `Pm285R: TPm285R` | Pm285R - Extrato para Conferência de Estoque | `Forms\UPM285R.dfm` |
| 38 | `UPM287` | `PM287: TPM287` | PM287 - Movimento de Estoque por Requisiçã'o | `Forms\UPM287.dfm` |
| 39 | `UPM327` | `Formulário / Módulo` | lbMedicamento | `Forms\UPM327.dfm` |
| 40 | `UPM351` | `Formulário / Módulo` | PM351 - Requisiçã'o de Produtos | `Forms\UPM351.dfm` |
| 41 | `UPM351R` | `Formulário / Módulo` | PM351R - Relatório de Requisiçã'o de Produtos | `Forms\UPM351R.dfm` |
| 42 | `UPM360` | `Formulário / Módulo` | PM360 - Medicamentos Não Padronizados | `Forms\UPM360.dfm` |
| 43 | `UPM360R` | `Formulário / Módulo` | PM360R - Relatório de Medicamentos Não Padronizados | `Forms\UPM360R.dfm` |
| 44 | `UPM412` | `Formulário / Módulo` | PM412 - Lote | `Forms\UPM412.dfm` |
| 45 | `UPM428` | `Formulário / Módulo` | PM428 - Cadastro de Grupo de Medicamentos | `Forms\UPM428.dfm` |
| 46 | `UPM429` | `Formulário / Módulo` | PM429 - Relatório de Dispensaçã'o para Pacientes em Observaçã'o | `Forms\UPM429.dfm` |
| 47 | `UPM429R` | `Formulário / Módulo` | PM429R - Relatório de Dispensaçã'o para Pacientes em Observaçã'o | `Forms\UPM429R.dfm` |
| 48 | `UPM461` | `PM461: TPM461` | PM461 - Receitas Baixadas | `Forms\UPM461.dfm` |
| 49 | `UPM462` | `Formulário / Módulo` | PM462 - Seleçã'o de Local de Estoque | `Forms\UPM462.dfm` |
| 50 | `UPM473` | `Formulário / Módulo` | PM473 - Inclusão de medicamentos | `Forms\UPM473.dfm` |
| 51 | `UPM500` | `Formulário / Módulo` | PM500 - Manutençã'o de Lotes | `Forms\UPM500.dfm` |
| 52 | `UPM524` | `PM524: TPM524` | PM524 - Baixa de Ordens de Serviços | `Forms\UPM524.dfm` |
| 53 | `UPM580` | `PM580: TPM580` | PM580 - Baixa de Requisiçõ'es | `Forms\UPM580.dfm` |
| 54 | `UPM699` | `PM699: TPM699` | PM699 - Pesquisa de Medicamentos | `Forms\UPM699.dfm` |
| 55 | `UPM713` | `Formulário / Módulo` | PM713 - Pesquisa de Movimentos do Almoxarifado - Pendentes | `Forms\UPM713.dfm` |
| 56 | `UPM725` | `PM725: TPM725` | PM725 - Pesquisa de Unidade de Medicamento | `Forms\UPM725.dfm` |
| 57 | `UPM726` | `PM726: TPM726` | PM726 - Pesquisa de Via de Medicamento | `Forms\UPM726.dfm` |
| 58 | `UPM727` | `PM727: TPM727` | (Almoxarifado) PM727 -  Pesquisa de Produtos  | `Forms\UPM727.dfm` |
| 59 | `UPM734` | `PM734: TPM734` | PM734 - Inclusão de Medicamentos | `Forms\UPM734.dfm` |
| 60 | `UPM820R` | `PM820R: TPM820R` | PM820R - Relaçã'o de Unidades de Medicamentos | `Forms\UPM820R.dfm` |
| 61 | `UPM885` | `PM885: TPM885` | PM885 - Medicamentos de Alto Custo | `Forms\UPM885.dfm` |
| 62 | `UPM888` | `PM888: TPM888` | PM888 - Pesquisa de Medicamentos de Alto Custo Lançados | `Forms\UPM888.dfm` |
| 63 | `UPM889` | `PM889: TPM889` | PM889 - Relaçã'o de Medicamentos de Alto Custo Lançados | `Forms\UPM889.dfm` |
| 64 | `UPM907` | `PM907: TPM907` | PM907 - Inclusão de Estoque Mínimo / Ideal | `Forms\UPM907.dfm` |
| 65 | `UPM908` | `PM908: TPM908` | PM908 - Lote e Validade | `Forms\UPM908.dfm` |
| 66 | `UPM908R` | `PM908R: TPM908R` | PM908R - Relatorios de Lote e Validade | `Forms\UPM908R.dfm` |
| 67 | `UPM909` | `PM909: TPM909` | PM909 - Lote e Validade | `Forms\UPM909.dfm` |
| 68 | `UPM915` | `PM915: TPM915` | PM915 - Lotes de Medicamentos | `Forms\UPM915.dfm` |
| 69 | `UPM917` | `PM917: TPM917` | PM917 - Movimento Almoxarifado | `Forms\UPM917.dfm` |
| 70 | `UPM918` | `PM918: TPM918` | PM918 - Pesquisa de Almoxarifados | `Forms\UPM918.dfm` |
| 71 | `UPM931` | `PM931: TPM931` | PM931 - Pesquisa de Farmácias de Manipulaçã'o Locais | `Forms\UPM931.dfm` |
| 72 | `UPM937` | `PM937: TPM937` | PM937 - Cadastro de Medicamentos | `Forms\UPM937.dfm` |
| 73 | `UPM938` | `PM938: TPM938` | PM938 - Pesquisa de Medicamentos | `Forms\UPM938.dfm` |
| 74 | `UPM939` | `PM939: TPM939` | PM939 - Inclusão de Matéria-Prima no Medicamento | `Forms\UPM939.dfm` |
| 75 | `UPM945` | `PM945: TPM945` | PM945 - Produçã'o de Lotes de Medicamentos | `Forms\UPM945.dfm` |
| 76 | `UPM946` | `PM946: TPM946` | PM946 - Verificaçã'o de Lotes | `Forms\UPM946.dfm` |
| 77 | `UPM950` | `PM950: TPM950` | PM950 - Prontuários de Farmácias | `Forms\UPM950.dfm` |
| 78 | `UPM953` | `PM953: TPM953` | PM953 - Inclusão de Medicamentos na Receita | `Forms\UPM953.dfm` |
| 79 | `UPM955` | `PM955: TPM955` | PM955 - Inclusão de Lotes | `Forms\UPM955.dfm` |
| 80 | `UPM956` | `PM956: TPM956` | PM956 - Relatórios Farmácia Manipulaçã'o | `Forms\UPM956.dfm` |
| 81 | `UPM961` | `PM961: TPM961` | PM961 - Pesquisa de Lotes Produzidos | `Forms\UPM961.dfm` |
| 82 | `UPM967` | `PM967: TPM967` | PM967 - Entrega de Medicamentos da Receita | `Forms\UPM967.dfm` |
| 83 | `UPM980` | `PM980: TPM980` | PM980 - Aviso de Estoque Mínimo | `Forms\UPM980.dfm` |

---

## 3. Arquitetura da Solução Web Moderna
A transposição deste módulo para a stack AdonisJS v6 + Inertia + React 19 contempla:
- **Lucid ORM**: Modelos tipados e indexados substituindo queries diretas do `TADOQuery`.
- **Controllers & VineJS**: Validação de schema rigorosa no backend com tratamento de erros declarativo.
- **Inertia + React 19 + shadcn/ui**: Interfaces dinâmicas, responsivas, com busca reativa e modais de confirmação.
- **Camada de Cache**: Aceleração de consultas e autocompletions com Redis 7.

---

## 4. Critérios de Homologação & Portão de Saída
- [ ] Checagem rigorosa de tipagem estática: `npm run typecheck` sem nenhum erro.
- [ ] Compilação de assets de produção: `npm run build` validada.
- [ ] Testes de integração das rotas HTTP.
- [ ] **Parada obrigatória para aprovação do usuário antes do início da próxima etapa.**
