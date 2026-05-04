// ╔══════════════════════════════════════════════════════════════════╗
// ║  SECTION REDIRECT CONFIG — EDIT THESE 10 URLs                    ║
// ║                                                                  ║
// ║  Slider has 4 main snap points (Office, Clubhouse,               ║
// ║  Entrance Garden, Plots). When in Plots zone, a sub-pill row     ║
// ║  appears with 7 plot sizes. Each has its own URL.                ║
// ║                                                                  ║
// ║  Set any URL to null/empty string to disable redirect.           ║
// ╚══════════════════════════════════════════════════════════════════╝
const SECTION_LINKS = {
  office:    'office.html',
  clubhouse: 'https://example.com/clubhouse',
  garden:    'https://example.com/entrance-garden',
  // 7 plot sizes
  'plot-150': 'https://example.com/plot-150yd',
  'plot-200': 'https://example.com/plot-200yd',
  'plot-250': 'https://example.com/plot-250yd',
  'plot-300': 'https://example.com/plot-300yd',
  'plot-350': 'https://example.com/plot-350yd',
  'plot-400': 'https://example.com/plot-400yd',
  'plot-450': 'https://example.com/plot-450yd',
};
// Set to true to open the link in a new tab; false replaces the current page
const ZONE_LINK_OPEN_NEW_TAB = false;

// Section metadata (display name + meta caption + section number)
const SECTION_META = {
  office:    { name: 'Office',           meta: 'Section 01  ·  Administrative',     num: 1 },
  clubhouse: { name: 'Clubhouse',        meta: 'Section 02  ·  Lounge · Pool · Spa', num: 2 },
  garden:    { name: 'Entrance Garden',  meta: 'Section 03  ·  Fountains · Landscape', num: 3 },
  plots:     { name: 'Plots',            meta: 'Section 04  ·  Choose Your Size',   num: 4 },
};

// ══════════════════════════════════════════════════════
// ENVIRONMENT SLIDER
// ══════════════════════════════════════════════════════
const slider  = document.getElementById('envSlider');
function refreshSliderVisual() {
  const v = parseFloat(slider.value);
  const pct = (v / 24) * 100;
  const bg = `linear-gradient(to right, var(--gold) 0%, var(--gold) ${pct}%, rgba(200,175,120,0.2) ${pct}%, rgba(200,175,120,0.2) 100%)`;
  slider.style.background = bg;
  slider.style.setProperty('--pct', pct + '%');
}
refreshSliderVisual();
slider.addEventListener('input', refreshSliderVisual);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    refreshSliderVisual();
    updateRangeTrack(minRange);
    updateRangeTrack(maxRange);
    updateRangeTrack(areaRange);
  }
});
window.addEventListener('focus', () => {
  refreshSliderVisual();
  updateRangeTrack(minRange);
  updateRangeTrack(maxRange);
  updateRangeTrack(areaRange);
});
window.addEventListener('pageshow', () => {
  refreshSliderVisual();
  updateRangeTrack(minRange);
  updateRangeTrack(maxRange);
  updateRangeTrack(areaRange);
});

// ══════════════════════════════════════════════════════
// PRICE RANGE SLIDERS
// ══════════════════════════════════════════════════════
function formatPrice(val) {
  val = parseInt(val);
  if (val >= 100) return '₹ ' + (val / 100).toFixed(1) + ' Cr';
  return '₹ ' + val + ' L';
}
function updateRangeTrack(input) {
  const min = parseFloat(input.min), max = parseFloat(input.max), val = parseFloat(input.value);
  const pct = ((val - min) / (max - min)) * 100;
  input.style.background = `linear-gradient(to right, var(--gold) 0%, var(--gold) ${pct}%, rgba(200,175,120,0.2) ${pct}%, rgba(200,175,120,0.2) 100%)`;
}
const minRange = document.getElementById('minPriceRange');
const maxRange = document.getElementById('maxPriceRange');
const minLabel = document.getElementById('minPriceLabel');
const maxLabel = document.getElementById('maxPriceLabel');
function updateMinPrice() {
  if (parseInt(minRange.value) > parseInt(maxRange.value)) minRange.value = maxRange.value;
  minLabel.textContent = 'Min — ' + formatPrice(minRange.value);
  updateRangeTrack(minRange);
}
function updateMaxPrice() {
  if (parseInt(maxRange.value) < parseInt(minRange.value)) maxRange.value = minRange.value;
  maxLabel.textContent = 'Max — ' + formatPrice(maxRange.value);
  updateRangeTrack(maxRange);
}
minRange.addEventListener('input', updateMinPrice);
maxRange.addEventListener('input', updateMaxPrice);
updateRangeTrack(minRange);
updateRangeTrack(maxRange);

