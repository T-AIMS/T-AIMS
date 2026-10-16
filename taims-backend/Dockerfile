# =====================================================================
# T-AIMS BACKEND DOCKERFILE
# Stage: Node.js Alpine Environment
# =====================================================================
FROM node:18-alpine

WORKDIR /app

# Install build dependencies for native modules (e.g. bcrypt)
RUN apk add --no-cache python3 make g++ gcc

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Environment Defaults
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/monitoring/health || exit 1

CMD ["npm", "start"]
