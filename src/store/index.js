import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createBenchSlice } from './slices/benchSlice';
import { createEconomySlice } from './slices/economySlice';
import { createInventorySlice } from './slices/inventorySlice';
import { createOrderSlice } from './slices/orderSlice';
import { createShopSlice } from './slices/shopSlice';
import { createUiSlice } from './slices/uiSlice';

const STORAGE_KEY = 'str-save';
const SAVE_VERSION = 1;

export const useGameStore = create()(
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
      partialize: (state) => ({
        shop: state.shop,
        bench: state.bench,
        inventory: state.inventory,
        orders: state.orders,
        economy: state.economy,
      }),

      // Merge raso por domínio (1 nível) preserva campos novos de saves antigos.
      merge: (persisted, current) => {
        const saved = persisted ?? {};

        return {
          ...current,
          shop: { ...current.shop, ...saved.shop },
          bench: { ...current.bench, ...saved.bench },
          inventory: { ...current.inventory, ...saved.inventory },
          orders: { ...current.orders, ...saved.orders },
          economy: { ...current.economy, ...saved.economy },
        };
      },

      migrate: (persisted) => persisted,
    },
  ),
);
