/* ===============================
   FINAL IMAGE RENDER & UPLOAD
   CSP CLEAN
   =============================== */

/* ===== ELEMENTS ===== */
const btnDownload = document.getElementById('btnDownload');
const btnUpload = document.getElementById('btnUpload');

const previewContainer = document.getElementById('previewContainer');
const cameraVideo = document.getElementById('cameraVideo');
const cameraCanvas = document.getElementById('cameraCanvas');
const frameImage = document.getElementById('frameImage');

/* ===== CANVAS ===== */
const finalCanvas = document.createElement('canvas');
const ctx = finalCanvas.getContext('2d');

/* ===============================
   BUILD FINAL IMAGE
   =============================== */

function buildFinalImage() {
  const width = cameraCanvas.width;
  const height = cameraCanvas.height;

  finalCanvas.width = width;
  finalCanvas.height = height;

  ctx.clearRect(0, 0, width, height);

  /* --- CAMERA IMAGE --- */
  ctx.drawImage(cameraCanvas, 0, 0, width, height);

  /* --- FRAME --- */
  if (frameImage && frameImage.complete) {
    ctx.drawImage(frameImage, 0, 0, width, height);
  }

  /* --- BADGE / STICKER --- */
  const badgeData = window.getActiveBadge
    ? window.getActiveBadge()
    : null;

  if (badgeData && badgeData.element) {
    const img = badgeData.element.querySelector('img');

    if (img && img.complete) {
      const scaleX = width / previewContainer.clientWidth;
      const scaleY = height / previewContainer.clientHeight;

      const x = badgeData.element.offsetLeft * scaleX;
      const y = badgeData.element.offsetTop * scaleY;
      const w = badgeData.element.offsetWidth * scaleX;
      const h = badgeData.element.offsetHeight * scaleY;

      ctx.drawImage(img, x, y, w, h);
    }
  }

  return finalCanvas.toDataURL('image/png');
}

/* ===============================
   DOWNLOAD
   =============================== */

function downloadImage() {
  const dataURL = buildFinalImage();
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'reuni-frame.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ===============================
   UPLOAD (OPTIONAL)
   =============================== */

async function uploadImage() {
  const dataURL = buildFinalImage();

  const blob = await (await fetch(dataURL)).blob();
  const formData = new FormData();
  formData.append('file', blob, 'reuni-frame.png');

  /* GANTI URL INI */
  const UPLOAD_ENDPOINT = 'https://example.com/upload';

  try {
    btnUpload.disabled = true;
    btnUpload.textContent = 'Uploading...';

    const res = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error('Upload gagal');

    alert('Upload berhasil!');
  } catch (err) {
    alert('Upload error');
    console.error(err);
  } finally {
    btnUpload.disabled = false;
    btnUpload.textContent = 'Upload';
  }
}

/* ===============================
   EVENT BINDING
   =============================== */

if (btnDownload) {
  btnDownload.addEventListener('click', downloadImage);
}

if (btnUpload) {
  btnUpload.addEventListener('click', uploadImage);
}
