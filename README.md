# 🏛️ Prefeitura Web - Ecossistema de Gestão Municipal

Sistema web integrado de gestão municipal para Saúde, Cidadania, Território e Assistência Social, refatorado a partir do sistema desktop legado Delphi (`Prefeitura.exe` / banco canônico `social_SMA`).

---

## 🚀 Tecnologias

- **Backend**: [AdonisJS 6](https://adonisjs.com) (Node.js 22+, TypeScript nativo)
- **Frontend**: [React 19](https://react.dev) + [Inertia.js v2](https://inertiajs.com)
- **Estilização**: Tailwind CSS v4 + Radix UI / Shadcn UI
- **ORM & Banco de Dados**: Lucid ORM + SQLite (desenvolvimento/testes) / PostgreSQL (produção)
- **Cache & Concorrência**: Redis 7 (Distributed Locks e Cache)
- **Testes**: Japa Test Runner + Supertest (Bateria de testes funcionais)

---

## 🪟 Diretriz Arquitetural de Interface: Todas as Telas em Modais

Fiel à ergonomia e agilidade operacional do sistema desktop original Delphi (`ShowModal`), **todas as telas de operação, cadastros, edições e visões detalhadas operam como Modais (Dialogs Radix UI / Shadcn)**:
- **Preservação Integral de Contexto**: A listagem principal permanece montada ao fundo, conservando estado de busca, filtros, paginação e scroll.
- **Operação Sem Troca Brusca de Página**: Cadastros, edições e perfis 360° abrem instantaneamente em modais ricos com navegação por abas.
- **Feedback & Recarga Transparente**: Ao confirmar a ação, os dados são salvos via Inertia e a listagem se atualiza sem recarregar a página inteira.
- **Padrão Obrigatório**: De agora em diante, todos os novos módulos (PEP, Farmácia, Agendamentos, etc.) devem seguir rigorosamente essa arquitetura baseada em modais.

---

## 📊 Status da Refatoração (12 Etapas)

| Etapa | Módulo | Status | Descrição |
|:---:|:---|:---:|:---|
| **E00** | Infraestrutura & Layout | ✅ Concluída | Setup AdonisJS 6, Inertia, React 19, Docker, Layout responsivo e RBAC |
| **E01** | Cidadãos & CadÚnico | ✅ Concluída | Refatoração UPM002 (`PMD018`), validação CNS/CPF, busca fonética e perfil 360° |
| **E02** | Território & Parâmetros | ✅ Concluída | Bairros (`IMO001`), logradouros (`IMO002`), secretarias e parâmetros institucionais |
| **E03** | Unidades & Profissionais | ✅ Concluída | Unidades de saúde (`ARQ005`/CNES), profissionais (`ARQ020`), CBO 2002 e lotações |
| **E04** | Atendimento Clínico & PEP | ✅ Concluída | Prontuário Eletrônico, acolhimento, triagem Manchester (5 cores) e SOAP clínico (`FTD*`), 100% em modais |
| **E05** | Farmácia Municipal | 📋 Planejada | Catálogo REMUME, dispensação, rastreabilidade de lotes e validade FEFO |
| **E06** | Agendamento & Regulação | 📋 Planejada | Agendamento de consultas e exames, regulação de cotas e Redis Locks |
| **E07** | Faturamento SUS | 📋 Planejada | Produção ambulatorial BPA/APAC e cruzamento SIGTAP |
| **E08** | Assistência Social (SUAS) | 📋 Planejada | Gestão de famílias, vulnerabilidade, PAIF/PAEFI e benefícios eventuais |
| **E09** | e-SUS APS & Vacinação | 📋 Planejada | Sala de vacina, cadeia de frio, visitas domiciliares ACS e notificações SINAN |
| **E10** | Frota Sanitária & TFD | 📋 Planejada | Gestão de veículos, ambulâncias, viagens TFD e controle de abastecimento |
| **E11** | Cadastros de Apoio & Auditoria | 📋 Planejada | Trilha de auditoria LGPD, relatórios gerenciais e segurança |

> 📁 Todos os planos executivos detalhados estão disponíveis no diretório [`docs/planos_etapas/`](docs/planos_etapas/).

---

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js >= 20.x
- NPM >= 10.x

### Passo a passo

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**:
   ```bash
   cp .env.example .env
   node ace generate:key
   ```

3. **Executar migrações e seeders de dados**:
   ```bash
   node ace migration:run
   node ace db:seed
   ```

4. **Executar em modo de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em: `http://localhost:3333`

5. **Executar suite de testes funcionais**:
   ```bash
   node ace test
   ```

6. **Gerar build de produção**:
   ```bash
   npm run build
   ```

---

## 📁 Estrutura do Projeto

```
prefeitura-web/
├── app/
│   ├── controllers/      # Controladores HTTP (Cidadãos, Território, Unidades, Profissionais, etc.)
│   ├── models/           # Modelos de dados Lucid ORM
│   ├── services/         # Camada de serviços de domínio e cache
│   └── validators/       # Schemas de validação VineJS
├── config/               # Configurações do AdonisJS (database, redis, auth, session, etc.)
├── database/
│   ├── migrations/       # Migrações versionadas do banco de dados
│   └── seeders/          # Carga de dados iniciais (CBOs, Bairros, Unidades, Usuários)
├── docs/                 # Documentação completa da refatoração e planos das etapas
│   ├── planos_etapas/    # Planos de execução detalhados para cada etapa (00 a 11)
│   └── DOCUMENTO_MESTRE_REFATORACAO.md
├── inertia/
│   ├── components/       # Componentes React de interface (Navbar, UI Radix, etc.)
│   ├── layouts/          # Layout mestre da aplicação
│   └── pages/            # Telas Inertia (Dashboard, Cidadãos, Território, Unidades, etc.)
├── start/
│   ├── kernel.ts         # Middleware HTTP
│   └── routes.ts         # Mapeamento de rotas e controllers
└── tests/
    └── functional/       # Testes funcionais automatizados
```

---

## 🔒 Licença & Confidencialidade

Projeto proprietário desenvolvido para modernização da gestão pública municipal. Todos os direitos reservados.