const areaRange = document.getElementById('areaRange');
const areaMinLabel = document.getElementById('areaMinLabel');
areaRange.addEventListener('input', () => {
  areaMinLabel.textContent = areaRange.value;
  updateRangeTrack(areaRange);
});
updateRangeTrack(areaRange);

// ══════════════════════════════════════════════════════
// FLOOR PILLS
// ══════════════════════════════════════════════════════
document.getElementById('floorPills').addEventListener('click', function(e) {
  const pill = e.target.closest('.weather-pill');
  if (!pill) return;
  this.querySelectorAll('.weather-pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
});

// ══════════════════════════════════════════════════════
// FILTER CHIPS
// ══════════════════════════════════════════════════════
let openChip = null;
document.getElementById('filterBar').addEventListener('click', function(e) {
  const chip = e.target.closest('.filter-chip');
  if (!chip) return;
  if (e.target.closest('.filter-dropdown')) return;
  e.stopPropagation();
  if (openChip && openChip !== chip) {
    openChip.classList.remove('open');
    const prevDd = openChip.querySelector('.filter-dropdown');
    if (prevDd) prevDd.removeAttribute('style');
  }
  const isOpen = chip.classList.toggle('open');
  if (isOpen) {
    openChip = chip;
    positionDropdown(chip);
  } else {
    openChip = null;
  }
});
function positionDropdown(chip) {
  const dd = chip.querySelector('.filter-dropdown');
  if (!dd) return;
  const isMobileLandscape = window.innerHeight <= 500 && window.innerWidth > window.innerHeight;
  if (isMobileLandscape) {
    const rect = chip.getBoundingClientRect();
    dd.style.left = Math.min(rect.left, window.innerWidth - 200) + 'px';
    dd.style.top = (rect.bottom + 6) + 'px';
  }
}
document.addEventListener('click', function(e) {
  const opt = e.target.closest('.dd-option[data-chip]');
  if (opt) {
    e.stopPropagation();
    opt.classList.toggle('selected');
    const chk = opt.querySelector('.dd-check');
    if (chk) chk.textContent = opt.classList.contains('selected') ? '✓' : '';
    const chipId = opt.dataset.chip;
    const chip = document.getElementById(chipId);
    if (chip) {
      const anySelected = chip.querySelectorAll('.dd-option.selected').length > 0;
      chip.classList.toggle('active', anySelected || chip.classList.contains('open'));
    }
    return;
  }
  if (openChip && !openChip.contains(e.target)) {
    openChip.classList.remove('open');
    openChip = null;
  }
});

// ══════════════════════════════════════════════════════
// BOTTOM NAV
// ══════════════════════════════════════════════════════
let openNav = null;
document.getElementById('bottomNav').addEventListener('click', function(e) {
  const item = e.target.closest('.nav-item');
  if (!item) return;
  if (e.target.closest('.nav-dropdown')) return;
  const id = item.id;
  if (id === 'nav-units') {
    document.querySelectorAll('.nav-item').forEach(n => { n.classList.remove('active','open'); });
    item.classList.add('active');
    if (openNav) { openNav.classList.remove('open'); openNav = null; }
    document.getElementById('unitPanel').classList.toggle('open');
    return;
  }
  document.getElementById('unitPanel').classList.remove('open');
  if (item.id === 'nav-amenities') {
    document.querySelectorAll('.nav-item').forEach(n => { n.classList.remove('active','open'); });
    item.classList.add('active');
    if (openNav === item) {
      item.classList.remove('open');
      openNav = null;
    } else {
      item.classList.add('open');
      openNav = item;
    }
    return;
  }
  document.querySelectorAll('.nav-item').forEach(n => { n.classList.remove('active','open'); });
  item.classList.add('active');
  if (openNav) { openNav.classList.remove('open'); openNav = null; }
});
document.getElementById('amenitiesDropdown').addEventListener('click', function(e) {
  e.stopPropagation();
  const item = e.target.closest('.nav-dd-item');
  if (item) item.classList.toggle('selected');
});
document.addEventListener('click', function(e) {
  if (openNav && !openNav.contains(e.target)) {
    openNav.classList.remove('open');
    openNav = null;
  }
});

// ══════════════════════════════════════════════════════
// AUTO-HIDE UI on mobile landscape
// ══════════════════════════════════════════════════════
const filterBar  = document.getElementById('filterBar');
const bottomNav  = document.getElementById('bottomNav');
const uiToggleBtn = document.getElementById('uiToggleBtn');
let uiHideTimer  = null;
let uiVisible    = true;
function isMobileLandscape() {
  return window.innerHeight <= 500 && window.innerWidth > window.innerHeight;
}
function hideUI() {
  if (!isMobileLandscape()) return;
  filterBar.classList.add('ui-hidden');
  bottomNav.classList.add('ui-hidden');
  uiToggleBtn.textContent = '⊞ Show Controls';
  uiToggleBtn.style.opacity = '1';
  uiVisible = false;
  if (openChip) { openChip.classList.remove('open'); openChip = null; }
  if (openNav)  { openNav.classList.remove('open');  openNav = null;  }
}
function showUI() {
  filterBar.classList.remove('ui-hidden');
  bottomNav.classList.remove('ui-hidden');
  uiToggleBtn.textContent = '✕ Hide Controls';
  uiVisible = true;
  resetHideTimer();
}
function resetHideTimer() {
  clearTimeout(uiHideTimer);
  if (isMobileLandscape()) uiHideTimer = setTimeout(hideUI, 3000);
}
uiToggleBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  if (uiVisible) hideUI(); else showUI();
});
document.addEventListener('pointerdown', function(e) {
  if (!isMobileLandscape()) return;
  if (e.target.closest('.filter-bar, .bottom-nav, .unit-panel, .ui-toggle-btn, .compass, .env-bar')) {
    resetHideTimer();
    return;
  }
  if (!uiVisible) showUI(); else resetHideTimer();
});
window.addEventListener('resize', () => {
  if (isMobileLandscape()) {
    resetHideTimer();
  } else {
    clearTimeout(uiHideTimer);
    filterBar.classList.remove('ui-hidden');
    bottomNav.classList.remove('ui-hidden');
    uiVisible = true;
  }
});
if (isMobileLandscape()) resetHideTimer();

