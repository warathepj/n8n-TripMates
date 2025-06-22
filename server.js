const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs').promises; // Import fs.promises for async file operations

const app = express();
app.use(express.json()); // To parse JSON request bodies
const PORT = process.env.PORT || 3000;

// Variable to store db.json data
let dbData = {};

// Function to load db.json data
async function loadDbData() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'db.json'), 'utf8');
        dbData = JSON.parse(data);
        console.log('db.json loaded successfully.');
    } catch (error) {
        console.error('Error loading db.json:', error.message);
        dbData = {}; // Ensure dbData is empty on error
    }
}

// Load db.json data when the server starts
loadDbData();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for the root URL to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// New route to handle form submissions
app.post('/submit-form', async (req, res) => {
    const formData = req.body;
    console.log('Received form data from client:', formData);

    const webhookUrl = 'http://localhost:5678/webhook-test/7845767d-5f11-4705-af26-04c20d974b9b';

    // Merge form data with db.json data before sending to webhook
    const payload = {
        formData: formData,
        dbData: dbData // Include db.json data in the payload
    };

    try {
        const webhookResponse = await axios.post(webhookUrl, payload); // Send the merged payload
        console.log('Successfully forwarded data to webhook:', webhookResponse.data);
        res.json({ message: 'Form data received and forwarded successfully!', webhookStatus: webhookResponse.status, webhookData: webhookResponse.data });
    } catch (error) {
        console.error('Error forwarding data to webhook:', error.message);
        // Respond to the client with an error message
        res.status(500).json({ message: `Failed to forward form data to webhook: ${error.message}`, error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
