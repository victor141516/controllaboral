FROM node:lts-alpine as builder

WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm i
COPY . /app
RUN npm run build


FROM node:lts-alpine

WORKDIR /app
COPY --from=builder /app/dist /app/package.json /app/package-lock.json /app/
RUN npm install --only=production

CMD ["node", "index.js"]
