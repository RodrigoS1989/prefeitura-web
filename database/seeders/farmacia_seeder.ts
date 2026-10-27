import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import GrupoMedicamento from '#models/grupo_medicamento'
import Medicamento from '#models/medicamento'
import LoteMedicamento from '#models/lote_medicamento'
import UnidadeSaude from '#models/unidade_saude'

export default class extends BaseSeeder {
  async run() {
    const unidade = await UnidadeSaude.first()
    const unidadeId = unidade?.id || 1

    // 1. Grupos de Medicamentos (UPM428)
    const gAnalgesicos = await GrupoMedicamento.firstOrCreate(
      { codigo: '01' },
      {
        codigo: '01',
        nome: 'Analgésicos e Antitérmicos',
        tipoControleEspecial: 'COMUM',
        ativo: true,
      }
    )

    const gAntibioticos = await GrupoMedicamento.firstOrCreate(
      { codigo: '02' },
      {
        codigo: '02',
        nome: 'Antimicrobianos e Antibióticos',
        tipoControleEspecial: 'ANTIMICROBIANO',
        ativo: true,
      }
    )

    const gCardio = await GrupoMedicamento.firstOrCreate(
      { codigo: '03' },
      {
        codigo: '03',
        nome: 'Anti-hipertensivos e Cardiovasculares',
        tipoControleEspecial: 'COMUM',
        ativo: true,
      }
    )

    const gDiabetes = await GrupoMedicamento.firstOrCreate(
      { codigo: '04' },
      {
        codigo: '04',
        nome: 'Antidiabéticos e Hipoglicemiantes',
        tipoControleEspecial: 'COMUM',
        ativo: true,
      }
    )

    await GrupoMedicamento.firstOrCreate(
      { codigo: '05' },
      {
        codigo: '05',
        nome: 'Anti-inflamatórios e Analgésicos Não Esteroides',
        tipoControleEspecial: 'COMUM',
        ativo: true,
      }
    )

    // 2. Medicamentos da REMUME (UPM266)
    const medDipirona = await Medicamento.firstOrCreate(
      { codigo: 'MED-001' },
      {
        codigo: 'MED-001',
        catmatCodigo: 'BR0289142',
        nomeComercial: 'Novalgina / Dipirona',
        principioAtivo: 'Dipirona Sódica',
        concentracao: '500 mg',
        formaFarmaceutica: 'Comprimido',
        viaAdministracao: 'Oral',
        unidadeFornecimento: 'COMPRIMIDO',
        grupoId: gAnalgesicos.id,
        tipoControle: 'COMUM',
        pertenceRemume: true,
        cestaBasica: true,
        estoqueMinimo: 1000,
        estoqueIdeal: 5000,
        custoMedioPonderado: 0.12,
        codigoBarras: '789123456001',
        ativo: true,
      }
    )

    const medAmoxicilina = await Medicamento.firstOrCreate(
      { codigo: 'MED-002' },
      {
        codigo: 'MED-002',
        catmatCodigo: 'BR0291040',
        nomeComercial: 'Amoxicilina 500mg',
        principioAtivo: 'Amoxicilina',
        concentracao: '500 mg',
        formaFarmaceutica: 'Cápsula',
        viaAdministracao: 'Oral',
        unidadeFornecimento: 'COMPRIMIDO',
        grupoId: gAntibioticos.id,
        tipoControle: 'ANTIMICROBIANO',
        pertenceRemume: true,
        cestaBasica: true,
        exigeReceitaRetida: true,
        estoqueMinimo: 500,
        estoqueIdeal: 2000,
        custoMedioPonderado: 0.45,
        codigoBarras: '789123456002',
        ativo: true,
      }
    )

    const medLosartana = await Medicamento.firstOrCreate(
      { codigo: 'MED-003' },
      {
        codigo: 'MED-003',
        catmatCodigo: 'BR0274190',
        nomeComercial: 'Losartana Potássica 50mg',
        principioAtivo: 'Losartana Potássica',
        concentracao: '50 mg',
        formaFarmaceutica: 'Comprimido Revestido',
        viaAdministracao: 'Oral',
        unidadeFornecimento: 'COMPRIMIDO',
        grupoId: gCardio.id,
        tipoControle: 'COMUM',
        pertenceRemume: true,
        cestaBasica: true,
        estoqueMinimo: 2000,
        estoqueIdeal: 10000,
        custoMedioPonderado: 0.15,
        codigoBarras: '789123456003',
        ativo: true,
      }
    )

    await Medicamento.firstOrCreate(
      { codigo: 'MED-004' },
      {
        codigo: 'MED-004',
        catmatCodigo: 'BR0261184',
        nomeComercial: 'Glifage / Metformina',
        principioAtivo: 'Cloridrato de Metformina',
        concentracao: '850 mg',
        formaFarmaceutica: 'Comprimido',
        viaAdministracao: 'Oral',
        unidadeFornecimento: 'COMPRIMIDO',
        grupoId: gDiabetes.id,
        tipoControle: 'COMUM',
        pertenceRemume: true,
        cestaBasica: true,
        estoqueMinimo: 1500,
        estoqueIdeal: 8000,
        custoMedioPonderado: 0.18,
        codigoBarras: '789123456004',
        ativo: true,
      }
    )

    const medCiprofloxacino = await Medicamento.firstOrCreate(
      { codigo: 'MED-005' },
      {
        codigo: 'MED-005',
        catmatCodigo: 'BR0259812',
        nomeComercial: 'Cipro / Ciprofloxacino',
        principioAtivo: 'Cloridrato de Ciprofloxacino',
        concentracao: '500 mg',
        formaFarmaceutica: 'Comprimido Revestido',
        viaAdministracao: 'Oral',
        unidadeFornecimento: 'COMPRIMIDO',
        grupoId: gAntibioticos.id,
        tipoControle: 'ANTIMICROBIANO',
        pertenceRemume: true,
        cestaBasica: false,
        exigeReceitaRetida: true,
        estoqueMinimo: 300,
        estoqueIdeal: 1200,
        custoMedioPonderado: 0.65,
        codigoBarras: '789123456005',
        ativo: true,
      }
    )

    // 3. Lotes com Validades Estratégicas para o Algoritmo FEFO (UPM908)
    const hoje = DateTime.now()

    // Lotes de Dipirona:
    // Lote 1: vence em 45 dias (FEFO deve priorizar este!)
    await LoteMedicamento.firstOrCreate(
      { medicamentoId: medDipirona.id, numeroLote: 'DIP-2026-L1' },
      {
        medicamentoId: medDipirona.id,
        unidadeSaudeId: unidadeId,
        numeroLote: 'DIP-2026-L1',
        fabricante: 'EMS S/A',
        dataFabricacao: hoje.minus({ months: 6 }),
        dataValidade: hoje.plus({ days: 45 }), // Vence primeiro!
        quantidadeInicial: 1000,
        quantidadeAtual: 1000,
        precoUnitarioCompra: 0.11,
        numeroNotaFiscal: 'NF-89410',
        status: 'ATIVO',
      }
    )

    // Lote 2: vence em 180 dias
    await LoteMedicamento.firstOrCreate(
      { medicamentoId: medDipirona.id, numeroLote: 'DIP-2026-L2' },
      {
        medicamentoId: medDipirona.id,
        unidadeSaudeId: unidadeId,
        numeroLote: 'DIP-2026-L2',
        fabricante: 'Eurofarma Laboratórios',
        dataFabricacao: hoje.minus({ months: 1 }),
        dataValidade: hoje.plus({ days: 180 }), // Vence depois
        quantidadeInicial: 3000,
        quantidadeAtual: 3000,
        precoUnitarioCompra: 0.12,
        numeroNotaFiscal: 'NF-91220',
        status: 'ATIVO',
      }
    )

    // Lotes de Amoxicilina:
    await LoteMedicamento.firstOrCreate(
      { medicamentoId: medAmoxicilina.id, numeroLote: 'AMX-2026-L1' },
      {
        medicamentoId: medAmoxicilina.id,
        unidadeSaudeId: unidadeId,
        numeroLote: 'AMX-2026-L1',
        fabricante: 'Medley Farmacêutica',
        dataFabricacao: hoje.minus({ months: 3 }),
        dataValidade: hoje.plus({ days: 120 }),
        quantidadeInicial: 800,
        quantidadeAtual: 800,
        precoUnitarioCompra: 0.42,
        numeroNotaFiscal: 'NF-88120',
        status: 'ATIVO',
      }
    )

    // Lotes de Losartana:
    await LoteMedicamento.firstOrCreate(
      { medicamentoId: medLosartana.id, numeroLote: 'LOS-2026-L1' },
      {
        medicamentoId: medLosartana.id,
        unidadeSaudeId: unidadeId,
        numeroLote: 'LOS-2026-L1',
        fabricante: 'Aché Laboratórios',
        dataFabricacao: hoje.minus({ months: 4 }),
        dataValidade: hoje.plus({ days: 210 }),
        quantidadeInicial: 4500,
        quantidadeAtual: 4500,
        precoUnitarioCompra: 0.14,
        numeroNotaFiscal: 'NF-87300',
        status: 'ATIVO',
      }
    )

    // Lotes de Ciprofloxacino:
    await LoteMedicamento.firstOrCreate(
      { medicamentoId: medCiprofloxacino.id, numeroLote: 'CIP-2026-L1' },
      {
        medicamentoId: medCiprofloxacino.id,
        unidadeSaudeId: unidadeId,
        numeroLote: 'CIP-2026-L1',
        fabricante: 'Prati-Donaduzzi',
        dataFabricacao: hoje.minus({ months: 2 }),
        dataValidade: hoje.plus({ days: 150 }),
        quantidadeInicial: 500,
        quantidadeAtual: 500,
        precoUnitarioCompra: 0.62,
        numeroNotaFiscal: 'NF-90110',
        status: 'ATIVO',
      }
    )
  }
}
