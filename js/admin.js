/* ===============================
   ADMIN PANEL – CSP CLEAN
   =============================== */

const gallery = document.getElementById('gallery');
const refreshBtn = document.getElementById('refreshBtn');

/* GANTI DOMAIN WORKER */
const API_BASE = 'https://photobooth-api.ardi-inspirasi1987.workers.dev/ping';
const TOKEN = 'REUNI2026';

/* ===============================
   LOAD IMAGE LIST
   =============================== */

async function loadImages() {
  gallery.innerHTML = '';

  const res = await fetch(`${API_BASE}/list`, {
    headers: { 'X-Event-Token': TOKEN }
  });

  const data = await res.json();

  data.files.forEach(file => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = file.url;
    img.loading = 'lazy';

    const actions = document.createElement('div');
    actions.className = 'actions';

    const approveBtn = document.createElement('button');
    approveBtn.textContent = 'Approve';
    approveBtn.className = 'approve';
    approveBtn.addEventListener('click', () => approveImage(file.name));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete';
    deleteBtn.addEventListener('click', () => deleteImage(file.name));

    actions.appendChild(approveBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(img);
    card.appendChild(actions);
    gallery.appendChild(card);
  });
}

/* ===============================
   ACTIONS
   =============================== */

async function approveImage(name) {
  await fetch(`${API_BASE}/approve`, {
    method: 'POST',
    headers: {
      'X-Event-Token': TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });
  loadImages();
}

async function deleteImage(name) {
  if (!confirm('Hapus foto ini?')) return;

  await fetch(`${API_BASE}/delete`, {
    method: 'POST',
    headers: {
      'X-Event-Token': TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });
  loadImages();
}

/* ===============================
   EVENTS
   =============================== */

refreshBtn.addEventListener('click', loadImages);
window.addEventListener('load', loadImages);
