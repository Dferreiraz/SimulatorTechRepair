import { useGameStore } from '@/store'
import { formatCurrency } from '@/utils/format'

export default function App() {
  const cash = useGameStore((state) => state.economy.cash)
  const day = useGameStore((state) => state.shop.day)
  const reputation = useGameStore((state) => state.shop.reputation)

  return (
    <main className="min-h-screen bg-base text-ink">
      <header className="flex items-center justify-between border-b border-line bg-surface px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-control bg-brand text-sm font-bold text-white">
            TR
          </span>
          <div>
            <h1 className="text-sm font-semibold">Simulator Tech Repair</h1>
            <p className="text-xs text-ink-muted">Fase 0 · setup</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <span className="text-ink-muted">
            Dia{' '}
            <strong className="font-semibold text-ink tabular-nums">{day}</strong>
          </span>
          <span className="text-ink-muted">
            Reputação{' '}
            <strong className="font-semibold text-ink tabular-nums">
              {reputation}
            </strong>
          </span>
          <span className="rounded-control bg-brand-soft px-3 py-1.5 font-semibold text-brand tabular-nums">
            {formatCurrency(cash)}
          </span>
        </div>
      </header>

      <section className="grid place-items-center p-10">
        <div className="w-full max-w-md rounded-panel bg-surface p-6 shadow-panel ring-1 ring-line">
          <h2 className="text-base font-semibold">Bancada vazia</h2>
          <p className="mt-1 text-sm text-ink-soft">
            A cena 3D entra na Fase 1. O store já está hidratado e persistindo
            no localStorage.
          </p>
        </div>
      </section>
    </main>
  )
}
