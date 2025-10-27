document.addEventListener('DOMContentLoaded', () => {

    const checkQuizBtn = document.getElementById('check-quiz-btn');
    const quizResult = document.getElementById('quiz-result');
    const resultText = document.getElementById('result-text');

    // Kunci Jawaban untuk Modul 2
    const correctAnswers = {
        q1: 'b', // Menghambat arus
        q2: 'd', // Ohm
        q3: 'c', // 1000 Ohm 5%
        q4: 'a', // Kuning, Ungu, Oranye, Perak
        q5: 'c'  // Faktor pengali
    };

    checkQuizBtn.addEventListener('click', () => {
        let score = 0;
        const totalQuestions = Object.keys(correctAnswers).length;
        
        // Loop setiap pertanyaan
        for (const [question, answer] of Object.entries(correctAnswers)) {
            
            const container = document.getElementById(`${question}-container`);
            
            // Hapus feedback sebelumnya
            container.classList.remove('correct-answer', 'incorrect-answer');
            container.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('correct', 'incorrect');
            });
            
            // Dapatkan jawaban pilihan pengguna
            const selectedOption = document.querySelector(`input[name="${question}"]:checked`);
            
            if (selectedOption) {
                const userAnswer = selectedOption.value;
                const correctOptionLabel = selectedOption.parentElement;
                
                if (userAnswer === answer) {
                    // Jawaban BENAR
                    score++;
                    correctOptionLabel.classList.add('correct');
                    container.classList.add('correct-answer');
                } else {
                    // Jawaban SALAH
                    correctOptionLabel.classList.add('incorrect');
                    container.classList.add('incorrect-answer');
                    
                    // Tunjukkan jawaban yang benar
                    const correctValueLabel = document.querySelector(`input[value="${answer}"]`).parentElement;
                    correctValueLabel.classList.add('correct');
                }
            } else {
                // Tidak dijawab
                container.classList.add('incorrect-answer');
            }
        }
        
        // Tampilkan hasil
        resultText.textContent = `Anda menjawab ${score} dari ${totalQuestions} pertanyaan dengan benar.`;
        quizResult.classList.remove('hidden');
        quizResult.scrollIntoView({ behavior: 'smooth' });
    });
});