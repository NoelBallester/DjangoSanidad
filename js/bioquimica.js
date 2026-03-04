const inputCassete = document.getElementById("inputCassete");
const token = sessionStorage.getItem("token");

const body = document.getElementById("body");
const casettes = document.getElementById("casettes");
const muestras = document.getElementById("muestras");
const organos = document.getElementById("organos");
const numMuestra = document.getElementById("numMuestra");

// Botón Modal modificar datos Usuario
const btnformmodificarUser = document.getElementById("btnformmodificarUser");
const modalupdateUser = document.getElementById("modalupdateUser");
const btnformcerrarmodificarUser = document.getElementById("btnformcerrarmodificarUser");

const inputUpdateNombreUser = document.getElementById("inputUpdateNombreUser");
const inputUpdateApellidosUser = document.getElementById("inputUpdateApellidosUser");
const inputUpdateCorreoUser = document.getElementById("inputUpdateCorreoUser");
const inputUpdatePass1User = document.getElementById("inputUpdatePass1User");
const inputUpdatePass2User = document.getElementById("inputUpdatePass2User");
const inputUpdateCentroUser = document.getElementById("inputUpdateCentroUser");

const btnborrar = document.getElementById("btnborrar");
const modalNuevoMuestra = document.getElementById("modalNuevoMuestra");
const btnNuevoMuestra = document.getElementById("btnNuevoMuestra");
const btnformmodificarmuestra = document.getElementById("btnformmodificarmuestra");
const btnCerrarNuevoMuestra = document.getElementById("btnCerrarNuevoMuestra");
const btnCerrarModificarMuestra = document.getElementById("btnCerrarModificarMuestra");

const formNuevoMuestra = document.getElementById("formNuevoMuestra");
const formNuevoDetalle = document.getElementById("formNuevoDetalle");
const formModificarMuestra = document.getElementById("formModificarMuestra");

// Elementos del Detalle Lateral (Principal)
const muestra__descripcion = document.getElementById("muestra__descripcion");
const muestra__organo = document.getElementById("muestra__organo");
const muestra__muestra = document.getElementById("muestra__muestra");
const muestra__fecha = document.getElementById("muestra__fecha");
const muestra__caracteristicas = document.getElementById("muestra__caracteristicas");
const muestra__observaciones = document.getElementById("muestra__observaciones");

// Elementos del Modal de Detalle (Sub-items)
const modal_muestra__descripcion = document.getElementById("modal_muestra__descripcion");
const modal_muestra__fecha = document.getElementById("modal_muestra__fecha");
const modal_muestra__observaciones = document.getElementById("modal_muestra__observaciones");
const modal_muestra__tincion = document.getElementById("modal_muestra__tincion");

const modalVerDetalle = document.getElementById("modalVerDetalle");
const btnCerrarVerDetalle = document.getElementById("btnCerrarVerDetalle");
const modalNuevoDetalle = document.getElementById("modalNuevoDetalle");
const btnNuevoDetalle = document.getElementById("btnNuevoDetalle");
const btnCerrarNuevoDetalle = document.getElementById("btnCerrarNuevoDetalle");

// Elementos del Informe Médico
const muestra__informe_descripcion = document.getElementById("muestra__informe_descripcion");
const muestra__informe_fecha = document.getElementById("muestra__informe_fecha");
const muestra__informe_tincion = document.getElementById("muestra__informe_tincion");
const muestra__informe_observaciones = document.getElementById("muestra__informe_observaciones");
const muestra__informe_imagen = document.getElementById("muestra__informe_imagen");

const eliminarMuestraModal = document.getElementById("eliminarMuestraModal");
const eliminarMuestraDetalleModal = document.getElementById("eliminarMuestraDetalleModal");
let currentMuestraId = null;
const btnGuardarInforme = document.getElementById("btnGuardarInforme");
const btn__imprimirqr = document.getElementById("btn__imprimirqr");

// Modal qr e imágenes
const imgmuestra__qr = document.getElementById("imgmuestra__qr");
const inputmuestra__qr = document.getElementById("inputmuestra__qr");
const muestra__img = document.getElementById("muestra__img");
const visor__img = document.getElementById("visor__img");
const btnAniadirImagen = document.getElementById("btnAniadirImagen");

const btnTodosMuestras = document.getElementById("btnTodosMuestras");

// Formularios de Creación/Edición
const inputFecha = document.getElementById("inputFecha");
const inputDescripcion = document.getElementById("inputDescripcion");
const inputNumMuestra = document.getElementById("inputNumMuestra");
const inputCaracteristicas = document.getElementById("inputCaracteristicas");
const inputObservaciones = document.getElementById("inputObservaciones");
const inputClinica = document.getElementById("inputClinica");
const inputMicroscopia = document.getElementById("inputMicroscopia");
const inputDiagnostico = document.getElementById("inputDiagnostico");
const inputPatologo = document.getElementById("inputPatologo");
const inputSelect = document.getElementById("inputSelect");

