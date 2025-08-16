# Multi-stage build for optimal image size
# Build stage
FROM oven/bun:slim AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json bun.lock ./

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN bun install --frozen-lockfile

# Build the application
RUN bun build src/index.ts --target bun --minify --outfile index.js


# Production stage
FROM oven/bun:slim

# Set working directory
WORKDIR /app

# Copy only the built binary from build stage with executable permissions preserved
COPY --chown=nonroot:nonroot --from=builder /app/index.js ./

# Copy package.json
COPY --chown=nonroot:nonroot package.json ./

# Use exec form for better signal handling
CMD ["bun", "./index.js", "env"] 