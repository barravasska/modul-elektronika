// File: /netlify/functions/gemini.js
// VERSI DENGAN DEBUG LOG

exports.handler = async function(event, context) {
    console.log('Netlify function "gemini.js" dipanggil.'); // DEBUG 1
    
    // 1. Hanya izinkan metode POST
    if (event.httpMethod !== 'POST') {
        console.warn('Metode tidak diizinkan:', event.httpMethod);
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    // 2. Ambil API Key rahasia
    const API_KEY = process.env.GEMINI_API_KEY;

    // ===============================================
    //           KODE DEBUG PENTING
    // ===============================================
    // Cek apakah API Key-nya KOSONG atau TIDAK
    if (!API_KEY) {
        console.error('FATAL ERROR: Variabel GEMINI_API_KEY tidak ditemukan (undefined)!');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error. API Key not found.' })
        };
    }
    // Jika tidak kosong, log 4 huruf pertamanya (ini aman)
    console.log('API Key berhasil dimuat, dimulai dengan: ' + API_KEY.substring(0, 4) + '...');
    // ===============================================

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    // 3. Ambil pesan dari frontend
    let userInput;
    try {
        const body = JSON.parse(event.body);
        userInput = body.userInput;
        console.log('Menerima input:', userInput); // DEBUG 2
    } catch (e) {
        console.error('Gagal parse JSON body:', e);
        return { statusCode: 400, body: JSON.stringify({ error: 'Bad request: JSON invalid' }) };
    }
   
    if (!userInput) {
        console.warn('Input pengguna kosong.');
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

    // 5. Kirim request ke Gemini
    console.log('Mengirim request ke Gemini...');
    try {
        const geminiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!geminiResponse.ok) {
            // Log error dari Google jika gagal
            const errorBody = await geminiResponse.text();
            console.error('Gemini API error body:', errorBody); // DEBUG 3 (Lebih detail)
            throw new Error(`Gemini API error! status: ${geminiResponse.status}`); // Ini baris 50 yang lama
        }

        const data = await geminiResponse.json();
        const aiText = data.candidates[0].content.parts[0].text;
        
        console.log('Berhasil mendapat balasan dari Gemini.'); // DEBUG 4
        
        // 6. Kirim kembali JAWABANNYA saja ke frontend
        return {
            statusCode: 200,
            body: JSON.stringify({ text: aiText })
        };

    } catch (error) {
        console.error('Catch block error:', error); // DEBUG 5
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch response from Gemini' })
        };
    }
};