const modalModificarMuestra = document.getElementById("modalModificarMuestra");
const inputFechaUpdate = document.getElementById("inputFechaUpdate");
const inputDescripcionUpdate = document.getElementById("inputDescripcionUpdate");
const inputMuestraUpdate = document.getElementById("inputTuboUpdate");
const inputCaracteristicasUpdate = document.getElementById("inputCaracteristicasUpdate");
const inputObservacionesUpdate = document.getElementById("inputObservacionesUpdate");
const inputClinicaUpdate = document.getElementById("inputClinicaUpdate");
const inputMicroscopiaUpdate = document.getElementById("inputMicroscopiaUpdate");
const inputDiagnosticoUpdate = document.getElementById("inputDiagnosticoUpdate");
const inputPatologoUpdate = document.getElementById("inputPatologoUpdate");
const inputSelectUpdate = document.getElementById("inputSelectUpdate");

// id del cassete de trabajo (Ya declarado arriba)
// qr cassete
let muestraqr = null;

const files = document.getElementById("files");

// Variable del modal de modificación de sub-item
const modalmodificarTubo = document.getElementById("modalmodificarTubo");
const formModificarTuboDetalle = document.getElementById("modificarTubo");

// Elementos del Modal Modificar Detalle (Sub-item)
const inputmodificardescripcionTubo = document.getElementById("inputmodificardescripcionTubo");
const inputmodificarfechaTubo = document.getElementById("inputmodificarfechaTubo");
const selectmodificartincionTubo = document.getElementById("selectmodificartincionTubo");
const inputmodificarobservacionesTubo = document.getElementById("inputmodificarobservacionesTubo");

// Carga Muestras al inicio
const cargarMuestrasIndex = async () => {
  return await fetch("/api/tubos/index/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
};

// Crear Muestras (Principal)
const crearMuestra = async (event) => {
  event.preventDefault();

  try {
    const response = await fetch("/api/tubos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tubo: inputNumMuestra.value,
        fecha: inputFecha.value,
        descripcion: inputDescripcion.value,
        caracteristicas: inputCaracteristicas.value,
        observaciones: inputObservaciones.value,
        informacion_clinica: inputClinica.value,
        descripcion_microscopica: inputMicroscopia.value,
        diagnostico_final: inputDiagnostico.value,
        patologo_responsable: inputPatologo.value,
        tecnico: sessionStorage.getItem("user") || 1,
        organo: inputSelect.value,
      }),
    });

    if (response.ok) {
      console.log("Muestra creada con éxito");
      location.href = "bioquimica.html";
    } else {
      const errorData = await response.json();
      console.error("Error al crear muestra:", errorData);
      alert("Error al crear la muestra: " + JSON.stringify(errorData));
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Error de red al intentar crear la muestra");
  }
};

