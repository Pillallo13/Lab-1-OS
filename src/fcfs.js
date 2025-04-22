// -----> MODELO <------
export function crearProceso(id, llegada = 0, tiempoTotal, bloqueos = []) {
  return {
    id,
    llegada,
    tiempoTotal,
    bloqueos: [...bloqueos],
    progreso: 0,
    estado: "listo",
    tiempoBloqueoRestante: 0,

    // métricas
    startTime: null,
    finishTime: null,
    waitingTime: 0,
    blockingTime: 0,
  };
}

export function ejecutarFCFS(procesosOriginales) {
  const procesos = procesosOriginales.map((p) => ({
    ...p,
    bloqueos: [...p.bloqueos],
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
      ejecutando.estado = "ejecutando";
      if (ejecutando.startTime === null) ejecutando.startTime = tiempo;
    }

    procesos.forEach((p) => {
      historial[p.id].push(p.estado);
    });

    if (ejecutando) {
      ejecutando.progreso++;
      if (
        ejecutando.bloqueos.length > 0 &&
        ejecutando.bloqueos[0].inicio === ejecutando.progreso
      ) {
        const bloqueo = ejecutando.bloqueos.shift();
        ejecutando.estado = "bloqueado";
        ejecutando.tiempoBloqueoRestante = bloqueo.duracion;
        bloqueados.push(ejecutando);
        ejecutando = null;
      } else if (ejecutando.progreso >= ejecutando.tiempoTotal) {
        ejecutando.estado = "terminado";
        ejecutando.finishTime = tiempo + 1;
        ejecutando = null;
      }
    }

    tiempo++;
  }

  const resultados = procesos.map((p) => {
    const retorno = p.finishTime - p.llegada;
    const perdido = retorno - p.tiempoTotal;
    return {
      proceso: p.id,
      ejecucion: p.tiempoTotal,
      tiempoRespuesta: p.startTime - p.llegada,
      espera: p.waitingTime,
      bloqueo: p.blockingTime,
      instanteFin: p.finishTime,
      retorno,
      tiempoPerdido: perdido,
      penalidad: parseFloat((retorno / p.tiempoTotal).toFixed(2)),
    };
  });

  return { resultados, historial };
}
