const express = require('express');
const cors = require('cors');
const portScanner = require('./utils/portScanner');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/scan', async (req, res) => {
    const { host } = req.body;
    if (!host) return res.status(400).json({ error: 'Host is required' });

    try {
        const result = await portScanner(host);
        res.json({ host, result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to scan host', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
