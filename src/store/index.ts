import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createBenchSlice } from './slices/benchSlice';
import { createEconomySlice } from './slices/economySlice';
import { createInventorySlice } from './slices/inventorySlice';
import { createOrderSlice } from './slices/orderSlice';
import { createShopSlice } from './slices/shopSlice';
import { createUiSlice } from './slices/uiSlice';
import type { GameState, PersistedGameState } from './types';

const STORAGE_KEY = 'str-save';
const SAVE_VERSION = 1;

export const useGameStore = create<GameState>()(
  persist(
    (...args) => ({
      ...createShopSlice(...args),
      ...createBenchSlice(...args),
      ...createInventorySlice(...args),
      ...createOrderSlice(...args),
      ...createEconomySlice(...args),
      ...createUiSlice(...args),
    }),
    {
      name: STORAGE_KEY,
      version: SAVE_VERSION,
      storage: createJSONStorage(() => localStorage),

      // `ui` é efêmero: nunca vai para o save.
      partialize: (state): PersistedGameState => ({
        shop: state.shop,
        bench: state.bench,
        inventory: state.inventory,
        orders: state.orders,
        economy: state.economy,
      }),

      // Merge profundo (1 nível) para preservar campos novos de cada domínio
      // quando o save vier de uma versão anterior.
      merge: (persisted, current) => {
        const saved = persisted as Partial<PersistedGameState>;

        return {
          ...current,
          shop: { ...current.shop, ...saved.shop },
          bench: { ...current.bench, ...saved.bench },
          inventory: { ...current.inventory, ...saved.inventory },
          orders: { ...current.orders, ...saved.orders },
          economy: { ...current.economy, ...saved.economy },
        };
      },

      migrate: (persisted, version) => {
        // Schema inicial. Futuras mudanças entram aqui, uma por versão.
        void version;
        return persisted as GameState;
      },
    },
  ),
);

export * from './types';
