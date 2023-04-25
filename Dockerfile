FROM node:18.16.0 AS common

WORKDIR /caffe

COPY package.json pnpm-*.yaml ./
COPY src/server/package.json  src/server/

RUN corepack enable


FROM common AS build

RUN pnpm i --frozen-lockfile -D

COPY . .

RUN pnpm build


FROM common AS module

RUN pnpm i --frozen-lockfile -P


FROM node:18.16.0-bullseye-slim AS runner

WORKDIR /caffe

ENV NODE_ENV=production

RUN apt-get update && \
  apt-get install -y --no-install-recommends tini && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  corepack enable

COPY package.json pnpm-*.yaml next.config.js ./
COPY src/server/package.json  src/server/
COPY src/server/prisma/schema.prisma src/server/prisma/
COPY --from=module /caffe/node_modules ./node_modules
COPY --from=build /caffe/.next ./.next
COPY --from=build /caffe/built ./built
COPY --from=build /caffe/public ./public

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["pnpm", "migrateandstart"]
