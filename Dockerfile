FROM node:18-alpine AS build
WORKDIR /app
RUN apk add --no-cache git
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build


FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/migration ./migration
EXPOSE 3180
CMD ["node", "dist/main.js"]