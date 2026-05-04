export type Commodity = 'CC' | 'IP' | 'BPFR' | 'BPRR' | 'SPOILER' | 'TAILGATE';

export type ProjectStatus = 'Ativo' | 'Pausado' | 'Finalizado';

export type ItemStatus = 'Aprovado' | 'Pendente' | 'Sem embalagem completa';

export type BuyMake = 'Buy' | 'Make';
export type InstructionFor = 'Production' | 'Service' | 'Both';
export type NacionalImportado = 'Nacional' | 'Importado';

export interface Project {
  id: string;
  divisao: string;
  projeto: string;
  planta: string;
  cliente: string;
  commodity: Commodity;
  volumeProducaoDia: string;
  turnos: string;
  horasTrabalhadasDia: string;
  carrosHora: string;
  engEmbalagem: string;
  supplyChain: string;
  comentariosENGE: string;
  comentariosSC: string;
  dataInicio: string;
  mpt: string;
  sop: string;
  coeficiente: string;
  imagemProduto: string;
  imagemCliente: string;
  status: ProjectStatus;
}

export interface Item {
  id: string;
  // Dados principais
  partNumber: string;
  partName: string;
  projeto: string;
  cliente: string;
  commodity: Commodity;
  fornecedor: string;
  codFornecedor: string;

  // Dados comerciais / processo
  buyMake: BuyMake;
  instructionFor: InstructionFor;
  nacionalImportado: NacionalImportado;
  n1: boolean;
  n0: boolean;
  reposicao: boolean;
  consignacao: boolean;
  carryOver: boolean;

  // Dados da peça
  comprimento: string;
  largura: string;
  altura: string;
  peso: string;
  pecasPorCarro: string;

  // Packaging Unit - PU
  puCode: string;
  puDesc: string;
  puMaterial: string;
  puTipo: string;
  puMedC: string;
  puMedL: string;
  puMedA: string;
  puPeso: string;
  pecasPorPU: string;
  brutoPU: string;

  // Handling Unit - HU
  huMedC: string;
  huMedL: string;
  huMedA: string;
  huPeso: string;
  puPorCamada: string;
  camadas: string;
  empilhavel: boolean;
  retornavel: boolean;

  // Simulação de transporte
  truckComprimento: string;
  truckLargura: string;
  freteViagem: string;

  // Imagens (base64)
  imagemPart: string;
  imagemPU: string;
  imagemHU: string;
  imagemDunnage: string;

  // Calculated
  status: ItemStatus;
}

export interface CalculatedFields {
  puPorHU: number;
  pesoTotalHU: number;
  alturaTotal: number;
  huPorLinha: number;
  huPorComprimento: number;
  huPorCaminhao: number;
  pecasPorHU: number;
  pecasPorCaminhao: number;
  custoPorPeca: number;
  alertas: string[];
}

export interface Fornecedor {
  id: string;
  nome: string;
  codigo: string;
  contato: string;
  email: string;
  telefone: string;
  endereco: string;
}

export interface Packaging {
  id: string;
  definicao: string;
  padrao: string;
  codSAP: string;
  descricaoSAP: string;
  embalagem: string;
  tipo: string;
  modelo: string;
  materialQuality: string;
  codigo: string;
  nacionalImportado: NacionalImportado;
  gramaturaDensidade: string;
  parede: string;
  ondas: string;
  espessura: string;
  coluna: string;
  material: string;
  partic: string;
  retornavel: boolean;
  lEx: string;
  cEx: string;
  aEx: string;
  alturaEncaixe: string;
  lIn: string;
  cIn: string;
  aIn: string;
  tara: string;
  capacidadeCarga: string;
  volumeCarga: string;
  ativo: boolean;
  imagem: string;
}
