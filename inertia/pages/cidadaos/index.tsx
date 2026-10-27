import React, { useState, useEffect } from 'react'
import { Link, router } from '@inertiajs/react'
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  FileText,
  Building,
  HeartPulse,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
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

interface CidadaoItem {
  id: number
  nomeCompleto: string
  nomeSocial: string | null
  cpf: string | null
  cns: string | null
  nis: string | null
  dataNascimento: string
  sexo: string
  municipio: string
  uf: string
  unidadeSaude: string
  telefoneCelular: string | null
  situacaoCadastral: 'ativo' | 'inativo' | 'obito'
}

interface PaginatedCidadaos {
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
  }
  data: CidadaoItem[]
}

interface Props {
  cidadaos: PaginatedCidadaos
  filters: {
    search: string
    situacao: string
    unidade: string
  }
}

const CidadaosIndex: React.FC<Props> & { layout?: (page: React.ReactNode) => React.ReactNode } = ({
  cidadaos,
  filters,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [situacaoFilter, setSituacaoFilter] = useState(filters.situacao || '')
  const [selectedForDelete, setSelectedForDelete] = useState<CidadaoItem | null>(null)

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== filters.search || situacaoFilter !== filters.situacao) {
        router.get(
          '/cidadaos',
          { search: searchTerm, situacao: situacaoFilter },
          { preserveState: true, replace: true }
        )
      }
    }, 350)

    return () => clearTimeout(handler)
  }, [searchTerm, situacaoFilter, filters.search, filters.situacao])

  const confirmInactivate = () => {
    if (selectedForDelete) {
      router.delete(`/cidadaos/${selectedForDelete.id}`, {
        onSuccess: () => setSelectedForDelete(null),
      })
    }
  }

  const formatBirthDate = (iso: string) => {
    if (!iso) return '-'
    const [year, month, day] = iso.split('T')[0].split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <div className="space-y-6">
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Cadastro Único de Cidadãos</h1>
            <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
              Módulo Cidadão • Etapa 1
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Base unificada de munícipes, Cartão SUS (CNS), CadÚnico (NIS) e identificação civil (Refatoração de UPM002.pas)
          </p>
        </div>

        <Link href="/cidadaos/novo">
          <Button className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> Novo Cidadão
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por Nome, CPF, Cartão SUS (CNS) ou NIS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                <span>Situação:</span>
              </div>
              <select
                value={situacaoFilter}
                onChange={(e) => setSituacaoFilter(e.target.value)}
                className="h-10 px-3 py-1 bg-background border rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todas as situações</option>
                <option value="ativo">Apenas Ativos</option>
                <option value="inativo">Inativos</option>
                <option value="obito">Óbito</option>
              </select>

              {(searchTerm || situacaoFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('')
                    setSituacaoFilter('')
                  }}
                  className="h-10 text-xs text-muted-foreground"
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card>
        <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Munícipes Localizados</CardTitle>
            <CardDescription className="text-xs">
              Exibindo {cidadaos.data.length} de {cidadaos.meta.total} registros cadastrados
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Cidadão / Filiação</TableHead>
                  <TableHead>Documentos (CPF / CNS / NIS)</TableHead>
                  <TableHead>Nascimento</TableHead>
                  <TableHead>Unidade de Saúde</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cidadaos.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-sm">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground/40" />
                        <span>Nenhum cidadão encontrado para os critérios de busca.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  cidadaos.data.map((c) => (
                    <TableRow key={c.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{c.id.toString().padStart(5, '0')}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <Link
                            href={`/cidadaos/${c.id}`}
                            className="font-medium text-sm text-foreground hover:text-primary transition-colors hover:underline"
                          >
                            {c.nomeCompleto}
                          </Link>
                          {c.nomeSocial && (
                            <span className="text-[11px] text-muted-foreground">
                              Nome Social: {c.nomeSocial}
                            </span>
                          )}
                          <span className="text-[11px] text-muted-foreground">
                            {c.municipio}/{c.uf} {c.telefoneCelular ? `• ${c.telefoneCelular}` : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs font-mono">
                          {c.cpf && (
                            <span className="flex items-center gap-1 text-foreground">
                              <FileText className="h-3 w-3 text-muted-foreground" /> {c.cpf}
                            </span>
                          )}
                          {c.cns && (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <HeartPulse className="h-3 w-3" /> CNS: {c.cns}
                            </span>
                          )}
                          {c.nis && (
                            <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 text-[11px]">
                              NIS: {c.nis}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatBirthDate(c.dataNascimento)} ({c.sexo === 'F' ? 'Fem' : c.sexo === 'M' ? 'Masc' : 'Outro'})
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Building className="h-3.5 w-3.5" />
                          <span>{c.unidadeSaude}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {c.situacaoCadastral === 'ativo' ? (
                          <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 text-[11px]">
                            <CheckCircle2 className="h-3 w-3" /> Ativo
                          </Badge>
                        ) : c.situacaoCadastral === 'inativo' ? (
                          <Badge variant="secondary" className="gap-1 text-muted-foreground text-[11px]">
                            <XCircle className="h-3 w-3" /> Inativo
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1 text-[11px]">
                            <AlertCircle className="h-3 w-3" /> Óbito
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/cidadaos/${c.id}`} title="Visão 360° do Cidadão">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/cidadaos/${c.id}/editar`} title="Editar Cadastro">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Inativar Munícipe"
                            onClick={() => setSelectedForDelete(c)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {cidadaos.meta.lastPage > 1 && (
            <div className="flex items-center justify-between p-4 border-t text-xs text-muted-foreground">
              <span>
                Página {cidadaos.meta.currentPage} de {cidadaos.meta.lastPage}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={cidadaos.meta.currentPage <= 1}
                  onClick={() => router.get('/cidadaos', { ...filters, page: cidadaos.meta.currentPage - 1 })}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={cidadaos.meta.currentPage >= cidadaos.meta.lastPage}
                  onClick={() => router.get('/cidadaos', { ...filters, page: cidadaos.meta.currentPage + 1 })}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete / Inactivate Confirmation Dialog */}
      <Dialog open={!!selectedForDelete} onOpenChange={(open) => !open && setSelectedForDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Inativação de Munícipe</DialogTitle>
            <DialogDescription className="text-xs">
              Tem certeza que deseja inativar o cadastro de{' '}
              <strong className="text-foreground">{selectedForDelete?.nomeCompleto}</strong>?
              O histórico clínico e dispensações permanecerão preservados para auditoria.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setSelectedForDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmInactivate}>
              Confirmar Inativação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

CidadaosIndex.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>

export default CidadaosIndex
