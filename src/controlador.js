function leerInformacion() {
  const tabla = document.getElementById("tabla-procesos");
  const filas = tabla.querySelectorAll("tbody tr");

  let datos = [];

  filas.forEach((fila) => {
    let i = 1;
    let filaDatos = [];
    const celdas = fila.querySelectorAll("td");

    celdas.forEach((celda) => {
      filaDatos.push(celda.textContent.trim());
    });

    // if (filaDatos) {
    //   alert("La tabla esta vacia profe");
    // }
    datos.push(filaDatos);
    p1 = crearProceso(filaDatos[0], filaDatos[1], filaDatos[2]);
  });

  console.log("Datos de la tabla de procesos:", datos);
  console.log("Dato procesos", p1);
}

function crearProceso(id, tiempoTotal, bloqueos = []) {
  return {
    id, // Nombre identificador del proceso
    tiempoTotal, // Duración total necesaria
    bloqueos, // Bloqueos representados por { inicio, duracion }
    progreso: 0,
    estado: "listo",
    tiempoBloqueoRestante: 0,
  };
}
