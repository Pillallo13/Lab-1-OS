export function renderResultTable(dataArray) {
  const tbody = document.getElementById("resultBody");
  tbody.innerHTML = ""; // Limpiar el contenido actual del tbody antes de agregar nuevos datos

  dataArray.forEach((item) => {
    const fila = document.createElement("tr"); // Crear una nueva fila
    // Listar los elementos de la fila
    const keys = [
      "proceso",
      "ejecucion",
      "tiempoRespuesta",
      "espera",
      "bloqueo",
      "instanteFin",
      "retorno",
      "tiempoPerdido",
      "penalidad",
    ];

    keys.forEach((key) => {
      const td = document.createElement("td");
      td.textContent = item[key] ?? "Sin datos"; // Si no hay datos, se indica por pantalla
      fila.appendChild(td); // Agregar la celda a la fila
    });
    tbody.appendChild(fila); // Agregar la fila al tbody
  });
}
