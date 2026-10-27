import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ConselhoProfissional from '#models/conselho_profissional'
import EspecialidadeMedica from '#models/especialidade_medica'
import Cbo from '#models/cbo'
import UnidadeSaude from '#models/unidade_saude'
import Profissional from '#models/profissional'
import VinculoLotacao from '#models/vinculo_lotacao'
import Bairro from '#models/bairro'

export default class extends BaseSeeder {
  async run() {
    // 1. Conselhos Profissionais (PMD024)
    const conselhosData = [
      { sigla: 'CRM', nome: 'Conselho Regional de Medicina', uf: 'SP' },
      { sigla: 'COREN', nome: 'Conselho Regional de Enfermagem', uf: 'SP' },
      { sigla: 'CRO', nome: 'Conselho Regional de Odontologia', uf: 'SP' },
      { sigla: 'CRF', nome: 'Conselho Regional de Farmácia', uf: 'SP' },
      { sigla: 'CRESS', nome: 'Conselho Regional de Serviço Social', uf: 'SP' },
      { sigla: 'CRP', nome: 'Conselho Regional de Psicologia', uf: 'SP' },
      { sigla: 'CREFITO', nome: 'Conselho Regional de Fisioterapia e Terapia Ocupacional', uf: 'SP' },
    ]

    const conselhosMap: Record<string, ConselhoProfissional> = {}
    for (const c of conselhosData) {
      const item = await ConselhoProfissional.firstOrCreate(
        { sigla: c.sigla, uf: c.uf },
        c
      )
      conselhosMap[c.sigla] = item
    }

    // 2. Especialidades Médicas (PMD006)
    const especialidadesData = [
      { codigo: '01', nome: 'Clínica Médica / Medicina Geral', registroConselho: 'RQE 101' },
      { codigo: '02', nome: 'Pediatria', registroConselho: 'RQE 102' },
      { codigo: '03', nome: 'Ginecologia e Obstetrícia', registroConselho: 'RQE 103' },
      { codigo: '04', nome: 'Cardiologia', registroConselho: 'RQE 104' },
      { codigo: '05', nome: 'Ortopedia e Traumatologia', registroConselho: 'RQE 105' },
      { codigo: '06', nome: 'Odontologia Geral', registroConselho: 'CRO-ESP' },
      { codigo: '07', nome: 'Psiquiatria', registroConselho: 'RQE 107' },
      { codigo: '08', nome: 'Enfermagem da Família e Comunidade', registroConselho: 'COREN-ESP' },
      { codigo: '09', nome: 'Serviço Social na Saúde', registroConselho: 'CRESS-ESP' },
      { codigo: '10', nome: 'Farmácia Clínica e Dispensação', registroConselho: 'CRF-ESP' },
    ]

    const espMap: Record<string, EspecialidadeMedica> = {}
    for (const esp of especialidadesData) {
      const item = await EspecialidadeMedica.firstOrCreate(
        { codigo: esp.codigo },
        esp
      )
      espMap[esp.codigo] = item
    }

    // 3. Catálogo CBO (tb_CBOUnificado)
    const cbosData = [
      { codigo: '2251-25', ocupacao: 'Médico Clínico Geral', tipo: 'Medicina' },
      { codigo: '2251-24', ocupacao: 'Médico Pediatra', tipo: 'Medicina' },
      { codigo: '2252-50', ocupacao: 'Médico Ginecologista e Obstetra', tipo: 'Medicina' },
      { codigo: '2235-05', ocupacao: 'Enfermeiro Geral', tipo: 'Enfermagem' },
      { codigo: '2232-08', ocupacao: 'Cirurgião Dentista - Clínico Geral', tipo: 'Odontologia' },
      { codigo: '2516-05', ocupacao: 'Assistente Social', tipo: 'Serviço Social' },
      { codigo: '2234-05', ocupacao: 'Farmacêutico', tipo: 'Farmácia' },
      { codigo: '2515-10', ocupacao: 'Psicólogo Clínico', tipo: 'Psicologia' },
      { codigo: '3222-05', ocupacao: 'Técnico de Enfermagem', tipo: 'Enfermagem Técnica' },
      { codigo: '5151-05', ocupacao: 'Agente Comunitário de Saúde', tipo: 'Saúde Comunitária' },
    ]

    const cbosMap: Record<string, Cbo> = {}
    for (const cbo of cbosData) {
      const item = await Cbo.firstOrCreate(
        { codigo: cbo.codigo },
        cbo
      )
      cbosMap[cbo.codigo] = item
    }

    // 4. Bairros para vinculação
    const centro = await Bairro.findBy('nome', 'Centro')
    const vilaEsperanca = await Bairro.findBy('nome', 'Vila Esperança')
    const jdAlvorada = await Bairro.findBy('nome', 'Jardim Alvorada')
    const pqNacoes = await Bairro.findBy('nome', 'Parque das Nações')

    // 5. Unidades de Saúde (ARQ005 / tb_Estabelecimento)
    const unidadesData = [
      {
        cnes: '2078012',
        razaoSocial: 'Fundo Municipal de Saúde - UBS Central',
        nomeFantasia: 'UBS Central Dr. Mário Covas',
        tipoUnidade: 'UBS' as const,
        diretorTecnico: 'Dra. Ana Paula Silveira',
        telefone: '(11) 4589-1000',
        email: 'ubs.central@prefeitura.sp.gov.br',
        endereco: 'Praça da Matriz, 100 - Centro',
        bairroId: centro?.id || null,
        horarioFuncionamento: 'Segunda a Sexta, 07:00 às 19:00',
        ativa: true,
      },
      {
        cnes: '2078020',
        razaoSocial: 'Fundo Municipal de Saúde - USF Vila Esperança',
        nomeFantasia: 'USF Vila Esperança - Dra. Zilda Arns',
        tipoUnidade: 'USF' as const,
        diretorTecnico: 'Mariana Ramos Santos',
        telefone: '(11) 4589-2000',
        email: 'usf.esperanca@prefeitura.sp.gov.br',
        endereco: 'Rua das Flores, 250 - Vila Esperança',
        bairroId: vilaEsperanca?.id || null,
        horarioFuncionamento: 'Segunda a Sexta, 07:00 às 17:00',
        ativa: true,
      },
      {
        cnes: '2078039',
        razaoSocial: 'Fundo Municipal de Saúde - CAPS II Girassol',
        nomeFantasia: 'CAPS II Girassol - Atenção Psicossocial',
        tipoUnidade: 'CAPS' as const,
        diretorTecnico: 'Juliana Costa Mendes',
        telefone: '(11) 4589-3000',
        email: 'caps.girassol@prefeitura.sp.gov.br',
        endereco: 'Av. Brasil, 450 - Jardim Alvorada',
        bairroId: jdAlvorada?.id || null,
        horarioFuncionamento: 'Segunda a Sexta, 08:00 às 18:00',
        ativa: true,
      },
      {
        cnes: '2078047',
        razaoSocial: 'Fundo Municipal de Saúde - UPA 24 Horas',
        nomeFantasia: 'UPA 24 Horas Irmã Dulce',
        tipoUnidade: 'UPA' as const,
        diretorTecnico: 'Dr. Fernando Prado',
        telefone: '(11) 4589-4000',
        email: 'upa24h@prefeitura.sp.gov.br',
        endereco: 'Av. Marginal das Américas, 1200 - Parque das Nações',
        bairroId: pqNacoes?.id || null,
        horarioFuncionamento: 'Ininterrupto 24 Horas',
        ativa: true,
      },
      {
        cnes: '2078055',
        razaoSocial: 'Fundo Municipal de Saúde - Farmácia Central',
        nomeFantasia: 'Farmácia Municipal Central',
        tipoUnidade: 'FARMACIA' as const,
        diretorTecnico: 'Lucas Ferreira Braga',
        telefone: '(11) 4589-5000',
        email: 'farmacia.central@prefeitura.sp.gov.br',
        endereco: 'Rua do Comércio, 50 - Centro',
        bairroId: centro?.id || null,
        horarioFuncionamento: 'Segunda a Sexta, 07:30 às 17:30',
        ativa: true,
      },
    ]

    const unidadesMap: Record<string, UnidadeSaude> = {}
    for (const u of unidadesData) {
      const item = await UnidadeSaude.firstOrCreate(
        { cnes: u.cnes },
        u
      )
      unidadesMap[u.cnes] = item
    }

    // 6. Profissionais (ARQ020)
    const profissionaisData = [
      {
        codope: 101,
        nome: 'Dra. Ana Paula Silveira',
        cpf: '123.456.789-01',
        cns: '700101234560001',
        email: 'ana.silveira@saude.gov.br',
        telefone: '(11) 98765-4321',
        conselhoId: conselhosMap['CRM']?.id || null,
        numeroConselho: 'CRM-SP 145890',
        cboId: cbosMap['2251-25']?.id || null,
        status: 'ativo' as const,
      },
      {
        codope: 102,
        nome: 'Dr. Carlos Eduardo Nogueira',
        cpf: '234.567.890-12',
        cns: '700101234560002',
        email: 'carlos.nogueira@saude.gov.br',
        telefone: '(11) 98765-4322',
        conselhoId: conselhosMap['CRM']?.id || null,
        numeroConselho: 'CRM-SP 182341',
        cboId: cbosMap['2251-24']?.id || null,
        status: 'ativo' as const,
      },
      {
        codope: 103,
        nome: 'Mariana Ramos Santos',
        cpf: '345.678.901-23',
        cns: '700101234560003',
        email: 'mariana.santos@saude.gov.br',
        telefone: '(11) 98765-4323',
        conselhoId: conselhosMap['COREN']?.id || null,
        numeroConselho: 'COREN-SP 345678',
        cboId: cbosMap['2235-05']?.id || null,
        status: 'ativo' as const,
      },
      {
        codope: 104,
        nome: 'Dr. Roberto Mendes Vieira',
        cpf: '456.789.012-34',
        cns: '700101234560004',
        email: 'roberto.vieira@saude.gov.br',
        telefone: '(11) 98765-4324',
        conselhoId: conselhosMap['CRO']?.id || null,
        numeroConselho: 'CRO-SP 78901',
        cboId: cbosMap['2232-08']?.id || null,
        status: 'ativo' as const,
      },
      {
        codope: 105,
        nome: 'Fernanda Oliveira Lima',
        cpf: '567.890.123-45',
        cns: '700101234560005',
        email: 'fernanda.lima@social.gov.br',
        telefone: '(11) 98765-4325',
        conselhoId: conselhosMap['CRESS']?.id || null,
        numeroConselho: 'CRESS-SP 45672',
        cboId: cbosMap['2516-05']?.id || null,
        status: 'ativo' as const,
      },
      {
        codope: 106,
        nome: 'Lucas Ferreira Braga',
        cpf: '678.901.234-56',
        cns: '700101234560006',
        email: 'lucas.braga@farmacia.gov.br',
        telefone: '(11) 98765-4326',
        conselhoId: conselhosMap['CRF']?.id || null,
        numeroConselho: 'CRF-SP 56789',
        cboId: cbosMap['2234-05']?.id || null,
        status: 'ativo' as const,
      },
      {
        codope: 107,
        nome: 'Juliana Costa Mendes',
        cpf: '789.012.345-67',
        cns: '700101234560007',
        email: 'juliana.mendes@saude.gov.br',
        telefone: '(11) 98765-4327',
        conselhoId: conselhosMap['CRP']?.id || null,
        numeroConselho: 'CRP-SP 06/12345',
        cboId: cbosMap['2515-10']?.id || null,
        status: 'ativo' as const,
      },
      {
        codope: 108,
        nome: 'Beatriz Souza Martins',
        cpf: '890.123.456-78',
        cns: '700101234560008',
        email: 'beatriz.martins@saude.gov.br',
        telefone: '(11) 98765-4328',
        conselhoId: conselhosMap['COREN']?.id || null,
        numeroConselho: 'COREN-SP 890123-TE',
        cboId: cbosMap['3222-05']?.id || null,
        status: 'ativo' as const,
      },
    ]

    const profMap: Record<number, Profissional> = {}
    for (const p of profissionaisData) {
      const item = await Profissional.firstOrCreate(
        { cpf: p.cpf },
        p
      )
      if (p.codope) {
        profMap[p.codope] = item
      }
    }

    // 7. Vínculos e Lotações (UnidadeUsuario)
    const ubsCentral = unidadesMap['2078012']
    const usfEsperanca = unidadesMap['2078020']
    const capsGirassol = unidadesMap['2078039']
    const upa24h = unidadesMap['2078047']
    const farmCentral = unidadesMap['2078055']

    const vinculosData = [
      {
        profissionalId: profMap[101]?.id,
        unidadeSaudeId: ubsCentral?.id,
        especialidadeId: espMap['01']?.id,
        cargaHoraria: 30,
        cargo: 'Médica de Família e Comunidade',
        ativo: true,
      },
      {
        profissionalId: profMap[101]?.id,
        unidadeSaudeId: upa24h?.id,
        especialidadeId: espMap['01']?.id,
        cargaHoraria: 12,
        cargo: 'Plantão Emergência',
        ativo: true,
      },
      {
        profissionalId: profMap[102]?.id,
        unidadeSaudeId: ubsCentral?.id,
        especialidadeId: espMap['02']?.id,
        cargaHoraria: 20,
        cargo: 'Pediatra Ambulatorial',
        ativo: true,
      },
      {
        profissionalId: profMap[103]?.id,
        unidadeSaudeId: usfEsperanca?.id,
        especialidadeId: espMap['08']?.id,
        cargaHoraria: 40,
        cargo: 'Enfermeira Coordenadora ESF',
        ativo: true,
      },
      {
        profissionalId: profMap[104]?.id,
        unidadeSaudeId: ubsCentral?.id,
        especialidadeId: espMap['06']?.id,
        cargaHoraria: 20,
        cargo: 'Cirurgião Dentista Atenção Básica',
        ativo: true,
      },
      {
        profissionalId: profMap[105]?.id,
        unidadeSaudeId: capsGirassol?.id,
        especialidadeId: espMap['09']?.id,
        cargaHoraria: 30,
        cargo: 'Assistente Social CAPS',
        ativo: true,
      },
      {
        profissionalId: profMap[106]?.id,
        unidadeSaudeId: farmCentral?.id,
        especialidadeId: espMap['10']?.id,
        cargaHoraria: 40,
        cargo: 'Farmacêutico Responsável Técnico',
        ativo: true,
      },
      {
        profissionalId: profMap[107]?.id,
        unidadeSaudeId: capsGirassol?.id,
        especialidadeId: espMap['07']?.id,
        cargaHoraria: 40,
        cargo: 'Psicóloga da Equipe Multidisciplinar',
        ativo: true,
      },
      {
        profissionalId: profMap[108]?.id,
        unidadeSaudeId: usfEsperanca?.id,
        especialidadeId: espMap['08']?.id,
        cargaHoraria: 40,
        cargo: 'Técnica de Enfermagem / Sala de Vacinas',
        ativo: true,
      },
    ]

    for (const v of vinculosData) {
      if (v.profissionalId && v.unidadeSaudeId) {
        await VinculoLotacao.firstOrCreate(
          {
            profissionalId: v.profissionalId,
            unidadeSaudeId: v.unidadeSaudeId,
          },
          v
        )
      }
    }
  }
}
