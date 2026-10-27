import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import {
  Pill,
  Search,
  Check,
  AlertTriangle,
  Clock,
  Building2,
  User,
  Plus,
  Trash2,
  Loader2,
  Calendar,
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

export interface MedicamentoOption {
  id: number
  codigo: string
  principioAtivo: string
  concentracao: string
  formaFarmaceutica: string
  lotes?: Array<{
    id: number
    numeroLote: string
    quantidadeAtual: number
    dataValidade: string
  }>
}

export interface UnidadeOption {
  id: number
  nomeFantasia: string
  cnes: string
}

export interface ItemDispensacaoForm {
  medicamentoId: number
  medicamentoNome: string
  quantidadePrescrita: number
  quantidadeDispensada: number
  posologia: string
  tempoTratamentoDias: number
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicamentos: MedicamentoOption[]
  unidades: UnidadeOption[]
  activeUnidadeId?: number
  cidadaosIniciais?: Array<{ id: number; nomeCompleto: string; cpf?: string }>
}

export function DispensacaoModal({
  open,
  onOpenChange,
  medicamentos,
  unidades,
  activeUnidadeId = 1,
}: Props) {
  const [unidadeSaudeId, setUnidadeSaudeId] = useState<number>(activeUnidadeId)
  const [cidadaoId, setCidadaoId] = useState<number>(1)
  const [numeroReceita, setNumeroReceita] = useState('')
  const [tipoDispensacao, setTipoDispensacao] = useState('RECEITA_AMBULATORIAL')
  const [observacoes, setObservacoes] = useState('')

  // Itens a dispensar
  const [itens, setItens] = useState<ItemDispensacaoForm[]>([])
  const [selectedMedId, setSelectedMedId] = useState<number>(medicamentos[0]?.id || 1)
  const [qtdPrescrita, setQtdPrescrita] = useState<number>(30)
  const [qtdDispensada, setQtdDispensada] = useState<number>(30)
  const [posologia, setPosologia] = useState('1 comprimido de 12 em 12 horas por 15 dias')
  const [tempoTratamento, setTempoTratamento] = useState<number>(15)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleAddItem = () => {
    const med = medicamentos.find((m) => m.id === Number(selectedMedId))
    if (!med) return

    setItens((prev) => [
      ...prev,
      {
        medicamentoId: med.id,
        medicamentoNome: `${med.principioAtivo} ${med.concentracao} (${med.formaFarmaceutica})`,
        quantidadePrescrita: qtdPrescrita,
        quantidadeDispensada: qtdDispensada,
        posologia,
        tempoTratamentoDias: tempoTratamento,
      },
    ])
  }

  const handleRemoveItem = (index: number) => {
    setItens((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (itens.length === 0) {
      setErrorMsg('Adicione pelo menos um medicamento para dispensar.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg(null)

    router.post(
      '/farmacia/dispensar',
      {
        cidadaoId,
        unidadeSaudeId,
        tipoDispensacao,
        numeroReceita: numeroReceita.trim() || undefined,
        observacoes: observacoes.trim() || undefined,
        itens: itens.map((it) => ({
          medicamentoId: it.medicamentoId,
          quantidadePrescrita: it.quantidadePrescrita,
          quantidadeDispensada: it.quantidadeDispensada,
          posologia: it.posologia,
          tempoTratamentoDias: it.tempoTratamentoDias,
        })),
      },
      {
        onSuccess: () => {
          setIsSubmitting(false)
          setItens([])
          onOpenChange(false)
        },
        onError: (errs) => {
          setIsSubmitting(false)
          const first = Object.values(errs)[0]
          setErrorMsg(first ? String(first) : 'Erro ao processar dispensação.')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-xl">
              <Pill className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Balcão de Dispensação Farmacêutica (FEFO)
              </DialogTitle>
              <DialogDescription>
                Conferência de receita médica e baixa atômica no estoque com alocação automática pelo lote mais próximo do vencimento.
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

          {/* CABEÇALHO DA DISPENSAÇÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Unidade Dispensadora:
              </label>
              <select
                value={unidadeSaudeId}
                onChange={(e) => setUnidadeSaudeId(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
              >
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nomeFantasia}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Cidadão / Paciente:
              </label>
              <select
                value={cidadaoId}
                onChange={(e) => setCidadaoId(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium"
              >
                <option value="1">Maria da Silva Santos (CPF: 123.456.789-00)</option>
                <option value="2">João Pedro de Souza (CPF: 234.567.890-11)</option>
                <option value="3">Ana Clara Ferreira (CPF: 345.678.901-22)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Número da Receita / Guia:
              </label>
              <Input
                placeholder="Ex: REC-2026-449"
                value={numeroReceita}
                onChange={(e) => setNumeroReceita(e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>
          </div>

          {/* INCLUSÃO DE MEDICAMENTOS */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
              + Adicionar Medicamento à Receita
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                  Medicamento Padronizado (REMUME):
                </label>
                <select
                  value={selectedMedId}
                  onChange={(e) => setSelectedMedId(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium"
                >
                  {medicamentos.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.principioAtivo} {m.concentracao} ({m.formaFarmaceutica})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                  Qtd. Prescrita:
                </label>
                <Input
                  type="number"
                  min="1"
                  value={qtdPrescrita}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setQtdPrescrita(val)
                    setQtdDispensada(val)
                  }}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                  Qtd. Dispensada:
                </label>
                <Input
                  type="number"
                  min="1"
                  value={qtdDispensada}
                  onChange={(e) => setQtdDispensada(Number(e.target.value))}
                  className="h-9 text-xs font-bold text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                  Posologia e Instruções de Uso:
                </label>
                <Input
                  value={posologia}
                  onChange={(e) => setPosologia(e.target.value)}
                  placeholder="Ex: 1 comprimido de 8/8h por 7 dias..."
                  className="h-9 text-xs"
                />
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Tratamento (dias):
                  </label>
                  <Input
                    type="number"
                    value={tempoTratamento}
                    onChange={(e) => setTempoTratamento(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddItem}
                  className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Incluir
                </Button>
              </div>
            </div>
          </div>

          {/* LISTA DE ITENS INCLUÍDOS */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
              Itens a Dispensar ({itens.length})
            </span>

            {itens.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                Nenhum medicamento adicionado ainda. Selecione acima para alocar pelo algoritmo FEFO.
              </div>
            ) : (
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
                {itens.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-gray-800 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>{it.medicamentoNome}</span>
                        <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200">
                          FEFO Automático
                        </Badge>
                      </div>
                      <div className="text-gray-500 text-[11px]">
                        Posologia: {it.posologia} ({it.tempoTratamentoDias} dias)
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-black text-gray-900 dark:text-white">
                          {it.quantidadeDispensada} un
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          (de {it.quantidadePrescrita} prescritas)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-3">
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
              disabled={isSubmitting || itens.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processando Baixa FEFO...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Confirmar Dispensação & Baixar FEFO
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
