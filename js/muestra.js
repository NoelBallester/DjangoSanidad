const aniadirMuestra1 = async (event) => {
  event.preventDefault();

  let newMuestra = {
    fecha: inputFechaMuestra.value,
    tincion: selectTincionMuestra.value,
    observaciones: inputObservacionesMuestra.value,
    imagen: "",
    qr_muestra: "",
    casetteIdCasette: cassetteId,
  };

  fetch("http://localhost:3000/api/muestras/", {
    method: "POST",
    headers: {
      token: sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newMuestra),
  }) //  Aqui acaba el fetch
    .then((response) => response.json())
    .catch((error) => console.log(error));

  respuesta = await cargarMuestras(cassetteId);
  setInterval(()=>{},500)
  imprimirMuestras(respuesta);
};