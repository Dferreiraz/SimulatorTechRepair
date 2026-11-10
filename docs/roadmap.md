# Roadmap — Simulator Tech Repair

> Premissa: **1 dev (full-stack/frontend) em meio período**, ≈ 20 h/semana, escopo do MVP fechado em
> `requisitos.md`. Duração total estimada: **8 semanas** (com buffer de 1 semana embutido na Fase 4).
> Cada fase termina com um **build jogável** e um demo de 2 minutos.

## Visão geral

| Fase | Tema | Duração | Marco |
|---|---|---|---|
| 0 | Setup, documentação, boilerplate | Semana 1 | Projeto roda `pnpm dev` com Canvas vazio + HUD shell |
| 1 | Cena 3D da bancada e câmera | Semana 2 | Computador montado visível, órbita e zoom funcionando |
| 2 | HUD, Zustand e core loop mínimo | Semanas 3–4 | Aceitar ordem → devolver → receber pagamento |
| 3 | Interação 3D (peças) | Semanas 5–6 | Desmontar, limpar, trocar SSD/RAM, instalar SO |
| 4 | Economia, upgrades e polimento | Semanas 7–8 | Loop completo com save, áudio e partículas |

```
Semana  1     2     3     4     5     6     7     8
Fase    [0]───[1]───[2────────]───[3────────]───[4────────]
Demo    M0    M1    ────M2──────  ────M3──────  ────M4 (MVP)
```

---

## Fase 0 — Setup, documentação e boilerplate (Semana 1)

**Objetivo:** eliminar atrito técnico. Nenhuma linha de gameplay nesta fase.

### Entregáveis

- Repositório inicializado com `pnpm`, Vite + React + TypeScript (`strict`).
- Tailwind CSS v4 configurado com os tokens de `branding.md` (`@theme`).
- ESLint, Prettier, Vitest, alias `@/` e `.editorconfig`.
- Estrutura de pastas de `arquitetura.md` criada (pastas vazias com `.gitkeep`).
- `<Canvas>` renderizando um cubo de teste + HUD overlay com 1 painel usando os tokens.
- Documentação commitada: `arquitetura.md`, `branding.md`, `requisitos.md`, `gdd-core.md`, `roadmap.md`.

### Tarefas

- [ ] `pnpm create vite@latest . --template react-ts`
- [ ] Instalar `three`, `@react-three/fiber`, `@react-three/drei`, `zustand`, `lucide-react`
- [ ] Configurar `@tailwindcss/vite` + `styles/index.css` com tokens
- [ ] Criar `Button`, `Card`, `Badge` em `components/ui/primitives`
- [ ] Criar skeleton do store com slices vazias e `persist` desligado
- [ ] Configurar Vitest + teste trivial de um slice
- [ ] Definir convenções de commit (Conventional Commits) e branch (`main` + `feat/*`)
- [ ] Deploy contínuo (Vercel/Netlify) do build estático — preview por PR

### Definição de Pronto

- [ ] `pnpm dev`, `pnpm build` e `pnpm test` passam limpos.
- [ ] Nenhum warning de TypeScript ou de console no primeiro load.
- [ ] Lighthouse de performance ≥ 90 na página vazia.

---

## Fase 1 — Cena 3D base e câmera (Semana 2)

**Objetivo:** provar que a bancada é legível e gostosa de explorar.

### Entregáveis

- Oficina low-poly: bancada, parede, iluminação (key/fill/rim) e fundo.
- Gabinete desktop montado com peças separadas (carcaça, lateral, placa-mãe, RAM, SSD, GPU, cooler).
- `OrbitControls` com limites, zoom e pan configurados conforme `gdd-core.md` §5.
- Enquadramento inicial com push-in suave; duplo clique reseta câmera.
- HUD mínimo: topo com caixa e botão “Configurações” (sem lógica).

### Tarefas

