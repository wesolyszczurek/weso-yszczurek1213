// Gładkie przewijanie
function scrollToDemo() {
    document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' });
}

// Efekt zmiany tła nawigacji przy skrolowaniu
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(255,255,255,0.9)';
        nav.style.mixBlendMode = 'normal';
        nav.style.color = 'black';
    } else {
        nav.style.background = 'transparent';
        nav.style.mixBlendMode = 'difference';
        nav.style.color = 'white';
    }
});