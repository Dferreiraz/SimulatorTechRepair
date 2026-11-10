# Requisitos — MVP · Simulator Tech Repair

> Escopo fechado do MVP. Prioridade: **P0** = obrigatório para lançar · **P1** = desejável ·
> **P2** = só se sobrar tempo. Referência de arquitetura: `arquitetura.md`.

## 1. Objetivo do MVP

Validar o core loop completo em uma única sessão de 10–20 minutos: o jogador recebe um cliente,
diagnostica, executa um reparo simples na bancada 3D, recebe o pagamento e reinveste o lucro. O MVP
deve ser divertido **sem** progressão longa, sem multiplayer e sem backend.

**Persona:** jogador de simulação/gestão (PowerWash Simulator, PC Building Simulator, Game Dev
Story), 16–35 anos, sessões curtas, joga no desktop com mouse.

## 2. Requisitos funcionais

### 2.1 Recepção e ordens de serviço (RF-REC)

| ID | Requisito | Prioridade |
|---|---|---|
| RF-REC-01 | Gerar ordens de serviço procedurais (cliente, dispositivo, sintoma, prazo, pagamento) a partir de templates e RNG com seed. | P0 |
| RF-REC-02 | Exibir fila com no máximo 5 ordens simultâneas; novas ordens entram ao longo do dia. | P0 |
| RF-REC-03 | Cada ordem mostra: nome do cliente, modelo do aparelho, sintoma relatado, prazo (em horas de jogo), pagamento estimado e reputação envolvida. | P0 |
| RF-REC-04 | Aceitar ordem → move o dispositivo para a bancada e abre o painel de bancada. | P0 |
| RF-REC-05 | Recusar ordem → remove da fila com pequena perda de reputação (máx. 1 por dia). | P1 |
| RF-REC-06 | Prazo vencido → multa/penalidade de reputação ao devolver. | P1 |
| RF-REC-07 | Cliente retorna ao final do dia se o aparelho não foi devolvido (aviso, sem novo sistema). | P1 |
| RF-REC-08 | Ordens de tutorial fixas na primeira execução (3 primeiras). | P0 |

**Critério de aceite RF-REC-04:** ao clicar em “Aceitar”, em ≤ 300 ms o dispositivo aparece na
bancada, a ordem sai da fila e o HUD mostra o painel de bancada com o status `intake`.

### 2.2 Bancada e diagnóstico (RF-BAN)

| ID | Requisito | Prioridade |
|---|---|---|
| RF-BAN-01 | Posicionar o dispositivo na bancada em um slot fixo, com câmera inicial enquadrando-o. | P0 |
| RF-BAN-02 | Executar diagnóstico com duração e barra de progresso; revela 1–3 falhas da ordem. | P0 |
| RF-BAN-03 | Identificar visualmente falhas reveladas (ícone/badge no slot afetado). | P0 |
| RF-BAN-04 | Desmontar o gabinete removendo parafusos clicáveis (mínimo 4) antes de acessar slots internos. | P0 |
| RF-BAN-05 | Slots internos: CPU, RAM ×2, armazenamento, GPU, fonte, cooler. Nem todos presentes em todo modelo. | P0 |
| RF-BAN-06 | Bloquear ações inválidas (instalar peça em slot errado, remover com parafusos no lugar) com feedback claro. | P0 |
| RF-BAN-07 | Validar reparo na etapa `testing` e liberar “Devolver ao cliente”. | P0 |

**Critério de aceite RF-BAN-02:** a barra progride de 0 a 100% em 8 s; ao final, o painel lista as
falhas e os slots correspondentes passam a exibir indicador de defeito.

### 2.3 Tarefas de manutenção (RF-MAN)

| ID | Tarefa | Regra | Prioridade |
|---|---|---|---|
| RF-MAN-01 | Limpeza | Arrastar a escova sobre áreas com sujeira; reduz `dust` de 100 → ≤ 10. Partículas desaparecem progressivamente. | P0 |
| RF-MAN-02 | Troca de armazenamento | Remover HDD/SSD antigo, instalar unidade nova do inventário; valida `kind: storage`. | P0 |
| RF-MAN-03 | Upgrade de memória | Instalar pente compatível em slot livre; soma de capacidade deve atender à ordem (`minRam`). | P0 |
| RF-MAN-04 | Instalação de SO | Inserir pendrive bootável, iniciar instalação (5 s), progresso com etapas. Requer armazenamento funcional. | P0 |
| RF-MAN-05 | Pasta térmica | Aplicar pasta no CPU após remover o cooler; reduz temperatura simulada. | P1 |
| RF-MAN-06 | Troca de fonte/GPU | Mesmo fluxo genérico de troca de peças. | P1 |

Cada tarefa concluída gera entrada no log da ordem (`order.log[]`), usado na validação final.

### 2.4 Inventário e compras (RF-INV)

| ID | Requisito | Prioridade |
|---|---|---|
| RF-INV-01 | Catálogo com ≥ 10 peças, com custo, compatibilidade e imagem/ícone. | P0 |
| RF-INV-02 | Comprar peça debita o caixa e incrementa o estoque imediatamente. | P0 |
| RF-INV-03 | Estoque com quantidade por peça; não permitir compra sem saldo. | P0 |
| RF-INV-04 | Arrastar peça do inventário (HUD) para o slot 3D válido. | P0 |
| RF-INV-05 | Arrastar peça instalada para fora devolve ao estoque (ou bandeja da bancada). | P1 |
| RF-INV-06 | Descartar peça danificada com confirmação. | P2 |

