document.addEventListener('DOMContentLoaded', () => {

    const checkQuizBtn = document.getElementById('check-quiz-btn');
    const quizResult = document.getElementById('quiz-result');
    const resultText = document.getElementById('result-text');

    // Kunci Jawaban
    const correctAnswers = {
        q1: 'ohm',
        q2: '4a',
        q3: 'turun'
    };

    checkQuizBtn.addEventListener('click', () => {
        let score = 0;
        const totalQuestions = Object.keys(correctAnswers).length;
        
        // Loop setiap pertanyaan (q1, q2, q3)
        for (const [question, answer] of Object.entries(correctAnswers)) {
            
            const container = document.getElementById(`${question}-container`);
            
            // Hapus feedback sebelumnya (jika ada)
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
                    correctOptionLabel.classList.add('correct'); // Tandai jawaban benar
                    container.classList.add('correct-answer');
                } else {
                    // Jawaban SALAH
                    correctOptionLabel.classList.add('incorrect'); // Tandai jawaban salah
                    container.classList.add('incorrect-answer');
                    
                    // Tunjukkan juga jawaban yang benar
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

        // Scroll ke hasil
        quizResult.scrollIntoView({ behavior: 'smooth' });
    });
});