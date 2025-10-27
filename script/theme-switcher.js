document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle-btn');
    const root = document.documentElement; // Ini adalah <html> tag

    // 1. Cek tema saat ini di LocalStorage saat tombol dimuat
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        root.setAttribute('data-theme', currentTheme);
        // Set ikon yang benar saat load
        if (currentTheme === 'dark') {
            toggleButton.textContent = '☀️'; // Sun icon
        } else {
            toggleButton.textContent = '🌙'; // Moon icon
        }
    } else {
        // Jika tidak ada di storage, default ke light
        root.setAttribute('data-theme', 'light');
        toggleButton.textContent = '🌙'; // Moon icon
    }

    // 2. Tambahkan event listener untuk tombol
    toggleButton.addEventListener('click', () => {
        // Dapatkan tema yang SEKARANG (setelah load)
        const newTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        
        // Set atribut di <html>
        root.setAttribute('data-theme', newTheme);
        
        // Ganti ikon tombolnya
        if (newTheme === 'dark') {
            toggleButton.textContent = '☀️'; // Sun icon
        } else {
            toggleButton.textContent = '🌙'; // Moon icon
        }
        
        // 3. Simpan pilihan ke LocalStorage
        localStorage.setItem('theme', newTheme);
    });
});