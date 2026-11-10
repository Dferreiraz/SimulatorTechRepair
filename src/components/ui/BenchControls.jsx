import { useGameStore } from '@/store';
import { formatCurrency } from '@/utils/format';

export default function BenchControls() {
  const stage = useGameStore((state) => state.bench.stage);
  const device = useGameStore((state) => state.bench.device);
  const activeOrder = useGameStore((state) => state.orders.activeOrder);
  const completeOrder = useGameStore((state) => state.completeOrder);

  if (stage === 'idle' || !device || !activeOrder) return null;

  return (
    <aside className="pointer-events-auto w-80 rounded-panel border border-line bg-surface/90 p-4 shadow-panel backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
          Bancada
        </p>
        <span className="rounded-md bg-warn/10 px-2 py-0.5 text-[10px] font-semibold text-warn">
          Em reparo
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-ink">
        {activeOrder.description}
      </p>
      <p className="text-xs text-ink-soft">Cliente: {activeOrder.customerName}</p>

      <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-xs">
        <span className="text-ink-muted">Pagamento</span>
        <span className="font-semibold text-ok tabular-nums">
          {formatCurrency(activeOrder.payout)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => completeOrder(activeOrder.id)}
        className="mt-3 h-10 w-full rounded-control bg-brand text-sm font-semibold text-white transition-colors duration-150 ease-out-ui hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
      >
        Simular Conserto &amp; Devolver
      </button>

      <p className="mt-2 text-center text-[10px] text-ink-muted">
        Interação 3D real chega na Fase 3.
      </p>
    </aside>
  );
}
