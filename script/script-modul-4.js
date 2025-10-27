document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIKA MODUL 4: TRANSISTOR SWITCH ---
    const transistorSwitch = document.getElementById('transistor-switch');
    const baseFlowViz = document.getElementById('base-flow-viz');
    const collectorFlowViz = document.getElementById('collector-flow-viz');
    const transistorLed = document.getElementById('transistor-led');
    const transistorStatus = document.getElementById('transistor-status');

    function toggleTransistor() {
        if (transistorSwitch.checked) {
            baseFlowViz.style.animationPlayState = 'running';
            collectorFlowViz.style.animationPlayState = 'running';
            transistorLed.className = 'led-on';
            transistorStatus.textContent = 'Status: Arus Basis mengalir, LED Menyala!';
        } else {
            baseFlowViz.style.animationPlayState = 'paused';
            collectorFlowViz.style.animationPlayState = 'paused';
            transistorLed.className = 'led-off';
            transistorStatus.textContent = 'Status: Tidak ada Arus Basis, LED Mati.';
        }
    }

    transistorSwitch.addEventListener('input', toggleTransistor);

    toggleTransistor();
});