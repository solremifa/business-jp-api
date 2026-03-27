// 1. 환경 변수 설정을 최상단으로 올립니다.
require("dotenv").config(); 

const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const { JP_BUSINESS_EXPERT } = require('./prompts');

// 2. 이제 키가 정상적으로 출력될 것입니다.
console.log("현재 로드된 API KEY:", process.env.GEMINI_API_KEY ? "존재함" : "없음(undefined)");

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/correct", async (req, res) => {
    const { text, context } = req.body;

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite",
            systemInstruction: JP_BUSINESS_EXPERT,
            generationConfig: { responseMimeType: "application/json" } 
        });

        const prompt = `상황: ${context}\n입력 문장: ${text}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // 1. 원본 텍스트 가져오기
        let rawText = response.text();
        console.log("AI 원본 응답:", rawText); // 디버깅용 로그

        // 2. 마크다운 기호(```json 등)가 섞여 있다면 제거 (방어 코드)
        const cleanText = rawText.replace(/```json|```/g, "").trim();

        try {
            // 3. 안전하게 파싱
            const data = JSON.parse(cleanText);
            res.json(data);
        } catch (parseError) {
            console.error("JSON 파싱 에러 발생 위치:", parseError.message);
            // 파싱 실패 시 원본이라도 보내주거나 에러 처리
            res.status(500).json({ 
                error: "JSON 형식이 올바르지 않습니다.",
                rawResponse: rawText 
            });
        }

    } catch (error) {
        console.error("서버 에러:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));