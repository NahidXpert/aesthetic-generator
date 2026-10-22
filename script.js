(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const STORAGE_KEY = "aesthetic-generator-favorites-v1";

  const paletteSets = {
    Surprise: [
      ["#F4EDE4","#D7BFA8","#A3B18A","#588157","#3A5A40","#344E41"],
      ["#F8F0FB","#E7C6FF","#C8B6FF","#B8C0FF","#BBD0FF","#B8E0D2"],
      ["#F6F4F1","#E8DCCB","#C7B7A3","#8E9AAF","#5B6477","#273043"],
      ["#FFF3E2","#FFCDB2","#FFB4A2","#E5989B","#B5838D","#6D6875"],
      ["#F1F0EA","#DAD7CD","#A3A380","#6B705C","#CB997E","#4B4237"]
    ],
    Minimal: [
      ["#F8F9FA","#E9ECEF","#DEE2E6","#ADB5BD","#6C757D","#212529"],
      ["#FAF9F6","#E7E5E4","#D6D3D1","#A8A29E","#57534E","#292524"],
      ["#F7F8FA","#DDE3EA","#AAB7C4","#7A8B9C","#4B5C6B","#263746"]
    ],
    Pastel: [
      ["#FFF1F5","#FBCFE8","#F5D0FE","#DDD6FE","#C7D2FE","#BAE6FD"],
      ["#FDF2F8","#F9A8D4","#FBCFE8","#E9D5FF","#C4B5FD","#A5F3FC"],
      ["#FFF7ED","#FED7AA","#FDE68A","#D9F99D","#A7F3D0","#BFDBFE"]
    ],
    Retro: [
      ["#F6E7CB","#E7A977","#C96E4B","#8C4A3F","#4B3832","#9C9B7A"],
      ["#F2E8CF","#A7C957","#6A994E","#386641","#BC4749","#F2CC8F"],
      ["#F4F1DE","#E07A5F","#3D405B","#81B29A","#F2CC8F","#5A463A"]
    ],
    Dark: [
      ["#151923","#222938","#303B4E","#59677D","#A4B0C2","#E8EDF5"],
      ["#171520","#29243D","#51476D","#8D7CB5","#C6B8E8","#F1EAFB"],
      ["#111827","#1F2937","#374151","#0F766E","#5EEAD4","#F9FAFB"]
    ],
    Luxury: [
      ["#F7F2E8","#E1D2B4","#B69B65","#7E6A42","#34302A","#171613"],
      ["#F8F5F0","#D9C7B0","#A68A64","#6C5B4C","#36302B","#1D1A17"],
      ["#F3EEE7","#D7C6A5","#9F8B63","#566052","#343A32","#20251F"]
    ],
    Nature: [
      ["#F4F1DE","#DDE5B6","#A8C686","#6C8E5E","#3A5A40","#344E41"],
      ["#F1F7ED","#D6E8D0","#A8C7A0","#6B9A78","#386641","#243B2E"],
      ["#F5F0E8","#D6C6A8","#A9B388","#718355","#4F6045","#313D2B"]
    ],
    Futuristic: [
      ["#F5F7FF","#DCE4FF","#A5B4FC","#818CF8","#6366F1","#20204A"],
      ["#0D1024","#1B214A","#3A3F8F","#6C63FF","#00D9C5","#F4F7FF"],
      ["#F0F9FF","#BAE6FD","#67E8F9","#22D3EE","#0891B2","#164E63"]
    ]
  };

  const fonts = [
    {name:"Playfair Display", classification:"Elegant serif", role:"Heading", sample:"A little wonder.", description:"Expressive, editorial, timeless.", category:"serif"},
    {name:"DM Serif Display", classification:"Display serif", role:"Heading", sample:"Make it matter.", description:"Warm character with confident contrast.", category:"serif"},
    {name:"Fraunces", classification:"Soft serif", role:"Heading", sample:"A softer story.", description:"Playful curves and a modern vintage feel.", category:"serif"},
    {name:"Space Grotesk", classification:"Geometric sans", role:"Heading", sample:"Ideas in motion.", description:"Distinctive, modern, a little unexpected.", category:"sans"},
    {name:"Manrope", classification:"Modern sans", role:"Heading", sample:"Design with intent.", description:"Clean geometry with a friendly voice.", category:"sans"},
    {name:"Inter", classification:"Neo-grotesque", role:"Body", sample:"Thoughtful by design.", description:"Highly readable and quietly versatile.", category:"sans"},
    {name:"DM Sans", classification:"Humanist sans", role:"Body", sample:"Made for everyday.", description:"Approachable and beautifully balanced.", category:"sans"},
    {name:"Work Sans", classification:"Contemporary sans", role:"Body", sample:"Clarity comes first.", description:"Straightforward, clear, and practical.", category:"sans"},
    {name:"Space Mono", classification:"Monospace", role:"Body", sample:"A different point of view.", description:"Technical personality for small details.", category:"mono"}
  ];

  const state = {
    preset: "Surprise",
    palette: [],
    headingFont: fonts[0],
    bodyFont: fonts[5],
    lockedColors: new Set(),
    headingLocked: false,
    bodyLocked: false,
    device: "desktop",
    favorites: [],
    currentView: "generate"
  };

  const roleNames = ["Canvas","Soft tint","Accent","Secondary","Deep tone","Ink"];
  const presetNames = Object.keys(paletteSets);

  function randomItem(items) { return items[Math.floor(Math.random() * items.length)]; }
  function normalizeHex(hex) { return /^#[0-9a-f]{6}$/i.test(hex) ? hex.toUpperCase() : "#FFFFFF"; }
  function getPalette(preset, currentPalette = state.palette) {
    const options = paletteSets[preset] || paletteSets.Surprise;
    // Prefer a different palette on every regeneration so a click never appears to do nothing.
    const currentKey = Array.isArray(currentPalette) ? currentPalette.map(normalizeHex).join(",") : "";
    const alternatives = options.filter(option => option.map(normalizeHex).join(",") !== currentKey);
    return [...randomItem(alternatives.length ? alternatives : options)];
  }
  function pickFonts() {
    let headingCandidates = fonts.filter(f => f.role === "Heading");
    let bodyCandidates = fonts.filter(f => f.role === "Body");
    let heading = randomItem(headingCandidates);
    let body = randomItem(bodyCandidates);
    if (heading.name === body.name) body = fonts.find(f => f.name === "Inter");
    return {heading, body};
  }
  function generateColors() {
    const next = getPalette(state.preset, state.palette);
    state.palette = next.map((color, i) => state.lockedColors.has(i) && state.palette[i] ? state.palette[i] : color);
    renderPalette();
    updatePreview();
    updateContrast();
    updateSaveButton();
  }
  function generateFonts() {
    const chosen = pickFonts();
    if (!state.headingLocked) state.headingFont = chosen.heading;
    if (!state.bodyLocked) {
      state.bodyFont = chosen.body.name === state.headingFont.name ? fonts.find(f => f.name === "Inter") : chosen.body;
    }
    renderFonts();
    updatePreview();
    updateSaveButton();
  }
  function generateAll() {
    generateColors();
    generateFonts();
    toast("A fresh aesthetic, just for you.", "success");
  }
  function renderPalette() {
    const grid = $("#palette-grid");
    grid.replaceChildren();
    state.palette.forEach((rawHex, index) => {
      const hex = normalizeHex(rawHex);
      const card = document.createElement("div");
      card.className = "color-card";
      const copy = document.createElement("button");
      copy.className = "swatch-button";
      copy.style.backgroundColor = hex;
      copy.setAttribute("aria-label", `Copy color ${hex}, ${roleNames[index]}`);
      copy.title = `Copy ${hex}`;
      const overlay = document.createElement("span");
      overlay.className = "swatch-copy";
      overlay.textContent = "Copy HEX";
      copy.append(overlay);
      copy.addEventListener("click", () => copyText(hex, `${hex} copied`));
      const lock = document.createElement("button");
      lock.className = `lock-color${state.lockedColors.has(index) ? " locked" : ""}`;
      lock.textContent = state.lockedColors.has(index) ? "🔒" : "⌑";
      lock.setAttribute("aria-label", `${state.lockedColors.has(index) ? "Unlock" : "Lock"} ${roleNames[index]} color`);
      lock.title = state.lockedColors.has(index) ? "Unlock color" : "Lock color";
      lock.addEventListener("click", () => {
        state.lockedColors.has(index) ? state.lockedColors.delete(index) : state.lockedColors.add(index);
        renderPalette();
        updateLockButtons();
        toast(`${roleNames[index]} ${state.lockedColors.has(index) ? "locked" : "unlocked"}.`, "info");
      });
      const code = document.createElement("div");
      code.className = "color-hex";
      code.textContent = hex;
      const role = document.createElement("div");
      role.className = "color-role";
      role.textContent = roleNames[index];
      card.append(copy, lock, code, role);
      grid.append(card);
    });
    updateLockButtons();
  }
  function renderFonts() {
    const wrapper = $("#font-pairing");
    wrapper.replaceChildren();
    const configs = [
      {key:"heading",font:state.headingFont,locked:state.headingLocked,sample:"The art of less.",desc:"For titles, statements & big ideas."},
      {key:"body",font:state.bodyFont,locked:state.bodyLocked,sample:"Good design makes things feel simple, clear, and considered.",desc:"For paragraphs, labels & everyday reading."}
    ];
    configs.forEach(config => {
      const card = document.createElement("article");
      card.className = "font-sample";
      const top = document.createElement("div");
      top.className = "font-sample-top";
      const classification = document.createElement("span");
      classification.className = "font-class";
      classification.textContent = config.key === "heading" ? "01 / HEADING" : "02 / BODY";
      const lock = document.createElement("button");
      lock.className = `font-lock${config.locked ? " locked" : ""}`;
      lock.textContent = config.locked ? "🔒" : "⌑";
      lock.title = config.locked ? "Unlock font" : "Lock font";
      lock.setAttribute("aria-label", `${config.locked ? "Unlock" : "Lock"} ${config.key} font`);
      lock.addEventListener("click", () => {
        if (config.key === "heading") state.headingLocked = !state.headingLocked;
        else state.bodyLocked = !state.bodyLocked;
        renderFonts(); updateLockButtons(); updateSaveButton();
        toast(`${config.key === "heading" ? "Heading" : "Body"} font ${config.locked ? "unlocked" : "locked"}.`, "info");
      });
      top.append(classification, lock);
      const name = document.createElement("h3");
      name.className = "font-name";
      name.textContent = config.font.name;
      const sample = document.createElement("p");
      sample.className = "font-sample-text";
      sample.textContent = config.sample;
      sample.style.fontFamily = `"${config.font.name}", ${config.font.category === "serif" ? "Georgia, serif" : config.font.category === "mono" ? "monospace" : "Arial, sans-serif"}`;
      const description = document.createElement("p");
      description.className = "font-description";
      description.textContent = `${config.font.classification} · ${config.desc}`;
      card.append(top, name, sample, description);
      wrapper.append(card);
    });
    updateLockButtons();
  }
  function updatePreview() {
    const preview = $("#site-preview");
    const p = state.palette.map(normalizeHex);
    p.forEach((color, i) => preview.style.setProperty(`--p${i}`, color));
    preview.style.setProperty("--demo-heading", `"${state.headingFont.name}", Georgia, serif`);
    preview.style.setProperty("--demo-body", `"${state.bodyFont.name}", Arial, sans-serif`);
    preview.style.backgroundColor = p[0];
    preview.style.color = p[5];
  }
  function luminance(hex) {
    const value = normalizeHex(hex).slice(1);
    const rgb = [0,2,4].map(i => parseInt(value.slice(i,i+2),16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
    return .2126*rgb[0] + .7152*rgb[1] + .0722*rgb[2];
  }
  function contrastRatio(a,b) {
    const l1 = luminance(a), l2 = luminance(b);
    return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
  }
  function updateContrast() {
    const [canvas,,,,,ink] = state.palette;
    const ratio = contrastRatio(canvas, ink);
    const note = $("#contrast-note");
    if (ratio >= 4.5) {
      note.className = "contrast-note good";
      note.textContent = `✓ Strong contrast: canvas and ink score ${ratio.toFixed(1)}:1, meeting WCAG AA for normal text.`;
    } else {
      note.className = "contrast-note warning";
      note.textContent = `⚠ Contrast check: canvas and ink score ${ratio.toFixed(1)}:1. Review text readability before using this combination.`;
    }
  }
  function updateLockButtons() {
    const allColorsLocked = state.lockedColors.size === 6;
    $("#lock-palette").textContent = allColorsLocked ? "🔒" : "⌑";
    $("#lock-palette").title = allColorsLocked ? "Unlock all colors" : "Lock all colors";
    $("#lock-palette").setAttribute("aria-label", allColorsLocked ? "Unlock all colors" : "Lock all colors");
    $("#lock-fonts").textContent = state.headingLocked && state.bodyLocked ? "🔒" : "⌑";
    $("#lock-fonts").title = state.headingLocked && state.bodyLocked ? "Unlock both fonts" : "Lock both fonts";
    $$(".preset-chip").forEach(chip => chip.classList.toggle("active", chip.dataset.preset === state.preset));
    $$(".preset-link").forEach(link => link.classList.toggle("active", link.dataset.preset === state.preset));
  }
  function updateSaveButton() {
    const saved = state.favorites.some(f => sameAesthetic(f, currentAesthetic()));
    $("#save-favorite").classList.toggle("is-saved", saved);
    $("#favorite-heart").textContent = saved ? "♥" : "♡";
    $("#save-favorite").innerHTML = `<span id="favorite-heart">${saved ? "♥" : "♡"}</span> ${saved ? "Saved to favorites" : "Save to favorites"}`;
  }
  function currentAesthetic() {
    return {
      id: null,
      name: `${state.preset} aesthetic`,
      preset: state.preset,
      palette: state.palette.map(normalizeHex),
      headingFont: state.headingFont.name,
      bodyFont: state.bodyFont.name,
      createdAt: new Date().toISOString()
    };
  }
  function sameAesthetic(a,b) {
    return Array.isArray(a.palette) && a.palette.join(",") === b.palette.join(",") &&
      a.headingFont === b.headingFont && a.bodyFont === b.bodyFont;
  }
  function loadFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter(item => item && typeof item === "object" &&
        Array.isArray(item.palette) && item.palette.length === 6 &&
        item.palette.every(c => /^#[0-9a-f]{6}$/i.test(c)) &&
        typeof item.headingFont === "string" && typeof item.bodyFont === "string")
        .map(item => ({...item, palette:item.palette.map(normalizeHex)}));
    } catch (error) {
      console.warn("Could not load favorites:", error);
      return [];
    }
  }
  function persistFavorites() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favorites));
      $("#favorite-count").textContent = String(state.favorites.length);
      return true;
    } catch (error) {
      toast("Browser storage is unavailable. Your changes may not persist.", "error");
      return false;
    }
  }
  function saveFavorite() {
    const aesthetic = currentAesthetic();
    const existing = state.favorites.findIndex(f => sameAesthetic(f, aesthetic));
    if (existing >= 0) {
      state.favorites.splice(existing, 1);
      toast("Removed from favorites.", "info");
    } else {
      aesthetic.id = `aesthetic-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
      state.favorites.unshift(aesthetic);
      toast("Aesthetic saved to your favorites.", "success");
    }
    persistFavorites();
    updateSaveButton();
    if (state.currentView === "favorites") renderFavorites();
  }
  function renderFavorites() {
    const list = $("#favorites-list");
    list.replaceChildren();
    $("#favorite-count").textContent = String(state.favorites.length);
    if (!state.favorites.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      const art = document.createElement("div"); art.className = "empty-art"; art.textContent = "♡";
      const title = document.createElement("h2"); title.textContent = "Your collection starts here.";
      const copy = document.createElement("p"); copy.textContent = "When a palette and font pairing feels right, save it. Your favorite aesthetics will be waiting here.";
      const button = document.createElement("button"); button.className = "primary-button"; button.textContent = "Explore aesthetics ↗";
      button.addEventListener("click", () => navigate("generate"));
      empty.append(art,title,copy,button); list.append(empty); return;
    }
    state.favorites.forEach(item => {
      const card = document.createElement("article"); card.className = "favorite-card";
      const head = document.createElement("div"); head.className = "favorite-card-head";
      const title = document.createElement("strong"); title.textContent = item.name || "Saved aesthetic";
      const date = document.createElement("span"); date.textContent = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Saved";
      head.append(title,date);
      const swatches = document.createElement("div"); swatches.className = "favorite-swatches";
      item.palette.forEach(color => { const swatch = document.createElement("div"); swatch.className = "favorite-swatch"; swatch.style.backgroundColor = normalizeHex(color); swatch.title = normalizeHex(color); swatches.append(swatch); });
      const pair = document.createElement("div"); pair.className = "favorite-fonts";
      const h = document.createElement("span"); h.textContent = `Heading: ${item.headingFont}`;
      const b = document.createElement("span"); b.textContent = `Body: ${item.bodyFont}`;
      pair.append(h,b);
      const actions = document.createElement("div"); actions.className = "favorite-actions";
      const restore = document.createElement("button"); restore.className = "primary-button"; restore.textContent = "Use this aesthetic";
      restore.addEventListener("click", () => restoreAesthetic(item));
      const copy = document.createElement("button"); copy.className = "secondary-button"; copy.textContent = "Copy HEX";
      copy.addEventListener("click", () => copyText(item.palette.join(", "), "Palette HEX values copied"));
      const remove = document.createElement("button"); remove.className = "secondary-button"; remove.textContent = "Remove";
      remove.addEventListener("click", () => { state.favorites = state.favorites.filter(f => f.id !== item.id); persistFavorites(); renderFavorites(); updateSaveButton(); toast("Favorite removed.", "info"); });
      actions.append(restore,copy,remove);
      card.append(head,swatches,pair,actions); list.append(card);
    });
  }
  function restoreAesthetic(item) {
    state.preset = presetNames.includes(item.preset) ? item.preset : "Surprise";
    state.palette = item.palette.map(normalizeHex);
    state.headingFont = fonts.find(f => f.name === item.headingFont) || fonts[0];
    state.bodyFont = fonts.find(f => f.name === item.bodyFont) || fonts.find(f => f.name === "Inter");
    state.lockedColors.clear(); state.headingLocked = false; state.bodyLocked = false;
    renderPalette(); renderFonts(); updatePreview(); updateContrast(); updateLockButtons(); updateSaveButton();
    navigate("generate"); toast("Saved aesthetic restored.", "success");
  }
  function cssExport() {
    const p = state.palette.map(normalizeHex);
    return `/* Aesthetic — generated design tokens */\n:root {\n  --color-canvas: ${p[0]};\n  --color-soft: ${p[1]};\n  --color-accent: ${p[2]};\n  --color-secondary: ${p[3]};\n  --color-deep: ${p[4]};\n  --color-ink: ${p[5]};\n\n  --font-heading: "${state.headingFont.name}", ${state.headingFont.category === "serif" ? "Georgia, serif" : "Arial, sans-serif"};\n  --font-body: "${state.bodyFont.name}", ${state.bodyFont.category === "serif" ? "Georgia, serif" : state.bodyFont.category === "mono" ? "monospace" : "Arial, sans-serif"};\n}\n\nbody {\n  background: var(--color-canvas);\n  color: var(--color-ink);\n  font-family: var(--font-body);\n}\n\nh1, h2, h3 {\n  font-family: var(--font-heading);\n}`;
  }
  async function copyText(text, successMessage) {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else {
        const textarea = document.createElement("textarea");
        textarea.value = text; textarea.style.position = "fixed"; textarea.style.opacity = "0";
        document.body.append(textarea); textarea.select();
        const copied = document.execCommand("copy"); textarea.remove();
        if (!copied) throw new Error("Clipboard unavailable");
      }
      toast(successMessage, "success");
    } catch (error) {
      toast("Copy failed. Check browser permissions and try again.", "error");
    }
  }
  function toast(message, type = "info") {
    const region = $("#toast-region");
    const item = document.createElement("div"); item.className = `toast ${type}`; item.textContent = message;
    region.append(item);
    window.setTimeout(() => item.remove(), 3000);
  }
  function selectPreset(preset) {
    state.preset = preset === "Surprise" ? "Surprise" : preset;
    generateColors();
    if (!state.headingLocked || !state.bodyLocked) generateFonts();
    updateLockButtons();
    toast(`${preset === "Surprise" ? "Surprise me" : preset} direction selected.`, "success");
  }
  function navigate(view) {
    const viewIds = { generate: "generator-view", favorites: "favorites-view", about: "about-view" };
    if (!Object.prototype.hasOwnProperty.call(viewIds, view)) return;
    state.currentView = view;
    Object.entries(viewIds).forEach(([name, id]) => {
      const section = document.getElementById(id);
      if (section) section.classList.toggle("hidden", name !== view);
    });
    const breadcrumb = $("#breadcrumb-current");
    if (breadcrumb) breadcrumb.textContent = view === "generate" ? "Generate" : view === "favorites" ? "Favorites" : "About";
    $$(".nav-item[data-nav]").forEach(button => button.classList.toggle("active", button.dataset.nav === view));
    if (view === "favorites") renderFavorites();
    const sidebar = $("#sidebar");
    if (sidebar) sidebar.classList.remove("open");
    const mobileMenu = $("#mobile-menu");
    if (mobileMenu) mobileMenu.setAttribute("aria-expanded", "false");
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function setDevice(device) {
    state.device = device;
    $("#browser-frame").classList.remove("device-tablet","device-mobile");
    if (device !== "desktop") $("#browser-frame").classList.add(`device-${device}`);
    $$(".device-button").forEach(button => {
      const active = button.dataset.device === device;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }
  function openExport() {
    $("#css-output").textContent = cssExport();
    $("#export-dialog").showModal();
  }
  function downloadCss() {
    const blob = new Blob([cssExport()], {type:"text/css;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "aesthetic-variables.css";
    document.body.append(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
    toast("CSS file downloaded.", "success");
  }
  function init() {
    state.favorites = loadFavorites();
    state.palette = getPalette(state.preset);
    const initialFonts = pickFonts(); state.headingFont = initialFonts.heading; state.bodyFont = initialFonts.body;
    renderPalette(); renderFonts(); updatePreview(); updateContrast(); updateLockButtons(); updateSaveButton();
    $("#favorite-count").textContent = String(state.favorites.length);

    $("#generate-all").addEventListener("click", generateAll);
    $("#regenerate-colors").addEventListener("click", () => { generateColors(); toast("Color palette regenerated.", "success"); });
    $("#regenerate-fonts").addEventListener("click", () => { generateFonts(); toast("Font pairing regenerated.", "success"); });
    $("#lock-palette").addEventListener("click", () => {
      if (state.lockedColors.size === 6) state.lockedColors.clear(); else state.palette.forEach((_,i) => state.lockedColors.add(i));
      renderPalette(); updateLockButtons(); toast(state.lockedColors.size ? "All colors locked." : "All colors unlocked.", "info");
    });
    $("#lock-fonts").addEventListener("click", () => {
      const shouldLock = !(state.headingLocked && state.bodyLocked);
      state.headingLocked = shouldLock; state.bodyLocked = shouldLock; renderFonts(); updateLockButtons();
      toast(shouldLock ? "Both fonts locked." : "Both fonts unlocked.", "info");
    });
    $("#copy-palette").addEventListener("click", () => copyText(state.palette.map(normalizeHex).join(", "), "All six HEX values copied"));
    $("#copy-fonts").addEventListener("click", () => copyText(`Heading: ${state.headingFont.name}\nBody: ${state.bodyFont.name}`, "Font names copied"));
    $("#save-favorite").addEventListener("click", saveFavorite);
    $("#export-css").addEventListener("click", openExport);
    $("#copy-css").addEventListener("click", () => copyText(cssExport(), "CSS variables copied"));
    $("#download-css").addEventListener("click", downloadCss);
    $("#help-button").addEventListener("click", () => $("#help-dialog").showModal());
    $("#open-preview").addEventListener("click", () => {
      const blob = new Blob([`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Aesthetic preview</title><link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(state.headingFont.name).replace(/%20/g,"+")}&family=${encodeURIComponent(state.bodyFont.name).replace(/%20/g,"+")}&display=swap" rel="stylesheet"><style>:root{--p0:${state.palette[0]};--p1:${state.palette[1]};--p2:${state.palette[2]};--p3:${state.palette[3]};--p4:${state.palette[4]};--p5:${state.palette[5]}}body{margin:0;background:var(--p0);color:var(--p5);font-family:'${state.bodyFont.name}',Arial,sans-serif}main{padding:12vh 10vw}h1{font-family:'${state.headingFont.name}',Georgia,serif;font-size:clamp(3rem,8vw,7rem);font-weight:500;line-height:1;margin:1rem 0}h1 em{color:var(--p2)}p{max-width:35rem;line-height:1.8}button{background:var(--p5);color:var(--p0);border:0;border-radius:6px;padding:1rem 1.4rem;font:inherit}.swatches{display:flex;margin-top:4rem}.swatches i{height:70px;flex:1;background:var(--p0)}${state.palette.map((c,i)=>`.swatches i:nth-child(${i+1}){background:${c}}`).join("")}</style></head><body><main><small>INDEPENDENT CREATIVE STUDIO</small><h1>Ideas that<br><em>feel like</em> something.</h1><p>We build thoughtful digital experiences for brands with something to say.</p><button>Explore our work ↗</button><div class="swatches">${state.palette.map(() => "<i></i>").join("")}</div></main></body></html>`], {type:"text/html"});
      const url = URL.createObjectURL(blob); window.open(url, "_blank", "noopener"); window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    });
    $$("[data-preset]").forEach(button => button.addEventListener("click", () => selectPreset(button.dataset.preset)));
    $$("[data-nav]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.nav)));
    $$(".device-button").forEach(button => button.addEventListener("click", () => setDevice(button.dataset.device)));
    $("#mobile-menu").addEventListener("click", () => {
      const open = $("#sidebar").classList.toggle("open");
      $("#mobile-menu").setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", event => {
      const target = event.target;
      const typing = target && (["INPUT","TEXTAREA","SELECT"].includes(target.tagName) || target.isContentEditable);
      if (typing || event.altKey || event.ctrlKey || event.metaKey) {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") { event.preventDefault(); saveFavorite(); }
        return;
      }
      if (event.code === "Space" && !$("#export-dialog").open && !$("#help-dialog").open) { event.preventDefault(); generateAll(); }
      if (event.key.toLowerCase() === "g") navigate("generate");
      if (event.key === "Escape") $("#sidebar").classList.remove("open");
    });
  }

  init();
})();