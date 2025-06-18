# 🤖 AI Contacts Extractor - Backend

**Contact extraction API** powered by OpenAI GPT-4.1. Transforming unstructured meeting notes into structured contact information.

[![Built with Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![Hono](https://img.shields.io/badge/Hono-E36002?style=flat&logo=hono&logoColor=white)](https://hono.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)](https://openai.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🎯 What This Does

Transforms unstructured text into clean, structured contact data:

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

- 🤖 **AI-Powered Extraction** - OpenAI GPT-4.1 with structured outputs for reliable parsing
- 📝 **OpenAPI Documentation** - Auto-generated API docs with Scalar UI
- 🛠️ **Type-Safe Stack** - End-to-end type safety with TypeScript and Zod validation
- 🚀 **High Performance** - Built on Bun runtime for maximum speed
- 📊 **Structured Output** - Consistent, validated JSON responses
- ✅ **Production Ready** - Comprehensive test suite and error handling
- 🔍 **Smart Validation** - Extracts name, email, phone, company, job title, and custom fields
- 🛡️ **Robust Error Handling** - Graceful failure handling with meaningful error messages

## 🛠️ Tech Stack

**Core Framework:**
- [Bun](https://bun.sh) - Ultra-fast JavaScript runtime
- [Hono](https://hono.dev) - Lightweight, fast web framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development

**AI & Processing:**
- [OpenAI](https://openai.com) - GPT-4.1 with structured outputs
- [Zod](https://zod.dev) - Runtime type validation and schema definition
- JSON Schema - Structured AI response validation

**API & Documentation:**
- OpenAPI 3.0 - API specification
- [Scalar](https://scalar.com) - Beautiful API documentation UI
- [Vitest](https://vitest.dev) - Fast unit testing framework

**Data & Validation:**
- [Drizzle ORM](https://orm.drizzle.team) - Type-safe database operations
- SQLite - Local development database

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
# Edit .env with your OpenAI API key and other configuration

# 4. Run database migrations
bun drizzle-kit push

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

# OpenAI Configuration (Required)
OPENAI_API_KEY=your-openai-api-key-here

# Admin Access (for protected routes)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-super-secret-password
```

## 📡 API Endpoints

### Production Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/doc` | OpenAPI JSON specification |
| `GET` | `/reference` | Interactive API documentation |
| `GET` | `/api/v1` | Welcome screen |
| `POST` | `/api/v1/extract/text` | **Extract contacts from text** |

### Extract Contacts

**Endpoint:** `POST /api/v1/extract/text`

**Request Body:**
```json
{
  "text": "I met John Doe from TechCorp, his email is john.doe@techcorp.com and phone is +1-555-123-4567"
}
```

**Response:**
```json
[
  {
    "name": "John Doe",
    "email": "john.doe@techcorp.com", 
    "phone": "+1-555-123-4567",
    "company": "TechCorp",
    "job_title": null,
    "location": null,
    "notes": null,
    "custom_fields": []
  }
]
```

**Validation Rules:**
- Text is required (1-10,000 characters)
- Content-Type must be `application/json`
- At least one contact must have name or email

## 🏗️ Project Structure

```
src/
├── app.ts              # Main application setup
├── index.ts            # Server entry point
├── env.ts              # Environment validation
├── types.ts            # TypeScript type definitions
├── ai/
│   └── aiConfig.ts     # OpenAI client configuration
├── routes/
│   └── extract/        # Contact extraction endpoints
│       ├── extract.handlers.ts    # Route handlers
│       ├── extract.routes.ts      # Route definitions
│       ├── extract.types.ts       # Type schemas
│       ├── extract.index.ts       # Route exports
│       └── extract.test.ts        # Comprehensive tests
├── db/
│   ├── index.ts        # Database connection
│   ├── schema.ts       # Database schema definitions
│   └── migrations/     # Database migrations
├── helpers/            # Utility functions
├── lib/                # Core application logic
└── middlewares/        # Custom middleware
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
bun run test         # Run comprehensive test suite
bun run test:watch   # Run tests in watch mode
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

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test files
bun test extract.test.ts      # API and AI integration tests
bun test extract.db.test.ts   # Database integration tests
```

# Run tests with coverage
bun test --coverage
```

**Test Coverage:**
- ✅ Input validation (missing fields, empty text, text too long)
- ✅ Request validation (malformed JSON, missing headers, wrong HTTP methods)
- ✅ AI integration (real OpenAI API calls, structured outputs)
- ✅ Output validation (single/multiple contacts, empty results)
- ✅ Database integration (contact persistence, data consistency)
- ✅ Error handling (AI failures, network issues, database errors)

## 🛡️ Security & Validation

- **Input Validation**: All requests validated with Zod schemas
- **AI Output Validation**: OpenAI responses validated against strict schemas
- **Error Handling**: Structured error responses with proper HTTP status codes
- **CORS**: Configurable cross-origin resource sharing

## 🚦 Status

**✅ Production Ready - All Core Features Implemented**

**✅ Completed:**
- ✅ Modern TypeScript backend with Bun + Hono
- ✅ OpenAI GPT-4.1 integration with structured outputs
- ✅ Complete contact extraction API (`POST /extract/text`)
- ✅ Database integration with automatic contact persistence
- ✅ Comprehensive Zod validation and type safety
- ✅ OpenAPI documentation with Scalar UI
- ✅ Full test suite (19 tests covering all scenarios)
- ✅ Robust error handling and logging
- ✅ Production-ready code without comments (self-documenting)

**🎯 Ready for:**
- ✅ Frontend integration
- ✅ CI/CD pipeline setup

**💡 Future Enhancements:**
- 📊 Gated access
- ⚙️ Manual contact adding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔗 Links

- [API Documentation](http://localhost:8080/reference) (when running locally)
- [OpenAI Documentation](https://platform.openai.com/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Hono Documentation](https://hono.dev/docs)
- [Zod Documentation](https://zod.dev)
- [Vitest Documentation](https://vitest.dev)

---

**Built with ❤️ using modern TypeScript stack**
