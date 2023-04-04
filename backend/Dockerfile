FROM node:16.18.0-alpine3.15

ARG DATABASE_URL
ARG JWT_SECRET
ARG PORT
ENV DATABASE_URL=${DATABASE_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV PORT=${PORT}

WORKDIR /app
COPY . .

RUN corepack enable
RUN pnpm i

RUN npx prisma db push

RUN pnpm run build

EXPOSE ${PORT} 5000


CMD ["pnpm", "run", "start:prod" ]