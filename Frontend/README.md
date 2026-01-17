# Nukta App - Frontend

A React blog application built with Vite, Redux Toolkit, and TailwindCSS.

## Development

### Quick Start (Recommended)
Run both frontend and backend servers concurrently:
```bash
npm start
```

### Individual Scripts
- `npm run dev` - Run frontend only (port 5173)
- `npm run server` - Run backend only (port 3000)
- `npm run client` - Alias for `npm run dev`
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Tech Stack
- React 19
- Vite
- Redux Toolkit (RTK Query)
- React Router v7
- TailwindCSS v4
- TinyMCE Editor

## Vite Plugins

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
