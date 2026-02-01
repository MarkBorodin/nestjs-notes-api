# Stage 1: Build
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies (skip scripts to avoid husky prepare script)
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run the application
CMD ["node", "dist/src/main.js"]
