# Multi-stage Docker build for Farkle Game

# Stage 1: Build the core package
FROM node:20-alpine AS builder-core

WORKDIR /app

# Copy root package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy core package
COPY packages/core/ ./packages/core/

# Build core package
RUN yarn workspaces focus @farkle/core && yarn build

# Stage 2: Build the web app
FROM node:20-alpine AS builder-web

WORKDIR /app

# Copy root package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy web app
COPY apps/web/ ./apps/web/

# Copy built core package from previous stage
COPY --from=builder-core /app/packages/core/dist ./packages/core/dist
COPY --from=builder-core /app/packages/core/package.json ./packages/core/package.json

# Build web app
RUN yarn workspaces focus @farkle/web && yarn build

# Stage 3: Production server
FROM nginx:alpine AS production

# Copy built app from builder stage
COPY --from=builder-web /app/apps/web/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy PWA assets
COPY apps/web/public/* /usr/share/nginx/html/

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
