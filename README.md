# rococor.com

This repository is a small Vue 3 + Vite starter used for the rococor.com site.

It contains a minimal app and is configured with Tailwind CSS. The project uses a central CSS variables file and maps those variables into the Tailwind theme so you can use both CSS variables and Tailwind utilities consistently.

## Quick Start

Install dependencies:

```sh
npm install
```

Run the dev server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

## Styling and Color Palette

- CSS variables are defined in `src/styles/variables.css`.
- Tailwind is configured to expose the same palette via `tailwind.config.cjs` so you can use `bg-razzmatazz` or `text-taupe-gray` in your templates. When CSS variables are needed directly (for runtime theming), use the variables (for example: `color: var(--razzmatazz)`).

Defined colors (CSS variables available in `:root`):

```
--white: #FCFCFCff;
--razzmatazz: #ED1D68ff;
--taupe-gray: #969096ff;
--black: #0A080Eff;
--platinum: #E9EAEAff;
```

Tailwind name mapping (examples):

- `bg-razzmatazz` → uses `var(--razzmatazz)`
- `text-taupe-gray` → uses `var(--taupe-gray)`

## Best practices (code splitting, performance, and Tailwind)

- Code splitting
  - Use dynamic imports for route-level code splitting. In Vue Router use the lazy syntax: `const Page = () => import('./pages/Page.vue')` so each page becomes its own chunk.
  - Keep components small and focused; split large components into smaller presentational + container components when needed.
  - Analyze bundle output with `vite build` and `npx vite --report` or tools like `rollup-plugin-visualizer` to find large dependencies.

- Performance
  - Prefer lazy-loading heavy third-party libs only where required.
  - Use native image formats (AVIF/WEBP) and Vite's asset handling to inline small images and keep large images as separate files.
  - Keep an eye on Cumulative Layout Shift (CLS) by reserving space for images and fonts.

- Tailwind-specific
  - Use `tailwind.config.cjs` content paths to include all places where classes appear (Vue files, JS, MDX, etc.).
  - Prefer semantic utility composition: create small component classes in `@layer components` inside `src/index.css` (or separate files) for repeated UI patterns.
  - If you need runtime theming, continue to use CSS variables; Tailwind can reference these variables as shown in this project.
  - Avoid using overly-dynamic class names that wind up unused by Tailwind’s purge/content scanner (use arrays or conditional class bindings instead of template-constructed class strings when possible).

## Tests & Linting

Run unit tests with Vitest:

```sh
npm run test:unit
```

Lint and autofix with ESLint:

```sh
npm run lint
```

## Next steps

- Add Tailwind plugins (typography, forms) if you need richer UI primitives.
- Add a design tokens JSON if you want to source colors/spacing from a single machine-readable format for cross-platform sharing.
