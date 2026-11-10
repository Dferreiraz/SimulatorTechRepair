import { useGameStore } from '@/store';
import { formatCurrency } from '@/utils/format';

const initialsOf = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function OrderBoard() {
  const availableOrders = useGameStore((state) => state.orders.availableOrders);
  const activeOrder = useGameStore((state) => state.orders.activeOrder);
  const acceptOrder = useGameStore((state) => state.acceptOrder);

  const benchBusy = Boolean(activeOrder);

  return (
    <aside className="pointer-events-auto flex w-80 shrink-0 flex-col overflow-hidden rounded-panel border border-line bg-surface/90 shadow-panel backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Recepção</h2>
          <p className="text-[11px] text-ink-muted">Clientes aguardando</p>
        </div>
        <span className="rounded-md bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand tabular-nums">
          {availableOrders.length}
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {availableOrders.length === 0 && (
          <div className="rounded-control border border-dashed border-line px-3 py-6 text-center">
            <p className="text-xs font-semibold text-ink-soft">
              Nenhum cliente na fila
            </p>
            <p className="mt-1 text-[11px] text-ink-muted">
              Use “Gerar Cliente” para criar uma ordem de teste.
            </p>
          </div>
        )}

        {availableOrders.map((order) => (
          <article
            key={order.id}
            className="rounded-control bg-elevated p-3 ring-1 ring-line transition-colors duration-150 ease-out-ui hover:ring-line-strong"
          >
            <div className="flex items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand">
                {initialsOf(order.customerName)}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {order.customerName}
                </p>
                <p className="text-xs text-ink-soft">{order.description}</p>
              </div>

              <span className="shrink-0 text-sm font-semibold text-ok tabular-nums">
                {formatCurrency(order.payout)}
              </span>
            </div>

            <button
              type="button"
              disabled={benchBusy}
              onClick={() => acceptOrder(order.id)}
              className="mt-3 h-8 w-full rounded-control bg-brand text-xs font-semibold text-white transition-colors duration-150 ease-out-ui hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 disabled:cursor-not-allowed disabled:bg-elevated disabled:text-ink-muted disabled:ring-1 disabled:ring-line"
            >
              {benchBusy ? 'Bancada ocupada' : 'Aceitar Serviço'}
            </button>
          </article>
        ))}
      </div>
    </aside>
  );
}
