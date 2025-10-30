// ===============================================
    //      FUNGSI UTAMA (VERSI NETLIFY - AMAN)
    // ===============================================
    async function getGeminiResponse(userInput) {
        
        // 1. API_URL sekarang menunjuk ke fungsi Netlify kita!
        //    Ini adalah path default Netlify.
        const API_URL = '/.netlify/functions/gemini'; 

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // 2. Kita HANYA kirim pesan pengguna.
            body: JSON.stringify({ userInput: userInput }) 
        });

        if (!response.ok) {
            throw new Error(`Server error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // 3. Jawabannya sekarang lebih sederhana
        const aiText = data.text;
        
        // Bersihkan sedikit (Gemini kadang menambah markdown)
        return aiText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    }