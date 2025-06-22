FROM oven/bun:1.1.14 AS base
WORKDIR /app
COPY package*.json bun.lockb ./
RUN bun install
COPY . .

EXPOSE 8080

FROM base AS development
CMD ["bun", "run", "dev"]

FROM base AS production
CMD ["bun", "run", "start"]