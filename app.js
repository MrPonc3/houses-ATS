// App mínimo para mostrar "hola mundo" y dejar listo para crecer

function renderHolaMundo() {
  const root = document.getElementById("app");
  const card = document.createElement("section");
  card.className = "card";
  card.innerHTML = `
    <h1>hola mundo</h1>
    <p>publicado con <strong>GitHub Pages</strong></p>
    <span class="badge">JS listo para futuras funciones</span>
  `;
  root.replaceChildren(card);
}

// Espera a que el DOM esté listo
document.addEventListener("DOMContentLoaded", renderHolaMundo);

// ejemplo de cómo podrás actualizar el texto más adelante:
export function actualizarMensaje(nuevoTexto = "hola mundo") {
  const h1 = document.querySelector(".card h1");
  if (h1) h1.textContent = nuevoTexto;
  console.log(`Mensaje actualizado a: ${nuevoTexto}`);
}
