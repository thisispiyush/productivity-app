# Pulse — Productivity OS

Premium, minimal productivity web app (Dashboard, Habit Tracker, Task Manager, Analytics).

## Tech

- React (Vite) + TypeScript
- TailwindCSS
- shadcn/ui-style primitives (Radix + Tailwind)
- lucide-react icons
- Recharts
- framer-motion
- @dnd-kit drag & drop

## Run locally

```bash
npm install
npm run dev
```

## Structure

- `src/layout/`: Sidebar + app layout + page transitions
- `src/pages/`: Dashboard, Habit Tracker, Task Manager, Analytics
- `src/components/`: reusable cards + charts + task/habit UI
- `src/components/ui/`: shadcn-style UI primitives
- `src/hooks/`: localStorage persistence + store
- `src/utils/`: dates, ids, helpers

## Notes

- Data persists in `localStorage` (no backend yet).
