import React from 'react'
import {
  Users,
  MapPin,
  FileText,
  Building,
  HeartPulse,
  Phone,
  Mail,
  Calendar,
  Clock,
  Edit2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Pill,
  HeartHandshake,
  Stethoscope,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type CidadaoFormData } from './cidadao_form_modal'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  cidadao: CidadaoFormData | null
  onEdit?: (cidadao: CidadaoFormData) => void
}

export function CidadaoDetailsModal({ open, onOpenChange, cidadao, onEdit }: Props) {
  if (!cidadao) return null

  const getInitials = (name: string) => {
    if (!name) return 'CD'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const formatBirthDate = (iso?: string) => {
    if (!iso) return '-'
    const [year, month, day] = iso.split('T')[0].split('-')
    return `${day}/${month}/${year}`
  }

  const calculateAge = (iso?: string) => {
    if (!iso) return ''
    const birth = new Date(iso.split('T')[0])
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return `${age} anos`
  }

  // Exemplos de histórico clínico e dispensações integradas ao perfil 360°
  const historicoClinico = [
    {
      id: 101,
      data: '15/10/2026 09:30',
      tipo: 'Consulta Médica - Clínica Geral',
      profissional: 'Dr. Roberto Mendes (CRM 142.890)',
      unidade: cidadao.unidadeSaude || 'UBS Central',
      diagnostico: 'I10 - Hipertensão essencial (primária)',
      conduta: 'Manter Losartana 50mg 1x/dia. Solicitado ECG e perfil lipídico de rotina.',
    },
    {
      id: 98,
      data: '22/08/2026 14:15',
      tipo: 'Acolhimento & Triagem (Manchester)',
      profissional: 'Enf. Juliana Vasconcelos (COREN 234.567)',
      unidade: cidadao.unidadeSaude || 'UBS Central',
      diagnostico: 'Classificação Verde (Pouco Urgente)',
      conduta: 'PA 130x85 mmHg, Glicemia capilar 104 mg/dL. Encaminhada para consulta agendada.',
    },
  ]

  const dispensacoes = [
    {
      id: 501,
      data: '15/10/2026',
      medicamento: 'Losartana Potássica 50mg',
      quantidade: 60,
      unidadeMedida: 'Comprimidos',
      posologia: 'Tomar 1 comprimido pela manhã em jejum',
      farmaceutico: 'Farm. Carlos Eduardo (CRF 89.123)',
      lote: 'L-2026-X89',
    },
    {
      id: 489,
      data: '15/09/2026',
      medicamento: 'Losartana Potássica 50mg',
      quantidade: 60,
      unidadeMedida: 'Comprimidos',
      posologia: 'Tomar 1 comprimido pela manhã em jejum',
      farmaceutico: 'Farm. Carlos Eduardo (CRF 89.123)',
      lote: 'L-2026-W42',
    },
  ]

  const programasSociais = [
    {
      programa: 'Programa Bolsa Família',
      nis: cidadao.nis || 'Não informado',
      status: cidadao.nis ? 'Ativo e Regular' : 'Não Vinculado',
      faixaRenda: 'Extrema Pobreza / Baixa Renda',
      ultimaAtualizacaoCadUnico: '10/08/2026',
    },
    {
      programa: 'Programa Farmácia Popular / Municipal',
      status: 'Habilitado',
      observacao: 'Dispensação gratuita de medicamentos anti-hipertensivos e antidiabéticos',
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Modal Header com Identificação 360° */}
        <DialogHeader className="p-6 pb-4 border-b bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-xs">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                  {getInitials(cidadao.nomeCompleto)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl font-bold tracking-tight">
                    {cidadao.nomeCompleto}
                  </DialogTitle>
                  {cidadao.situacaoCadastral === 'ativo' ? (
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10 text-[10px]">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Ativo
                    </Badge>
                  ) : cidadao.situacaoCadastral === 'inativo' ? (
                    <Badge variant="secondary" className="text-[10px]">
                      <XCircle className="h-3 w-3 mr-1" /> Inativo
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[10px]">
                      <AlertCircle className="h-3 w-3 mr-1" /> Óbito
                    </Badge>
                  )}
                </div>
                {cidadao.nomeSocial && (
                  <p className="text-xs text-muted-foreground italic">Nome Social: {cidadao.nomeSocial}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span>Prontuário #{cidadao.id}</span>
                  {cidadao.cpf && <span className="font-mono">CPF: {cidadao.cpf}</span>}
                  {cidadao.cns && (
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">
                      CNS: {cidadao.cns}
                    </span>
                  )}
                  {cidadao.nis && <span className="font-mono text-cyan-600">NIS: {cidadao.nis}</span>}
                </div>
              </div>
            </div>

            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onOpenChange(false)
                  onEdit(cidadao)
                }}
                className="gap-1.5 self-start sm:self-center"
              >
                <Edit2 className="h-3.5 w-3.5" /> Editar Munícipe
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Modal Body com Abas 360° */}
        <div className="p-6 overflow-y-auto flex-1">
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-4">
              <TabsTrigger value="geral" className="text-xs gap-1.5">
                <Users className="h-3.5 w-3.5" /> Resumo Geral
              </TabsTrigger>
              <TabsTrigger value="pep" className="text-xs gap-1.5">
                <Stethoscope className="h-3.5 w-3.5" /> Prontuário & PEP
              </TabsTrigger>
              <TabsTrigger value="farmacia" className="text-xs gap-1.5">
                <Pill className="h-3.5 w-3.5" /> Farmácia
              </TabsTrigger>
              <TabsTrigger value="social" className="text-xs gap-1.5">
                <HeartHandshake className="h-3.5 w-3.5" /> Benefícios & CadÚnico
              </TabsTrigger>
            </TabsList>

            {/* ABA 1: RESUMO GERAL */}
            <TabsContent value="geral" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                      <FileText className="h-3.5 w-3.5 text-primary" /> Dados Pessoais & Filiação
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Nascimento:</span>
                        <span className="font-medium">
                          {formatBirthDate(cidadao.dataNascimento)} ({calculateAge(cidadao.dataNascimento)})
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Sexo:</span>
                        <span className="font-medium">
                          {cidadao.sexo === 'F' ? 'Feminino' : cidadao.sexo === 'M' ? 'Masculino' : 'Outro'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Raça / Cor:</span>
                        <span className="font-medium">{cidadao.racaCor || 'Não declarada'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Nacionalidade:</span>
                        <span className="font-medium">{cidadao.nacionalidade || 'Brasileira'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground block text-[11px]">Nome da Mãe:</span>
                        <span className="font-medium">{cidadao.nomeMae || 'Não informada'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground block text-[11px]">Nome do Pai:</span>
                        <span className="font-medium">{cidadao.nomePai || 'Não informado'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> Endereço & Contatos
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Logradouro / Bairro:</span>
                        <span className="font-medium">
                          {cidadao.logradouro ? `${cidadao.logradouro}, ${cidadao.numero || 'S/N'}` : 'Não informado'}
                          {cidadao.complemento ? ` (${cidadao.complemento})` : ''} - {cidadao.bairro || 'Centro'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Município / UF:</span>
                        <span className="font-medium">
                          {cidadao.municipio || 'São Paulo'} - {cidadao.uf || 'SP'}{' '}
                          {cidadao.cep && <span className="font-mono text-muted-foreground font-normal">({cidadao.cep})</span>}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t">
                        <div>
                          <span className="text-muted-foreground block text-[11px]">Celular:</span>
                          <span className="font-medium font-mono">{cidadao.telefoneCelular || '-'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[11px]">Telefone Fixo:</span>
                          <span className="font-medium font-mono">{cidadao.telefoneFixo || '-'}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">E-mail:</span>
                        <span className="font-medium">{cidadao.email || 'Não informado'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Vínculo Municipal & Observações */}
              <div className="p-4 rounded-lg border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary shrink-0" />
                  <div className="text-xs">
                    <span className="text-muted-foreground">Unidade Básica de Referência:</span>
                    <span className="font-semibold text-foreground ml-1">{cidadao.unidadeSaude || 'UBS Central'}</span>
                  </div>
                </div>
                {cidadao.observacoes && (
                  <p className="text-xs text-muted-foreground italic max-w-md">
                    Obs: {cidadao.observacoes}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* ABA 2: PRONTUÁRIO & PEP */}
            <TabsContent value="pep" className="space-y-3 mt-0">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="h-3.5 w-3.5 text-primary" /> Histórico Clínico Ambulatorial (FTD001-FTD008)
                </h3>
                <span className="text-[11px] text-muted-foreground">{historicoClinico.length} registros</span>
              </div>
              <div className="space-y-2">
                {historicoClinico.map((h) => (
                  <div key={h.id} className="p-3 rounded-lg border bg-muted/10 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {h.data}
                        </Badge>
                        <span className="font-semibold text-foreground">{h.tipo}</span>
                      </div>
                      <span className="text-muted-foreground text-[11px]">{h.unidade}</span>
                    </div>
                    <p className="text-muted-foreground">Profissional: <strong className="text-foreground">{h.profissional}</strong></p>
                    <div className="p-2 rounded bg-background border text-[11px] space-y-0.5">
                      <p><strong className="text-primary">Diagnóstico:</strong> {h.diagnostico}</p>
                      <p><strong className="text-primary">Conduta:</strong> {h.conduta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ABA 3: FARMÁCIA & MEDICAMENTOS */}
            <TabsContent value="farmacia" className="space-y-3 mt-0">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Pill className="h-3.5 w-3.5 text-amber-500" /> Histórico de Dispensações (ARQ036 / FEFO)
                </h3>
                <span className="text-[11px] text-muted-foreground">{dispensacoes.length} dispensações</span>
              </div>
              <div className="space-y-2">
                {dispensacoes.map((d) => (
                  <div key={d.id} className="p-3 rounded-lg border bg-muted/10 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px] text-amber-600 border-amber-500/30">
                          {d.data}
                        </Badge>
                        <span className="font-semibold text-foreground">{d.medicamento}</span>
                      </div>
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        Lote: {d.lote}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      Quantidade: <strong className="text-foreground">{d.quantidade} {d.unidadeMedida}</strong> • {d.farmaceutico}
                    </p>
                    <p className="text-[11px] italic text-muted-foreground">Posologia: {d.posologia}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ABA 4: ASSISTÊNCIA SOCIAL */}
            <TabsContent value="social" className="space-y-3 mt-0">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <HeartHandshake className="h-3.5 w-3.5 text-cyan-600" /> Integração CadÚnico & Benefícios Sociais
                </h3>
                <span className="text-[11px] text-muted-foreground">PMD018 / PMD083</span>
              </div>
              <div className="space-y-2">
                {programasSociais.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-lg border bg-muted/10 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{p.programa}</span>
                      <Badge className="bg-emerald-600 font-mono text-[10px]">{p.status}</Badge>
                    </div>
                    {p.nis && (
                      <p className="text-muted-foreground">
                        NIS Vinculado: <strong className="font-mono text-foreground">{p.nis}</strong>
                        {p.faixaRenda && ` • ${p.faixaRenda}`}
                      </p>
                    )}
                    {p.ultimaAtualizacaoCadUnico && (
                      <p className="text-[11px] text-muted-foreground">
                        Última atualização CadÚnico: {p.ultimaAtualizacaoCadUnico}
                      </p>
                    )}
                    {p.observacao && <p className="text-[11px] italic text-muted-foreground">{p.observacao}</p>}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="p-4 border-t bg-muted/20">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
