import React, { useState, useEffect } from 'react'
import { Head, router } from '@inertiajs/react'
import {
  MapPin,
  Building2,
  Navigation,
  Plus,
  Search,
  Trash2,
  Home,
  Mail,
  Phone,
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

interface BairroItem {
  id: number
  nome: string
  zona: 'urbana' | 'rural'
  municipioId: number | null
}

interface LogradouroItem {
  id: number
  tipo: string
  nome: string
  cep: string | null
  bairroId: number | null
  bairroNome: string
  municipioNome: string
}

interface SecretariaItem {
  id: number
  nome: string
  sigla: string | null
  responsavel: string | null
  email: string | null
  telefone: string | null
  endereco: string | null
}

interface MunicipioItem {
  id: number
  nome: string
  uf: string
}

interface Props {
  bairros: BairroItem[]
  logradouros: LogradouroItem[]
  secretarias: SecretariaItem[]
  municipios: MunicipioItem[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
  filters: {
    search: string
    tab: string
  }
}

export const TerritorioIndex: React.FC<Props> = ({
  bairros,
  logradouros,
  secretarias,
  municipios,
  pagination,
  filters,
}) => {
  const [activeTab, setActiveTab] = useState<'logradouros' | 'bairros' | 'secretarias'>(
    (filters.tab as any) || 'logradouros'
  )
  const [search, setSearch] = useState(filters.search || '')

  // Modals
  const [openBairroModal, setOpenBairroModal] = useState(false)
  const [openLogradouroModal, setOpenLogradouroModal] = useState(false)
  const [openSecretariaModal, setOpenSecretariaModal] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    type: 'bairro' | 'logradouro' | 'secretaria'
    id: number
    name: string
  }>({
    open: false,
    type: 'bairro',
    id: 0,
    name: '',
  })

  // Form states
  const [bairroForm, setBairroForm] = useState({ nome: '', zona: 'urbana' as 'urbana' | 'rural' })
  const [logradouroForm, setLogradouroForm] = useState({
    tipo: 'Rua',
    nome: '',
    cep: '',
    bairroId: bairros[0]?.id || '',
  })
  const [secretariaForm, setSecretariaForm] = useState({
    nome: '',
    sigla: '',
    responsavel: '',
    email: '',
    telefone: '',
    endereco: '',
  })

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (filters.search || '')) {
        router.get(
          '/territorio',
          { search, tab: activeTab },
          { preserveState: true, replace: true }
        )
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [search])

  const handleTabChange = (tab: 'logradouros' | 'bairros' | 'secretarias') => {
    setActiveTab(tab)
    router.get(
      '/territorio',
      { search: '', tab },
      { preserveState: true, replace: true }
    )
  }

  const handleCreateBairro = (e: React.FormEvent) => {
    e.preventDefault()
    router.post(
      '/territorio/bairros',
      {
        ...bairroForm,
        municipioId: municipios[0]?.id || 1,
      },
      {
        onSuccess: () => {
          setOpenBairroModal(false)
          setBairroForm({ nome: '', zona: 'urbana' })
        },
      }
    )
  }

  const handleCreateLogradouro = (e: React.FormEvent) => {
    e.preventDefault()
    router.post(
      '/territorio/logradouros',
      {
        ...logradouroForm,
        municipioId: municipios[0]?.id || 1,
      },
      {
        onSuccess: () => {
          setOpenLogradouroModal(false)
          setLogradouroForm({ tipo: 'Rua', nome: '', cep: '', bairroId: bairros[0]?.id || '' })
        },
      }
    )
  }

  const handleCreateSecretaria = (e: React.FormEvent) => {
    e.preventDefault()
    router.post(
      '/territorio/secretarias',
      secretariaForm,
      {
        onSuccess: () => {
          setOpenSecretariaModal(false)
          setSecretariaForm({
            nome: '',
            sigla: '',
            responsavel: '',
            email: '',
            telefone: '',
            endereco: '',
          })
        },
      }
    )
  }

  const confirmDelete = () => {
    if (deleteDialog.type === 'bairro') {
      router.delete(`/territorio/bairros/${deleteDialog.id}`, {
        onSuccess: () => setDeleteDialog({ ...deleteDialog, open: false }),
      })
    } else if (deleteDialog.type === 'logradouro') {
      router.delete(`/territorio/logradouros/${deleteDialog.id}`, {
        onSuccess: () => setDeleteDialog({ ...deleteDialog, open: false }),
      })
    } else {
      router.delete(`/territorio/secretarias/${deleteDialog.id}`, {
        onSuccess: () => setDeleteDialog({ ...deleteDialog, open: false }),
      })
    }
  }

  return (
    <AppLayout>
      <Head title="Território, Geografia & Bairros - Prefeitura Web" />

      <div className="space-y-6">
        {/* Header com métricas */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Divisões Territoriais & Geografia</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Refatoração dos cadastros de Logradouros (UPM983), Bairros (UPM985) e Secretarias Municipais (UPM393).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'logradouros' && (
              <Button onClick={() => setOpenLogradouroModal(true)} className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" /> Novo Logradouro
              </Button>
            )}
            {activeTab === 'bairros' && (
              <Button onClick={() => setOpenBairroModal(true)} className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" /> Novo Bairro
              </Button>
            )}
            {activeTab === 'secretarias' && (
              <Button onClick={() => setOpenSecretariaModal(true)} className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" /> Nova Secretaria
              </Button>
            )}
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-semibold">Logradouros Oficiais</CardDescription>
              <CardTitle className="text-3xl font-extrabold text-foreground flex items-center justify-between">
                {pagination.total}
                <Navigation className="h-6 w-6 text-primary/40" />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Ruas, avenidas, praças e travessas catalogadas
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-semibold">Bairros e Setores</CardDescription>
              <CardTitle className="text-3xl font-extrabold text-foreground flex items-center justify-between">
                {bairros.length}
                <Home className="h-6 w-6 text-emerald-500/40" />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Divisões administrativas urbanas e rurais
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-semibold">Secretarias Municipais</CardDescription>
              <CardTitle className="text-3xl font-extrabold text-foreground flex items-center justify-between">
                {secretarias.length}
                <Building2 className="h-6 w-6 text-amber-500/40" />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Órgãos executivos e secretarias ativas
            </CardContent>
          </Card>
        </div>

        {/* Abas de Navegação & Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
          <div className="flex gap-2 p-1 bg-muted/60 rounded-lg w-fit">
            <button
              onClick={() => handleTabChange('logradouros')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'logradouros'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Logradouros ({pagination.total})
            </button>
            <button
              onClick={() => handleTabChange('bairros')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'bairros'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Bairros ({bairros.length})
            </button>
            <button
              onClick={() => handleTabChange('secretarias')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'secretarias'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Secretarias ({secretarias.length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`Buscar em ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        {/* Conteúdo da Aba: Logradouros */}
        {activeTab === 'logradouros' && (
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead className="w-28">Tipo</TableHead>
                    <TableHead>Logradouro / Nome</TableHead>
                    <TableHead>Bairro</TableHead>
                    <TableHead>CEP</TableHead>
                    <TableHead className="w-24 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logradouros.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhum logradouro encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    logradouros.map((l) => (
                      <TableRow key={l.id} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="font-mono text-xs text-muted-foreground">#{l.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-medium">
                            {l.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">{l.nome}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{l.bairroNome}</TableCell>
                        <TableCell className="font-mono text-xs text-primary">{l.cep || '—'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                type: 'logradouro',
                                id: l.id,
                                name: `${l.tipo} ${l.nome}`,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Conteúdo da Aba: Bairros */}
        {activeTab === 'bairros' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {bairros.map((b) => (
              <Card key={b.id} className="border-border/60 hover:shadow-md transition-all">
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">{b.nome}</CardTitle>
                    <CardDescription className="text-xs mt-1">Município Sede</CardDescription>
                  </div>
                  <Badge
                    variant={b.zona === 'rural' ? 'secondary' : 'default'}
                    className="capitalize text-[11px]"
                  >
                    Zona {b.zona}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0 flex items-center justify-between border-t mt-2 pt-3">
                  <span className="text-xs text-muted-foreground font-mono">Código #{b.id}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-destructive hover:bg-destructive/10"
                    onClick={() =>
                      setDeleteDialog({
                        open: true,
                        type: 'bairro',
                        id: b.id,
                        name: b.nome,
                      })
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Excluir
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Conteúdo da Aba: Secretarias */}
        {activeTab === 'secretarias' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secretarias.map((s) => (
              <Card key={s.id} className="border-border/60 hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-foreground">{s.nome}</CardTitle>
                        {s.sigla && (
                          <Badge variant="outline" className="font-mono text-xs text-primary">
                            {s.sigla}
                          </Badge>
                        )}
                      </div>
                      {s.responsavel && (
                        <CardDescription className="text-xs mt-1">
                          Titular: <span className="font-medium text-foreground">{s.responsavel}</span>
                        </CardDescription>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          type: 'secretaria',
                          id: s.id,
                          name: s.nome,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5 text-xs text-muted-foreground border-t pt-3">
                  {s.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span>{s.telefone}</span>
                    </div>
                  )}
                  {s.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span>{s.email}</span>
                    </div>
                  )}
                  {s.endereco && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>{s.endereco}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Novo Bairro */}
      <Dialog open={openBairroModal} onOpenChange={setOpenBairroModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Bairro</DialogTitle>
            <DialogDescription>
              Equivalente à tela UPM985 do Delphi para divisão administrativa municipal.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateBairro} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold mb-1 block">Nome do Bairro *</label>
              <Input
                required
                value={bairroForm.nome}
                onChange={(e) => setBairroForm({ ...bairroForm, nome: e.target.value })}
                placeholder="Ex: Jardim dos Ipês"
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Zona Administrativa *</label>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                value={bairroForm.zona}
                onChange={(e) => setBairroForm({ ...bairroForm, zona: e.target.value as any })}
              >
                <option value="urbana">Zona Urbana</option>
                <option value="rural">Zona Rural</option>
              </select>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpenBairroModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Bairro</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Novo Logradouro */}
      <Dialog open={openLogradouroModal} onOpenChange={setOpenLogradouroModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Logradouro</DialogTitle>
            <DialogDescription>
              Equivalente à tela UPM983 do Delphi para endereçamento oficial do município.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateLogradouro} className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1 block">Tipo *</label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                  value={logradouroForm.tipo}
                  onChange={(e) => setLogradouroForm({ ...logradouroForm, tipo: e.target.value })}
                >
                  <option value="Rua">Rua</option>
                  <option value="Avenida">Avenida</option>
                  <option value="Praça">Praça</option>
                  <option value="Travessa">Travessa</option>
                  <option value="Alameda">Alameda</option>
                  <option value="Rodovia">Rodovia</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold mb-1 block">Nome da Via *</label>
                <Input
                  required
                  value={logradouroForm.nome}
                  onChange={(e) => setLogradouroForm({ ...logradouroForm, nome: e.target.value })}
                  placeholder="Ex: Duque de Caxias"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1 block">Bairro Vinculado *</label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                  value={logradouroForm.bairroId}
                  onChange={(e) => setLogradouroForm({ ...logradouroForm, bairroId: Number(e.target.value) })}
                >
                  {bairros.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nome} ({b.zona})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block">CEP</label>
                <Input
                  value={logradouroForm.cep}
                  onChange={(e) => setLogradouroForm({ ...logradouroForm, cep: e.target.value })}
                  placeholder="00000-000"
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpenLogradouroModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Logradouro</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Nova Secretaria */}
      <Dialog open={openSecretariaModal} onOpenChange={setOpenSecretariaModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Secretaria Municipal</DialogTitle>
            <DialogDescription>
              Equivalente à tela UPM393 do Delphi para gestão de órgãos públicos da prefeitura.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSecretaria} className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold mb-1 block">Nome do Órgão / Secretaria *</label>
                <Input
                  required
                  value={secretariaForm.nome}
                  onChange={(e) => setSecretariaForm({ ...secretariaForm, nome: e.target.value })}
                  placeholder="Ex: Secretaria de Meio Ambiente"
                />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block">Sigla</label>
                <Input
                  value={secretariaForm.sigla}
                  onChange={(e) => setSecretariaForm({ ...secretariaForm, sigla: e.target.value })}
                  placeholder="Ex: SMA"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1 block">Responsável / Titular</label>
                <Input
                  value={secretariaForm.responsavel}
                  onChange={(e) => setSecretariaForm({ ...secretariaForm, responsavel: e.target.value })}
                  placeholder="Nome do Secretário(a)"
                />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block">Telefone</label>
                <Input
                  value={secretariaForm.telefone}
                  onChange={(e) => setSecretariaForm({ ...secretariaForm, telefone: e.target.value })}
                  placeholder="(00) 0000-0000"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">E-mail Oficial</label>
              <Input
                type="email"
                value={secretariaForm.email}
                onChange={(e) => setSecretariaForm({ ...secretariaForm, email: e.target.value })}
                placeholder="secretaria@prefeitura.gov.br"
              />
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Endereço da Sede</label>
              <Input
                value={secretariaForm.endereco}
                onChange={(e) => setSecretariaForm({ ...secretariaForm, endereco: e.target.value })}
                placeholder="Rua, número, bairro"
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpenSecretariaModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Secretaria</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Exclusão com confirmação */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Deseja realmente remover o registro <span className="font-semibold text-foreground">"{deleteDialog.name}"</span>? Esta ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Confirmar Exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}

export default TerritorioIndex
