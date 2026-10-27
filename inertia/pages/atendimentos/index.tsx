import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import Page from '@/components/page'
import {
  Activity,
  Plus,
  Search,
  Filter,
  Building2,
  Clock,
  User,
  Heart,
  Stethoscope,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Volume2,
  ArrowRight,
  FileText,
  BadgeAlert,
  Radio,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AcolhimentoModal } from '@/components/atendimentos/acolhimento_modal'
import { TriagemManchesterModal } from '@/components/atendimentos/triagem_manchester_modal'
import { CancelamentoModal } from '@/components/atendimentos/cancelamento_modal'
import { PepAtendimentoModal } from '@/components/atendimentos/pep_atendimento_modal'

interface AtendimentoItem {
  id: number
  numeroAtendimento: string
  senhaPainel: string
  status: 'AGUARDANDO_TRIAGEM' | 'EM_TRIAGEM' | 'AGUARDANDO_ATENDIMENTO' | 'EM_ATENDIMENTO' | 'EM_OBSERVACAO' | 'FINALIZADO' | 'CANCELADO'
  prioridadeManchester: 'VERMELHO' | 'LARANJA' | 'AMARELO' | 'VERDE' | 'AZUL'
  discriminadorManchester?: string | null
  tipoAtendimento: string
  tempoAlvoMinutos: number
  queixaPrincipal?: string | null
  sigiloso: boolean
  dataHoraChegada: string
  dataHoraTriagem?: string | null
  dataHoraInicioAtendimento?: string | null
  dataHoraFinalizacao?: string | null
  cidadao: {
    id: number
    nomeCompleto: string
    cpf?: string | null
    cns?: string | null
    dataNascimento?: string
  }
  profissional?: {
    id: number
    nome: string
  } | null
  sinaisVitais?: any
}

interface Props {
  atendimentos: AtendimentoItem[]
  unidades: Array<{ id: number; nomeFantasia: string; cnes: string }>
  profissionais: Array<{ id: number; nome: string }>
  cidadaos: Array<{ id: number; nomeCompleto: string; cpf?: string | null; cns?: string | null }>
  activeUnidadeId: number
  stats: {
    totalHoje: number
    aguardandoTriagem: number
    aguardandoAtendimento: number
    emAtendimento: number
    finalizados: number
    manchester: {
      vermelho: number
      laranja: number
      amarelo: number
      verde: number
      azul: number
    }
  }
  filters: {
    search?: string
    unidadeId?: string
    status?: string
    prioridade?: string
    tab?: string
  }
}

