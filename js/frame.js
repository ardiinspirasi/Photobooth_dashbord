/* ===============================
   FRAME + ORIENTATION HANDLER
   CSP CLEAN
   =============================== */

/* ===== ELEMENTS ===== */
const frameOverlay = document.getElementById('frameOverlay');
const orientationBadge = document.getElementById('orientationBadge');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

/* ===== FRAME ASSETS ===== */
const FRAME_PORTRAIT = 'assets/frame_veteran.png';
const FRAME_LANDSCAPE = 'assets/frame_veteran2.png';

const framePortrait = new Image();
framePortrait.src = FRAME_PORTRAIT;

const frameLandscape = new Image();
frameLandscape.src = FRAME_LANDSCAPE;

/* ===== STATE ===== */
let currentOrientation = 'portrait';

/* ===============================
   ORIENTATION DETECTION
   =============================== */

function detectOrientation() {
  const isPortrait = window.innerHeight >= window.innerWidth;
  const newOrientation = isPortrait ? 'portrait' : 'landscape';

  if (newOrientation !== currentOrientation) {
    currentOrientation = newOrientation;
    updateFrameOverlay();
  }
}

function updateFrameOverlay() {
  if (currentOrientation === 'portrait') {
    frameOverlay.src = FRAME_PORTRAIT;
    orientationBadge.textContent = '📱 Portrait';
  } else {
    frameOverlay.src = FRAME_LANDSCAPE;
    orientationBadge.textContent = '📱 Landscape';
  }
}

/* ===============================
   FRAME DRAW TO CANVAS
   (called after photoCaptured)
   =============================== */

function drawFrameToCanvas() {
  const frameImage =
    currentOrientation === 'portrait'
      ? framePortrait
      : frameLandscape;

  if (!frameImage.complete || frameImage.naturalWidth === 0) {
    frameImage.onload = () => {
      ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
    };
    return;
  }

  ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
}

/* ===============================
   EVENT LISTENERS
   =============================== */

// Saat layar diputar
window.addEventListener('resize', detectOrientation);
window.addEventListener('orientationchange', () => {
  setTimeout(detectOrientation, 100);
});

// Setelah kamera / galeri capture
window.addEventListener('photoCaptured', drawFrameToCanvas);

// Init
window.addEventListener('load', () => {
  detectOrientation();
  updateFrameOverlay();
});
