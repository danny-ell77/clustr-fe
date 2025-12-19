# Staging Dockerfile for ClustR Frontend (Nuxt 3)
FROM oven/bun:1

WORKDIR /app

ENV NODE_ENV=production

# Define build arguments for SPA environment variables
ARG NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy application code
COPY . .

# Build the application
RUN bun run build

# Create non-root user
RUN useradd -r -s /bin/false nuxtuser
USER nuxtuser

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
