// ====== НАСТРОЙКИ: добавляйте и удаляйте пункты здесь ======
const chatOptions = [
  { name: "Telegram", icon: "✈️", href: "https://t.me/ВАШ_НИК" },
  { name: "WhatsApp", icon: "💬", href: "https://wa.me/79286446440" },
  { name: "Viber",    icon: "📞", href: "viber://chat?number=%2B79286446440" },
  { name: "Онлайн-чат", icon: "🗨️", onClick: () => Tawk_API.toggle() },
  // Позже сюда можно добавить встроенный чат:
  // { name: "Онлайн-чат", icon: "🗨️", onClick: () => alert("Скоро") },
];
// ===========================================================

document.addEventListener('DOMContentLoaded', function () {
  const inner = document.querySelector('.header__inner');
  if (!inner) return;

  // Правая часть шапки: «Контакты» + «Написать нам»
  const right = document.createElement('div');
  right.className = 'header__right';
  const contactsBtn = inner.querySelector('.header__btn');
  if (contactsBtn) {
    contactsBtn.replaceWith(right);
    right.appendChild(contactsBtn);
  } else {
    inner.appendChild(right);
  }

  const fab = document.createElement('button');
  fab.className = 'header__btn header__btn--chat';
  fab.type = 'button';
  fab.textContent = 'Написать нам';
  right.appendChild(fab);

  const menu = document.createElement('div');
  menu.className = 'chat__menu';
  menu.innerHTML = `
    <p class="chat__title">Как вам удобнее связаться?</p>
    ${chatOptions.map((o, i) => `
      <a class="chat__item" data-i="${i}" ${o.href ? `href="${o.href}" target="_blank" rel="noopener"` : 'href="#"'}>
        <span>${o.icon}</span>${o.name}
      </a>`).join('')}`;
  right.appendChild(menu);

  fab.addEventListener('click', () => menu.classList.toggle('open'));

  // Пункты без ссылки (встроенный чат) запускают свою функцию
  menu.querySelectorAll('.chat__item').forEach(el => {
    const opt = chatOptions[el.dataset.i];
    if (opt.onClick) {
      el.addEventListener('click', e => {
        e.preventDefault();
        menu.classList.remove('open');
        opt.onClick();
      });
    }
  });

  // Закрытие по клику вне меню
  document.addEventListener('click', e => {
    if (!right.contains(e.target)) menu.classList.remove('open');
  });
});