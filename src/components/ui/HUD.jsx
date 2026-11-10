import { useGameStore } from '@/store';
import { formatCurrency } from '@/utils/format';

import BenchControls from './BenchControls';
import OrderBoard from './OrderBoard';

const TOAST_TONES = {
  info: 'border-info/50',
  success: 'border-ok/50',
  warning: 'border-warn/50',
  error: 'border-bad/50',
};

export default function HUD() {
  const cash = useGameStore((state) => state.economy.cash);
  const day = useGameStore((state) => state.shop.day);
  const toasts = useGameStore((state) => state.ui.toasts);
  const addOrder = useGameStore((state) => state.addOrder);
  const pushToast = useGameStore((state) => state.pushToast);
  const dismissToast = useGameStore((state) => state.dismissToast);

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <header className="pointer-events-auto flex items-center justify-between gap-4 rounded-panel border border-line bg-surface/90 px-4 py-2.5 shadow-panel backdrop-blur-sm">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-control bg-brand text-xs font-bold text-white">
            TR
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold">
              <span className="text-brand">Simulator Tech Repair</span>
              <span className="text-ink-muted"> - Alpha</span>
            </h1>
            <p className="text-[11px] text-ink-muted">
              Oficina online · Dia {day}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
              Caixa
            </p>
            <p className="text-lg font-semibold leading-tight text-ink tabular-nums">
              {formatCurrency(cash)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => addOrder()}
            className="pointer-events-auto h-9 rounded-control bg-brand px-3 text-sm font-semibold text-white transition-colors duration-150 ease-out-ui hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
          >
            + Gerar Cliente
          </button>

          <button
            type="button"
            onClick={() =>
              pushToast('info', 'Configurações chegam na próxima fase.')
            }
            className="pointer-events-auto h-9 rounded-control bg-elevated px-3 text-sm font-semibold text-ink-soft ring-1 ring-line transition-colors duration-150 ease-out-ui hover:text-ink hover:ring-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
          >
            Menu
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 items-stretch justify-between gap-4">
        <OrderBoard />
        <div className="flex items-end">
          <BenchControls />
        </div>
      </div>

      <footer className="flex items-end justify-between gap-4">
        <p className="rounded-control border border-line/70 bg-surface/70 px-3 py-1.5 text-[11px] text-ink-muted backdrop-blur-sm">
          Arraste para orbitar · Scroll para zoom
        </p>

        <div className="flex flex-col items-end gap-2">
          {toasts.map((toast) => (
            <button
              key={toast.id}
              type="button"
              onClick={() => dismissToast(toast.id)}
              className={`pointer-events-auto rounded-control border-l-2 bg-elevated/95 px-3 py-2 text-xs text-ink-soft shadow-panel backdrop-blur-sm ${TOAST_TONES[toast.kind]}`}
            >
              {toast.message}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
