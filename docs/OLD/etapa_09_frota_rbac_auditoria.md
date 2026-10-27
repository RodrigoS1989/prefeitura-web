# Etapa 9: Domínio Frota Sanitária (TFD), RBAC de Usuários & Auditoria

**Status**: ⏳ Pendente (Aguardando Etapa 8)  
**Total de Telas Delphi Contempladas**: **26 telas**  
**Stack Tecnológica**: Models Lucid (Veiculo, ViagemTfd, User, Role, Permission, AuditLog), Middleware de auditoria  

---

## 1. Visão Geral do Escopo
Controle de viagens e veículos para Tratamento Fora do Domicílio (TFD), gestão de operadores e perfis RBAC granulares, e trilha imutável de auditoria de acessos para conformidade LGPD.

---

## 2. Inventário Exaustivo de Telas Delphi Contempladas (26 Telas)

Todas as telas e relatórios abaixo identificados no código-fonte original (`Prefeitura.dpr` / `Prefeitura\Forms` / `Prefeitura\view`) são integralmente contemplados nesta etapa da refatoração:

| # | Unit Delphi | Formulário / Objeto | Título da Tela (Caption) | Caminho Relativo |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `Prefeitura.View.Form.Protocolo.Log` | `Formulário / Módulo` | PM1050 - Protocolo - Log de Alteraçõ'es | `view\Prefeitura.View.Form.Protocolo.Log.dfm` |
| 2 | `Prefeitura.View.Frame.Senha` | `FrameSenha: TFrameSenha` | Digite a senha | `view\frames\Prefeitura.View.Frame.Senha.dfm` |
| 3 | `Saude.View.Form.Viagem.Estorno` | `Formulário / Módulo` | PM1032 - Estorno de Viagens Excluídas | `view\saude\Saude.View.Form.Viagem.Estorno.dfm` |
| 4 | `Saude.View.Relatorio.PosologiaCadastro` | `Formulário / Módulo` | Relatório de Posologias | `view\saude\relatorios\Saude.View.Relatorio.PosologiaCadastro.dfm` |
| 5 | `UCO010` | `CO010: TCO010` | CO010 - Liberaçã'o do Correio | `Forms\UCO010.dfm` |
| 6 | `UPM000` | `PM000: TPM000` | PM000 - Login do Sistema | `Forms\UPM000.dfm` |
| 7 | `UPM019` | `PM019: TPM019` | PM019 - Cadastro de Usuários | `Forms\UPM019.dfm` |
| 8 | `UPM019R` | `PM019R: TPM019R` | PM019R - Relatório dos Usuários | `Forms\UPM019R.dfm` |
| 9 | `UPM021` | `PM021: TPM021` | PM021 - Relatório de Notas Fiscais e Requisiçõ'es | `Forms\UPM021.dfm` |
| 10 | `UPM021R` | `PM021R: TPM021R` | PM021R | `Forms\UPM021R.dfm` |
| 11 | `UPM061` | `PM061: TPM061` | PM061 - Carteira de Transporte Universitário | `Forms\UPM061.dfm` |
| 12 | `UPM098` | `PM098: TPM098` | PM098 - Relaçã'o para Depósito do Transporte de Alunos | `Forms\UPM098.dfm` |
| 13 | `UPM261` | `PM261: TPM261` | PM261 - Trocar de Senha | `Forms\UPM261.dfm` |
| 14 | `UPM324` | `Formulário / Módulo` | PM324 - Relatório do Log de Junçã'o de Pessoas | `Forms\UPM324.dfm` |
| 15 | `UPM531` | `PM531: TPM531` | PM531 - Cadastro de Linhas de Transporte | `Forms\UPM531.dfm` |
| 16 | `UPM533R` | `PM533R: TPM533R` | PM533R - Relaçã'o de Transportes Cadastrados | `Forms\UPM533R.dfm` |
| 17 | `UPM534` | `PM534: TPM534` | PM534 - Pesquisa de Transportes | `Forms\UPM534.dfm` |
| 18 | `UPM556` | `PM556: TPM556` | PM556 - Relaçã'o de Transporte Escolar | `Forms\UPM556.dfm` |
| 19 | `UPM613R` | `PM613R: TPM613R` | PM613R - Relaçã'o de Perfil | `Forms\UPM613R.dfm` |
| 20 | `UPM689` | `PM689: TPM689` | PM689 - Cadastro de Tipos de Transportes | `Forms\UPM689.dfm` |
| 21 | `UPM689R` | `PM689R: TPM689R` | PM689R - Relaçã'o de Transportes Usados | `Forms\UPM689R.dfm` |
| 22 | `UPM690` | `PM690: TPM690` | PM690 - Pesquisa de Tipos de Transportes | `Forms\UPM690.dfm` |
| 23 | `UPM919` | `PM919: TPM919` | PM919 - Carteira de Transporte Universitário | `Forms\UPM919.dfm` |
| 24 | `UPM920` | `PM920: TPM920` | PM920 - Pesquisa de Carteiras de Transporte Universitário | `Forms\UPM920.dfm` |
| 25 | `UPM962` | `PM962: TPM962` | PM962 - Cadastro de Motorista Escolar | `Forms\UPM962.dfm` |
| 26 | `UPM963` | `PM963: TPM963` | PM963 - Pesquisa de Motoristas | `Forms\UPM963.dfm` |

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
