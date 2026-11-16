import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    evaluation: { type: "string" },
    ingredients: {
      type: "array",
      items: { type: "object", additionalProperties: false, properties: { name: { type: "string" }, amount: { type: "string" } }, required: ["name", "amount"] }
    },
    steps: { type: "array", items: { type: "string" } },
    changes: {
      type: "array",
      items: { type: "object", additionalProperties: false, properties: { item: { type: "string" }, reason: { type: "string" } }, required: ["item", "reason"] }
    },
    warnings: { type: "array", items: { type: "string" } },
    tips: { type: "array", items: { type: "string" } }
  },
  required: ["title", "summary", "evaluation", "ingredients", "steps", "changes", "warnings", "tips"]
};

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

function buildPrompt(body) {
  if (body.type === "recommend") {
    return `당신은 한국어로 답하는 요리 레시피 전문가입니다.
사용자의 냉장고 재료를 최대한 활용하면서 실제로 만들 수 있는 레시피를 추천하세요.
재료가 부족하면 억지로 있다고 가정하지 말고, 대체 가능 여부와 부족한 재료를 명확히 설명하세요.
재료의 역할, 맛, 식감, 조리 난이도와 실패 가능성을 고려하세요.

보유 재료: ${body.ingredients || "없음"}
만들고 싶은 음식: ${body.dish || "자유 추천"}
원하는 방식: ${body.style || "원래 음식의 특징을 최대한 유지"}
추가 조건: ${body.notes || "없음"}

반드시 최종적으로 실제 조리에 사용할 수 있는 재료량과 단계별 조리법을 제시하세요.`;
  }

  return `당신은 한국어로 답하는 레시피 변형 전문가입니다.
주어진 원래 레시피에서 사용자가 요청한 재료 대체와 양/비율 변경이 실제 조리에서 성립하는지 분석하세요.
단순히 "가능"이라고 하지 말고 각 재료가 원래 레시피에서 맡는 기능(수분, 지방, 결합, 응고, 점도, 염도, 향, 구조 등)을 고려하세요.
변경 때문에 다른 재료의 양이나 조리 과정도 바꿔야 한다면 반드시 수정하세요.
맛·향·식감·농도·색·보관성의 예상 변화와 실패 가능성, 복구 방법도 포함하세요.
정보가 부족하면 임의로 확정하지 말고 조건을 명시하세요.

레시피 이름: ${body.name || "입력 레시피"}
원래 레시피: ${body.recipe || "사진에서 레시피 내용을 읽어 분석해야 함"}
재료 대체: ${JSON.stringify(body.subs || [])}
양/비율 조절: ${JSON.stringify(body.ratios || [])}
사용자 목표: ${body.goal || "변경 후에도 전체 레시피가 자연스럽게 유지되도록 조정"}`;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST만 허용됩니다." });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "서버에 OPENAI_API_KEY가 설정되지 않았습니다." });

  try {
    const body = req.body || {};
    const content = [{ type: "input_text", text: buildPrompt(body) }];
    if (body.imageData) {
      content.push({ type: "input_image", image_url: body.imageData, detail: "auto" });
    }

    const response = await client.responses.create({
      model: body.imageData ? "gpt-6-astra" : "gpt-6-luna",
      reasoning: { effort: "low" },
      input: [{ role: "user", content }],
      text: {
        format: {
          type: "json_schema",
          name: "recipe_result",
          strict: true,
          schema
        }
      }
    });

    if (!response.output_text) throw new Error("AI가 결과를 반환하지 않았습니다.");
    const result = JSON.parse(response.output_text);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err?.message || "AI 요청 중 오류가 발생했습니다." });
  }
}
