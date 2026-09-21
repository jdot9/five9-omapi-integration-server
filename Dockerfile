# Build stage
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build NestJS application
RUN npm run build

# Production stage
FROM node:22-alpine AS production
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

# Application port
EXPOSE 3000

# Start NestJS
CMD ["node", "dist/main.js"]