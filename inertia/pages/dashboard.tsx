import { Link } from '@inertiajs/react'
import {
  Users,
  Activity,
  CalendarCheck,
  Pill,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Building,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AppLayout from '~/layouts/AppLayout'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel de Controle Municipal</h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <Building className="h-3.5 w-3.5" /> Unidade: Secretaria Municipal de Saúde & Cidadania
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs text-emerald-600 border-emerald-500/30 bg-emerald-500/5">
            ● Sistema Online (AdonisJS 6)
          </Badge>
          <Link href="/cidadaos?novo=true">
            <Button size="sm" className="gap-1.5">
              <Users className="h-4 w-4" /> Novo Cidadão
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Cidadãos Cadastrados</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.240</div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Etapa 01</span> (SUS & CadÚnico integrados)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Território & Logradouros</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 Bairros</div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-500 font-medium">Etapa 02</span> (Georreferenciamento ativo)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Unidades de Saúde</CardTitle>
            <CalendarCheck className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 UBS/USF</div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-500 font-medium">Etapa 03</span> (CNES & Tipo Unidade)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Profissionais & CBO</CardTitle>
            <Pill className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48 Médicos/Enf.</div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-500 font-medium">Etapa 03</span> (Conselhos & Lotações)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Modules Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Módulos do Sistema em Refatoração</CardTitle>
            <CardDescription className="text-xs">
              Status da migração das telas legadas do executável Prefeitura.exe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  E0
                </div>
                <div>
                  <p className="text-xs font-medium">Setup & Infraestrutura Docker</p>
                  <p className="text-[11px] text-muted-foreground">AdonisJS 6, Inertia, React 19, Tailwind v4, Redis</p>
                </div>
              </div>
              <Badge className="bg-emerald-600 font-mono text-[10px]">Concluída</Badge>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  E1
                </div>
                <div>
                  <p className="text-xs font-medium">Cidadãos & CadÚnico (PMD018)</p>
                  <p className="text-[11px] text-muted-foreground">UPM002.pas, CNS, busca reativa e perfil 360°</p>
                </div>
              </div>
              <Badge className="bg-emerald-600 font-mono text-[10px]">Concluída</Badge>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  E2
                </div>
                <div>
                  <p className="text-xs font-medium">Território & Geografia (IMO001, IMO002)</p>
                  <p className="text-[11px] text-muted-foreground">Bairros, logradouros, secretarias e parâmetros</p>
                </div>
              </div>
              <Badge className="bg-emerald-600 font-mono text-[10px]">Concluída</Badge>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  E3
                </div>
                <div>
                  <p className="text-xs font-medium">Profissionais & Unidades (ARQ020, ARQ005)</p>
                  <p className="text-[11px] text-muted-foreground">UBS, USF, UPAs, Conselhos, CBO 2002 e lotações</p>
                </div>
              </div>
              <Badge className="bg-emerald-600 font-mono text-[10px]">Concluída</Badge>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-primary/40 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                  E4
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Atendimento Clínico & PEP (FTD001-FTD008)</p>
                  <p className="text-[11px] text-muted-foreground">Fila Manchester, sinais vitais e prontuário SOAP</p>
                </div>
              </div>
              <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[10px]">Próxima Etapa</Badge>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/10 opacity-70">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded bg-muted/20 text-muted-foreground flex items-center justify-center font-bold text-xs">
                  E5-E11
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Farmácia, Agendamentos, Faturamento, SUAS, e-SUS, Frotas & Apoio</p>
                  <p className="text-[11px] text-muted-foreground">Planos executivos completos gerados e prontos para desenvolvimento sequencial</p>
                </div>
              </div>
              <Badge variant="secondary" className="font-mono text-[10px]">Planejadas</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Métricas do Projeto</CardTitle>
            <CardDescription className="text-xs">
              Conexões e recursos gerenciados no ambiente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Banco de Dados Municipal (social_SMA)</span>
                <span className="font-mono font-medium">1.073 tabelas ativas</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[100%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Arquitetura de Cache (Redis 7)</span>
                <span className="font-mono font-medium">Porta 6379</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-red-500 rounded-full w-[100%]" />
              </div>
            </div>

            <div className="pt-2">
              <Link href="/">
                <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                  Voltar à Apresentação Geral <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>
