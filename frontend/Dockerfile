# =====================================================================
# T-AIMS FRONTEND DOCKERFILE
# Stage: Lightweight Nginx Alpine for Static Web Assets
# =====================================================================
FROM nginx:alpine

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy frontend source files
COPY . /usr/share/nginx/html/

# Custom default nginx port 3001 configuration
RUN sed -i 's/listen       80;/listen       3001;/g' /etc/nginx/conf.d/default.conf

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3001/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
