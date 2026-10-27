import React from 'react'
import { Link } from '@inertiajs/react'
import {
  ArrowLeft,
  Edit2,
  FileText,
  HeartPulse,
  MapPin,
  Phone,
  Building,
  User,
  Pill,
  HeartHandshake,
  Stethoscope,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

interface HistoricoItem {
  id: number
  data: string
  tipo: string
  profissional: string
  unidade: string
  diagnostico: string
  conduta: string
}

interface DispensacaoItem {
  id: number
  data: string
  medicamento: string
  quantidade: number
  unidadeMedida: string
  posologia: string
  farmaceutico: string
  lote: string
}

interface ProgramaSocialItem {
  programa: string
  nis?: string
  status: string
  faixaRenda?: string
  ultimaAtualizacaoCadUnico?: string
  observacao?: string
}

interface Props {
  cidadao: CidadaoData
  historicoClinico: HistoricoItem[]
  dispensacoes: DispensacaoItem[]
  programasSociais: ProgramaSocialItem[]
}

const CidadaoShow: React.FC<Props> & { layout?: (page: React.ReactNode) => React.ReactNode } = ({
  cidadao,
  historicoClinico,
  dispensacoes,
  programasSociais,
}) => {
  const getInitials = (name: string) => {
    if (!name) return 'CD'
    const parts = name.split(' ')
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase()
  }

  const formatBirthDate = (iso: string) => {
    if (!iso) return '-'
    const [year, month, day] = iso.split('T')[0].split('-')
    const birthYear = parseInt(year, 10)
    const currentYear = new Date().getFullYear()
    const age = currentYear - birthYear
    return `${day}/${month}/${year} (${age} anos)`
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/cidadaos">
          <Button variant="ghost" size="sm" className="gap-2 text-xs text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar para a Listagem
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/cidadaos/${cidadao.id}/editar`}>
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Edit2 className="h-3.5 w-3.5" /> Editar Cadastro
            </Button>
          </Link>
          <Link href="/atendimentos">
            <Button size="sm" className="gap-2 text-xs">
              <Stethoscope className="h-3.5 w-3.5" /> Iniciar Acolhimento
            </Button>
          </Link>
        </div>
      </div>

      {/* Header Profile Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-card via-card to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            <Avatar className="h-20 w-20 border-2 border-primary/30 shadow-md">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {getInitials(cidadao.nomeCompleto)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{cidadao.nomeCompleto}</h1>
                <Badge
                  variant={cidadao.situacaoCadastral === 'ativo' ? 'outline' : 'secondary'}
                  className="font-mono text-xs border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                >
                  ● {cidadao.situacaoCadastral.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  ID: #{cidadao.id.toString().padStart(6, '0')}
                </span>
              </div>

              {cidadao.nomeSocial && (
                <p className="text-xs text-muted-foreground">
                  Nome Social: <span className="text-foreground font-medium">{cidadao.nomeSocial}</span>
                </p>
              )}

              {/* Key Document Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                {cidadao.cpf && (
                  <Badge variant="secondary" className="gap-1.5 py-1">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" /> CPF: {cidadao.cpf}
                  </Badge>
                )}
                {cidadao.cns && (
                  <Badge variant="secondary" className="gap-1.5 py-1 text-emerald-600 dark:text-emerald-400">
                    <HeartPulse className="h-3.5 w-3.5" /> Cartão SUS: {cidadao.cns}
                  </Badge>
                )}
                {cidadao.nis && (
                  <Badge variant="secondary" className="gap-1.5 py-1 text-cyan-600 dark:text-cyan-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> NIS: {cidadao.nis}
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1.5 py-1 text-muted-foreground">
                  <Building className="h-3.5 w-3.5" /> Ref: {cidadao.unidadeSaude}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 360 Degree Tabs */}
      <Tabs defaultValue="dados-pessoais" className="space-y-4">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="dados-pessoais" className="gap-2 text-xs">
            <User className="h-3.5 w-3.5" /> Identificação Civil
          </TabsTrigger>
          <TabsTrigger value="endereco-contato" className="gap-2 text-xs">
            <MapPin className="h-3.5 w-3.5" /> Endereço & Contato
          </TabsTrigger>
          <TabsTrigger value="prontuario-sus" className="gap-2 text-xs">
            <Stethoscope className="h-3.5 w-3.5" /> Prontuário SUS ({historicoClinico.length})
          </TabsTrigger>
          <TabsTrigger value="farmacia" className="gap-2 text-xs">
            <Pill className="h-3.5 w-3.5" /> Farmácia & Receitas ({dispensacoes.length})
          </TabsTrigger>
          <TabsTrigger value="assistencia-social" className="gap-2 text-xs">
            <HeartHandshake className="h-3.5 w-3.5" /> CadÚnico & Social
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Identificação Civil */}
        <TabsContent value="dados-pessoais" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informações Civis e Filiação</CardTitle>
              <CardDescription className="text-xs">
                Dados consolidados de registro civil do munícipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div>
                  <span className="text-muted-foreground">Data de Nascimento:</span>
                  <p className="font-medium text-foreground text-sm mt-0.5">
                    {formatBirthDate(cidadao.dataNascimento)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sexo / Gênero:</span>
                  <p className="font-medium text-foreground text-sm mt-0.5">
                    {cidadao.sexo === 'F' ? 'Feminino' : cidadao.sexo === 'M' ? 'Masculino' : 'Outro / Não Declarado'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Raça / Cor:</span>
                  <p className="font-medium text-foreground text-sm mt-0.5">
                    {cidadao.racaCor || 'Não informada'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nome da Mãe:</span>
                  <p className="font-medium text-foreground text-sm mt-0.5">
                    {cidadao.nomeMae || 'Não declarado'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nome do Pai:</span>
                  <p className="font-medium text-foreground text-sm mt-0.5">
                    {cidadao.nomePai || 'Não declarado'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nacionalidade:</span>
                  <p className="font-medium text-foreground text-sm mt-0.5">
                    {cidadao.nacionalidade}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Registro Geral (RG):</span>
                  <p className="font-medium text-foreground text-sm mt-0.5 font-mono">
                    {cidadao.rg ? `${cidadao.rg} (${cidadao.rgOrgaoEmissor || 'SSP'})` : 'Não cadastrado'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Unidade Básica de Referência:</span>
                  <p className="font-medium text-foreground text-sm mt-0.5">
                    {cidadao.unidadeSaude}
                  </p>
                </div>
              </div>

              {cidadao.observacoes && (
                <div className="mt-6 pt-4 border-t">
                  <span className="text-xs text-muted-foreground">Observações Médicas / Sociais:</span>
                  <p className="text-xs text-foreground mt-1 bg-muted/40 p-3 rounded-md leading-relaxed">
                    {cidadao.observacoes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Endereço & Contato */}
        <TabsContent value="endereco-contato" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Endereço Residencial
                </CardTitle>
                <CardDescription className="text-xs">Localização de residência do cidadão</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Logradouro & Número:</span>
                  <p className="font-medium text-foreground text-sm">
                    {cidadao.logradouro || 'Não informado'}, {cidadao.numero || 'S/N'}{' '}
                    {cidadao.complemento && `(${cidadao.complemento})`}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">Bairro:</span>
                    <p className="font-medium text-foreground">{cidadao.bairro || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CEP:</span>
                    <p className="font-medium text-foreground font-mono">{cidadao.cep || '-'}</p>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Município / Estado:</span>
                  <p className="font-medium text-foreground">
                    {cidadao.municipio} - {cidadao.uf}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" /> Meios de Contato
                </CardTitle>
                <CardDescription className="text-xs">Canais para avisos de consultas e exames</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Telefone Celular / WhatsApp:</span>
                  <p className="font-medium text-foreground text-sm font-mono mt-0.5">
                    {cidadao.telefoneCelular || 'Não cadastrado'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Telefone Fixo / Recados:</span>
                  <p className="font-medium text-foreground font-mono mt-0.5">
                    {cidadao.telefoneFixo || 'Não cadastrado'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Correio Eletrônico (E-mail):</span>
                  <p className="font-medium text-foreground mt-0.5">
                    {cidadao.email || 'Não cadastrado'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Prontuário SUS */}
        <TabsContent value="prontuario-sus" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-emerald-500" /> Histórico Clínico & Evoluções (PEP)
                </CardTitle>
                <CardDescription className="text-xs">
                  Consultas médicas, triagens e evoluções integradas com a rede municipal
                </CardDescription>
              </div>
              <Link href="/atendimentos">
                <Button size="sm" variant="outline" className="gap-2 text-xs">
                  Novo Atendimento
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {historicoClinico.map((item) => (
                <div key={item.id} className="p-4 rounded-lg border bg-muted/20 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b pb-2">
                    <span className="font-bold text-foreground text-sm">{item.tipo}</span>
                    <span className="text-muted-foreground flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" /> {item.data}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
                    <div>Profissional: <strong className="text-foreground">{item.profissional}</strong></div>
                    <div>Unidade: <strong className="text-foreground">{item.unidade}</strong></div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Diagnóstico / CIAP-2:</span>
                    <Badge variant="outline" className="ml-2 font-mono text-[11px] border-primary/30 text-primary">
                      {item.diagnostico}
                    </Badge>
                  </div>
                  <div className="bg-background/80 p-2.5 rounded border text-muted-foreground">
                    <span className="font-semibold text-foreground">Conduta & Prescrição: </span>
                    {item.conduta}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Farmácia */}
        <TabsContent value="farmacia" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Pill className="h-4 w-4 text-amber-500" /> Histórico de Dispensação de Medicamentos
                </CardTitle>
                <CardDescription className="text-xs">
                  Entregas de medicamentos com controle de lote e rastreabilidade
                </CardDescription>
              </div>
              <Link href="/farmacia">
                <Button size="sm" variant="outline" className="gap-2 text-xs">
                  Dispensar Medicamento
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {dispensacoes.map((item) => (
                <div key={item.id} className="p-4 rounded-lg border bg-muted/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-sm text-foreground">{item.medicamento}</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {item.quantidade} {item.unidadeMedida}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-muted-foreground">
                    <div>Data: <strong className="text-foreground">{item.data}</strong></div>
                    <div>Lote: <strong className="font-mono text-foreground">{item.lote}</strong></div>
                    <div>Responsável: <strong className="text-foreground">{item.farmaceutico}</strong></div>
                  </div>
                  <div className="bg-background/80 p-2 rounded border text-muted-foreground">
                    <span className="font-semibold text-foreground">Posologia: </span>
                    {item.posologia}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: CadÚnico & Social */}
        <TabsContent value="assistencia-social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-cyan-500" /> Programas Sociais & CadÚnico
              </CardTitle>
              <CardDescription className="text-xs">
                Benefícios municipais, estaduais e federais vinculados ao munícipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {programasSociais.map((prog, idx) => (
                <div key={idx} className="p-4 rounded-lg border bg-muted/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-sm text-foreground">{prog.programa}</span>
                    <Badge variant="outline" className="gap-1 border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5 font-mono text-[11px]">
                      <CheckCircle2 className="h-3 w-3" /> {prog.status}
                    </Badge>
                  </div>
                  {prog.nis && (
                    <div className="text-muted-foreground">
                      NIS Vinculado: <strong className="font-mono text-foreground">{prog.nis}</strong>
                    </div>
                  )}
                  {prog.faixaRenda && (
                    <div className="text-muted-foreground">
                      Faixa de Renda CadÚnico: <strong className="text-foreground">{prog.faixaRenda}</strong>
                    </div>
                  )}
                  {prog.observacao && (
                    <p className="text-muted-foreground">{prog.observacao}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

CidadaoShow.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>

export default CidadaoShow
