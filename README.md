# Simulator Tech Repair

Jogo web de simulação 3D onde o jogador gerencia uma assistência técnica de computadores.

## Stack

- **React 19** + **Vite 8** (JavaScript puro — `.js` / `.jsx`)
- **Tailwind CSS v4** (tokens em `src/index.css`)
- **React Three Fiber** + **Drei** + **three**
- **Zustand** (estado global com persistência em `localStorage`)

## Scripts

```bash
pnpm install     # instala dependências
pnpm dev         # servidor de desenvolvimento
pnpm build       # build de produção
pnpm preview     # pré-visualiza o build
pnpm lint        # oxlint
```

## Documentação

- [`docs/arquitetura.md`](docs/arquitetura.md) — camadas, pastas e store
- [`docs/branding.md`](docs/branding.md) — design system do HUD
- [`docs/requisitos.md`](docs/requisitos.md) — escopo do MVP
- [`docs/gdd-core.md`](docs/gdd-core.md) — core loop e interação 3D
- [`docs/roadmap.md`](docs/roadmap.md) — fases de desenvolvimento

## Estrutura

```
src/
├── components/3d/   # cena e modelos R3F
├── components/ui/   # HUD (DOM + Tailwind)
├── models/          # catálogo, templates e constantes
├── store/           # Zustand (slices shop, bench, inventory, order, economy, ui)
└── utils/           # funções puras
```
