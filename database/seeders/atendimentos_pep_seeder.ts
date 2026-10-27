import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Cidadao from '#models/cidadao'
import UnidadeSaude from '#models/unidade_saude'
import Profissional from '#models/profissional'
import Atendimento from '#models/atendimento'
import SinalVital from '#models/sinal_vital'
import EvolucaoClinica from '#models/evolucao_clinica'
import DiagnosticoAtendimento from '#models/diagnostico_atendimento'
import PrescricaoMedicamento from '#models/prescricao_medicamento'
import SolicitacaoExame from '#models/solicitacao_exame'

export default class extends BaseSeeder {
  async run() {
    const cidadaos = await Cidadao.all()
    const unidades = await UnidadeSaude.all()
    const profissionais = await Profissional.all()

    if (cidadaos.length === 0 || unidades.length === 0 || profissionais.length === 0) {
      return
    }

    await Atendimento.query().delete()

    const medico = profissionais.find((p) => p.numeroConselho?.startsWith('CRM') || p.nome.includes('Dr')) || profissionais[0]
    const enfermeiro = profissionais.find((p) => p.numeroConselho?.startsWith('COREN') || p.nome.includes('Enf')) || profissionais[1] || profissionais[0]
    const ubs = unidades[0]

    const seedData = [
      {
        cidadao: cidadaos[0],
        tipo: 'URGENCIA_EMERGENCIA' as const,
        status: 'EM_ATENDIMENTO' as const,
        prioridade: 'LARANJA' as const,
        discriminador: 'Dor Torácica Intensa e Dispneia Aguda',
        tempoAlvo: 10,
        queixa: 'Paciente refere dor retroesternal em aperto há 40 minutos com irradiação para MSE.',
        sinais: {
          paSistolica: 160,
          paDiastolica: 100,
          fc: 105,
          fr: 22,
          temp: 36.6,
          spo2: 95,
          peso: 82.5,
          altura: 1.74,
          imc: 27.2,
          glicemia: 118,
          dor: 8,
          obs: 'Paciente sudorético e pálido. Encaminhado imediatamente para a sala vermelha.',
        },
        soap: {
          subjetivo: 'Paciente relata início súbito de dor precordial opressiva enquanto subia escadas, com náuseas associadas.',
          objetivo: 'BEG, lúcido, taquicárdico, ausculta pulmonar limpa sem estertores. ECG mostra taquicardia sinusal sem supra de ST evidente.',
          avaliacao: 'Síndrome Coronariana Aguda a esclarecer / Angina Instável.',
          conduta: 'Monitore cardíaco contínuo, O2 sob cateter 2L/min, AAS 300mg VO mastigado, Clopidogrel 300mg VO, coleta seriada de Troponina e CK-MB.',
        },
        diagnostico: {
          cid: 'I20.0',
          desc: 'Angina instável',
        },
        prescricao: {
          droga: 'AAS (Ácido Acetilsalicílico) 100mg',
          posologia: 'Tomar 3 comprimidos mastigados imediatamente',
          qtd: 3,
        },
        exame: {
          desc: 'Troponina I quantitativa e Eletrocardiograma de 12 derivações',
          urgente: true,
        },
      },
      {
        cidadao: cidadaos[1] || cidadaos[0],
        tipo: 'DEMANDA_ESPONTANEA' as const,
        status: 'AGUARDANDO_ATENDIMENTO' as const,
        prioridade: 'AMARELO' as const,
        discriminador: 'Febre Alta Persistente e Cefaleia',
        tempoAlvo: 60,
        queixa: 'Febre de 38.8°C há 3 dias com mialgia intensa e prostração.',
        sinais: {
          paSistolica: 120,
          paDiastolica: 80,
          fc: 92,
          fr: 18,
          temp: 38.8,
          spo2: 98,
          peso: 64.0,
          altura: 1.62,
          imc: 24.4,
          glicemia: 96,
          dor: 6,
          obs: 'Alerta para síndrome febril aguda / arbovirose (Dengue). Prova do laço negativa.',
        },
      },
      {
        cidadao: cidadaos[2] || cidadaos[0],
        tipo: 'CONSULTA_AGENDADA' as const,
        status: 'AGUARDANDO_TRIAGEM' as const,
        prioridade: 'VERDE' as const,
        discriminador: 'Acompanhamento de Doença Crônica (Hiperdia)',
        tempoAlvo: 120,
        queixa: 'Consulta de rotina para renovação de receita e controle da pressão arterial.',
      },
      {
        cidadao: cidadaos[3] || cidadaos[0],
        tipo: 'DEMANDA_ESPONTANEA' as const,
        status: 'FINALIZADO' as const,
        prioridade: 'VERDE' as const,
        discriminador: 'Sintomas Respiratórios Leves',
        tempoAlvo: 120,
        queixa: 'Coriza, espirros e dor de garganta leve há 2 dias. Nega febre.',
        sinais: {
          paSistolica: 125,
          paDiastolica: 82,
          fc: 76,
          fr: 16,
          temp: 36.4,
          spo2: 99,
          peso: 71.0,
          altura: 1.68,
          imc: 25.2,
          glicemia: 92,
          dor: 2,
          obs: 'Orofaringe hiperemiada sem exsudato purulento.',
        },
        soap: {
          subjetivo: 'Paciente procura acolhimento por tosse seca e congestão nasal.',
          objetivo: 'Orofaringe congesta, mucosas úmidas e coradas, ausculta pulmonar com murmúrio vesicular universalmente audível sem ruídos adventícios.',
          avaliacao: 'Infecção das Vias Aéreas Superiores (IVAS) de etiologia viral.',
          conduta: 'Lavagem nasal com SF 0,9% abundante, hidratação oral vigorosa, sintomáticos (Dipirona 500mg se dor/febre). Retorno se sinais de alarme.',
        },
        diagnostico: {
          cid: 'J00',
          desc: 'Nasofaringite aguda (resfriado comum)',
        },
        prescricao: {
          droga: 'Dipirona Monoidratada 500mg',
          posologia: 'Tomar 1 comprimido de 6 em 6 horas se dor ou febre',
          qtd: 20,
        },
      },
      {
        cidadao: cidadaos[4] || cidadaos[0],
        tipo: 'PROCEDIMENTO_ENFERMAGEM' as const,
        status: 'AGUARDANDO_ATENDIMENTO' as const,
        prioridade: 'AZUL' as const,
        discriminador: 'Procedimento / Curativo / Retirada de Pontos',
        tempoAlvo: 240,
        queixa: 'Encaminhada pós-sutura para retirada de 4 pontos em antebraço esquerdo.',
        sinais: {
          paSistolica: 110,
          paDiastolica: 70,
          fc: 72,
          fr: 16,
          temp: 36.2,
          spo2: 99,
          peso: 58.0,
          altura: 1.60,
          imc: 22.7,
          glicemia: 88,
          dor: 1,
          obs: 'Ferida cirúrgica cicatrizada, sem sinais flogísticos ou secreções.',
        },
      },
    ]

    let counter = 1
    for (const item of seedData) {
      const horaChegada = DateTime.now().minus({ minutes: 60 - counter * 8 })
      const prioStr = item.prioridade as string
      const prefix = prioStr === 'VERMELHO' ? 'VERM' : prioStr === 'LARANJA' ? 'LAR' : prioStr === 'AMARELO' ? 'AMAR' : prioStr === 'VERDE' ? 'VER' : 'AZU'

      const atendimento = await Atendimento.create({
        numeroAtendimento: `FAA-${DateTime.now().year}-${String(counter).padStart(6, '0')}`,
        codigoBarras: `789000${counter.toString().padStart(6, '0')}`,
        senhaPainel: `${prefix}-${counter.toString().padStart(2, '0')}`,
        cidadaoId: item.cidadao.id,
        unidadeSaudeId: ubs.id,
        profissionalId: item.status === 'EM_ATENDIMENTO' || item.status === 'FINALIZADO' ? medico.id : null,
        tipoAtendimento: item.tipo,
        caraterAtendimento: '01',
        status: item.status,
        prioridadeManchester: item.prioridade,
        discriminadorManchester: item.discriminador,
        tempoAlvoMinutos: item.tempoAlvo,
        queixaPrincipal: item.queixa,
        sigiloso: false,
        dataHoraChegada: horaChegada,
        dataHoraTriagem: item.sinais ? horaChegada.plus({ minutes: 5 }) : null,
        dataHoraInicioAtendimento: item.status === 'EM_ATENDIMENTO' || item.status === 'FINALIZADO' ? horaChegada.plus({ minutes: 15 }) : null,
        dataHoraFinalizacao: item.status === 'FINALIZADO' ? horaChegada.plus({ minutes: 35 }) : null,
      })

      if (item.sinais) {
        await SinalVital.create({
          atendimentoId: atendimento.id,
          triadorProfissionalId: enfermeiro.id,
          paSistolica: item.sinais.paSistolica,
          paDiastolica: item.sinais.paDiastolica,
          frequenciaCardiaca: item.sinais.fc,
          frequenciaRespiratoria: item.sinais.fr,
          temperatura: item.sinais.temp,
          saturacaoO2: item.sinais.spo2,
          peso: item.sinais.peso,
          altura: item.sinais.altura,
          imc: item.sinais.imc,
          glicemiaCapilar: item.sinais.glicemia,
          escalaDor: item.sinais.dor,
          observacoesTriagem: item.sinais.obs,
        })
      }

      if (item.soap) {
        await EvolucaoClinica.create({
          atendimentoId: atendimento.id,
          profissionalId: medico.id,
          subjetivo: item.soap.subjetivo,
          objetivo: item.soap.objetivo,
          avaliacao: item.soap.avaliacao,
          planoConduta: item.soap.conduta,
          assinadoDigitalmente: true,
          dataHoraAssinatura: horaChegada.plus({ minutes: 30 }),
        })
      }

      if (item.diagnostico) {
        await DiagnosticoAtendimento.create({
          atendimentoId: atendimento.id,
          cid10Codigo: item.diagnostico.cid,
          cid10Descricao: item.diagnostico.desc,
          tipo: 'PRINCIPAL',
        })
      }

      if (item.prescricao) {
        await PrescricaoMedicamento.create({
          atendimentoId: atendimento.id,
          nomeMedicamento: item.prescricao.droga,
          posologia: item.prescricao.posologia,
          quantidadePrescrita: item.prescricao.qtd,
          viaAdministracao: 'ORAL',
          usoContinuo: false,
          codigoAutenticidadeReceita: `REC-${atendimento.id}-${DateTime.now().toMillis().toString().slice(-6)}`,
        })
      }

      if (item.exame) {
        await SolicitacaoExame.create({
          atendimentoId: atendimento.id,
          descricaoExame: item.exame.desc,
          tipoExame: 'LABORATORIAL',
          justificativaClinica: item.soap?.avaliacao || 'Investigação clínica diagnóstica',
          urgente: item.exame.urgente,
          status: 'SOLICITADO',
        })
      }

      counter++
    }
  }
}
