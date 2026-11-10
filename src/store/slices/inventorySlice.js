export const createInventorySlice = (set) => ({
  inventory: { stock: {} },

  addStock: (partId, quantity = 1) =>
    set((state) => ({
      inventory: {
        stock: {
          ...state.inventory.stock,
          [partId]: (state.inventory.stock[partId] ?? 0) + quantity,
        },
      },
    })),

  consumeStock: (partId, quantity = 1) =>
    set((state) => {
      const current = state.inventory.stock[partId] ?? 0;
      if (current < quantity) return state;

      const remaining = current - quantity;
      const stock = { ...state.inventory.stock };

      if (remaining === 0) {
        delete stock[partId];
      } else {
        stock[partId] = remaining;
      }

      return { inventory: { stock } };
    }),

  resetStock: () => set({ inventory: { stock: {} } }),
});
