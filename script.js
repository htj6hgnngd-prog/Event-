const nav = document.querySelector('.nav');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.style.transform = y > lastY && y > 140 ? 'translateY(-100%)' : 'translateY(0)';
  nav.style.transition = 'transform .35s ease';
  lastY = y;
});

document.querySelectorAll('.video-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.video-card').forEach(item => item.classList.remove('active'));
    card.classList.add('active');
  });
});
