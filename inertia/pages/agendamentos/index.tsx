import { useState } from 'react'
import { router } from '@inertiajs/react'
import {
  Calendar,
  Clock,
  User,
  Building2,
  Stethoscope,
  Filter,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Activity,
  Layers,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AppLayout from '~/layouts/AppLayout'
import NovoAgendamentoModal from '~/components/agendamentos/novo_agendamento_modal'
import DetalhesAgendamentoModal from '~/components/agendamentos/detalhes_agendamento_modal'

interface AgendamentoItem {
  id: number
  protocolo: string
  tipo: 'CONSULTA' | 'EXAME'
  especialidadeOuExame: string
  dataHora: string
  status: 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'ATENDIDO' | 'FALTOU'
  prioridade: string
  motivoCancelamento?: string | null
  observacoes?: string | null
  cidadao: { nome: string; cpf: string; cns: string }
  unidadeSolicitante: { nome: string; cnes: string }
  unidadeExecutante: { nome: string; cnes: string }
  profissional?: { nome: string } | null
}

interface CotaItem {
  id: number
  unidadeSolicitanteId: number
  tipo: string
  especialidadeOuExame: string
  mesAno: string
  cotaMensal: number
  cotaUtilizada: number
  saldoDisponivel: number
  unidadeSolicitante: { nome: string; cnes: string }
}

interface PageProps {
  agendamentos: {
    data: AgendamentoItem[]
    meta: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
    }
  }
  cotas: CotaItem[]
  unidades: Array<{ id: number; nome: string; cnes: string }>
  profissionais: Array<{ id: number; nome: string; cbo?: { nome: string } }>
  cidadaosRecentes: Array<{ id: number; nome: string; cpf: string; cns: string }>
  filters: {
    tipo?: string
    status?: string
    search?: string
  }
  mesAtual: string
}

