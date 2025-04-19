let contadorBloqueos = 1;

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
  boton.onclick = function () {
    eliminarFila(boton);
  };
  celdaBoton.appendChild(boton);
}

function eliminarFila(boton) {
  const fila = boton.parentNode.parentNode;
  fila.remove();
}

function agregarBloqueo() {
  contadorBloqueos++;

  const filaPrincipal = document.getElementById("fila-principal");
  const subfila = document.getElementById("subfila-principal");
  const tabla = document.getElementById("tabla-procesos");
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
