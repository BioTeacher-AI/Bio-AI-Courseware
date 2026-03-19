export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: 'Method Not Allowed' })
    };
  }

  const targetUrl = process.env.RESPONSE_SAVE_URL;
  if (!targetUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: 'RESPONSE_SAVE_URL is not configured.' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ ok: false, error: data.error || 'Failed to save response.', details: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, result: data })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message || 'Unexpected save error.' })
    };
  }
}
