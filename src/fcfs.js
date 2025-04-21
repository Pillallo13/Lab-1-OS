// Simulación de un planificador FCFS (First Come, First Served) con bloqueos

// -----> MODELO <------
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

// ------> VISTA <-------
let procesos = [
  crearProceso("P1", 10, [{ inicio: 3, duracion: 2 }]),
  crearProceso("P2", 5),
  crearProceso("P3", 8, [{ inicio: 4, duracion: 3 }]),
];
/*Estos datos son de prueba para el funcionamiento temporal de los algoritmos. Los datos reales deben de venir desde la vista*/

// ------> CONTROLADOR <-------
let tiempo = 0;
let colaListos = [...procesos]; // Procesos que están "listos"
let bloqueados = []; // Procesos en bloqueo de E/S
let ejecutando = null; // Proceso que está usando la CPU

function tick() {
  console.log(`Tiempo ${tiempo}:`);

  // Comprobar bloqueos
  for (let i = bloqueados.length - 1; i >= 0; i--) {
    let p = bloqueados[i];
    p.tiempoBloqueoRestante--;
    if (p.tiempoBloqueoRestante <= 0) {
      p.estado = "listo";
      colaListos.push(p);
      bloqueados.splice(i, 1);
      console.log(`  ${p.id} sale del bloqueo`);
    }
  }

  // Asignar CPU si está libre
  if (!ejecutando && colaListos.length > 0) {
    ejecutando = colaListos.shift(); // Saca el primero de la cola
    ejecutando.estado = "ejecutando";
    console.log(`  ${ejecutando.id} comienza a ejecutarse`);
  }

  // Para cualquier proceso activo
  if (ejecutando) {
    ejecutando.progreso++;
    console.log(
      `  ${ejecutando.id} ejecutándose (progreso: ${ejecutando.progreso}/${ejecutando.tiempoTotal})`
    );

    // Verificar si un proceso debe bloquearse
    if (
      ejecutando.bloqueos.length > 0 &&
      ejecutando.bloqueos[0].inicio === ejecutando.progreso
    ) {
      const bloqueo = ejecutando.bloqueos.shift();
      ejecutando.estado = "bloqueado";
      ejecutando.tiempoBloqueoRestante = bloqueo.duracion;
      bloqueados.push(ejecutando);
      console.log(
        `  ${ejecutando.id} entra en bloqueo por ${bloqueo.duracion} unidades`
      );
      ejecutando = null;
    }
    // Verificar si un proceso terminó
    else if (ejecutando.progreso >= ejecutando.tiempoTotal) {
      ejecutando.estado = "terminado";
      console.log(`  ${ejecutando.id} ha terminado`);
      ejecutando = null;
    }
  } else {
    console.log(`  CPU está inactiva`);
  }
  tiempo++;
}

// Ejecutar la simulación
function simular() {
  while (
    colaListos.length > 0 ||
    bloqueados.length > 0 ||
    ejecutando !== null
  ) {
    tick();
  }

  console.log("Simulación completada.");
}

simular();
