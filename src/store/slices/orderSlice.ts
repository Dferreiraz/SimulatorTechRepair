import type { OrderSlice, SliceCreator } from '../types';

export const createOrderSlice: SliceCreator<OrderSlice> = (set) => ({
  orders: {
    queue: [],
    activeOrder: null,
    completed: [],
  },

  enqueueOrder: (order) =>
    set((state) => ({
      orders: { ...state.orders, queue: [...state.orders.queue, order] },
    })),

  acceptOrder: (orderId) =>
    set((state) => {
      // Uma ordem ativa por vez na bancada.
      if (state.orders.activeOrder) return state;

      const order = state.orders.queue.find((item) => item.id === orderId);
      if (!order) return state;

      return {
        orders: {
          ...state.orders,
          queue: state.orders.queue.filter((item) => item.id !== orderId),
          activeOrder: order,
        },
      };
    }),

  declineOrder: (orderId) =>
    set((state) => ({
      orders: {
        ...state.orders,
        queue: state.orders.queue.filter((item) => item.id !== orderId),
      },
    })),

  completeActiveOrder: () =>
    set((state) => {
      const { activeOrder } = state.orders;
      if (!activeOrder) return state;

      return {
        orders: {
          ...state.orders,
          activeOrder: null,
          completed: [...state.orders.completed, activeOrder],
        },
      };
    }),
});
