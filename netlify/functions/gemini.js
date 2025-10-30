// File: /netlify/functions/gemini.js
// Ini adalah "backend" kita untuk Netlify!

exports.handler = async function(event, context) {
    // 1. Hanya izinkan metode POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    // 2. Ambil API Key rahasia dari Environment Variable Netlify
    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    // 3. Ambil pesan dari frontend (pesan ada di 'event.body')
    let userInput;
    try {
        const body = JSON.parse(event.body);
        userInput = body.userInput;
    } catch (e) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Bad request: JSON invalid' }) };
    }
   
    if (!userInput) {
        return { statusCode: 400, body: JSON.stringify({ error: 'userInput is required' }) };
    }

    // 4. Siapkan "prompt" sistem
    const systemInstruction = "Kamu adalah 'Elsi', asisten AI yang ramah dan membantu di web e-learning elektronika dasar. Jawablah pertanyaan pengguna seputar elektronika dasar (resistor, transistor, hukum ohm, arus, dll). Jika pertanyaan di luar topik, tolak dengan sopan.";

    const requestBody = {
        "contents": [
            { "role": "user", "parts": [{ "text": systemInstruction }] },
            { "role": "model", "parts": [{ "text": "Baik! Saya Elsi. Siap membantu menjelaskan konsep elektronika dasar." }] },
            { "role": "user", "parts": [{ "text": userInput }] }
        ]
    };

    // 5. Kirim request ke Gemini dari server (backend)
    try {
        const geminiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!geminiResponse.ok) {
            throw new Error(`Gemini API error! status: ${geminiResponse.status}`);
        }

        const data = await geminiResponse.json();
        const aiText = data.candidates[0].content.parts[0].text;
        
        // 6. Kirim kembali JAWABANNYA saja ke frontend
        return {
            statusCode: 200,
            body: JSON.stringify({ text: aiText })
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch response from Gemini' })
        };
    }
};