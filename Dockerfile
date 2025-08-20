FROM node:20-alpine

# --- build-time parameters coming from GitLab CI -----------------
ARG POSTGRES_PRISMA_URL
ENV POSTGRES_PRISMA_URL=$POSTGRES_PRISMA_URL
# ----------------------------------------------------------------

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]