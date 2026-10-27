# Etapa 4: Domínio Atendimento Clínico, Recepção & Prontuário Eletrônico (PEP)

**Status**: ⏳ Pendente (Aguardando Etapa 3)  
**Total de Telas Delphi Contempladas**: **99 telas**  
**Stack Tecnológica**: Models Lucid (Atendimento, TriagemManchester, SinaisVitais, EvolucaoClinica, Prescricao), Fila em tempo real  

---

## 1. Visão Geral do Escopo
Recepção ambulatorial, acolhimento com Triagem e Classificação de Risco (Protocolo Manchester), Prontuário Eletrônico do Paciente (PEP), método SOAP, CID-10, CIAP-2 e Prescrição Médica.

---

## 2. Inventário Exaustivo de Telas Delphi Contempladas (99 Telas)

Todas as telas e relatórios abaixo identificados no código-fonte original (`Prefeitura.dpr` / `Prefeitura\Forms` / `Prefeitura\view`) são integralmente contemplados nesta etapa da refatoração:

| # | Unit Delphi | Formulário / Objeto | Título da Tela (Caption) | Caminho Relativo |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `Prefeitura.View.Form.Raas` | `Formulário / Módulo` | PM1012 - Lançamento de Atendimento - RAAS | `view\Prefeitura.View.Form.Raas.dfm` |
| 2 | `Saude.View.Relatorio.CidadaosCpfInconsistente` | `Formulário / Módulo` | Relatorio de Cidadao com CPF inconsistente | `view\saude\relatorios\Saude.View.Relatorio.CidadaosCpfInconsistente.dfm` |
| 3 | `UPM002` | `PM002: TPM002` | PM002 - Cadastro do Cidadão | `Forms\UPM002.dfm` |
| 4 | `UPM002R` | `PM002R: TPM002R` | PM002R - Relatórios Cidadão | `Forms\UPM002R.dfm` |
| 5 | `UPM004` | `PM004: TPM004` | PM004 - Cadastro de Doenças | `Forms\UPM004.dfm` |
| 6 | `UPM004R` | `PM004R: TPM004R` | PM004R - Relaçã'o de Doenças | `Forms\UPM004R.dfm` |
| 7 | `UPM014` | `PM014: TPM014` | PM014 - Pesquisa de Doenças | `Forms\UPM014.dfm` |
| 8 | `UPM037` | `PM037: TPM037` | PM037 - Cadastro de Grupos de Atendimentos - PAIF | `Forms\UPM037.dfm` |
| 9 | `UPM038` | `PM038: TPM038` | PM038 - Cadastro de Sub Grupos de Atendimentos - PAIF | `Forms\UPM038.dfm` |
| 10 | `UPM039` | `PM039: TPM039` | PM039 - Cadastro de Itens de Atendimentos - PAIF | `Forms\UPM039.dfm` |
| 11 | `UPM045` | `PM045: TPM045` | PM045 - Prontuário Eletrônico | `Forms\UPM045.dfm` |
| 12 | `UPM045R` | `PM045R: TPM045R` | PM045R - Prontuario Eletrônico | `Forms\UPM045R.dfm` |
| 13 | `UPM046` | `PM046: TPM046` | PM046 - Atendimentos em Grupo | `Forms\UPM046.dfm` |
| 14 | `UPM048` | `PM048: TPM048` | PM048 - Pesquisa de Atendimentos em Grupo | `Forms\UPM048.dfm` |
| 15 | `UPM067` | `PM067: TPM067` | PM067 - Atendimentos | `Forms\UPM067.dfm` |
| 16 | `UPM074` | `PM074: TPM074` | PM074 - Pesquisa do Cidadão | `Forms\UPM074.dfm` |
| 17 | `UPM077` | `PM077: TPM077` | PM077 - Questionário Atendimento | `Forms\UPM077.dfm` |
| 18 | `UPM125` | `PM125: TPM125` | PM125 - Cadastro de Procedimentos Automáticos | `Forms\UPM125.dfm` |
| 19 | `UPM127` | `PM127: TPM127` | PM127 - Cadastro de Procedimentos Particulares | `Forms\UPM127.dfm` |
| 20 | `UPM127R` | `PM127R: TPM127R` | PM127R - Relatórios de Procedimentos Particulares | `Forms\UPM127R.dfm` |
| 21 | `UPM128` | `PM128: TPM128` | PM128 - Pesquisa de Procedimentos Particulares | `Forms\UPM128.dfm` |
| 22 | `UPM138` | `PM138: TPM138` | PM138 - Pesquisa de Procedimentos Automáticos | `Forms\UPM138.dfm` |
| 23 | `UPM145R` | `PM145R: TPM145R` | PM145R - Relatório dos Cidadãos que mais Locaram | `Forms\UPM145R.dfm` |
| 24 | `UPM166` | `PM166: TPM166` | PM166 - Manutençã'o Prontuário | `Forms\UPM166.dfm` |
| 25 | `UPM170` | `PM170: TPM170` | PM170 - Cópia de procedimentos automáticos | `Forms\UPM170.dfm` |
| 26 | `UPM181` | `PM181: TPM181` | PM181 - Validaçõ'es de Procedimentos | `Forms\UPM181.dfm` |
| 27 | `UPM187` | `PM187: TPM187` | PM187 - Cursos que o Cidadão já teve participaçã'o | `Forms\UPM187.dfm` |
| 28 | `UPM195` | `PM195: TPM195` | PM195 - Encaminhamento de Atendimentos | `Forms\UPM195.dfm` |
| 29 | `UPM240` | `Formulário / Módulo` | PM240 - Cadastro de Periodicidade | `Forms\UPM240.dfm` |
| 30 | `UPM243` | `Formulário / Módulo` | PM243 - Cadastro de Locais - Evoluçã'o | `Forms\UPM243.dfm` |
| 31 | `UPM246` | `Formulário / Módulo` | PM246 - Inclusão de Ítens no Local de Evoluçã'o | `Forms\UPM246.dfm` |
| 32 | `UPM247` | `Formulário / Módulo` | PM247 - Histórico de Impressão do Prontuário Eletrônico | `Forms\UPM247.dfm` |
| 33 | `UPM248` | `Formulário / Módulo` | PM248 - Relatório de Cidadãos | `Forms\UPM248.dfm` |
| 34 | `UPM248R` | `Formulário / Módulo` | PM248R - Relaçã'o de Cidadãos | `Forms\UPM248R.dfm` |
| 35 | `UPM284R` | `PM284R: TPM284R` | PM284R - Extrato por Cidadão | `Forms\UPM284R.dfm` |
| 36 | `UPM313` | `PM313: TPM313` | PM313 - Inclusão de Vínculos com o Cidadão | `Forms\UPM313.dfm` |
| 37 | `UPM332` | `Formulário / Módulo` | PM332 - Cadastro de Grupos de Atendimentos - PAEFI | `Forms\UPM332.dfm` |
| 38 | `UPM332R` | `Formulário / Módulo` | PM332R - Relatório de Grupo de Atendimento PAEFI | `Forms\UPM332R.dfm` |
| 39 | `UPM333` | `Formulário / Módulo` | PM333 - Cadastro de Subgrupos de Atendimentos - PAEFI | `Forms\UPM333.dfm` |
| 40 | `UPM333R` | `Formulário / Módulo` | PM333R - Cadastro de Subgrupos de Atendimentos - PAEFI | `Forms\UPM333R.dfm` |
| 41 | `UPM334` | `Formulário / Módulo` | PM334 - Cadastro de Itens de Atendimentos - PAEFI | `Forms\UPM334.dfm` |
| 42 | `UPM334R` | `Formulário / Módulo` | PM334R - Cadastro de Itens de Atendimentos - PAEFI | `Forms\UPM334R.dfm` |
| 43 | `UPM344` | `Formulário / Módulo` | PM344 - Configuraçã'o do Sigilo no Prontuário Eletrônico | `Forms\UPM344.dfm` |
| 44 | `UPM362` | `Formulário / Módulo` | PM362 - Cadastro de CID | `Forms\UPM362.dfm` |
| 45 | `UPM362R` | `Formulário / Módulo` | PM362R - Cadastro de CID's | `Forms\UPM362R.dfm` |
| 46 | `UPM370R` | `PM370R: TPM370R` | PM370R - CID-CARD | `Forms\UPM370R.dfm` |
| 47 | `UPM370RB` | `PM370RB: TPM370RB` | PM370RB - Novo Cartão do Cidadão | `Forms\UPM370RB.dfm` |
| 48 | `UPM377` | `PM377: TPM377` | PM377 - Pesquisa de Cidades | `Forms\UPM377.dfm` |
| 49 | `UPM410` | `PM410: TPM410` | PM410 - Pesquisa de Incidências dos Usuários | `Forms\UPM410.dfm` |
| 50 | `UPM430` | `PM430: TPM430` | PM430 - Cidadão com mesma Data Nascimento | `Forms\UPM430.dfm` |
| 51 | `UPM441` | `Formulário / Módulo` | PM441 - Relatório de Cadastros em Duplicidade | `Forms\UPM441.dfm` |
| 52 | `UPM441R` | `Formulário / Módulo` | PM441R - Relatório de Cadastros em Duplicidade | `Forms\UPM441R.dfm` |
| 53 | `UPM466` | `Formulário / Módulo` | PM466 - Pessoas por Cidade de Origem | `Forms\UPM466.dfm` |
| 54 | `UPM466R` | `Formulário / Módulo` | PM466R - Relatório de cidade de origem | `Forms\UPM466R.dfm` |
| 55 | `UPM489` | `Formulário / Módulo` | PM489 - Procedimento de deslocamento da unidade - Transporte | `Forms\UPM489.dfm` |
| 56 | `UPM509` | `PM509: TPM509` | PM509 - Relatório de Atendimentos | `Forms\UPM509.dfm` |
| 57 | `UPM509R` | `PM509R: TPM509R` | PM509R - Relaçã'o de Atendimentos | `Forms\UPM509R.dfm` |
| 58 | `UPM510` | `PM510: TPM510` | PM510 - Tipos de Atendimentos | `Forms\UPM510.dfm` |
| 59 | `UPM510R` | `PM510R: TPM510R` | PM510R - Relaçã'o de Tipos de Atendimentos | `Forms\UPM510R.dfm` |
| 60 | `UPM511` | `PM511: TPM511` | PM511 - Pesquisa de Tipos de Atendimentos | `Forms\UPM511.dfm` |
| 61 | `UPM542` | `Formulário / Módulo` | PM542 - Histórico de atendimentos do paciente | `Forms\UPM542.dfm` |
| 62 | `UPM608` | `PM608: TPM608` | PM608 - Inclusão de Prontuários | `Forms\UPM608.dfm` |
| 63 | `UPM610` | `PM610: TPM610` | PM610 - C.A.T.U. Central de Atendimento Telefônico ao Usuário | `Forms\UPM610.dfm` |
| 64 | `UPM611` | `PM611: TPM611` | PM611 - Detalhes do Atendimento | `Forms\UPM611.dfm` |
| 65 | `UPM712` | `Formulário / Módulo` | PM712 - Encaminhar Atendimento | `Forms\UPM712.dfm` |
| 66 | `UPM716` | `Formulário / Módulo` | PM716 - Atendimentos Saúde e Social | `Forms\UPM716.dfm` |
| 67 | `UPM743` | `PM743: TPM743` | PM743 - Relatório por CID | `Forms\UPM743.dfm` |
| 68 | `UPM743R` | `PM743R: TPM743R` | PM743R - Relatório de CID | `Forms\UPM743R.dfm` |
| 69 | `UPM744` | `PM744: TPM744` | PM744 - Relatório de Procedimentos por Faixa Etária | `Forms\UPM744.dfm` |
| 70 | `UPM744R` | `PM744R: TPM744R` | PM744R - Relaçã'o de Procedimento por Faixa Etária | `Forms\UPM744R.dfm` |
| 71 | `UPM745` | `PM745: TPM745` | PM745 - Procedimentos S.U.S - Tabela Unificada | `Forms\UPM745.dfm` |
| 72 | `UPM745R` | `PM745R: TPM745R` | PM745R - Relaçã'o de Procedimentos | `Forms\UPM745R.dfm` |
| 73 | `UPM746` | `PM746: TPM746` | PM746 - Pesquisa de Procedimentos S.U.S. - Tabela Unificada | `Forms\UPM746.dfm` |
| 74 | `UPM748` | `PM748: TPM748` | PM748 - Lançamentos de Procedimentos de Enfermagem | `Forms\UPM748.dfm` |
| 75 | `UPM749` | `PM749: TPM749` | PM749 - Inclusão de Procedimentos | `Forms\UPM749.dfm` |
| 76 | `UPM750` | `PM750: TPM750` | PM750 - Validaçã'o de Procedimentos - Tabela Unificada | `Forms\UPM750.dfm` |
| 77 | `UPM759` | `PM759: TPM759` | PM759 - Pesquisa de CID por Procedimento - Tabela Unificada | `Forms\UPM759.dfm` |
| 78 | `UPM760` | `PM760: TPM760` | PM760 - Pesquisa de CID - Tabela Unificada | `Forms\UPM760.dfm` |
| 79 | `UPM761` | `PM761: TPM761` | PM761 - Pesquisa de Carater de atendimento | `Forms\UPM761.dfm` |
| 80 | `UPM764` | `PM764: TPM764` | PM764 - Pronto Atendimento - Tabela Unificada | `Forms\UPM764.dfm` |
| 81 | `UPM765` | `PM765: TPM765` | PM765 - Encaminhar Atendimento - Tabela Unificada | `Forms\UPM765.dfm` |
| 82 | `UPM766` | `PM766: TPM766` | PM766 - Atendimentos já Encaminhados - Tabela Unificada | `Forms\UPM766.dfm` |
| 83 | `UPM768` | `PM768: TPM768` | PM768 - Conferência de Atendimentos - Tabela Unificada | `Forms\UPM768.dfm` |
| 84 | `UPM768R` | `PM768R: TPM768R` | PM768R - Relaçã'o dos Atendimentos Conferidos | `Forms\UPM768R.dfm` |
| 85 | `UPM773` | `PM773: TPM773` | PM773 - Inclusão de Procedimentos para a Gape - Tabela Unificada | `Forms\UPM773.dfm` |
| 86 | `UPM777A` | `PM777A: TPM777A` | PM777A - Avisos de Número de Chamadas em Duplicidade | `Forms\UPM777A.dfm` |
| 87 | `UPM822` | `PM822: TPM822` | PM822 - Lançamentos de Procedimentos - Particulares | `Forms\UPM822.dfm` |
| 88 | `UPM823` | `PM823: TPM823` | PM823 - Inclusão de Procedimentos - Particulares | `Forms\UPM823.dfm` |
| 89 | `UPM824` | `PM824: TPM824` | PM824 - Inclusão de Procedimentos - Particulares | `Forms\UPM824.dfm` |
| 90 | `UPM825` | `PM825: TPM825` | PM825 - Relatório de Procedimentos Particulares | `Forms\UPM825.dfm` |
| 91 | `UPM825R` | `PM825R: TPM825R` | PM825R - Relatório de Procedimentos Particulares | `Forms\UPM825R.dfm` |
| 92 | `UPM867` | `PM867: TPM867` | PM867 - Relatório de Evoluçã'o de Atendimentos | `Forms\UPM867.dfm` |
| 93 | `UPM867R` | `PM867R: TPM867R` | PM867R - Relatório de Atendimentos | `Forms\UPM867R.dfm` |
| 94 | `UPM886` | `PM886: TPM886` | PM886 - Inclusão de Procedimentos | `Forms\UPM886.dfm` |
| 95 | `UPM887` | `PM887: TPM887` | PM887 - Relaçã'o de CID | `Forms\UPM887.dfm` |
| 96 | `UPM895` | `PM895: TPM895` | PM895 - Estatísticas por Procedimentos | `Forms\UPM895.dfm` |
| 97 | `UPM897` | `PM897: TPM897` | PM897 - Encaminhar Atendimento | `Forms\UPM897.dfm` |
| 98 | `UPM969` | `PM969: TPM969` | PM969 - Pesquisa de Atendimentos | `Forms\UPM969.dfm` |
| 99 | `UPM976` | `PM976: TPM976` | PM976 - Triagem de Atendimentos | `Forms\UPM976.dfm` |

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
