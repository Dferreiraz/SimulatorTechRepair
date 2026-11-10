# GDD Core — Simulator Tech Repair

> Documento de design do loop principal. Complementa `requisitos.md` (o que construir) e
> `arquitetura.md` (como construir).

## 1. High concept

**“Conserte, cobre, cresça.”** Você é o técnico e dono de uma assistência de computadores. Cada
cliente traz um problema; cada reparo é uma sequência tátil de abrir, diagnosticar, trocar e testar.
O dinheiro paga peças melhores, e peças melhores destravam clientes mais exigentes.

- **Gênero:** simulação de gestão com minigames de manutenção em 3D.
- **Plataforma:** web desktop (mouse + teclado).
- **Sessão-alvo:** 12–20 min (≈ 2 dias de jogo).
- **Fantasia:** competência técnica reconhecida — o cliente sai feliz e o caixa fecha no azul.
- **Loop emocional:** tensão do diagnóstico → satisfação do encaixe → alívio do pagamento.

## 2. Pilares de design

1. **Tato digital.** Toda ação importante é física: pegar, girar, encaixar, limpar. Nada de “clique
   em OK para reparar”.
2. **Decisão econômica curta.** Cada ordem é uma aposta de 2–4 minutos: vale o prazo e o custo da
   peça?
3. **Legibilidade acima de realismo.** O jogo parece uma oficina real, mas o HUD é um painel
   profissional que nunca deixa o jogador perdido.

## 3. Core Loop

```
        ┌──────────────────────────────────────────────────────────────┐
        │                        DIA DE JOGO (8 min)                   │
        │                                                              │
        │  ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌─────────┐ │
        │  │ RECEPÇÃO  │──►│  BANCADA  │──►│ CONSERTO  │──►│PAGAMENTO│ │
        │  │  ~40 s    │   │  ~30 s    │   │ 2–4 min   │   │  ~15 s  │ │
        │  └───────────┘   └───────────┘   └───────────┘   └────┬────┘ │
        │        ▲                                              │      │
        │        │            ┌──────────────────┐              │      │
        │        └────────────│ EVOLUÇÃO DA LOJA │◄─────────────┘      │
        │                     │ comprar peças,   │                     │
        │                     │ upgrades, reput. │                     │
        │                     └──────────────────┘                     │
        └──────────────────────────────────────────────────────────────┘
```

**Micro-loop (30–60 s):** selecionar peça → posicionar → validar → feedback (snap + som) → próximo
slot. É o que o jogador repete dezenas de vezes; precisa ser curto e gostoso.

**Macro-loop (dia):** aceitar 1–3 ordens → executar → devolver → fechar o dia com resumo financeiro
→ reinvestir.

## 4. Etapas do loop

### 4.1 Recepção (~40 s)

- Fila de 3–5 cartões de ordem. Cada cartão: cliente, aparelho, sintoma em linguagem leiga
  (“travando ao abrir o navegador”), prazo, pagamento e exigência (ex.: “mín. 16 GB RAM”).
- O sintoma **não** revela a falha real: o diagnóstico na bancada é necessário.
- Decisão: aceitar (ocupa a bancada), recusar (perde 1 de reputação, no máximo 1×/dia) ou
  “pedir para aguardar” (P2).
- Tensão: aceitar uma ordem cara demais em peças pode dar prejuízo.

### 4.2 Bancada e diagnóstico (~30 s)

- O dispositivo aparece na bancada; câmera faz um push-in de 500 ms.
- Botão “Diagnosticar” inicia uma varredura de 8 s com barra e som de ventoinha. Resultado revela
  1–3 falhas (ex.: `dust`, `storage_failing`, `ram_insufficient`, `no_os`).
- O jogador pode pular o diagnóstico e tentar adivinhar — mais rápido, maior risco de retrabalho.

### 4.3 Conserto (2–4 min)

Sequência genérica, adaptada por modelo:

