# 1단계: 앱 빌드
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
COPY . .
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV NODE_OPTIONS=--max-old-space-size=1024  
RUN npm install
RUN npm run build

# 2단계: 정적 파일 서빙
FROM node:18
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build ./build
EXPOSE 80

# dns 설정용 인증 파일 복사
COPY public/.well-known ./build/.well-known

CMD ["serve", "-s", "build", "-l", "80"]

#credential -> https://api-dev.소설고등학교.site로 변경