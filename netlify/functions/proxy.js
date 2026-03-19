exports.handler = async function (event) {
  const dataset = event.queryStringParameters?.dataset;

  const PRE_URL =
    process.env.GFORM_JSON_URL_PRE ||
    'https://script.google.com/macros/s/AKfycbwcIXi2O4vJARKHyRJNh5HA2BQsJ5nC4PqHviMI-1GRXTkjZBEELCN1uoCUrEL0qFqCKQ/exec';

  const POST_URL =
    process.env.GFORM_JSON_URL_POST ||
    'https://script.google.com/macros/s/AKfycbwGWHDZ3l1pufPPCDixCmighF6tmMlC31-Oa_hHlp9sFwMEEFr9fakdhh8KoL986_4/exec';

  let targetUrl = '';

  if (dataset === 'pre') {
    targetUrl = PRE_URL;
  } else if (dataset === 'post') {
    targetUrl = POST_URL;
  } else {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'dataset must be pre or post',
        receivedDataset: dataset ?? null
      })
    };
  }

  try {
    const response = await fetch(targetUrl, {
      redirect: 'follow',
      cache: 'no-store'
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
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to fetch Apps Script response',
        details: error.message
      })
    };
  }
};
