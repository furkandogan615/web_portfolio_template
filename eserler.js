// ─── ESERLER.JS ─────────────────────────────────────────────────────────────
// 1) eserler.json dosyasından verileri fetch ile okur
// 2) Kartları dinamik olarak oluşturur (slider yapısına uygun)
// 3) "Favorilere Ekle" butonuyla localStorage'a kaydeder
// 4) Sayfa açıldığında localStorage'daki favorileri geri yükler
// ─────────────────────────────────────────────────────────────────────────────

const FAVORITES_KEY = 'ahiEvran_favoriler';

// localStorage'dan favorileri oku
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

// localStorage'a favorileri kaydet
function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Bir eserin favoride olup olmadığını kontrol et
function isFavorite(id) {
  return getFavorites().includes(id);
}

// Favori ekle / çıkar
function toggleFavorite(id) {
  let favorites = getFavorites();
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }
  saveFavorites(favorites);
  return favorites.includes(id); // yeni durum
}

// Favori sayısını güncelle (nav badge)
function updateFavoriteBadge() {
  const count = getFavorites().length;
  const badge = document.getElementById('favori-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

// Favori panelini güncelle
function renderFavoritePanel(eserler) {
  const panel = document.getElementById('favori-panel');
  if (!panel) return;

  const favorites = getFavorites();

  if (favorites.length === 0) {
    panel.innerHTML = `<p class="favori-bos">Henüz favoriye eklenen eser yok.</p>`;
    return;
  }

  const favEserler = eserler.filter(e => favorites.includes(e.id));
  panel.innerHTML = favEserler.map(e => `
    <div class="favori-item">
      <span class="favori-num">${e.num}</span>
      <span class="favori-baslik">${e.baslik}</span>
      <button class="favori-kaldir" data-id="${e.id}" title="Favoriden çıkar">✕</button>
    </div>
  `).join('');

  // Kaldır butonları
  panel.querySelectorAll('.favori-kaldir').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleFavorite(btn.dataset.id * 1);
      renderFavoritePanel(eserler);
      updateFavoriteBadge();
      // İlgili kartın butonunu da güncelle
      const cardBtn = document.querySelector(`.fav-btn[data-id="${btn.dataset.id}"]`);
      if (cardBtn) updateFavBtnUI(cardBtn, false);
    });
  });
}

// Buton görünümünü güncelle
function updateFavBtnUI(btn, durum) {
  if (durum) {
    btn.textContent = '★ Favoride';
    btn.classList.add('fav-aktif');
  } else {
    btn.textContent = '☆ Favoriye Ekle';
    btn.classList.remove('fav-aktif');
  }
}

// Eser kartı HTML'i oluştur
function createEserCard(eser) {
  const favDurum = isFavorite(eser.id);
  const tagHTML = eser.kategori.map(t => `<span class="tag">${t}</span>`).join('');

  return `
    <div class="eser" data-id="${eser.id}">
      <div class="eser-num">${eser.num}</div>
      <h3>${eser.baslik}</h3>
      <p>${eser.aciklama}</p>
      <div class="eser-tags">${tagHTML}</div>
      <button class="fav-btn${favDurum ? ' fav-aktif' : ''}" data-id="${eser.id}">
        ${favDurum ? '★ Favoride' : '☆ Favoriye Ekle'}
      </button>
    </div>
  `;
}

// Slider oluştur (3'lü gruplar halinde)
function buildSlider(eserler) {
  const track = document.getElementById('eserlerTrack');
  if (!track) return;

  // Mevcut statik içeriği temizle
  track.innerHTML = '';

  // 3'lü gruplara böl
  const chunkSize = 3;
  for (let i = 0; i < eserler.length; i += chunkSize) {
    const chunk = eserler.slice(i, i + chunkSize);
    const slide = document.createElement('div');
    slide.className = 'eser-slide';
    slide.innerHTML = chunk.map(createEserCard).join('');
    track.appendChild(slide);
  }

  // Favori butonlarına event listener ekle
  track.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id * 1;
      const yeniDurum = toggleFavorite(id);
      updateFavBtnUI(btn, yeniDurum);
      updateFavoriteBadge();
      renderFavoritePanel(eserler);

      // Kısa animasyon
      btn.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.15)' },
        { transform: 'scale(1)' }
      ], { duration: 200 });
    });
  });
}

// Favori paneli HTML'i oluştur ve sayfaya ekle
function createFavoriteSection() {
  // Nav'a badge ekle
  const eserlerLink = document.querySelector('a[href="#eserler"]');
  if (eserlerLink) {
    eserlerLink.innerHTML = `Eserleri <span id="favori-badge" style="
      display:none;
      background:var(--gold);
      color:#0d0b08;
      border-radius:50%;
      width:18px;height:18px;
      font-size:0.65rem;
      align-items:center;
      justify-content:center;
      font-family:sans-serif;
      margin-left:4px;
      vertical-align:middle;
    "></span>`;
  }

  // Favori paneli section'ı oluştur
  const eserlerSection = document.getElementById('eserler');
  if (!eserlerSection) return;

  const panelDiv = document.createElement('div');
  panelDiv.className = 'container';
  panelDiv.style.marginTop = '3rem';
  panelDiv.innerHTML = `
    <div class="favori-section">
      <h3 class="favori-baslik-h3">
        <span style="color:var(--gold)">★</span> Okuma Listem
        <span id="favori-badge-alt" style="font-size:0.8rem;color:var(--muted);margin-left:0.5rem;font-family:'Crimson Text',serif;font-weight:normal;font-style:italic;"></span>
      </h3>
      <div id="favori-panel"></div>
    </div>
  `;
  eserlerSection.appendChild(panelDiv);
}

// Ana fonksiyon: JSON'u fetch et, her şeyi başlat
async function initEserler() {
  try {
    const response = await fetch('eserler.json');
    if (!response.ok) throw new Error('JSON okunamadı');
    const eserler = await response.json();

    buildSlider(eserler);
    createFavoriteSection();
    renderFavoritePanel(eserler);
    updateFavoriteBadge();

    // Slider dot güncelleme için mevcut slider JS ile uyum
    // (index.html'deki slider JS otomatik çalışır, track zaten aynı id)

  } catch (err) {
    console.error('Eserler yüklenemedi:', err);
  }
}

// Sayfa yüklenince başlat
document.addEventListener('DOMContentLoaded', initEserler);