export default function AtendimentosIndexPage({
  atendimentos,
  unidades,
  profissionais,
  cidadaos,
  activeUnidadeId,
  stats,
  filters,
}: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [activeTab, setActiveTab] = useState(filters.tab || 'todos')

  // Modais
  const [acolhimentoOpen, setAcolhimentoOpen] = useState(false)
  const [triagemAtendimento, setTriagemAtendimento] = useState<AtendimentoItem | null>(null)
  const [cancelarAtendimento, setCancelarAtendimento] = useState<AtendimentoItem | null>(null)
  const [pepAtendimentoId, setPepAtendimentoId] = useState<number | null>(null)

  const handleFilter = (tab: string, unidadeId?: number) => {
    setActiveTab(tab)
    router.get(
      '/atendimentos',
      {
        tab,
        unidadeId: unidadeId !== undefined ? unidadeId : activeUnidadeId,
        search: searchTerm || undefined,
      },
      { preserveState: true }
    )
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleFilter(activeTab)
  }

  const handleChamar = (atendimento: AtendimentoItem) => {
    const profId = profissionais[0]?.id || 1
    router.post(
      `/atendimentos/${atendimento.id}/chamar`,
      { profissionalId: profId },
      {
        onSuccess: () => {
          setPepAtendimentoId(atendimento.id)
        },
      }
    )
  }

  const getManchesterBadge = (cor: string) => {
    switch (cor) {
      case 'VERMELHO':
        return <Badge className="bg-red-600 text-white hover:bg-red-700">Vermelho (0m)</Badge>
      case 'LARANJA':
        return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Laranja (10m)</Badge>
      case 'AMARELO':
        return <Badge className="bg-amber-500 text-white hover:bg-amber-600">Amarelo (60m)</Badge>
      case 'AZUL':
        return <Badge className="bg-blue-600 text-white hover:bg-blue-700">Azul (240m)</Badge>
      default:
        return <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">Verde (120m)</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AGUARDANDO_TRIAGEM':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300">Aguardando Triagem</Badge>
      case 'EM_TRIAGEM':
        return <Badge className="bg-yellow-500 text-white">Em Triagem</Badge>
      case 'AGUARDANDO_ATENDIMENTO':
        return <Badge variant="outline" className="text-blue-600 border-blue-300">Aguardando Consulta</Badge>
      case 'EM_ATENDIMENTO':
        return <Badge className="bg-blue-600 text-white">Em Atendimento</Badge>
      case 'EM_OBSERVACAO':
        return <Badge className="bg-purple-600 text-white">Em Observação</Badge>
      case 'FINALIZADO':
        return <Badge className="bg-emerald-600 text-white">Finalizado</Badge>
      case 'CANCELADO':
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Paciente em atendimento agora (para a TV / Painel)
  const emAtendimentoAgora = atendimentos.find((a) => a.status === 'EM_ATENDIMENTO')

  return (
    <Page title="Recepção, Triagem Manchester & PEP">
      <Head title="Atendimentos & PEP - Gestão de Saúde Municipal" />

      <div className="space-y-6">
        {/* Painel do Topo: Unidade & Ação Rápida */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-xl">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Fila de Atendimento & PEP
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Building2 className="h-3.5 w-3.5" />
                <span>Unidade:</span>
                <select
                  value={activeUnidadeId}
                  onChange={(e) => handleFilter(activeTab, Number(e.target.value))}
                  className="font-medium text-gray-900 dark:text-gray-100 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none"
                >
                  {unidades.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nomeFantasia} (CNES: {u.cnes})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setAcolhimentoOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Acolhimento (Abrir FAA)</span>
          </Button>
        </div>

        {/* Totem / Monitor de Chamada Eletrônica SUS */}
        {emAtendimentoAgora && (
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 rounded-xl shadow-md border border-blue-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-xl animate-pulse text-blue-300">
                <Volume2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-blue-300 font-bold flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-red-400" />
                  Painel de Chamada em Tempo Real
                </div>
                <div className="text-2xl font-black font-mono tracking-tight text-white">
                  SENHA {emAtendimentoAgora.senhaPainel}
                </div>
                <div className="text-xs text-blue-200">
                  Paciente: <strong>{emAtendimentoAgora.cidadao.nomeCompleto}</strong> • Encaminhado ao Consultório
                </div>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => setPepAtendimentoId(emAtendimentoAgora.id)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5"
            >
              <Stethoscope className="h-4 w-4" />
              Abrir Consultório / PEP
            </Button>
          </div>
        )}

        {/* Cards de Métricas da Unidade */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Card className="border-l-4 border-l-blue-600">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-gray-500">Total Hoje</div>
              <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
                {stats.totalHoje}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-gray-500">Aguardando Triagem</div>
              <div className="text-2xl font-bold font-mono text-yellow-600">
                {stats.aguardandoTriagem}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-600">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-gray-500">Aguardando Consulta</div>
              <div className="text-2xl font-bold font-mono text-indigo-600">
                {stats.aguardandoAtendimento}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-gray-500">Em Consulta Médica</div>
              <div className="text-2xl font-bold font-mono text-blue-600">
                {stats.emAtendimento}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-600 col-span-2 sm:col-span-1">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-gray-500">Finalizados Hoje</div>
              <div className="text-2xl font-bold font-mono text-emerald-600">
                {stats.finalizados}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barra de Distribuição Manchester */}
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <BadgeAlert className="h-4 w-4 text-gray-500" />
            Classificação Manchester na Fila:
          </span>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-red-600 text-white font-mono">
              Vermelho: {stats.manchester.vermelho}
            </Badge>
            <Badge className="bg-orange-500 text-white font-mono">
              Laranja: {stats.manchester.laranja}
            </Badge>
            <Badge className="bg-amber-500 text-white font-mono">
              Amarelo: {stats.manchester.amarelo}
            </Badge>
            <Badge className="bg-emerald-600 text-white font-mono">
              Verde: {stats.manchester.verde}
            </Badge>
            <Badge className="bg-blue-600 text-white font-mono">
              Azul: {stats.manchester.azul}
            </Badge>
          </div>
        </div>

        {/* Filtros e Abas de Fluxo */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Abas */}
          <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg text-xs">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'triagem', label: 'Triagem Manchester' },
              { id: 'consultorio', label: 'Consultório PEP' },
              { id: 'observacao', label: 'Observação' },
              { id: 'finalizados', label: 'Finalizados' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Busca */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar paciente, CPF, senha ou ficha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
            <Button type="submit" size="sm" variant="outline" className="text-xs">
              Buscar
            </Button>
          </form>
        </div>

        {/* Tabela de Atendimentos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Senha / Ficha</th>
                  <th className="py-3 px-4">Prioridade (Manchester)</th>
                  <th className="py-3 px-4">Cidadão / Paciente</th>
                  <th className="py-3 px-4">Chegada / Espera</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações Clínicas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {atendimentos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      Nenhum atendimento encontrado para esta unidade/filtro.
                    </td>
                  </tr>
                ) : (
                  atendimentos.map((at) => (
                    <tr
                      key={at.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {/* Senha e Ficha */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                          {at.senhaPainel}
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono">
                          {at.numeroAtendimento}
                        </div>
                      </td>

                      {/* Manchester */}
                      <td className="py-3 px-4">
                        <div>{getManchesterBadge(at.prioridadeManchester)}</div>
                        {at.discriminadorManchester && (
                          <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1 max-w-xs">
                            {at.discriminadorManchester}
                          </div>
                        )}
                      </td>

                      {/* Paciente */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {at.cidadao.nomeCompleto}
                        </div>
                        <div className="text-[11px] text-gray-500 flex gap-2">
                          {at.cidadao.cpf && <span>CPF: {at.cidadao.cpf}</span>}
                          {at.cidadao.cns && <span>CNS: {at.cidadao.cns}</span>}
                        </div>
                        {at.queixaPrincipal && (
                          <div className="text-[11px] text-gray-600 dark:text-gray-400 italic line-clamp-1">
                            "{at.queixaPrincipal}"
                          </div>
                        )}
                      </td>

                      {/* Chegada */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          <span>
                            {new Date(at.dataHoraChegada).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Alvo: {at.tempoAlvoMinutos} min
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">{getStatusBadge(at.status)}</td>

                      {/* Ações */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Triagem */}
                          {at.status === 'AGUARDANDO_TRIAGEM' && (
                            <Button
                              size="sm"
                              onClick={() => setTriagemAtendimento(at)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-2.5 flex items-center gap-1"
                            >
                              <Activity className="h-3.5 w-3.5" />
                              Triagem
                            </Button>
                          )}

                          {/* Chamar Paciente para Consultório */}
                          {at.status === 'AGUARDANDO_ATENDIMENTO' && (
                            <Button
                              size="sm"
                              onClick={() => handleChamar(at)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-2.5 flex items-center gap-1"
                            >
                              <Volume2 className="h-3.5 w-3.5" />
                              Chamar
                            </Button>
                          )}

                          {/* Abrir Prontuário PEP */}
                          {(at.status === 'EM_ATENDIMENTO' ||
                            at.status === 'EM_OBSERVACAO' ||
                            at.status === 'FINALIZADO') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setPepAtendimentoId(at.id)}
                              className="text-xs h-7 px-2.5 flex items-center gap-1 text-blue-600 hover:text-blue-700"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              PEP
                            </Button>
                          )}

                          {/* Cancelar (se ainda não finalizado) */}
                          {at.status !== 'FINALIZADO' && at.status !== 'CANCELADO' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setCancelarAtendimento(at)}
                              className="text-xs h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                              title="Cancelar atendimento"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modais de Fluxo da Etapa 4 */}
      <AcolhimentoModal
        open={acolhimentoOpen}
        onOpenChange={setAcolhimentoOpen}
        unidades={unidades}
        activeUnidadeId={activeUnidadeId}
        cidadaosIniciais={cidadaos}
        onSuccess={() => handleFilter(activeTab)}
      />

      <TriagemManchesterModal
        open={!!triagemAtendimento}
        onOpenChange={(open) => !open && setTriagemAtendimento(null)}
        atendimento={triagemAtendimento}
        onSuccess={() => handleFilter(activeTab)}
      />

      <CancelamentoModal
        open={!!cancelarAtendimento}
        onOpenChange={(open) => !open && setCancelarAtendimento(null)}
        atendimento={cancelarAtendimento}
        onSuccess={() => handleFilter(activeTab)}
      />

      <PepAtendimentoModal
        open={!!pepAtendimentoId}
        onOpenChange={(open) => !open && setPepAtendimentoId(null)}
        atendimentoId={pepAtendimentoId}
        profissionais={profissionais}
        onSuccess={() => handleFilter(activeTab)}
      />
    </Page>
  )
}
