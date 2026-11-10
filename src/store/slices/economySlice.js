import { createId } from '@/utils/id';

const MAX_LEDGER_ENTRIES = 50;

const makeTransaction = (day, amount, kind, reason) => ({
  id: createId(),
  day,
  amount,
  kind,
  reason,
});

export const createEconomySlice = (set, get) => ({
  economy: {
    cash: 1500,
    ledger: [],
    dailyRent: 120,
  },

  credit: (amount, reason) => {
    if (amount <= 0) return;

    const { day } = get().shop;
    set((state) => ({
      economy: {
        ...state.economy,
        cash: state.economy.cash + amount,
        ledger: [
          makeTransaction(day, amount, 'income', reason),
          ...state.economy.ledger,
        ].slice(0, MAX_LEDGER_ENTRIES),
      },
    }));
  },

  debit: (amount, reason) => {
    if (amount <= 0) return;

    const { day } = get().shop;
    set((state) => ({
      economy: {
        ...state.economy,
        cash: state.economy.cash - amount,
        ledger: [
          makeTransaction(day, amount, 'expense', reason),
          ...state.economy.ledger,
        ].slice(0, MAX_LEDGER_ENTRIES),
      },
    }));
  },

  chargeDailyRent: () => {
    const { day } = get().shop;
    set((state) => ({
      economy: {
        ...state.economy,
        cash: state.economy.cash - state.economy.dailyRent,
        ledger: [
          makeTransaction(
            day,
            state.economy.dailyRent,
            'expense',
            'Aluguel do dia',
          ),
          ...state.economy.ledger,
        ].slice(0, MAX_LEDGER_ENTRIES),
      },
    }));
  },
});
