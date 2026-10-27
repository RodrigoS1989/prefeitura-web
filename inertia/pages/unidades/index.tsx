import React, { useState, useEffect } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import {
  Building2,
  Stethoscope,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  MapPin,
  Users,
  Shield,
  Activity,
  Edit,
  Power,
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

interface UnidadeItem {
  id: number
  cnes: string
  razaoSocial: string
  nomeFantasia: string
  tipoUnidade: 'UBS' | 'USF' | 'UPA' | 'CAPS' | 'POLICLINICA' | 'FARMACIA' | 'CENTRO_ESPECIALIDADES' | 'HOSPITAL_MUNICIPAL'
  diretorTecnico: string | null
  telefone: string | null
  email: string | null
  endereco: string | null
  bairroId: number | null
  bairroNome: string
  horarioFuncionamento: string
  ativa: boolean
  totalProfissionais: number
  equipe: Array<{ id: number; nome: string; cargo: string }>
}

interface Props {
  unidades: {
    data: UnidadeItem[]
    meta: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
    }
  }
  stats: {
    total: number
    ubs: number
    upa: number
    caps: number
  }
  bairros: Array<{ id: number; nome: string }>
  filters: {
    search: string
    tipo: string
    status: string
  }
}

export default function UnidadesIndex({ unidades, stats, bairros, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '')
  const [tipoFilter, setTipoFilter] = useState(filters.tipo || '')
  const [statusFilter, setStatusFilter] = useState(filters.status || '')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUnidade, setEditingUnidade] = useState<UnidadeItem | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    cnes: '',
    razaoSocial: '',
    nomeFantasia: '',
    tipoUnidade: 'UBS' as UnidadeItem['tipoUnidade'],
    diretorTecnico: '',
    telefone: '',
    email: '',
    endereco: '',
    bairroId: bairros[0]?.id ? String(bairros[0].id) : '',
    horarioFuncionamento: 'Segunda a Sexta, 07:00 às 17:00',
    ativa: true,
  })

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== filters.search || tipoFilter !== filters.tipo || statusFilter !== filters.status) {
        router.get(
          '/unidades',
          {
            search: search || undefined,
            tipo: tipoFilter || undefined,
            status: statusFilter || undefined,
          },
          { preserveState: true, replace: true }
        )
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [search, tipoFilter, statusFilter])

  const handleOpenCreate = () => {
    setEditingUnidade(null)
    setFormData({
      cnes: '',
      razaoSocial: '',
      nomeFantasia: '',
      tipoUnidade: 'UBS',
      diretorTecnico: '',
      telefone: '',
      email: '',
      endereco: '',
      bairroId: bairros[0]?.id ? String(bairros[0].id) : '',
      horarioFuncionamento: 'Segunda a Sexta, 07:00 às 17:00',
      ativa: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (u: UnidadeItem) => {
    setEditingUnidade(u)
    setFormData({
      cnes: u.cnes,
      razaoSocial: u.razaoSocial,
      nomeFantasia: u.nomeFantasia,
      tipoUnidade: u.tipoUnidade,
      diretorTecnico: u.diretorTecnico || '',
      telefone: u.telefone || '',
      email: u.email || '',
      endereco: u.endereco || '',
      bairroId: u.bairroId ? String(u.bairroId) : '',
      horarioFuncionamento: u.horarioFuncionamento || '07:00 às 17:00',
      ativa: u.ativa,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUnidade) {
      router.put(`/unidades/${editingUnidade.id}`, formData, {
        onSuccess: () => setIsModalOpen(false),
      })
    } else {
      router.post('/unidades', formData, {
        onSuccess: () => setIsModalOpen(false),
      })
    }
  }

  const handleToggleStatus = (id: number) => {
    router.patch(`/unidades/${id}/toggle`, {}, { preserveScroll: true })
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'UBS':
      case 'USF':
        return <Badge className="bg-blue-600/10 text-blue-700 dark:text-blue-400 border-blue-500/30">{tipo}</Badge>
      case 'UPA':
        return <Badge className="bg-red-600/10 text-red-700 dark:text-red-400 border-red-500/30">{tipo} 24h</Badge>
      case 'CAPS':
        return <Badge className="bg-purple-600/10 text-purple-700 dark:text-purple-400 border-purple-500/30">{tipo}</Badge>
      case 'FARMACIA':
        return <Badge className="bg-amber-600/10 text-amber-700 dark:text-amber-400 border-amber-500/30">FARMÁCIA</Badge>
      default:
        return <Badge variant="secondary">{tipo}</Badge>
    }
  }

  return (
    <AppLayout>
      <Head title="Rede de Unidades de Saúde (UBS/CAPS/UPA) - Prefeitura Web" />

      <div className="container mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Subnavigation Bar - Domínio de Saúde */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                Etapa 3: Domínio de Saúde & Corpo Clínico
              </span>
              <Badge variant="outline" className="text-xs">
                social_SMA: ARQ005 / tb_Estabelecimento
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              Rede Municipal de Estabelecimentos de Saúde
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestão de Unidades Básicas (UBS), USF, UPAs 24h, CAPS e Farmácias com código CNES Datasus.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/profissionais">
              <Button variant="outline" className="gap-2">
                <Stethoscope className="h-4 w-4 text-emerald-600" />
                Ver Profissionais & CBO (ARQ020)
              </Button>
            </Link>
            <Button onClick={handleOpenCreate} className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              Nova Unidade
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total de Unidades</CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Shield className="h-3 w-3 text-emerald-500" /> Estabelecimentos ativos no CNES
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Atenção Básica (UBS/USF)</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.ubs}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Estratégia de Saúde da Família
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pronto Atendimento (UPA)</CardTitle>
              <Clock className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.upa}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Plantão de Urgência 24 Horas
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Atenção Psicossocial (CAPS)</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.caps}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Equipes multidisciplinares
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Search Bar */}
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por Nome da Unidade, Código CNES, Diretor Técnico ou Endereço..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={tipoFilter}
                  onChange={(e) => setTipoFilter(e.target.value)}
                  className="h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="">Todos os Tipos</option>
                  <option value="UBS">UBS (Básica)</option>
                  <option value="USF">USF (Família)</option>
                  <option value="UPA">UPA (Urgência)</option>
                  <option value="CAPS">CAPS (Psicossocial)</option>
                  <option value="POLICLINICA">Policlínica</option>
                  <option value="FARMACIA">Farmácia Municipal</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="">Todos os Status</option>
                  <option value="ativo">Somente Ativas</option>
                  <option value="false">Inativas</option>
                </select>

                {(search || tipoFilter || statusFilter) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch('')
                      setTipoFilter('')
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

        {/* Unidades Table */}
        <Card className="border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Unidades Cadastradas</CardTitle>
                <CardDescription className="text-xs">
                  {unidades.meta.total} estabelecimento(s) municipal(is) localizado(s)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[120px]">CNES</TableHead>
                    <TableHead>Estabelecimento / Razão Social</TableHead>
                    <TableHead className="w-[130px]">Tipo</TableHead>
                    <TableHead>Bairro / Localização</TableHead>
                    <TableHead>Diretor Técnico / Contato</TableHead>
                    <TableHead className="text-center w-[120px]">Equipe</TableHead>
                    <TableHead className="text-center w-[100px]">Status</TableHead>
                    <TableHead className="text-right w-[110px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unidades.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Building2 className="h-10 w-10 stroke-[1.5] mb-2 opacity-40" />
                          <p className="text-sm font-medium">Nenhuma unidade de saúde encontrada</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Tente refinar sua pesquisa ou cadastre uma nova unidade.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    unidades.data.map((u) => (
                      <TableRow key={u.id} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="font-mono font-semibold text-xs text-primary">
                          <Badge variant="outline" className="font-mono border-primary/30">
                            {u.cnes}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground">{u.nomeFantasia}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-xs">
                            {u.razaoSocial}
                          </div>
                        </TableCell>
                        <TableCell>{getTipoBadge(u.tipoUnidade)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-foreground">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="font-medium">{u.bairroNome}</span>
                          </div>
                          {u.endereco && (
                            <div className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                              {u.endereco}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium text-foreground">
                            {u.diretorTecnico || 'Não designado'}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                            {u.telefone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {u.telefone}
                              </span>
                            )}
                            {u.horarioFuncionamento && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {u.horarioFuncionamento}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            <Users className="h-3 w-3" />
                            {u.totalProfissionais} prof.
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            className="inline-flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                            title="Clique para alternar o status da unidade"
                          >
                            {u.ativa ? (
                              <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[11px]">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Ativa
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground gap-1 text-[11px]">
                                <XCircle className="h-3 w-3 text-muted-foreground" /> Inativa
                              </Badge>
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEdit(u)}
                              className="h-8 w-8 p-0"
                              title="Editar Unidade"
                            >
                              <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(u.id)}
                              className="h-8 w-8 p-0"
                              title={u.ativa ? 'Desativar Unidade' : 'Ativar Unidade'}
                            >
                              <Power className={`h-4 w-4 ${u.ativa ? 'text-amber-500' : 'text-emerald-500'}`} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {unidades.meta.lastPage > 1 && (
              <div className="flex items-center justify-between p-4 border-t text-xs text-muted-foreground">
                <span>
                  Mostrando página {unidades.meta.currentPage} de {unidades.meta.lastPage}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={unidades.meta.currentPage <= 1}
                    onClick={() => router.get('/unidades', { page: unidades.meta.currentPage - 1 })}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={unidades.meta.currentPage >= unidades.meta.lastPage}
                    onClick={() => router.get('/unidades', { page: unidades.meta.currentPage + 1 })}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Criação / Edição de Unidade */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              {editingUnidade ? 'Editar Unidade de Saúde' : 'Cadastrar Nova Unidade de Saúde'}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados cadastrais da unidade conforme registro no CNES/Datasus.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Código CNES (7 dígitos)*</label>
                <Input
                  required
                  maxLength={7}
                  pattern="\d{7}"
                  placeholder="Ex: 2078012"
                  value={formData.cnes}
                  onChange={(e) => setFormData({ ...formData, cnes: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Tipo de Estabelecimento*</label>
                <select
                  required
                  value={formData.tipoUnidade}
                  onChange={(e) => setFormData({ ...formData, tipoUnidade: e.target.value as any })}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="UBS">UBS - Unidade Básica de Saúde</option>
                  <option value="USF">USF - Saúde da Família</option>
                  <option value="UPA">UPA - Pronto Atendimento 24h</option>
                  <option value="CAPS">CAPS - Centro de Atenção Psicossocial</option>
                  <option value="POLICLINICA">Policlínica Municipal</option>
                  <option value="FARMACIA">Farmácia Municipal</option>
                  <option value="CENTRO_ESPECIALIDADES">Centro de Especialidades</option>
                  <option value="HOSPITAL_MUNICIPAL">Hospital Municipal</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Nome Fantasia*</label>
              <Input
                required
                placeholder="Ex: UBS Central Dr. Mário Covas"
                value={formData.nomeFantasia}
                onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Razão Social*</label>
              <Input
                required
                placeholder="Ex: Fundo Municipal de Saúde - UBS Central"
                value={formData.razaoSocial}
                onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Bairro</label>
                <select
                  value={formData.bairroId}
                  onChange={(e) => setFormData({ ...formData, bairroId: e.target.value })}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="">Selecione o Bairro...</option>
                  {bairros.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Diretor Técnico / Responsável</label>
                <Input
                  placeholder="Ex: Dra. Ana Paula Silveira"
                  value={formData.diretorTecnico}
                  onChange={(e) => setFormData({ ...formData, diretorTecnico: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Endereço Completo</label>
              <Input
                placeholder="Ex: Praça da Matriz, 100"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Telefone</label>
                <Input
                  placeholder="Ex: (11) 4589-1000"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">E-mail Institucional</label>
                <Input
                  type="email"
                  placeholder="ubs.central@prefeitura.sp.gov.br"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Horário de Funcionamento</label>
              <Input
                placeholder="Ex: Segunda a Sexta, 07:00 às 19:00"
                value={formData.horarioFuncionamento}
                onChange={(e) => setFormData({ ...formData, horarioFuncionamento: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingUnidade ? 'Salvar Alterações' : 'Cadastrar Unidade'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
