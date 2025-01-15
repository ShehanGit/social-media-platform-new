FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



# # Frontend Dockerfile
# FROM node:18-alpine as build
# WORKDIR /app
# COPY package.json yarn.lock ./
# RUN yarn install
# COPY . .
# RUN yarn build

# FROM nginx:1.23-alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
