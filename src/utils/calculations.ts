import { Item, CalculatedFields, ItemStatus } from '../types';

function num(val: string): number {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

export function calculateFields(item: Item): CalculatedFields {
  const puPorCamada = num(item.puPorCamada);
  const camadas = num(item.camadas);
  const puPorHU = puPorCamada * camadas;

  const pesoHU = num(item.huPeso);
  const brutoPU = num(item.brutoPU);
  const pesoTotalHU = pesoHU + brutoPU * puPorHU;

  const alturaPU = num(item.puMedA);
  const alturaTotal = alturaPU * camadas + num(item.huMedA);

  const truckLargura = num(item.truckLargura);
  const truckComprimento = num(item.truckComprimento);
  const huMedL = num(item.huMedL);
  const huMedC = num(item.huMedC);

  const huPorLinha = huMedL > 0 ? Math.floor(truckLargura / huMedL) : 0;
  const huPorComprimento = huMedC > 0 ? Math.floor(truckComprimento / huMedC) : 0;
  const huPorCaminhao = huPorLinha * huPorComprimento;

  const pecasPorPU = num(item.pecasPorPU);
  const pecasPorHU = pecasPorPU * puPorHU;
  const pecasPorCaminhao = pecasPorHU * huPorCaminhao;

  const freteViagem = num(item.freteViagem);
  const custoPorPeca = pecasPorCaminhao > 0 ? freteViagem / pecasPorCaminhao : 0;

  const alertas: string[] = [];
  if (pesoTotalHU > 1000) alertas.push('Peso HU acima de 1000 kg');
  if (alturaTotal > 1800) alertas.push('Altura total acima de 1800 mm');
  if (puPorHU <= 0 && (puPorCamada > 0 || camadas > 0)) alertas.push('PU por HU inválido');

  return {
    puPorHU,
    pesoTotalHU,
    alturaTotal,
    huPorLinha,
    huPorComprimento,
    huPorCaminhao,
    pecasPorHU,
    pecasPorCaminhao,
    custoPorPeca,
    alertas,
  };
}

export function determineStatus(item: Item): ItemStatus {
  const hasMainData = item.partNumber.trim() !== '' && item.partName.trim() !== '';
  const hasPackaging =
    item.puCode.trim() !== '' &&
    item.puDesc.trim() !== '' &&
    num(item.pecasPorPU) > 0 &&
    num(item.puPorCamada) > 0 &&
    num(item.camadas) > 0;

  if (hasMainData && hasPackaging) return 'Aprovado';
  if (hasMainData && !hasPackaging) return 'Sem embalagem completa';
  return 'Pendente';
}
