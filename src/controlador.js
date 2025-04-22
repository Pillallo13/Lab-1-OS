let colaListos = [];

function leerInformacion() {
  const tabla = document.getElementById("tabla-procesos");
  const filas = tabla.querySelectorAll("tbody tr");

  let datos = [];

  filas.forEach((fila, filaIndex) => {
    const celdas = fila.querySelectorAll("td");
    let filaDatos = [];

    celdas.forEach((celda) => {
      filaDatos.push(celda.textContent.trim());
    });

    //Verificacion fila vacia - seguir trabajando
    if (!filaDatos[0] || !filaDatos[1] || !filaDatos[2]) {
      alert(
        `La fila ${
          filaIndex + 1
        } tiene campos incompletos y el programa no funcionara asi`
      );
      return;
    } else {
      datos.push(filaDatos);

      let p = crearProceso(filaDatos[0], filaDatos[2], [
        filaDatos[4],
        filaDatos[3],
      ]);
      colaListos.push(p);
    }
  });

  //Esto va a ser codigo muerto
  console.log("Datos de la tabla de procesos:", datos);
  console.log("Historial Procesos: ", colaListos);
  return colaListos;
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

function simular() {
  const selector = document.getElementById("selector");

  selector.addEventListener("change", () => {
    const seleccion = selector.value;

    switch (seleccion) {
      case "1":
        ejecutarFCFS(); //Toca implementar estas mkdas
        break;
      case "2":
        ejecutarSJF();
        break;
      case "3":
        ejecutarSRTF();
        break;
      case "4":
        ejecutarRR();
        break;
      default:
        Alert("Ninguna opción válida seleccionada");
    }
  });
}

//Para la funcion de RR
function leerQuantum() {
  const quantumInput = document.getElementById("quantum");
  const quantum = parseInt(quantumInput.value);

  if (isNaN(quantum) || quantum < 0 || quantum > 20) {
    alert("Por favor ingresa un valor válido de Quantum entre 0 y 20");
    return;
  }
}
