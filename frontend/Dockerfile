# Stage 1: Build the React application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from build stage to Nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Make port 80 available for the app
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]