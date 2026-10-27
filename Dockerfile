FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build
ENV NODE_ENV=production PORT=3000
RUN chown -R node:node /app/.next
USER node
EXPOSE 3000
CMD ["npm", "start"]
