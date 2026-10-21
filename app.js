const movies = [
  {title:"Дюна: Часть вторая",year:2024,genre:"Фантастика",rating:"8.5",tag:"IMAX",poster:"https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",desc:"Путешествие Пола Атрейдеса продолжается среди песков Арракиса."},
  {title:"Оппенгеймер",year:2023,genre:"Драма",rating:"8.3",tag:"IMAX",poster:"https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",desc:"История учёного, чьи открытия изменили ход истории."},
  {title:"Интерстеллар",year:2014,genre:"Фантастика",rating:"8.7",tag:"Космос",poster:"https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",desc:"Команда исследователей отправляется за пределы нашей галактики."},
  {title:"Человек-паук: Паутина вселенных",year:2023,genre:"Анимация",rating:"8.6",tag:"Анимация",poster:"https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj9522f.jpg",desc:"Майлз Моралес встречает новых героев из разных вселенных."},
  {title:"Мстители: Война бесконечности",year:2018,genre:"Экшен",rating:"8.4",tag:"IMAX",poster:"https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",desc:"Мстители объединяются перед лицом величайшей угрозы."},
  {title:"Бегущий по лезвию 2049",year:2017,genre:"Фантастика",rating:"8.0",tag:"Sci-Fi",poster:"https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",desc:"Офицер Кей раскрывает тайну, способную изменить общество."},
  {title:"Начало",year:2010,genre:"Экшен",rating:"8.8",tag:"Mind-bend",poster:"https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",desc:"Команда специалистов проникает в мир чужих снов."},
  {title:"Головоломка 2",year:2024,genre:"Анимация",rating:"7.6",tag:"Семейный",poster:"https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",desc:"Внутри разума Райли появляются новые эмоции."},
  {title:"Топ Ган: Мэверик",year:2022,genre:"Экшен",rating:"8.2",tag:"Полёт",poster:"https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",desc:"Легендарный пилот готовит новое поколение лётчиков."},
  {title:"Гравитация",year:2013,genre:"Драма",rating:"7.7",tag:"Космос",poster:"https://image.tmdb.org/t/p/w500/kZ2nZw8D681aphje8NJi8EfbL1U.jpg",desc:"Астронавты борются за выживание на орбите Земли."}
];
const grid = document.querySelector("#movieGrid");
const searchInput = document.querySelector("#searchInput");
const emptyState = document.querySelector("#emptyState");
let activeFilter = "Все";
let selectedMovie = movies[0];
const dialog = document.querySelector("#playerDialog");
const video = document.querySelector("#videoPlayer");
const source = video.querySelector("source");
let localObjectUrl = null;

function renderMovies() {
  const query = searchInput.value.trim().toLocaleLowerCase("ru");
  const filtered = movies.filter(movie =>
    (activeFilter === "Все" || movie.genre === activeFilter) &&
    (movie.title.toLocaleLowerCase("ru").includes(query) || movie.year.toString().includes(query))
  );
  grid.innerHTML = "";
  filtered.forEach(movie => {
    const card = document.createElement("article");
    card.className = "movie-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Открыть плеер: ${movie.title}`);
    card.innerHTML = `<div class="poster-wrap"><img loading="lazy" src="${movie.poster}" alt="Постер: ${movie.title}" onerror="this.onerror=null;this.src='https://placehold.co/500x750/151923/ffffff?text=IMAX+HUB'"><span class="movie-badge">${movie.tag}</span><span class="movie-rating">★ ${movie.rating}</span></div><div class="movie-info"><h3 class="movie-title">${movie.title}</h3><div class="movie-meta"><span>${movie.year}</span><span>${movie.genre}</span></div></div>`;
    card.addEventListener("click", () => openPlayer(movie));
    card.addEventListener("keydown", event => { if(event.key === "Enter" || event.key === " ") {event.preventDefault();openPlayer(movie);} });
    grid.appendChild(card);
  });
  emptyState.hidden = filtered.length > 0;
}
function openPlayer(movie) {
  selectedMovie = movie;
  document.querySelector("#playerTitle").textContent = movie.title;
  document.querySelector("#ratioToggle").textContent = "Режим 1.90:1";
  document.querySelector("#ratioLabel").textContent = "Режим кадра: исходный";
  document.querySelector("#videoFrame").classList.remove("ratio-imax");
  if (localObjectUrl) {
    URL.revokeObjectURL(localObjectUrl);
    localObjectUrl = null;
  }
  source.src = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
  video.load();
  dialog.showModal();
}
document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === button));
  renderMovies();
}));
searchInput.addEventListener("input", renderMovies);
document.querySelector("#searchToggle").addEventListener("click", () => {
  document.querySelector("#searchBox").scrollIntoView({behavior:"smooth",block:"center"});
  searchInput.focus({preventScroll:true});
});
document.querySelector("#featuredPlay").addEventListener("click", () => openPlayer(movies[0]));
document.querySelector("#closePlayer").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if(event.target === dialog) dialog.close(); });
document.querySelector("#ratioToggle").addEventListener("click", () => {
  const frame = document.querySelector("#videoFrame");
  const enabled = frame.classList.toggle("ratio-imax");
  document.querySelector("#ratioToggle").textContent = enabled ? "Исходный формат" : "Режим 1.90:1";
  document.querySelector("#ratioLabel").textContent = enabled ? "Режим кадра: 1.90:1 (демо)" : "Режим кадра: исходный";
});
document.querySelector("#localVideo").addEventListener("change", event => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (localObjectUrl) URL.revokeObjectURL(localObjectUrl);
  localObjectUrl = URL.createObjectURL(file);
  source.src = localObjectUrl;
  video.load();
  video.play().catch(() => {});
  document.querySelector("#playerTitle").textContent = file.name;
});
document.querySelectorAll("[data-collection]").forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.collection;
  document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b.dataset.filter === activeFilter));
  renderMovies();
  document.querySelector("#catalog").scrollIntoView({behavior:"smooth"});
}));
dialog.addEventListener("close", () => { video.pause(); document.querySelector("#localVideo").value = ""; });
renderMovies();
