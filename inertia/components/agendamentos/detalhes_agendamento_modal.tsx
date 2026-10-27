import { useState } from 'react'
import { router } from '@inertiajs/react'
import {
  Calendar,
  Clock,
  User,
  Building2,
  Stethoscope,
  FileText,
  AlertCircle,
  Printer,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface DetalhesAgendamentoModalProps {
  open: boolean
  onClose: () => void
  agendamento: {
    id: number
    protocolo: string
    tipo: string
    especialidadeOuExame: string
    dataHora: string
    status: string
    prioridade: string
    motivoCancelamento?: string | null
    observacoes?: string | null
    cidadao: { nome: string; cpf: string; cns: string }
    unidadeSolicitante: { nome: string; cnes: string }
    unidadeExecutante: { nome: string; cnes: string }
    profissional?: { nome: string } | null
  } | null
}

export default function DetalhesAgendamentoModal({
  open,
  onClose,
  agendamento,
}: DetalhesAgendamentoModalProps) {
  const [motivoCancelamento, setMotivoCancelamento] = useState('')
  const [showCancelInput, setShowCancelInput] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!agendamento) return null

  const handleConfirmar = () => {
    setLoading(true)
    router.post(
      `/agendamentos/${agendamento.id}/confirmar`,
      {},
      {
        onSuccess: () => {
          setLoading(false)
          onClose()
        },
        onError: () => setLoading(false),
      }
    )
  }

  const handleCancelar = () => {
    if (!motivoCancelamento.trim()) {
      alert('Informe o motivo do cancelamento.')
      return
    }
    setLoading(true)
    router.post(
      `/agendamentos/${agendamento.id}/cancelar`,
      { motivo: motivoCancelamento },
      {
        onSuccess: () => {
          setLoading(false)
          setShowCancelInput(false)
          onClose()
        },
        onError: () => setLoading(false),
      }
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AGENDADO':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Agendado</Badge>
      case 'CONFIRMADO':
        return <Badge variant="default" className="bg-emerald-600 text-white">Confirmado</Badge>
      case 'CANCELADO':
        return <Badge variant="destructive">Cancelado</Badge>
      case 'ATENDIDO':
        return <Badge variant="outline" className="border-emerald-500 text-emerald-500">Atendido</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  Guia de Agendamento SUS
                  <span className="font-mono text-xs text-primary font-bold">{agendamento.protocolo}</span>
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Comprovante oficial de regulação ambulatorial do município
                </DialogDescription>
              </div>
            </div>
            {getStatusBadge(agendamento.status)}
          </div>
        </DialogHeader>

        <div className="space-y-4 text-xs py-2">
          {/* PACIENTE */}
          <div className="p-3.5 rounded-lg border bg-muted/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Dados do Paciente / Munícipe
            </span>
            <div className="text-sm font-bold text-foreground">{agendamento.cidadao.nome}</div>
            <div className="text-xs text-muted-foreground font-mono flex items-center gap-4">
              <span>CPF: {agendamento.cidadao.cpf}</span>
              <span>Cartão SUS (CNS): {agendamento.cidadao.cns}</span>
            </div>
          </div>

          {/* DETALHES DO PROCEDIMENTO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg border bg-card">
            <div>
              <span className="text-[10px] text-muted-foreground block">Tipo de Atendimento</span>
              <span className="font-bold text-xs">{agendamento.tipo === 'CONSULTA' ? 'Consulta Médica' : 'Exame Diagnóstico'}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">Especialidade / Procedimento</span>
              <span className="font-bold text-xs">{agendamento.especialidadeOuExame}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">Data e Horário</span>
              <span className="font-bold text-xs font-mono text-primary">
                {new Date(agendamento.dataHora).toLocaleString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">Prioridade</span>
              <span className="font-bold text-xs">{agendamento.prioridade}</span>
            </div>
          </div>

          {/* LOCAIS DE ATENDIMENTO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg border bg-muted/10">
            <div>
              <span className="text-[10px] text-muted-foreground block">Unidade Solicitante (Origem)</span>
              <span className="font-medium text-xs">{agendamento.unidadeSolicitante.nome}</span>
              <span className="text-[10px] font-mono text-muted-foreground block">CNES {agendamento.unidadeSolicitante.cnes}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">Unidade Executante (Destino)</span>
              <span className="font-medium text-xs">{agendamento.unidadeExecutante.nome}</span>
              <span className="text-[10px] font-mono text-muted-foreground block">CNES {agendamento.unidadeExecutante.cnes}</span>
            </div>
          </div>

          {agendamento.profissional && (
            <div className="p-3 rounded-lg border bg-card">
              <span className="text-[10px] text-muted-foreground block">Profissional Responsável</span>
              <span className="font-bold text-xs">{agendamento.profissional.nome}</span>
            </div>
          )}

          {agendamento.observacoes && (
            <div className="p-3 rounded-lg border border-dashed text-xs">
              <span className="text-[10px] text-muted-foreground font-semibold block mb-0.5">Orientações e Preparo</span>
              <p className="text-muted-foreground">{agendamento.observacoes}</p>
            </div>
          )}

          {agendamento.status === 'CANCELADO' && agendamento.motivoCancelamento && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              <span className="font-bold block">Motivo do Cancelamento:</span>
              <p>{agendamento.motivoCancelamento}</p>
            </div>
          )}

          {/* FORMULÁRIO DE CANCELAMENTO INLINE */}
          {showCancelInput && (
            <div className="p-3.5 rounded-lg border border-destructive/30 bg-destructive/5 space-y-2">
              <Label className="text-xs text-destructive font-semibold">Informe a justificativa do cancelamento:</Label>
              <Input
                value={motivoCancelamento}
                onChange={(e) => setMotivoCancelamento(e.target.value)}
                placeholder="Ex: Munícipe solicitou reagendamento, indisponibilidade do profissional..."
                className="text-xs"
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={() => setShowCancelInput(false)}>
                  Voltar
                </Button>
                <Button variant="destructive" size="sm" onClick={handleCancelar} disabled={loading}>
                  Confirmar Cancelamento & Liberar Cota
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-1.5 text-xs"
          >
            <Printer className="h-3.5 w-3.5" /> Imprimir Guia
          </Button>

          <div className="flex items-center gap-2">
            {agendamento.status === 'AGENDADO' && !showCancelInput && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCancelInput(true)}
                  className="text-destructive border-destructive/30 hover:bg-destructive/10 text-xs"
                >
                  <XCircle className="h-3.5 w-3.5 mr-1" /> Cancelar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmar}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Confirmar Presença
                </Button>
              </>
            )}
            <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-xs">
              Fechar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
