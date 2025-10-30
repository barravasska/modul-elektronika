document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen UI ---
    const fab = document.getElementById('ai-fab');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('ai-close-btn');
    const sendBtn = document.getElementById('ai-send-btn');
    const aiInput = document.getElementById('ai-input');
    const chatBody = document.getElementById('ai-chat-body');

    // --- Cek jika elemen ada (mencegah error) ---
    if (!fab || !chatWindow || !closeBtn || !sendBtn || !aiInput || !chatBody) {
        console.warn('Elemen AI Assistant tidak ditemukan di halaman ini.');
        return; // Hentikan eksekusi jika UI tidak ada
    }

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
        const typingIndicator = addMessageToChat('Elsi sedang mengetik...', 'ai-message typing');

        try {
            // 3. Panggil API (lewat backend Netlify)
            const aiResponse = await getGeminiResponse(userMessage);
            
            // 4. Hapus "sedang mengetik" & tampilkan jawaban AI
            chatBody.removeChild(typingIndicator);
            addMessageToChat(aiResponse, 'ai');

        } catch (error) {
            // 4b. Hapus "sedang mengetik" & tampilkan error
            chatBody.removeChild(typingIndicator);
            addMessageToChat('Maaf, terjadi kesalahan. Server backend saya mungkin sedang tidur atau error. Coba lagi nanti.', 'ai');
            console.error('Error fetching from Netlify function:', error);
        }
    }

    // --- Fungsi Helper untuk Menambah Pesan ke UI ---
    function addMessageToChat(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        
        // Bersihkan teks sebelum dimasukkan (keamanan dasar)
        const p = document.createElement('p');
        p.innerHTML = text; // Gunakan innerHTML agar tag <br> dan <strong> dirender
        messageDiv.appendChild(p);
        
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
            const errorData = await response.json();
            throw new Error(`Server error! status: ${response.status}. Pesan: ${errorData.error}`);
        }

        const data = await response.json();
        
        // 3. Jawabannya sekarang lebih sederhana
        const aiText = data.text;
        
        // Bersihkan sedikit (Gemini kadang menambah markdown)
        // dan ubah baris baru \n menjadi tag <br>
        return aiText
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/\n/g, '<br>'); // New lines
    }
});