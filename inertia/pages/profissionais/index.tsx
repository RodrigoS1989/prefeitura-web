import React, { useState, useEffect } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import {
  Stethoscope,
  Building2,
  Plus,
  Search,
  CheckCircle2,
  Phone,
  Mail,
  Users,
  Shield,
  Activity,
  Award,
  IdCard,
  Edit,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import AppLayout from '~/layouts/AppLayout'

interface LotacaoItem {
  id: number
  unidadeId: number
  unidadeNome: string
  especialidadeNome: string
  cargaHoraria: number
  cargo: string | null
}

interface ProfissionalItem {
  id: number
  codope: number | null
  nome: string
  cpf: string
  cns: string | null
  email: string | null
  telefone: string | null
  conselhoSigla: string | null
  numeroConselho: string | null
  cboCodigo: string | null
  cboOcupacao: string | null
  status: 'ativo' | 'inativo' | 'afastado'
  lotacoes: LotacaoItem[]
}

interface Props {
  profissionais: {
    data: ProfissionalItem[]
    meta: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
    }
  }
  stats: {
    total: number
    medicos: number
    enfermeiros: number
    ativos: number
  }
  conselhos: Array<{ id: number; sigla: string; nome: string }>
  especialidades: Array<{ id: number; codigo: string; nome: string }>
  cbos: Array<{ id: number; codigo: string; ocupacao: string }>
  unidades: Array<{ id: number; nome: string; cnes: string }>
  filters: {
    search: string
    conselhoId: string
    unidadeId: string
    status: string
  }
}

