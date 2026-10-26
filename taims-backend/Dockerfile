FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY node_modules/ ./node_modules/
COPY src/ ./src/

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) process.exit(1);})"

CMD ["node", "src/app.js"]
