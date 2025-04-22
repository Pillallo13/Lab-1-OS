export function ejecutarRR(procesosOriginales, quantum) {
  const procesos = procesosOriginales.map((p) => ({
    ...p,
    progreso: 0,
    estado: "listo",
    tiempoBloqueoRestante: 0,
    startTime: null,
    finishTime: null,
    waitingTime: 0,
    blockingTime: 0,
  }));

  let tiempo = 0;
  const colaListos = [];
  const bloqueados = [];
  let ejecutando = null;
  let quantumRestante = 0;
  const historial = {};

  procesos.forEach((p) => (historial[p.id] = []));

  while (procesos.some((p) => p.estado !== "terminado")) {
    procesos.forEach((p) => {
      if (p.llegada === tiempo) {
        colaListos.push(p);
      }
    });

    bloqueados.forEach((p, i) => {
      p.tiempoBloqueoRestante--;
      if (p.tiempoBloqueoRestante <= 0) {
        p.estado = "listo";
        colaListos.push(p);
        bloqueados.splice(i, 1);
      }
    });

    if (!ejecutando && colaListos.length > 0) {
      ejecutando = colaListos.shift();
      quantumRestante = quantum;
      ejecutando.estado = "ejecutando";
      if (ejecutando.startTime === null) ejecutando.startTime = tiempo;
    }

    procesos.forEach((p) => {
      historial[p.id].push(p.estado);
    });

    if (ejecutando) {
      ejecutando.progreso++;
      quantumRestante--;
      if (ejecutando.progreso >= ejecutando.tiempoTotal) {
        ejecutando.estado = "terminado";
        ejecutando.finishTime = tiempo + 1;
        ejecutando = null;
      } else if (quantumRestante === 0) {
        ejecutando.estado = "listo";
        colaListos.push(ejecutando);
        ejecutando = null;
      }
    }

    tiempo++;
  }

  const resultados = procesos.map((p) => ({
    proceso: p.id,
    ejecucion: p.tiempoTotal,
    tiempoRespuesta: p.startTime - p.llegada,
    espera: p.waitingTime,
    bloqueo: p.blockingTime,
    instanteFin: p.finishTime,
    retorno: p.finishTime - p.llegada,
    tiempoPerdido: p.finishTime - p.tiempoTotal,
    penalidad: parseFloat(
      ((p.finishTime - p.llegada) / p.tiempoTotal).toFixed(2)
    ),
  }));

  return { resultados, historial };
}
