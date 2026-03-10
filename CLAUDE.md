# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a cross-platform mobile application built with **uni-app** and **Vue 3**. It targets multiple platforms including H5 (web), WeChat Mini Program, Alipay Mini Program, and HarmonyOS 5+ App.

The project is based on [Vitesse for uni-app](https://uni-helper.js.org/vitesse-uni-app), a modern starter template with Vite, TypeScript, and UnoCSS.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server (default: H5 platform)
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Show project info
pnpm about
```

### Platform-Specific Development

The `unh` CLI supports platform aliases for cross-platform development:

```bash
# H5 (default)
pnpm dev
pnpm dev h5

# WeChat Mini Program
pnpm dev wx
# or
pnpm dev mp-weixin

# Other platforms use the full platform name
# e.g., mp-alipay, mp-baidu, app-harmony, etc.
```

Platform aliases are configured in `unh.config.ts`.

## Architecture

### Build System

- **Build Tool**: `unh` (uni-helper CLI) wraps Vite with uni-app-specific plugins
- **Entry Points**: `vite.config.ts` defines the Vite plugin chain
- **Platform Config**: `unh.config.ts` sets default platform and aliases

### Key Vite Plugins (from `vite.config.ts`)

| Plugin | Purpose |
|--------|---------|
| `@uni-helper/vite-plugin-uni-manifest` | Generates `manifest.json` from `manifest.config.ts` |
| `@uni-helper/vite-plugin-uni-pages` | Generates page config from `pages.config.ts` |
| `@uni-helper/vite-plugin-uni-layouts` | File-based layout system in `src/layouts/` |
| `@uni-helper/vite-plugin-uni-components` | Auto-registers components from `src/components/` |
| `@uni-helper/plugin-uni` | Core uni-app ESM support |
| `unplugin-auto-import` | Auto-imports Vue, VueUse, and uni-app APIs |
| `unocss` | Atomic CSS with uni-app preset |

### Auto-Import Configuration

The following are auto-imported (configured in `vite.config.ts`):
- **Vue APIs**: `ref`, `computed`, `reactive`, etc.
- **@vueuse/core**: All VueUse composables
- **uni-app APIs**: `uni.navigateTo`, `uni.request`, etc.
- **Custom directories**: `src/composables`, `src/stores`, `src/utils`

Type definitions are generated to `src/auto-imports.d.ts` and `src/components.d.ts`.

### Routing System

- **File-based routing**: Pages are automatically registered from `src/pages/`
- **Page configuration**: Use `definePage()` inside page `.vue` files for per-page config
- **Global config**: `pages.config.ts` defines global styles and navigation bar settings
- **Layouts**: Create layout components in `src/layouts/` and use in page frontmatter

### Styling

- **UnoCSS**: Primary styling engine with `@uni-helper/unocss-preset-uni`
- **Config**: `uno.config.ts` extends the uni preset
- **Theme**: `theme.json` defines dark/light theme variables referenced as `@variableName` in config files
- **Units**: Use `rpx` for responsive cross-platform sizing

### Project Structure

```
src/
├── App.vue              # Root component
├── main.ts              # App entry point
├── pages/               # Page components (file-based routing)
├── components/          # Global components (auto-registered)
├── composables/         # Reusable Composition API functions (auto-imported)
├── stores/              # Pinia/state stores (auto-imported)
├── layouts/             # Layout components
├── static/              # Static assets
├── auto-imports.d.ts    # Generated: Auto-import API types
├── components.d.ts      # Generated: Component types
└── uni-pages.d.ts       # Generated: Page route types
```

## Code Patterns

### Component Definition

Use `<script setup>` with `definePage()` for pages:

```vue
<script setup lang="ts">
definePage({
  navigationBarTitleText: 'Page Title',
  navigationStyle: 'custom',
})
</script>
```

### Composables

Create reusable logic in `src/composables/`. Functions are auto-imported:

```typescript
// src/composables/useCount.ts
export function useCount() {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
}
```

### Navigation

Use uni-app navigation APIs (auto-imported):

```typescript
// Navigate to page
uni.navigateTo({ url: '/pages/hi' })

// Navigate with query params
uni.navigateTo({ url: '/pages/hi?name=value' })
```

## Important Files

| File | Purpose |
|------|---------|
| `pages.config.ts` | Global page configuration, navigation bar, tab bar |
| `manifest.config.ts` | App manifest for different platforms |
| `theme.json` | Theme variable definitions |
| `uno.config.ts` | UnoCSS preset and configuration |
| `eslint.config.js` | ESLint configuration |
| `tsconfig.json` | TypeScript configuration |
