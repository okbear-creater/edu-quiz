import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request) {
  const { input } = await request.json();

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generationConfig = {
    temperature: 0.1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  };

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "내가 영어 지문을 번호랑 난이도랑 같이 입력하면 너는 해당하는 번호의 문제 유형에 맞게, 난이도에 맞게 문제를 만들어 내. 문제는 항상 지문이랑 같이 출력해. 난이도는 easy, normal, hard, super hard 이렇게 4단계가 있어. 한국 수능 문제처럼 하면 돼. 그리고 답도 제공해. 유형에 맞게 변형하고 난이도 맞게 하면서. \n\n유형은 내가 제공해 줄게. 이거야. \n\n1번 목적\n\n다음 글의 목적으로 가장 적절한 것은?\n\n2번 심경변화\n\n3번 주장\n\n다음 글에서 필자가 주장하는 바로 가장 적절한 것은?\n\n4번 의미하는 바\n\n밑줄 친 make oneself public to oneself 가 다음 글에서 의미 하는 바로 가장 적절한 것은?\n\n5번 요지\n\n다음 글의 요지로 가장 적절한 것은?\n\n6번 주제\n\n다음 글의 주제로 가장 적절한 것은?\n\n7번 제목\n\n다음 글의 제목으로 가장 적절한 것은?\n\n8번 내용 일치\n\n9번 어법\n\n다음 글의 밑줄 친 부분 중,어법상 틀린 것은?\n\n10번 어휘\n\n다음 글의 밑줄 친 부분 중, 문맥상 낱말의 쓰임이 적절하지 않은 것은?\n\n11번 짧은 빈칸 추론\n\n다음 빈칸에 들어갈 말로 가장 적절한 것을 고르시오. \n\n12번 긴 빈칸 추론\n\n다음 빈칸에 들어갈 말로 가장 적절한 것을 고르시오.\n\n13번 무관한 문장\n\n다음 글에서 전체 흐름과 관계 없는 문장은?\n\n14번 순서 배열\n\n주어진 글 다음에 이어질 글의 순서로 가장 적절한 것을 고르시오.\n\n15번 문장 삽입\n\n글의 흐름으로 보아, 주어진 문장이 들어가기에 가장 적절한 곳을 고르시오.\n\n16번 요약문 완성\n\n다음 글의 내용을 한 문장으로 요약하고자 한다. 빈칸 (A), (B)에 들어갈 말로 가장 적절한 것은?"},
        ],
      },
    ],
  });

  try {
    const result = await chatSession.sendMessage(input);
    const formattedResult = result.response.text().replace(/\n/g, '<br>');
    return NextResponse.json({ result: formattedResult });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}