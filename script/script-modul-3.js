document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIKA MODUL 3: SIMULASI ARUS ---
    const vSlider = document.getElementById('v-slider');
    const rSlider = document.getElementById('r-slider');
    
    const vValueDisplay = document.getElementById('v-value-display');
    const rValueDisplay = document.getElementById('r-value-display');
    const iResultDisplay = document.getElementById('i-result-display');
    
    const wireViz = document.getElementById('wire-viz');

    function updateCurrentAnimation() {
        const v = parseFloat(vSlider.value);
        const r = parseFloat(rSlider.value);
        const i = v / r;

        vValueDisplay.textContent = v;
        rValueDisplay.textContent = r;
        iResultDisplay.textContent = i.toFixed(3); 

        if (i < 0.01) {
            wireViz.style.animationPlayState = 'paused';
        } else {
            let duration = 1 / i; 
            duration = Math.max(0.1, Math.min(duration, 20));

            wireViz.style.animationDuration = `${duration}s`;
            wireViz.style.animationPlayState = 'running';
        }
    }

    vSlider.addEventListener('input', updateCurrentAnimation);
    rSlider.addEventListener('input', updateCurrentAnimation);

    updateCurrentAnimation();
});