// ══════════════════════════════════════════════════════
// IMAGE SEQUENCE CANVAS
// ══════════════════════════════════════════════════════
const FRAME_COUNT  = 600;
const FRAME_PATH   = 'frames/';
const FRAME_PREFIX = 'frame_';
const FRAME_PAD    = 4;
const FRAME_EXT    = '.jpg';
const ENABLE_BLEND = true;

const canvas       = document.getElementById('bgCanvas');
const ctx          = canvas.getContext('2d');
const statusEl     = document.getElementById('videoStatus');
const statusText   = document.getElementById('statusText');
const progressFill = document.getElementById('progressFill');
const frames       = new Array(FRAME_COUNT);
let   loadedCount  = 0;
let   ready        = false;
statusEl.classList.add('show');
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.imageSmoothingQuality = 'high';
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
function preload() {
  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    const num = String(i + 1).padStart(FRAME_PAD, '0');
    img.src = `${FRAME_PATH}${FRAME_PREFIX}${num}${FRAME_EXT}`;
    img.onload  = onFrameLoad;
    img.onerror = () => onFrameError(num);
    frames[i] = img;
  }
}
function onFrameLoad() {
  loadedCount++;
  const pct = loadedCount / FRAME_COUNT;
  progressFill.style.width = (pct * 100) + '%';
  statusText.textContent = `Loading frames… ${Math.round(pct * 100)}%`;
  if (loadedCount === FRAME_COUNT) {
    ready = true;
    canvas.classList.add('ready');
    statusEl.classList.remove('show');
    displayedFloat = sliderToFrameFloat();
    targetFloat    = displayedFloat;
  }
}
function onFrameError(num) {
  statusText.textContent = `❌ Frame "${FRAME_PREFIX}${num}${FRAME_EXT}" not found in /${FRAME_PATH}`;
  statusEl.classList.add('error');
}
function sliderToFrameFloat() {
  return (parseFloat(slider.value) / 24) * (FRAME_COUNT - 1);
}
function drawImgCover(img, alpha) {
  const iw = img.naturalWidth, ih = img.naturalHeight;
  if (!iw || !ih) return;
  const cw = canvas.width, ch = canvas.height;
  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale, dh = ih * scale;
  const dx = (cw - dw) / 2, dy = (ch - dh) / 2;
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, dx, dy, dw, dh);
}
function drawAt(floatIndex) {
  if (!ready) return;
  const lo = Math.max(0, Math.floor(floatIndex));
  const hi = Math.min(FRAME_COUNT - 1, lo + 1);
  const t  = floatIndex - lo;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!ENABLE_BLEND || t === 0 || lo === hi) {
    drawImgCover(frames[lo], 1);
  } else {
    drawImgCover(frames[lo], 1);
    drawImgCover(frames[hi], t);
  }
  ctx.globalAlpha = 1;
}