export default function ProfissionaisIndex({
  profissionais,
  stats,
  conselhos,
  especialidades,
  cbos,
  unidades,
  filters,
}: Props) {
  const [search, setSearch] = useState(filters.search || '')
  const [conselhoFilter, setConselhoFilter] = useState(filters.conselhoId || '')
  const [unidadeFilter, setUnidadeFilter] = useState(filters.unidadeId || '')
  const [statusFilter, setStatusFilter] = useState(filters.status || '')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProfissional, setEditingProfissional] = useState<ProfissionalItem | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cns: '',
    email: '',
    telefone: '',
    conselhoId: conselhos[0]?.id ? String(conselhos[0].id) : '',
    numeroConselho: '',
    cboId: cbos[0]?.id ? String(cbos[0].id) : '',
    status: 'ativo' as ProfissionalItem['status'],
    unidadeId: unidades[0]?.id ? String(unidades[0].id) : '',
    especialidadeId: especialidades[0]?.id ? String(especialidades[0].id) : '',
    cargaHoraria: 40,
    cargo: 'Profissional de Saúde',
  })

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        search !== filters.search ||
        conselhoFilter !== filters.conselhoId ||
        unidadeFilter !== filters.unidadeId ||
        statusFilter !== filters.status
      ) {
        router.get(
          '/profissionais',
          {
            search: search || undefined,
            conselhoId: conselhoFilter || undefined,
            unidadeId: unidadeFilter || undefined,
            status: statusFilter || undefined,
          },
          { preserveState: true, replace: true }
        )
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [search, conselhoFilter, unidadeFilter, statusFilter])

  const handleOpenCreate = () => {
    setEditingProfissional(null)
    setFormData({
      nome: '',
      cpf: '',
      cns: '',
      email: '',
      telefone: '',
      conselhoId: conselhos[0]?.id ? String(conselhos[0].id) : '',
      numeroConselho: '',
      cboId: cbos[0]?.id ? String(cbos[0].id) : '',
      status: 'ativo',
      unidadeId: unidades[0]?.id ? String(unidades[0].id) : '',
      especialidadeId: especialidades[0]?.id ? String(especialidades[0].id) : '',
      cargaHoraria: 40,
      cargo: 'Profissional de Saúde',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (p: ProfissionalItem) => {
    setEditingProfissional(p)
    const matchingConselho = conselhos.find((c) => c.sigla === p.conselhoSigla)
    const matchingCbo = cbos.find((c) => c.codigo === p.cboCodigo)

    setFormData({
      nome: p.nome,
      cpf: p.cpf,
      cns: p.cns || '',
      email: p.email || '',
      telefone: p.telefone || '',
      conselhoId: matchingConselho ? String(matchingConselho.id) : '',
      numeroConselho: p.numeroConselho || '',
      cboId: matchingCbo ? String(matchingCbo.id) : '',
      status: p.status,
      unidadeId: p.lotacoes[0]?.unidadeId ? String(p.lotacoes[0].unidadeId) : '',
      especialidadeId: '',
      cargaHoraria: p.lotacoes[0]?.cargaHoraria || 40,
      cargo: p.lotacoes[0]?.cargo || '',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProfissional) {
      router.put(`/profissionais/${editingProfissional.id}`, formData, {
        onSuccess: () => setIsModalOpen(false),
      })
    } else {
      router.post('/profissionais', formData, {
        onSuccess: () => setIsModalOpen(false),
      })
    }
  }

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'ativo':
        return (
          <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[11px]">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Ativo
          </Badge>
        )
      case 'afastado':
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-500/30 text-[11px]">
            Afastado
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground text-[11px]">
            Inativo
          </Badge>
        )
    }
  }

  return (
    <AppLayout>
      <Head title="Corpo Clínico & Operadores (ARQ020) - Prefeitura Web" />

      <div className="container mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Subnavigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                Etapa 3: Domínio de Saúde & Corpo Clínico
              </span>
              <Badge variant="outline" className="text-xs">
                social_SMA: ARQ020 / tb_CBOUnificado / UnidadeUsuario
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1 flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary" />
              Profissionais de Saúde & Ocupações (CBO)
            </h1>
            <p className="text-sm text-muted-foreground">
              Cadastro de médicos, enfermeiros, odontólogos e técnicos vinculados aos conselhos de classe e unidades.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/unidades">
              <Button variant="outline" className="gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                Ver Unidades de Saúde (ARQ005)
              </Button>
            </Link>
            <Button onClick={handleOpenCreate} className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              Novo Profissional
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total de Profissionais</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Shield className="h-3 w-3 text-emerald-500" /> Registros ativos no banco ARQ020
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Médicos (CRM)</CardTitle>
              <Stethoscope className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.medicos}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Clínicos e especialistas</p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Enfermagem (COREN)</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.enfermeiros}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Enfermeiros e técnicos</p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Profissionais em Atividade</CardTitle>
              <Award className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats.ativos}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Lotação ativa em unidades</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por Nome do Profissional, CPF, CNS ou Registro no Conselho (ex: CRM, COREN)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={conselhoFilter}
                  onChange={(e) => setConselhoFilter(e.target.value)}
                  className="h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="">Todos os Conselhos</option>
                  {conselhos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.sigla} - {c.nome}
                    </option>
                  ))}
                </select>

                <select
                  value={unidadeFilter}
                  onChange={(e) => setUnidadeFilter(e.target.value)}
                  className="h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="">Todas as Unidades</option>
                  {unidades.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nome}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="">Todos os Status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="afastado">Afastado</option>
                </select>

                {(search || conselhoFilter || unidadeFilter || statusFilter) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch('')
                      setConselhoFilter('')
                      setUnidadeFilter('')
                      setStatusFilter('')
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Profissionais Cadastrados</CardTitle>
                <CardDescription className="text-xs">
                  {profissionais.meta.total} operador(es) / profissional(is) localizado(s)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[80px]">CodOpe</TableHead>
                    <TableHead>Profissional / Documentos</TableHead>
                    <TableHead>Conselho / Registro</TableHead>
                    <TableHead>Ocupação CBO Oficial</TableHead>
                    <TableHead>Lotações Ativas (Postos)</TableHead>
                    <TableHead className="text-center w-[100px]">Status</TableHead>
                    <TableHead className="text-right w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profissionais.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Stethoscope className="h-10 w-10 stroke-[1.5] mb-2 opacity-40" />
                          <p className="text-sm font-medium">Nenhum profissional encontrado</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Verifique os filtros de pesquisa ou cadastre um novo profissional.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    profissionais.data.map((p) => (
                      <TableRow key={p.id} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="font-mono text-xs text-muted-foreground font-semibold">
                          #{p.codope || p.id}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                            {p.nome}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span className="font-mono">{p.cpf}</span>
                            {p.cns && (
                              <span className="flex items-center gap-1 font-mono text-[11px] text-primary/80">
                                <IdCard className="h-3 w-3" /> CNS: {p.cns}
                              </span>
                            )}
                          </div>
                          {(p.email || p.telefone) && (
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                              {p.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" /> {p.email}
                                </span>
                              )}
                              {p.telefone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" /> {p.telefone}
                                </span>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {p.numeroConselho ? (
                            <Badge variant="outline" className="font-medium text-xs border-primary/30 text-primary">
                              {p.numeroConselho}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Sem registro</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium text-foreground">
                            {p.cboOcupacao || 'Não vinculado'}
                          </div>
                          {p.cboCodigo && (
                            <div className="text-[11px] font-mono text-muted-foreground">
                              CBO: {p.cboCodigo}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {p.lotacoes.length === 0 ? (
                            <span className="text-xs text-muted-foreground italic">Sem lotação</span>
                          ) : (
                            <div className="space-y-1">
                              {p.lotacoes.map((l) => (
                                <div
                                  key={l.id}
                                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-muted border border-border mr-1"
                                >
                                  <Building2 className="h-3 w-3 text-muted-foreground" />
                                  <span className="font-medium">{l.unidadeNome}</span>
                                  <span className="text-muted-foreground">({l.cargaHoraria}h)</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">{getStatusBadge(p.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(p)}
                            className="h-8 w-8 p-0"
                            title="Editar Profissional"
                          >
                            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {profissionais.meta.lastPage > 1 && (
              <div className="flex items-center justify-between p-4 border-t text-xs text-muted-foreground">
                <span>
                  Mostrando página {profissionais.meta.currentPage} de {profissionais.meta.lastPage}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={profissionais.meta.currentPage <= 1}
                    onClick={() =>
                      router.get('/profissionais', { page: profissionais.meta.currentPage - 1 })
                    }
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={profissionais.meta.currentPage >= profissionais.meta.lastPage}
                    onClick={() =>
                      router.get('/profissionais', { page: profissionais.meta.currentPage + 1 })
                    }
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Criação / Edição de Profissional */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              {editingProfissional ? 'Editar Profissional de Saúde' : 'Cadastrar Novo Profissional'}
            </DialogTitle>
            <DialogDescription>
              Registro oficial de operador/profissional no banco ARQ020 com vínculo ao Conselho e CBO.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Nome Completo*</label>
              <Input
                required
                placeholder="Ex: Dra. Juliana Santos Rocha"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">CPF*</label>
                <Input
                  required
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Cartão SUS (CNS 15 dígitos)</label>
                <Input
                  maxLength={15}
                  placeholder="700101234560001"
                  value={formData.cns}
                  onChange={(e) => setFormData({ ...formData, cns: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Conselho Profissional</label>
                <select
                  value={formData.conselhoId}
                  onChange={(e) => setFormData({ ...formData, conselhoId: e.target.value })}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="">Selecione o Conselho...</option>
                  {conselhos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.sigla} - {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Número de Registro no Conselho</label>
                <Input
                  placeholder="Ex: CRM-SP 145890"
                  value={formData.numeroConselho}
                  onChange={(e) => setFormData({ ...formData, numeroConselho: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Ocupação Oficial (CBO 2002)</label>
                <select
                  value={formData.cboId}
                  onChange={(e) => setFormData({ ...formData, cboId: e.target.value })}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="">Selecione o CBO...</option>
                  {cbos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.codigo} - {c.ocupacao}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Situação Cadastral</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="afastado">Afastado / Licença</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Telefone de Contato</label>
                <Input
                  placeholder="(11) 98765-4321"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">E-mail Profissional</label>
                <Input
                  type="email"
                  placeholder="profissional@saude.gov.br"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {!editingProfissional && (
              <div className="p-3 rounded-lg border bg-muted/40 space-y-3">
                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-primary" />
                  Lotação Inicial em Unidade de Saúde (UnidadeUsuario)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-muted-foreground">Unidade de Saúde</label>
                    <select
                      value={formData.unidadeId}
                      onChange={(e) => setFormData({ ...formData, unidadeId: e.target.value })}
                      className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                      <option value="">Selecione a Unidade...</option>
                      {unidades.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nome} (CNES {u.cnes})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-muted-foreground">Especialidade no Posto</label>
                    <select
                      value={formData.especialidadeId}
                      onChange={(e) => setFormData({ ...formData, especialidadeId: e.target.value })}
                      className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                      <option value="">Selecione Especialidade...</option>
                      {especialidades.map((esp) => (
                        <option key={esp.id} value={esp.id}>
                          {esp.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-muted-foreground">Carga Horária Semanal (horas)</label>
                    <Input
                      type="number"
                      min={1}
                      max={60}
                      value={formData.cargaHoraria}
                      onChange={(e) => setFormData({ ...formData, cargaHoraria: Number(e.target.value) })}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-muted-foreground">Função / Cargo</label>
                    <Input
                      placeholder="Ex: Plantonista / Médico ESF"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingProfissional ? 'Salvar Alterações' : 'Cadastrar Profissional'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
