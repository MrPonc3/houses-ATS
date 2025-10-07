// ====== Config ======
const JSON_URL = "./houses_from_toJSON_template1_latest.json"; // keep in same folder
const LOADING_DURATION_MS = 5000;

// House crest images (replace paths if needed)
const HOUSE_IMAGES = {
  "Aegir": "./img/house-aegir.png",
  "Pelagia": "./img/house-pelagia.png",
  "Kai": "./img/house-kai.png",
  "Nerida": "./img/house-nerida.png"
};

// ====== State ======
const state = {
  list: [],      // flat records {name,email,gender,house,level}
  nameIndex: {}  // normalized name -> [records]
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

function buildNameIndex(list){
  const idx = {};
  for (const r of list) {
    const key = normalizeStr(r.name);
    if (!idx[key]) idx[key] = [];
    idx[key].push(r);
  }
  return idx;
}

function populateDatalist(list){
  const dl = $("#nameList");
  dl.innerHTML = list
    .map(r => r.name)
    .filter((v,i,arr)=> v && arr.indexOf(v)===i)
    .sort((a,b)=>a.localeCompare(b))
    .map(nm => `<option value="${nm}"></option>`)
    .join("");
}

// UI helpers
function hideError(){ $("#error").hidden = true; }
function showError(msg){
  const el = $("#error");
  el.textContent = msg;
  el.hidden = false;
}

function showModal(){ $("#loaderModal").hidden = false; }
function hideModal(){ $("#loaderModal").hidden = true; }

function renderResult(rec){
  $("#houseImg").src = HOUSE_IMAGES[rec.house] || "";
  $("#houseImg").alt = `House crest: ${rec.house}`;
  $("#studentName").textContent = rec.name || "";
  $("#houseName").textContent = rec.house || "";
  $("#result").hidden = false;
}

// ====== Data init ======
async function initData(){
  const res = await fetch(JSON_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Cannot load JSON (HTTP ${res.status})`);
  const data = await res.json();
  state.list = flattenData(data);
  state.nameIndex = buildNameIndex(state.list);
  populateDatalist(state.list);
}

// match name (case/diacritic-insensitive)
function findByName(input){
  const key = normalizeStr(input);
  if (state.nameIndex[key]) return state.nameIndex[key][0];
  const partial = Object.keys(state.nameIndex).find(k => k.includes(key));
  return partial ? state.nameIndex[partial][0] : null;
}

// ====== Events ======
function bindEvents(){
  $("#lookupForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    hideError();

    const name = $("#nameInput").value.trim();
    if (!name) return showError("Please type your name.");

    const rec = findByName(name);
    if (!rec) return showError("Name not found. Pick from suggestions.");

    // open modal loader, then reveal result after 5s
    showModal();
    setTimeout(()=>{
      hideModal();
      renderResult(rec);
    }, LOADING_DURATION_MS);
  });

  $("#againBtn").addEventListener("click", ()=>{
    $("#result").hidden = true;
    $("#nameInput").value = "";
    $("#nameInput").focus();
    hideError();
  });
}

// ====== Init ======
document.addEventListener("DOMContentLoaded", async ()=>{
  try{
    await initData();
  }catch(err){
    showError(err.message || "Error loading data.");
  }
  bindEvents();
});
