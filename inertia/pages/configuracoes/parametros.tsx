import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import {
  Building2,
  Save,
  MapPin,
  Phone,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayout from '~/layouts/AppLayout'

interface ParametrosData {
  id: number
  razaoSocial: string
  nomeFantasia: string | null
  cnpj: string | null
  prefeito: string | null
  telefone: string | null
  email: string | null
  endereco: string | null
  cep: string | null
  cidade: string
  uf: string
  brasaoUrl: string | null
}

interface Props {
  parametros: ParametrosData
}

export const ParametrosPage: React.FC<Props> = ({ parametros }) => {
  const [form, setForm] = useState<ParametrosData>(parametros)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    router.put('/configuracoes/parametros', form as any, {
      onFinish: () => setLoading(false),
    })
  }

  return (
    <AppLayout>
      <Head title="Parâmetros Institucionais - Prefeitura Web" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Settings className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Parâmetros Gerais do Município</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Refatoração da tabela ARQ001 e parâmetros gerais institucionais da prefeitura.
            </p>
          </div>

          <Button type="submit" disabled={loading} className="gap-2 shadow-sm">
            <Save className="h-4 w-4" />
            {loading ? 'Salvando...' : 'Salvar Parâmetros'}
          </Button>
        </div>

        {/* Card: Identificação Institucional */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Identificação Institucional</CardTitle>
                <CardDescription className="text-xs">
                  Razão social, nome fantasia e titular do Poder Executivo municipal.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1 block">Razão Social *</label>
                <Input
                  required
                  value={form.razaoSocial}
                  onChange={(e) => setForm({ ...form, razaoSocial: e.target.value })}
                  placeholder="Prefeitura Municipal de..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold mb-1 block">Nome Fantasia</label>
                <Input
                  value={form.nomeFantasia || ''}
                  onChange={(e) => setForm({ ...form, nomeFantasia: e.target.value })}
                  placeholder="Prefeitura Municipal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1 block">CNPJ</label>
                <Input
                  value={form.cnpj || ''}
                  onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                  placeholder="00.000.000/0001-00"
                />
              </div>

              <div>
                <label className="text-xs font-semibold mb-1 block">Prefeito(a) Municipal</label>
                <Input
                  value={form.prefeito || ''}
                  onChange={(e) => setForm({ ...form, prefeito: e.target.value })}
                  placeholder="Nome do Chefe do Executivo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Localização & Sede */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Sede Administrativa & Endereçamento</CardTitle>
                <CardDescription className="text-xs">
                  Endereço do Paço Municipal utilizado nos cabeçalhos oficiais e receituários.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold mb-1 block">Endereço do Paço Municipal</label>
                <Input
                  value={form.endereco || ''}
                  onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                  placeholder="Praça / Rua, número, centro"
                />
              </div>

              <div>
                <label className="text-xs font-semibold mb-1 block">CEP</label>
                <Input
                  value={form.cep || ''}
                  onChange={(e) => setForm({ ...form, cep: e.target.value })}
                  placeholder="00000-000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1 block">Município Sede *</label>
                <Input
                  required
                  value={form.cidade}
                  onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                  placeholder="Nome do município"
                />
              </div>

              <div>
                <label className="text-xs font-semibold mb-1 block">Estado (UF) *</label>
                <Input
                  required
                  maxLength={2}
                  className="uppercase font-mono w-24"
                  value={form.uf}
                  onChange={(e) => setForm({ ...form, uf: e.target.value.toUpperCase() })}
                  placeholder="UF"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Comunicação & Contatos */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Canais de Atendimento ao Munícipe</CardTitle>
                <CardDescription className="text-xs">
                  Contatos exibidos nos canais de transparência e comprovantes emitidos.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1 block">Telefone PABX / Gabinete</label>
                <Input
                  value={form.telefone || ''}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  placeholder="(00) 0000-0000"
                />
              </div>

              <div>
                <label className="text-xs font-semibold mb-1 block">E-mail Institucional</label>
                <Input
                  type="email"
                  value={form.email || ''}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="gabinete@prefeitura.gov.br"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" disabled={loading} size="lg" className="gap-2 shadow-md">
            <Save className="h-4 w-4" />
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </AppLayout>
  )
}

export default ParametrosPage
