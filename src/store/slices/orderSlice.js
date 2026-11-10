import { createBenchDeviceForOrder } from '@/models/benchDevice';
import { formatCurrency } from '@/utils/format';
import { generateMockOrder, generateMockOrders } from '@/utils/mockData';

export const createOrderSlice = (set, get) => ({
  orders: {
    availableOrders: generateMockOrders(3),
    activeOrder: null,
    completedOrders: [],
  },

  /** Adiciona uma ordem à recepção. Sem argumento, gera uma mock order. */
  addOrder: (order = generateMockOrder()) =>
    set((state) => ({
      orders: {
        ...state.orders,
        availableOrders: [...state.orders.availableOrders, order],
      },
    })),

  acceptOrder: (orderId) => {
    const { orders, bench } = get();

    if (orders.activeOrder || bench.device) {
      return { ok: false, reason: 'bench_busy' };
    }

    const order = orders.availableOrders.find((item) => item.id === orderId);
    if (!order) return { ok: false, reason: 'not_found' };

    const activeOrder = { ...order, status: 'active' };

    set({
      orders: {
        ...orders,
        availableOrders: orders.availableOrders.filter(
          (item) => item.id !== orderId,
        ),
        activeOrder,
      },
    });

    get().loadDevice(createBenchDeviceForOrder(activeOrder), 'repairing');
    get().pushToast('info', `${order.customerName} entregou o equipamento.`);

    return { ok: true };
  },

  declineOrder: (orderId) =>
    set((state) => ({
      orders: {
        ...state.orders,
        availableOrders: state.orders.availableOrders.filter(
          (item) => item.id !== orderId,
        ),
      },
    })),

  /**
   * Caso de uso que cruza slices: fecha a ordem, paga o jogador e libera a bancada.
   * Na Fase 3 será chamado apenas após a validação real do reparo.
   */
  completeOrder: (orderId) => {
    const { orders, bench } = get();
    const order = orders.activeOrder;

    if (!order || order.id !== orderId) {
      return { ok: false, reason: 'not_active' };
    }

    if (!bench.device) {
      return { ok: false, reason: 'empty_bench' };
    }

    set({
      orders: {
        ...orders,
        activeOrder: null,
        completedOrders: [
          ...orders.completedOrders,
          { ...order, status: 'completed' },
        ],
      },
    });

    get().addCash(order.payout);
    get().clearBench();
    get().pushToast(
      'success',
      `Serviço concluído · +${formatCurrency(order.payout)}`,
    );

    return { ok: true, payout: order.payout };
  },
});
