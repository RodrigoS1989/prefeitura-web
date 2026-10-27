import React, { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import {
  Save,
  Users,
  MapPin,
  FileText,
  Building,
  HeartPulse,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
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

export interface CidadaoFormData {
  id?: number
  nomeCompleto: string
  nomeSocial?: string | null
  cpf?: string | null
  cns?: string | null
  nis?: string | null
  rg?: string | null
  rgOrgaoEmissor?: string | null
  nomeMae?: string | null
  nomePai?: string | null
  dataNascimento: string
  sexo: string
  racaCor?: string | null
  nacionalidade?: string
  cep?: string | null
  logradouro?: string | null
  numero?: string | null
  complemento?: string | null
  bairro?: string | null
  municipio?: string
  uf?: string
  telefoneCelular?: string | null
  telefoneFixo?: string | null
  email?: string | null
  unidadeSaude?: string
  situacaoCadastral?: 'ativo' | 'inativo' | 'obito'
  observacoes?: string | null
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  cidadao?: CidadaoFormData | null
  onSuccess?: () => void
}

export function CidadaoFormModal({ open, onOpenChange, cidadao, onSuccess }: Props) {
  const isEditing = !!cidadao && !!cidadao.id

  const formatInitialDate = (iso?: string) => {
    if (!iso) return ''
    return iso.split('T')[0]
  }

  const [formData, setFormData] = useState<CidadaoFormData>({
    nomeCompleto: '',
    nomeSocial: '',
    cpf: '',
    cns: '',
    nis: '',
    rg: '',
    rgOrgaoEmissor: '',
    nomeMae: '',
    nomePai: '',
    dataNascimento: '',
    sexo: 'O',
    racaCor: '',
    nacionalidade: 'Brasileira',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    municipio: 'São Paulo',
    uf: 'SP',
    telefoneCelular: '',
    telefoneFixo: '',
    email: '',
    unidadeSaude: 'UBS Central',
    situacaoCadastral: 'ativo',
    observacoes: '',
  })

  const [activeTab, setActiveTab] = useState('pessoais')
  const [loadingCep, setLoadingCep] = useState(false)
  const [cepSuccess, setCepSuccess] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (cidadao) {
      setFormData({
        id: cidadao.id,
        nomeCompleto: cidadao.nomeCompleto || '',
        nomeSocial: cidadao.nomeSocial || '',
        cpf: cidadao.cpf || '',
        cns: cidadao.cns || '',
        nis: cidadao.nis || '',
        rg: cidadao.rg || '',
        rgOrgaoEmissor: cidadao.rgOrgaoEmissor || '',
        nomeMae: cidadao.nomeMae || '',
        nomePai: cidadao.nomePai || '',
        dataNascimento: formatInitialDate(cidadao.dataNascimento),
        sexo: cidadao.sexo || 'O',
        racaCor: cidadao.racaCor || '',
        nacionalidade: cidadao.nacionalidade || 'Brasileira',
        cep: cidadao.cep || '',
        logradouro: cidadao.logradouro || '',
        numero: cidadao.numero || '',
        complemento: cidadao.complemento || '',
        bairro: cidadao.bairro || '',
        municipio: cidadao.municipio || 'São Paulo',
        uf: cidadao.uf || 'SP',
        telefoneCelular: cidadao.telefoneCelular || '',
        telefoneFixo: cidadao.telefoneFixo || '',
        email: cidadao.email || '',
        unidadeSaude: cidadao.unidadeSaude || 'UBS Central',
        situacaoCadastral: cidadao.situacaoCadastral || 'ativo',
        observacoes: cidadao.observacoes || '',
      })
    } else {
      setFormData({
        nomeCompleto: '',
        nomeSocial: '',
        cpf: '',
        cns: '',
        nis: '',
        rg: '',
        rgOrgaoEmissor: '',
        nomeMae: '',
        nomePai: '',
        dataNascimento: '',
        sexo: 'O',
        racaCor: '',
        nacionalidade: 'Brasileira',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        municipio: 'São Paulo',
        uf: 'SP',
        telefoneCelular: '',
        telefoneFixo: '',
        email: '',
        unidadeSaude: 'UBS Central',
        situacaoCadastral: 'ativo',
        observacoes: '',
      })
    }
    setErrors({})
    setActiveTab('pessoais')
  }, [cidadao, open])

  // Busca automática de CEP
  const handleCepBlur = async () => {
    const rawCep = (formData.cep || '').replace(/\D/g, '')
    if (rawCep.length === 8) {
      setLoadingCep(true)
      setCepSuccess(false)
      try {
        const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            logradouro: data.logradouro || prev.logradouro,
            bairro: data.bairro || prev.bairro,
            municipio: data.localidade || prev.municipio,
            uf: data.uf || prev.uf,
          }))
          setCepSuccess(true)
        }
      } catch (err) {
        console.error('Falha ao consultar CEP', err)
      } finally {
        setLoadingCep(false)
      }
    }
  }

  // Máscaras de digitação
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11)
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2')
    setFormData((prev) => ({ ...prev, cpf: v }))
  }

  const handleCnsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 15)
    setFormData((prev) => ({ ...prev, cns: v }))
  }

  const handleNisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 11)
    setFormData((prev) => ({ ...prev, nis: v }))
  }

  const handlePhoneChange = (field: 'telefoneCelular' | 'telefoneFixo', e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11)
    if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2')
    setFormData((prev) => ({ ...prev, [field]: v }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setErrors({})

    const url = isEditing ? `/cidadaos/${formData.id}` : '/cidadaos'
    const method = isEditing ? 'put' : 'post'

    router[method](url, formData as any, {
      preserveScroll: true,
      onSuccess: () => {
        setProcessing(false)
        onOpenChange(false)
        if (onSuccess) onSuccess()
      },
      onError: (errs) => {
        setProcessing(false)
        setErrors(errs)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-3 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  {isEditing ? 'Editar Cadastro de Munícipe' : 'Novo Cadastro de Munícipe (SUS / CadÚnico)'}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {isEditing
                    ? `Atualizando prontuário de ${formData.nomeCompleto || 'Munícipe'} • UPM002.pas`
                    : 'Registro unificado de munícipe com Cartão SUS e CadÚnico • Refatoração UPM002.pas'}
                </DialogDescription>
              </div>
            </div>
            {formData.situacaoCadastral && (
              <Badge
                variant={formData.situacaoCadastral === 'ativo' ? 'default' : 'secondary'}
                className="font-mono text-xs uppercase"
              >
                {formData.situacaoCadastral}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Form Body com Abas */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {Object.keys(errors).length > 0 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="h-4 w-4" />
                  <span>Por favor, verifique os campos com erro:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {Object.entries(errors).map(([key, msg]) => (
                    <li key={key}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full mb-4">
                <TabsTrigger value="pessoais" className="text-xs gap-1.5">
                  <Users className="h-3.5 w-3.5" /> Identificação
                </TabsTrigger>
                <TabsTrigger value="documentos" className="text-xs gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Documentos
                </TabsTrigger>
                <TabsTrigger value="endereco" className="text-xs gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Endereço & Contato
                </TabsTrigger>
                <TabsTrigger value="saude" className="text-xs gap-1.5">
                  <HeartPulse className="h-3.5 w-3.5" /> Vínculo & Situação
                </TabsTrigger>
              </TabsList>

              {/* ABA 1: IDENTIFICAÇÃO PESSOAL */}
              <TabsContent value="pessoais" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-foreground">
                      Nome Completo <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="Ex: Maria da Silva Santos"
                      value={formData.nomeCompleto}
                      onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Nome Social / Afetivo</label>
                    <Input
                      placeholder="Nome social ou preferencial do munícipe"
                      value={formData.nomeSocial || ''}
                      onChange={(e) => setFormData({ ...formData, nomeSocial: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Data de Nascimento <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Sexo Biológico <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={formData.sexo}
                      onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                      className="w-full h-9 px-3 bg-background border rounded-md text-xs font-medium focus:ring-2 focus:ring-primary"
                    >
                      <option value="F">Feminino</option>
                      <option value="M">Masculino</option>
                      <option value="O">Outro / Não Declarado</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Raça / Cor (IBGE)</label>
                    <select
                      value={formData.racaCor || ''}
                      onChange={(e) => setFormData({ ...formData, racaCor: e.target.value })}
                      className="w-full h-9 px-3 bg-background border rounded-md text-xs font-medium focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Não declarada</option>
                      <option value="Branca">Branca</option>
                      <option value="Preta">Preta</option>
                      <option value="Parda">Parda</option>
                      <option value="Amarela">Amarela</option>
                      <option value="Indígena">Indígena</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Nome da Mãe</label>
                    <Input
                      placeholder="Nome completo da genitora"
                      value={formData.nomeMae || ''}
                      onChange={(e) => setFormData({ ...formData, nomeMae: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Nome do Pai</label>
                    <Input
                      placeholder="Nome completo do genitor"
                      value={formData.nomePai || ''}
                      onChange={(e) => setFormData({ ...formData, nomePai: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* ABA 2: DOCUMENTOS OFICIAIS */}
              <TabsContent value="documentos" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      CPF (Cadastro de Pessoas Físicas)
                    </label>
                    <Input
                      placeholder="000.000.000-00"
                      value={formData.cpf || ''}
                      onChange={handleCpfChange}
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span>CNS (Cartão Nacional de Saúde)</span>
                      <span className="text-[10px] text-muted-foreground font-normal">15 dígitos</span>
                    </label>
                    <Input
                      placeholder="700000000000000"
                      value={formData.cns || ''}
                      onChange={handleCnsChange}
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span>NIS (CadÚnico / PIS / PASEP)</span>
                      <span className="text-[10px] text-muted-foreground font-normal">11 dígitos</span>
                    </label>
                    <Input
                      placeholder="00000000000"
                      value={formData.nis || ''}
                      onChange={handleNisChange}
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">RG</label>
                      <Input
                        placeholder="Nº do RG"
                        value={formData.rg || ''}
                        onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">Órgão Emissor / UF</label>
                      <Input
                        placeholder="Ex: SSP/SP"
                        value={formData.rgOrgaoEmissor || ''}
                        onChange={(e) => setFormData({ ...formData, rgOrgaoEmissor: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ABA 3: ENDEREÇO & CONTATO */}
              <TabsContent value="endereco" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span>CEP</span>
                      {loadingCep && <span className="text-[10px] text-primary">Buscando...</span>}
                      {cepSuccess && <span className="text-[10px] text-emerald-500 font-medium">Localizado!</span>}
                    </label>
                    <Input
                      placeholder="00000-000"
                      value={formData.cep || ''}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                      onBlur={handleCepBlur}
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-foreground">Logradouro / Rua / Avenida</label>
                    <Input
                      placeholder="Ex: Rua das Flores"
                      value={formData.logradouro || ''}
                      onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-semibold text-foreground">Número</label>
                    <Input
                      placeholder="Ex: 123"
                      value={formData.numero || ''}
                      onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-foreground">Complemento</label>
                    <Input
                      placeholder="Ex: Apto 42, Bloco B"
                      value={formData.complemento || ''}
                      onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-semibold text-foreground">Bairro</label>
                    <Input
                      placeholder="Ex: Centro"
                      value={formData.bairro || ''}
                      onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-semibold text-foreground">Município</label>
                    <Input
                      value={formData.municipio || ''}
                      onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-semibold text-foreground">UF</label>
                    <Input
                      value={formData.uf || ''}
                      onChange={(e) => setFormData({ ...formData, uf: e.target.value.toUpperCase() })}
                      maxLength={2}
                      className="text-xs uppercase"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-semibold text-foreground">Celular / WhatsApp</label>
                    <Input
                      placeholder="(11) 90000-0000"
                      value={formData.telefoneCelular || ''}
                      onChange={(e) => handlePhoneChange('telefoneCelular', e)}
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-semibold text-foreground">Telefone Fixo</label>
                    <Input
                      placeholder="(11) 3000-0000"
                      value={formData.telefoneFixo || ''}
                      onChange={(e) => handlePhoneChange('telefoneFixo', e)}
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-semibold text-foreground">E-mail</label>
                    <Input
                      type="email"
                      placeholder="cidadao@email.com"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* ABA 4: SAÚDE, SITUAÇÃO & OBSERVAÇÕES */}
              <TabsContent value="saude" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Unidade de Saúde de Referência (UBS)
                    </label>
                    <select
                      value={formData.unidadeSaude}
                      onChange={(e) => setFormData({ ...formData, unidadeSaude: e.target.value })}
                      className="w-full h-9 px-3 bg-background border rounded-md text-xs font-medium focus:ring-2 focus:ring-primary"
                    >
                      <option value="UBS Central">UBS Central</option>
                      <option value="USF Jardim Esperança">USF Jardim Esperança</option>
                      <option value="USF Vila Nova">USF Vila Nova</option>
                      <option value="UPA 24 Horas">UPA 24 Horas</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Situação Cadastral</label>
                    <select
                      value={formData.situacaoCadastral}
                      onChange={(e) => setFormData({ ...formData, situacaoCadastral: e.target.value as any })}
                      className="w-full h-9 px-3 bg-background border rounded-md text-xs font-medium focus:ring-2 focus:ring-primary"
                    >
                      <option value="ativo">Ativo e Regular</option>
                      <option value="inativo">Inativo / Transferido</option>
                      <option value="obito">Óbito Registrado</option>
                    </select>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-foreground">
                      Observações Clínicas & Assistenciais
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Alergias conhecidas, restrições, vulnerabilidades ou notas administrativas..."
                      value={formData.observacoes || ''}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      className="w-full p-3 bg-background border rounded-md text-xs focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="p-4 border-t bg-muted/20 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="gap-1.5" disabled={processing}>
              <Save className="h-4 w-4" />
              {processing ? 'Salvando...' : isEditing ? 'Atualizar Cadastro' : 'Salvar Cidadão'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