// Carga todos lo bioquimica desde el botón
const cargarTodosMuestras = async () => {
  return await fetch("/api/tubos/todos/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Carga el detalle del muestra seleccionado
const cargarMuestra = async (id) => {
  return await fetch(`/api/tubos/${id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Obtener bioquimica por organo
const cargarPorOrgano = async () => {
  return await fetch(`/api/tubos/organo/${organos.value}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((data) => data.json())
    .catch((error) => console.log("No se esta ejecutando" + error));
};

// Obtener bioquimica por número de muestra
const cargarPorNumero = async () => {
  return await fetch(`/api/tubos/numero/${numMuestra.value}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((data) => data.json())
    .catch((error) => console.log("No se esta ejecutando" + error));
};

// Obtener bioquimica por fecha
const obtenerMuestrasFecha = async (fecha) => {
  const response = await fetch(`/api/tubos/fecha/${fecha}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  return await response.json();
};

// Obtener bioquimica por rango de fechas
const obtenerMuestrasFechaRango = async (fechainicio, fechafin) => {
  const response = await fetch(`/api/tubos/rango_fechas/?inicio=${fechainicio}&fin=${fechafin}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  return await response.json();
};

// Borrar un muestra
const borrarMuestraTubo = () => {
  fetch(`/api/tubos/${muestraId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
  location.href = "bioquimica.html";
};

// Consulta bioquimica en una fecha
const consultaFechaInicio = async () => {
  alertfecha.classList.add("ocultar");
  let respuesta;
  if (!fechafin.value) {
    respuesta = await obtenerMuestrasFecha(fechainicio.value);
  } else {
    if (new Date(fechainicio.value) > new Date(fechafin.value)) {
      alertfecha.classList.add("ocultar");
      alertfecha_text.textContent = "La fecha de inicio debe ser menor";
      alertfecha.classList.remove("ocultar");
    } else {
      alertfecha.classList.add("ocultar");
      respuesta = await obtenerMuestrasFechaRango(
        fechainicio.value,
        fechafin.value
      );
    }
  }
  imprimirCasettes(respuesta, false);
};

// Consulta bioquimica entre dos fechas
const consultaFechaFin = async () => {
  if (!fechainicio.value) {
    alertfecha_text.textContent = "Seleccione una fecha de inicio";
    alertfecha.classList.remove("ocultar");
  } else {
    if (new Date(fechainicio.value) > new Date(fechafin.value)) {
      alertfecha.classList.add("ocultar");
      alertfecha_text.textContent = "La fecha de inicio debe ser menor";
      alertfecha.classList.remove("ocultar");
    } else {
      alertfecha.classList.add("ocultar");
      const respuesta = await obtenerMuestrasFechaRango(
        fechainicio.value,
        fechafin.value
      );
      imprimirCasettes(respuesta, false);
    }
  }
};

// Muestra los datos de los bioquimica por pantalla
const imprimirCasettes = (respuesta, rebuildDropdown = true) => {
  casettes.innerHTML = "";
  if (rebuildDropdown) {
    numMuestra.innerHTML = "<option disabled selected>Número Muestra</option>";
  }

  let fragmento = document.createDocumentFragment();
  let fragmentselect = document.createDocumentFragment();
  if (respuesta.length > 0) {
    respuesta.map((item) => {
      // Para cargar los números de muestra
      let option = document.createElement("OPTION");
      option.textContent = item.tubo; // campo 'tubo' en modelo Tubo
      fragmentselect.appendChild(option);

      // Para mostrar los bioquimica
      let tr = document.createElement("tr");
      tr.classList.add("table__row");

      // Número de Muestra
      let nmuestra = document.createElement("td");
      nmuestra.textContent = item.tubo;

      let fecha = document.createElement("td");
      let nuevafecha = item.fecha;

      fecha.textContent =
        nuevafecha.substring(8) +
        "-" +
        nuevafecha.substring(5, 7) +
        "-" +
        nuevafecha.substring(0, 4);
      let descripcion = document.createElement("td");
      descripcion.textContent = item.descripcion.substring(0, 50);
      descripcion.title = item.descripcion;

      let organo = document.createElement("td");
      organo.textContent = item.organo;

      let btndetalle = document.createElement("I");
      btndetalle.className =
        "d-inline-block muestra__icon fa-solid fa-file-invoice muestra__icon--infomuestra";
      btndetalle.setAttribute("value", item.id_tubo); // Usar setAttribute para el icono
      btndetalle.title = "Detalle Muestra";

      let btnCont = document.createElement("td");
      btnCont.appendChild(btndetalle);

      tr.appendChild(nmuestra);
      tr.appendChild(fecha);
      tr.appendChild(descripcion);
      tr.appendChild(organo);
      tr.appendChild(btnCont);

      fragmento.appendChild(tr);
    });
  } else {
    let tr = document.createElement("span");
    tr.classList.add(
      "d-flex",
      "justify-content-center",
      "fw-bold",
      "text-danger",
      "text-opacity-50"
    );
    tr.textContent = "No se ha encontrado nigún muestra";
    fragmento.appendChild(tr);
  }

  casettes.appendChild(fragmento);
  if (rebuildDropdown) {
    numMuestra.appendChild(fragmentselect);
  }
};

// Carga datos para el detalle lateral
const detalleMuestra = async (event) => {
  if (event.target.nodeName == "I" || event.target.classList.contains("fa-file-invoice")) {
    let id = event.target.value || event.target.getAttribute("value");
    currentMuestraId = id;

    const muestra = await cargarMuestra(id);
    imprimirDataMuestra(muestra);

    const muestras_list = await cargarMuestrasTubo(id);
    imprimirMuestras(muestras_list);
  }
};

// Muestra el detalle de una muestra (Principal) en el panel lateral
const imprimirDataMuestra = (item) => {
  muestra__descripcion.textContent = item.descripcion;
  muestra__organo.textContent = item.organo;
  muestra__muestra.textContent = item.tubo;

  let nuevafecha = item.fecha;
  muestra__fecha.textContent =
    nuevafecha.substring(8) +
    "-" +
    nuevafecha.substring(5, 7) +
    "-" +
    nuevafecha.substring(0, 4);

  muestra__caracteristicas.textContent = item.caracteristicas;
  muestra__observaciones.textContent = item.observaciones;

  // Informe Médico
  muestra__informe_descripcion.value = item.informe_descripcion || "";
  muestra__informe_fecha.value = item.informe_fecha || "";
  muestra__informe_tincion.value = item.informe_tincion || "";
  muestra__informe_observaciones.value = item.informe_observaciones || "";

  if (item.imagen_base64) {
    if (muestra__informe_imagen) muestra__informe_imagen.src = "data:image/jpeg;base64," + item.imagen_base64;
  }

  // QR
  const qr = new QRious({
    element: inputmuestra__qr,
    value: item.qr_tubo,
    size: 200,
    background: "white",
    foreground: "#4ca0cc",
    level: "H",
  });
  imgmuestra__qr.src = qr.toDataURL();
};

//Saca por impresora codigo QR
const imprimirQR = (elemento) => {
  let qrimprimir;
  if (elemento == "muestra") {
    qrimprimir = imgmuestra__qr.src;
  } else {
    // Por si acaso ;)
    if (elemento == "muestra") {
      qrimprimir = imgmuestra__qr.src;
    }
  }

  let printWindow = window.open("", "Imprimir imagen");
  printWindow.document.write(
    "<html><head><title>Imprimir imagen</title></head><body><img src='" +
    qrimprimir +
    "'></body></html>"
  );
  printWindow.print();
  printWindow.close();
};

// Cargamos el modal datos cassete modificar
const cargarMuestraUpdateModal = async (event) => {
  if (!muestraId) {
    event.preventDefault();
    alertmuestra.classList.remove("ocultar");
  } else {
    let muestra = await cargarMuestra(muestraId);
    inputDescripcionUpdate.value = muestra.descripcion;
    inputMuestraUpdate.value = muestra.id_tubo;
    inputFechaUpdate.value = muestra.fecha;
    inputCaracteristicasUpdate.value = muestra.caracteristicas;
    inputObservacionesUpdate.value = muestra.observaciones;
    inputClinicaUpdate.value = muestra.informacion_clinica || "";
    inputMicroscopiaUpdate.value = muestra.descripcion_microscopica || "";
    inputDiagnosticoUpdate.value = muestra.diagnostico_final || "";
    inputPatologoUpdate.value = muestra.patologo_responsable || "";
    inputSelectUpdate.value = muestra.organo;
  }
};

const modificarMuestraUpdate = async (event) => {
  event.preventDefault();

  try {
    const response = await fetch(`/api/tubos/${muestraId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fecha: inputFechaUpdate.value,
        descripcion: inputDescripcionUpdate.value,
        tubo: inputMuestraUpdate.value,
        caracteristicas: inputCaracteristicasUpdate.value,
        observaciones: inputObservacionesUpdate.value,
        informacion_clinica: inputClinicaUpdate.value,
        descripcion_microscopica: inputMicroscopiaUpdate.value,
        diagnostico_final: inputDiagnosticoUpdate.value,
        patologo_responsable: inputPatologoUpdate.value,
        tecnico: sessionStorage.getItem("user"),
        organo: inputSelectUpdate.value,
      }),
    });

    if (response.ok) {
      console.log("Muestra actualizada con éxito");
      location.href = "bioquimica.html";
    } else {
      const errorData = await response.json();
      console.error("Error al actualizar muestra:", errorData);
      alert("Error al actualizar muestra: " + JSON.stringify(errorData));
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Error de red al intentar actualizar la muestra");
  }
};

// MUESTRAS

// Carga Muestras de un Tubo
const cargarMuestrasTubo = async (tuboId) => {
  return await fetch(`/api/muestrastubo/tubo/${tuboId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Crear nueva muestra de tubo
const crearMuestraTubo = async (event) => {
  event.preventDefault();

  let newMuestra = new FormData();
  newMuestra.append("descripcion", inputdescripcionMuestra.value);
  newMuestra.append("fecha", inputFechaMuestra.value);
  newMuestra.append("observaciones", inputObservacionesMuestra.value);
  newMuestra.append("tincion", selectTincionMuestra.value);
  if (inputImagenesMuestra.files[0]) {
    newMuestra.append("imagen", inputImagenesMuestra.files[0]);
  }
  newMuestra.append("tubo", currentMuestraId); // En este contexto currentMuestraId es el ID del Tubo

  await fetch("/api/muestrastubo/", {
    method: "POST",
    body: newMuestra,
  })
    .then(async () => {
      if (modalNuevoDetalle) {
        modalNuevoDetalle.classList.remove("showmodal");
        modalNuevoDetalle.classList.add("hidemodal");
      }
      limpiarModalMuestra();
      imprimirMuestras(await cargarMuestrasTubo(currentMuestraId));
    })
    .catch((error) =>
      console.log("No se esta ejecutando correctamente la inserción" + error)
    );
};

const limpiarModalMuestra = () => {
  inputdescripcionMuestra.value = "";
  inputFechaMuestra.value = "";
  inputObservacionesMuestra.value = "";
  selectTincionMuestra.value = "";
  inputImagenesMuestra.value = "";
};

// Cargamos el modal datos muestra a modificar (Sub-item)
const cargarMuestraTuboUpdateModal = async (event) => {
  if (!muestraId) {
    if (event) event.preventDefault();
    alertmuestra.classList.remove("ocultar");
  } else {
    const response = await fetch(`/api/muestrastubo/${muestraId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let muestra = await response.json();
    inputmodificardescripcionTubo.value = muestra.descripcion;
    inputmodificarfechaTubo.value = muestra.fecha;
    selectmodificartincionTubo.value = muestra.tincion;
    inputmodificarobservacionesTubo.value = muestra.observaciones;

    // Mostramos el modal
    modalmodificarTubo.classList.add("showmodal");
    modalmodificarTubo.classList.remove("hidemodal");
  }
};

// Modificar muestra de tubo (Sub-item)
const modificarMuestraTuboUpdate = async (event) => {
  event.preventDefault();

  try {
    const response = await fetch(`/api/muestrastubo/${muestraId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fecha: inputmodificarfechaTubo.value,
        descripcion: inputmodificardescripcionTubo.value,
        observaciones: inputmodificarobservacionesTubo.value,
        tincion: selectmodificartincionTubo.value,
        tubo: currentMuestraId // Necesitamos el ID del tubo padre
      }),
    });

    if (response.ok) {
      // Actualizamos los datos del detalle de la muestra en el modal de ver
      if (modal_muestra__descripcion) modal_muestra__descripcion.textContent = inputmodificardescripcionTubo.value;

      let nuevafecha = inputmodificarfechaTubo.value;
      if (modal_muestra__fecha) {
        modal_muestra__fecha.textContent =
          nuevafecha.substring(8) +
          "-" +
          nuevafecha.substring(5, 7) +
          "-" +
          nuevafecha.substring(0, 4);
      }

      if (modal_muestra__observaciones) modal_muestra__observaciones.textContent = inputmodificarobservacionesTubo.value;
      if (modal_muestra__tincion) modal_muestra__tincion.textContent = selectmodificartincionTubo.value;

      // Actualizamos la lista de muestras
      let respuesta = await cargarMuestrasTubo(currentMuestraId);
      imprimirMuestras(respuesta);

      // Ocultamos el modal
      modalmodificarTubo.classList.remove("showmodal");
      modalmodificarTubo.classList.add("hidemodal");
    }
  } catch (error) {
    console.error("Error al modificar sub-muestra:", error);
  }
};

// Imprimir muestras
const imprimirMuestras = (respuesta) => {
  muestras.innerHTML = "";

  let fragmento = document.createDocumentFragment();
  if (respuesta.length > 0) {
    respuesta.forEach((muestra) => {
      let tr = document.createElement("tr");

      tr.classList.add("table__row");
      let descripcion = document.createElement("td");
      descripcion.textContent = muestra.descripcion.substring(0, 80);
      descripcion.title = muestra.descripcion;

      let fecha = document.createElement("td");
      nuevafecha = muestra.fecha;
      fecha.textContent =
        nuevafecha.substring(8) +
        "-" +
        nuevafecha.substring(5, 7) +
        "-" +
        nuevafecha.substring(0, 4);

      /*   let observaciones = document.createElement("td");
      observaciones.textContent = muestra.observaciones; */

      let tincion = document.createElement("td");
      tincion.textContent = muestra.tincion;

      let btn = document.createElement("td");
      let btndetalle = document.createElement("I");
      btndetalle.className =
        "d-inline-block muestra__icon fa-solid fa-file-invoice muestra__icon--infomuestra";
      btndetalle.setAttribute("value", muestra.id_muestra);
      btndetalle.title = "Detalle Muestra";
      btn.appendChild(btndetalle);

      tr.appendChild(fecha);
      tr.appendChild(descripcion);
      /*  tr.appendChild(observaciones); */
      tr.appendChild(tincion);
      tr.appendChild(btn);

      fragmento.appendChild(tr);
    });
  } else {
    let tr = document.createElement("span");
    tr.classList.add("fw-bold", "text-danger", "text-opacity-50");
    tr.textContent = "No se ha encontrado ninguna muestra";
    fragmento.appendChild(tr);
  }
  muestras.appendChild(fragmento);
};

// Obtenemos una muestra de tubo por id
const cargarDetalleMuestraTubo = async (muestraid) => {
  const response = await fetch(`/api/muestrastubo/${muestraid}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  return await response.json();
};

// Obtenemos las imagenes de una muestra de tubo
const obtenerImagenesMuestra = async (muestraid) => {
  const response = await fetch(`/api/imagenestubo/muestra/${muestraid}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  let imagenes = await response.json();
  return imagenes;
};

// Rellenamos los datos texto de la muestra (Sub-item) en el modal
const rellenarDatosMuestra = async (muestra) => {
  if (modal_muestra__descripcion) {
    modal_muestra__descripcion.textContent = muestra.descripcion.substring(0, 60);
    modal_muestra__descripcion.title = muestra.descripcion;
  }

  let nuevafecha = muestra.fecha;
  if (modal_muestra__fecha) {
    modal_muestra__fecha.textContent =
      nuevafecha.substring(8) +
      "-" +
      nuevafecha.substring(5, 7) +
      "-" +
      nuevafecha.substring(0, 4);
  }

  if (modal_muestra__observaciones) modal_muestra__observaciones.textContent = muestra.observaciones;
  if (modal_muestra__tincion) modal_muestra__tincion.textContent = muestra.tincion;
};

const mostrarImagenesMuestra = async (muestraId) => {
  muestra__img.innerHTML = "";
  let imagenes = await obtenerImagenesMuestra(muestraId);
  // Imagen de sustitución si no hay imagenes para una muestra
  if (imagenes.length == 0) {
    visor__img.src = "./assets/images/no_disponible.jpg";
  } else {
    imagenes.forEach((imagen, index) => {
      let newimg = document.createElement("IMG");
      newimg.id = imagen.id_imagen;
      newimg.src = `data:image/jpeg;base64,${imagen.imagen}`;
      newimg.classList.add("muestra__img");

      if (index == 0) {
        visor__img.src = newimg.src;
        imageId = newimg.id;
      }

      // Añadimos cada una de las imagenes
      let newdiv = document.createElement("DIV");
      newdiv.classList.add("container__muestraimg", "border", "m-1");
      newdiv.appendChild(newimg);
      muestra__img.appendChild(newdiv);
    });
  }
};

const borrarMuestraTuboDetalle = async () => {
  if (!muestraId) return;
  fetch(`/api/muestrastubo/${muestraId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then(async () => {
      // Ocultamos modales
      if (modalVerDetalle) {
        modalVerDetalle.classList.remove("showmodal");
        modalVerDetalle.classList.add("hidemodal");
      }
      if (eliminarMuestraDetalleModal) {
        eliminarMuestraDetalleModal.classList.remove("showmodal");
        eliminarMuestraDetalleModal.classList.add("hidemodal");
      }
      // Mostramos las muestras del tubo
      let muestras_list = await cargarMuestrasTubo(currentMuestraId);
      imprimirMuestras(muestras_list);
    })
    .catch((error) => console.log(error));
};

const borrarMuestraPrincipal = async () => {
  if (!currentMuestraId) return;
  fetch(`/api/tubos/${currentMuestraId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then(() => {
      location.href = "bioquimica.html";
    })
    .catch((error) => console.log(error));
};

const borrarImagenMuestraTubo = async () => {
  if (imageId != undefined) {
    fetch(`/api/imagenestubo/${imageId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(() => {
      mostrarImagenesMuestra(muestraId);
    });
  }
};

// Mostramos Detalle muestra seleccionada (Sub-muestra)
const detailMuestraDetalle = async (muestraid) => {
  // Cargamos la muestra
  let muestra = await cargarDetalleMuestraTubo(muestraid);
  muestraId = muestra.id_muestra;
  rellenarDatosMuestra(muestra);

  // generamos el codigo QR
  if (window.QRious) {
    new QRious({
      element: inputmuestra__qr,
      value: muestra.qr_muestra,
      size: 70,
      backgroundAlpha: 0,
      foreground: "#4ca0cc",
      level: "H",
    });
  }

  // Mostramos las imagenes de la muestra seleccionada
  mostrarImagenesMuestra(muestraId);

  modalVerDetalle.classList.add("showmodal");
  modalVerDetalle.classList.remove("hidemodal");
};

const aniadirImagenMuestraTubo = async () => {
  const inputManualImagen = document.getElementById("inputManualImagen");
  if (inputManualImagen) {
    inputManualImagen.click();
    inputManualImagen.onchange = async () => {
      const file = inputManualImagen.files[0];
      if (!file) return;

      let newImage = new FormData();
      newImage.append("imagen", file);
      newImage.append("muestratubo", muestraId);

      fetch("/api/imagenestubo/", {
        method: "POST",
        body: newImage,
      }).then(async () => {
        await mostrarImagenesMuestra(muestraId);
      });
    };
  }
};

const consultarMuestraTuboQR = async (qr) => {
  const response = await fetch(`/api/tubos/qr/${qr}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  let tubos_data = await response.json();

  if (tubos_data.length > 0) {
    imprimirCasettes(tubos_data);
    let tubo_item = tubos_data[0];
    imprimirDataMuestra(tubo_item);
    currentMuestraId = tubo_item.id_tubo; // Usar id_tubo
    let muestras_list = await cargarMuestrasTubo(currentMuestraId);
    imprimirMuestras(muestras_list);
  }
};

const cargarUserUpdateModal = async () => {
  let userId = sessionStorage.getItem("user");
  if (!userId) return;

  const response = await fetch(`/api/tecnicos/${userId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (response.ok) {
    let user = await response.json();
    if (inputUpdateNombreUser) inputUpdateNombreUser.value = user.nombre;
    if (inputUpdateApellidosUser) inputUpdateApellidosUser.value = user.apellidos;
    if (inputUpdateCentroUser) inputUpdateCentroUser.value = user.centro;
    if (inputUpdateCorreoUser) inputUpdateCorreoUser.value = user.email;
  }
};

// Eventos
if (btnformmodificarUser) {
  btnformmodificarUser.addEventListener("click", () => {
    cargarUserUpdateModal();
    if (!modalupdateUser.classList.contains("showmodal")) {
      modalupdateUser.classList.add("showmodal");
      modalupdateUser.classList.remove("hidemodal");
    }
  });
}

if (btnformcerrarmodificarUser) {
  btnformcerrarmodificarUser.addEventListener("click", () => {
    if (!modalupdateUser.classList.contains("hidemodal")) {
      modalupdateUser.classList.add("hidemodal");
      modalupdateUser.classList.remove("showmodal");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (typeof body !== 'undefined') body.style.display = "block";
  const respuesta = await cargarMuestrasIndex();
  imprimirCasettes(respuesta);
  let fechaActual = new Date().toISOString().split("T")[0];
  if (inputFecha) inputFecha.setAttribute("min", fechaActual);
  if (inputFechaUpdate) inputFechaUpdate.setAttribute("min", fechaActual);
  if (inputFechaMuestra) inputFechaMuestra.setAttribute("min", fechaActual);
});

if (organos) {
  organos.addEventListener("change", async () => {
    const respuesta = await cargarPorOrgano();
    imprimirCasettes(respuesta, false);
  });
}

if (numMuestra) {
  numMuestra.addEventListener("change", async () => {
    const respuesta = await cargarPorNumero();
    imprimirCasettes(respuesta, false);
  });
}

// Eliminado duplicado
// if (casettes) {
//   casettes.addEventListener("click", detalleMuestra);
// }

if (fechainicio) fechainicio.addEventListener("change", consultaFechaInicio);
if (fechafin) fechafin.addEventListener("change", consultaFechaFin);

if (btnTodosMuestras) {
  btnTodosMuestras.addEventListener("click", async () => {
    const respuesta = await cargarTodosMuestras();
    imprimirCasettes(respuesta);
  });
}

if (btnNuevoMuestra) {
  btnNuevoMuestra.addEventListener("click", () => {
    if (!modalNuevoMuestra.classList.contains("showmodal")) {
      modalNuevoMuestra.classList.add("showmodal");
      modalNuevoMuestra.classList.remove("hidemodal");
    }
  });
}

if (btnCerrarNuevoMuestra) {
  btnCerrarNuevoMuestra.addEventListener("click", () => {
    if (!modalNuevoMuestra.classList.contains("hidemodal")) {
      modalNuevoMuestra.classList.add("hidemodal");
      modalNuevoMuestra.classList.remove("showmodal");
    }
  });
}

if (formNuevoMuestra) {
  formNuevoMuestra.addEventListener("submit", crearMuestra);
}

if (btnModificarMuestra) {
  btnModificarMuestra.addEventListener("click", () => {
    if (!currentMuestraId) {
      alertmuestra.classList.remove("ocultar");
    } else {
      cargarMuestraUpdateModal();
      if (!modalModificarMuestra.classList.contains("showmodal")) {
        modalModificarMuestra.classList.add("showmodal");
        modalModificarMuestra.classList.remove("hidemodal");
      }
    }
  });
}

if (btnCerrarModificarMuestra) {
  btnCerrarModificarMuestra.addEventListener("click", () => {
    if (!modalModificarMuestra.classList.contains("hidemodal")) {
      modalModificarMuestra.classList.add("hidemodal");
      modalModificarMuestra.classList.remove("showmodal");
    }
  });
}

if (formModificarMuestra) {
  formModificarMuestra.addEventListener("submit", modificarMuestraUpdate);
}

if (eliminarMuestraModal) {
  eliminarMuestraModal.addEventListener("show.bs.modal", (event) => {
    if (!currentMuestraId) {
      event.preventDefault();
      alertmuestra.classList.remove("ocultar");
    }
  });
}

if (btnborrar) {
  btnborrar.addEventListener("click", borrarMuestraPrincipal);
}

if (imagenMuestraModal) {
  imagenMuestraModal.addEventListener("show.bs.modal", (event) => {
    if (!currentMuestraId) {
      event.preventDefault();
      alertmuestra.classList.remove("ocultar");
    }
  });
}

if (qrMuestraModal) {
  qrMuestraModal.addEventListener("show.bs.modal", (event) => {
    if (!currentMuestraId) {
      event.preventDefault();
      alertmuestra.classList.remove("ocultar");
    } else {
      inputmuestra__qr.style.display = "none";
      inputmuestra__qr.focus();
    }
  });
}

if (btnNuevoDetalle) {
  btnNuevoDetalle.addEventListener("click", () => {
    if (!currentMuestraId) {
      alertmuestra.classList.remove("ocultar");
    } else {
      if (!modalNuevoDetalle.classList.contains("showmodal")) {
        modalNuevoDetalle.classList.add("showmodal");
        modalNuevoDetalle.classList.remove("hidemodal");
      }
    }
  });
}

if (btnCerrarNuevoMuestra) {
  btnCerrarNuevoMuestra.addEventListener("click", () => {
    modalNuevoMuestra.classList.add("hidemodal");
    modalNuevoMuestra.classList.remove("showmodal");
  });
}

if (btnCerrarModificarMuestra) {
  btnCerrarModificarMuestra.addEventListener("click", () => {
    modalModificarMuestra.classList.add("hidemodal");
    modalModificarMuestra.classList.remove("showmodal");
  });
}

const btnformcerrarmodificarTubo = document.getElementById("btnformcerrarmodificarTubo");
if (btnformcerrarmodificarTubo) {
  btnformcerrarmodificarTubo.addEventListener("click", () => {
    modalmodificarTubo.classList.add("hidemodal");
    modalmodificarTubo.classList.remove("showmodal");
  });
}

if (btnCerrarNuevoDetalle) {
  btnCerrarNuevoDetalle.addEventListener("click", () => {
    modalNuevoDetalle.classList.add("hidemodal");
    modalNuevoDetalle.classList.remove("showmodal");
  });
}

if (btnCerrarVerDetalle) {
  btnCerrarVerDetalle.addEventListener("click", () => {
    if (modalVerDetalle && !modalVerDetalle.classList.contains("hidemodal")) {
      modalVerDetalle.classList.add("hidemodal");
      modalVerDetalle.classList.remove("showmodal");
    }
    muestra__img.innerHTML = "";
  });
}

if (formNuevoDetalle) {
  formNuevoDetalle.addEventListener("submit", crearMuestraTubo);
}

if (formModificarTuboDetalle) {
  formModificarTuboDetalle.addEventListener("submit", modificarMuestraTuboUpdate);
}

if (btnModificarDetalle) {
  btnModificarDetalle.addEventListener("click", () => {
    if (!muestraId) {
      alertfecha.classList.remove("ocultar");
    } else {
      cargarMuestraTuboUpdateModal();
      // The sub-item modification uses the same form as creation or a separate one?
      // Updating current terminology...
    }
  });
}

if (casettes) {
  casettes.addEventListener("click", (event) => {
    if (event.target.classList.contains("fa-file-invoice")) {
      let id = event.target.value || event.target.getAttribute("value");
      if (id) {
        currentMuestraId = id;
        detalleMuestra(event); // Reutilizamos detalleMuestra si es el icono de detalle
      }
    }
    if (event.target.classList.contains("fa-file-pen")) {
      let id = event.target.value || event.target.getAttribute("value");
      if (id) {
        muestraId = id;
        cargarMuestraUpdateModal();
        modalModificarMuestra.classList.add("showmodal");
        modalModificarMuestra.classList.remove("hidemodal");
      }
    }
    if (event.target.classList.contains("fa-trash-can")) {
      let id = event.target.value || event.target.getAttribute("value");
      if (id) {
        currentMuestraId = id;
        if (eliminarMuestraModal) {
          eliminarMuestraModal.classList.add("showmodal");
          eliminarMuestraModal.classList.remove("hidemodal");
        }
      }
    }
  });
}

if (muestras) {
  muestras.addEventListener("click", (event) => {
    if (event.target.nodeName == "I" || event.target.classList.contains("fa-file-invoice")) {
      let id = event.target.value || event.target.getAttribute("value");
      if (id) detailMuestraDetalle(id);
    }
    // Para las muestras dentro del detalle (sub-items)
    if (event.target.classList.contains("fa-file-pen")) {
      let id = event.target.value || event.target.getAttribute("value");
      if (id) {
        muestraId = id;
        cargarMuestraTuboUpdateModal();
      }
    }
  });
}

if (muestra__img) {
  muestra__img.addEventListener("click", async (event) => {
    if (event.target.nodeName === "IMG") {
      visor__img.src = event.target.src;
      imageId = event.target.id;
    }
  });
}

if (btnAniadirImagen) {
  btnAniadirImagen.addEventListener("click", aniadirImagenMuestraTubo);
}

if (qrMuestraModal) {
  qrMuestraModal.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      consultarMuestraTuboQR(inputmuestra__qr.value);
      inputmuestra__qr.value = "";
    }
  });
}

if (qrConsultaModal) {
  qrConsultaModal.addEventListener("show.bs.modal", () => {
    input__consultarqr.style.display = "none";
    input__consultarqr.focus();
  });

  qrConsultaModal.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      consultarMuestraTuboQR(input__consultarqr.value);
      mimodal.hide();
      input__consultarqr.value = "";
    }
  });
}

if (btn__imprimrqr) btn__imprimrqr.addEventListener("click", () => imprimirQR("tubo"));
if (btn__imprimirqrmuestra) btn__imprimirqrmuestra.addEventListener("click", () => imprimirQR("muestra"));
if (btnborrarmuestra) {
  btnborrarmuestra.addEventListener("click", () => {
    if (eliminarMuestraDetalleModal) {
      eliminarMuestraDetalleModal.classList.add("showmodal");
      eliminarMuestraDetalleModal.classList.remove("hidemodal");
    }
  });
}

const btnborrartubo = document.getElementById("btnborrartubo");
if (btnborrartubo) btnborrartubo.addEventListener("click", borrarMuestraTuboDetalle);

if (btnborrarimagenmuestra) btnborrarimagenmuestra.addEventListener("click", borrarImagenMuestraTubo);

const guardarInformeMedico = async () => {
  if (!currentMuestraId) {
    alert("Por favor, selecciona una muestra primero.");
    return;
  }

  const payload = {
    informe_descripcion: muestra__informe_descripcion.value,
    informe_fecha: muestra__informe_fecha.value,
    informe_tincion: muestra__informe_tincion.value,
    informe_observaciones: muestra__informe_observaciones.value,
  };

  try {
    const res = await fetch(`/api/tubos/${currentMuestraId}/actualizar_informe/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Informe actualizado correctamente");
    } else {
      alert("Error al actualizar el informe");
    }
  } catch (error) {
    console.error("Error al guardar el informe:", error);
    alert("Error al guardar el informe de resultados.");
  }
};

if (btnGuardarInforme) btnGuardarInforme.addEventListener("click", guardarInformeMedico);

const sectionMuestras = document.getElementById("sectionMuestras");
const sectionInforme = document.getElementById("sectionInforme");
const btnToggleInforme = document.getElementById("btnToggleInforme");
const btnToggleTubos = document.getElementById("btnToggleTubos"); // Match HTML

if (btnToggleInforme && sectionMuestras && sectionInforme) {
  btnToggleInforme.addEventListener("click", () => {
    sectionMuestras.classList.add("d-none");
    sectionInforme.classList.remove("d-none");
  });
}

if (btnToggleTubos && sectionMuestras && sectionInforme) {
  btnToggleTubos.addEventListener("click", () => {
    sectionInforme.classList.add("d-none");
    sectionMuestras.classList.remove("d-none");
  });
}
