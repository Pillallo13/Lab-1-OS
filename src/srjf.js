export function ejecutarSRTF(procesosOriginales) {
  const procesos = procesosOriginales.map((p) => ({
    ...p,
    progreso: 0,
    estado: null,
    tiempoBloqueoRestante: 0,
    tiempoEjecucionRestante: p.tiempoTotal,
    startTime: null,
    finishTime: null,
    waitingTime: 0,
    blockingTime: 0,
  }));

  let tiempo = 0;
  const bloqueados = [];
  let ejecutando = null;
  const historial = {};

  procesos.forEach((p) => (historial[p.id] = []));

  while (procesos.some((p) => p.estado !== "terminado")) {
    procesos.forEach((p) => {
      if (p.llegada === tiempo && p.estado === "listo") {
        if (
          !ejecutando ||
          p.tiempoEjecucionRestante < ejecutando.tiempoEjecucionRestante
        ) {
          if (ejecutando) {
            ejecutando.estado = "listo";
          }
          ejecutando = p;
          ejecutando.estado = "ejecutando";
        }
      }
    });

    procesos.forEach((p) => {
      historial[p.id].push(p.estado);
    });

    if (ejecutando) {
      ejecutando.progreso++;
      ejecutando.tiempoEjecucionRestante--;
      if (ejecutando.tiempoEjecucionRestante === 0) {
        ejecutando.estado = "terminado";
        ejecutando.finishTime = tiempo + 1;
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
