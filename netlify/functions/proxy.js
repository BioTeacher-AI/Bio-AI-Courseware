const proxyRequest = async (request) => {
  const urlObj = new URL(request.url);
  const dataset = urlObj.searchParams.get('dataset') || 'pre';

  const PRE_URL =
    process.env.GFORM_JSON_URL_PRE ||
    'https://script.google.com/macros/s/AKfycbwcIXi2O4vJARKHyRJNh5HA2BQsJ5nC4PqHviMI-1GRXTkjZBEELCN1uoCUrEL0qFqCKQ/exec';

  const POST_URL =
    process.env.GFORM_JSON_URL_POST ||
    'https://script.google.com/macros/s/AKfycbyP4-EIA334DbLzscfG-8i95-IOgn5cFk5Glik8LkqRzP3aW9L2qy1V7RqXmAnYwF8U/exec';

  const targetUrl = dataset === 'post' ? POST_URL : PRE_URL;

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: `Missing API URL for dataset: ${dataset}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const res = await fetch(targetUrl, {
    redirect: 'follow',
    cache: 'no-store'
  });

  const text = await res.text();

  return new Response(text, {
    status: res.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
};

export const handler = async (event) => {
  const baseUrl = event.rawUrl || `https://${event.headers.host}${event.path}`;
  const query = event.rawQuery ? `?${event.rawQuery}` : '';
  const response = await proxyRequest(new Request(`${baseUrl}${query}`));
  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: await response.text()
  };
};

export default proxyRequest;
