const timelineEl = document.getElementById("timeline");
const detailsEl = document.getElementById("details");
const searchInput = document.getElementById("searchInput");
const filtersEl = document.getElementById("filters");

let allEvents = [];
let activeCategory = "All";

function showDetails(e) {
    detailsEl.innerHTML = `
      <h2>${e.year}: ${e.title}</h2>
      <p><strong>Category:</strong> ${e.category}</p>
      <hr>
      <p>${e.details}</p>
      ${e.image ? `<img src="${e.image}" class="event-image" />` : ""}
    `;
  }

function renderFilters(events) {
  const categories = [...new Set(events.map(e => e.category))];
  filtersEl.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.textContent = "All";
  allBtn.className = activeCategory === "All" ? "active" : "";
  allBtn.onclick = () => {
    activeCategory = "All";
    renderFilters(allEvents);
    renderTimeline();
  };
  filtersEl.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.className = activeCategory === cat ? "active" : "";
    btn.onclick = () => {
      activeCategory = cat;
      renderFilters(allEvents);
      renderTimeline();
    };
    filtersEl.appendChild(btn);
  });
}

function getFilteredEvents() {
  const searchText = searchInput.value.toLowerCase();

  return allEvents
    .filter(e => activeCategory === "All" || e.category === activeCategory)
    .filter(e =>
      e.title.toLowerCase().includes(searchText) ||
      e.summary.toLowerCase().includes(searchText) ||
      e.details.toLowerCase().includes(searchText)
    )
    .sort((a, b) => a.year - b.year);
}

function renderTimeline() {
  const events = getFilteredEvents();
  timelineEl.innerHTML = "";

  events.forEach(e => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="meta">${e.year} • ${e.category}</div>
      <h3>${e.title}</h3>
      <p>${e.summary}</p>
    `;
    card.onclick = () => showDetails(e);
    timelineEl.appendChild(card);
  });
}

async function init() {
  const res = await fetch("data/events.json");
  allEvents = await res.json();
  renderFilters(allEvents);
  renderTimeline();
}

searchInput.addEventListener("input", renderTimeline);

init();