import React, { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import {
  Activity,
  Heart,
  Thermometer,
  Gauge,
  Scale,
  Smile,
  Meh,
  Frown,
  AlertOctagon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileCheck,
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

export interface AtendimentoParaTriagem {
  id: number
  numeroAtendimento: string
  senhaPainel: string
  tipoAtendimento: string
  queixaPrincipal?: string | null
  prioridadeManchester: 'VERMELHO' | 'LARANJA' | 'AMARELO' | 'VERDE' | 'AZUL'
  discriminadorManchester?: string | null
  cidadao: {
    id: number
    nomeCompleto: string
    cpf?: string | null
    cns?: string | null
    dataNascimento?: string
  }
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
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  atendimento: AtendimentoParaTriagem | null
  onSuccess?: () => void
}

export function TriagemManchesterModal({ open, onOpenChange, atendimento, onSuccess }: Props) {
  // Sinais vitais
  const [paSistolica, setPaSistolica] = useState<string>('')
  const [paDiastolica, setPaDiastolica] = useState<string>('')
  const [frequenciaCardiaca, setFrequenciaCardiaca] = useState<string>('')
  const [frequenciaRespiratoria, setFrequenciaRespiratoria] = useState<string>('')
  const [temperatura, setTemperatura] = useState<string>('')
  const [saturacaoO2, setSaturacaoO2] = useState<string>('')
  const [peso, setPeso] = useState<string>('')
  const [altura, setAltura] = useState<string>('')
  const [glicemiaCapilar, setGlicemiaCapilar] = useState<string>('')
  const [escalaDor, setEscalaDor] = useState<number>(0)
  const [observacoesTriagem, setObservacoesTriagem] = useState<string>('')

  // Manchester
  const [prioridadeManchester, setPrioridadeManchester] = useState<'VERMELHO' | 'LARANJA' | 'AMARELO' | 'VERDE' | 'AZUL'>('VERDE')
  const [discriminadorManchester, setDiscriminadorManchester] = useState<string>('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (atendimento) {
      const sv = atendimento.sinaisVitais
      setPaSistolica(sv?.paSistolica ? String(sv.paSistolica) : '120')
      setPaDiastolica(sv?.paDiastolica ? String(sv.paDiastolica) : '80')
      setFrequenciaCardiaca(sv?.frequenciaCardiaca ? String(sv.frequenciaCardiaca) : '76')
      setFrequenciaRespiratoria(sv?.frequenciaRespiratoria ? String(sv.frequenciaRespiratoria) : '16')
      setTemperatura(sv?.temperatura ? String(sv.temperatura) : '36.5')
      setSaturacaoO2(sv?.saturacaoO2 ? String(sv.saturacaoO2) : '98')
      setPeso(sv?.peso ? String(sv.peso) : '')
      setAltura(sv?.altura ? String(sv.altura) : '')
      setGlicemiaCapilar(sv?.glicemiaCapilar ? String(sv.glicemiaCapilar) : '')
      setEscalaDor(sv?.escalaDor || 0)
      setObservacoesTriagem(sv?.observacoesTriagem || '')

      setPrioridadeManchester(atendimento.prioridadeManchester || 'VERDE')
      setDiscriminadorManchester(atendimento.discriminadorManchester || '')
      setErrorMsg(null)
    }
  }, [atendimento, open])

  // Cálculo reativo de IMC
  const pesoNum = parseFloat(peso.replace(',', '.'))
  const alturaNum = parseFloat(altura.replace(',', '.'))
  let imcCalculado: number | null = null
  let imcClassificacao = ''

  if (pesoNum > 0 && alturaNum > 0) {
    // se altura foi digitada em cm (ex: 175) converte para metros (1.75)
    const h = alturaNum > 3 ? alturaNum / 100 : alturaNum
    imcCalculado = Number((pesoNum / (h * h)).toFixed(1))
    if (imcCalculado < 18.5) imcClassificacao = 'Baixo peso'
    else if (imcCalculado < 25) imcClassificacao = 'Eutrófico (Normal)'
    else if (imcCalculado < 30) imcClassificacao = 'Sobrepeso'
    else if (imcCalculado < 35) imcClassificacao = 'Obesidade Grau I'
    else imcClassificacao = 'Obesidade Grau II/III'
  }

  const manchesterCores = [
    {
      cor: 'VERMELHO',
      nome: 'Vermelho - Emergência',
      tempo: '0 min (Imediato)',
      border: 'border-rose-600',
      bgActive: 'bg-rose-600 text-white shadow-lg border-rose-700 font-bold ring-2 ring-rose-500/40',
      bgInactive: 'bg-rose-50/70 text-rose-900 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900',
      badgeColor: 'bg-rose-600',
      discriminadores: [
        'Parada cardiorrespiratória',
        'Obstrução de vias aéreas / Sufocação',
        'Hemorragia exanguinante incontrolável',
        'Convulsão ativa em curso',
        'Choque / Inconsciência profunda',
      ],
    },
    {
      cor: 'LARANJA',
      nome: 'Laranja - Muito Urgente',
      tempo: '10 minutos',
      border: 'border-orange-500',
      bgActive: 'bg-orange-500 text-white shadow-lg border-orange-600 font-bold ring-2 ring-orange-400/40',
      bgInactive: 'bg-orange-50/70 text-orange-900 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-900',
      badgeColor: 'bg-orange-500',
      discriminadores: [
        'Dor torácica típica com irradiação',
        'Dispneia moderada a grave / Estridor',
        'Cefaleia súbita e intensa tipo trovoada',
        'Déficit neurológico focal agudo (suspeita AVC)',
        'Dor intensa (EVA 8 a 10)',
        'Alteração aguda do estado mental',
      ],
    },
    {
      cor: 'AMARELO',
      nome: 'Amarelo - Urgente',
      tempo: '60 minutos',
      border: 'border-amber-500',
      bgActive: 'bg-amber-300 text-amber-950 shadow-lg border-amber-600 font-black ring-2 ring-amber-400/50',
      bgInactive: 'bg-amber-50/70 text-amber-950 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800',
      badgeColor: 'bg-amber-400',
      discriminadores: [
        'Febre persistente em lactente/idoso',
        'Dor moderada contínua (EVA 4 a 7)',
        'Vômitos incoercíveis com desidratação',
        'Hemorragia menor sem instabilidade',
        'História prévia de risco ou pico hipertensivo sintomático',
      ],
    },
    {
      cor: 'VERDE',
      nome: 'Verde - Pouco Urgente',
      tempo: '120 minutos',
      border: 'border-emerald-600',
      bgActive: 'bg-emerald-600 text-white shadow-lg border-emerald-700 font-bold ring-2 ring-emerald-500/40',
      bgInactive: 'bg-emerald-50/70 text-emerald-900 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900',
      badgeColor: 'bg-emerald-600',
      discriminadores: [
        'Queixa aguda sem sinais de alerta',
        'Dor leve (EVA 1 a 3)',
        'Sintomas respiratórios leves (coriza, tosse leve)',
        'Lesão cutânea localizada recente',
        'Trauma menor sem deformidade',
      ],
    },
    {
      cor: 'AZUL',
      nome: 'Azul - Não Urgente',
      tempo: '240 minutos',
      border: 'border-sky-600',
      bgActive: 'bg-sky-600 text-white shadow-lg border-sky-700 font-bold ring-2 ring-sky-500/40',
      bgInactive: 'bg-sky-50/70 text-sky-900 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900',
      badgeColor: 'bg-sky-600',
      discriminadores: [
        'Troca ou renovação de receita médica',
        'Queixa crônica sem qualquer alteração recente',
        'Atestado de aptidão física / Declaração',
        'Retirada de pontos ou avaliação de rotina',
      ],
    },
  ]

  const activeColorConfig = manchesterCores.find((c) => c.cor === prioridadeManchester) || manchesterCores[3]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!atendimento) return

    if (!discriminadorManchester) {
      setErrorMsg('Selecione ou digite um discriminador clínico para fundamentar a cor Manchester.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg(null)

    const h = alturaNum > 3 ? alturaNum / 100 : alturaNum

    router.post(
      `/atendimentos/${atendimento.id}/triagem`,
      {
        prioridadeManchester,
        discriminadorManchester,
        paSistolica: paSistolica ? Number(paSistolica) : undefined,
        paDiastolica: paDiastolica ? Number(paDiastolica) : undefined,
        frequenciaCardiaca: frequenciaCardiaca ? Number(frequenciaCardiaca) : undefined,
        frequenciaRespiratoria: frequenciaRespiratoria ? Number(frequenciaRespiratoria) : undefined,
        temperatura: temperatura ? Number(temperatura.replace(',', '.')) : undefined,
        saturacaoO2: saturacaoO2 ? Number(saturacaoO2) : undefined,
        peso: pesoNum > 0 ? pesoNum : undefined,
        altura: h > 0 ? h : undefined,
        glicemiaCapilar: glicemiaCapilar ? Number(glicemiaCapilar) : undefined,
        escalaDor,
        observacoesTriagem: observacoesTriagem.trim() || undefined,
      },
      {
        onSuccess: () => {
          setIsSubmitting(false)
          onOpenChange(false)
          if (onSuccess) onSuccess()
        },
        onError: (errs) => {
          setIsSubmitting(false)
          const first = Object.values(errs)[0]
          setErrorMsg(first ? String(first) : 'Erro ao registrar triagem.')
        },
      }
    )
  }

  if (!atendimento) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  Triagem & Classificação de Risco (Manchester)
                </DialogTitle>
                <DialogDescription>
                  Aferição de sinais vitais, cálculo automático de IMC, escala EVA e classificação nas 5 cores Manchester.
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-base px-3 py-1 font-mono font-bold bg-gray-100 dark:bg-gray-800">
              {atendimento.senhaPainel}
            </Badge>
          </div>
        </DialogHeader>

        {/* Resumo do Paciente */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-gray-500">Paciente:</span>{' '}
            <strong className="text-sm text-gray-900 dark:text-white">{atendimento.cidadao.nomeCompleto}</strong>
            {atendimento.cidadao.cpf && <span className="ml-2 text-gray-500">CPF: {atendimento.cidadao.cpf}</span>}
          </div>
          <div>
            <span className="text-gray-500">Ficha:</span> <strong>{atendimento.numeroAtendimento}</strong>
          </div>
          {atendimento.queixaPrincipal && (
            <div className="w-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-800">
              <strong className="text-gray-500">Queixa da Recepção:</strong> {atendimento.queixaPrincipal}
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção 1: Sinais Vitais */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 border-b pb-1">
              <Heart className="h-4 w-4 text-red-500" />
              1. Aferição dos Sinais Vitais & Dados Antropométricos
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* PA */}
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">PA Sistólica (mmHg)</label>
                <Input
                  type="number"
                  placeholder="120"
                  value={paSistolica}
                  onChange={(e) => setPaSistolica(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">PA Diastólica (mmHg)</label>
                <Input
                  type="number"
                  placeholder="80"
                  value={paDiastolica}
                  onChange={(e) => setPaDiastolica(e.target.value)}
                  className="font-mono"
                />
              </div>

              {/* FC e FR */}
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Freq. Cardíaca (bpm)</label>
                <Input
                  type="number"
                  placeholder="76"
                  value={frequenciaCardiaca}
                  onChange={(e) => setFrequenciaCardiaca(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Freq. Respirat. (rpm)</label>
                <Input
                  type="number"
                  placeholder="16"
                  value={frequenciaRespiratoria}
                  onChange={(e) => setFrequenciaRespiratoria(e.target.value)}
                  className="font-mono"
                />
              </div>

              {/* Temp e SpO2 */}
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Temperatura (°C)</label>
                <Input
                  placeholder="36.5"
                  value={temperatura}
                  onChange={(e) => setTemperatura(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Saturação O₂ (%)</label>
                <Input
                  type="number"
                  placeholder="98"
                  value={saturacaoO2}
                  onChange={(e) => setSaturacaoO2(e.target.value)}
                  className="font-mono"
                />
              </div>

              {/* Glicemia */}
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Glicemia (mg/dL)</label>
                <Input
                  type="number"
                  placeholder="95"
                  value={glicemiaCapilar}
                  onChange={(e) => setGlicemiaCapilar(e.target.value)}
                  className="font-mono"
                />
              </div>

              {/* Peso e Altura */}
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Peso (kg)</label>
                <Input
                  placeholder="70.5"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Altura (ex: 1.75m)</label>
                <Input
                  placeholder="1.75"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  className="font-mono"
                />
              </div>

              {/* IMC Calculado */}
              <div className="col-span-2 p-2.5 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-blue-900 dark:text-blue-300">Índice de Massa Corporal (IMC)</div>
                  <div className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                    {imcCalculado ? `${imcCalculado} kg/m² (${imcClassificacao})` : 'Informe peso e altura'}
                  </div>
                </div>
                <Scale className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            {/* Escala Visual Analógica (EVA) de Dor */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-orange-500" />
                  Escala de Dor (EVA): <strong>{escalaDor} / 10</strong>
                  <span className="text-gray-500 font-normal">
                    {escalaDor === 0 && '(Sem dor)'}
                    {escalaDor >= 1 && escalaDor <= 3 && '(Dor leve)'}
                    {escalaDor >= 4 && escalaDor <= 7 && '(Dor moderada)'}
                    {escalaDor >= 8 && '(Dor intensa / severa)'}
                  </span>
                </label>
                {escalaDor === 0 ? (
                  <Smile className="h-5 w-5 text-emerald-500" />
                ) : escalaDor <= 6 ? (
                  <Meh className="h-5 w-5 text-amber-500" />
                ) : (
                  <Frown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={escalaDor}
                onChange={(e) => setEscalaDor(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>0 (Sem Dor)</span>
                <span>2</span>
                <span>4 (Moderada)</span>
                <span>6</span>
                <span>8</span>
                <span>10 (Insuportável)</span>
              </div>
            </div>
          </div>

          {/* Seção 2: Classificação Protocolo Manchester */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 border-b pb-1">
              <AlertOctagon className="h-4 w-4 text-amber-600" />
              2. Classificação de Risco (Protocolo Manchester)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {manchesterCores.map((c) => {
                const isSelected = prioridadeManchester === c.cor
                return (
                  <div
                    key={c.cor}
                    onClick={() => {
                      setPrioridadeManchester(c.cor as any)
                      if (!c.discriminadores.includes(discriminadorManchester)) {
                        setDiscriminadorManchester(c.discriminadores[0])
                      }
                    }}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected ? `${c.bgActive} ${c.border}` : `${c.bgInactive} hover:opacity-90`
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{c.nome}</div>
                      <div className={`text-[11px] font-mono mt-1 ${isSelected ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
                        Alvo: {c.tempo}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-2 text-right">
                        <CheckCircle2 className="h-4 w-4 inline" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Discriminador Clínico */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Discriminador Clínico para <strong>{prioridadeManchester}</strong> *
              </label>
              <select
                value={discriminadorManchester}
                onChange={(e) => setDiscriminadorManchester(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Selecione o discriminador clínico --</option>
                {activeColorConfig.discriminadores.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Ou descreva um discriminador customizado..."
                value={discriminadorManchester}
                onChange={(e) => setDiscriminadorManchester(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Observações da Triagem */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Observações Adicionais do Enfermeiro / Triador
              </label>
              <textarea
                rows={2}
                value={observacoesTriagem}
                onChange={(e) => setObservacoesTriagem(e.target.value)}
                placeholder="Ex: Paciente orientado, acompanhado por familiar, sem alergias medicamentosas relatadas..."
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              disabled={isSubmitting || !discriminadorManchester}
              className={`font-bold flex items-center gap-2 shadow-md transition-all ${
                prioridadeManchester === 'VERMELHO'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-500/50'
                  : prioridadeManchester === 'LARANJA'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white ring-2 ring-orange-400/50'
                  : prioridadeManchester === 'AMARELO'
                  ? 'bg-amber-300 hover:bg-amber-400 text-amber-950 border border-amber-500 ring-2 ring-amber-400/50 font-black'
                  : prioridadeManchester === 'VERDE'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500/50'
                  : 'bg-sky-600 hover:bg-sky-700 text-white ring-2 ring-sky-500/50'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando Triagem...
                </>
              ) : (
                <>
                  <FileCheck className="h-4 w-4" />
                  Concluir Triagem & Encaminhar à Fila Médica
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
