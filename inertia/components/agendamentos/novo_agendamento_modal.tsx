import { useState } from 'react'
import { router } from '@inertiajs/react'
import {
  Calendar,
  Clock,
  User,
  Building2,
  Stethoscope,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Check,
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

interface NovoAgendamentoModalProps {
  open: boolean
  onClose: () => void
  unidades: Array<{ id: number; nome: string; cnes: string }>
  profissionais: Array<{ id: number; nome: string; cbo?: { nome: string } }>
  cidadaos: Array<{ id: number; nome: string; cpf: string; cns: string }>
  cotas: Array<{
    unidadeSolicitanteId: number
    tipo: string
    especialidadeOuExame: string
    cotaMensal: number
    cotaUtilizada: number
    saldoDisponivel: number
  }>
}

export default function NovoAgendamentoModal({
  open,
  onClose,
  unidades,
  profissionais,
  cidadaos,
  cotas,
}: NovoAgendamentoModalProps) {
  const [tipo, setTipo] = useState<'CONSULTA' | 'EXAME'>('CONSULTA')
  const [cidadaoId, setCidadaoId] = useState<string>(cidadaos[0]?.id?.toString() || '')
  const [unidadeSolicitanteId, setUnidadeSolicitanteId] = useState<string>(unidades[0]?.id?.toString() || '')
  const [unidadeExecutanteId, setUnidadeExecutanteId] = useState<string>(unidades[0]?.id?.toString() || '')
  const [profissionalId, setProfissionalId] = useState<string>('')
  const [especialidadeOuExame, setEspecialidadeOuExame] = useState('Cardiologia')
  const [dataHora, setDataHora] = useState('')
  const [prioridade, setPrioridade] = useState<'NORMAL' | 'URGENTE' | 'PREFERENCIAL'>('NORMAL')
  const [observacoes, setObservacoes] = useState('')
  const [loading, setLoading] = useState(false)

  // Opções pré-configuradas para agilizar a regulação
  const especialidadesConsultas = [
    'Cardiologia',
    'Pediatria',
    'Ginecologia e Obstetrícia',
    'Oftalmologia',
    'Ortopedia',
    'Neurologia',
    'Dermatologia',
    'Psiquiatria',
  ]

  const procedimentosExames = [
    'Ultrassonografia de Abdome Total',
    'Raio-X de Tórax',
    'Ecocardiograma Transtorácico',
    'Eletrocardiograma (ECG)',
    'Endoscopia Digestiva Alta',
    'Ressonância Magnética',
    'Tomografia Computadorizada',
  ]

  // Encontra a cota correspondente da unidade solicitante
  const cotaAtual = cotas.find(
    (c) =>
      c.unidadeSolicitanteId === Number(unidadeSolicitanteId) &&
      c.tipo === tipo &&
      c.especialidadeOuExame === especialidadeOuExame
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cidadaoId || !unidadeSolicitanteId || !unidadeExecutanteId || !especialidadeOuExame || !dataHora) {
      alert('Por favor, preencha todos os campos obrigatórios (*).')
      return
    }

    setLoading(true)
    router.post(
      '/agendamentos',
      {
        cidadaoId,
        unidadeSolicitanteId,
        unidadeExecutanteId,
        profissionalId: tipo === 'CONSULTA' && profissionalId ? profissionalId : null,
        tipo,
        especialidadeOuExame,
        dataHora,
        prioridade,
        observacoes,
      },
      {
        onSuccess: () => {
          setLoading(false)
          onClose()
        },
        onError: () => {
          setLoading(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Novo Agendamento Regulado (SUS)</DialogTitle>
              <DialogDescription className="text-xs">
                Controle de cotas municipais e bloqueio atômico de concorrência com Redis Locks
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs py-2">
          {/* SELETOR DE TIPO (CONSULTA OU EXAME) */}
          <div className="flex items-center gap-3 p-1 rounded-lg bg-muted/60 border w-fit">
            <button
              type="button"
              onClick={() => {
                setTipo('CONSULTA')
                setEspecialidadeOuExame(especialidadesConsultas[0])
              }}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
                tipo === 'CONSULTA'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🩺 Consulta Especializada
            </button>
            <button
              type="button"
              onClick={() => {
                setTipo('EXAME')
                setEspecialidadeOuExame(procedimentosExames[0])
              }}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
                tipo === 'EXAME'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🔬 Exame Diagnóstico
            </button>
          </div>

          {/* SINALIZADOR DE COTA MUNICIPAL */}
          <div className="p-3.5 rounded-lg border bg-card/60 backdrop-blur space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Saldo de Cota Municipal de Regulação (Mês Atual):
              </span>
              {cotaAtual ? (
                <Badge
                  variant={cotaAtual.saldoDisponivel > 0 ? 'default' : 'destructive'}
                  className="font-mono text-[11px]"
                >
                  {cotaAtual.saldoDisponivel} vagas disponíveis ({cotaAtual.cotaUtilizada}/{cotaAtual.cotaMensal})
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  Sem teto restritivo de cota
                </Badge>
              )}
            </div>
            {cotaAtual && cotaAtual.saldoDisponivel === 0 && (
              <p className="text-[11px] text-destructive flex items-center gap-1 font-semibold">
                <AlertTriangle className="h-3.5 w-3.5" />
                Atenção: A cota desta unidade para este procedimento está esgotada no mês. O sistema bloqueará o agendamento.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CIDADÃO */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Munícipe / Paciente *</Label>
              <select
                value={cidadaoId}
                onChange={(e) => setCidadaoId(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs outline-none focus:ring-2 focus:ring-primary"
              >
                {cidadaos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} (CPF: {c.cpf})
                  </option>
                ))}
              </select>
            </div>

            {/* ESPECIALIDADE / PROCEDIMENTO */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                {tipo === 'CONSULTA' ? 'Especialidade Médica *' : 'Procedimento / Exame *'}
              </Label>
              <select
                value={especialidadeOuExame}
                onChange={(e) => setEspecialidadeOuExame(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs outline-none focus:ring-2 focus:ring-primary"
              >
                {(tipo === 'CONSULTA' ? especialidadesConsultas : procedimentosExames).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* UNIDADE SOLICITANTE */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Unidade Solicitante (Origem da Cota) *</Label>
              <select
                value={unidadeSolicitanteId}
                onChange={(e) => setUnidadeSolicitanteId(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs outline-none focus:ring-2 focus:ring-primary"
              >
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome} (CNES {u.cnes})
                  </option>
                ))}
              </select>
            </div>

            {/* UNIDADE EXECUTANTE */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Unidade Executante (Local do Atendimento) *</Label>
              <select
                value={unidadeExecutanteId}
                onChange={(e) => setUnidadeExecutanteId(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs outline-none focus:ring-2 focus:ring-primary"
              >
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome} (CNES {u.cnes})
                  </option>
                ))}
              </select>
            </div>

            {/* PROFISSIONAL (SE FOR CONSULTA) */}
            {tipo === 'CONSULTA' && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Profissional Agendado (Opcional)</Label>
                <select
                  value={profissionalId}
                  onChange={(e) => setProfissionalId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-xs outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Qualquer profissional disponível da equipe</option>
                  {profissionais.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} {p.cbo ? `(${p.cbo.nome})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* DATA E HORA DO AGENDAMENTO */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Data e Horário do Agendamento *</Label>
              <Input
                type="datetime-local"
                value={dataHora}
                onChange={(e) => setDataHora(e.target.value)}
                required
                className="text-xs font-mono"
              />
            </div>

            {/* PRIORIDADE */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Prioridade Clínica</Label>
              <select
                value={prioridade}
                onChange={(e: any) => setPrioridade(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="NORMAL">Normal (Eletivo)</option>
                <option value="PREFERENCIAL">Preferencial (Idoso / Gestante / PCD)</option>
                <option value="URGENTE">Urgente (Regulação Prioritária)</option>
              </select>
            </div>
          </div>

          {/* OBSERVAÇÕES */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Observações Clínicas / Recomendações de Preparo</Label>
            <Input
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Jejum obrigatório de 8 horas, trazer exames anteriores..."
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading || (cotaAtual ? cotaAtual.saldoDisponivel === 0 : false)}
              className="gap-1.5"
            >
              <Check className="h-4 w-4" />
              {loading ? 'Processando Lock & Cota...' : 'Confirmar e Regular Vaga'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
