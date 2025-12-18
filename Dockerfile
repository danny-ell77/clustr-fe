# Staging Dockerfile for ClustR Frontend (Nuxt 3)
FROM oven/bun:1

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN bun run build

# Create non-root user
RUN adduser --system --no-create-home nuxtuser
USER nuxtuser

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
