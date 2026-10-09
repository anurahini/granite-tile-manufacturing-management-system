# Multi-stage Dockerfile for Backend + Unified Frontend Build

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS build-frontend
WORKDIR /app/granite-tile-mms
COPY granite-tile-mms/package*.json ./
RUN npm install
COPY granite-tile-mms/ ./
RUN npm run build

# Stage 2: Express Backend Server
FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Copy built frontend assets so backend server (port 5000) can also serve full website UI
COPY --from=build-frontend /app/granite-tile-mms/dist /app/granite-tile-mms/dist

EXPOSE 5000
CMD ["npm", "start"]
