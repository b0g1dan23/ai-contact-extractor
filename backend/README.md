# 🤖 AI Contacts Extractor - Backend

**Contact extraction API** powered by AI. Transform unstructured meeting notes into structured contact information.

[![Built with Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![Hono](https://img.shields.io/badge/Hono-E36002?style=flat&logo=hono&logoColor=white)](https://hono.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🎯 What This Should Do

Transforming text into clean, structured contact data:

```
Input: "Today, I had an interview with Dustin & Andrei from HeyGov, their emails are dustin@heygov.com andrei@heygov.com"

Output: [{
  name: "Dustin",
  company: "HeyGov",
  email: "dustin@heygov.com"
}, {
  name: "Andrei",
  company: "HeyGov",
  email: "andrei@heygov.com"
}]
```

## ✨ Features

- 🤖 **AI-Powered Extraction** - Intelligent contact data parsing from any text format
- 📝 **OpenAPI Documentation** - Auto-generated API docs with Scalar UI
- 🛠️ **Type-Safe Stack** - End-to-end type safety with TypeScript
- 🚀 **High Performance** - Built on Bun runtime for maximum speed
- 📊 **Structured Output** - Consistent JSON responses from OpenAI

## 🛠️ Tech Stack

**Core Framework:**
- [Bun](https://bun.sh) - Ultra-fast JavaScript runtime
- [Hono](https://hono.dev) - Lightweight, fast web framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development

**Data & Validation:**
- [Drizzle ORM](https://orm.drizzle.team) - Type-safe database operations
- [Zod](https://zod.dev) - Runtime type validation
- SQLite - Local development database

**API & Documentation:**
- OpenAPI 3.0 - API specification
- [Scalar](https://scalar.com) - Beautiful API documentation UI
- JSON schema validation - Request/response validation

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh) v1.1.x or higher
- Node.js 18+ (fallback)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/b0g1dan23/ai-contact-extractor.git
cd ai-contact-extractor/backend

# 2. Install dependencies
bun install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Run database migrations
bun drizzle-kit push
bun drizzle-kit generate

# 5. Start development server
bun run dev
```

### Environment Configuration

Create a `.env` file in the root directory:

```bash
# Server Configuration
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# Database
DB_URL=file:./local.db

# Admin Access (for protected routes)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-super-secret-password

# AI Service Configuration (Coming Soon)
# OPENAI_API_KEY=your-openai-key
# AI_MODEL=gpt-4-turbo
```

## 📡 API Endpoints

### Current Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/api/v1/` | API welcome message |
| `GET` | `/doc` | OpenAPI JSON specification |
| `GET` | `/reference` | Interactive API documentation |

### Coming Soon

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/extract/text` | Extract contacts from text |
| `GET` | `/api/v1/contacts` | List extracted contacts |
| `DELETE` | `/api/v1/contacts/${id}` | Delete contact |
| `PATCH` | `/api/v1/contacts/${id}` | Update contact |

## 🏗️ Project Structure

```
src/
├── app.ts              # Main application setup
├── index.ts            # Server entry point
├── env.ts              # Environment validation
├── types.ts            # TypeScript type definitions
├── db/
│   ├── index.ts        # Database connection
│   ├── schema.ts       # Database schema definitions
│   └── migrations/     # Database migrations
├── helpers/            # Utility functions
├── lib/                # Core application logic
├── middlewares/        # Custom middleware
└── routes/             # API route handlers
```

## 🔧 Development

### Available Scripts

```bash
# Development
bun run dev          # Start development server with hot reload
bun run start        # Start production server

# Database
bun drizzle-kit generate  # Generate migrations
bun drizzle-kit push      # Push schema changes
bun drizzle-kit studio    # Open Drizzle Studio

# Testing
bun run test         # Run test suite
```

### Database Management

```bash
# Generate new migration
bun drizzle-kit generate
```

## 📊 API Documentation

Once the server is running, visit:
- **Interactive Docs**: `http://localhost:8080/reference`
- **OpenAPI Spec**: `http://localhost:8080/doc`

## 🛡️ Security & Rate Limiting

- **Input Validation**: All requests validated with Zod schemas
- **Error Handling**: Structured error responses
- **CORS**: Configurable cross-origin resource sharing

## 🚦 Current Status

This is the initial backend foundation. The AI contact extraction features are currently in development.

**✅ Completed:**
- ✅ Modern TypeScript backend setup
- ✅ OpenAPI documentation
- ✅ Database schema foundation
- ✅ Error handling and logging

**🚧 In Progress:**
- 🚧 AI integration (OpenAI/Claude)
- 🚧 Gated Access
- 🚧 Test implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔗 Links

- [API Documentation](http://localhost:8080/reference) (when running locally)
- [Bun Documentation](https://bun.sh/docs)
- [Hono Documentation](https://hono.dev/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)

---

**Built with ❤️**
