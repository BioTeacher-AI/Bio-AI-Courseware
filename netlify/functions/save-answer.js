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

  let payload = {};
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch (error) {
    console.error('save-answer invalid body:', error);
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, message: '요청 본문(JSON) 형식이 올바르지 않습니다.' })
    };
  }

  try {
    const formBody = new URLSearchParams({
      payload: JSON.stringify(payload)
    }).toString();

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
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
