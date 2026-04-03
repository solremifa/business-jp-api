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
const pool = require('./db');

app.post("/api/correct", async (req, res) => {
    const { text, context } = req.body;

    try {
        // 1. AI 모델 설정 및 요청
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite",
            // 구글 API가 기대하는 표준 객체 구조로 감싸줍니다.
            systemInstruction: {
                role: "system",
                parts: [{ text: JP_BUSINESS_EXPERT }]
            },
            generationConfig: { responseMimeType: "application/json" } 
});

        const prompt = `상황: ${context}\n입력 문장: ${text}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // 2. 응답 텍스트 정제 (마크다운 제거)
        let rawText = response.text();
        const cleanText = rawText.replace(/```json|```/g, "").trim();
        
        // 3. [중요] JSON 파싱을 가장 먼저 합니다!
        // 여기서 에러가 나면 바로 catch(error)로 넘어가서 DB 저장을 시도하지 않습니다.
        const data = JSON.parse(cleanText);

        // 4. DB 저장 로직 (이제 data 변수를 안전하게 사용할 수 있습니다)
        const query = `
            INSERT INTO correction_history (context, original_text, corrected_text) 
            VALUES (?, ?, ?)
        `;

        // AI가 혹시나 corrected_text가 아닌 다른 이름으로 줬을 경우를 대비
        const finalCorrectedText = data.corrected_text || data.correctedText || data.result;
        
        await pool.query(query, [
            context,
            text,
            finalCorrectedText // 파싱된 객체에서 꺼내 쓰기
        ]);

        console.log("✅ DB 저장 성공:", data.corrected_text);

        // 5. 최종 결과 반환 (단 한 번만!)
        res.json(data);

    } catch (error) {
        // AI 에러, JSON 파싱 에러, DB 에러 모두 여기서 처리됩니다.
        console.error("❌ 서버 처리 중 에러 발생:", error);
        res.status(500).json({ 
            error: "처리 중 오류가 발생했습니다.",
            message: error.message 
        });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));