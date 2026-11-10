# Branding & Design System — Simulator Tech Repair

> Direção de arte da **interface (HUD)**. A cena 3D tem iluminação própria (oficina quente e neutra);
> a UI deve parecer um software profissional rodando por cima dela.

## 1. Posicionamento visual

**Conceito:** “o sistema operacional da sua assistência técnica”.

O jogador está operando um painel de gestão, não um brinquedo. A referência não é jogo mobile
infantil, e sim dashboards SaaS premium: Linear, Stripe, Vercel, Raycast, Figma.

| É | Não é |
|---|---|
| Flat, limpo, denso em informação | Skeuomorfismo, madeira, papel, couro |
| Cantos discretos, bordas de 1px | Bordas grossas, sombras pesadas, bevel |
| Azul como acento cirúrgico | Arco-íris de cores, gradientes vistosos |
| Tipografia geométrica com hierarquia clara | Fontes display, comic, serifadas |
| Microanimações rápidas (120–200 ms) | Bounce, elástico, confete |

**Pilares:** clareza > decoração · densidade controlada · contraste alto · consistência obsessiva.

## 2. Paleta de cores

Base **dark navy** (não preto puro) + **bright blue** de ação. Superfícies se diferenciam por
luminosidade, não por cor.

### 2.1 Tokens

| Token | Hex | Uso |
|---|---|---|
| `bg-base` | `#070D17` | fundo do app / scrim atrás da cena |
| `bg-surface` | `#0E1728` | painéis principais |
| `bg-elevated` | `#152238` | cards, modais, dropdowns |
| `bg-inset` | `#0A1322` | inputs, slots de inventário |
| `border-subtle` | `#1E2E47` | divisórias e contornos padrão |
| `border-strong` | `#2B3F5E` | foco estrutural, hover de card |
| `primary` | `#2E7BFF` | botão de ação, seleção, links |
| `primary-hover` | `#4A8FFF` | hover |
| `primary-pressed` | `#1F63D6` | active |
| `primary-soft` | `rgba(46,123,255,0.12)` | fundo de badge/estado selecionado |
| `text-primary` | `#E8EEF9` | títulos e valores |
| `text-secondary` | `#A9B8CE` | corpo de texto |
| `text-muted` | `#6F819B` | labels, metadados |
| `success` | `#2ED47A` | pagamento recebido, reparo OK |
| `warning` | `#F5A524` | prazo apertado, peça desgastada |
| `danger` | `#FF5A5F` | prejuízo, ação destrutiva |
| `info` | `#38BDF8` | dicas, diagnóstico |

Regras:
- Azul brilhante é **ação/seleção**, nunca decoração de fundo em área grande.
- Vermelho só para consequência negativa real (multa, peça quebrada, recusa de ordem).
- Nunca usar `#000` ou `#FFF` puros em superfícies.
- Máximo de **uma** cor de destaque por tela além do azul.

### 2.2 Tokens em Tailwind v4

