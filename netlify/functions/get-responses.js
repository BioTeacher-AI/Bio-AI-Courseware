export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: 'Method Not Allowed' })
    };
  }

  const targetUrl = process.env.RESPONSE_READ_URL;
  if (!targetUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: 'RESPONSE_READ_URL is not configured.' })
    };
  }

  try {
    const params = new URLSearchParams(event.queryStringParameters || {});
    const requestUrl = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}${params.toString()}`;
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { responses: [] };
    }

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ ok: false, error: data.error || 'Failed to fetch responses.', details: data })
      };
    }

    const responses = Array.isArray(data.responses) ? data.responses : Array.isArray(data) ? data : [];
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, responses })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message || 'Unexpected read error.' })
    };
  }
}
