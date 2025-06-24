# AI Contact Extractor

A full-stack application for extracting structured contact information from unstructured text using AI (OpenAI GPT-4.1). Includes a modern Vue 3 frontend and a Bun + Hono + TypeScript backend.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Setup & Installation](#setup--installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Run Scripts](#run-scripts)
- [OpenAI Usage](#openai-usage)
- [API Documentation](#api-documentation)
- [Development Notes](#development-notes)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Docker Compose](#docker-compose)
- [Links](#links)

---

## Features

- **AI-Powered Extraction**: Uses OpenAI GPT-4.1 to extract contacts from meeting notes.
- **Manual Contact Entry**: Add/edit contacts with custom fields and validation.
- **Search & Filtering**: Real-time search and filter by email/location.
- **Modern Stack**: Vue 3 (Composition API, TypeScript), Bun, Hono, Drizzle ORM, SQLite.
- **Type Safety**: End-to-end TypeScript with Zod validation.
- **OpenAPI Docs**: Auto-generated API docs with Scalar UI.
- **Comprehensive Error Handling**: Structured error responses and validation.
- **Accessibility & Animations**: WCAG compliant, smooth CSS animations.

---

## Architecture

### Backend

- **Bun**: Ultra-fast JS runtime.
- **Hono**: Lightweight web framework.
- **Drizzle ORM**: Type-safe DB access (SQLite).
- **OpenAI**: GPT-4.1 for extraction.
- **Zod**: Runtime validation.
- **OpenAPI**: API spec and docs.
- **Vitest**: Testing.

**Key Folders:**
```
backend/src/
├── app.ts              # Main app setup
├── env.ts              # Env validation
├── ai/aiConfig.ts      # OpenAI client config
├── routes/             # API endpoints (extract, contacts)
├── db/                 # DB schema, migrations
├── helpers/, lib/, middlewares/
```

### Frontend

- **Vue 3**: Composition API, TypeScript.
- **PrimeVue**: UI components.
- **OpenAPI Fetch**: Typed API client.
- **Provider Pattern**: State management.
- **Vite**: Build tool.

**Key Folders:**
```
frontend/src/
├── components/         # UI & feature components
├── composables/        # Logic hooks (filtering, CRUD)
├── providers/          # State providers
├── services/           # API clients
├── types/              # OpenAPI-generated types
├── assets/             # Styles, icons, fonts
```

---

## Setup & Installation

### Backend

**Prerequisites:**  
- [Bun](https://bun.sh) v1.1+  
- Node.js 18+ (fallback)

**Steps:**
```sh
# 1. Clone the repository
git clone https://github.com/your-org/ai-contact-extractor.git
cd ai-contact-extractor/backend

# 2. Install dependencies
bun install

# 3. Configure environment
cp .env.example .env
# Edit .env with your OpenAI API key and DB settings

# 4. Run database migrations
bun drizzle-kit push
bun drizzle-kit generate

# 5. Start development server
bun run dev
```

### Frontend

**Prerequisites:**  
- [Bun](https://bun.sh)  
- Node.js 18+  
- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) recommended

**Steps:**
```sh
cd ai-contact-extractor/frontend
bun install
bun run generate-types
cp .env.example .env
bun run dev
```

---

## Run Scripts

### Backend

- `bun run dev` — Start dev server (hot reload)
- `bun run start` — Start production server
- `bun run test` — Run tests
- `bun drizzle-kit generate` — Generate DB migrations
- `bun drizzle-kit push` — Apply DB migrations

### Frontend

- `bun run dev` — Start dev server (hot reload)
- `bun run build` — Build for production
- `bun run preview` — Preview production build
- `bun run generate-types` — Generate OpenAPI types from backend

---

## OpenAI Usage

- The backend uses the OpenAI API (GPT-4.1) to extract contact information from unstructured text.
- The OpenAI API key must be set in the backend `.env` file (`OPENAI_API_KEY`).
- Extraction logic is in `backend/src/ai/aiConfig.ts` with a strict system prompt for reliable, structured output.
- All AI responses are validated with Zod schemas before being returned to the frontend.

---

## API Documentation

- **Interactive Docs:** [http://localhost:8080/reference](http://localhost:8080/reference)
- **OpenAPI Spec:** [http://localhost:8080/doc](http://localhost:8080/doc)

**Main Endpoints:**
| Method | Endpoint                | Description                        |
|--------|-------------------------|------------------------------------|
| GET    | `/`                     | Health check                       |
| POST   | `/v1/extract/text`  | Extract contacts from text         |
| GET    | `/v1/contacts`      | List all contacts                  |
| POST   | `/v1/contacts`      | Create a new contact               |
| PUT    | `/v1/contacts/:id`  | Update a contact                   |
| DELETE | `/v1/contacts/:id`  | Delete a contact                   |

---

## Development Notes

- **CORS**: Configured for local frontend (`http://localhost:5173`) in `backend/src/lib/configure-cors.ts`.
- **Type Safety**: All API types are generated and used in both frontend and backend.
- **Error Handling**: All errors are returned in a structured JSON format.
- **Testing**: Backend uses in-memory SQLite for fast, isolated tests.

---

## Testing

### Backend

```sh
bun run test         # Run all tests
bun run test:watch   # Watch mode
bun test extract.test.ts      # API/validation tests
bun test extract.db.test.ts   # DB integration tests
```

- Uses in-memory SQLite for isolation and speed.
- 21+ tests, full coverage of API, DB, and AI integration.

---

## Environment Variables

**Backend (`backend/.env`):**
```
NODE_ENV=development
PORT=8080
LOG_LEVEL=info
DB_URL=file:./local.db
OPENAI_API_KEY=your-openai-api-key
```

**Frontend:**  
- Uses `env.ts` for environment variables (see `frontend/src/env.ts`).

---

## Docker Compose

Docker Compose is supported for local development and self-hosting. It will run both backend and frontend, and persist your SQLite database automatically.

### Usage

1. **Set environment variables:**
   - Create a `.env` file in the project root (or set these in your deployment environment) with the following content:
     ```env
     LOG_LEVEL=info
     PORT=8080
     DB_URL=file:./your-path-to-db.db
     OPENAI_API_KEY=your-openai-key

     VITE_API_URL=http://backend-endpoint
     ```
   - These are required for the backend and frontend to function correctly.

2. **Build and start all services:**
   ```sh
   docker compose up --build
   ```
   This will build and start backend, frontend, and nginx proxy containers.

3. **Access your app:**
   - Frontend: [http://localhost:5757]
   - Backend API: [http://localhost:5757/api]

4. **Stop all services:**
   ```sh
   docker compose down
   ```

5. **Data persistence:**
   - Your SQLite database is stored in a Docker volume, so your data will survive container restarts and rebuilds.

> **Note:** For cloud deployment (e.g. Railway), deploy backend and frontend as separate services and use a managed database (not SQLite).

---

## Links

- [OpenAI Documentation](https://platform.openai.com/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Hono Documentation](https://hono.dev/docs)
- [Zod Documentation](https://zod.dev)
- [Vitest Documentation](https://vitest.dev)
- [Vue 3 Docs](https://vuejs.org/guide/introduction.html)
- [PrimeVue Docs](https://www.primefaces.org/primevue/)

---

**Built with ❤️ using a modern TypeScript stack.**