let targetFloat    = 0;
let displayedFloat = 0;
let velocity       = 0;
let isDragging     = false;
let lastSampleTime = 0;
let lastSampleVal  = 0;
let lastTickTime   = performance.now();
const FRICTION_PER_FRAME  = 0.92;
const DRAG_LERP_PER_FRAME = 0.001;
const VELOCITY_EMA        = 0.55;
let dragDirection = 0;
let dragStartVal  = 0;

slider.addEventListener('pointerdown', () => {
  isDragging    = true; velocity = 0;
  atZoneEnd     = false;
  dragDirection = 0;
  dragStartVal  = parseFloat(slider.value);
  svgOverlay.classList.remove('visible');
  lastSampleTime = performance.now(); lastSampleVal = sliderToFrameFloat();
});
let zoneSnapAnim = null;

// ══════════════════════════════════════════════════════
// SECTION ZONES — 4 zones (Office/Clubhouse/Garden/Plots)
// ══════════════════════════════════════════════════════
const SECTION_KEYS = ['office', 'clubhouse', 'garden', 'plots'];

function getCurrentZone() {
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  const val = parseFloat(slider.value);
  let pct = (val - min) / (max - min);
  if (pct < 0) pct = 0;
  if (pct > 1) pct = 1;
  // 4 zones: 0-0.25, 0.25-0.5, 0.5-0.75, 0.75-1
  let zone = Math.floor(pct * 4);
  if (zone > 3) zone = 3;
  return { zone, pct, key: SECTION_KEYS[zone] };
}

function snapToZoneEnd() {
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  const val = parseFloat(slider.value);
  let pct = (val - min) / (max - min);
  if (pct < 0) pct = 0;
  if (pct > 1) pct = 1;

  const zoneIndex    = Math.min(3, Math.floor(pct * 4));
  const zoneStartPct = zoneIndex / 4;
  const zoneEndPct   = (zoneIndex + 1) / 4;

  const snapPct    = dragDirection >= 0 ? zoneEndPct : zoneStartPct;
  const zoneEndVal = min + snapPct * (max - min);
  const isEndPoint = dragDirection >= 0;

  if (Math.abs(val - zoneEndVal) < 0.01) {
    finalizeSnap(zoneIndex, isEndPoint);
    return;
  }
  if (zoneSnapAnim) { cancelAnimationFrame(zoneSnapAnim); zoneSnapAnim = null; }

  const startVal  = val;
  const endVal    = zoneEndVal;
  const duration  = 900;
  const startTime = performance.now();
  function easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2; }

  function animateSnap(now) {
    const elapsed = now - startTime;
    const t       = Math.min(1, elapsed / duration);
    const eased   = easeInOutCubic(t);
    const newVal  = startVal + (endVal - startVal) * eased;
    slider.value = newVal;
    refreshSliderVisual();
    velocity    = 0;
    targetFloat = sliderToFrameFloat();
    if (t < 1) {
      zoneSnapAnim = requestAnimationFrame(animateSnap);
    } else {
      slider.value   = endVal;
      refreshSliderVisual();
      targetFloat    = sliderToFrameFloat();
      displayedFloat = targetFloat;
      velocity       = 0;
      zoneSnapAnim   = null;
      finalizeSnap(zoneIndex, isEndPoint);
    }
  }
  zoneSnapAnim = requestAnimationFrame(animateSnap);
}

function finalizeSnap(zoneIndex, isEndPoint) {
  atZoneEnd = isEndPoint;
  const sectionKey = SECTION_KEYS[zoneIndex];
  if (isEndPoint && sectionKey !== 'plots') {
    // Show main section SVG
    svgOverlay.classList.add('at-endpoint');
    showSectionSvg(sectionKey);
    svgOverlay.classList.add('visible');
    // Hide plot bar
    plotBar.classList.remove('visible');
    activePlot = null;
    document.querySelectorAll('.plot-pill').forEach(p => p.classList.remove('active'));
  } else if (isEndPoint && sectionKey === 'plots') {
    // Show plot bar instead of overall SVG initially
    svgOverlay.classList.remove('visible');
    svgOverlay.classList.remove('at-endpoint');
    hideAllSvgs();
    plotBar.classList.add('visible');
    // If a plot was previously selected, re-show it
    if (activePlot) {
      showPlotSvg(activePlot);
      svgOverlay.classList.add('at-endpoint');
      svgOverlay.classList.add('visible');
    }
  } else {
    svgOverlay.classList.remove('at-endpoint');
    svgOverlay.classList.remove('visible');
    plotBar.classList.remove('visible');
  }
}

