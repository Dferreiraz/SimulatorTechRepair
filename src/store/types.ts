import type { StateCreator } from 'zustand';

import type {
  BenchDevice,
  FaultKind,
  RepairStage,
  ServiceOrder,
  Transaction,
} from '@/models/types';

/* ------------------------------------------------------------------ */
/* Estado por domínio                                                 */
/* ------------------------------------------------------------------ */

export type PanelId = 'none' | 'reception' | 'bench' | 'inventory' | 'shop' | 'settings';
export type ToastKind = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  kind: ToastKind;
  message: string;
}

export interface ShopState {
  name: string;
  level: number;
  /** 0–100. */
  reputation: number;
  day: number;
  upgrades: string[];
}

export interface BenchState {
  device: BenchDevice | null;
  stage: RepairStage;
  selectedPartId: string | null;
}

export interface InventoryState {
  /** partId → quantidade disponível. */
  stock: Record<string, number>;
}

export interface OrderState {
  queue: ServiceOrder[];
  activeOrder: ServiceOrder | null;
  completed: ServiceOrder[];
}

export interface EconomyState {
  cash: number;
  /** Mais recente primeiro. */
  ledger: Transaction[];
  dailyRent: number;
}

export interface UiState {
  activePanel: PanelId;
  paused: boolean;
  dragPayload: { partId: string } | null;
  toasts: Toast[];
}

/* ------------------------------------------------------------------ */
/* Contratos das slices (estado + ações)                              */
/* ------------------------------------------------------------------ */

export interface ShopSlice {
  shop: ShopState;
  setShopName: (name: string) => void;
  addReputation: (amount: number) => void;
  advanceDay: () => void;
}

export interface BenchSlice {
  bench: BenchState;
  loadDevice: (device: BenchDevice) => void;
  clearBench: () => void;
  setStage: (stage: RepairStage) => void;
  selectPart: (partId: string | null) => void;
  markScrewRemoved: (screwId: string) => void;
  setDust: (dust: number) => void;
  revealFault: (fault: FaultKind) => void;
}

export interface InventorySlice {
  inventory: InventoryState;
  addStock: (partId: string, quantity?: number) => void;
  consumeStock: (partId: string, quantity?: number) => void;
  resetStock: () => void;
}

export interface OrderSlice {
  orders: OrderState;
  enqueueOrder: (order: ServiceOrder) => void;
  acceptOrder: (orderId: string) => void;
  declineOrder: (orderId: string) => void;
  completeActiveOrder: () => void;
}

export interface EconomySlice {
  economy: EconomyState;
  credit: (amount: number, reason: string) => void;
  debit: (amount: number, reason: string) => void;
  chargeDailyRent: () => void;
}

export interface UiSlice {
  ui: UiState;
  setActivePanel: (panel: PanelId) => void;
  togglePause: () => void;
  beginDrag: (partId: string) => void;
  endDrag: () => void;
  pushToast: (kind: ToastKind, message: string) => void;
  dismissToast: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/* Store combinado                                                    */
/* ------------------------------------------------------------------ */

export type GameState = ShopSlice &
  BenchSlice &
  InventorySlice &
  OrderSlice &
  EconomySlice &
  UiSlice;

/** Apenas estes domínios vão para o `localStorage`. `ui` é sempre efêmero. */
export type PersistedGameState = Pick<
  GameState,
  'shop' | 'bench' | 'inventory' | 'orders' | 'economy'
>;

export type SliceCreator<T> = StateCreator<GameState, [], [], T>;
