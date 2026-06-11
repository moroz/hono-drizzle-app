ARG NODE_VERSION=26-alpine
ARG GOOSE_VERSION=3.27.1

FROM node:${NODE_VERSION} AS build

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . ./

RUN pnpm build

FROM node:${NODE_VERSION} AS runner

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist/ ./
COPY src/db/migrations ./db/migrations/

CMD ["node", "./index.js"]