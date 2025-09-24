# Basirah-ERP | Enterprice Resource Planning

Basirah-ERP is a modular ERP system built with React, TypeScript, Vite, and Tailwind CSS.

## Project Structure

```
.gitignore
eslint.config.js
index.html
package.json
postcss.config.js
README.md
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
.bolt/
src/
  App.tsx
  index.css
  main.tsx
  vite-env.d.ts
  components/
    Header.tsx
    Sidebar.tsx
    Accounting/
    Dashboard/
    Finance/
    HumanResources/
    Inventory/
    Reports/
    Sales/
    Settings/
  data/
    mockData.ts
  hooks/
    useLocalStorage.ts
    useOrders.ts
  lib/
  types/
supabase/
  migrations/
```

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Run the development server:**
   ```sh
   npm run dev
   ```

3. **Build for production:**
   ```sh
   npm run build
   ```

## Features

- Modular ERP components (Accounting, Finance, HR, Inventory, Sales, Reports, Settings)
- React + TypeScript frontend
- Tailwind CSS for styling
- Vite for fast development
- Supabase integration (see `supabase/`)
