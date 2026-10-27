import React, { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import {
  Stethoscope,
  FileText,
  Pill,
  Microscope,
  Award,
  History,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Heart,
  Activity,
  Plus,
  Trash2,
  Printer,
  ShieldCheck,
  User,
  Calendar,
  Clock,
  Gauge,
  Scale,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface PepAtendimentoData {
  id: number
  numeroAtendimento: string
  senhaPainel: string
  status: string
  prioridadeManchester: string
  discriminadorManchester?: string | null
  tipoAtendimento: string
  queixaPrincipal?: string | null
  dataHoraChegada: string
  dataHoraTriagem?: string | null
  cidadao: {
    id: number
    nomeCompleto: string
    cpf?: string | null
    cns?: string | null
    dataNascimento?: string
    sexo?: string
    telefoneCelular?: string | null
  }
  profissional?: {
    id: number
    nome: string
    numeroRegistro?: string
    especialidade?: {
      nome: string
    }
  } | null
  sinaisVitais?: {
    paSistolica?: number | null
    paDiastolica?: number | null
    frequenciaCardiaca?: number | null
    frequenciaRespiratoria?: number | null
    temperatura?: number | null
    saturacaoO2?: number | null
    peso?: number | null
    altura?: number | null
    imc?: number | null
    glicemiaCapilar?: number | null
    escalaDor?: number | null
    observacoesTriagem?: string | null
  } | null
  evolucao?: {
    id: number
    subjetivo: string
    objetivo: string
    avaliacao: string
    planoConduta: string
    assinadoDigitalmente: boolean
    dataHoraAssinatura?: string
  } | null
  diagnosticos?: Array<{
    id: number
    cid10Codigo: string
    cid10Descricao: string
    tipo: string
  }>
  prescricoes?: Array<{
    id: number
    nomeMedicamento: string
    posologia: string
    quantidadePrescrita: number
    viaAdministracao: string
    usoContinuo: boolean
    orientacoes?: string | null
    codigoAutenticidadeReceita: string
  }>
  exames?: Array<{
    id: number
    descricaoExame: string
    tipoExame: string
    justificativaClinica?: string | null
    urgente: boolean
    status: string
  }>
  atestados?: Array<{
    id: number
    tipoAtestado: string
    diasAfastamento?: number | null
    dataInicioAfastamento: string
    cid10Codigo?: string | null
    autorizaDivulgacaoCid: boolean
    codigoAutenticidade: string
  }>
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  atendimentoId: number | null
  profissionais: Array<{ id: number; nome: string }>
  onSuccess?: () => void
}

export function PepAtendimentoModal({
  open,
  onOpenChange,
  atendimentoId,
  profissionais,
  onSuccess,
}: Props) {
  const [data, setData] = useState<PepAtendimentoData | null>(null)
  const [historico, setHistorico] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [submittingAction, setSubmittingAction] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Aba SOAP
  const [subjetivo, setSubjetivo] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [avaliacao, setAvaliacao] = useState('')
  const [planoConduta, setPlanoConduta] = useState('')
  const [cid10Codigo, setCid10Codigo] = useState('')
  const [cid10Descricao, setCid10Descricao] = useState('')
  const [profissionalId, setProfissionalId] = useState<number>(1)

  // Aba Prescrição
  const [nomeMedicamento, setNomeMedicamento] = useState('')
  const [posologia, setPosologia] = useState('')
  const [quantidadePrescrita, setQuantidadePrescrita] = useState('1')
  const [viaAdministracao, setViaAdministracao] = useState('ORAL')
  const [usoContinuo, setUsoContinuo] = useState(false)
  const [orientacoesMedicamento, setOrientacoesMedicamento] = useState('')

  // Aba Exames
  const [descricaoExame, setDescricaoExame] = useState('')
  const [tipoExame, setTipoExame] = useState('LABORATORIAL')
  const [justificativaExame, setJustificativaExame] = useState('')
  const [exameUrgente, setExameUrgente] = useState(false)

  // Aba Atestados
  const [tipoAtestado, setTipoAtestado] = useState('AFASTAMENTO')
  const [diasAfastamento, setDiasAfastamento] = useState('1')
  const [atestadoCid, setAtestadoCid] = useState('')
  const [autorizaDivulgacaoCid, setAutorizaDivulgacaoCid] = useState(true)
  const [observacoesAtestado, setObservacoesAtestado] = useState('')

  const loadPepData = async (id: number) => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/pep/${id}`)
      if (res.ok) {
        const json = await res.json()
        setData(json.atendimento)
        setHistorico(json.historicoAnterior || [])

        // Preenche SOAP se já existir
        if (json.atendimento.evolucao) {
          setSubjetivo(json.atendimento.evolucao.subjetivo || '')
          setObjetivo(json.atendimento.evolucao.objetivo || '')
          setAvaliacao(json.atendimento.evolucao.avaliacao || '')
          setPlanoConduta(json.atendimento.evolucao.planoConduta || '')
        } else {
          // Pre-popula subjetivo com a queixa inicial da recepção
          setSubjetivo(
            json.atendimento.queixaPrincipal
              ? `Paciente relata: ${json.atendimento.queixaPrincipal}`
              : ''
          )
          setObjetivo('Paciente em bom estado geral, lúcido e orientado no tempo e espaço.')
          setAvaliacao('')
          setPlanoConduta('')
        }

        if (json.atendimento.diagnosticos && json.atendimento.diagnosticos.length > 0) {
          setCid10Codigo(json.atendimento.diagnosticos[0].cid10Codigo)
          setCid10Descricao(json.atendimento.diagnosticos[0].cid10Descricao)
          setAtestadoCid(json.atendimento.diagnosticos[0].cid10Codigo)
        }

        if (json.atendimento.profissionalId) {
          setProfissionalId(json.atendimento.profissionalId)
        } else if (profissionais.length > 0) {
          setProfissionalId(profissionais[0].id)
        }
      } else {
        setErrorMsg('Não foi possível carregar os dados clínicos deste atendimento.')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Erro de comunicação ao carregar prontuário.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && atendimentoId) {
      loadPepData(atendimentoId)
    } else {
      setData(null)
      setSuccessMsg(null)
      setErrorMsg(null)
    }
  }, [open, atendimentoId])

  // Salvar Evolução SOAP
  const handleSaveEvolucao = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return

    setSubmittingAction('soap')
    setSuccessMsg(null)
    setErrorMsg(null)

    try {
      const res = await fetch(`/atendimentos/${data.id}/pep/evolucao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          profissionalId,
          subjetivo,
          objetivo,
          avaliacao,
          planoConduta,
          cid10Codigo: cid10Codigo || undefined,
          cid10Descricao: cid10Descricao || undefined,
        }),
      })

      if (res.ok) {
        setSuccessMsg('Evolução clínica SOAP gravada com sucesso com carimbo digital.')
        await loadPepData(data.id)
      } else {
        const errJson = await res.json()
        setErrorMsg(errJson.message || 'Erro ao salvar evolução SOAP.')
      }
    } catch (err) {
      setErrorMsg('Falha de conexão ao salvar evolução clínica.')
    } finally {
      setSubmittingAction(null)
    }
  }

  // Adicionar Prescrição
  const handleAddPrescricao = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data || !nomeMedicamento || !posologia) return

    setSubmittingAction('prescricao')
    setSuccessMsg(null)
    setErrorMsg(null)

    try {
      const res = await fetch(`/atendimentos/${data.id}/pep/prescricao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nomeMedicamento,
          posologia,
          quantidadePrescrita: Number(quantidadePrescrita) || 1,
          viaAdministracao,
          usoContinuo,
          orientacoes: orientacoesMedicamento || undefined,
        }),
      })

      if (res.ok) {
        setSuccessMsg(`Medicamento ${nomeMedicamento} inserido na prescrição.`)
        setNomeMedicamento('')
        setPosologia('')
        setQuantidadePrescrita('1')
        setOrientacoesMedicamento('')
        await loadPepData(data.id)
      } else {
        setErrorMsg('Erro ao adicionar medicamento na prescrição.')
      }
    } catch (err) {
      setErrorMsg('Falha ao adicionar medicamento.')
    } finally {
      setSubmittingAction(null)
    }
  }

  // Adicionar Exame
  const handleAddExame = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data || !descricaoExame) return

    setSubmittingAction('exame')
    setSuccessMsg(null)
    setErrorMsg(null)

    try {
      const res = await fetch(`/atendimentos/${data.id}/pep/exame`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          descricaoExame,
          tipoExame,
          justificativaClinica: justificativaExame || undefined,
          urgente: exameUrgente,
        }),
      })

      if (res.ok) {
        setSuccessMsg(`Pedido de exame (${descricaoExame}) registrado!`)
        setDescricaoExame('')
        setJustificativaExame('')
        setExameUrgente(false)
        await loadPepData(data.id)
      } else {
        setErrorMsg('Erro ao solicitar exame.')
      }
    } catch (err) {
      setErrorMsg('Falha ao registrar pedido de exame.')
    } finally {
      setSubmittingAction(null)
    }
  }

  // Emitir Atestado
  const handleAddAtestado = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return

    setSubmittingAction('atestado')
    setSuccessMsg(null)
    setErrorMsg(null)

    try {
      const res = await fetch(`/atendimentos/${data.id}/pep/atestado`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          tipoAtestado,
          diasAfastamento: Number(diasAfastamento) || 1,
          cid10Codigo: atestadoCid || undefined,
          autorizaDivulgacaoCid,
          observacoes: observacoesAtestado || undefined,
        }),
      })

      if (res.ok) {
        setSuccessMsg('Atestado médico emitido e assinado digitalmente.')
        setObservacoesAtestado('')
        await loadPepData(data.id)
      } else {
        setErrorMsg('Erro ao emitir atestado médico.')
      }
    } catch (err) {
      setErrorMsg('Falha ao emitir atestado.')
    } finally {
      setSubmittingAction(null)
    }
  }

  // Finalizar Atendimento
  const handleFinalizarAtendimento = () => {
    if (!data) return
    if (!confirm('Deseja realmente finalizar o atendimento clínico e liberar o paciente?')) {
      return
    }

    setSubmittingAction('finalizar')
    router.post(
      `/atendimentos/${data.id}/finalizar`,
      {},
      {
        onSuccess: () => {
          setSubmittingAction(null)
          onOpenChange(false)
          if (onSuccess) onSuccess()
        },
        onError: () => {
          setSubmittingAction(null)
          setErrorMsg('Erro ao finalizar atendimento.')
        },
      }
    )
  }

  const getManchesterBadge = (cor?: string) => {
    switch (cor) {
      case 'VERMELHO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-sm ring-1 ring-rose-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Emergência (Vermelho)
          </span>
        )
      case 'LARANJA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-sm ring-1 ring-orange-600/50">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Muito Urgente (Laranja)
          </span>
        )
      case 'AMARELO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-300 text-amber-950 border border-amber-500 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-950" />
            Urgente (Amarelo)
          </span>
        )
      case 'AZUL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-600 text-white shadow-sm ring-1 ring-sky-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Não Urgente (Azul)
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Pouco Urgente (Verde)
          </span>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[94vh] flex flex-col p-0 overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        {/* Header do Prontuário */}
        <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 text-slate-100 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-white">Prontuário Eletrônico do Paciente (PEP)</h2>
                  {data && getManchesterBadge(data.prioridadeManchester)}
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>Atendimento: <strong className="text-slate-200 font-mono">{data?.numeroAtendimento || 'Carregando...'}</strong></span>
                  <span>•</span>
                  <span>Senha: <strong className="text-cyan-300 font-mono">{data?.senhaPainel}</strong></span>
                  <span>•</span>
                  <span>Modalidade: <span className="text-slate-200">{data?.tipoAtendimento?.replace('_', ' ')}</span></span>
                </p>
              </div>
            </div>

            {data && (
              <div className="text-right">
                <div className="text-sm font-bold text-white">{data.cidadao.nomeCompleto}</div>
                <div className="text-xs text-slate-400 flex gap-2 justify-end mt-0.5 font-mono">
                  {data.cidadao.cpf && <span>CPF: {data.cidadao.cpf}</span>}
                  {data.cidadao.cns && <span>CNS: {data.cidadao.cns}</span>}
                </div>
              </div>
            )}
          </div>

          {/* Banner de Sinais Vitais da Triagem (HUD Clínico) */}
          {data?.sinaisVitais && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-7 gap-2 bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-xs shadow-inner">
              <div className="text-center border-r border-slate-800 last:border-none">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">PA Sist/Diast</div>
                <div className="font-bold font-mono text-emerald-400">
                  {data.sinaisVitais.paSistolica && data.sinaisVitais.paDiastolica
                    ? `${data.sinaisVitais.paSistolica}/${data.sinaisVitais.paDiastolica} mmHg`
                    : 'Não aferida'}
                </div>
              </div>
              <div className="text-center border-r border-slate-800 last:border-none">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Freq. Cardíaca</div>
                <div className="font-bold font-mono text-rose-400">
                  {data.sinaisVitais.frequenciaCardiaca ? `${data.sinaisVitais.frequenciaCardiaca} bpm` : '--'}
                </div>
              </div>
              <div className="text-center border-r border-slate-800 last:border-none">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Temperatura</div>
                <div className="font-bold font-mono text-amber-400">
                  {data.sinaisVitais.temperatura ? `${data.sinaisVitais.temperatura} °C` : '--'}
                </div>
              </div>
              <div className="text-center border-r border-slate-800 last:border-none">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Saturação O₂</div>
                <div className="font-bold font-mono text-sky-400">
                  {data.sinaisVitais.saturacaoO2 ? `${data.sinaisVitais.saturacaoO2}%` : '--'}
                </div>
              </div>
              <div className="text-center border-r border-slate-800 last:border-none">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Glicemia</div>
                <div className="font-bold font-mono text-purple-400">
                  {data.sinaisVitais.glicemiaCapilar ? `${data.sinaisVitais.glicemiaCapilar} mg/dL` : '--'}
                </div>
              </div>
              <div className="text-center border-r border-slate-800 last:border-none">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">IMC</div>
                <div className="font-bold font-mono text-blue-300">
                  {data.sinaisVitais.imc ? `${data.sinaisVitais.imc} kg/m²` : '--'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Escala de Dor</div>
                <div className="font-bold font-mono text-orange-400">
                  {data.sinaisVitais.escalaDor !== null && data.sinaisVitais.escalaDor !== undefined
                    ? `${data.sinaisVitais.escalaDor} / 10`
                    : '0 / 10'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mensagens de Alerta ou Sucesso */}
        <div className="px-5 pt-3">
          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                {successMsg}
              </span>
              <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 font-bold hover:underline">
                ✕
              </button>
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between text-xs text-red-800 dark:text-red-200">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                {errorMsg}
              </span>
              <button onClick={() => setErrorMsg(null)} className="text-red-600 font-bold hover:underline">
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Conteúdo Principal com Abas Clínicas */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="text-sm">Carregando prontuário e histórico clínico...</span>
            </div>
          ) : !data ? (
            <div className="py-20 text-center text-gray-500">Nenhum dado clínico disponível.</div>
          ) : (
            <Tabs defaultValue="soap" className="w-full">
              <TabsList className="grid grid-cols-5 w-full bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-4">
                <TabsTrigger value="soap" className="flex items-center gap-1.5 text-xs">
                  <FileText className="h-4 w-4" />
                  <span>Anamnese SOAP</span>
                </TabsTrigger>
                <TabsTrigger value="prescricao" className="flex items-center gap-1.5 text-xs">
                  <Pill className="h-4 w-4" />
                  <span>Prescrição ({data.prescricoes?.length || 0})</span>
                </TabsTrigger>
                <TabsTrigger value="exames" className="flex items-center gap-1.5 text-xs">
                  <Microscope className="h-4 w-4" />
                  <span>Exames ({data.exames?.length || 0})</span>
                </TabsTrigger>
                <TabsTrigger value="atestado" className="flex items-center gap-1.5 text-xs">
                  <Award className="h-4 w-4" />
                  <span>Atestados ({data.atestados?.length || 0})</span>
                </TabsTrigger>
                <TabsTrigger value="historico" className="flex items-center gap-1.5 text-xs">
                  <History className="h-4 w-4" />
                  <span>Histórico Prévio ({historico.length})</span>
                </TabsTrigger>
              </TabsList>

              {/* ABA 1: SOAP & DIAGNÓSTICO */}
              <TabsContent value="soap" className="space-y-4">
                <form onSubmit={handleSaveEvolucao} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Profissional Responsável:
                      <select
                        value={profissionalId}
                        onChange={(e) => setProfissionalId(Number(e.target.value))}
                        className="ml-2 px-2 py-1 border rounded bg-white dark:bg-gray-800 text-xs"
                      >
                        {profissionais.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    {data.evolucao?.assinadoDigitalmente && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        Assinado digitalmente
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* S - Subjetivo */}
                    <div className="space-y-1.5 p-3.5 rounded-xl border-l-4 border-l-sky-500 border border-slate-200 dark:border-slate-800 bg-sky-50/40 dark:bg-sky-950/20 shadow-sm">
                      <label className="text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-black">
                          S
                        </span>
                        Subjetivo (Queixa, História da Doença Atual - HMA)
                      </label>
                      <textarea
                        rows={4}
                        value={subjetivo}
                        onChange={(e) => setSubjetivo(e.target.value)}
                        placeholder="Relato do paciente, início dos sintomas, evolução temporal, medicações em uso..."
                        className="w-full p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>

                    {/* O - Objetivo */}
                    <div className="space-y-1.5 p-3.5 rounded-xl border-l-4 border-l-emerald-500 border border-slate-200 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm">
                      <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                          O
                        </span>
                        Objetivo (Exame Físico Geral e Específico)
                      </label>
                      <textarea
                        rows={4}
                        value={objetivo}
                        onChange={(e) => setObjetivo(e.target.value)}
                        placeholder="Aparência, ausculta pulmonar e cardíaca, palpação abdominal, oroscopia, otoscopia..."
                        className="w-full p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    {/* A - Avaliação */}
                    <div className="space-y-1.5 p-3.5 rounded-xl border-l-4 border-l-amber-500 border border-slate-200 dark:border-slate-800 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm">
                      <label className="text-xs font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                          A
                        </span>
                        Avaliação (Hipóteses Diagnósticas / Raciocínio Clínico)
                      </label>
                      <textarea
                        rows={3}
                        value={avaliacao}
                        onChange={(e) => setAvaliacao(e.target.value)}
                        placeholder="Raciocínio clínico e diagnósticos sindrômicos formulados..."
                        className="w-full p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-amber-500"
                        required
                      />

                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500">CID-10 Código</label>
                          <Input
                            placeholder="Ex: J06.9"
                            value={cid10Codigo}
                            onChange={(e) => setCid10Codigo(e.target.value)}
                            className="h-8 text-xs font-mono font-bold"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-semibold text-slate-500">Descrição do Diagnóstico</label>
                          <Input
                            placeholder="Infecção aguda das vias aéreas superiores"
                            value={cid10Descricao}
                            onChange={(e) => setCid10Descricao(e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* P - Plano */}
                    <div className="space-y-1.5 p-3.5 rounded-xl border-l-4 border-l-indigo-500 border border-slate-200 dark:border-slate-800 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-sm">
                      <label className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                          P
                        </span>
                        Plano de Conduta (Terapêutica, Orientações e Retorno)
                      </label>
                      <textarea
                        rows={4}
                        value={planoConduta}
                        onChange={(e) => setPlanoConduta(e.target.value)}
                        placeholder="Orientações gerais, hidratação, sinais de alarme para retorno imediato..."
                        className="w-full p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={submittingAction === 'soap'}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1.5"
                    >
                      {submittingAction === 'soap' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Gravando SOAP...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          Gravar & Assinar Evolução SOAP
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* ABA 2: PRESCRIÇÃO */}
              <TabsContent value="prescricao" className="space-y-4">
                {/* Form Adicionar Medicamento */}
                <form
                  onSubmit={handleAddPrescricao}
                  className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-blue-600" />
                    Adicionar Medicamento à Receita Ambulatorial
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                        Medicamento e Concentração *
                      </label>
                      <Input
                        placeholder="Ex: Amoxicilina 500mg, Dipirona 500mg/mL..."
                        value={nomeMedicamento}
                        onChange={(e) => setNomeMedicamento(e.target.value)}
                        className="text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                        Via de Administração
                      </label>
                      <select
                        value={viaAdministracao}
                        onChange={(e) => setViaAdministracao(e.target.value)}
                        className="w-full h-9 px-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                      >
                        <option value="ORAL">Oral</option>
                        <option value="SUBLINGUAL">Sublingual</option>
                        <option value="INTRAVENOSA">Intravenosa (IV)</option>
                        <option value="INTRAMUSCULAR">Intramuscular (IM)</option>
                        <option value="SUBCUTANEA">Subcutânea</option>
                        <option value="TOPICA">Tópica / Cutânea</option>
                        <option value="INALATORIA">Inalatória</option>
                        <option value="OFTALMICA">Oftálmica</option>
                        <option value="OTOLOGICA">Otológica</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                        Quantidade Prescrita
                      </label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={quantidadePrescrita}
                        onChange={(e) => setQuantidadePrescrita(e.target.value)}
                        className="text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                        Posologia & Instruções de Uso *
                      </label>
                      <Input
                        placeholder="Ex: Tomar 1 comprimido por via oral a cada 8 horas por 7 dias."
                        value={posologia}
                        onChange={(e) => setPosologia(e.target.value)}
                        className="text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                        Orientações Especiais
                      </label>
                      <Input
                        placeholder="Ex: Tomar após as refeições"
                        value={orientacoesMedicamento}
                        onChange={(e) => setOrientacoesMedicamento(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={usoContinuo}
                        onChange={(e) => setUsoContinuo(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Medicamento de <strong>Uso Contínuo</strong> (Tratamento prolongado / Hiperdia)</span>
                    </label>

                    <Button
                      type="submit"
                      disabled={submittingAction === 'prescricao' || !nomeMedicamento || !posologia}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5"
                    >
                      {submittingAction === 'prescricao' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      Adicionar à Receita
                    </Button>
                  </div>
                </form>

                {/* Lista de Medicamentos Já Prescritos */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Medicamentos Prescritos neste Atendimento
                  </h4>
                  {data.prescricoes && data.prescricoes.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800 border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                      {data.prescricoes.map((p, idx) => (
                        <div key={p.id} className="p-3 text-xs flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <div className="space-y-0.5">
                            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              <span>{idx + 1}. {p.nomeMedicamento}</span>
                              <Badge variant="outline" className="text-[10px] uppercase font-mono">
                                {p.viaAdministracao}
                              </Badge>
                              {p.usoContinuo && (
                                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px] border-none">
                                  Uso Contínuo
                                </Badge>
                              )}
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">
                              <strong>Posologia:</strong> {p.posologia}
                            </div>
                            {p.orientacoes && (
                              <div className="text-gray-500 text-[11px]">
                                <em>Obs: {p.orientacoes}</em>
                              </div>
                            )}
                            <div className="text-[10px] text-gray-400 font-mono">
                              Chave Receita: {p.codigoAutenticidadeReceita}
                            </div>
                          </div>
                          <div className="text-right font-mono font-bold text-gray-700 dark:text-gray-300">
                            Qtd: {p.quantidadePrescrita}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-dashed">
                      Nenhum medicamento prescrito até o momento.
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ABA 3: EXAMES */}
              <TabsContent value="exames" className="space-y-4">
                <form
                  onSubmit={handleAddExame}
                  className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <Microscope className="h-4 w-4 text-indigo-600" />
                    Solicitar Exame Complementar (UPM341)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                        Descrição do Exame *
                      </label>
                      <Input
                        placeholder="Ex: Hemograma completo, Radiografia de tórax PA/Perfil, ECG..."
                        value={descricaoExame}
                        onChange={(e) => setDescricaoExame(e.target.value)}
                        className="text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                        Tipo do Exame
                      </label>
                      <select
                        value={tipoExame}
                        onChange={(e) => setTipoExame(e.target.value)}
                        className="w-full h-9 px-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                      >
                        <option value="LABORATORIAL">Laboratorial</option>
                        <option value="IMAGEM">Imagem / Raio-X / Ultrassom</option>
                        <option value="CARDIOLOGICO">Cardiológico / ECG</option>
                        <option value="OUTRO">Outros Procedimentos</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                      Justificativa Clínica / Indicação
                    </label>
                    <Input
                      placeholder="Ex: Investigação de febre de origem indeterminada e tosse persistente."
                      value={justificativaExame}
                      onChange={(e) => setJustificativaExame(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exameUrgente}
                        onChange={(e) => setExameUrgente(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span>Marcar como <strong>Urgente / Prioridade Alta</strong></span>
                    </label>

                    <Button
                      type="submit"
                      disabled={submittingAction === 'exame' || !descricaoExame}
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex items-center gap-1.5"
                    >
                      {submittingAction === 'exame' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      Registrar Solicitação
                    </Button>
                  </div>
                </form>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Exames Solicitados neste Atendimento
                  </h4>
                  {data.exames && data.exames.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800 border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                      {data.exames.map((ex, idx) => (
                        <div key={ex.id} className="p-3 text-xs flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              <span>{idx + 1}. {ex.descricaoExame}</span>
                              <Badge variant="outline" className="text-[10px]">
                                {ex.tipoExame}
                              </Badge>
                              {ex.urgente && (
                                <Badge className="bg-red-500 text-white text-[10px]">
                                  URGENTE
                                </Badge>
                              )}
                            </div>
                            {ex.justificativaClinica && (
                              <div className="text-gray-600 dark:text-gray-400 text-[11px] mt-0.5">
                                Justificativa: {ex.justificativaClinica}
                              </div>
                            )}
                          </div>
                          <Badge variant="outline" className="text-blue-600 border-blue-300 font-mono text-[10px]">
                            {ex.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-dashed">
                      Nenhum exame solicitado até o momento.
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ABA 4: ATESTADOS */}
              <TabsContent value="atestado" className="space-y-4">
                <form
                  onSubmit={handleAddAtestado}
                  className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-purple-600" />
                    Emissão de Atestado Médico ou Declaração de Comparecimento (PM1044 / UPM876)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                        Tipo de Documento
                      </label>
                      <select
                        value={tipoAtestado}
                        onChange={(e) => setTipoAtestado(e.target.value)}
                        className="w-full h-9 px-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                      >
                        <option value="AFASTAMENTO">Atestado de Afastamento do Trabalho</option>
                        <option value="COMPARECIMENTO">Declaração de Comparecimento</option>
                        <option value="APTIDAO_FISICA">Atestado de Aptidão Física</option>
                        <option value="ACOMPANHANTE">Declaração de Acompanhante</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                        Dias de Afastamento
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={diasAfastamento}
                        onChange={(e) => setDiasAfastamento(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                        CID-10
                      </label>
                      <Input
                        placeholder="Ex: J06.9"
                        value={atestadoCid}
                        onChange={(e) => setAtestadoCid(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                      Observações Clínicas no Atestado
                    </label>
                    <Input
                      placeholder="Ex: Paciente necessita de repouso absoluto durante o período."
                      value={observacoesAtestado}
                      onChange={(e) => setObservacoesAtestado(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autorizaDivulgacaoCid}
                        onChange={(e) => setAutorizaDivulgacaoCid(e.target.checked)}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span>Paciente <strong>autoriza expressamente</strong> a inclusão do código CID-10 no documento</span>
                    </label>

                    <Button
                      type="submit"
                      disabled={submittingAction === 'atestado'}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs flex items-center gap-1.5"
                    >
                      {submittingAction === 'atestado' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Award className="h-4 w-4" />
                      )}
                      Emitir Atestado
                    </Button>
                  </div>
                </form>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Atestados Emitidos neste Atendimento
                  </h4>
                  {data.atestados && data.atestados.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800 border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                      {data.atestados.map((at, idx) => (
                        <div key={at.id} className="p-3 text-xs flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              <span>{idx + 1}. Atestado de {at.tipoAtestado}</span>
                              {at.diasAfastamento && (
                                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px]">
                                  {at.diasAfastamento} {at.diasAfastamento === 1 ? 'dia' : 'dias'}
                                </Badge>
                              )}
                              {at.cid10Codigo && at.autorizaDivulgacaoCid && (
                                <Badge variant="outline" className="text-[10px] font-mono">
                                  CID: {at.cid10Codigo}
                                </Badge>
                              )}
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono mt-1">
                              Autenticidade: {at.codigoAutenticidade}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-emerald-600 border-emerald-300 text-[10px]">
                            Válido
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-dashed">
                      Nenhum atestado emitido até o momento.
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ABA 5: HISTÓRICO PRÉVIO */}
              <TabsContent value="historico" className="space-y-3">
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Histórico de Atendimentos Anteriores do Cidadão na Rede Municipal
                </h4>
                {historico.length > 0 ? (
                  <div className="space-y-3">
                    {historico.map((h) => (
                      <div
                        key={h.id}
                        className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span>{h.numeroAtendimento}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {h.unidadeSaude?.nomeFantasia || 'UBS Municipal'}
                            </Badge>
                          </div>
                          <span className="text-[11px] text-gray-500">
                            {h.dataHoraChegada ? new Date(h.dataHoraChegada).toLocaleDateString('pt-BR') : ''}
                          </span>
                        </div>

                        {h.profissional && (
                          <div className="text-gray-600 dark:text-gray-400 text-[11px]">
                            Atendido por: <strong>{h.profissional.nome}</strong>
                          </div>
                        )}

                        {h.diagnosticos && h.diagnosticos.length > 0 && (
                          <div className="text-gray-700 dark:text-gray-300 text-xs">
                            <strong>Diagnóstico:</strong> {h.diagnosticos[0].cid10Codigo} - {h.diagnosticos[0].cid10Descricao}
                          </div>
                        )}

                        {h.evolucao && (
                          <div className="p-2 bg-white dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-300">
                            <strong>Conduta:</strong> {h.evolucao.planoConduta}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-dashed">
                    Este paciente não possui atendimentos anteriores registrados no prontuário.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Fechar Janela
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (data) loadPepData(data.id)
              }}
              className="text-xs"
            >
              Recarregar Dados
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleFinalizarAtendimento}
              disabled={submittingAction === 'finalizar' || !data}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              {submittingAction === 'finalizar' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Finalizar Atendimento & Liberar Paciente
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
