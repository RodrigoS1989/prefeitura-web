import React from 'react'
import { Link } from '@inertiajs/react'
import {
  Users,
  Stethoscope,
  Calendar,
  Pill,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Server,
  Database,
  Layers,
  Sparkles,
  Zap,
  Building2,
  MapPin,
  Syringe,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AppLayout from '~/layouts/AppLayout'

interface ModuleCard {
  title: string
  legacyOrigin: string
  description: string
  href: string
  icon: typeof Users
  stage: string
  status: 'ready' | 'planned'
  tags: string[]
}

const modules: ModuleCard[] = [
  {
    title: 'Cadastro Único de Cidadãos',
    legacyOrigin: 'UPM002.pas (32.436 linhas) • PMD018 • 25 telas',
    description: 'Gestão completa do munícipe: CPF, Cartão SUS (CNS), NIS/CadÚnico, endereço georreferenciado e prontuário integrado.',
    href: '/cidadaos',
    icon: Users,
    stage: 'Etapa 1',
    status: 'ready',
    tags: ['SUS', 'CadÚnico', 'Identificação Civil', '360°'],
  },
  {
    title: 'Território, Geografia & Parâmetros',
    legacyOrigin: 'UPM004.pas • UPM005.pas • IMO001 • IMO002 • 31 telas',
    description: 'Bairros, logradouros, secretarias municipais e parâmetros gerais da prefeitura com autocomplete cacheado em Redis.',
    href: '/territorio',
    icon: MapPin,
    stage: 'Etapa 2',
    status: 'ready',
    tags: ['Bairros', 'Logradouros', 'Secretarias', 'Redis Cache'],
  },
  {
    title: 'Profissionais, Especialidades (CBO) & Unidades',
    legacyOrigin: 'UPM020.pas • UPM024.pas • UPM457.pas • ARQ020 • ARQ005 • 46 telas',
    description: 'Rede física de saúde (UBS, USF, UPA 24h, CAPS) com CNES Datasus, conselhos de classe (CRM, COREN), CBO 2002 e lotações.',
    href: '/unidades',
    icon: Building2,
    stage: 'Etapa 3',
    status: 'ready',
    tags: ['CNES', 'ARQ020', 'Conselhos', 'CBO 2002', 'Lotações'],
  },
  {
    title: 'Atendimento Clínico & Prontuário (PEP)',
    legacyOrigin: 'UPM045.pas • UPM749.pas • FTD001 • FTD005 • FTD008 • 99 telas',
    description: 'Fila de recepção e acolhimento, triagem Manchester com cores de risco, prontuário estruturado SOAP e prescrição médica.',
    href: '/atendimentos',
    icon: Stethoscope,
    stage: 'Etapa 4',
    status: 'ready',
    tags: ['Manchester', 'CID-10', 'CIAP-2', 'Método SOAP', 'Prescrição'],
  },
  {
    title: 'Farmácia Municipal & Dispensação FEFO',
    legacyOrigin: 'UPM271.pas • UPM049.pas • tb_CatMatMaterial • ARQ036 • 83 telas',
    description: 'Balcão de dispensação com código de barras, controle de lotes, validade e rastreio pelo critério FEFO e padrão CatMat.',
    href: '/farmacia',
    icon: Pill,
    stage: 'Etapa 5',
    status: 'ready',
    tags: ['FEFO', 'Lotes', 'CatMat', 'Código de Barras'],
  },
  {
    title: 'Central de Agendamento, Regulação & Faturamento',
    legacyOrigin: 'UPM216.pas • UPM201.pas • PMD044 • tb_AgendaExame • 182 telas',
    description: 'Marcação de consultas e exames especializados, regulação de cotas municipais e bloqueio atômico de concorrência com Redis Locks.',
    href: '/agendamentos',
    icon: Calendar,
    stage: 'Etapa 6',
    status: 'ready',
    tags: ['Agenda SUS', 'Regulação', 'BPA/APAC', 'Redis Locks'],
  },
  {
    title: 'Assistência Social, CRAS, CREAS & Benefícios',
    legacyOrigin: 'UPM044.pas • UPM030.pas • tb_Familia • PMD083 • 27 telas',
    description: 'Prontuário SUAS, composição familiar, cálculo de renda per capita, programas PAIF/PAEFI e concessão de benefícios eventuais.',
    href: '/social',
    icon: HeartHandshake,
    stage: 'Etapa 7',
    status: 'planned',
    tags: ['SUAS', 'PAIF', 'Vulnerabilidade', 'Benefícios'],
  },
  {
    title: 'e-SUS Atenção Primária, Vigilância & Vacinas',
    legacyOrigin: 'UPM156.pas • UPM161.pas • tb_EsusCadDom • tb_EsusFAP • 129 telas',
    description: 'Fichas do e-SUS APS (Cadastro Domiciliar, Individual, FAI, FAP), vacinação nominal SIPNI e mapas de vigilância em saúde.',
    href: '/esus',
    icon: Syringe,
    stage: 'Etapa 8',
    status: 'ready',
    tags: ['e-SUS APS', 'SIPNI', 'Vacinas', 'Vigilância'],
  },
  {
    title: 'Frota Sanitária (TFD), RBAC & Auditoria',
    legacyOrigin: 'UPM080.pas • tb_AgendaVeiculo • ARQ024 • tb_EventoSistema • 26 telas',
    description: 'Gestão de viagens e transporte fora do domicílio (TFD), permissões granulares de usuários por posto e trilha de auditoria completa.',
    href: '/frota',
    icon: ShieldCheck,
    stage: 'Etapa 9',
    status: 'planned',
    tags: ['TFD', 'RBAC', 'Auditoria', 'Logs de Segurança'],
  },
  {
    title: 'Pipeline de Migração & Desacoplamento Total',
    legacyOrigin: '1.073 tabelas social_SMA • ARQ999 • 811 telas de apoio',
    description: 'Scripts de conciliação ETL em lote (bcp/SqlBulkCopy), integridade referencial, recalibração de sequenciadores e desligamento do Delphi.',
    href: '/dashboard',
    icon: Database,
    stage: 'Etapa 10',
    status: 'planned',
    tags: ['ETL', 'Carga Massiva', 'ARQ999', 'Homologação'],
  },
]

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-muted/40 p-8 sm:p-12">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1 border-primary/30 text-primary bg-primary/5">
              <Sparkles className="h-3 w-3" /> Modernização Delphi → AdonisJS Fullstack
            </Badge>
            <Badge variant="secondary" className="gap-1 font-mono text-xs text-emerald-600 bg-emerald-500/10 border-emerald-500/30">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Etapas 0 a 6 e 8 Concluídas (100% Operacionais)
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Prefeitura Municipal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              Gestão Integrada de Saúde & Cidadania
            </span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Ambiente reestruturado com a stack oficial moderna, re-plataformando o legado monolítico do projeto{' '}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">Prefeitura.dpr</code>{' '}
            (1.467 telas) em uma arquitetura web ágil, tipada e com 100% de cobertura.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/esus">
              <Button className="gap-2 shadow-sm">
                Acessar Etapa 8: e-SUS APS & Vacinas <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                Próxima: Etapa 9 (Frota Sanitária TFD)
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2 text-xs">
                Painel de Controle
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      </section>

      {/* Tech Architecture Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Arquitetura da Stack Instalada</h2>
            <p className="text-xs text-muted-foreground">Padrão oficial definido em C:\Users\rodrigo.santana\.gemini\config\stack</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-muted bg-card/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between text-muted-foreground">
                Backend Framework
                <Server className="h-4 w-4 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-lg font-bold">AdonisJS v6</div>
              <p className="text-xs text-muted-foreground">IoC Container, TypeScript estrito e rotas RESTful tipadas</p>
            </CardContent>
          </Card>

          <Card className="border-muted bg-card/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between text-muted-foreground">
                Ponte Fullstack & UI
                <Layers className="h-4 w-4 text-cyan-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-lg font-bold">Inertia + React 19</div>
              <p className="text-xs text-muted-foreground">SPA sem build de API separada, Tailwind v4 e shadcn/ui</p>
            </CardContent>
          </Card>

          <Card className="border-muted bg-card/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between text-muted-foreground">
                Banco de Dados & ORM
                <Database className="h-4 w-4 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-lg font-bold">Lucid ORM</div>
              <p className="text-xs text-muted-foreground">Compatível com MySQL 8.0 e SQL Server (social_SMA)</p>
            </CardContent>
          </Card>

          <Card className="border-muted bg-card/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between text-muted-foreground">
                Performance & Cache
                <Zap className="h-4 w-4 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-lg font-bold">Redis 7 Alpine</div>
              <p className="text-xs text-muted-foreground">Locks atômicos e cache de autocompletion indexado</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Domain Modules Refactoring Roadmap */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Roteiro de Refatoração por Etapas (100% Coberto)</h2>
          <p className="text-xs text-muted-foreground">
            Matriz de transposição das 1.467 telas Delphi distribuídas nos 10 domínios do banco social_SMA
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const Icon = m.icon
            const isCompleted = m.status === 'ready'
            return (
              <Card
                key={m.title}
                className={`flex flex-col justify-between transition-all hover:shadow-md ${
                  isCompleted ? 'border-emerald-500/30 bg-emerald-500/[0.02]' : 'hover:border-primary/50'
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge
                      variant={isCompleted ? 'default' : 'outline'}
                      className={`font-mono text-[11px] ${
                        isCompleted ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                      }`}
                    >
                      {m.stage}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{m.title}</CardTitle>
                  <CardDescription className="text-xs font-mono text-muted-foreground/80">
                    Origem: {m.legacyOrigin}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {m.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 border-t flex items-center justify-between">
                    {isCompleted ? (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Concluída
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground/60" /> Aguardando execução
                      </span>
                    )}
                    <Link href={m.href}>
                      <Button
                        variant={isCompleted ? 'outline' : 'ghost'}
                        size="sm"
                        className="h-7 text-xs gap-1"
                      >
                        Ver Módulo <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}

Home.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>
