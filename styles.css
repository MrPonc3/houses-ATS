:root{
  --bg:#0b1222;
  --panel:#0f172a;
  --text:#e5e7eb;
  --muted:#94a3b8;
  --accent:#22d3ee;
  --border:#1f2937;
  --ok:#10b981;
  --danger:#ef4444;

  /* loader / orbit sizes */
  --orbit-size: 280px;
  --orbit-radius: 110px; /* distance from center to icons */
  --orbit-speed: 8s;     /* full rotation time */
}

*{ box-sizing: border-box; }
html,body{ height:100%; margin:0; }
body{
  background:
    radial-gradient(1200px 600px at 50% -10%, #0d1427 10%, var(--bg) 60%),
    var(--bg);
  color:var(--text);
  font: 16px/1.5 Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Noto Sans", sans-serif;
}

/* ---------- header / arc ---------- */
.hero{
  max-width:1000px; margin:28px auto 0; padding:0 16px; text-align:center;
}
.title{
  margin:0;
  font-size: clamp(1.8rem, 4.8vw, 2.8rem);
  letter-spacing:.02em;
}

/* ensure no collision: arc box has top margin */
.arc-wrap{
  position: relative;
  width:min(900px, 92vw);
  margin: 16px auto 0;
  padding-top: 8px;
}

/* emblem centered at arc apex */
.arc-emblem{
  position:absolute;
  left:50%; top:8px; transform: translateX(-50%);
  width:72px; height:72px; object-fit:contain;
  filter: drop-shadow(0 6px 10px rgba(0,0,0,.35));
  pointer-events:none;
}

.arc-svg{
  width:100%; height:auto; display:block;
  pointer-events:none; /* purely decorative */
}
.arc-text{
  fill: var(--muted);
  font-weight: 700;
  letter-spacing: .1em;
  font-size: 16px;
}

/* ---------- main ---------- */
.container{ max-width:900px; margin: 18px auto 40px; padding: 0 16px; }

.lookup{
  background: rgba(255,255,255,.03);
  border:1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
  backdrop-filter: blur(6px);
}
.input-row{
  display:flex; gap:10px; align-items:center; justify-content:center;
  flex-wrap: wrap;
}
#nameInput{
  flex:1 1 360px; min-width:260px;
  background: var(--panel); color: var(--text);
  border: 1px solid var(--border); border-radius: 10px;
  padding: 12px 14px; outline: none;
}
.btn{
  padding: 12px 16px; border-radius: 10px;
  background: var(--accent); color:#001219; border:0; cursor:pointer;
  font-weight:700;
}
.btn:hover{ filter:brightness(1.08); }
.btn.secondary{
  background:transparent; color:var(--text);
  border:1px solid var(--border);
}

.hint{ text-align:center; color:var(--muted); margin:.5rem 0 0; }
.error{ text-align:center; color: var(--danger); margin:.5rem 0 0; }

.result{
  margin-top: 18px; text-align:center;
  background: var(--panel);
  border:1px solid var(--border);
  border-radius: 14px; padding: 22px;
  animation: fadeIn .4s ease-out both;
}
.house-img{
  max-width: 240px; width: 60%; height:auto;
  filter: drop-shadow(0 10px 16px rgba(0,0,0,.35));
}
.student-name{ margin:.7rem 0 0; font-size: clamp(1.3rem, 3.2vw, 2rem); }
.house-name{ margin:.25rem 0 0; color: var(--ok); font-size: clamp(1.1rem, 2.6vw, 1.6rem); }
.congrats{ margin:.4rem 0 1rem; color: var(--muted) }

.site-footer{
  max-width:900px; margin:20px auto 40px; padding:0 16px; text-align:center; color: var(--muted);
}

/* ---------- modal loader (overlay) ---------- */
.modal[hidden]{ display:none !important; }
.modal{
  position: fixed; inset: 0; z-index: 50;
  display:grid; place-items:center;
}
.modal-backdrop{
  position:absolute; inset:0; background:rgba(0,0,0,.55);
  backdrop-filter: blur(2px);
}
.modal-content{
  position:relative; z-index:1;
  width:min(92vw, 560px);
  border-radius:16px; border:1px solid var(--border);
  background: #0d1427;
  padding: 22px;
  text-align:center;
  box-shadow: 0 24px 80px rgba(0,0,0,.35);
  animation: pop .2s ease-out both;
}
.modal-title{
  margin:0 0 12px; font-weight:800; letter-spacing:.02em;
}
.loading-text{ color: var(--muted); margin:.5rem 0 0 }

/* orbit container rotates; children are placed at a fixed radius */
.orbit{
  position:relative; width: var(--orbit-size); height: var(--orbit-size);
  margin: 8px auto 6px;
  animation: orbitSpin var(--orbit-speed) linear infinite;
}
.orbit-item{
  position:absolute; left:50%; top:50%;
  width: 86px; height:86px; object-fit:contain;
  transform:
    rotate(var(--ang))
    translate(var(--orbit-radius))
    rotate(calc(-1 * var(--ang)));
  filter: drop-shadow(0 6px 10px rgba(0,0,0,.35));
}
.orbit-center{
  position:absolute; left:50%; top:50%;
  width: 12px; height:12px; border-radius:50%;
  background: #1e293b; border:1px solid #334155;
  transform: translate(-50%, -50%);
}

@keyframes orbitSpin { to { transform: rotate(360deg) } }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px) }
  to { opacity: 1; transform: translateY(0) }
}
@keyframes pop {
  from { opacity:0; transform: translateY(6px) scale(.98) }
  to   { opacity:1; transform: translateY(0) scale(1) }
}

@media (max-width:720px){
  :root{
    --orbit-size: 240px;
    --orbit-radius: 95px;
  }
}
