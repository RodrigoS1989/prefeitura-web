import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import Medicamento from '#models/medicamento'
import LoteMedicamento from '#models/lote_medicamento'
import MovimentacaoEstoque from '#models/movimentacao_estoque'
import Dispensacao from '#models/dispensacao'
import ItemDispensacao from '#models/item_dispensacao'

export interface ItemDispensacaoPayload {
  medicamentoId: number
  quantidadePrescrita: number
  quantidadeDispensada: number
  posologia?: string
  tempoTratamentoDias?: number
  loteIdManual?: number // Opcional: caso o farmacêutico especifique manualmente um lote
}

export interface DispensarPayload {
  cidadaoId: number
  unidadeSaudeId: number
  profissionalPrescritorId?: number
  atendimentoId?: number
  farmaceuticoDispensadorId?: number
  tipoDispensacao?:
    | 'RECEITA_AMBULATORIAL'
    | 'USO_CONTINUO'
    | 'JUDICIAL'
    | 'RECEITA_AVULSA'
    | 'PACIENTE_OBSERVACAO'
  numeroReceita?: string
  dataReceita?: string
  observacoes?: string
  itens: ItemDispensacaoPayload[]
}

export class FefoDispensacaoService {
  /**
   * Executa a dispensação atômica aplicando o algoritmo FEFO (First-Expire, First-Out)
   */
  public async dispensar(payload: DispensarPayload): Promise<Dispensacao> {
    return await db.transaction(async (trx) => {
      const hoje = DateTime.now().startOf('day')

      // 1. Gerar número sequencial de dispensação
      const count = await Dispensacao.query({ client: trx }).count('* as total')
      const totalExistente = Number(count[0]?.$extras?.total || 0) + 1
      const numeroDispensacao = `DISP-${DateTime.now().year}-${String(totalExistente).padStart(6, '0')}`

      // 2. Criar cabeçalho da dispensação
      const dispensacao = new Dispensacao()
      dispensacao.useTransaction(trx)
      dispensacao.numeroDispensacao = numeroDispensacao
      dispensacao.cidadaoId = payload.cidadaoId
      dispensacao.unidadeSaudeId = payload.unidadeSaudeId
      dispensacao.profissionalPrescritorId = payload.profissionalPrescritorId || null
      dispensacao.atendimentoId = payload.atendimentoId || null
      dispensacao.farmaceuticoDispensadorId = payload.farmaceuticoDispensadorId || null
      dispensacao.tipoDispensacao = payload.tipoDispensacao || 'RECEITA_AMBULATORIAL'
      dispensacao.numeroReceita = payload.numeroReceita || null
      dispensacao.dataReceita = payload.dataReceita
        ? DateTime.fromISO(payload.dataReceita)
        : DateTime.now()
      dispensacao.status = 'CONCLUIDA'
      dispensacao.observacoes = payload.observacoes || null

      await dispensacao.save()

      // 3. Processar itens com alocação FEFO
      for (const itemPayload of payload.itens) {
        const medicamento = await Medicamento.query({ client: trx })
          .where('id', itemPayload.medicamentoId)
          .firstOrFail()

        if (medicamento.bloqueado) {
          throw new Error(
            `O medicamento ${medicamento.principioAtivo} está bloqueado para dispensação sanitária.`
          )
        }

        let quantidadeRestante = itemPayload.quantidadeDispensada

        // Buscar lotes válidos ordenados por data_validade ASC (Algoritmo FEFO)
        const lotesValidos = await LoteMedicamento.query({ client: trx })
          .where('medicamentoId', itemPayload.medicamentoId)
          .where('unidadeSaudeId', payload.unidadeSaudeId)
          .where('status', 'ATIVO')
          .where('quantidadeAtual', '>', 0)
          .where('dataValidade', '>=', hoje.toISODate()!)
          .orderBy('dataValidade', 'asc')

        const saldoTotalDisponivel = lotesValidos.reduce(
          (acc, lote) => acc + lote.quantidadeAtual,
          0
        )

        if (saldoTotalDisponivel < quantidadeRestante) {
          throw new Error(
            `Saldo insuficiente para ${medicamento.principioAtivo}. Solicitado: ${quantidadeRestante}, Disponível FEFO: ${saldoTotalDisponivel}`
          )
        }

        // Iterar pelos lotes FEFO baixando o saldo
        for (const lote of lotesValidos) {
          if (quantidadeRestante <= 0) break

          const qtdBaixarLote = Math.min(lote.quantidadeAtual, quantidadeRestante)
          const saldoAnterior = lote.quantidadeAtual
          const saldoPosterior = saldoAnterior - qtdBaixarLote

          lote.useTransaction(trx)
          lote.quantidadeAtual = saldoPosterior
          if (saldoPosterior === 0) {
            lote.status = 'ESGOTADO'
          }
          await lote.save()

          // Registrar movimentação de estoque (Kardex)
          const mov = new MovimentacaoEstoque()
          mov.useTransaction(trx)
          mov.medicamentoId = medicamento.id
          mov.loteId = lote.id
          mov.unidadeSaudeId = payload.unidadeSaudeId
          mov.tipoMovimentacao = 'DISPENSACAO_PACIENTE'
          mov.quantidade = qtdBaixarLote
          mov.saldoAnterior = saldoAnterior
          mov.saldoPosterior = saldoPosterior
          mov.numeroDocumento = numeroDispensacao
          mov.usuarioOperadorId = payload.farmaceuticoDispensadorId || null
          await mov.save()

          // Criar item da dispensação vinculado ao lote
          const itemDisp = new ItemDispensacao()
          itemDisp.useTransaction(trx)
          itemDisp.dispensacaoId = dispensacao.id
          itemDisp.medicamentoId = medicamento.id
          itemDisp.loteId = lote.id
          itemDisp.quantidadePrescrita = itemPayload.quantidadePrescrita
          itemDisp.quantidadeDispensada = qtdBaixarLote
          itemDisp.posologia = itemPayload.posologia || null
          itemDisp.tempoTratamentoDias = itemPayload.tempoTratamentoDias || null

          if (itemPayload.tempoTratamentoDias) {
            itemDisp.proximaDispensacaoEm = DateTime.now().plus({
              days: itemPayload.tempoTratamentoDias - 3,
            })
          }

          await itemDisp.save()

          quantidadeRestante -= qtdBaixarLote
        }
      }

      await dispensacao.load('itens', (q) => q.preload('medicamento').preload('lote'))
      await dispensacao.load('cidadao')
      await dispensacao.load('unidadeSaude')

      return dispensacao
    })
  }

  /**
   * Consulta os lotes de um medicamento em uma unidade com cálculo de dias até vencimento
   */
  public async getLotesFefo(medicamentoId: number, unidadeSaudeId: number) {
    const hoje = DateTime.now().startOf('day')

    const lotes = await LoteMedicamento.query()
      .where('medicamentoId', medicamentoId)
      .where('unidadeSaudeId', unidadeSaudeId)
      .where('quantidadeAtual', '>', 0)
      .orderBy('dataValidade', 'asc')

    return lotes.map((lote) => {
      const diasAteVencer = Math.floor(lote.dataValidade.diff(hoje, 'days').days)
      const expirado = diasAteVencer < 0
      const critico = diasAteVencer >= 0 && diasAteVencer <= 30
      const alerta = diasAteVencer > 30 && diasAteVencer <= 90

      return {
        ...lote.toJSON(),
        diasAteVencer,
        expirado,
        critico,
        alerta,
        statusFefo: expirado
          ? 'EXPIRADO'
          : critico
            ? 'VENCIMENTO_CRITICO'
            : alerta
              ? 'ALERTA_90_DIAS'
              : 'REGULAR',
      }
    })
  }
}
