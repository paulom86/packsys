import { Item, Commodity } from '../types';

const CSV_HEADERS = [
  'partNumber', 'partName', 'projeto', 'cliente', 'commodity', 'fornecedor',
  'codFornecedor', 'puCode', 'puDesc', 'puMaterial', 'puTipo',
  'puMedC', 'puMedL', 'puMedA', 'puPeso', 'pecasPorPU', 'brutoPU',
  'huMedC', 'huMedL', 'huMedA', 'huPeso', 'puPorCamada', 'camadas',
  'truckComprimento', 'truckLargura', 'freteViagem', 'status',
];

export function generateCSVTemplate(): string {
  return CSV_HEADERS.join(';') + '\n';
}

export function exportItemsCSV(items: Item[]): string {
  const lines = [CSV_HEADERS.join(';')];
  for (const item of items) {
    const row = [
      item.partNumber, item.partName, item.projeto, item.cliente,
      item.commodity, item.fornecedor, item.codFornecedor,
      item.puCode, item.puDesc, item.puMaterial, item.puTipo,
      item.puMedC, item.puMedL, item.puMedA, item.puPeso,
      item.pecasPorPU, item.brutoPU,
      item.huMedC, item.huMedL, item.huMedA, item.huPeso,
      item.puPorCamada, item.camadas,
      item.truckComprimento, item.truckLargura, item.freteViagem,
      item.status,
    ];
    lines.push(row.join(';'));
  }
  return lines.join('\n');
}

export function parseCSVItems(csv: string): Partial<Item>[] {
  const lines = csv.split('\n').filter((l) => l.trim() !== '');
  if (lines.length < 2) return [];

  const items: Partial<Item>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(';');
    if (cols.length < CSV_HEADERS.length) continue;

    const commodity = (cols[4] as Commodity) || 'CC';
    const validCommodities: Commodity[] = ['CC', 'IP', 'BPFR', 'BPRR', 'SPOILER', 'TAILGATE'];

    items.push({
      id: crypto.randomUUID(),
      partNumber: cols[0] || '',
      partName: cols[1] || '',
      projeto: cols[2] || '',
      cliente: cols[3] || '',
      commodity: validCommodities.includes(commodity) ? commodity : 'CC',
      fornecedor: cols[5] || '',
      codFornecedor: cols[6] || '',
      puCode: cols[7] || '',
      puDesc: cols[8] || '',
      puMaterial: cols[9] || '',
      puTipo: cols[10] || '',
      puMedC: cols[11] || '',
      puMedL: cols[12] || '',
      puMedA: cols[13] || '',
      puPeso: cols[14] || '',
      pecasPorPU: cols[15] || '',
      brutoPU: cols[16] || '',
      huMedC: cols[17] || '',
      huMedL: cols[18] || '',
      huMedA: cols[19] || '',
      huPeso: cols[20] || '',
      puPorCamada: cols[21] || '',
      camadas: cols[22] || '',
      truckComprimento: cols[23] || '',
      truckLargura: cols[24] || '',
      freteViagem: cols[25] || '',
      status: (cols[26] as Item['status']) || 'Pendente',
      buyMake: 'Buy',
      instructionFor: 'Production',
      nacionalImportado: 'Nacional',
      n1: false,
      n0: false,
      reposicao: false,
      consignacao: false,
      carryOver: false,
      comprimento: '',
      largura: '',
      altura: '',
      peso: '',
      pecasPorCarro: '',
      empilhavel: false,
      retornavel: false,
      imagemPart: '',
      imagemPU: '',
      imagemHU: '',
      imagemDunnage: '',
    });
  }
  return items;
}

export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
