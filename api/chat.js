const KEYS = [
  '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',
  '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',
  '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',
  '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',
  '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',
  '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',
  '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',
  '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'
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body;
    let lastError = '';

    for (let i = 0; i < KEYS.length; i++) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + KEYS[i]
        },
        body: JSON.stringify(body)
      });

      if (response.status === 429 || response.status === 401) {
        lastError = 'key_' + i + '_limited';
        continue;
      }

      if (body.stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(decoder.decode(value));
        }
        return res.end();
      }

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    return res.status(429).json({ error: 'All keys exhausted: ' + lastError });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
