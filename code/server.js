const express = require('express');
const app = express();
require('dotenv').config();

app.post('/api/ask', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}?key=${process.env.Gemini_api_key}`, {
            // ... same options as before
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get response' });
    }
}); 