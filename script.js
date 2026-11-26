// Dados temporários: arrays mantêm favoritos e opiniões durante a visita.
const favorites = [];
const reviews = [];

const favoriteList = document.getElementById('favoriteList');
const favoriteCount = document.getElementById('favoriteCount');

function renderFavorites() {
  favoriteList.innerHTML = '';
  if (favorites.length === 0) {
    favoriteList.innerHTML = '<li class="empty-state">Você ainda não adicionou ninguém.</li>';
  } else {
    favorites.forEach((name) => {
      const item = document.createElement('li');
      item.textContent = name;
      const remove = document.createElement('button');
      remove.className = 'remove-favorite';
      remove.type = 'button';
      remove.textContent = 'Remover';
      remove.setAttribute('aria-label', `Remover ${name} dos favoritos`);
      remove.addEventListener('click', () => {
        const index = favorites.indexOf(name);
        if (index !== -1) favorites.splice(index, 1);
        updateFavoriteButtons();
        renderFavorites();
      });
      item.appendChild(remove);
      favoriteList.appendChild(item);
    });
  }
  favoriteCount.textContent = favorites.length;
}

function updateFavoriteButtons() {
  document.querySelectorAll('.favorite-btn').forEach((button) => {
    const saved = favorites.includes(button.dataset.name);
    button.classList.toggle('saved', saved);
    button.textContent = saved ? '♥ Remover dos favoritos' : '♡ Adicionar aos favoritos';
  });
}

document.querySelectorAll('.favorite-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const name = button.dataset.name;
    const index = favorites.indexOf(name);
    if (index === -1) favorites.push(name);
    else favorites.splice(index, 1);
    updateFavoriteButtons();
    renderFavorites();
  });
});

// Filtro de personagens: altera a exibição dos cards no DOM.
document.querySelectorAll('.filter-btn').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.character-wrap').forEach((card) => {
      card.classList.toggle('d-none', filter !== 'todos' && card.dataset.kind !== filter);
    });
  });
});

const reviewForm = document.getElementById('reviewForm');
const formMessage = document.getElementById('formMessage');
const reviewList = document.getElementById('reviewList');

function renderReviews() {
  reviewList.innerHTML = '';
  if (reviews.length === 0) {
    reviewList.innerHTML = '<p class="muted">Ainda não há opiniões cadastradas.</p>';
    return;
  }
  reviews.forEach((review) => {
    const column = document.createElement('div');
    column.className = 'col-md-6 col-lg-4';
    const card = document.createElement('article');
    card.className = 'review-card';
    const author = document.createElement('strong');
    author.textContent = review.name;
    const opinion = document.createElement('p');
    opinion.textContent = review.opinion;
    card.append(author, opinion);
    column.appendChild(card);
    reviewList.appendChild(column);
  });
}

reviewForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nameInput = document.getElementById('visitorName');
  const opinionInput = document.getElementById('visitorOpinion');
  const name = nameInput.value.trim();
  const opinion = opinionInput.value.trim();

  nameInput.classList.toggle('is-invalid', name.length < 2);
  opinionInput.classList.toggle('is-invalid', opinion.length < 5);

  if (name.length < 2 || opinion.length < 5) {
    formMessage.textContent = 'Confira os campos destacados antes de enviar.';
    formMessage.className = 'form-message error';
    return;
  }

  reviews.push({ name, opinion });
  renderReviews();
  reviewForm.reset();
  nameInput.classList.remove('is-invalid');
  opinionInput.classList.remove('is-invalid');
  formMessage.textContent = 'Sua opinião foi registrada com sucesso nesta visita!';
  formMessage.className = 'form-message success';
});

renderFavorites();
renderReviews();
