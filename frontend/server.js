const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Proxy endpoint: receives form from browser and forwards to backend service
app.post('/submit', async (req, res) => {
  try {
    // In docker-compose, the backend service name is "backend" and listens on 5000
    const backendUrl = process.env.BACKEND_URL || 'http://backend:5000/submit';
    const resp = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Frontend listening on port ${PORT}`);
});
