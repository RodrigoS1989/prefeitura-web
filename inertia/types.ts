import { type Data } from '@generated/data'
import { type PropsWithChildren } from 'react'
import { type JSONDataTypes } from '@adonisjs/core/types/transformers'

export type InertiaProps<T extends JSONDataTypes = {}> = PropsWithChildren<Data.SharedProps & T>

/**
 * Bridge the shared props and flash data inferred from the Inertia
 * middleware into the Inertia client, so `usePage().props`, `usePage().flash`,
 * and layout callbacks are typed globally without passing a generic at each
 * call site.
 */
declare module '@inertiajs/core' {
  interface InertiaConfig {
    sharedPageProps: Data.SharedProps
    flashDataType: Data.FlashMessages
  }
}

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'cidadaos/index': any
    'cidadaos/show': any
    'cidadaos/form': any
    'territorio/index': any
    'configuracoes/parametros': any
    'unidades/index': any
    'profissionais/index': any
    'atendimentos/index': any
    'atendimentos/triagem': any
    'atendimentos/pep': any
    'farmacia/index': any
    'farmacia/medicamentos': any
    'farmacia/dispensacao': any
    'agendamentos/index': any
    'agendamentos/novo': any
    'agendamentos/regulacao': any
    'esus/index': any
    'esus/vacinas': any
    'esus/visitas': any
    'esus/notificacoes': any
  }
}
