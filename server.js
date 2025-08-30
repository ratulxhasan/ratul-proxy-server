const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('Missing URL');

  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    'Mozilla/5.0 (Linux; Android 10; SM-G973F)'
  ];
  const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': randomUA,
        'Referer': 'https://www.google.com',
        'Origin': 'https://www.google.com',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'X-Forwarded-For': '103.198.0.1',
        'CF-IPCountry': 'BD'
      }
    });

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const body = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType);
    res.send(body);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(500).send(`
      <html>
        <body style="background:#000;color:#fff;text-align:center;padding:2em">
          <h2>⚠️ Stream Blocked or Unavailable</h2>
          <p>Try refreshing or switching to a backup stream.</p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy running at http://localhost:${PORT}/proxy`);
});
