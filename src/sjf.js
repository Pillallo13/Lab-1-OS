export function ejecutarSJF(procesosOriginales) {
  const procesos = procesosOriginales.map((p) => ({
    ...p,
    progreso: 0,
    estado: null,
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
        p.estado = "listo";
      }
    });

    bloqueados.forEach((p, i) => {
      
      if (p.tiempoBloqueoRestante <= 0) {
        p.estado = "listo";
        colaListos.push(p);
        bloqueados.splice(i, 1);
      }
      p.tiempoBloqueoRestante--;
    });

    if (!ejecutando && colaListos.length > 0) {
      colaListos.sort((a, b) => a.tiempoTotal - b.tiempoTotal);
      ejecutando = colaListos.shift();
      ejecutando.estado = "ejecutando";
      if (ejecutando.startTime === null) ejecutando.startTime = tiempo;
    }

    procesos.forEach((p) => {
      if (p.estado === "listo" && p !== ejecutando) {
        p.waitingTime++;
      } else if (p.estado === "bloqueado") {
        // El incremento ya lo hicimos arriba, pero puedes centralizarlo aquí si prefieres
        p.blockingTime++;
      }
    });

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
