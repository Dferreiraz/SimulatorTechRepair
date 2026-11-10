/**
 * Tipos de domínio — independentes de React, Three.js e Zustand.
 * Alterar aqui exige revisar `src/store/types.ts` e os slices.
 */

/** Slots físicos de um dispositivo. Expansível por modelo em `models/devices.ts`. */
export type PartSlot = 'cpu' | 'ram1' | 'ram2' | 'storage' | 'gpu' | 'psu' | 'cooler';

/** Etapas do reparo na bancada. */
export type RepairStage =
  | 'idle'
  | 'intake'
  | 'diagnosing'
  | 'repairing'
  | 'testing'
  | 'ready';

/** Falhas que o diagnóstico pode revelar. */
export type FaultKind = 'dust' | 'storage_failing' | 'ram_insufficient' | 'no_os';

export interface InstalledPart {
  partId: string;
  /** Integridade da peça, 0–100. */
  condition: number;
}

export interface BenchDevice {
  orderId: string;
  deviceModelId: string;
  /** `null` = slot vazio; ausente = slot inexistente no modelo. */
  slots: Partial<Record<PartSlot, InstalledPart | null>>;
  screws: { id: string; removed: boolean }[];
  /** Sujeira acumulada, 0–100. */
  dust: number;
  osInstalled: boolean;
  faults: FaultKind[];
  revealedFaults: FaultKind[];
}

export interface ServiceOrder {
  id: string;
  customerName: string;
  deviceModelId: string;
  /** Sintoma em linguagem leiga, exibido na recepção. */
  symptom: string;
  faults: FaultKind[];
  deadlineHours: number;
  payout: number;
  reputationGain: number;
  createdOnDay: number;
}

export type TransactionKind = 'income' | 'expense';

export interface Transaction {
  id: string;
  day: number;
  /** Sempre positivo; `kind` define o sinal. */
  amount: number;
  kind: TransactionKind;
  reason: string;
}