// ══════════════════════════════════════════════════════
// AUTO SNAP TOGGLE
// ══════════════════════════════════════════════════════
let autoSnap = true;
document.getElementById('snapToggle').addEventListener('click', function() {
  autoSnap = !autoSnap;
  this.classList.toggle('on', autoSnap);
  if (!autoSnap && zoneSnapAnim) {
    cancelAnimationFrame(zoneSnapAnim);
    zoneSnapAnim = null;
  }
});

const endDrag = () => {
  isDragging = false;
  if (autoSnap) {
    snapToZoneEnd();
  } else {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const pct = (parseFloat(slider.value) - min) / (max - min);
    const nearEnd = [0.25, 0.5, 0.75, 1.0].some(z => Math.abs(pct - z) < 0.005);
    atZoneEnd = nearEnd;
    if (nearEnd) {
      const idx = Math.round(pct * 4) - 1;
      finalizeSnap(Math.max(0, Math.min(3, idx)), true);
    } else {
      svgOverlay.classList.remove('visible');
      svgOverlay.classList.remove('at-endpoint');
      plotBar.classList.remove('visible');
    }
  }
};
slider.addEventListener('pointerup', endDrag);
slider.addEventListener('pointercancel', endDrag);
slider.addEventListener('lostpointercapture', endDrag);

slider.addEventListener('input', () => {
  refreshSliderVisual();
  const currentVal = parseFloat(slider.value);
  if (isDragging && currentVal !== dragStartVal) {
    dragDirection = currentVal > dragStartVal ? 1 : -1;
  }
  // update section name display live
  updateSectionDisplay();
  if (!ready) return;
  const now = performance.now();
  const newFloat = sliderToFrameFloat();
  if (isDragging) {
    if (lastSampleTime > 0) {
      const dt = Math.max(1, now - lastSampleTime);
      const instantVel = (newFloat - lastSampleVal) / dt;
      velocity = velocity * (1 - VELOCITY_EMA) + instantVel * VELOCITY_EMA;
    }
    lastSampleTime = now; lastSampleVal = newFloat; targetFloat = newFloat;
  } else {
    velocity = 0; targetFloat = newFloat; displayedFloat = newFloat;
  }
});