### 2.5 Financeiro (RF-FIN)

| ID | Requisito | Prioridade |
|---|---|---|
| RF-FIN-01 | Caixa inicial de R$ 1.500, exibido no topo do HUD com animação de contagem. | P0 |
| RF-FIN-02 | Pagamento = valor da ordem + bônus por prazo + gorjeta por reputação. | P0 |
| RF-FIN-03 | Despesa diária (aluguel) debitada ao iniciar o dia; se caixa insuficiente, dívida com aviso. | P1 |
| RF-FIN-04 | Extrato com as últimas 20 transações (valor, motivo, dia). | P1 |
| RF-FIN-05 | Prejuízo não encerra o jogo no MVP: estado de dívida impede compras até saldar. | P1 |
| RF-FIN-06 | Custo de peças consumidas entra no cálculo de lucro da ordem. | P0 |

### 2.6 Progressão e sessão (RF-PRO / RF-SIS)

| ID | Requisito | Prioridade |
|---|---|---|
| RF-PRO-01 | Reputação 0–100; sobe ao concluir ordens no prazo, desce ao atrasar/recusar. | P1 |
| RF-PRO-02 | Nível da loja desbloqueia peças melhores e ordens mais caras. | P2 |
| RF-SIS-01 | Autosave após cada evento relevante (aceitar, concluir, comprar). | P0 |
| RF-SIS-02 | Continuar jogo salvo; novo jogo com confirmação. | P0 |
| RF-SIS-03 | Pausa (Esc) com opções: continuar, reiniciar, som on/off, qualidade gráfica. | P0 |
| RF-SIS-04 | Tutorial contextual nas 3 primeiras ordens (destaques e dicas). | P0 |
| RF-SIS-05 | Ciclo dia/noite: 1 dia = 8 min reais; ao fim, resumo financeiro. | P1 |

## 3. Requisitos não-funcionais

| ID | Categoria | Requisito |
|---|---|---|
| RNF-01 | Performance | 60 fps a 1080p em GPU integrada de 2020+; mínimo 30 fps em modo “baixa qualidade”. |
| RNF-02 | Performance | Primeiro render interativo < 5 s em conexão 10 Mbps; modelos 3D com lazy loading. |
| RNF-03 | Performance | Bundle inicial ≤ 1,5 MB gzip (excluindo assets 3D); ≤ 60 draw calls na cena da bancada. |
| RNF-04 | Compatibilidade | Chrome, Edge, Firefox e Safari (últimas 2 versões), WebGL2 obrigatório com fallback de aviso. |
| RNF-05 | Resolução | Suporte de 1280×720 a 2560×1440; HUD escala 100–125% sem sobreposição. |
| RNF-06 | Qualidade de código | TypeScript `strict`, ESLint + Prettier, sem `any` em `store/` e `systems/`. |
| RNF-07 | Testes | Vitest com ≥ 70% de cobertura em slices e `systems/`; testes de regressão do core loop. |
| RNF-08 | Persistência | Save versionado com migração; save corrompido não pode travar o app (fallback para novo jogo). |
| RNF-09 | Acessibilidade | Contraste AA, foco visível, navegação por teclado nos painéis, respeito a `prefers-reduced-motion`. |
| RNF-10 | Manutenibilidade | Conteúdo (peças, ordens) 100% data-driven em `models/`; adicionar peça não exige mudar componente. |
| RNF-11 | i18n | Todo texto de UI em chaves de tradução, pt-BR como locale padrão. |
| RNF-12 | Observabilidade | Log de erros de runtime em console com contexto de slice/ação no build de dev. |

## 4. Regras de negócio do MVP

1. Uma ordem ativa por vez na bancada.
2. Uma peça comprada entra no estoque imediatamente (sem tempo de entrega no MVP).
3. Reparo só é válido se **todas** as falhas reveladas forem resolvidas e o teste final passar.
4. Peça removida de um slot volta ao estoque somente se `condition ≥ 60`; caso contrário, é sucata.
5. Nenhuma ação consome dinheiro sem confirmação explícita (exceto compra unitária com feedback).

## 5. Fora de escopo do MVP

- Multiplayer, backend, contas de usuário, cloud save.
- Celulares como dispositivo jogável (previsto pós-MVP; arquitetura já suporta via `models/devices`).
- Funcionários, contratação, expansão física da loja.
- Sistema de clientes recorrentes, marketing, eventos sazonais.
- Voz, cutscenes, narrativa ramificada.
- Mobile/touch (mouse é premissa de design).

## 6. Definição de Pronto (DoD)

Uma feature só é considerada pronta quando:

- [ ] Atende ao critério de aceite do requisito.
- [ ] Tem estado de erro/feedback implementado (não silencioso).
- [ ] Funciona após reload com save (quando aplicável).
- [ ] Passa nos testes do slice/sistema correspondente.
- [ ] Revisada contra o checklist de UI de `branding.md`.
- [ ] Sem `console.log` residual e sem warnings de WebGL no console.
