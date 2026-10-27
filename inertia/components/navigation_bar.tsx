import { useRef, useState, useEffect, type UIEvent, type WheelEvent } from 'react'
import { Link, usePage } from '@inertiajs/react'
import {
  Building2,
  LayoutDashboard,
  Users,
  MapPin,
  Settings,
  Stethoscope,
  Calendar,
  Pill,
  HeartHandshake,
  ShieldCheck,
  Syringe,
  Activity,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface NavItem {
  label: string
  href: string
  icon: typeof LayoutDashboard
  badge?: string
  category: 'Geral' | 'Cidadania' | 'Saúde' | 'Farmácia & Regulação'
  available?: boolean
}

export const navigationItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, category: 'Geral', available: true },
  { label: 'Cidadãos (CadÚnico/SUS)', href: '/cidadaos', icon: Users, badge: 'Etapa 1', category: 'Cidadania', available: true },
  { label: 'Território & Geografia', href: '/territorio', icon: MapPin, badge: 'Etapa 2', category: 'Geral', available: true },
  { label: 'Parâmetros Gerais', href: '/configuracoes/parametros', icon: Settings, badge: 'Etapa 2', category: 'Geral', available: true },
  { label: 'Unidades de Saúde (UBS)', href: '/unidades', icon: Building2, badge: 'Etapa 3', category: 'Saúde', available: true },
  { label: 'Profissionais & CBO', href: '/profissionais', icon: Stethoscope, badge: 'Etapa 3', category: 'Saúde', available: true },
  { label: 'Atendimento & PEP', href: '/atendimentos', icon: Activity, badge: 'Etapa 4', category: 'Saúde', available: true },
  { label: 'Farmácia Municipal', href: '/farmacia', icon: Pill, badge: 'Em breve (E5)', category: 'Farmácia & Regulação', available: false },
  { label: 'Agendamento & Regulação', href: '/agendamentos', icon: Calendar, badge: 'Em breve (E6)', category: 'Farmácia & Regulação', available: false },
  { label: 'Assistência Social', href: '/social', icon: HeartHandshake, badge: 'Em breve (E8)', category: 'Cidadania', available: false },
  { label: 'e-SUS APS & Vacinas', href: '/esus', icon: Syringe, badge: 'Em breve (E9)', category: 'Saúde', available: false },
  { label: 'Frota & Auditoria', href: '/frota', icon: ShieldCheck, badge: 'Em breve (E10)', category: 'Geral', available: false },
]

export default function NavigationBar() {
  const { url } = usePage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeItemRef = useRef<HTMLAnchorElement>(null)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Checa se o container tem scroll e atualiza visibilidade dos botões
  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    const tolerance = 4
    setCanScrollLeft(el.scrollLeft > tolerance)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - tolerance)
  }

  useEffect(() => {
    updateScrollState()
    const handleResize = () => updateScrollState()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-scroll para centralizar o item ativo na tela ao mudar de rota
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
    const timer = setTimeout(updateScrollState, 350)
    return () => clearTimeout(timer)
  }, [url])

  // Scroll suave por botões
  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = 280
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  // Suporte à rolagem por roda do mouse (converte delta vertical em horizontal)
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current
    if (!el) return
    if (e.deltaY !== 0) {
      el.scrollLeft += e.deltaY * 0.9
      updateScrollState()
    }
  }

  const handleScroll = (_e: UIEvent<HTMLDivElement>) => {
    updateScrollState()
  }

  return (
    <div className="border-t bg-muted/40 relative">
      <div className="container flex items-center justify-between gap-2 px-2 sm:px-4">
        {/* Botão de rolagem para a esquerda */}
        <div className="relative flex items-center shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`h-8 w-8 rounded-full z-10 transition-all ${
              canScrollLeft
                ? 'opacity-100 hover:bg-background/80 shadow-sm border'
                : 'opacity-0 pointer-events-none'
            }`}
            title="Rolar menu para a esquerda"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Fade gradiente à esquerda */}
          {canScrollLeft && (
            <div className="absolute left-8 top-0 bottom-0 w-8 bg-gradient-to-r from-muted/80 to-transparent pointer-events-none z-0" />
          )}
        </div>

        {/* Faixa horizontal rolável de navegação */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onWheel={handleWheel}
          className="flex-1 flex items-center gap-1.5 overflow-x-auto py-2 px-1 scroll-smooth custom-scrollbar"
        >
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = url.startsWith(item.href)
            const isAvailable = item.available !== false

            if (!isAvailable) {
              return (
                <div
                  key={item.href}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground/60 opacity-60 cursor-not-allowed shrink-0 select-none"
                  title="Módulo planejado para as próximas etapas"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] bg-muted/50 text-muted-foreground/70 px-1.5 py-0.2 rounded font-mono">
                      {item.badge}
                    </span>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                ref={isActive ? activeItemRef : undefined}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 select-none ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20'
                    : 'text-muted-foreground hover:bg-background/70 hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
                {item.badge && !isActive && (
                  <span className="text-[10px] bg-muted-foreground/15 text-muted-foreground px-1.5 py-0.2 rounded font-mono">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Botão de rolagem para a direita + Fade */}
        <div className="relative flex items-center shrink-0">
          {canScrollRight && (
            <div className="absolute right-8 top-0 bottom-0 w-8 bg-gradient-to-l from-muted/80 to-transparent pointer-events-none z-0" />
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`h-8 w-8 rounded-full z-10 transition-all ${
              canScrollRight
                ? 'opacity-100 hover:bg-background/80 shadow-sm border'
                : 'opacity-0 pointer-events-none'
            }`}
            title="Rolar menu para a direita"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dropdown de Atalho Rápido para Todos os Módulos */}
        <div className="shrink-0 pl-1 border-l">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs font-medium bg-background/60 shadow-xs"
                title="Ver todos os módulos por categoria"
              >
                <LayoutGrid className="h-3.5 w-3.5 text-primary" />
                <span className="hidden md:inline">Módulos</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 max-h-[80vh] overflow-y-auto">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                <span>Ecossistema Municipal</span>
                <span className="text-[10px] font-mono font-normal">10 Etapas</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Agrupamento por Categoria */}
              {(['Geral', 'Cidadania', 'Saúde', 'Farmácia & Regulação'] as const).map((cat) => {
                const items = navigationItems.filter((i) => i.category === cat)
                return (
                  <DropdownMenuGroup key={cat}>
                    <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground/80 px-2 py-1 uppercase tracking-wider">
                      {cat}
                    </DropdownMenuLabel>
                    {items.map((item) => {
                      const Icon = item.icon
                      const isActive = url.startsWith(item.href)
                      const isAvailable = item.available !== false

                      if (!isAvailable) {
                        return (
                          <DropdownMenuItem key={item.href} disabled className="opacity-50">
                            <div className="flex items-center justify-between w-full py-1 text-xs">
                              <div className="flex items-center gap-2">
                                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground">{item.label}</span>
                              </div>
                              {item.badge && (
                                <span className="text-[9px] bg-muted/60 px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </DropdownMenuItem>
                        )
                      }

                      return (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link
                            href={item.href}
                            className={`flex items-center justify-between w-full cursor-pointer py-1.5 text-xs ${
                              isActive ? 'bg-primary/10 text-primary font-semibold' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{item.label}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {item.badge && (
                                <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                                  {item.badge}
                                </span>
                              )}
                              {isActive && <Check className="h-3 w-3 text-primary" />}
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                    <DropdownMenuSeparator />
                  </DropdownMenuGroup>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
