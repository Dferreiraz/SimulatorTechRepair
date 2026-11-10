const FAULTS_BY_SERVICE = {
  'Troca de HD': ['storage_failing'],
  'Limpeza de poeira': ['dust'],
  Formatação: ['no_os'],
  'Upgrade de RAM': ['ram_insufficient'],
  'Instalação de SSD': ['storage_failing'],
};

const SCREW_IDS = ['screw-1', 'screw-2', 'screw-3', 'screw-4'];

/**
 * Monta o dispositivo que entra na bancada a partir de uma ordem.
 * Placeholder até a Fase 3: slots e falhas são fixos por tipo de serviço.
 */
export const createBenchDeviceForOrder = (order) => ({
  orderId: order.id,
  deviceModelId: 'desktop-atx',
  slots: {
    cpu: { partId: 'cpu-basic', condition: 80 },
    ram1: { partId: 'ram-8gb', condition: 90 },
    ram2: null,
    storage: { partId: 'hdd-1tb', condition: 45 },
  },
  screws: SCREW_IDS.map((id) => ({ id, removed: false })),
  dust: order.description === 'Limpeza de poeira' ? 90 : 35,
  osInstalled: order.description !== 'Formatação',
  faults: FAULTS_BY_SERVICE[order.description] ?? [],
  revealedFaults: [],
});
