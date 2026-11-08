document.documentElement.classList.add('js');

// 1. Шапка меняется при прокрутке
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// 2. Плавное появление блоков
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 3. История: фото-шторка с приближением
const scrub = document.querySelector('.scrub');
const slides = [...document.querySelectorAll('.slide')];
const bar = document.querySelector('.scrub__bar i');

if (scrub && slides.length) {
  const N = slides.length;
  let current = 0;

  function getProgress() {
    const rect = scrub.getBoundingClientRect();
    const total = scrub.offsetHeight - window.innerHeight;
    return Math.min(Math.max(-rect.top / total, 0), 1);
  }

  function render(p) {
    const pos = p * N;
    slides.forEach((s, i) => {
      const local = pos - i;                       // 0..1 пока кадр активен
      const img = s.querySelector('img');

      // шторка: кадр выезжает снизу за первые 35% своего отрезка
      const r = i === 0 ? 1 : Math.min(Math.max(local / 0.35, 0), 1);
      const eased = 1 - Math.pow(1 - r, 3);
      s.style.clipPath = `inset(${(1 - eased) * 100}% 0 0 0)`;

      // приближение внутри кадра
      const z = Math.min(Math.max(local, 0), 1);
      img.style.transform = `scale(${1.25 - 0.2 * z})`;

      // текст
      const on = i === 0
        ? local < 1
        : local >= 0.25 && (local < 1 || i === N - 1);
      s.classList.toggle('active', on);
    });
    if (bar) bar.style.width = (p * 100) + '%';
  }

  function tick() {
    current += (getProgress() - current) * 0.08;   // плавность
    render(current);
    requestAnimationFrame(tick);
  }
  tick();
}