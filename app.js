// ====== Config ======
const JSON_URL = "./houses_from_toJSON_template1_latest.json"; // mismo folder
const LOADING_DURATION_MS = 5000;

// Rutas de imágenes (ajusta nombres/ubicación si usas otras)
const HOUSE_IMAGES = {
  "Aegir": "./house-aegir.png",
  "Pelagia": "./house-pelagia.png",
  "Kai": "./house-kai.png",
  "Nerida": "./house-nerida.png"
};
const LOADER_IMAGES = [
  "./loader1.png",
  "./loader2.png",
  "./loader3.png",
  "./loader4.png"
];

// ====== State ======
const state = {
  list: [],      // registros aplanados {name,email,gender,house,level}
  nameIndex: {}  // clave normalizada -> registros (array)
};

// ====== Utils ======
const $ = (sel) => document.querySelector(sel);

function normalizeStr(s){
  return String(s || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Convierte el JSON HOUSES a lista plana
function flattenData(db){
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

// Construye índice de nombres para autocompletar/búsqueda
function buildNameIndex(list){
  const idx = {};
  for (const r of list) {
    const key = normalizeStr(r.name);
    if (!idx[key]) idx[key] = [];
    idx[key].push(r);
  }
  return idx;
}

// ====== Autocomplete con <datalist> ======
function populateDatalist(list){
  const dl = $("#nameList");
  dl.innerHTML = list
    .map(r => r.name)
    .filter((v,i,arr)=> v && arr.indexOf(v)===i)
    .sort((a,b)=>a.localeCompare(b))
    .map(nm => `<option value="${nm}"></option>`)
    .join("");
}

// ====== UI ======
function show(sectionId){
  for (const id of ["loader","result"]) $( "#" + id ).hidden = true;
  $("#" + sectionId).hidden = false;
}
function hideErrors(){ $("#error").hidden = true; }
function showError(msg){
  const el = $("#error");
  el.textContent = msg;
  el.hidden = false;
}

// Carga de datos inicial
async function initData(){
  const res = await fetch(JSON_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`No se pudo cargar JSON (HTTP ${res.status})`);
  const data = await res.json();
  state.list = flattenData(data);
  state.nameIndex = buildNameIndex(state.list);
  populateDatalist(state.list);
}

// Buscar por nombre (case/acentos insensible)
function findByName(inputName){
  const key = normalizeStr(inputName);
  // Coincidencia exacta normalizada
  if (state.nameIndex[key]) return state.nameIndex[key][0];

  // Si no hay exacta: buscar por "contiene"
  const candidates = Object.keys(state.nameIndex).filter(k => k.includes(key));
  if (candidates.length > 0) return state.nameIndex[candidates[0]][0];

  return null;
}

// Mostrar resultado final
function renderResult(rec){
  // Imagen de casa
  const imgSrc = HOUSE_IMAGES[rec.house] || "";
  $("#houseImg").src = imgSrc;
  $("#houseImg").alt = `Escudo de la casa ${rec.house}`;

  // Textos
  $("#studentName").textContent = rec.name || "";
  $("#houseName").textContent = rec.house || "";

  show("result");
}

// ====== Eventos ======
function bindEvents(){
  $("#lookupForm").addEventListener("submit", async (e)=>{
    e.preventDefault();
    hideErrors();

    const name = $("#nameInput").value.trim();
    if (!name) return showError("Por favor, escribe tu nombre.");

    const rec = findByName(name);
    if (!rec) {
      return showError("Nombre no encontrado. Revisa la ortografía o elige desde las sugerencias.");
    }

    // Mostrar loader ~5s y luego resultado
    show("loader");
    // precargar imágenes del loader por si no existen ya
    for (const [i, img] of [...$("#loader .spinner").querySelectorAll("img")].entries()){
      if (LOADER_IMAGES[i]) img.src = LOADER_IMAGES[i];
    }

    setTimeout(()=>{
      renderResult(rec);
    }, LOADING_DURATION_MS);
  });

  $("#againBtn").addEventListener("click", ()=>{
    $("#result").hidden = true;
    $("#nameInput").value = "";
    $("#nameInput").focus();
    hideErrors();
  });
}

// ====== Init ======
document.addEventListener("DOMContentLoaded", async ()=>{
  try{
    await initData();
  }catch(err){
    showError(err.message || "Error al cargar los datos.");
  }
  bindEvents();
});
