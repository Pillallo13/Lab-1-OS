import { ejecutarFCFS } from "./fcfs.js";
import { ejecutarSJF } from "./sjf.js";
import { ejecutarSRTF } from "./srjf.js";
import { ejecutarRR } from "./round robin.js";
import { renderResultTable } from "./tabla-resultados.js";
import { renderizarGrafica } from "./Render.js";

const selector = document.getElementById("selector");
const leerTablaBtn = document.getElementById("leer-informacion-btn");

let datos = [];
let colaListos = [];
let resultados = [];
let historial = {};

// Event listener para el botón "Leer tabla"
leerTablaBtn.addEventListener("click", leerInformacion);

function leerInformacion() {
  const tabla = document.getElementById("tabla-procesos");
  const filas = tabla.querySelectorAll("tbody tr");
  datos = [];
  colaListos = [];

  filas.forEach((fila, filaIndex) => {
    const celdas = fila.querySelectorAll("td");
    let filaDatos = [];

    celdas.forEach((celda) => {
      filaDatos.push(celda.textContent.trim());
    });

    if (!filaDatos[0] || !filaDatos[1] || !filaDatos[2]) {
      alert(
        `La fila ${
          filaIndex + 1
        } tiene campos incompletos y el programa no funcionará así`
      );
      return;
    } else {
      datos.push(filaDatos);
      let bloqueos = [];
      for (let i = 3; i < filaDatos.length - 1; i += 2) {
        if (filaDatos[i] && filaDatos[i + 1]) {
          bloqueos.push({
            inicio: parseInt(filaDatos[i + 1]),
            duracion: parseInt(filaDatos[i]),
          });
        }
      }
      let p = crearProceso(
        filaDatos[0],
        parseInt(filaDatos[1]),
        parseInt(filaDatos[2]),
        bloqueos
      );
      colaListos.push(p);
    }
  });

  console.log("Datos de la tabla de procesos:", datos);
  console.log("Historial Procesos: ", colaListos);
  ejecutarAlgoritmoActual();
  return colaListos;
}

function crearProceso(id, llegada, tiempoTotal, bloqueos = []) {
  return {
    id,
    llegada,
    tiempoTotal,
    bloqueos,
    progreso: 0,
    estado: "listo",
    tiempoBloqueoRestante: 0,
  };
}

selector.addEventListener("change", ejecutarAlgoritmoActual);


function ejecutarAlgoritmoActual() {
  const seleccion = selector.value;
  const quantum = leerQuantum();

  if (seleccion && colaListos.length > 0) {
    switch (seleccion) {
      case "1":
        ({ resultados, historial } = ejecutarFCFS([...colaListos]));
        break;
      case "2":
        ({ resultados, historial } = ejecutarSJF([...colaListos]));
        break;
      case "3":
        ({ resultados, historial } = ejecutarSRTF([...colaListos]));
        break;
      case "4":
        if (quantum !== undefined) {
          ({ resultados, historial } = ejecutarRR([...colaListos], quantum));
        }
        break;
      default:
        alert("Ninguna opción válida seleccionada");
    }

    // Renderizar gráfica y tabla de resultados
    renderizarGrafica(historial);
    renderResultTable(resultados);
  } else if (seleccion) {
    alert("Por favor, primero lee la información de la tabla.");
  }
};

function leerQuantum() {
  const quantumInput = document.getElementById("quantum");
  const quantum = parseInt(quantumInput.value);

  if (isNaN(quantum) || quantum < 0 || quantum > 20) {
    alert("Por favor ingresa un valor válido de Quantum entre 0 y 20");
    return undefined;
  }
  return quantum;
}