function tick() {
  const now = performance.now();
  const dt  = Math.min(50, now - lastTickTime);
  lastTickTime = now;
  if (ready) {
    if (isDragging) {
      const k = 1 - Math.pow(DRAG_LERP_PER_FRAME, dt / 16);
      displayedFloat += (targetFloat - displayedFloat) * k;
    } else if (Math.abs(velocity) > 0.00005 || Math.abs(displayedFloat - targetFloat) > 0.01) {
      displayedFloat += velocity * dt;
      velocity *= Math.pow(FRICTION_PER_FRAME, dt / 16);
      const pull = 1 - Math.pow(0.85, dt / 16);
      displayedFloat += (targetFloat - displayedFloat) * pull;
      if (displayedFloat <= 0)               { displayedFloat = 0;               velocity = 0; }
      if (displayedFloat >= FRAME_COUNT - 1) { displayedFloat = FRAME_COUNT - 1; velocity = 0; }
    } else {
      const k = 1 - Math.pow(0.001, dt / 16);
      displayedFloat += (targetFloat - displayedFloat) * k;
    }
    drawAt(displayedFloat);
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
preload();

// ══════════════════════════════════════════════════════
// SECTION NAME DISPLAY (morphs as user scrubs)
// ══════════════════════════════════════════════════════
const sectionNameEl = document.getElementById('sectionName');
const sectionMetaEl = document.getElementById('sectionMeta');
let lastSectionKey = null;

function updateSectionDisplay() {
  const { key } = getCurrentZone();
  if (key === lastSectionKey) return;
  lastSectionKey = key;
  const meta = SECTION_META[key];
  // morph effect
  sectionNameEl.classList.add('morphing');
  setTimeout(() => {
    sectionNameEl.textContent = meta.name;
    sectionMetaEl.textContent = meta.meta;
    sectionNameEl.classList.remove('morphing');
    // highlight active tick
    document.querySelectorAll('.slider-tick').forEach(t => t.classList.remove('active'));
    const activeTick = document.querySelector(`.slider-tick[data-section="${key}"]`);
    if (activeTick) activeTick.classList.add('active');
  }, 120);
}
updateSectionDisplay();

// ══════════════════════════════════════════════════════
// TICK CLICK — animate slider to that section
// ══════════════════════════════════════════════════════
document.getElementById('sliderTicks').addEventListener('click', function(e) {
  const tick = e.target.closest('.slider-tick[data-zone]');
  if (!tick) return;
  e.stopPropagation();
  const targetPct = parseFloat(tick.dataset.zone);
  const min       = parseFloat(slider.min);
  const max       = parseFloat(slider.max);
  const endVal    = min + targetPct * (max - min);
  const startVal  = parseFloat(slider.value);
  if (Math.abs(startVal - endVal) < 0.01) return;
  if (zoneSnapAnim) { cancelAnimationFrame(zoneSnapAnim); zoneSnapAnim = null; }
  atZoneEnd = false;
  svgOverlay.classList.remove('visible');
  svgOverlay.classList.remove('at-endpoint');
  plotBar.classList.remove('visible');
  const duration  = 900;
  const startTime = performance.now();
  function easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2; }
  function animateTick(now) {
    const t      = Math.min(1, (now - startTime) / duration);
    const eased  = easeInOutCubic(t);
    slider.value = startVal + (endVal - startVal) * eased;
    refreshSliderVisual();
    velocity    = 0;
    targetFloat = sliderToFrameFloat();
    if (t < 1) {
      zoneSnapAnim = requestAnimationFrame(animateTick);
    } else {
      slider.value   = endVal;
      refreshSliderVisual();
      targetFloat    = sliderToFrameFloat();
      displayedFloat = targetFloat;
      velocity       = 0;
      zoneSnapAnim   = null;
      atZoneEnd = true;
      const tickZoneIdx = Math.round(targetPct * 4) - 1;
      finalizeSnap(Math.max(0, Math.min(3, tickZoneIdx)), true);
    }
  }
  zoneSnapAnim = requestAnimationFrame(animateTick);
});

// ══════════════════════════════════════════════════════
// SVG CUTOUTS
// ══════════════════════════════════════════════════════
const svgOverlay = document.getElementById('svgOverlay');
let   atZoneEnd  = false;
const allSvgs    = svgOverlay.querySelectorAll('.zone-svg');

function hideAllSvgs() {
  allSvgs.forEach(s => s.style.display = 'none');
}
function showSectionSvg(key) {
  hideAllSvgs();
  const target = svgOverlay.querySelector(`.zone-svg[data-zone-svg="${key}"]`);
  if (target) target.style.display = 'block';
}
function showPlotSvg(plotSize) {
  hideAllSvgs();
  const target = svgOverlay.querySelector(`.zone-svg[data-zone-svg="plot-${plotSize}"]`);
  if (target) target.style.display = 'block';
}

// SVG hover & click
allSvgs.forEach(svg => {
  svg.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!atZoneEnd) return;
    const key = svg.dataset.zoneSvg;
    const url = SECTION_LINKS[key];
    if (!url) return;
    if (ZONE_LINK_OPEN_NEW_TAB) {
      window.open(url, '_blank', 'noopener');
    } else {
      window.location.href = url;
    }
  });
});

// ══════════════════════════════════════════════════════
// PLOT SUB-PILL ROW
// ══════════════════════════════════════════════════════
const plotBar = document.getElementById('plotBar');
let activePlot = null;

if (plotBar) plotBar.addEventListener('click', function(e) {
  const pill = e.target.closest('.plot-pill');
  if (!pill) return;
  e.stopPropagation();
  const size = pill.dataset.plot;
  // toggle: if same plot already active → deactivate (hides SVG)
  if (activePlot === size) {
    activePlot = null;
    pill.classList.remove('active');
    svgOverlay.classList.remove('visible');
    svgOverlay.classList.remove('at-endpoint');
    return;
  }
  // activate this plot
  document.querySelectorAll('.plot-pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
  activePlot = size;
  showPlotSvg(size);
  svgOverlay.classList.add('at-endpoint');
  svgOverlay.classList.add('visible');
});