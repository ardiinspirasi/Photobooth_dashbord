/* ===============================
   CAMERA CORE – CSP CLEAN
   =============================== */

let stream = null;
let facingMode = 'user';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const cameraScreen = document.getElementById('cameraScreen');
const previewScreen = document.getElementById('previewScreen');

const previewImage = document.getElementById('previewImage');
const previewContainer = document.getElementById('previewContainer');

const loadingIndicator = document.getElementById('loadingIndicator');
const fileInput = document.getElementById('fileInput');

/* ===============================
   CAMERA START / STOP
   =============================== */

async function startCamera(mode = 'user') {
  try {
    loadingIndicator.style.display = 'block';

    stopCamera();

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: mode,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    });

    video.srcObject = stream;
    facingMode = mode;

    video.classList.toggle('mirror', mode === 'user');

    video.onloadedmetadata = () => {
      loadingIndicator.style.display = 'none';
    };

  } catch (err) {
    loadingIndicator.style.display = 'none';
    alert('Kamera tidak bisa diakses');
    console.error(err);
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
}

/* ===============================
   CAPTURE PHOTO
   =============================== */

function capturePhoto() {
  if (!video.videoWidth) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.save();

  // mirror selfie
  if (facingMode === 'user') {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  // frame akan di-overlay di frame.js
  window.dispatchEvent(new CustomEvent('photoCaptured'));

  showPreview();
}

function showPreview() {
  previewImage.src = canvas.toDataURL('image/jpeg', 0.95);
  stopCamera();
  switchScreen('preview');
}

/* ===============================
   GALLERY UPLOAD
   =============================== */

function openGallery() {
  fileInput.click();
}

fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      window.dispatchEvent(new CustomEvent('photoCaptured'));
      showPreview();
    };
    img.src = reader.result;
  };

  reader.readAsDataURL(file);
  fileInput.value = '';
});

/* ===============================
   SWITCH CAMERA
   =============================== */

function switchCamera() {
  facingMode = facingMode === 'user' ? 'environment' : 'user';
  startCamera(facingMode);
}

/* ===============================
   SCREEN CONTROL
   =============================== */

function switchScreen(target) {
  cameraScreen.classList.remove('active');
  previewScreen.classList.remove('active');

  if (target === 'camera') cameraScreen.classList.add('active');
  if (target === 'preview') previewScreen.classList.add('active');
}

/* ===============================
   EVENT BINDINGS (CSP SAFE)
   =============================== */

document.getElementById('btnCapture')
  .addEventListener('click', capturePhoto);

document.getElementById('btnSwitchCamera')
  .addEventListener('click', switchCamera);

document.getElementById('btnGallery')
  .addEventListener('click', openGallery);

document.getElementById('btnRetake')
  .addEventListener('click', () => {
    switchScreen('camera');
    startCamera(facingMode);
  });

/* ===============================
   INIT
   =============================== */

window.addEventListener('load', () => {
  startCamera('user');
});

window.addEventListener('beforeunload', stopCamera);
