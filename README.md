# Groundflow — Landing Page

Landing do Groundflow: a camada de medição de vendas reais para CPG.

## Stack

- Vite + React 18
- Tailwind via CDN (config inline em `index.html`)
- Deploy Vercel (static build)

## Desenvolvimento

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Build

```bash
npm run build
```

Output em `dist/`.

## Deploy

Vercel detecta Vite automaticamente. Framework preset: **Vite**, build command: `npm run build`, output directory: `dist`.

## Estrutura

```
.
├── index.html          # Entrypoint Vite + CSS global + Tailwind config
├── src/
│   ├── main.jsx        # Bootstrap React
│   └── App.jsx         # Todas as seções (Nav, Hero, Problema, Solução, Como Funciona, Casos, Estratégias, CTA, Footer)
├── public/
│   ├── logo-dark.png
│   └── logo-white.png
├── vite.config.js
└── package.json
```
