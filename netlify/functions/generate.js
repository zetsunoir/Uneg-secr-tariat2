exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const system = body.system;
    const user = body.user;

    if (!system || !user) {
      return {
        statusCode: 400,
        body: JSON.stringify({ text: 'Paramètres manquants: ' + JSON.stringify(body) })
      };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: system,
        messages: [{ role: 'user', content: user }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || JSON.stringify(data);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ text: 'ERREUR: ' + err.message })
    };
  }
};