- [ ] Modelar/baixar assets `.glb` (orçamento: ≤ 150k tris, ≤ 60 draw calls)
- [ ] `WorkshopScene.tsx` com `Environment`, `ContactShadows` e `AdaptiveDpr`
- [ ] Componentes `PcCase`, `Motherboard`, `RamStick`, `SsdDrive` com slots nomeados
- [ ] Materiais compartilhados em `materials.ts` (evitar recompilar shaders)
- [ ] `CameraRig` com limites de órbita/zoom e `focusOn(partId)`
- [ ] Fallback de carregamento (`Suspense` + placeholder) e aviso de WebGL2 ausente
- [ ] Teste de performance em GPU integrada (30 fps mínimo em modo baixo)

### Definição de Pronto

- [ ] Cena estável a 60 fps em 1080p (máquina de referência) e ≥ 30 fps em modo baixo.
- [ ] Câmera nunca atravessa a bancada ou a parede.
- [ ] Build gzip inicial ≤ 1,5 MB (assets 3D fora do bundle JS).

**Demo M1:** girar a bancada, dar zoom no gabinete, focar uma peça.

---

## Fase 2 — HUD, Zustand e core loop mínimo (Semanas 3–4)

**Objetivo:** fechar o loop econômico com ações “abstratas” (sem manipulação 3D ainda).

### Entregáveis

- Store completo com 6 slices tipadas, ações com retorno `{ ok, reason }` e autosave versionado.
- Fila de recepção com 3 ordens de tutorial + gerador procedural com seed.
- Painel de bancada: diagnóstico com timer, lista de falhas e botão “Finalizar reparo”
  (conclusão automática válida nesta fase).
- Financeiro: caixa, pagamento, extrato e aluguel diário.
- Toasts, modal de pausa e ciclo de dia (8 min) com resumo.
- Tutorial contextual com highlights.

### Tarefas

- [ ] `store/types.ts` + slices `shop`, `bench`, `order`, `inventory`, `economy`, `ui`
- [ ] `orderGenerator.ts` com mulberry32 + `serviceTemplates`
- [ ] `completeRepair()` transacional (validação + pagamento + reputação)
- [ ] Componentes `OrderCard`, `OrderQueue`, `BenchPanel`, `TopBar`, `CashDisplay`
- [ ] `Modal`, `Toast`, `TutorialHint`
- [ ] Persistência com `version` + `migrate` e teste de save corrompido
- [ ] Testes: aceitar ordem, concluir, recusar, comprar peça, dia sem saldo

### Definição de Pronto

- [ ] Loop completo sem tocar em 3D: aceitar → concluir → receber → comprar → próximo dia.
- [ ] Reload restaura caixa, fila e dia corretamente.
- [ ] Cobertura de testes ≥ 70% em `store/` e `systems/`.
- [ ] Nenhum valor monetário formatado fora de `lib/format.ts`.

**Demo M2:** jogar 2 ordens inteiras e fechar o dia com resumo financeiro.

---

## Fase 3 — Interação 3D (Semanas 5–6)

**Objetivo:** transformar o loop abstrato em trabalho manual satisfatório.

### Entregáveis

- Picking com hover/outline, seleção e tooltip de peça.
- Remoção e instalação de parafusos com animação e som.
- Drag & drop HUD → 3D com ghost, highlight de slot e validação de compatibilidade.
- Tarefas: limpeza com escova, troca de armazenamento, upgrade de RAM, instalação de SO.
- Regras de remontagem: fechar gabinete, testar e devolver.
- Bloqueios de ação inválida com feedback (toast + shake + som de erro).

### Tarefas

- [ ] `useHoverPart` (ref + subscribe, sem re-render do HUD)
- [ ] `usePointerDrag` e camada de drag em DOM
- [ ] `DropZone` com raycast no plano da bancada e snap de 12 cm
- [ ] `Screw`, `PanelRemoval`, `PartSlot` componentes interativos
- [ ] `BrushTool` + partículas de sujeira (shader simples ou sprites)
- [ ] `OsInstallTask` com etapas e progresso
- [ ] `repairRules.ts` + testes de validação (peça errada, slot ocupado, parafusos pendentes)
- [ ] Desabilitar `OrbitControls` durante drag e ajustar cursor por estado
- [ ] Teste de usabilidade com 3 pessoas (tempo até instalar o primeiro SSD)