export default function AgendamentosIndex({
  agendamentos,
  cotas,
  unidades,
  profissionais,
  cidadaosRecentes,
  filters,
  mesAtual,
}: PageProps) {
  const [novoModalOpen, setNovoModalOpen] = useState(false)
  const [detalhesAgendamento, setDetalhesAgendamento] = useState<AgendamentoItem | null>(null)
  const [search, setSearch] = useState(filters.search || '')
  const [tipo, setTipo] = useState(filters.tipo || '')
  const [status, setStatus] = useState(filters.status || '')

  const aplicarFiltros = (e: React.FormEvent) => {
    e.preventDefault()
    router.get(
      '/agendamentos',
      { search, tipo, status },
      { preserveState: true, replace: true }
    )
  }

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'AGENDADO':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-bold">Agendado</Badge>
      case 'CONFIRMADO':
        return <Badge variant="default" className="bg-emerald-600 text-white font-bold">Confirmado</Badge>
      case 'CANCELADO':
        return <Badge variant="destructive" className="font-bold">Cancelado</Badge>
      case 'ATENDIDO':
        return <Badge variant="outline" className="border-emerald-500 text-emerald-500 font-bold">Atendido</Badge>
      default:
        return <Badge variant="outline">{st}</Badge>
    }
  }

  // Contadores rápidos para KPIs
  const totalAgendados = agendamentos.meta.total
  const confirmados = agendamentos.data.filter((a) => a.status === 'CONFIRMADO').length
  const cancelados = agendamentos.data.filter((a) => a.status === 'CANCELADO').length

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Agendamento & Regulação de Vagas</h1>
            <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary bg-primary/5">
              Etapa 06
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Refatoração de UPM216 / UPM201 (PMD044) • Marcação de consultas e exames com cotas SUS e Redis Locks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setNovoModalOpen(true)} className="gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" /> Novo Agendamento
          </Button>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total de Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgendados}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Registrados no sistema municipal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Confirmados / Presentes</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{confirmados}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Munícipes confirmados na data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Cancelamentos / Faltas</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{cancelados}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Cotas estornadas automaticamente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Cotas Ativas (Mês {mesAtual})</CardTitle>
            <ShieldCheck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cotas.length} Regras</div>
            <p className="text-[11px] text-muted-foreground mt-1">Regulação municipal por UBS</p>
          </CardContent>
        </Card>
      </div>

      {/* MAPA DE COTAS MUNICIPAIS (PROGRESS BARS) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Painel de Cotas de Regulação Municipal SUS (Mês: {mesAtual})
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              Prevenção de sobrecarga com Redis Distributed Locks
            </span>
          </CardTitle>
          <CardDescription className="text-xs">
            Acompanhamento do teto mensal de encaminhamentos por unidade básica de saúde
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cotas.map((c) => {
              const perc = c.cotaMensal > 0 ? Math.round((c.cotaUtilizada / c.cotaMensal) * 100) : 0
              const isEsgotada = c.saldoDisponivel === 0
              return (
                <div
                  key={c.id}
                  className={`p-3.5 rounded-lg border space-y-2 transition ${
                    isEsgotada ? 'border-destructive/40 bg-destructive/5' : 'bg-card hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                        {c.unidadeSolicitante.nome}
                      </span>
                      <div className="font-bold text-xs text-foreground mt-0.5">{c.especialidadeOuExame}</div>
                    </div>
                    <Badge variant={isEsgotada ? 'destructive' : 'secondary'} className="font-mono text-[10px]">
                      {c.tipo}
                    </Badge>
                  </div>

                  {/* BARRA DE PROGRESSO DA COTA */}
                  <div className="space-y-1">
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isEsgotada ? 'bg-destructive' : perc > 80 ? 'bg-amber-500' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(100, perc)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                      <span>Utilizado: {c.cotaUtilizada} / {c.cotaMensal} ({perc}%)</span>
                      <span className={`font-bold ${isEsgotada ? 'text-destructive' : 'text-emerald-500'}`}>
                        {c.saldoDisponivel} vagas livres
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* FILTROS DE BUSCA */}
      <form onSubmit={aplicarFiltros} className="p-4 rounded-xl border bg-card flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por Protocolo, Munícipe, CPF ou CNS..."
            className="pl-9 text-xs"
          />
        </div>

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border bg-background outline-none cursor-pointer"
        >
          <option value="">Todos os Tipos</option>
          <option value="CONSULTA">Consultas Médicas</option>
          <option value="EXAME">Exames Diagnósticos</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border bg-background outline-none cursor-pointer"
        >
          <option value="">Todos os Status</option>
          <option value="AGENDADO">Agendado</option>
          <option value="CONFIRMADO">Confirmado</option>
          <option value="CANCELADO">Cancelado</option>
          <option value="ATENDIDO">Atendido</option>
        </select>

        <Button type="submit" size="sm" variant="secondary" className="text-xs">
          Filtrar
        </Button>
      </form>

      {/* TABELA DE AGENDAMENTOS REGULADOS */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider border-b">
              <tr>
                <th className="px-4 py-3">Protocolo</th>
                <th className="px-4 py-3">Paciente / Munícipe</th>
                <th className="px-4 py-3">Procedimento / Especialidade</th>
                <th className="px-4 py-3">Data e Horário</th>
                <th className="px-4 py-3">Local de Atendimento</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {agendamentos.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum agendamento encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                agendamentos.data.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/40 transition cursor-pointer"
                    onClick={() => setDetalhesAgendamento(item)}
                  >
                    <td className="px-4 py-3 font-mono font-bold text-primary">{item.protocolo}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{item.cidadao.nome}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">CPF: {item.cidadao.cpf}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{item.especialidadeOuExame}</div>
                      <span className="text-[10px] text-muted-foreground">{item.tipo}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-foreground font-semibold">
                      {new Date(item.dataHora).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <div>{item.unidadeExecutante.nome}</div>
                      {item.profissional && (
                        <div className="text-[10px] text-primary">{item.profissional.nome}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs font-semibold text-primary hover:underline"
                        onClick={() => setDetalhesAgendamento(item)}
                      >
                        Ver Guia
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAIS RADIX SHADCN */}
      <NovoAgendamentoModal
        open={novoModalOpen}
        onClose={() => setNovoModalOpen(false)}
        unidades={unidades}
        profissionais={profissionais}
        cidadaos={cidadaosRecentes}
        cotas={cotas}
      />

      <DetalhesAgendamentoModal
        open={!!detalhesAgendamento}
        onClose={() => setDetalhesAgendamento(null)}
        agendamento={detalhesAgendamento}
      />
    </div>
  )
}

AgendamentosIndex.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>