1. **Abrir** — remover 4–6 parafusos clicáveis (cada um: 1 clique = 250 ms de parafusadeira).
2. **Limpar** — arrastar a escova sobre as 3–4 zonas empoeiradas; `dust` cai por zona.
3. **Substituir** — arrastar peças do inventário para o slot correto.
4. **Instalar SO** — pendrive + 5 s de progresso com etapas (particionar, copiar, configurar).
5. **Fechar e testar** — recolocar parafusos, botão “Testar”; falhas restantes aparecem como erro.

Erros comuns e consequência:

| Erro | Consequência |
|---|---|
| Fechar sem parafusos | Teste falha, precisa reabrir |
| Peça incompatível | Encaixe recusado (sem custo) |
| Esquecer limpeza | Teste passa, mas gorjeta cai 30% |
| Instalar SO sem armazenamento válido | Progresso falha em 50%, retrabalho |

### 4.4 Pagamento (~15 s)

- Tela de fatura: valor base + bônus de prazo + gorjeta (reputação) − custo de peças = lucro.
- Botão “Receber” anima o caixa e atualiza a reputação.
- Feedback: som de caixa registradora, toast verde com lucro, cliente agradecendo.

### 4.5 Evolução da loja

- Comprar estoque (peças mais baratas em lote — P2), upgrades de bancada (mais slots, luz melhor) e
  ferramentas (escova melhor, parafusadeira elétrica que remove 2 parafusos por clique).
- Reputação desbloqueia ordens com pagamentos maiores e prazos mais generosos.
- Sem árvore de skills no MVP: progressão = equipamento + reputação.

## 5. Interação com mouse na cena 3D

### 5.1 Mapa de entrada

| Entrada | Ação | Regras |
|---|---|---|
| **Arrastar LMB em área vazia** | Orbitar câmera | Só quando o ponteiro não está sobre peça interativa; limite de 60° vertical, 360° horizontal |
| **Scroll** | Zoom | Distância 1,2 m–4,0 m, com clamp e suavização |
| **Arrastar RMB / MMB** | Pan | Limitado a ±0,8 m do centro da bancada; desabilitado durante drag de peça |
| **Duplo clique em peça** | Focar câmera na peça | Lerp de 450 ms; duplo clique no fundo reseta o enquadramento |
| **Hover** | Outline + tooltip | Nome, estado e slot; custo zero, sem clique |
| **Clique LMB em peça** | Selecionar | Highlight persistente + ações contextuais no `BenchPanel` |
| **Clique em parafuso** | Remover/instalar | Animação de 250 ms; sem minigame de precisão no MVP |
| **Arrastar do inventário → 3D** | Instalar peça | Ghost segue o cursor; slot válido acende em azul |
| **Arrastar peça instalada → fora** | Remover | Retorna ao estoque se `condition ≥ 60` |
| **Esc** | Cancelar drag / desselecionar | Prioridade: drag > seleção > painel |
| **Clique com botão direito em peça** | Menu contextual (P1) | “Remover”, “Informações” |

### 5.2 Estados da interação

```
 idle ──hover──► hover ──click──► selected ──drag──► dragging ──release──► validating
   ▲               │                  │                  │                     │
   └──leave────────┘                  └──Esc─────────────┴──invalid──► idle ◄──┘
```

- **dragging**: `OrbitControls` desabilitado; cursor `grabbing`; peça original em 40% de opacidade.
- **validating**: dura ~120 ms; slot pisca (ok = azul, inválido = vermelho) e a peça faz snap.
- Hover e ghost **não** passam pelo store reativo (refs + `subscribe`) para não re-renderizar o HUD.

### 5.3 Drag & drop HUD → 3D (especificação)

1. `pointerdown` no slot do inventário → `beginDrag(partId)` em `uiSlice`; captura do ponteiro.
2. Camada DOM transparente acompanha o cursor com um “chip” da peça (ícone + nome).
3. `pointermove` → a cena converte coordenadas de tela em raio e intersecta o plano da bancada;
   o slot mais próximo dentro de 12 cm é destacado.
