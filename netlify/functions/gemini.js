// File: /netlify/functions/gemini.js
// VERSI FINAL: Menggunakan 'gemini-1.5-pro-latest'

exports.handler = async function(event, context) {
    console.log('Netlify function "gemini.js" dipanggil.');
    
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        console.error('FATAL ERROR: Variabel GEMINI_API_KEY tidak ditemukan (undefined)!');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error. API Key not found.' })
        };
    }
    console.log('API Key berhasil dimuat.');

    // ===============================================
    //           PERBAIKAN ADA DI BARIS INI (FIX)
    // ===============================================
    // Kita gunakan model terbaru: 'gemini-1.5-pro-latest'
    // Kita tetap pakai endpoint 'v1beta'
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`;
    // ===============================================

    let userInput;
    try {
        const body = JSON.parse(event.body);
        userInput = body.userInput;
        console.log('Menerima input:', userInput);
    } catch (e) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Bad request: JSON invalid' }) };
    }
   
    if (!userInput) {
        return { statusCode: 400, body: JSON.stringify({ error: 'userInput is required' }) };
    }

    const systemInstruction = "Kamu adalah 'Elsi', asisten AI yang ramah dan membantu di web e-learning elektronika dasar. Jawablah pertanyaan pengguna seputar elektronika dasar (resistor, transistor, hukum ohm, arus, dll). Jika pertanyaan di luar topik, tolak dengan sopan.";

    const requestBody = {
        "contents": [
            { "role": "user", "parts": [{ "text": systemInstruction }] },
            { "role": "model", "parts": [{ "text": "Baik! Saya Elsi. Siap membantu menjelaskan konsep elektronika dasar." }] },
            { "role": "user", "parts": [{ "text": userInput }] }
        ]
    };

    console.log('Mengirim request ke Gemini (model: 1.5-pro-latest)...');
    try {
        const geminiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.text();
            console.error('Gemini API error body:', errorBody);
            throw new Error(`Gemini API error! status: ${geminiResponse.status}`);
        }

        const data = await geminiResponse.json();
        
        if (!data.candidates || !data.candidates[0]) {
            console.error('Respon tidak valid dari Gemini:', data);
            throw new Error('Invalid response structure from Gemini.');
        }

        const aiText = data.candidates[0].content.parts[0].text;
        
        console.log('Berhasil mendapat balasan dari Gemini.');
        
        return {
            statusCode: 200,
            body: JSON.stringify({ text: aiText })
        };

    } catch (error) {
        console.error('Catch block error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch response from Gemini' })
        };
    }
};