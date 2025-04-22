export function renderizarGrafica(historial) {
  const tbody = document.querySelector(".tabla-grafica tbody");
  tbody.innerHTML = ""; // Limpiar lo anterior

  const tiemposMax = Math.max(
    ...Object.values(historial).map((arr) => arr.length)
  );

  // Crear fila por cada proceso
  for (const [proceso, estados] of Object.entries(historial)) {
    const fila = document.createElement("tr");
    const celdaProceso = document.createElement("td");
    celdaProceso.textContent = proceso;
    fila.appendChild(celdaProceso);

    for (let t = 0; t < tiemposMax; t++) {
      const estado = estados[t] || "espera";
      const celda = document.createElement("td");
      if (estado === "ejecutando") {
        celda.innerHTML = `<div class="ejecucion"></div>`;
      } else if (estado === "bloqueado") {
        celda.innerHTML = `<div class="bloqueo"></div>`;
      } else {
        celda.innerHTML = `<div class="espera"></div>`;
      }
      fila.appendChild(celda);
    }

    tbody.appendChild(fila);
  }

  // Agregar la fila de tiempos t0, t1...
  const filaTiempos = document.createElement("tr");
  const celdaTitulo = document.createElement("th");
  celdaTitulo.textContent = "Proceso";
  filaTiempos.appendChild(celdaTitulo);

  for (let t = 0; t < tiemposMax; t++) {
    const celda = document.createElement("th");
    celda.textContent = `t ${t}`;
    filaTiempos.appendChild(celda);
  }
  tbody.appendChild(filaTiempos);
}
