// === Config ===
const JSON_URL = "./houses_from_toJSON_template1_latest.json"; // mismo repo/carpeta

// === Estado global (in-memory) ===
const state = {
  raw: null,         // JSON original
  list: [],          // lista aplanada [{name,email,gender,house,level}]
  filtered: [],      // resultado tras filtros/búsqueda
  filters: {
    house: "ALL",
    level: "ALL",
    q: ""
  }
};

// === Utilidades ===
const $ = (sel) => document.querySelector(sel);

function normalizeStr(s) {
  return String(s || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function flattenData(db) {
  // Espera forma: { HOUSES: { Aegir: {MS:[], HS:[]}, ... } }
  const out = [];
  const H = db?.HOUSES || {};
  for (const house of ["Aegir","Pelagia","Kai","Nerida"]) {
    const levels = H[house] || {};
    for (const level of ["MS","HS"]) {
      const arr = Array.isArray(levels[level]) ? levels[level] : [];
      for (const r of arr) {
        out.push({
          name: r["Student Name"] ?? r["name"] ?? "",
          email: r["email"] ?? "",
          gender: r["Female/male"] ?? r["gender"] ?? "",
          house,
          level
        });
      }
    }
  }
  return out;
}

function computeStats(list) {
  const base = {Aegir:{MS:0,HS:0}, Pelagia:{MS:0,HS:0}, Kai:{MS:0,HS:0}, Nerida:{MS:0,HS:0}};
  for (const r of list) {
    if (base[r.house] && (r.level === "MS" || r.level === "HS")) {
      base[r.house][r.level]++;
    }
  }
  return base;
}

function renderStats(list) {
  const s = computeStats(list);
  const html = Object.entries(s).map(([house,counts]) => {
    const total = counts.MS + counts.HS;
    return `
      <div class="stat">
        <h3>${house}</h3>
        <p>${total} <span class="muted">(${counts.MS} MS • ${counts.HS} HS)</span></p>
      </div>
    `;
  }).join("");
  $("#stats").innerHTML = html;
}

function applyFilters() {
  const { house, level, q } = state.filters;
  const qn = normalizeStr(q);
  state.filtered = state.list.filter(r => {
    const okHouse = (house === "ALL") || (r.house === house);
    const okLevel = (level === "ALL") || (r.level === level);
    const okText  = !qn || normalizeStr(r.name).includes(qn) || normalizeStr(r.email).includes(qn);
    return okHouse && okLevel && okText;
  });
}

function renderTable() {
  const tbody = $("#tableBody");
  tbody.innerHTML = state.filtered.map(r => `
    <tr>
      <td>${r.name || "—"}</td>
      <td><a href="mailto:${r.email}">${r.email || "—"}</a></td>
      <td>${r.gender || "—"}</td>
      <td>${r.house}</td>
      <td>${r.level}</td>
    </tr>
  `).join("");

  $("#status").textContent = `${state.filtered.length} result(s)`;
  $("#dataTable").hidden = false;
}

function updateUI() {
  applyFilters();
  renderStats(state.filtered);
  renderTable();
}

// === Eventos UI ===
function bindUI() {
  $("#houseSelect").addEventListener("change", e => {
    state.filters.house = e.target.value;
    updateUI();
  });
  $("#levelSelect").addEventListener("change", e => {
    state.filters.level = e.target.value;
    updateUI();
  });
  $("#searchInput").addEventListener("input", e => {
    state.filters.q = e.target.value;
    updateUI();
  });
  $("#resetBtn").addEventListener("click", () => {
    state.filters = { house: "ALL", level: "ALL", q: "" };
    $("#houseSelect").value = "ALL";
    $("#levelSelect").value = "ALL";
    $("#searchInput").value = "";
    updateUI();
  });
}

// === Carga de datos ===
async function loadJSON() {
  try {
    const res = await fetch(JSON_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.raw = data;
    state.list = flattenData(data);
    $("#status").textContent = "Data loaded.";
    updateUI();
  } catch (err) {
    console.error(err);
    $("#status").textContent = `Error loading data: ${err.message}`;
  }
}

// === Init ===
document.addEventListener("DOMContentLoaded", () => {
  bindUI();
  loadJSON();
});

