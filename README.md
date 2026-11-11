# 🚧 Simulator Tech Repair - Em construção 🚧

<p align="center">
  • <a href="#-descrição-do-entregável">Descrição do Entregável</a> •
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-layout">Layout</a> •
  <a href="#-como-executar-o-projeto">Como executar</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-documentação">Documentação</a> •
  <a href="#-autor">Autor</a> •
  <!-- 
  <a href="#-licença">Licença</a> • 
  -->
</p>

---

## 📄 Descrição do entregável

O **Simulator Tech Repair** é um jogo web de simulação 3D no qual o jogador administra uma assistência técnica especializada em computadores.

O projeto contempla:

- **Aplicação Web:** interface principal do jogo.
- **Ambiente 3D:** cenário interativo desenvolvido com React Three Fiber.
- **HUD (Heads-Up Display):** interface de gerenciamento e informações do jogador.
- **Sistema de gerenciamento:** controle de estoque, equipamentos, pedidos e economia.
- **Persistência de dados:** armazenamento do progresso utilizando localStorage.

---

## 💻 Sobre o projeto

O **Simulator Tech Repair** é um projeto desenvolvido com o objetivo de explorar conceitos de desenvolvimento de jogos para a Web, combinando tecnologias modernas de desenvolvimento Front-End com renderização e interação tridimensional.

A proposta é proporcionar uma experiência de simulação na qual o jogador assume o gerenciamento de uma assistência técnica de computadores, realizando atividades relacionadas ao funcionamento e à administração do negócio.

O jogo utiliza um ambiente 3D interativo integrado a uma interface de gerenciamento, permitindo que o jogador acompanhe seus recursos, organize suas atividades e evolua dentro da simulação.

O desenvolvimento também tem como objetivo aprofundar conhecimentos em React, gerenciamento de estado, arquitetura de software, modelagem de sistemas e integração de ambientes 3D em aplicações Web.

---

## ⚙️ Funcionalidades

As funcionalidades estão sendo desenvolvidas gradualmente, conforme as etapas definidas para o MVP.

- [ ] Ambiente 3D interativo da assistência técnica.
- [ ] Interface HUD para gerenciamento do estabelecimento.
- [ ] Sistema de economia e gerenciamento financeiro.
- [ ] Sistema de inventário e controle de estoque.
- [ ] Catálogo de equipamentos e componentes.
- [ ] Sistema de bancada de trabalho.
- [ ] Sistema de pedidos e serviços.
- [ ] Sistema de loja e gerenciamento de compras.
- [ ] Persistência de progresso utilizando localStorage.
- [ ] Integração entre interface 2D e ambiente 3D.

---

## 🎨 Layout

O projeto utiliza uma interface de gerenciamento (HUD) integrada a um ambiente tridimensional.

### Ambiente 3D

<!-- Adicione aqui imagens do ambiente 3D do jogo -->

### Interface do jogo (HUD)

<!-- Adicione aqui imagens da interface de gerenciamento -->

### Gameplay

<!-- Adicione aqui GIFs ou vídeos demonstrando a interação com o jogo -->

---

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

Além disso, é recomendado utilizar um editor de código como o [Visual Studio Code](https://code.visualstudio.com/).

### Executando localmente

1. Clone o repositório:

```bash
git clone https://github.com/Dferreiraz/SimulatorTechRepair.git
```

2. Acesse a pasta do projeto:

```bash
cd SimulatorTechRepair
```

3. Instale as dependências:

```bash
pnpm install
```

4. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

5. Acesse o endereço disponibilizado pelo Vite no terminal, geralmente:

```text
http://localhost:5173
```

### Outros scripts disponíveis

```bash
pnpm build       # Gera o build de produção
pnpm preview     # Pré-visualiza o build de produção
pnpm lint        # Executa a análise estática com oxlint
```

---

## 🛠 Tecnologias

As seguintes tecnologias e ferramentas estão sendo utilizadas no desenvolvimento do projeto:

#### **Front-End**

- **[React 19](https://react.dev/)** — construção da interface e componentes.
- **[Vite 8](https://vite.dev/)** — ambiente de desenvolvimento e build.
- **[JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)** — linguagem principal do projeto.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — estilização e sistema de design.

#### **Desenvolvimento 3D**

- **[Three.js](https://threejs.org/)** — renderização gráfica 3D.
- **[React Three Fiber](https://r3f.docs.pmnd.rs/)** — integração do Three.js com React.
- **[Drei](https://drei.docs.pmnd.rs/)** — ferramentas e componentes auxiliares para cenas 3D.

#### **Gerenciamento de estado**

- **[Zustand](https://zustand.docs.pmnd.rs/)** — gerenciamento de estado global.
- **localStorage** — persistência dos dados localmente no navegador.

#### **Ferramentas de desenvolvimento**

- **[pnpm](https://pnpm.io/)** — gerenciamento de dependências.
- **[oxlint](https://oxc.rs/docs/guide/usage/linter.html)** — análise estática do código.

---

## 📚 Documentação

O projeto possui documentação técnica organizada na pasta `docs/`, com informações sobre arquitetura, identidade visual, requisitos e planejamento de desenvolvimento.

| Documento | Descrição |
|---|---|
| [Arquitetura](docs/arquitetura.md) | Camadas, organização de pastas e gerenciamento de estado. |
| [Branding](docs/branding.md) | Design system e identidade visual do HUD. |
| [Requisitos](docs/requisitos.md) | Escopo e requisitos do MVP. |
| [GDD Core](docs/gdd-core.md) | Core loop e mecânicas de interação 3D. |
| [Roadmap](docs/roadmap.md) | Fases e planejamento do desenvolvimento. |

---

## 📁 Estrutura do projeto

```text
src/
├── components/
│   ├── 3d/             # Cena e modelos 3D (React Three Fiber)
│   └── ui/             # Interface HUD (DOM + Tailwind)
│
├── models/             # Catálogo, templates e constantes
│
├── store/              # Gerenciamento de estado (Zustand)
│   ├── shop/           # Loja
│   ├── bench/          # Bancada de trabalho
│   ├── inventory/      # Inventário
│   ├── order/          # Pedidos
│   ├── economy/         # Economia
│   └── ui/             # Interface
│
└── utils/              # Funções utilitárias
```

---

## 💪 Como contribuir para o projeto

Contribuições são bem-vindas!

1. Faça um **fork** do projeto.
2. Crie uma nova branch para suas alterações:

```bash
git checkout -b feature/minha-funcionalidade
```

3. Realize as alterações e crie um commit descritivo:

```bash
git commit -m "feat: adiciona nova funcionalidade"
```

4. Envie suas alterações:

```bash
git push origin feature/minha-funcionalidade
```

5. Abra um **Pull Request** descrevendo as alterações realizadas.

---

## 🦸 Autor

**Davi Ferreira**

<a href="https://www.linkedin.com/in/davirobertoferreira/">LinkedIn</a>

[![Gmail Badge](https://img.shields.io/badge/-davi2580vege%40gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white)](mailto:davi2580vege@gmail.com)

---
<!--
## 📝 Licença

A licença deste projeto deverá ser especificada no arquivo [LICENSE](./LICENSE).

---

Feito por **Davi Ferreira** 👋🏽

[Entre em contato!](https://www.linkedin.com/in/davirobertoferreira/)
-->
