# 1단계: 앱 빌드
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_OPTIONS=--max-old-space-size=1024
RUN npm run build

# 2단계: 정적 파일 서빙
FROM node:18
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
