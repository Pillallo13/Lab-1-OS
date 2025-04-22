// Simulación de un planificador SJF (Shortest Job First) con bloqueos

// -------> MODELO <------
function crearProceso(id, tiempoTotal, bloqueos = []) {
  return {
    id, // Nombre identificador del proceso
    tiempoTotal, // Duración total necesaria
    bloqueos, // Bloqueos representados por {inicio, duración}
    progreso: 0,
    estado: "listo",
    tiempoBloqueoRestante: 0,
  };
}

let historialPorProceso = {};

// -----> VISTA <------
let procesos = [
  crearProceso("P1", 10, [{ inicio: 3, duracion: 2 }]),
  crearProceso("P2", 5),
  crearProceso("P3", 8, [{ inicio: 4, duracion: 3 }]),
];
/*Estos datos son de prueba para el funcionamiento temporal de los algoritmos. Los datos reales deben de venir desde la vista*/

// -----> CONTROLADOR <------
let tiempo = 0;
let colaListos = [...procesos]; // Procesos que están "listos"
let bloqueados = []; // Procesos en bloqueo de E/S
let ejecutando = null; // Proceso que está usando la CPU

function tick() {
  console.log(`\n--- Tiempo ${tiempo} ---`);

  // Comprobar bloqueos
  for (let i = bloqueados.length - 1; i >= 0; i--) {
    const p = bloqueados[i];
    p.tiempoBloqueoRestante--;
    if (p.tiempoBloqueoRestante <= 0) {
      p.estado = "listo";
      colaListos.push(p);
      bloqueados.splice(i, 1);
      console.log(`  > ${p.id} sale del bloqueo y vuelve a colaListos`);
    }
  }

  // Cuando la CPU esté libre, se asigna el proceso más corto
  if (!ejecutando && colaListos.length > 0) {
    let indiceMenor = 0;
    for (let i = 1; i < colaListos.length; i++) {
      if (colaListos[i].tiempoTotal < colaListos[indiceMenor].tiempoTotal) {
        indiceMenor = i;
      }
    }
    ejecutando = colaListos.splice(indiceMenor, 1)[0]; // Lo extraigo de la cola y lo pongo a ejecutar
    ejecutando.estado = "ejecutando";
    console.log(`  > ${ejecutando.id} comienza a ejecutarse (SJF)`);
  }

  // Para cualquier proceso activo
  if (ejecutando) {
    ejecutando.progreso++;
    console.log(
      `  - ${ejecutando.id}: progreso ${ejecutando.progreso}/${ejecutando.tiempoTotal}`
    );

    // Verificar si un proceso debe bloquearse
    if (
      ejecutando.bloqueos.length > 0 &&
      ejecutando.progreso === ejecutando.bloqueos[0].inicio
    ) {
      const bloque = ejecutando.bloqueos.shift();
      ejecutando.estado = "bloqueado";
      ejecutando.tiempoBloqueoRestante = bloque.duracion;
      bloqueados.push(ejecutando);
      console.log(` ${ejecutando.id} entra en bloqueo por ${bloque.duracion}`);
      ejecutando = null;
    }
    // Verificar si un proceso ha terminado
    else if (ejecutando.progreso >= ejecutando.tiempoTotal) {
      ejecutando.estado = "terminado";
      console.log(` ${ejecutando.id} ha terminado`);
      ejecutando = null;
    }
  } else {
    console.log(`CPU inactiva`);
  }
  tiempo++;
}

// Ejecutar la simulación
function simular() {
  while (colaListos.length > 0 || bloqueados.length > 0 || ejecutando) {
    tick();
  }
  console.log(`\n=== Simulación completada en tiempo ${tiempo} ===`);
}
if (!historialPorProceso[p.id]) historialPorProceso[p.id] = [];
historialPorProceso[p.id].push(p.estado);

simular();
renderizarGrafica(historialPorProceso);
