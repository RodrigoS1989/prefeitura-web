import React, { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import {
  UserCheck,
  Search,
  AlertTriangle,
  Clock,
  Shield,
  FilePlus,
  Building2,
  Calendar,
  Check,
  Loader2,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface CidadaoOption {
  id: number
  nomeCompleto: string
  cpf?: string | null
  cns?: string | null
  dataNascimento?: string
  telefoneCelular?: string | null
}

export interface UnidadeOption {
  id: number
  nomeFantasia: string
  cnes: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  unidades: UnidadeOption[]
  activeUnidadeId: number
  cidadaosIniciais: CidadaoOption[]
  onSuccess?: () => void
}

export function AcolhimentoModal({
  open,
  onOpenChange,
  unidades,
  activeUnidadeId,
  cidadaosIniciais,
  onSuccess,
}: Props) {
  const [unidadeSaudeId, setUnidadeSaudeId] = useState<number>(activeUnidadeId)
  const [selectedCidadao, setSelectedCidadao] = useState<CidadaoOption | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<CidadaoOption[]>(cidadaosIniciais)
  const [isSearching, setIsSearching] = useState(false)
  const [tipoAtendimento, setTipoAtendimento] = useState<string>('DEMANDA_ESPONTANEA')
  const [queixaPrincipal, setQueixaPrincipal] = useState('')
  const [sigiloso, setSigiloso] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (activeUnidadeId) {
      setUnidadeSaudeId(activeUnidadeId)
    }
  }, [activeUnidadeId])

  useEffect(() => {
    if (!open) {
      // Reset form on close
      setSelectedCidadao(null)
      setSearchQuery('')
      setSearchResults(cidadaosIniciais)
      setTipoAtendimento('DEMANDA_ESPONTANEA')
      setQueixaPrincipal('')
      setSigiloso(false)
      setErrorMsg(null)
    }
  }, [open, cidadaosIniciais])

  const handleSearch = async (val: string) => {
    setSearchQuery(val)
    if (!val || val.trim().length < 2) {
      setSearchResults(cidadaosIniciais)
      return
    }

    setIsSearching(true)
    try {
      const res = await fetch(`/api/cidadaos/search?q=${encodeURIComponent(val)}`)
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data)
      }
    } catch (err) {
      console.error('Erro ao buscar cidadão:', err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCidadao) {
      setErrorMsg('Selecione um cidadão cadastrado para abrir o atendimento.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg(null)

    router.post(
      '/atendimentos',
      {
        cidadaoId: selectedCidadao.id,
        unidadeSaudeId,
        tipoAtendimento,
        queixaPrincipal: queixaPrincipal.trim() || undefined,
        sigiloso,
      },
      {
        onSuccess: () => {
          setIsSubmitting(false)
          onOpenChange(false)
          if (onSuccess) onSuccess()
        },
        onError: (errors) => {
          setIsSubmitting(false)
          const firstError = Object.values(errors)[0]
          setErrorMsg(firstError ? String(firstError) : 'Erro ao abrir atendimento. Verifique os campos.')
        },
      }
    )
  }

  const formatCpf = (cpf?: string | null) => {
    if (!cpf) return 'Não informado'
    const clean = cpf.replace(/\D/g, '')
    if (clean.length === 11) {
      return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return cpf
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-lg">
              <FilePlus className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Recepção & Acolhimento (Abertura de FAA)
              </DialogTitle>
              <DialogDescription>
                Abertura da Ficha de Atendimento Ambulatorial e emissão de senha de chamada no totem.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Unidade de Saúde */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <Building2 className="h-4 w-4 text-gray-500" />
              Unidade de Saúde Atendida
            </label>
            <select
              value={unidadeSaudeId}
              onChange={(e) => setUnidadeSaudeId(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500"
            >
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nomeFantasia} (CNES: {u.cnes})
                </option>
              ))}
            </select>
          </div>

          {/* Seleção de Cidadão */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <User className="h-4 w-4 text-blue-600" />
              Identificação do Cidadão / Paciente *
            </label>

            {selectedCidadao ? (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {selectedCidadao.nomeCompleto}
                    </span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-none">
                      ID #{selectedCidadao.id}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                    <span><strong>CPF:</strong> {formatCpf(selectedCidadao.cpf)}</span>
                    {selectedCidadao.cns && <span><strong>CNS:</strong> {selectedCidadao.cns}</span>}
                    {selectedCidadao.dataNascimento && (
                      <span><strong>Nasc:</strong> {selectedCidadao.dataNascimento.split('T')[0]}</span>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCidadao(null)}
                >
                  Trocar Cidadão
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Digite o Nome, CPF ou Cartão SUS (CNS) para buscar..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-9"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-blue-600" />
                  )}
                </div>

                <div className="border border-gray-200 dark:border-gray-800 rounded-lg max-h-48 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-800">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Nenhum cidadão localizado com "{searchQuery}".
                    </div>
                  ) : (
                    searchResults.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCidadao(c)}
                        className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            {c.nomeCompleto}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-3">
                            <span>CPF: {formatCpf(c.cpf)}</span>
                            {c.cns && <span>CNS: {c.cns}</span>}
                          </div>
                        </div>
                        <Button type="button" size="sm" variant="ghost" className="text-blue-600 h-7 text-xs">
                          Selecionar
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tipo de Atendimento */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tipo de Atendimento / Modalidade *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'DEMANDA_ESPONTANEA', label: 'Demanda Espontânea', desc: 'Queixa aguda ou consulta do dia' },
                { id: 'URGENCIA_EMERGENCIA', label: 'Urgência / Emergência', desc: 'Atendimento prioritário imediato' },
                { id: 'CONSULTA_AGENDADA', label: 'Consulta Agendada', desc: 'Retorno ou agendamento prévio' },
                { id: 'PROCEDIMENTO_AMBULATORIAL', label: 'Procedimento / Curativo', desc: 'Injeção, curativo, sutura' },
                { id: 'VACINACAO', label: 'Vacinação / Imunização', desc: 'Sala de vacinas da UBS' },
              ].map((tipo) => (
                <div
                  key={tipo.id}
                  onClick={() => setTipoAtendimento(tipo.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    tipoAtendimento === tipo.id
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-600'
                      : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <div className="font-semibold text-xs flex items-center justify-between">
                    <span>{tipo.label}</span>
                    {tipoAtendimento === tipo.id && <Check className="h-3.5 w-3.5 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{tipo.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Queixa Principal */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Queixa Principal / Motivo da Procura (Relato do Paciente)
            </label>
            <textarea
              rows={3}
              value={queixaPrincipal}
              onChange={(e) => setQueixaPrincipal(e.target.value)}
              placeholder="Ex: Febre há 2 dias, tosse produtiva e dor de cabeça intensa..."
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Caso Sigiloso */}
          <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <input
              type="checkbox"
              id="sigiloso"
              checked={sigiloso}
              onChange={(e) => setSigiloso(e.target.checked)}
              className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="sigiloso" className="text-xs text-amber-900 dark:text-amber-200 cursor-pointer">
              <strong>Atendimento Sigiloso / Restrito:</strong> Marcar para casos de violência, abuso, notificação compulsória restrita ou solicitação de sigilo de identidade no painel de chamada.
            </label>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedCidadao}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Emitindo Senha & Abrindo FAA...
                </>
              ) : (
                <>
                  <FilePlus className="h-4 w-4" />
                  Abrir Atendimento & Emitir Senha
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
