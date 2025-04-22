let contadorBloqueos = 1;

export function obtenerContador() {
  return contadorBloqueos;
}

function agregarProceso() {
  const tbody = document.getElementById("tbody-procesos");
  const fila = tbody.insertRow();

  // Proceso, llegada, ejecución
  for (let i = 0; i < 3; i++) {
    const celda = fila.insertCell();
    celda.contentEditable = "true";
  }

  // Celdas de bloqueo (2 por bloqueo)
  for (let i = 0; i < contadorBloqueos; i++) {
    const dur = fila.insertCell();
    dur.contentEditable = "true";
    const ini = fila.insertCell();
    ini.contentEditable = "true";
  }

  // Botón eliminar
  const celdaBoton = fila.insertCell();
  const boton = document.createElement("button");
  boton.innerText = "Eliminar";
  boton.classList.add("eliminar-fila-btn"); // Agregar clase para el listener
  boton.addEventListener("click", eliminarFila); // Usar addEventListener aquí
  celdaBoton.appendChild(boton);
}

function eliminarFila(event) {
  const botonEliminar = event.target; // El botón que fue clickeado
  const fila = botonEliminar.parentNode.parentNode; // Obtiene la fila (tr)
  fila.remove();
}

function agregarBloqueo() {
  contadorBloqueos++;

  const filaPrincipal = document.getElementById("fila-principal");
  const subfila = document.getElementById("subfila-principal");
  const tbody = document.getElementById("tbody-procesos");

  // Insertar nuevo encabezado de bloqueo
  const thBloqueo = document.createElement("th");
  thBloqueo.colSpan = 2;
  thBloqueo.className = "bloqueo-header";
  thBloqueo.textContent = `Bloqueo ${contadorBloqueos}`;
  filaPrincipal.insertBefore(thBloqueo, filaPrincipal.lastElementChild); // antes de "Acciones"

  // Subfila con duración e inicio
  const thDur = document.createElement("th");
  thDur.textContent = "Duración";
  const thIni = document.createElement("th");
  thIni.textContent = "Inicio";
  subfila.insertBefore(thDur, subfila.lastElementChild);
  subfila.insertBefore(thIni, subfila.lastElementChild);

  // Agregar dos celdas a cada fila del tbody
  Array.from(tbody.rows).forEach((fila) => {
    const dur = fila.insertCell(fila.cells.length - 1); // antes del botón
    dur.contentEditable = "true";
    const ini = fila.insertCell(fila.cells.length - 1);
    ini.contentEditable = "true";
  });
}

function eliminarBloqueo() {
  if (contadorBloqueos === 0) return;

  const filaPrincipal = document.getElementById("fila-principal");
  const subfila = document.getElementById("subfila-principal");
  const tbody = document.getElementById("tbody-procesos");

  // Eliminar header "Bloqueo X"
  const thsBloqueo = filaPrincipal.querySelectorAll(".bloqueo-header");
  const ultimoBloqueo = thsBloqueo[thsBloqueo.length - 1];
  if (ultimoBloqueo) {
    filaPrincipal.removeChild(ultimoBloqueo);
  }

  // Eliminar subheaders "Duración" y "Inicio"
  const thSub = subfila.querySelectorAll("th");
  if (thSub.length > 3) {
    // evitar borrar columnas esenciales
    subfila.removeChild(subfila.children[subfila.children.length - 2]);
    subfila.removeChild(subfila.children[subfila.children.length - 2]);
  }

  // Eliminar celdas por índice preciso
  const baseFijas = 3;
  const indexBloqueo = baseFijas + (contadorBloqueos - 1) * 2;

  Array.from(tbody.rows).forEach((fila) => {
    if (fila.cells.length >= indexBloqueo + 2) {
      fila.deleteCell(indexBloqueo); // Duración
      fila.deleteCell(indexBloqueo); // Inicio
    }
  });

  contadorBloqueos--;
}

function leerInformacion() {
  const tabla = document.getElementById("tabla-procesos");
  const filas = tabla.querySelectorAll("tbody tr");

  filas.forEach((fila, index) => {
    const proceso = fila.cells[0].textContent;
    const llegada = fila.cells[1].textContent;
    const ejecucion = fila.cells[2].textContent;
    const bloqueos = [];

    for (let i = 3; i < fila.cells.length - 1; i += 2) {
      const duracion = fila.cells[i].textContent;
      const inicio = fila.cells[i + 1].textContent;
      bloqueos.push({ duracion, inicio });
    }

    console.log(
      `Proceso ${proceso}, Llegada: ${llegada}, Ejecución: ${ejecucion}, Bloqueos:`,
      bloqueos
    );
  });
}

//Listeners
document.addEventListener("DOMContentLoaded", () => {
  const agregarProcesoBtn = document.getElementById("agregar-proceso-btn");
  agregarProcesoBtn.addEventListener("click", agregarProceso);

  const agregarBloqueoBtn = document.getElementById("agregar-bloqueo-btn");
  agregarBloqueoBtn.addEventListener("click", agregarBloqueo);

  const eliminarBloqueoBtn = document.getElementById("eliminar-bloqueo-btn");
  eliminarBloqueoBtn.addEventListener("click", eliminarBloqueo);

  const leerInformacionBtn = document.getElementById("leer-informacion-btn");
  leerInformacionBtn.addEventListener("click", leerInformacion);

  const botonesEliminar = document.querySelectorAll(
    "#tbody-procesos .eliminar-fila-btn"
  );
  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", eliminarFila);
  });
});