4. `pointerup` sobre slot válido → `installPart(slot, partId)`; `consumeStock(partId)`.
5. `pointerup` fora → cancela sem custo e dispara toast “Solte sobre um slot compatível”.

Feedback obrigatório: outline no slot alvo, preview semitransparente da peça, som de encaixe e
micro-shake de 3 px na câmera (200 ms) na confirmação.

### 5.4 Câmera

- Órbita ao redor do centro da bancada (target fixo, `y = 0,9 m`), campo de visão 45°.
- Colisão simples: não atravessar parede do fundo nem o tampo da bancada.
- Nunca mover a câmera automaticamente durante um drag (evita enjoo e erro de mira).
- `prefers-reduced-motion`: substituir lerps por cortes.

## 6. Economia do MVP

| Item | Valor |
|---|---|
| Caixa inicial | R$ 1.500 |
| Aluguel por dia | R$ 120 |
| Reparo simples (limpeza) | paga R$ 80–120 |
| Troca de armazenamento | custa R$ 180 (SSD) · paga R$ 320–380 |
| Upgrade de RAM | custa R$ 90 (8 GB) · paga R$ 180–220 |
| Instalação de SO | custa R$ 0 (pendrive próprio) · paga R$ 100–150 |
| Bônus de prazo | +15% se entregue antes de 70% do prazo |
| Gorjeta | +0–10% conforme reputação (a cada 20 pts) |

**Alvo de balanceamento:** o jogador deve terminar o dia 1 com R$ 1.700–1.900 (lucro modesta) e
conseguir comprar 2 peças no dia 2. Prejuízo é possível, mas não deve ocorrer nas 3 primeiras ordens
(tutorial).

## 7. Progressão

| Reputação | Desbloqueia |
|---|---|
| 0–29 | Ordens básicas (limpeza, SO) |
| 30–59 | Troca de armazenamento, RAM |
| 60–79 | Ordens urgentes (bônus alto, prazo curto) |
| 80–100 | Clientes premium, pagamentos +40% |

Ferramentas: escova (inicial) → escova antiestática (limpeza 2× mais rápida) → parafusadeira
elétrica (remove parafusos em 1 clique).

## 8. Falha, tensão e recuperação

- Não há “game over”. A pressão vem de prazo, caixa e reputação.
- Dívida: caixa negativo bloqueia compras; o jogador precisa aceitar ordens baratas para sair.
- Peça danificada por erro (ex.: instalar SO sem armazenamento) gera custo de reposição — punição
  leve e compreensível.
- O jogo **nunca** pune por exploração da câmera ou por clicar errado em área vazia.

## 9. Conteúdo do MVP

- 3 modelos de desktop + 1 notebook (visual simplificado).
- 10 peças, 4 tipos de falha, 6 templates de ordem.
- 1 ambiente (oficina), 8 min por dia, 5 dias por “semana” de jogo.
- 3 ordens de tutorial roteirizadas.

## 10. Métricas de sucesso (playtest)

| Métrica | Meta |
|---|---|
| Tempo até o primeiro pagamento | ≤ 5 min |
| Conclusão do tutorial sem ajuda externa | ≥ 80% dos testadores |
| Tempo médio de reparo após prática | 2–3 min |
| Intenção de jogar mais uma sessão | ≥ 70% |
| Confusão relatada (“não sabia o que fazer”) | ≤ 10% |

## 11. Riscos de design

| Risco | Mitigação |
|---|---|
| Drag & drop 3D frustrante | Área de drop generosa (12 cm), snap magnético, preview claro |
| Câmera causando desorientação | Target fixo, limites de órbita, reset por duplo clique |
| Repetição do reparo ficar tediosa | Micro-feedback forte, variação de falhas, upgrades que aceleram |
| HUD competir com a cena | Paleta escura opaca, cena dessaturada, um único azul de ação |
| Escopo 3D estourar o tempo | Assets low-poly com estilo limpo; um ambiente só no MVP |
