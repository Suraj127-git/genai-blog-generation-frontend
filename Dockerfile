# Stage 1: Build the application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Declare build arguments
ARG VITE_API_BASE_URL
ARG VITE_ENABLE_ERROR_BOUNDARY
ARG VITE_ENABLE_SECURITY_HEADERS
ARG VITE_ENV

# Make them available during build time
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_ENABLE_ERROR_BOUNDARY=$VITE_ENABLE_ERROR_BOUNDARY
ENV VITE_ENABLE_SECURITY_HEADERS=$VITE_ENABLE_SECURITY_HEADERS
ENV VITE_ENV=$VITE_ENV

RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Install envsubst for environment variable substitution
RUN apk add --no-cache gettext

# Set default port
ENV PORT=80

# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/templates/nginx.conf.template

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE ${PORT}

ENTRYPOINT ["/docker-entrypoint.sh"]
