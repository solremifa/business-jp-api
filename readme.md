# 🇯🇵 비즈니스 일본어 경어 교정 API (JP Business Assistant)

AI를 활용하여 어색한 일본어 문장을 격식 있는 비즈니스 경어로 교정하고, 상세한 매너 팁을 제공하는 백엔드 서버입니다.

## ✨ 주요 기능
- **문장 교정**: 상황(메일, 미팅 등)에 맞는 최적의 경어(존경어/겸양어) 제안
- **의도 파악**: '우치-소토' 문화를 반영한 자연스러운 문맥 교정
- **상세 가이드**: 교정 포인트에 대한 한국어 설명 제공

## 🛠 기술 스택
- **Runtime**: Node.js (Express)
- **AI Engine**: Google Gemini 1.5 Flash
- **Infrastructure**: Docker, Docker Compose
- **Tools**: Git, Postman

## ⚙️ 실행 방법
프로젝트를 로컬 환경에서 실행하는 방법입니다.

1. **환경 변수 설정**: `.env` 파일에 API 키를 입력합니다.
   ```env
   GEMINI_API_KEY=your_api_key_here
2. **Docker 실행**: 
    docker-compose up --build -d

📖 API 문서
[POST] /api/correct
비즈니스 일본어 문장을 교정합니다.

Request Body
| 필드 | 타입 | 설명 |
| :--- | :--- | :--- |
| text | String | 교정할 일본어 원문 |
| context | String | 비즈니스 상황 (예: 거래처 방문) |

Response (JSON)

JSON
{
  "corrected_text": "...",
  "translation": "...",
  "key_points": ["..."]
}

---