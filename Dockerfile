# 1. 가볍고 안정적인 Node.js 알핀 이미지를 사용합니다.
FROM node:20-alpine

# 2. 컨테이너 내부 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. 의존성 파일만 먼저 복사 (캐시 효율을 위해)
COPY package*.json ./

# 4. 의존성 설치 (프로덕션용으로 설치하여 용량 최적화)
RUN npm install

# 5. 소스 코드 전체 복사
COPY . .

# 6. 앱이 사용할 포트 명시
EXPOSE 3000

# 7. 서버 실행
CMD ["node", "app.js"]