```css
/* src/styles/index.css */
@import "tailwindcss";

@theme {
  --color-base: #070d17;
  --color-surface: #0e1728;
  --color-elevated: #152238;
  --color-inset: #0a1322;

  --color-line: #1e2e47;
  --color-line-strong: #2b3f5e;

  --color-brand: #2e7bff;
  --color-brand-hover: #4a8fff;
  --color-brand-pressed: #1f63d6;
  --color-brand-soft: rgb(46 123 255 / 0.12);

  --color-ink: #e8eef9;
  --color-ink-soft: #a9b8ce;
  --color-ink-muted: #6f819b;

  --color-ok: #2ed47a;
  --color-warn: #f5a524;
  --color-bad: #ff5a5f;
  --color-info: #38bdf8;

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --radius-panel: 10px;
  --radius-control: 8px;
  --shadow-panel: 0 8px 24px rgb(0 0 0 / 0.35);
  --ease-out-ui: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

> Em Tailwind v3, o equivalente vai em `tailwind.config.ts > theme.extend` com os mesmos nomes.

## 3. Tipografia

**Família:** Inter (fallback: system-ui). Alternativa de marca para títulos: Plus Jakarta Sans.
**Nunca** usar fonte display/condensada no HUD. Números monetários e contadores usam
`font-variant-numeric: tabular-nums` para não “pular” ao atualizar.

| Papel | Tamanho / linha | Peso | Classes |
|---|---|---|---|
| Display (valor de caixa) | 32 / 36 | 600 | `text-[32px] leading-9 font-semibold tracking-[-0.02em]` |
| Título de painel | 20 / 28 | 600 | `text-xl font-semibold tracking-[-0.01em]` |
| Título de seção | 16 / 24 | 600 | `text-base font-semibold` |
| Corpo | 14 / 20 | 400–500 | `text-sm` |
| Label / metadado | 12 / 16 | 500 | `text-xs text-ink-muted uppercase tracking-[0.06em]` |
| Micro (badge) | 11 / 14 | 600 | `text-[11px] font-semibold` |

Hierarquia: no máximo 3 níveis visíveis por painel. Rótulos em caixa alta apenas para categorias,
nunca para frases inteiras.

## 4. Espaçamento, raio e elevação

- Grid base **4 px**; espaçamentos usuais: 4, 8, 12, 16, 24, 32.
- Padding de painel: 16 px; gap entre cards: 12 px; altura de linha de lista: 44–48 px.
- Raios: controles 8 px, painéis 10 px, badges 6 px, pílulas 999 px. **Nada acima de 12 px** em
  containers grandes (evita ar lúdico).
- Elevação: apenas 2 níveis.
  - `shadow-panel` para painéis flutuantes/modais.
  - `ring-1 ring-line` para separar superfícies sem sombra (padrão em HUD fixo).
- Sem sombras coloridas, sem glow. Exceção única: `ring-brand/40` em elemento selecionado.

## 5. Componentes

### 5.1 Botões

| Variante | Fundo | Texto | Uso |
|---|---|---|---|
| Primary | `bg-brand` | branco | ação principal da tela (1 por contexto) |
| Secondary | `bg-elevated` + `ring-line` | `text-primary` | ações neutras |
| Ghost | transparente | `text-secondary` | ações terciárias, ícones |
| Danger | `bg-bad/10` + `text-bad` | vermelho | descartar peça, cancelar ordem |
| Disabled | `bg-elevated/50` | `text-muted` | sem hover, `cursor-not-allowed` |

```tsx
// components/ui/primitives/Button.tsx (referência de estilo)
const base =
  'inline-flex h-9 items-center justify-center gap-2 rounded-control px-3.5 ' +
  'text-sm font-semibold transition-colors duration-150 ease-out-ui ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';
const variants = {
  primary: 'bg-brand text-white hover:bg-brand-hover active:bg-brand-pressed',
  secondary: 'bg-elevated text-ink ring-1 ring-line hover:ring-line-strong',
  ghost: 'text-ink-soft hover:bg-white/5 hover:text-ink',
  danger: 'bg-bad/10 text-bad ring-1 ring-bad/30 hover:bg-bad/15',
};
```

Alturas: 36 px (padrão), 32 px (compacto em listas), 44 px (CTA de modal). Ícone 16 px, gap 8 px.

### 5.2 Painéis e cards

```html
<section class="rounded-panel bg-surface ring-1 ring-line shadow-panel">
  <header class="flex items-center justify-between border-b border-line px-4 py-3">
    <h2 class="text-sm font-semibold text-ink">Fila de clientes</h2>
    <span class="rounded-md bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand">3</span>
  </header>
  <div class="p-4">…</div>
