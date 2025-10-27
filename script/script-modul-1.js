// Tunggu sampai semua elemen HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Selektor DOM ---
    const vInput = document.getElementById('v-input');
    const rInput = document.getElementById('r-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const iResult = document.getElementById('i-result');
    const lampu = document.getElementById('lampu');
    const lampuStatus = document.getElementById('lampu-status');

    // --- Logika Interaktif (E-Learning) ---
    function hitungArus() {
        // ... (salin semua fungsi hitungArus dari script lama) ...
        const v = parseFloat(vInput.value);
        const r = parseFloat(rInput.value);
        
        if (r === 0) {
            iResult.textContent = "Tidak terdefinisi (R tidak boleh 0)";
            updateLampu(0);
        } else if (v > 0 && r > 0) {
            const i = v / r; 
            iResult.textContent = i.toFixed(3); 
            updateLampu(i);
        } else {
            iResult.textContent = "Masukkan nilai V dan R yang valid (> 0)";
            updateLampu(0);
        }
    }

    function updateLampu(arus) {
        // ... (salin semua fungsi updateLampu dari script lama) ...
        if (arus > 0.01) { 
            lampu.className = 'lampu-on';
            lampuStatus.textContent = `Lampu menyala! (Arus: ${arus.toFixed(3)} A)`;
            let opacity = Math.min(arus / 0.05, 1); 
            lampu.style.opacity = 0.5 + (opacity * 0.5); 
            lampu.style.textShadow = `0 0 ${5 + (opacity * 20)}px #ffc107`; 
        } else {
            lampu.className = 'lampu-off';
            lampuStatus.textContent = "Lampu mati (arus terlalu kecil)";
            lampu.style.opacity = 1; 
            lampu.style.textShadow = 'none'; 
        }
    }

    // --- Event Listeners ---
    calculateBtn.addEventListener('click', hitungArus);
    vInput.addEventListener('input', hitungArus);
    rInput.addEventListener('input', hitungArus);

    hitungArus(); // Hitung sekali saat halaman dimuat
});