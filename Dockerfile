# Use the official Bun image
FROM oven/bun:

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json bun.lock ./

# Copy project files
COPY . .

# Install dependencies
RUN bun install --production
RUN bun run build

# Start the application
CMD ["./gcp-codespaces-manager" "env"] 