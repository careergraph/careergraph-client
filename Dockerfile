# ============================================
# CareerGraph Client - Dockerfile
# ============================================

# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Build args for env vars at build time
ARG VITE_API_BASE_URL=http://localhost:8080/careergraph/api/v1
ARG VITE_GEMINI_API_KEY=
ARG VITE_RTC_BASE_URL=http://localhost:4000
ARG VITE_GOOGLE_CLIENT_ID=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_RTC_BASE_URL=$VITE_RTC_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN yarn build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
