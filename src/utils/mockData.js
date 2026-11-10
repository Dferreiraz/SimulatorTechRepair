import { createId } from '@/utils/id';

const CUSTOMERS = [
  'Ana Souza',
  'Bruno Lima',
  'Carla Mendes',
  'Diego Ferreira',
  'Elisa Rocha',
  'Felipe Castro',
  'Gabriela Alves',
  'Henrique Dias',
  'Isabela Martins',
  'João Pereira',
];

const SERVICES = [
  { description: 'Troca de HD', minPayout: 180, maxPayout: 320 },
  { description: 'Limpeza de poeira', minPayout: 80, maxPayout: 140 },
  { description: 'Formatação', minPayout: 120, maxPayout: 200 },
  { description: 'Upgrade de RAM', minPayout: 150, maxPayout: 260 },
  { description: 'Instalação de SSD', minPayout: 220, maxPayout: 380 },
];

const pick = (items) => items[Math.floor(Math.random() * items.length)];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Gera uma ordem de serviço fictícia para o MVP.
 * status: 'available' | 'active' | 'completed'
 */
export const generateMockOrder = () => {
  const service = pick(SERVICES);

  return {
    id: createId(),
    customerName: pick(CUSTOMERS),
    description: service.description,
    payout: randomInt(service.minPayout, service.maxPayout),
    status: 'available',
  };
};

export const generateMockOrders = (count = 1) =>
  Array.from({ length: count }, () => generateMockOrder());
