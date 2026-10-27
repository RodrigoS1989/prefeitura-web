import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/react'
import {
  ArrowLeft,
  Save,
  Users,
  MapPin,
  FileText,
  Building,
  HeartPulse,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AppLayout from '~/layouts/AppLayout'

interface CidadaoData {
  id: number
  nomeCompleto: string
  nomeSocial: string | null
  cpf: string | null
  cns: string | null
  nis: string | null
  rg: string | null
  rgOrgaoEmissor: string | null
  nomeMae: string | null
  nomePai: string | null
  dataNascimento: string
  sexo: string
  racaCor: string | null
  nacionalidade: string
  cep: string | null
  logradouro: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  municipio: string
  uf: string
  telefoneCelular: string | null
  telefoneFixo: string | null
  email: string | null
  unidadeSaude: string
  situacaoCadastral: 'ativo' | 'inativo' | 'obito'
  observacoes: string | null
}

interface Props {
  cidadao: CidadaoData | null
}

const CidadaoForm: React.FC<Props> & { layout?: (page: React.ReactNode) => React.ReactNode } = ({
  cidadao,
}) => {
  const isEditing = !!cidadao

  const formatInitialDate = (iso?: string) => {
    if (!iso) return ''
    return iso.split('T')[0]
  }

  const { data, setData, post, put, processing, errors } = useForm({
    nomeCompleto: cidadao?.nomeCompleto || '',
    nomeSocial: cidadao?.nomeSocial || '',
    cpf: cidadao?.cpf || '',
    cns: cidadao?.cns || '',
    nis: cidadao?.nis || '',
    rg: cidadao?.rg || '',
    rgOrgaoEmissor: cidadao?.rgOrgaoEmissor || '',
    nomeMae: cidadao?.nomeMae || '',
    nomePai: cidadao?.nomePai || '',
    dataNascimento: formatInitialDate(cidadao?.dataNascimento),
    sexo: cidadao?.sexo || 'O',
    racaCor: cidadao?.racaCor || '',
    nacionalidade: cidadao?.nacionalidade || 'Brasileira',
    cep: cidadao?.cep || '',
    logradouro: cidadao?.logradouro || '',
    numero: cidadao?.numero || '',
    complemento: cidadao?.complemento || '',
    bairro: cidadao?.bairro || '',
    municipio: cidadao?.municipio || 'São Paulo',
    uf: cidadao?.uf || 'SP',
    telefoneCelular: cidadao?.telefoneCelular || '',
    telefoneFixo: cidadao?.telefoneFixo || '',
    email: cidadao?.email || '',
    unidadeSaude: cidadao?.unidadeSaude || 'UBS Central',
    situacaoCadastral: cidadao?.situacaoCadastral || 'ativo',
    observacoes: cidadao?.observacoes || '',
  })

  const [loadingCep, setLoadingCep] = useState(false)
  const [cepSuccess, setCepSuccess] = useState(false)

  // Auto CEP lookup
  const handleCepBlur = async () => {
    const rawCep = data.cep.replace(/\D/g, '')
    if (rawCep.length === 8) {
      setLoadingCep(true)
      setCepSuccess(false)
      try {
        const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`)
        const result = await response.json()
        if (!result.erro) {
          setData((prev) => ({
            ...prev,
            logradouro: result.logradouro || prev.logradouro,
            bairro: result.bairro || prev.bairro,
            municipio: result.localidade || prev.municipio,
            uf: result.uf || prev.uf,
          }))
          setCepSuccess(true)
        }
      } catch {
        // Fallback silently if offline
      } finally {
        setLoadingCep(false)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing) {
      put(`/cidadaos/${cidadao.id}`)
    } else {
      post('/cidadaos')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? `Editar: ${cidadao.nomeCompleto}` : 'Novo Cadastro de Munícipe'}
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
              {isEditing ? 'Atualização de Dados' : 'Inclusão de Cidadão'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Registro unificado para Saúde (SUS), Assistência Social (CadÚnico) e Administração Geral
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={isEditing ? `/cidadaos/${cidadao.id}` : '/cidadaos'}>
            <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="h-4 w-4" /> Cancelar
            </Button>
          </Link>
          <Button type="submit" size="sm" disabled={processing} className="gap-2 shadow-sm">
            <Save className="h-4 w-4" />
            {processing ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Cidadão'}
          </Button>
        </div>
      </div>

      {/* Section 1: Identificação Civil */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Identificação Civil & Documentos
          </CardTitle>
          <CardDescription className="text-xs">
            Dados pessoais e números de registro oficiais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium">Nome Completo *</label>
              <Input
                value={data.nomeCompleto}
                onChange={(e) => setData('nomeCompleto', e.target.value)}
                placeholder="Ex: Maria Aparecida da Silva"
                required
              />
              {errors.nomeCompleto && (
                <p className="text-[11px] text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.nomeCompleto}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Nome Social</label>
              <Input
                value={data.nomeSocial}
                onChange={(e) => setData('nomeSocial', e.target.value)}
                placeholder="Nome social adotado (se houver)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" /> CPF
              </label>
              <Input
                value={data.cpf}
                onChange={(e) => setData('cpf', e.target.value)}
                placeholder="000.000.000-00"
              />
              {errors.cpf && (
                <p className="text-[11px] text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.cpf}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium flex items-center gap-1">
                <HeartPulse className="h-3.5 w-3.5 text-emerald-500" /> Cartão SUS (CNS)
              </label>
              <Input
                value={data.cns}
                onChange={(e) => setData('cns', e.target.value)}
                placeholder="15 dígitos"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium flex items-center gap-1">
                NIS (CadÚnico / Bolsa Família)
              </label>
              <Input
                value={data.nis}
                onChange={(e) => setData('nis', e.target.value)}
                placeholder="11 dígitos"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Data de Nascimento *</label>
              <Input
                type="date"
                value={data.dataNascimento}
                onChange={(e) => setData('dataNascimento', e.target.value)}
                required
              />
              {errors.dataNascimento && (
                <p className="text-[11px] text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.dataNascimento}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Sexo / Gênero</label>
              <select
                value={data.sexo}
                onChange={(e) => setData('sexo', e.target.value)}
                className="w-full h-9 px-3 bg-background border rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
                <option value="O">Outro / Não Declarado</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Raça / Cor</label>
              <select
                value={data.racaCor}
                onChange={(e) => setData('racaCor', e.target.value)}
                className="w-full h-9 px-3 bg-background border rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione...</option>
                <option value="Branca">Branca</option>
                <option value="Preta">Preta</option>
                <option value="Parda">Parda</option>
                <option value="Amarela">Amarela</option>
                <option value="Indígena">Indígena</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Nacionalidade</label>
              <Input
                value={data.nacionalidade}
                onChange={(e) => setData('nacionalidade', e.target.value)}
                placeholder="Brasileira"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Nome da Mãe</label>
              <Input
                value={data.nomeMae}
                onChange={(e) => setData('nomeMae', e.target.value)}
                placeholder="Nome completo da mãe"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Nome do Pai</label>
              <Input
                value={data.nomePai}
                onChange={(e) => setData('nomePai', e.target.value)}
                placeholder="Nome completo do pai"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Endereço & Contato */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Endereço Residencial & Contatos
          </CardTitle>
          <CardDescription className="text-xs">
            Preenchimento inteligente com consulta de CEP automática
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium flex items-center justify-between">
                <span>CEP</span>
                {loadingCep && <span className="text-[10px] text-primary animate-pulse">Buscando CEP...</span>}
                {cepSuccess && <span className="text-[10px] text-emerald-600 flex items-center gap-0.5"><CheckCircle2 className="h-3 w-3" /> Preenchido</span>}
              </label>
              <div className="relative">
                <Input
                  value={data.cep}
                  onChange={(e) => setData('cep', e.target.value)}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium">Logradouro (Rua, Av.)</label>
              <Input
                value={data.logradouro}
                onChange={(e) => setData('logradouro', e.target.value)}
                placeholder="Ex: Rua das Flores"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Número</label>
              <Input
                value={data.numero}
                onChange={(e) => setData('numero', e.target.value)}
                placeholder="123 ou S/N"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Complemento</label>
              <Input
                value={data.complemento}
                onChange={(e) => setData('complemento', e.target.value)}
                placeholder="Apto, Bloco, Casa 2"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Bairro</label>
              <Input
                value={data.bairro}
                onChange={(e) => setData('bairro', e.target.value)}
                placeholder="Bairro"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Município</label>
              <Input
                value={data.municipio}
                onChange={(e) => setData('municipio', e.target.value)}
                placeholder="Município"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">UF</label>
              <Input
                value={data.uf}
                maxLength={2}
                onChange={(e) => setData('uf', e.target.value.toUpperCase())}
                placeholder="SP"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t">
            <div className="space-y-1">
              <label className="text-xs font-medium">Telefone Celular / WhatsApp</label>
              <Input
                value={data.telefoneCelular}
                onChange={(e) => setData('telefoneCelular', e.target.value)}
                placeholder="(11) 90000-0000"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Telefone Fixo / Recados</label>
              <Input
                value={data.telefoneFixo}
                onChange={(e) => setData('telefoneFixo', e.target.value)}
                placeholder="(11) 3000-0000"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">E-mail</label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="cidadao@exemplo.com.br"
              />
              {errors.email && (
                <p className="text-[11px] text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.email}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Vínculos Municipais & Situação */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" /> Vínculo Municipal & Situação Cadastral
          </CardTitle>
          <CardDescription className="text-xs">
            Unidade de saúde de referência e observações de prontuário
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Unidade Básica de Saúde (UBS)</label>
              <select
                value={data.unidadeSaude}
                onChange={(e) => setData('unidadeSaude', e.target.value)}
                className="w-full h-9 px-3 bg-background border rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="UBS Central">UBS Central</option>
                <option value="UBS Jardim Paulista">UBS Jardim Paulista</option>
                <option value="UBS Vila Mariana">UBS Vila Mariana</option>
                <option value="UBS Santana">UBS Santana</option>
                <option value="UBS Mooca">UBS Mooca</option>
                <option value="UBS Perdizes">UBS Perdizes</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Situação Cadastral</label>
              <select
                value={data.situacaoCadastral}
                onChange={(e) => setData('situacaoCadastral', e.target.value as 'ativo' | 'inativo' | 'obito')}
                className="w-full h-9 px-3 bg-background border rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="obito">Óbito</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Observações Clínicas / Assistenciais</label>
            <textarea
              value={data.observacoes}
              onChange={(e) => setData('observacoes', e.target.value)}
              rows={3}
              placeholder="Alergias, condições crônicas, programas sociais, restrições..."
              className="w-full p-3 bg-background border rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link href={isEditing ? `/cidadaos/${cidadao.id}` : '/cidadaos'}>
          <Button type="button" variant="outline" size="sm">
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={processing} size="sm" className="gap-2 shadow-sm">
          <Save className="h-4 w-4" />
          {processing ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Cidadão'}
        </Button>
      </div>
    </form>
  )
}

CidadaoForm.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>

export default CidadaoForm
