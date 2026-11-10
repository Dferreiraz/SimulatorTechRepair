import { clamp } from '@/utils/math';

export const createShopSlice = (set) => ({
  shop: {
    name: 'Tech Repair',
    level: 1,
    reputation: 10,
    day: 1,
    upgrades: [],
  },

  setShopName: (name) => set((state) => ({ shop: { ...state.shop, name } })),

  addReputation: (amount) =>
    set((state) => ({
      shop: {
        ...state.shop,
        reputation: clamp(state.shop.reputation + amount, 0, 100),
      },
    })),

  advanceDay: () =>
    set((state) => ({ shop: { ...state.shop, day: state.shop.day + 1 } })),
});
