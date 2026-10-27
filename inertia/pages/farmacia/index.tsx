import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import {
  Pill,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Calendar,
  Building2,
  Clock,
  CheckCircle,
  FileText,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import AppLayout from '~/layouts/AppLayout'
import { DispensacaoModal } from '@/components/farmacia/dispensacao_modal'

interface MedicamentoItem {
  id: number
  codigo: string
  catmatCodigo: string | null
  nomeComercial: string | null
  principioAtivo: string
  concentracao: string
  formaFarmaceutica: string
  viaAdministracao: string
  unidadeFornecimento: string
  pertenceRemume: boolean
  cestaBasica: boolean
  tipoControle: string
  estoqueMinimo: number
  estoqueIdeal: number
  grupo?: { id: number; nome: string }
  lotes?: Array<{
    id: number
    numeroLote: string
    quantidadeAtual: number
    dataValidade: string
  }>
}

interface Props {
  medicamentos: {
    data: MedicamentoItem[]
    meta: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
    }
  }
  grupos: Array<{ id: number; nome: string; codigo: string }>
  unidades: Array<{ id: number; nomeFantasia: string; cnes: string }>
  estatisticas: {
    totalRemume: number
    totalLotes: number
    lotesCriticos: number
  }
  ultimasDispensacoes: Array<{
    id: number
    numeroDispensacao: string
    createdAt: string
    cidadao: { nomeCompleto: string }
    unidadeSaude: { nomeFantasia: string }
    itens: Array<{
      id: number
      quantidadeDispensa: number
      medicamento: { principioAtivo: string; concentracao: string }
      lote: { numeroLote: string; dataValidade: string }
    }>
  }>
  filtros: {
    search: string
    grupoId?: string
    apenasRemume?: boolean
  }
}

export default function FarmaciaIndex({
  medicamentos,
  grupos,
  unidades,
  estatisticas,
  ultimasDispensacoes,
  filtros,
}: Props) {
  const [searchTerm, setSearchTerm] = useState(filtros.search || '')
  const [selectedGrupo, setSelectedGrupo] = useState(filtros.grupoId || '')
  const [modalDispensacaoOpen, setModalDispensacaoOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.get(
      '/farmacia',
      {
        q: searchTerm.trim() || undefined,
        grupoId: selectedGrupo || undefined,
      },
      { preserveState: true }
    )
  }

  const calcularSaldoTotal = (med: MedicamentoItem) => {
    if (!med.lotes || med.lotes.length === 0) return 0
    return med.lotes.reduce((acc, l) => acc + l.quantidadeAtual, 0)
  }

  const formatarData = (dtString: string) => {
    if (!dtString) return '-'
    const d = new Date(dtString)
    return d.toLocaleDateString('pt-BR')
  }

  return (
    <AppLayout>
      <Head title="Farmácia Municipal & Controle FEFO (REMUME)" />

      <div className="space-y-6">
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                Farmácia Municipal & Assistência Farmacêutica
              </h1>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold">
                Etapa 05 (FEFO)
              </Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Catálogo REMUME, rastreabilidade por lote, controle de validade FEFO e dispensação ambulatorial.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setModalDispensacaoOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow"
            >
              <Pill className="h-4 w-4" /> Dispensar Medicamentos (FEFO)
            </Button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-emerald-500 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-semibold text-gray-500">
                Itens na REMUME Oficial
              </CardDescription>
              <CardTitle className="text-2xl font-black text-gray-900 dark:text-white">
                {estatisticas.totalRemume} Itens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> 100% Padronizados SUS
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-semibold text-gray-500">
                Lotes Ativos em Estoque
              </CardDescription>
              <CardTitle className="text-2xl font-black text-gray-900 dark:text-white">
                {estatisticas.totalLotes} Lotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                <Layers className="h-3 w-3" /> Rastreamento Sanitário por Lote
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-semibold text-gray-500">
                Vencimento Próximo (&lt; 90 dias)
              </CardDescription>
              <CardTitle className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {estatisticas.lotesCriticos} Lotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" /> Priorizados pelo algoritmo FEFO
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FILTROS E BUSCA */}
        <Card className="shadow-sm">
          <CardContent className="pt-4 pb-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por Princípio Ativo, Nome Comercial, Código ou CATMAT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>

              <select
                value={selectedGrupo}
                onChange={(e) => setSelectedGrupo(e.target.value)}
                className="h-9 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
              >
                <option value="">Todos os Grupos Farmacológicos</option>
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nome}
                  </option>
                ))}
              </select>

              <Button type="submit" variant="outline" className="text-xs h-9">
                <Filter className="h-3.5 w-3.5 mr-1.5" /> Filtrar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* TABELA DO CATÁLOGO REMUME */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">
                  Catálogo Oficial REMUME & Saldo de Lotes
                </CardTitle>
                <CardDescription className="text-xs">
                  Lista de medicamentos essenciais com priorização automática FEFO.
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {medicamentos.meta.total} medicamentos cadastrados
              </Badge>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="py-3 px-4">Código / CATMAT</th>
                  <th className="py-3 px-4">Princípio Ativo & Dosagem</th>
                  <th className="py-3 px-4">Forma / Via</th>
                  <th className="py-3 px-4">Grupo Farmacológico</th>
                  <th className="py-3 px-4">Lote Prioritário (FEFO)</th>
                  <th className="py-3 px-4 text-center">Saldo em Estoque</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {medicamentos.data.map((med) => {
                  const saldoTotal = calcularSaldoTotal(med)
                  const lotePrioritario = med.lotes && med.lotes.length > 0 ? med.lotes[0] : null

                  return (
                    <tr key={med.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition">
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-gray-900 dark:text-white">{med.codigo}</div>
                        {med.catmatCodigo && (
                          <div className="text-[10px] text-blue-600 dark:text-blue-400">
                            CATMAT: {med.catmatCodigo}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {med.principioAtivo} {med.concentracao}
                        </div>
                        {med.nomeComercial && (
                          <div className="text-[11px] text-gray-500">{med.nomeComercial}</div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800 dark:text-gray-200">{med.formaFarmaceutica}</div>
                        <div className="text-[10px] text-gray-400">Via {med.viaAdministracao}</div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px] bg-slate-50 dark:bg-slate-900">
                          {med.grupo?.nome || 'Geral'}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        {lotePrioritario ? (
                          <div className="space-y-0.5">
                            <span className="font-mono text-xs font-bold text-gray-900 dark:text-white block">
                              {lotePrioritario.numeroLote}
                            </span>
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                              <Clock className="h-3 w-3" /> Vence em {formatarData(lotePrioritario.dataValidade)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Sem lotes ativos</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className={`font-mono text-xs font-black ${saldoTotal > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                          {saldoTotal.toLocaleString()} {med.unidadeFornecimento.toLowerCase()}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Mín: {med.estoqueMinimo}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Button
                          onClick={() => setModalDispensacaoOpen(true)}
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 gap-1"
                        >
                          <Pill className="h-3 w-3" /> Dispensar
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* MODAL DE DISPENSAÇÃO FEFO */}
        <DispensacaoModal
          open={modalDispensacaoOpen}
          onOpenChange={setModalDispensacaoOpen}
          medicamentos={medicamentos.data}
          unidades={unidades}
        />
      </div>
    </AppLayout>
  )
}
