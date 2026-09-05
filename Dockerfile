# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/
COPY admin/package*.json ./admin/

# Install dependencies
RUN npm --prefix server install
RUN npm --prefix client install
RUN npm --prefix admin install

# Copy source code
COPY . .

# Generate Prisma Client & Build frontends
RUN cd server && npx prisma generate
RUN npm --prefix client run build
RUN npm --prefix admin run build

# Production Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy necessary files from builder
COPY --from=builder /app /app

# Ensure uploads and prisma folders exist
RUN mkdir -p /app/server/uploads /app/server/prisma

EXPOSE 5000

CMD ["node", "server/src/index.js"]
