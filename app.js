const $ = (s) => document.querySelector(s);
const MENU_CURRENCY = ""; // leave empty if prices should show as bare numbers

// ---- Filters ----
const filtersEl = $("#filters");
CATEGORIES.forEach((c, i) => {
  const b = document.createElement("button");
  b.textContent = c.en;
  b.dataset.cat = c.key;
  b.className = `filter-btn whitespace-nowrap px-4 py-2 rounded-full text-xs tracking-widest border transition
    ${i === 0 ? "bg-dark-brown text-cream border-dark-brown" : "border-light-gold/60 text-brown hover:bg-gold hover:text-white"}`;
  b.onclick = () => setFilter(c.key);
  filtersEl.appendChild(b);
});

let activeCat = "all";
function setFilter(cat) {
  activeCat = cat;
  document.querySelectorAll(".filter-btn").forEach((b) => {
    const on = b.dataset.cat === cat;
    b.className = `filter-btn whitespace-nowrap px-4 py-2 rounded-full text-xs tracking-widest border transition
      ${on ? "bg-dark-brown text-cream border-dark-brown" : "border-light-gold/60 text-brown hover:bg-gold hover:text-white"}`;
  });
  render();
}

// ---- Search ----
$("#search").addEventListener("input", render);

// ---- Language ----
let lang = "en";
document.querySelectorAll(".lang-btn").forEach((b) => {
  b.onclick = () => {
    lang = b.dataset.lang;
    document.querySelectorAll(".lang-btn").forEach((x) => {
      const on = x.dataset.lang === lang;
      x.className = `lang-btn px-3 py-1.5 rounded-full border border-gold ${on ? "bg-gold text-white" : "text-gold"} font-semibold`;
    });
    render();
  };
});

// ---- Render ----
function render() {
  const q = $("#search").value.trim().toLowerCase();
  const wrap = $("#sections");
  wrap.innerHTML = "";

  CATEGORIES.filter((c) => c.key !== "all").forEach((cat) => {
    if (activeCat !== "all" && activeCat !== cat.key) return;

    const items = menuItems.filter((m) => {
      if (m.cat !== cat.key) return false;
      if (!q) return true;
      const blob =
        `${m.code} ${m.name} ${m.zh} ${cat.en} ${cat.zh}`.toLowerCase();
      return blob.includes(q);
    });
    if (!items.length) return;

    const sec = document.createElement("section");
    sec.className = "mb-14 fade-in";
    sec.innerHTML = `
      <div class="text-center mb-6">
        <h3 class="font-display text-2xl sm:text-3xl text-dark-brown">${cat.en}</h3>
        <p class="text-gold tracking-widest text-sm">${cat.zh}</p>
        <div class="flex items-center justify-center gap-3 mt-3">
          <span class="h-px w-10 bg-light-gold"></span>
          <span class="text-gold">❖</span>
          <span class="h-px w-10 bg-light-gold"></span>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-sm border border-light-gold/30 overflow-hidden">
        <table class="w-full text-sm sm:text-base menu-table">
          <thead class="bg-softbg text-brown">
            <tr class="text-left">
              <th class="px-4 py-3 font-semibold w-16">NO.</th>
              <th class="px-4 py-3 font-semibold">MENU ITEM</th>
              <th class="px-4 py-3 font-semibold">中文</th>
              <th class="px-4 py-3 font-semibold text-right">PRICE</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (m, i) => `
              <tr class="${i % 2 ? "bg-softbg/40" : ""} border-t border-light-gold/20 hover:bg-cream/60 transition">
                <td data-label="NO." class="px-4 py-3 text-gold font-mono">${m.code}</td>
                <td data-label="ITEM" class="px-4 py-3 ${lang === "en" ? "text-dark-brown font-medium" : "text-brown"}">${m.name}</td>
                <td data-label="中文" class="px-4 py-3 ${lang === "zh" ? "text-dark-brown font-medium" : "text-brown/80"}">${m.zh}</td>
                <td data-label="PRICE" class="px-4 py-3 text-right font-display text-brown whitespace-nowrap">${MENU_CURRENCY}${m.price}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
    wrap.appendChild(sec);
  });

  if (!wrap.children.length) {
    wrap.innerHTML = `<p class="text-center text-brown/60 py-16">No items match your search.</p>`;
  }
}

// ---- Featured ----
function renderFeatured() {
  const box = $("#featured");
  box.innerHTML = FEATURED_IDS.map((id) => {
    const m = menuItems.find((x) => x.id === id);
    if (!m) return "";
    return `
      <div class="block bg-white rounded-xl border border-light-gold/40 p-5 hover:shadow-md hover:border-gold transition fade-in">
        <p class="text-gold font-mono text-xs mb-2">${m.code}</p>
        <p class="font-display text-dark-brown text-lg leading-tight">${m.name}</p>
        <p class="text-brown/70 text-sm mt-1">${m.zh}</p>
        <p class="mt-3 text-gold font-semibold">${MENU_CURRENCY}${m.price}</p>
      </div>
    `;
  }).join("");
}

// ---- Share ----
async function shareMenu() {
  const data = {
    title: "Grand Leone Digital Menu",
    text: "View our menu:",
    url: MENU_URL,
  };
  if (navigator.share) {
    try {
      await navigator.share(data);
    } catch {}
  } else {
    copyLink();
  }
}
function copyLink() {
  navigator.clipboard
    .writeText(MENU_URL)
    .then(() => toast("Menu link copied."));
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.style.opacity = "1";
  setTimeout(() => (t.style.opacity = "0"), 2000);
}

// ---- Back to top ----
window.addEventListener("scroll", () => {
  const b = $("#backTop");
  if (window.scrollY > 400) {
    b.style.opacity = "1";
    b.style.pointerEvents = "auto";
  } else {
    b.style.opacity = "0";
    b.style.pointerEvents = "none";
  }
});

// ---- Init ----
renderFeatured();
render();
