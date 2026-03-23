function extractResponseText(payload) {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  if (Array.isArray(payload?.output)) {
    const texts = payload.output.flatMap((item) => {
      if (!Array.isArray(item?.content)) return [];
      return item.content
        .map((contentItem) => {
          if (typeof contentItem?.text === 'string') return contentItem.text;
          if (typeof contentItem?.output_text === 'string') return contentItem.output_text;
          if (typeof contentItem?.value === 'string') return contentItem.value;
          if (typeof contentItem?.content?.[0]?.text === 'string') return contentItem.content[0].text;
          return '';
        })
        .filter(Boolean);
    });

    if (texts.length) {
      return texts.join('\n').trim();
    }
  }

  return '';
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'OPENAI_API_KEY is not configured.' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        input: [
          {
            role: 'system',
            content:
              '너는 고등학교 기관계 단원의 학습 결과를 분석하는 AI 학습 코치다. 학생의 사전/사후 결과와 부족 문항을 바탕으로 격려하는 어조의 추천 문장을 한국어로 작성하라. 부족한 차시가 있다면 우선 복습할 차시를 제안하고, 부족 문항을 근거로 설명하며, 마지막에는 예상하기/설명하기/정리하기 중 다시 보면 좋을 활동을 짧게 추천하라. 답변은 3~5문장 이내로 간결하게 작성하라.'
          },
          {
            role: 'user',
            content: JSON.stringify(payload)
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: data?.error?.message || 'Failed to generate recommendation.'
        })
      };
    }

    const recommendation = extractResponseText(data);

    if (!recommendation) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: '추천 문장을 생성하지 못했습니다.' })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recommendation })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Unexpected analyze-learning error.' })
    };
  }
}
