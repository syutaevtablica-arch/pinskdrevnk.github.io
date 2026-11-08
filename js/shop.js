const fmt = n => n.toLocaleString('ru-RU') + ' ₽';
const params = new URLSearchParams(location.search);

// Главная: карточки разделов
const catGrid = document.getElementById('cat-grid');
if (catGrid) {
  catGrid.innerHTML = Object.entries(categories).map(([key, c], i) => `
    <a class="cat-card" href="category.html?cat=${key}">
      <span class="cat-card__num">0${i + 1}</span>
      <h3>${c.title}</h3>
      <p>${c.description}</p>
      <span class="cat-card__more">Смотреть →</span>
    </a>`).join('');
}

// Страница раздела: список товаров
const list = document.getElementById('products');
if (list) {
  const key = params.get('cat');
  const cat = categories[key];
  if (!cat) {
    list.innerHTML = '<p>Раздел не найден</p>';
  } else {
    document.title = cat.title;
    document.getElementById('cat-title').textContent = cat.title;
    document.getElementById('cat-desc').textContent = cat.description;
    const items = products.filter(p => p.category === key);
    list.innerHTML = items.length
      ? items.map(p => `
        <a class="product-card" href="product.html?id=${p.id}">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${fmt(p.price)}</p>
        </a>`).join('')
      : '<p>Скоро здесь появятся товары</p>';
  }
}

// Страница товара
const box = document.getElementById('product');
if (box) {
  const p = products.find(x => x.id === params.get('id'));
  if (!p) {
    box.innerHTML = '<p>Товар не найден</p>';
  } else {
    document.title = p.name;
    const photos = p.gallery || [p.image];
    box.innerHTML = `
      <div class="product__gallery">
        <img id="main-photo" src="${photos[0]}" alt="${p.name}">
        <div class="product__thumbs">
          ${photos.map(src => `<img src="${src}" alt="" onclick="document.getElementById('main-photo').src='${src}'">`).join('')}
        </div>
      </div>
      <div class="product__info">
        <a class="back" href="category.html?cat=${p.category}">← ${categories[p.category].title}</a>
        <h1>${p.name}</h1>
        <p class="product__price">${fmt(p.price)}</p>
        <p class="product__desc">${p.description}</p>
        <table class="specs">
          ${Object.entries(p.specs).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
        </table>
        <a href="tel:+70000000000" class="btn">Заказать</a>
      </div>`;
  }
}