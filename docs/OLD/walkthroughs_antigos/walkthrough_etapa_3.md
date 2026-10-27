# Walkthrough - Etapa 3: Domínio Profissionais, Especialidades (CBO) & Unidades de Saúde

## Resumo da Entrega
A **Etapa 3** foi concluída com sucesso no projeto de refatoração [`refatoracao/prefeitura-web`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web), contemplando **46 telas do executável Delphi original** ([`UPM020.pas`](file:///d:/Projetos/Delphi/Social/Prefeitura/Forms/UPM020.pas), [`UPM024.pas`](file:///d:/Projetos/Delphi/Social/Prefeitura/Forms/UPM024.pas), [`UPM457.pas`](file:///d:/Projetos/Delphi/Social/Prefeitura/Forms/UPM457.pas), etc.) e integrando a nomenclatura canônica auditada no banco de dados legados `social_SMA`.

---

## 1. Conciliação Canônica do Banco de Dados `social_SMA`

Conforme comprovado no catálogo oficial [`04_dominio_profissionais_e_unidades.md`](file:///d:/Projetos/Delphi/Documentacao/IA/Antigravity%20-rodrigo/output/dicionario/04_dominio_profissionais_e_unidades.md):
- **Tabela Mestra de Profissionais/Operadores**: **`ARQ020`** (chave primária `codope`, sequenciador ARQ999 `CodOpe`, presente em 456 telas Delphi).
- **Tabela de Estabelecimentos e Unidades de Saúde**: **`ARQ005`** / **`tb_Estabelecimento`** (chave `codfor`/`CodUni`, campo `cnes` de 7 dígitos do Datasus).
- **Tabela de Especialidades Médicas**: **`PMD006`** (chave `codesp`, `nomesp`, presente em 123 telas Delphi).
- **Tabela de Conselhos de Classe**: **`PMD024`** (`codcon`, `sigcon`: CRM, COREN, CRO, CRF, CRESS, CRP, CREFITO).
- **Catálogo CBO 2002**: **`tb_CBOUnificado`** e **`tb_CBOUnificadoProfissional`**.
- **Lotações e Permissões por Unidade**: **`UnidadeUsuario`** (vinculando `ARQ020.codope` com `ARQ005.codfor`).

---

## 2. Artefatos de Código Desenvolvidos

### 2.1. Banco de Dados & Lucid ORM
1. **Migration**: [`database/migrations/1761885935171_create_profissionais_unidades_tables.ts`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/database/migrations/1761885935171_create_profissionais_unidades_tables.ts)
   - Tabelas criadas: `unidades_saude`, `conselhos_profissionais`, `especialidades_medicas`, `cbos`, `profissionais` e `vinculos_lotacoes`.
2. **Models Lucid**:
   - [`app/models/unidade_saude.ts`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/unidade_saude.ts)
   - [`app/models/conselho_profissional.ts`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/conselho_profissional.ts)
   - [`app/models/especialidade_medica.ts`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/especialidade_medica.ts)
   - [`app/models/cbo.ts`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/cbo.ts)
   - [`app/models/profissional.ts`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/profissional.ts)
   - [`app/models/vinculo_lotacao.ts`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/models/vinculo_lotacao.ts)
3. **Seeder Canônico**:
   - [`database/seeders/profissionais_unidades_seeder.ts`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/database/seeders/profissionais_unidades_seeder.ts):
     - 7 Conselhos Profissionais (CRM, COREN, CRO, CRF, CRESS, CRP, CREFITO).
     - 10 Especialidades Médicas (Clínica Médica, Pediatria, Ginecologia, Cardiologia, Ortopedia, etc.).
     - 10 Ocupações CBO oficiais do Ministério da Saúde.
     - 5 Unidades Municipais com CNES real (UBS Central, USF Vila Esperança, CAPS II Girassol, UPA 24 Horas, Farmácia Central).
     - 8 Profissionais com lotações e vínculos cadastrados.

### 2.2. Backend & Controllers
- [`app/validators/unidade_validator.ts`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/validators/unidade_validator.ts): Validação de CNES 7 dígitos, razão social, tipos e contatos.
- [`app/validators/profissional_validator.ts`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/validators/profissional_validator.ts): Validação de CPF, CNS 15 dígitos e registros nos conselhos.
- [`app/controllers/unidades_controller.ts`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/controllers/unidades_controller.ts): CRUD completo, filtros e métricas de atenção primária e urgência.
- [`app/controllers/profissionais_controller.ts`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/app/controllers/profissionais_controller.ts): Listagem paginada, filtros cruzados por conselho e unidade, e endpoint de autocomplete ultrarrápido em cache Redis (`GET /api/profissionais/search?q=...`).

### 2.3. Frontend React 19 + shadcn/ui
- [`inertia/pages/unidades/index.tsx`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/inertia/pages/unidades/index.tsx):
  - 4 Cards de métricas (Total, Atenção Básica, UPAs 24h, CAPS).
  - Tabela com badges visuais de tipos de unidade, localização, equipes lotadas e toggle de status ativo/inativo.
  - Modal shadcn/ui de cadastro e edição de unidades com vínculo ao bairro.
- [`inertia/pages/profissionais/index.tsx`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/inertia/pages/profissionais/index.tsx):
  - 4 Cards de métricas (Total de operadores, Médicos CRM, Enfermagem COREN, Ativos).
  - Tabela com CPF, CNS, badges de conselho de classe, código CBO oficial e tags de lotação por posto.
  - Modal de cadastro de profissionais com simulação de sequenciador `codope` e lotação primária imediata.
- [`inertia/layouts/AppLayout.tsx`](file:///d:/Projetos/Delphi/refatoracao/prefeitura-web/inertia/layouts/AppLayout.tsx): Barra de navegação atualizada com acesso direto a Unidades e Profissionais.

---

## 3. Verificação & Testes

| Teste Realizado | Comando Executado | Resultado |
| :--- | :--- | :--- |
| **Migrações de Banco** | `node ace migration:run` | ✅ 6 tabelas criadas em 162ms |
| **Carga de Dados (Seeder)** | `node ace db:seed` | ✅ Populado com sucesso |
| **Tipagem TypeScript** | `npm run typecheck` | ✅ **0 erros** (`tsc --noEmit`) |
| **Bundle de Produção** | `npm run build` | ✅ **Compilado em 2.86s** |
| **Endpoint Unidades** | `GET http://localhost:3333/unidades` | ✅ **HTTP 200 OK** |
| **Endpoint Profissionais** | `GET http://localhost:3333/profissionais` | ✅ **HTTP 200 OK** |
| **API Autocomplete Redis** | `GET http://localhost:3333/api/profissionais/search?q=Dra` | ✅ **HTTP 200 OK (JSON)** |

```json
{
  "id": 1,
  "codope": 101,
  "nome": "Dra. Ana Paula Silveira",
  "cpf": "123.456.789-01",
  "conselho": "CRM",
  "numeroConselho": "CRM-SP 145890",
  "cbo": "Médico Clínico Geral",
  "unidades": ["UBS Central Dr. Mário Covas", "UPA 24 Horas Irmã Dulce"]
}
```

---

## 4. Portão de Execução: Próxima Etapa

Conforme a **Regra Mandatória de Portão de Execução (Gatekeeper)**, a Etapa 3 está finalizada e aguardamos o comando do usuário para o início da:
- **Etapa 4: Domínio Atendimento Clínico, Recepção & Prontuário Eletrônico (PEP)**
  - Fila de atendimento com Triagem Manchester (Classificação de Risco).
  - Prontuário Clínico Eletrônico com método SOAP.
  - Autocomplete CID-10 e CIAP-2.
  - FTD001 a FTD008 (74 tabelas legadas contempladas).
