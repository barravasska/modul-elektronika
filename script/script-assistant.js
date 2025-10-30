document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen UI ---
    const fab = document.getElementById('ai-fab');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('ai-close-btn');
    const sendBtn = document.getElementById('ai-send-btn');
    const aiInput = document.getElementById('ai-input');
    const chatBody = document.getElementById('ai-chat-body');

    // --- Buka/Tutup Jendela Chat ---
    fab.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
    });
    closeBtn.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // --- Kirim Pesan ---
    sendBtn.addEventListener('click', sendMessage);
    aiInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const userMessage = aiInput.value.trim();
        if (userMessage === '') return;

        // 1. Tampilkan pesan pengguna di chat
        addMessageToChat(userMessage, 'user');
        aiInput.value = '';

        // 2. Tampilkan indikator "sedang mengetik"
        const typingIndicator = addMessageToChat('AI sedang mengetik...', 'ai-message typing');

        try {
            // 3. Panggil API Gemini
            const aiResponse = await getGeminiResponse(userMessage);
            
            // 4. Hapus "sedang mengetik" & tampilkan jawaban AI
            chatBody.removeChild(typingIndicator);
            addMessageToChat(aiResponse, 'ai');

        } catch (error) {
            // 4b. Hapus "sedang mengetik" & tampilkan error
            chatBody.removeChild(typingIndicator);
            addMessageToChat('Maaf, terjadi kesalahan. Coba lagi nanti.', 'ai');
            console.error('Error fetching Gemini:', error);
        }
    }

    // --- Fungsi Helper untuk Menambah Pesan ke UI ---
    function addMessageToChat(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        messageDiv.innerHTML = `<p>${text}</p>`; // Gunakan innerHTML agar bisa render markdown sederhana
        chatBody.appendChild(messageDiv);

        // Auto-scroll ke pesan terbaru
        chatBody.scrollTop = chatBody.scrollHeight;
        return messageDiv; // Kembalikan elemen untuk referensi (penting untuk "typing")
    }

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
});