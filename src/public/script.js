async function search(q) {
  const res = await fetch(`/songs/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('Failed to search');
  const data = await res.json();
  return data.tracks || [];
}

function createCard(track) {
  const el = document.createElement('div');
  el.className = 'card';

  const img = document.createElement('img');
  img.src = track.image || '';

  const meta = document.createElement('div');
  meta.className = 'meta';
  const title = document.createElement('h3');
  title.textContent = track.name;
  const subtitle = document.createElement('p');
  subtitle.textContent = `${track.artists} — ${track.album}`;

  const actions = document.createElement('div');
  actions.className = 'actions';
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Review';
  btn.onclick = () => openReview(track);

  actions.appendChild(btn);
  meta.appendChild(title);
  meta.appendChild(subtitle);
  el.appendChild(img);
  el.appendChild(meta);
  el.appendChild(actions);
  return el;
}

let currentTrack = null;

function openReview(track) {
  currentTrack = track;

  document
    .getElementById('modal')
    .classList.remove('hidden');

  document.getElementById('ratingInput').value = '';
  document.getElementById('commentInput').value = '';
}

document.getElementById('cancelModal').onclick = () => {
  document
    .getElementById('modal')
    .classList.add('hidden');
};

document.getElementById('reviewForm').addEventListener('submit', async event => {
  event.preventDefault();

  const rating = Number(
    document.getElementById('ratingInput').value
  );

  const comment =
    document.getElementById('commentInput').value;

  if (
    Number.isNaN(rating) ||
    rating < 0 ||
    rating > 10
  ) {
    return alert('Nota inválida');
  }

  try {
    await fetch('/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        songId: currentTrack.id,
        songName: currentTrack.name,
        rating,
        comment
      })
    });

    document
      .getElementById('modal')
      .classList.add('hidden');

    loadReviews();
    showToast('Review adicionada com sucesso!');

  } catch {
    alert('Erro ao salvar review');
  }
});

function renderResults(tracks) {
  const container = document.getElementById('results');
  container.innerHTML = '';
  tracks.forEach(t => container.appendChild(createCard(t)));
}

async function loadReviews() {
  const res = await fetch('/reviews');
  const data = await res.json();
  const list = document.getElementById('reviewsList');
  list.innerHTML = '';
  data.forEach(r => {
    const li = document.createElement('li');
    li.className = 'reviewItem';
    li.innerHTML = `<div><strong>${r.songName}</strong><div class="small">Nota: ${r.rating} — ${r.comment}</div></div>`;
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Deletar';
    btn.onclick = async () => {
      if (!confirm('Deletar review?')) return;
      await fetch(`/reviews/${r.id}`, { method: 'DELETE' });
      loadReviews();
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}

const searchButton = document.getElementById('btnSearch');
const loadingIndicator = document.getElementById('loadingIndicator');
const toast = document.getElementById('toast');

function setLoading(isLoading) {
  searchButton.disabled = isLoading;
  loadingIndicator.classList.toggle('hidden', !isLoading);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 2500);
}

async function doSearch() {
  const q = document.getElementById('query').value.trim();
  if (!q) return;

  setLoading(true);
  try {
    const tracks = await search(q);
    renderResults(tracks);
  } catch (err) {
    alert('Erro na busca');
  } finally {
    setLoading(false);
  }
}

document.getElementById('btnSearch').addEventListener('click', doSearch);

document.getElementById('query').addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    doSearch();
  }
});

window.addEventListener('load', () => loadReviews());
