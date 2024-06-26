ARG NODE_VERSION=20.14.0

FROM node:${NODE_VERSION}-slim as base

ARG PORT=3000
ARG NUXT_AUTH_BASE_URL

ENV NODE_ENV=production
ENV NUXT_AUTH_BASE_URL=${NUXT_AUTH_BASE_URL}

WORKDIR /src

# Build
FROM base as build

COPY package.json yarn.lock .
RUN yarn install --production=false

COPY . .

RUN yarn run build

# Run
FROM base as app

ENV PORT=$PORT

COPY --from=build /src/.output /src/.output
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]