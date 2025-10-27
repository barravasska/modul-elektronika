document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIKA MODUL 2: KALKULATOR RESISTOR ---
    const colorValues = {
        hitam:  { value: 0, multiplier: 1,       tolerance: null,    css: 'color-hitam' },
        coklat: { value: 1, multiplier: 10,      tolerance: '±1%',   css: 'color-coklat' },
        merah:  { value: 2, multiplier: 100,     tolerance: '±2%',   css: 'color-merah' },
        oranye: { value: 3, multiplier: 1000,    tolerance: null,    css: 'color-oranye' },
        kuning: { value: 4, multiplier: 10000,   tolerance: null,    css: 'color-kuning' },
        hijau:  { value: 5, multiplier: 100000,  tolerance: '±0.5%', css: 'color-hijau' },
        biru:   { value: 6, multiplier: 1000000, tolerance: '±0.25%',css: 'color-biru' },
        ungu:   { value: 7, multiplier: 10000000,tolerance: '±0.1%', css: 'color-ungu' },
        abuabu: { value: 8, multiplier: null,    tolerance: null,    css: 'color-abuabu' },
        putih:  { value: 9, multiplier: null,    tolerance: null,    css: 'color-putih' },
        emas:   { value: null,multiplier: 0.1,     tolerance: '±5%',   css: 'color-emas' },
        perak:  { value: null,multiplier: 0.01,    tolerance: '±10%',  css: 'color-perak' },
        kosong: { value: null,multiplier: null,    tolerance: '±20%',  css: 'color-kosong' }
    };

    const band1Select = document.getElementById('band1');
    const band2Select = document.getElementById('band2');
    const band3Select = document.getElementById('band3');
    const band4Select = document.getElementById('band4');
    
    const resBand1 = document.getElementById('res-band-1');
    const resBand2 = document.getElementById('res-band-2');
    const resBand3 = document.getElementById('res-band-3');
    const resBand4 = document.getElementById('res-band-4');
    
    const resistorResult = document.getElementById('resistor-result');

    function formatOhms(value) {
        if (value >= 1000000) {
            return (value / 1000000) + ' MΩ'; // Megaohm
        } else if (value >= 1000) {
            return (value / 1000) + ' kΩ'; // Kiloohm
        } else {
            return value + ' Ω'; // Ohm
        }
    }

    function calculateResistor() {
        const band1Color = band1Select.value;
        const band2Color = band2Select.value;
        const band3Color = band3Select.value;
        const band4Color = band4Select.value;

        const data1 = colorValues[band1Color];
        const data2 = colorValues[band2Color];
        const data3 = colorValues[band3Color];
        const data4 = colorValues[band4Color];

        resBand1.className = 'band ' + data1.css;
        resBand2.className = 'band ' + data2.css;
        resBand3.className = 'band ' + data3.css;
        resBand4.className = 'band ' + data4.css;

        const baseValue = parseInt(String(data1.value) + String(data2.value));
        const totalValue = baseValue * data3.multiplier;
        const tolerance = data4.tolerance;

        resistorResult.textContent = `${formatOhms(totalValue)} ${tolerance}`;
    }

    band1Select.addEventListener('input', calculateResistor);
    band2Select.addEventListener('input', calculateResistor);
    band3Select.addEventListener('input', calculateResistor);
    band4Select.addEventListener('input', calculateResistor);

    calculateResistor();
});