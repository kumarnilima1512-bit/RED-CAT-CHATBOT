FROM node:alpine AS builder

WORKDIR /home/app

COPY package*.json ./

RUN npm install

COPY . .


RUN npm run build

FROM node:alpine AS runner

WORKDIR /home/app

COPY --from=builder /home/app/.output ./

EXPOSE 3000 

ENTRYPOINT ["node", ".output/server/index.mjs"]