### Definição de Pronto

- [ ] Um jogador novo instala um SSD sem instrução em ≤ 60 s.
- [ ] Nenhuma ação inválida ocorre silenciosamente.
- [ ] 60 fps mantidos com drag ativo e partículas.
- [ ] `Esc` cancela qualquer interação em andamento.

**Demo M3:** reparo completo manual — abrir, limpar, trocar SSD, instalar SO, fechar e testar.

---

## Fase 4 — Economia, upgrades e polimento (Semanas 7–8)

**Objetivo:** dar textura, som e progressão. Congelar features na metade da semana 8.

### Entregáveis

- Loja de peças com catálogo, compra em lote e estoque visual.
- Upgrades: ferramentas (escova melhor, parafusadeira) e bancada (iluminação).
- Reputação com desbloqueios e ordens premium.
- Áudio: loop ambiente, SFX de clique/parafusadeira/encaixe/caixa, mute no pause.
- Polimento visual: poeira, brilho de peça nova, transições de câmera, vignette.
- Balanceamento final + 5 playtests.
- Otimização: `PerformanceMonitor`, qualidade gráfica, lazy loading de modelos.

### Tarefas

- [ ] `ShopPanel` + `buyPart()` com confirmação e feedback de saldo
- [ ] Upgrades em `shopSlice` com efeito real (tempo de limpeza, cliques por parafuso)
- [ ] Camada de áudio com `Howler`/`Audio` + volume no settings
- [ ] Partículas e decals de sujeira otimizados (instancing)
- [ ] Ajustar curvas de preço/prazo com dados dos playtests
- [ ] Acessibilidade: foco, contraste, `prefers-reduced-motion`
- [ ] Checklist de release: build, save migration, Safari/Firefox, 1280×720

### Definição de Pronto

- [ ] 5 testadores completam 3 dias de jogo sem travar.
- [ ] Save de versões anteriores migra sem perda.
- [ ] Nenhum erro no console em 30 min de sessão contínua.
- [ ] Build final publicado com URL de preview.

**Demo M4 (MVP):** sessão completa de 15 min, do primeiro cliente ao upgrade da bancada.

---

## Backlog pós-MVP (não estimado)

| Item | Valor |
|---|---|
| Dispositivos móveis (celulares/tablets) | Amplia o fantasy do título |
| Funcionários e delegação de tarefas | Escala a gestão |
| Backend + ranking + saves na nuvem | Retenção e comparação social |
| Expansão física da loja e decoração | Personalização |
| Clientes recorrentes e narrativa leve | Apego emocional |
| Suporte a touch/gamepad | Novo público |
| Loja de usados (comprar/vender peças) | Profundidade econômica |

## Riscos do cronograma

| Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|
| Assets 3D atrasarem | Alta | Alto | Começar Fase 1 com primitivas; trocar modelos depois sem mudar lógica |
| Drag & drop consumir a Fase 3 inteira | Média | Alto | Protótipo descartável na semana 3; fallback “clique para instalar” |
| Escopo de UI crescer | Alta | Médio | Biblioteca de primitives fechada na Fase 0; nada de tela nova sem requisito |
| Performance em notebooks | Média | Médio | Modo baixo desde a Fase 1; budget de draw calls monitorado |
| Balanceamento deixar o jogo trivial | Média | Médio | Playtest semanal a partir da Fase 2, não só no fim |

## Ritual de acompanhamento

- **Semanal:** demo de 2 min + atualização deste roadmap.
- **Por fase:** revisão contra a Definição de Pronto de `requisitos.md`.
- **Regra de corte:** se uma tarefa P1 atrasar a fase em > 2 dias, ela vai para o backlog pós-MVP.
