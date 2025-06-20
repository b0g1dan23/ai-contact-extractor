# AI Contact Extractor Frontend

A modern Vue 3 application for extracting contact information from text using AI assistance.

## 🚀 Features

- **AI Contact Extraction**: Extract contacts from meeting notes
- **Search & Filtering**: Real-time debounced search with filter by email/location
- **Modern Vue 3**: Built with Composition API and TypeScript
- **Provider Pattern**: State management with provide/inject
- **Accessibility**: WCAG compliant with proper ARIA attributes
- **Animations**: Smooth CSS animations with reduced motion support

## 🛠️ Future Enhancements

The following features and improvements are planned for upcoming releases:

### Core Features
- [ ] **Backend Integration**: Connect to real AI service for contact extraction
- [ ] **Contact Management**: Edit, delete, and update existing contacts
- [ ] **Data Persistence**: Save contacts to database with user authentication

### User Experience
- [ ] **Keyboard Shortcuts**: Power user shortcuts for common actions

### Technical Improvements
- [ ] **Error Boundaries**: Graceful error handling and recovery
- [ ] **Loading States**: Skeleton screens and progress indicators
- [ ] **Performance**: Virtual scrolling for large contact lists

### Quality Assurance
- [ ] **Unit Testing**: Comprehensive test suite with Vitest
- [ ] **E2E Testing**: Automated browser testing with Playwright

## 🏗️ Architecture

### Components Structure
```
src/
├── components/
│   ├── ui/
│   │   └── Button.vue           # Reusable button component
│   ├── AppHeader.vue            # Application header
│   ├── Card.vue                 # Animated card component
│   ├── HeroSection.vue          # Hero banner section
│   ├── AIExtraction.vue         # AI text input component
│   └── ContactSection.vue       # Contact extraction UI
├── composables/
│   └── useContactExtraction.ts  # Contact extraction logic
├── providers/
│   └── contactExtractionProvider.ts # Provider pattern implementation
└── assets/
    ├── _variables.scss          # SCSS variables
    └── base.scss               # Base styles
```

### State Management
Uses Vue's **provide/inject** pattern for clean state management:
- `useContactExtractionProvider()` - Provides functionality
- `useContactExtractionConsumer()` - Consumes functionality in child components

## 🎨 Design System

### SCSS Variables
- **Colors**: Primary, secondary, semantic colors
- **Typography**: Source Sans Pro font family with responsive sizes
- **Spacing**: Consistent spacing scale
- **Components**: Pre-configured button, card, form styles

### Component Features
- **Button**: Multiple variants (primary, secondary, outline), sizes, disabled states
- **Card**: Animated entry, hover effects, BEM methodology
- **Responsive**: Mobile-first with custom breakpoint mixins

## 🔧 Technical Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development
- **SCSS** with automated variable injection
- **Custom font loading** (Source Sans Pro)

## 📱 Responsive Design

Breakpoints:
- **Mobile**: ≤ 375px
- **Tablet**: ≤ 768px
- **Desktop**: ≥ 1440px

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
bun install
```

### Compile and Hot-Reload for Development

```sh
bun dev
```

### Type-Check, Compile and Minify for Production

```sh
bun run build
```
