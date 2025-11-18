FROM node:22-alpine
WORKDIR /usr/src/app

RUN npm install -g pnpm@10.20.0 serve

ARG VITE_API_URL=http://localhost:8081
ENV VITE_API_URL=$VITE_API_URL

COPY backend/src /usr/src/backend/src
COPY backend/tsconfig.json /usr/src/backend/tsconfig.json

COPY client ./
RUN pnpm install
RUN pnpm vite build

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
