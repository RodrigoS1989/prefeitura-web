import { test } from '@japa/runner'
import Medicamento from '#models/medicamento'
import LoteMedicamento from '#models/lote_medicamento'
import Cidadao from '#models/cidadao'
import UnidadeSaude from '#models/unidade_saude'
import { FefoDispensacaoService } from '#services/fefo_dispensacao_service'
import { DateTime } from 'luxon'

test.group('Etapa 05: Farmácia Municipal, REMUME e Dispensação FEFO', () => {
  test('deve listar o catálogo REMUME de medicamentos da farmácia', async ({ client }) => {
    const response = await client.get('/farmacia')
    response.assertStatus(200)
  })

  test('deve retornar lotes ordenados rigorosamente pelo algoritmo FEFO (menor validade primeiro)', async ({
    assert,
    client,
  }) => {
    const med = await Medicamento.findByOrFail('codigo', 'MED-001') // Dipirona

    const response = await client.get(`/api/farmacia/medicamentos/${med.id}/lotes`)
    response.assertStatus(200)

    const lotes = response.body()
    assert.isArray(lotes)
    assert.isAbove(lotes.length, 1)

    // O primeiro lote retornado DEVE ter a data de validade mais próxima (FEFO)
    const validadeLote1 = DateTime.fromISO(lotes[0].dataValidade)
    const validadeLote2 = DateTime.fromISO(lotes[1].dataValidade)
    assert.isTrue(validadeLote1 <= validadeLote2)
  })

  test('deve executar a dispensação atômica baixando prioritariamente o lote FEFO', async ({
    assert,
  }) => {
    const cidadao = await Cidadao.firstOrFail()
    const unidade = await UnidadeSaude.firstOrFail()
    const med = await Medicamento.findByOrFail('codigo', 'MED-001')

    const fefoService = new FefoDispensacaoService()

    // Consulta lotes antes
    const lotesAntes = await fefoService.getLotesFefo(med.id, unidade.id)
    const loteMaisProximo: any = lotesAntes[0]
    const saldoAnteriorLote = loteMaisProximo.quantidadeAtual

    const qtdDispensar = 20

    // Executa dispensação
    const dispensacao = await fefoService.dispensar({
      cidadaoId: cidadao.id,
      unidadeSaudeId: unidade.id,
      tipoDispensacao: 'RECEITA_AMBULATORIAL',
      numeroReceita: 'REC-TESTE-001',
      itens: [
        {
          medicamentoId: med.id,
          quantidadePrescrita: qtdDispensar,
          quantidadeDispensada: qtdDispensar,
          posologia: '1 comp a cada 8h',
          tempoTratamentoDias: 7,
        },
      ],
    })

    assert.isNotNull(dispensacao.id)
    assert.include(dispensacao.numeroDispensacao, 'DISP-')
    assert.equal(dispensacao.status, 'CONCLUIDA')
    assert.equal(dispensacao.itens.length, 1)

    // Verifica se o lote que sofreu a baixa foi exatamente o lote FEFO mais antigo
    const loteApos = await LoteMedicamento.findOrFail(loteMaisProximo.id)
    assert.equal(loteApos.quantidadeAtual, saldoAnteriorLote - qtdDispensar)
  })

  test('deve rejeitar dispensação quando o saldo disponível for insuficiente', async ({
    assert,
  }) => {
    const cidadao = await Cidadao.firstOrFail()
    const unidade = await UnidadeSaude.firstOrFail()
    const med = await Medicamento.findByOrFail('codigo', 'MED-001')

    const fefoService = new FefoDispensacaoService()

    let errorThrown = false
    try {
      await fefoService.dispensar({
        cidadaoId: cidadao.id,
        unidadeSaudeId: unidade.id,
        itens: [
          {
            medicamentoId: med.id,
            quantidadePrescrita: 999999,
            quantidadeDispensada: 999999, // Quantidade astronômica
          },
        ],
      })
    } catch (err: any) {
      errorThrown = true
      assert.include(err.message, 'Saldo insuficiente')
    }

    assert.isTrue(errorThrown)
  })
})