</section>
```

- Card de ordem de serviço: `bg-elevated`, hover eleva o ring para `line-strong` (sem mover).
- Selecionado: `ring-brand/60` + `bg-brand-soft/40`.
- Nunca aninhar mais de 2 níveis de superfície.

### 5.3 Badges de status

| Status | Estilo |
|---|---|
| Aguardando | `bg-white/5 text-ink-muted` |
| Em diagnóstico | `bg-info/10 text-info` |
| Em reparo | `bg-warn/10 text-warn` |
| Pronto | `bg-ok/10 text-ok` |
| Atrasado | `bg-bad/10 text-bad` |

Formato: pílula 6 px, 11 px semibold, com ponto de 6 px à esquerda quando indicar estado ao vivo.

### 5.4 Inventário (slots)

- Slot 56×56 px, `rounded-control`, `bg-inset`, `ring-1 ring-line`.
- Hover: `ring-line-strong`; válido para drop: `ring-brand` + `bg-brand-soft`.
- Inválido: `ring-bad/60`, cursor `not-allowed`.
- Quantidade no canto inferior direito em `11px font-semibold text-ink`.
- Arrastando: original fica em `opacity-40`; ghost segue o cursor com `scale-105` e sombra de painel.

### 5.5 Progresso e feedback

- Barra de reparo: 6 px de altura, trilho `bg-inset`, preenchimento `bg-brand`, transição de 200 ms
  linear (não animar com easing em progresso contínuo).
- Toast: canto inferior direito, `bg-elevated`, borda esquerda 2 px na cor semântica, auto-dismiss
  em 4 s, máximo 3 simultâneos.
- Modal: scrim `bg-base/70 backdrop-blur-[2px]`, painel 480 px, fecha com Esc.

## 6. Iconografia

- **Lucide React**, stroke 1.75, tamanho 16/20/24.
- Ícones sempre acompanhados de label em ações destrutivas.
- Mapeamento: `Wallet` (caixa), `Package` (estoque), `Wrench` (bancada), `Users` (recepção),
  `Cpu`/`MemoryStick`/`HardDrive` (peças), `CheckCircle2` (pronto), `Clock` (prazo).

## 7. Movimento

| Token | Valor | Uso |
|---|---|---|
| `fast` | 120 ms | hover, mudança de cor |
| `base` | 180 ms | abrir/fechar painel, toast |
| `slow` | 260 ms | modal, transição de tela |

- Easing padrão `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Animar apenas `opacity` e `transform`. Nunca largura/altura em listas.
- Respeitar `prefers-reduced-motion: reduce` (desligar slides e ghost animado).
- A cena 3D pode ter animações mais longas (câmera 400–600 ms); o HUD não.

## 8. Relação HUD × cena 3D

- O HUD usa painéis opacos (`bg-surface` ≥ 92% de opacidade). Não usar vidro fosco sobre a cena
  inteira — quebra a leitura dos textos.
- Scrim radial sutil nos cantos da tela para separar HUD do cenário claro.
- Luz da oficina: key light neutra (5600 K) + fill azulado frio; o azul da UI não deve competir com
  o azul da cena — a cena é dessaturada, a UI é o único elemento saturado.
- Labels 3D (Drei `<Html>`) usam `bg-elevated/95`, 11 px, `rounded-md`, `ring-line`.

## 9. Acessibilidade

- Contraste mínimo AA: `text-ink` sobre `surface` = 13:1; `text-ink-soft` = 7:1; `brand` sobre
  `surface` = 4.6:1 (ok para texto ≥ 14 px semibold e ícones).
- Foco visível obrigatório: `ring-2 ring-brand/60 ring-offset-2 ring-offset-surface`.
- Estados nunca só por cor: sempre ícone, texto ou forma.
- Alvos de clique ≥ 32×32 px; ações destrutivas com confirmação.

## 10. Do / Don't

| Do | Don't |
|---|---|
| Usar azul só no que é acionável | Pintar headers inteiros de azul |
| Uma ação primária por painel | Dois botões primários lado a lado |
| Números tabulares em valores | Deixar o caixa “tremer” ao atualizar |
| Ícones 16 px alinhados ao texto | Ícones gigantes decorativos |
| Bordas de 1 px | Bordas de 2–3 px coloridas |
| Densidade com respiro de 8/12 px | Cards enormes com muito vazio |

## 11. Checklist de revisão de UI

- [ ] A tela parece um produto, não um jogo mobile?
- [ ] Existe apenas uma ação primária visível?
- [ ] Todos os estados (hover/focus/disabled/loading) estão definidos?
- [ ] Valores monetários usam tabular-nums e formatação `R$ 1.234,56`?
- [ ] Contraste AA validado nos textos sobre `surface` e `elevated`?
- [ ] A cena 3D continua legível com o HUD aberto em 1280×720?
