# Arquitetura — Simulator Tech Repair

> Documento vivo. Versão 1.0 · Stack: React + Vite + pnpm + Tailwind CSS + React Three Fiber / Drei + Zustand.

## 1. Visão geral

O projeto é uma SPA 3D que roda inteiramente no navegador. Não existe backend no MVP: todo o estado
persistente vive no `localStorage` (via `zustand/persist`), com schema versionado para permitir
migrações futuras. A arquitetura é desenhada para que a troca de persistência (local → Supabase/API)
não afete as camadas de UI e 3D.

Três regras estruturais guiam o código:

1. **Uma única fonte de verdade.** O Zustand é o dono do estado de jogo. Nenhum componente guarda
   cópia de dinheiro, inventário ou status de reparo em estado local.
2. **HUD e cena 3D são irmãos, não pai/filho.** O HUD é DOM/Tailwind; a cena é WebGL/R3F. Ambos
   consomem o mesmo store e nunca se renderizam dentro um do outro (exceto labels diegéticos).
3. **Dados separados de lógica.** Catálogo de peças, templates de ordem de serviço e balanceamento
   vivem em `models/` como dados tipados; sistemas em `systems/` operam sobre eles.

## 2. Camadas

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            React (Vite)                                  │
│                                                                          │
│   ┌─────────────────────────────┐        ┌─────────────────────────────┐ │
│   │  HUD — DOM + Tailwind       │        │  Cena — R3F / WebGL         │ │
│   │  components/ui, features/*  │        │  components/3d, scenes/     │ │
│   │  z-index alto, pointer-events│       │  Canvas isolado, DPR cap    │ │
│   └──────────────┬──────────────┘        └──────────────┬──────────────┘ │
│                  │  useStore(selector) / actions       │                 │
│                  └──────────────────┬──────────────────┘                 │
│                                     ▼                                    │
│                        ┌───────────────────────────┐                     │
│                        │      Zustand Store        │                     │
│                        │  shop · bench · inventory │                     │
│                        │  orders · economy · ui    │                     │
│                        └─────────────┬─────────────┘                     │
│                                      │                                   │
│              ┌───────────────────────┼───────────────────────┐          │
│              ▼                       ▼                       ▼          │
│        models/ (catálogo,      systems/ (regras,       lib/ (math,      │
│        templates, balance)     raycast, save)         format, ids)      │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Camada de apresentação 3D

- Um único `<Canvas>` montado em `scenes/WorkshopScene.tsx` (ou `GameCanvas.tsx`).
- Componentes de `components/3d/` são **puros em relação ao jogo**: recebem props ou leem
  selectors estreitos do store. Ex.: `<PcCase />` lê `bench.screws` e `bench.slots`.
- Nada de lógica de negócio dentro de `useFrame`. `useFrame` só anima (lerp, shake, highlight).
- Iluminação, pós-processamento e materiais ficam em `components/3d/environment/`.

### 2.2 Camada de apresentação HUD

- Painéis, botões, listas de ordens, inventário e notificações.
- Renderizada fora do Canvas (overlay absoluto), garantindo texto nítido, acessibilidade e
  `pointer-events` previsíveis.
- Uso de `<Html>` do Drei permitido **apenas** para labels diegéticos curtos (ex.: “Parafuso
  faltando”, preço flutuante). Nunca para HUD principal.

### 2.3 Ponte HUD ↔ 3D

A comunicação acontece em duas direções, sempre via store:

| Direção | Mecanismo | Exemplo |
|---|---|---|
| HUD → 3D | `useStore.getState().action()` | Botão “Iniciar diagnóstico” muda `bench.stage` |
| 3D → HUD | `action()` chamada no handler de pointer | Clique no parafuso chama `removeScrew('s1')` |
| Ambos | `useStore(selector)` reativo | Barra de progresso e highlight do slot leem `stage` |
| Efêmero (hover) | ref + `subscribe` (sem re-render) | Outline da peça sob o mouse |

**Drag & drop HUD → 3D** não usa HTML5 Drag and Drop (conflita com pointer events do canvas).
Usa-se uma “drag layer” em DOM com Pointer Events: ao iniciar o arraste, grava-se
`ui.dragPayload = { partId }`; a cena lê esse payload, faz raycast no plano de trabalho e exibe o
ghost da peça; ao soltar, chama `installPart(slot, partId)`.

## 3. Estrutura de pastas

```
simulator-tech-repair/
├── docs/                      # esta documentação (versão publicada)
├── public/
│   ├── models/                # .glb/.gltf (case, placa-mãe, componentes)
│   ├── textures/              # atlas de sujeira, decals, normal maps
│   └── audio/                 # SFX (clique, parafusadeira, boot)
├── src/
│   ├── main.tsx
│   ├── App.tsx                # layout raiz: <Canvas /> + <HUD />
│   ├── scenes/
│   │   ├── WorkshopScene.tsx  # composição da cena, luzes, câmera
│   │   └── BenchRig.tsx       # posicionamento da bancada e do dispositivo
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── devices/       # PcCase, DesktopTower, LaptopBody
│   │   │   ├── parts/         # RamStick, SsdDrive, HddDrive, Gpu, Cooler
│   │   │   ├── tools/         # Screwdriver, Brush, UsbStick
│   │   │   ├── interaction/   # HoverOutline, DropZone, DragGhost
│   │   │   └── environment/   # Lighting, Workbench, RoomProps
│   │   └── ui/
│   │       ├── primitives/    # Button, Card, Badge, Progress, Tooltip
│   │       ├── hud/           # TopBar, CashDisplay, DayClock
│   │       ├── panels/        # OrderQueue, Inventory, BenchPanel
│   │       └── overlays/      # Modal, Toasts, PauseMenu
│   ├── features/              # composições por domínio (HUD + ações)
│   │   ├── reception/         # fila, aceitar/recusar ordem
│   │   ├── bench/             # diagnóstico, tarefas, remontagem
│   │   ├── inventory/         # compra, estoque, arraste
│   │   └── finance/           # caixa, fatura, despesas
│   ├── store/
│   │   ├── index.ts           # create() + combinador de slices
│   │   ├── types.ts           # contratos tipados do estado
│   │   ├── slices/
│   │   │   ├── shopSlice.ts
│   │   │   ├── benchSlice.ts
│   │   │   ├── inventorySlice.ts
│   │   │   ├── orderSlice.ts
│   │   │   ├── economySlice.ts
│   │   │   └── uiSlice.ts
│   │   ├── selectors.ts       # selectors derivados e memoizáveis
│   │   └── persistence.ts     # persist + migrate
│   ├── systems/
│   │   ├── repairRules.ts     # validação de reparo concluído
│   │   ├── orderGenerator.ts  # RNG com seed, geração de ordens
│   │   ├── economy.ts         # preços, margem, aluguel
│   │   └── raycast.ts         # helpers de picking e planos
│   ├── models/                # DADOS, não componentes
│   │   ├── partCatalog.ts     # peças, preço, compatibilidade, slot
│   │   ├── serviceTemplates.ts# sintomas, falhas, recompensas
│   │   ├── devices.ts         # layout de slots por modelo
│   │   └── balance.ts         # constantes de balanceamento
│   ├── hooks/
│   │   ├── usePointerDrag.ts
│   │   ├── useHoverPart.ts
│   │   └── useKeyboard.ts
│   ├── lib/                   # utilitários puros, sem React
│   │   ├── format.ts          # moeda, tempo, plural
│   │   ├── ids.ts
│   │   └── math.ts
│   ├── types/                 # tipos de domínio compartilhados
│   └── styles/
│       ├── index.css          # @import "tailwindcss" + @theme
│       └── tokens.css         # variáveis CSS semânticas
├── docs/                      # (arquitetura.md, gdd-core.md, ...)
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

> **Regra de dependência:** `components/*` pode importar `store`, `features`, `models`, `lib`.
> `store` pode importar `models`, `systems`, `lib`, **nunca** `components` ou `features`.
> `lib` e `models` não importam nada de React.

## 4. Estado global com Zustand

### 4.1 Modelo de domínio

```ts
// src/store/types.ts (resumo)
export type PartSlot = 'cpu' | 'ram1' | 'ram2' | 'storage' | 'gpu' | 'psu' | 'cooler';
export type RepairStage =
  | 'idle'        // bancada vazia
  | 'intake'      // dispositivo posicionado
  | 'diagnosing'  // teste em execução
  | 'repairing'   // peças sendo trocadas
  | 'testing'     // validação final
  | 'ready';      // pronto para devolver

export interface InstalledPart {
  partId: string;      // referência ao partCatalog
  condition: number;   // 0–100 (peças usadas)
}

export interface BenchDevice {
  orderId: string;
  deviceModelId: string;
  slots: Partial<Record<PartSlot, InstalledPart | null>>;
  screws: { id: string; removed: boolean }[];
  dust: number;          // 0–100
  osInstalled: boolean;
  faults: string[];      // falhas reveladas pelo diagnóstico
  revealedFaults: string[];
}
```

### 4.2 Slices

O store é dividido por domínio e combinado em um único `create()`. Cada slice expõe **dados +
ações** que só alteram a própria fatia (exceto ações compostas explícitas, como `completeRepair`).

| Slice | Responsabilidade | Principais campos |
|---|---|---|
| `shopSlice` | identidade e progressão da loja | `shopName`, `level`, `reputation`, `day`, `upgrades[]` |
| `benchSlice` | bancada | `device`, `stage`, `selectedSlot`, `activeTask`, `taskProgress` |
| `inventorySlice` | estoque e peças | `stock: Record<partId, qty>`, `addStock`, `consumeStock` |
| `orderSlice` | fila de clientes | `queue: ServiceOrder[]`, `activeOrderId`, `completedOrders` |
| `economySlice` | dinheiro | `cash`, `ledger: Transaction[]`, `charge`, `credit` |
| `uiSlice` | estado efêmero de interface | `activePanel`, `dragPayload`, `toasts`, `paused` |

```ts
// src/store/index.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createShopSlice } from './slices/shopSlice';
// ...
import type { GameState } from './types';

export const useStore = create<GameState>()(
  persist(
    (...a) => ({
      ...createShopSlice(...a),
      ...createBenchSlice(...a),
      ...createInventorySlice(...a),
      ...createOrderSlice(...a),
      ...createEconomySlice(...a),
      ...createUiSlice(...a),
    }),
    {
      name: 'str-save',
      version: 1,
      partialize: (s) => ({
        shop: s.shop,
        bench: s.bench,
        inventory: s.inventory,
        orders: s.orders,
        economy: s.economy,
      }), // uiSlice NÃO é persistido
      migrate: (state, version) => migrations(version, state),
    },
  ),
);
```

### 4.3 Ações como “casos de uso”

Ações que cruzam slices vivem em `systems/` e são expostas pelo slice orquestrador, mantendo a
transação atômica do ponto de vista do React (uma única atualização):

```ts
completeRepair: () => {
  const { bench, orders, economy } = get();
  const order = orders.queue.find((o) => o.id === bench.device?.orderId);
  if (!order || !isValidRepair(bench.device, order)) return { ok: false, reason: 'invalid' };

  set((s) => ({
    economy: { ...s.economy, cash: s.economy.cash + order.payout },
    orders: { ...s.orders, completedOrders: [...s.orders.completedOrders, order] },
    bench: { ...s.bench, device: null, stage: 'idle' },
    shop: { ...s.shop, reputation: s.shop.reputation + order.reputationGain },
  }));
  return { ok: true, payout: order.payout };
},
```

Toda ação retorna `{ ok, reason? }` quando pode falhar — o HUD exibe toast a partir do retorno, sem
try/catch espalhado.

### 4.4 Selectors e performance

- Sempre seletores **estreitos**: `useStore((s) => s.economy.cash)`.
- Selectors derivados (ex.: total da fila, valor do estoque) em `selectors.ts`, memoizados por
  referência quando necessário.
- Valores que mudam a 60 fps (posição de ghost, hover) **não** entram no store reativo: usar refs
  locais + `useStore.subscribe` para leitura pontual.
- `shallow` do `zustand/shallow` para arrays/objetos derivados.

## 5. Fluxo principal (sequência)

```
Jogador        HUD (React)              Store (Zustand)            Cena (R3F)
   │ AcceptOrder ──► acceptOrder(orderId) ──► queue/bench atualizados
   │                                        │
   │                                        ├─► BenchPanel re-renderiza
   │                                        └─► <PcCase /> recebe orderId e monta slots
   │ Click "Diagnosticar" ► startDiagnosis() ──► stage='diagnosing'
   │                                        └─► useFrame anima LED + progresso via taskProgress
   │ Drag SSD do inventário ► setDragPayload() ──► <DropZone> raycast no plano
   │ Soltar no slot ────────► installPart()  ──► bench.device.slots.storage = ...
   │ Click "Finalizar" ─────► completeRepair() ──► cash + payout, rep +, bench=null
```

## 6. Renderização e performance

- `dpr={[1, 2]}` e `gl={{ antialias: true, powerPreference: 'high-performance' }}`.
- Um único Canvas; **nunca** montar/desmontar Canvas ao trocar de painel (custa contexto WebGL).
- Modelos `.glb` com Draco/meshopt; atlas de textura único por família; orçamento alvo:
  ≤ 60 draw calls, ≤ 150k tris na cena da bancada.
- `Suspense` por grupo de modelos, com fallback de placeholder low-poly.
- `frameloop="always"` no MVP (animações contínuas); avaliar `demand` + `invalidate()` na Fase 4.
- Materiais compartilhados em `components/3d/materials.ts` para evitar recompilação de shaders.
- `<AdaptiveDpr />` e `<PerformanceMonitor />` do Drei para máquinas fracas.

## 7. Conteúdo data-driven

Novos reparos, peças e dispositivos entram sem tocar em componentes:

```ts
// src/models/partCatalog.ts
export const PART_CATALOG = {
  'ssd-500': {
    id: 'ssd-500', name: 'SSD NVMe 500 GB', slot: 'storage',
    kind: 'ssd', cost: 180, price: 260, compatibleWith: ['desktop-atx', 'laptop-15'],
    modelAsset: '/models/parts/ssd-nvme.glb',
  },
} satisfies Record<string, PartDefinition>;
```

`orderGenerator.ts` consome `serviceTemplates` + `devices` e usa **RNG com seed** (mulberry32),
garantindo filas reproduzíveis em testes e debugging.

## 8. Persistência

- `zustand/persist` + `version` + `migrate`.
- Salvar em transições relevantes (`onRehydrateStorage` para recalcular derivados).
- Nunca persistir referências a objetos Three.js, timers ou funções.
- `localStorage` no MVP; interface `SaveAdapter` em `systems/persistence.ts` para trocar por
  IndexedDB/backend sem alterar slices.

## 9. Convenções

- TypeScript `strict`; sem `any` em `store/` e `systems/`.
- Nomes de arquivos em PascalCase para componentes, camelCase para módulos.
- Ações do store no imperativo (`acceptOrder`, `removeScrew`), campos no substantivo.
- Constantes mágicas de gameplay só em `models/balance.ts`.
- Cada slice tem teste unitário em `*.test.ts` (Vitest) cobrindo caminhos felizes e falhas.

## 10. Setup

```bash
pnpm create vite@latest . --template react-ts
pnpm add three @react-three/fiber @react-three/drei zustand
pnpm add -D tailwindcss @tailwindcss/vite vitest @types/three
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
```
