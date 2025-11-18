FROM node:25-alpine
WORKDIR /usr/src/app

RUN npm install -g pnpm@10.20.0

COPY backend ./

RUN pnpm install
RUN pnpm run build

EXPOSE 3001
CMD sh -c "node dist/src/scripts/seed-patients.js || true && pnpm start" # seed the database and start the server
