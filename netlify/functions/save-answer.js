exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, message: 'Method Not Allowed' })
    };
  }

  const targetUrl = process.env.GOOGLE_SCRIPT_SAVE_URL;

  if (!targetUrl) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: false,
        message: 'GOOGLE_SCRIPT_SAVE_URL 환경변수가 설정되지 않았습니다.'
      })
    };
  }

  try {
    const payload = event.body ? JSON.parse(event.body) : {};

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: text
    };
  } catch (error) {
    console.error('save-answer function error:', error);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: false,
        message: '답안 저장 중 서버 오류가 발생했습니다.',
        error: error.message
      })
    };
  }
};
