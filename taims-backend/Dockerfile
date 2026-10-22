FROM node:18-alpine

WORKDIR /app

# Copy package files (untuk referensi)
COPY package*.json ./

# Copy node_modules dari host (sudah lengkap & teruji)
COPY node_modules/ ./node_modules/

# Copy source code
COPY src/ ./src/

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=5 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => { if (r.statusCode !== 200) process.exit(1); }).on('error', () => process.exit(1))"

CMD ["node", "src/app.js"]
