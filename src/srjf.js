// Simulación de un planificador SRJF apropiativo (Shortest Remaining Job First) con bloqueos

// -------> MODELO <------
function crearProceso(id, tiempoTotal, bloqueos = []) {
  return {
    id, // Nombre identificador del proceso
    tiempoTotal, // Duración total necesaria
    bloqueos, // Bloqueos representados por { inicio, duracion }
    progreso: 0,
    estado: "listo",
    tiempoBloqueoRestante: 0,
    tiempoEjecucionRestante: tiempoTotal,
  };
}

// -----> VISTA <------
let procesos = [
  crearProceso("P1", 10, [{ inicio: 3, duracion: 2 }]),
  crearProceso("P2", 5),
  crearProceso("P3", 8, [{ inicio: 4, duracion: 3 }]),
];
/*Estos datos son de prueba para el funcionamiento temporal de los algoritmos. Los datos reales deben de venir desde la vista*/

// -----> CONTROLADOR <------
let tiempo = 0;
let colaListos = [...procesos]; // Procesos "listos"
let bloqueados = []; // Procesos en bloqueo de E/S
let ejecutando = null; // Proceso actualmente en CPU

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

  /* Apropiación SRJF: si hay algún proceso ejecutando, comprueba
          si algún otro proceso listo tiene menos tiempo restante*/
  if (ejecutando && colaListos.length > 0) {
    let idxMin = 0;
    for (let i = 1; i < colaListos.length; i++) {
      if (
        colaListos[i].tiempoEjecucionRestante <
        colaListos[idxMin].tiempoEjecucionRestante
      ) {
        idxMin = i;
      }
    }
    // si el más corto de los procesos listos es más corto que el que corre
    if (
      colaListos[idxMin].tiempoEjecucionRestante <
      ejecutando.tiempoEjecucionRestante
    ) {
      console.log(
        `  Apropiación: ${ejecutando.id} (remanente ${ejecutando.tiempoEjecucionRestante})` +
          ` cedé CPU a ${colaListos[idxMin].id}`
      );
      // devuelve el actual a listos
      ejecutando.estado = "listo";
      colaListos.push(ejecutando);
      // toma el nuevo más corto
      ejecutando = colaListos.splice(idxMin, 1)[0];
      ejecutando.estado = "ejecutando";
    }
  }

  // ASIGNACIÓN inicial o tras haber estado la CPU libre
  if (!ejecutando && colaListos.length > 0) {
    // elegir el proceso con menor tiempoEjecucionRestante
    let idxMin = 0;
    for (let i = 1; i < colaListos.length; i++) {
      if (
        colaListos[i].tiempoEjecucionRestante <
        colaListos[idxMin].tiempoEjecucionRestante
      ) {
        idxMin = i;
      }
    }
    ejecutando = colaListos.splice(idxMin, 1)[0];
    ejecutando.estado = "ejecutando";
    console.log(`  > ${ejecutando.id} comienza a ejecutarse (SRJF)`);
  }

  // Para cualquier proceso activo
  if (ejecutando) {
    ejecutando.progreso++;
    ejecutando.tiempoEjecucionRestante--;
    console.log(
      `  - ${ejecutando.id}: progreso ${ejecutando.progreso}/` +
        `${ejecutando.tiempoTotal}, remanente ${ejecutando.tiempoEjecucionRestante}`
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
      console.log(`  ${ejecutando.id} entra en bloqueo por ${bloque.duracion}`);
      ejecutando = null;
    }
    // Verificar si un proceso ha terminado
    else if (ejecutando.tiempoEjecucionRestante <= 0) {
      ejecutando.estado = "terminado";
      console.log(`    ${ejecutando.id} ha terminado`);
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

simular();
