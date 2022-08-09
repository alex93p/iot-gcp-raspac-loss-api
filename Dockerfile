FROM node:16-slim
RUN apt-get update && \
    apt-get install -y make g++ openssl

RUN mkdir -p /app
WORKDIR /app

COPY . .

RUN yarn install

RUN yarn run build

ENV NODE_OPTIONS \
  --max-old-space-size=96 \
  --trace-warnings \
  --trace-deprecation

EXPOSE 8080

CMD [ "node", "dist/src/main" ]
