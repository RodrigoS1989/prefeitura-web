import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import { AlertCircle, AlertTriangle, Loader2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  atendimento: {
    id: number
    numeroAtendimento: string
    senhaPainel: string
    cidadao: {
      nomeCompleto: string
    }
  } | null
  onSuccess?: () => void
}

export function CancelamentoModal({ open, onOpenChange, atendimento, onSuccess }: Props) {
  const [motivoCancelamento, setMotivoCancelamento] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!atendimento) return

    if (!motivoCancelamento.trim() || motivoCancelamento.trim().length < 5) {
      setErrorMsg('Informe uma justificativa detalhada com pelo menos 5 caracteres.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg(null)

    router.post(
      `/atendimentos/${atendimento.id}/cancelar`,
      {
        motivoCancelamento: motivoCancelamento.trim(),
      },
      {
        onSuccess: () => {
          setIsSubmitting(false)
          setMotivoCancelamento('')
          onOpenChange(false)
          if (onSuccess) onSuccess()
        },
        onError: (errs) => {
          setIsSubmitting(false)
          const first = Object.values(errs)[0]
          setErrorMsg(first ? String(first) : 'Erro ao cancelar atendimento.')
        },
      }
    )
  }

  if (!atendimento) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">Cancelar Atendimento</DialogTitle>
          </div>
          <DialogDescription>
            O cancelamento é auditado e exigido pelo protocolo assistencial (UPM177).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-xs space-y-1">
            <div>
              <strong>Paciente:</strong> {atendimento.cidadao.nomeCompleto}
            </div>
            <div>
              <strong>Ficha / Senha:</strong> {atendimento.numeroAtendimento} ({atendimento.senhaPainel})
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-xs text-red-700 rounded flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Motivo do Cancelamento *
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[
                'Desistência voluntária do paciente',
                'Paciente evadiu-se do local',
                'Transferido / Encaminhado SAMU/UPA',
                'Erro de digitação / Duplicidade de ficha',
              ].map((motivo) => (
                <button
                  key={motivo}
                  type="button"
                  onClick={() => setMotivoCancelamento(motivo)}
                  className="text-[11px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 transition"
                >
                  {motivo}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={motivoCancelamento}
              onChange={(e) => setMotivoCancelamento(e.target.value)}
              placeholder="Descreva detalhadamente o motivo do cancelamento..."
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:ring-2 focus:ring-red-500"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Voltar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isSubmitting || !motivoCancelamento.trim()}
              className="flex items-center gap-1.5"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
