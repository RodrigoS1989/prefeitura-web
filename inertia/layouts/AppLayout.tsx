import { type ReactNode } from 'react'
import { Link } from '@inertiajs/react'
import {
  Building2,
  LogOut,
  Layers,
  Database,
  Cpu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import ThemeToggle from '~/components/theme_toggle'
import FlashToasts from '~/components/flash_toasts'
import NavigationBar from '~/components/navigation_bar'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-foreground">Prefeitura Web</span>
                  <Badge variant="outline" className="text-[10px] font-mono py-0 px-1.5 h-4 border-primary/40 text-primary">
                    v2.0 Fullstack
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">Sistema Municipal de Gestão Integrada</span>
              </div>
            </Link>
          </div>

          {/* Stack Badges - desktop only */}
          <div className="hidden lg:flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 font-mono text-xs">
              <Cpu className="h-3 w-3 text-emerald-500" /> AdonisJS 6
            </Badge>
            <Badge variant="secondary" className="gap-1 font-mono text-xs">
              <Layers className="h-3 w-3 text-cyan-500" /> Inertia + React 19
            </Badge>
            <Badge variant="secondary" className="gap-1 font-mono text-xs">
              <Database className="h-3 w-3 text-amber-500" /> Lucid ORM
            </Badge>
            <Badge variant="secondary" className="gap-1 font-mono text-xs">
              <span className="h-2 w-2 rounded-full bg-red-500 inline-block animate-pulse" /> Redis
            </Badge>
          </div>

          {/* Action buttons and theme toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Separator orientation="vertical" className="h-6" />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-2 text-xs">
                <LogOut className="h-4 w-4" /> Acesso
              </Button>
            </Link>
          </div>
        </div>

        {/* Dynamic Interactive Navigation Bar with Scroll & Dropdown */}
        <NavigationBar />
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 sm:px-6 py-6 max-w-7xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-4 text-xs text-muted-foreground bg-muted/20">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-6">
          <p>© 2026 Ecossistema Delphi Modernizado - Projeto Prefeitura Web</p>
          <p className="flex items-center gap-1 font-mono text-[11px]">
            Stack Oficial: AdonisJS 6 • Lucid • Inertia.js • React 19 • Tailwind CSS v4 • shadcn/ui • Redis
          </p>
        </div>
      </footer>

      <FlashToasts />
    </div>
  )
}
