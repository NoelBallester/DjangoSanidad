const inputCassete = document.getElementById("inputCassete");
const token = sessionStorage.getItem("token");

const casettes = document.getElementById("casettes");
const muestras = document.getElementById("muestras");
const organos = document.getElementById("organos");
const numMuestra = document.getElementById("numMuestra");

// Botón Modal modificar datos Usuario
const btnformmodificarUser = document.getElementById("btnformmodificarUser");
const modalupdateUser = document.getElementById("modalupdateUser");
const btnformcerrarmodificarUser = document.getElementById(
  "btnformcerrarmodificarUser"
);

const inputUpdateNombreUser = document.getElementById("inputUpdateNombreUser");
const inputUpdateApellidosUser = document.getElementById(
  "inputUpdateApellidosUser"
);
const inputUpdateCorreoUser = document.getElementById("inputUpdateCorreoUser");
const inputUpdatePass1User = document.getElementById("inputUpdatePass1User");
const inputUpdatePass2User = document.getElementById("inputUpdatePass2User");
const inputUpdateCentroUser = document.getElementById("inputUpdateCentroUser");

const btnborrar = document.getElementById("btnborrar");
const modalNuevoMuestra = document.getElementById("modalNuevoMuestra");
const btnNuevoMuestra = document.getElementById("btnNuevoMuestra");
const btnformmodificarmuestra = document.getElementById(
  "btnformmodificarmuestra"
);
const btnCerrarNuevoMuestra = document.getElementById("btnCerrarNuevoMuestra");
const btnCerrarModificarMuestra = document.getElementById(
  "btnCerrarModificarMuestra"
);
const btnmodificar = document.getElementById("btnmodificar");
const formNuevoMuestra = document.getElementById("formNuevoMuestra");
const formNuevoDetalle = document.getElementById("formNuevoDetalle");

const muestraDescripcion = document.getElementById("muestra__descripcion");
const muestraOrgano = document.getElementById("muestra__organo");
const muestraMuestra = document.getElementById("muestra__muestra");
const muestraFecha = document.getElementById("muestra__fecha");
const muestraCaracteristicas = document.getElementById(
  "muestra__caracteristicas"
);
const muestraObservaciones = document.getElementById("muestra__observaciones");

const muestraInformeDescripcion = document.getElementById("muestra__informe_descripcion");
const muestraInformeFecha = document.getElementById("muestra__informe_fecha");
const muestraInformeTincion = document.getElementById("muestra__informe_tincion");
const muestraInformeObservaciones = document.getElementById("muestra__informe_observaciones");
const muestraInformeImagen = document.getElementById("muestra__informe_imagen");
const btnGuardarInforme = document.getElementById("btnGuardarInforme");
let currentMuestraId = null;

const muestraImagen = document.getElementById("muestra__imagen");
const eliminarMuestraModal = document.getElementById("eliminarMuestraModal");

// Detalle Muestra Principal
const btn__imprimrqr = document.getElementById("btn__imprimirqr");

// Modal qr
const imgcassette__qr = document.getElementById("imgcassette__qr");
const inputcassette__qr = document.getElementById("inputcassette__qr");

// Todas las muestras
const btnTodosMuestras = document.getElementById("btnTodosMuestras");

// Nueva Muestra Principal
const inputFecha = document.getElementById("inputFecha");
const inputNumMuestra = document.getElementById("inputNumMuestra");
const inputDescripcion = document.getElementById("inputDescripcion");
const inputClinica = document.getElementById("inputClinica");
const inputCaracteristicas = document.getElementById("inputCaracteristicas");
const inputObservaciones = document.getElementById("inputObservaciones");
const inputMicroscopia = document.getElementById("inputMicroscopia");
const inputDiagnostico = document.getElementById("inputDiagnostico");
const inputPatologo = document.getElementById("inputPatologo");
const inputSelect = document.getElementById("inputSelect");

// Modificar Muestra Principal
const modalModificarMuestra = document.getElementById("modalModificarMuestra");
const formModificarMuestra = document.getElementById("formModificarMuestra");
const inputFechaUpdate = document.getElementById("inputFechaUpdate");

const inputDescripcionUpdate = document.getElementById(
  "inputDescripcionUpdate"
);
const inputTuboUpdate = document.getElementById("inputTuboUpdate");
const inputClinicaUpdate = document.getElementById("inputClinicaUpdate");
const inputCaracteristicasUpdate = document.getElementById(
  "inputCaracteristicasUpdate"
);
const inputObservacionesUpdate = document.getElementById(
  "inputObservacionesUpdate"
);
const inputMicroscopiaUpdate = document.getElementById("inputMicroscopiaUpdate");
const inputDiagnosticoUpdate = document.getElementById("inputDiagnosticoUpdate");
const inputPatologoUpdate = document.getElementById("inputPatologoUpdate");
const inputSelectUpdate = document.getElementById("inputSelectUpdate");

// Crear un detalle (sub-muestra)
const btnNuevoDetalle = document.getElementById("btnNuevoDetalle");
const btnCerrarNuevoDetalle = document.getElementById("btnCerrarNuevoDetalle");
const modalNuevoDetalle = document.getElementById("modalNuevoDetalle");

// Nuevo Detalle (sub-muestra)
const inputdescripcionTubo = document.getElementById("inputdescripcionTubo");
const inputFechaTubo = document.getElementById("inputFechaTubo");
const selectTincionTubo = document.getElementById("selectTincionTubo");
const inputObservacionesTubo = document.getElementById("inputObservacionesTubo");
const inputImagenesTubo = document.getElementById("inputImagenesTubo");

// Detalle sub-muestra (modal ver)
const modal_muestra__descripcion = document.getElementById("modal_muestra__descripcion");
const modal_muestra__fecha = document.getElementById("modal_muestra__fecha");
const modal_muestra__observaciones = document.getElementById("modal_muestra__observaciones");
const modal_muestra__tincion = document.getElementById("modal_muestra__tincion");

const muestra__img = document.getElementById("muestra__img");
const modalVerDetalle = document.getElementById("modalVerDetalle");
const btnCerrarVerDetalle = document.getElementById("btnCerrarVerDetalle");

// Modificar sub-muestra
const modalmodificarTubo = document.getElementById("modalmodificarTubo");
const formModificarTubo = document.getElementById("modificarTubo");
const btnModificarDetalle = document.getElementById("btnModificarDetalle");
const btnformcerrarmodificarTubo = document.getElementById("btnformcerrarmodificarTubo");

const inputmodificardescripcionTubo = document.getElementById("inputmodificardescripcionTubo");
const inputmodificarfechaTubo = document.getElementById("inputmodificarfechaTubo");
const selectmodificartincionTubo = document.getElementById("selectmodificartincionTubo");
const inputmodificarobservacionesTubo = document.getElementById("inputmodificarobservacionesTubo");

// Borrar sub-muestra
const btnborrarmuestra = document.getElementById("btnborrarmuestra");
// Borrar Imagen sub-muestra
const btnborrarimagenmuestra = document.getElementById("btnborrarimagenmuestra");

const qrMuestraModal = document.getElementById("qrMuestraModal");
const imgmuestra__qr = document.getElementById("imgmuestra__qr");
const inputmuestra__qr = document.getElementById("inputmuestra__qr");
const btn__imprimirqrmuestra = document.getElementById("btn__imprimirqrmuestra");

// Consultar por código qr
const btn__consultarqr = document.getElementById("btn__consultarqr");
const input__consultarqr = document.getElementById("input__consultarqr");
const qrConsultaModal = document.getElementById("qrConsultaModal");

// Fecha inicio fin para consultas
const fechainicio = document.getElementById("fechainicio");
const fechafin = document.getElementById("fechafin");

// Alert error
const alertmuestra = document.getElementById("alertmuestra");
const alertfecha = document.getElementById("alertfecha");
const alertfecha_text = document.getElementById("alertfecha_text");

// id de la muestra principal de trabajo
let muestraId = null;
// qr cassete
let cassetteqr = null;
// id sub-muestra
let subMuestraId = null;
// id imagen seleccionada
let imageId = null;

const body = document.getElementById("body");
const visor__img = document.getElementById("visor__img");
const imagenMuestraModal = document.getElementById("imagenMuestraModal");

// Carga Muestras al inicio
const cargarMuestrasIndex = async () => {
  return await fetch("/api/tubos/index/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Crear muestra principal
const crearMuestra = async (event) => {
  event.preventDefault();

  try {
    const tecnicoId = sessionStorage.getItem("user") || 1;

    const response = await fetch("/api/tubos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tubo: inputNumMuestra.value,
        fecha: inputFecha.value,
        descripcion: inputDescripcion.value,
        informacion_clinica: inputClinica ? inputClinica.value : "",
        caracteristicas: inputCaracteristicas.value,
        observaciones: inputObservaciones.value,
        descripcion_microscopica: inputMicroscopia ? inputMicroscopia.value : "",
        diagnostico_final: inputDiagnostico ? inputDiagnostico.value : "",
        patologo_responsable: inputPatologo ? inputPatologo.value : "",
        tecnico: tecnicoId,
        organo: inputSelect.value,
      }),
    });

    if (response.ok) {
      location.href = "bioquimica.html";
    } else {
      const error = await response.json();
      console.error("Error al crear muestra:", error);
      alert("Error al crear la muestra: " + JSON.stringify(error));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al crear la muestra");
  }
};

// Carga todas las muestras desde el botón
const cargarTodasMuestras = async () => {
  return await fetch("/api/tubos/todos/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Carga el detalle de la muestra seleccionada
const cargarMuestra = async (id) => {
  return await fetch(`/api/tubos/${id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Obtener muestras por organo (tipo de muestra)
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

// Obtener muestras por número de muestra
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

// Obtener muestras por fecha
const obtenerMuestrasFecha = async (fecha) => {
  const response = await fetch(`/api/tubos/fecha/${fecha}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  return await response.json();
};

// Obtener muestras por rango de fechas
const obtenerMuestrasFechaRango = async (fechainicio, fechafin) => {
  const response = await fetch(`/api/tubos/rango_fechas/?inicio=${fechainicio}&fin=${fechafin}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  return await response.json();
};

// Borrar una muestra principal
const borrarMuestra = () => {
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

// Consulta muestras en una fecha
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

// Consulta muestras entre dos fechas
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

// Muestra los datos de las muestras por pantalla
const imprimirCasettes = (respuesta, rebuildDropdown = true) => {
  casettes.innerHTML = "";
  if (rebuildDropdown) {
    numMuestra.innerHTML =
      "<option disabled selected>Número Muestra</option>";
  }

  let fragmento = document.createDocumentFragment();
  let fragmentselect = document.createDocumentFragment();
  if (respuesta.length > 0) {
    respuesta.map((item) => {
      // Para cargar los números de muestra
      let option = document.createElement("OPTION");
      option.textContent = item.tubo;
      fragmentselect.appendChild(option);

      // Para mostrar muestras
      let tr = document.createElement("tr");
      tr.classList.add("table__row");

      // Número de muestra
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
      btndetalle.value = item.id_tubo;
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
    tr.textContent = "No se ha encontrado niguna Muestra";
    fragmento.appendChild(tr);
  }

  casettes.appendChild(fragmento);
  if (rebuildDropdown) {
    numMuestra.appendChild(fragmentselect);
  }
};

// Peticiones de muestra y sub-muestras al seleccionar una muestra
const detalleMuestra = async (event) => {
  if (event.target.classList.contains("fa-file-invoice")) {
    alertmuestra.classList.add("ocultar");
    muestraId = event.target.value;

    let respuesta = await cargarMuestra(muestraId);
    imprimirDetalleMuestra(respuesta);

    respuesta = await cargarSubMuestras(muestraId);
    imprimirSubMuestras(respuesta);
  }

  if (event.target.classList.contains("fa-trash-can")) {
    console.log(event.target.data - value);
  }
};

// Muestra el detalle de una muestra
const imprimirDetalleMuestra = (respuesta) => {
  muestraDescripcion.textContent = respuesta.descripcion.substring(0, 50);
  muestraOrgano.textContent = respuesta.organo;
  muestraMuestra.textContent = respuesta.tubo;

  // Formato Fecha
  let nuevafecha = respuesta.fecha;
  muestraFecha.textContent =
    nuevafecha.substring(8) +
    "-" +
    nuevafecha.substring(5, 7) +
    "-" +
    nuevafecha.substring(0, 4);

  muestraCaracteristicas.textContent = respuesta.caracteristicas;
  muestraObservaciones.textContent = respuesta.observaciones;

  muestraInformeDescripcion.value = respuesta.informe_descripcion || "";
  muestraInformeFecha.value = respuesta.informe_fecha || "";
  muestraInformeTincion.value = respuesta.informe_tincion || "";
  muestraInformeObservaciones.value = respuesta.informe_observaciones || "";
  currentMuestraId = respuesta.id_tubo;

  // generamos el codigo QR
  if (window.QRious) {
    new QRious({
      element: document.querySelector("#imgcassette__qr"),
      value: respuesta.qr_casette,
      size: 70,
      backgroundAlpha: 0,
      foreground: "#4ca0cc",
      level: "H",
    });
  }
};

// Saca por impresora codigo QR
const imprimirQR = (elemento) => {
  let qrimprimir;
  if (elemento == "cassette") {
    qrimprimir = imgcassette__qr.src;
  } else {
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

// Cargamos el modal datos muestra principal modificar
const cargarMuestraUpdateModal = async (event) => {
  if (!muestraId) {
    if (event) event.preventDefault();
    alertmuestra.classList.remove("ocultar");
  } else {
    let muestra = await cargarMuestra(muestraId);
    inputTuboUpdate.value = muestra.tubo;
    inputDescripcionUpdate.value = muestra.descripcion;
    inputClinicaUpdate.value = muestra.informacion_clinica || "";
    inputFechaUpdate.value = muestra.fecha;
    inputCaracteristicasUpdate.value = muestra.caracteristicas;
    inputObservacionesUpdate.value = muestra.observaciones;
    inputMicroscopiaUpdate.value = muestra.descripcion_microscopica || "";
    inputDiagnosticoUpdate.value = muestra.diagnostico_final || "";
    inputPatologoUpdate.value = muestra.patologo_responsable || "";
    inputSelectUpdate.value = muestra.organo;
  }
};

const modificarMuestraUpdate = async (event) => {
  event.preventDefault();
  await fetch(`/api/tubos/${muestraId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tubo: inputTuboUpdate.value,
      fecha: inputFechaUpdate.value,
      descripcion: inputDescripcionUpdate.value,
      informacion_clinica: inputClinicaUpdate ? inputClinicaUpdate.value : "",
      caracteristicas: inputCaracteristicasUpdate.value,
      observaciones: inputObservacionesUpdate.value,
      descripcion_microscopica: inputMicroscopiaUpdate ? inputMicroscopiaUpdate.value : "",
      diagnostico_final: inputDiagnosticoUpdate ? inputDiagnosticoUpdate.value : "",
      patologo_responsable: inputPatologoUpdate ? inputPatologoUpdate.value : "",
      tecnico: sessionStorage.getItem("user"),
      organo: inputSelectUpdate.value,
    }),
  })
    .then((response) => {
      if (response.ok) {
        location.href = "bioquimica.html";
      }
    })
    .catch((error) => console.log(error));
};

// SUB-MUESTRAS (detalles de procesamiento)

// Carga Sub-Muestras de una muestra principal
const cargarSubMuestras = async (tuboId) => {
  return await fetch(`/api/muestrastubo/tubo/${tuboId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
};

// Crear nueva sub-muestra
const crearSubMuestra = async (event) => {
  event.preventDefault();

  let newMuestra = new FormData();
  newMuestra.append("descripcion", inputdescripcionTubo.value);
  newMuestra.append("fecha", inputFechaTubo.value);
  newMuestra.append("observaciones", inputObservacionesTubo.value);
  newMuestra.append("tincion", selectTincionTubo.value);
  newMuestra.append("tubo", muestraId);

  await fetch("/api/muestrastubo/", {
    method: "POST",
    body: newMuestra,
  })
    .then(async () => {
      modalNuevoDetalle.classList.remove("showmodal");
      modalNuevoDetalle.classList.add("hidemodal");
      limpiarModalSubMuestra();
      imprimirSubMuestras(await cargarSubMuestras(muestraId));
    })
    .catch((error) =>
      console.log("No se esta ejecutando correctamente la inserción" + error)
    );
};

const limpiarModalSubMuestra = () => {
  inputdescripcionTubo.value = "";
  inputFechaTubo.value = "";
  inputObservacionesTubo.value = "";
  selectTincionTubo.value = "";
  if (inputImagenesTubo) inputImagenesTubo.value = "";
};

// Cargamos el modal datos sub-muestra a modificar
const cargarSubMuestraUpdateModal = async (event) => {
  if (!muestraId) {
    if (event) event.preventDefault();
    alertmuestra.classList.remove("ocultar");
  } else {
    const response = await fetch(`/api/muestrastubo/${subMuestraId}/`, {
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
  }
};

// Modificar sub-muestra
const modificarSubMuestraUpdate = async (event) => {
  event.preventDefault();

  await fetch(`/api/muestrastubo/${subMuestraId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fecha: inputmodificarfechaTubo.value,
      descripcion: inputmodificardescripcionTubo.value,
      observaciones: inputmodificarobservacionesTubo.value,
      tincion: selectmodificartincionTubo.value,
    }),
  })
    .then(async () => {
      // Actualizamos los datos del detalle de la sub-muestra
      modal_muestra__descripcion.textContent = inputmodificardescripcionTubo.value;
      let nuevafecha = inputmodificarfechaTubo.value;
      modal_muestra__fecha.textContent =
        nuevafecha.substring(8) +
        "-" +
        nuevafecha.substring(5, 7) +
        "-" +
        nuevafecha.substring(0, 4);

      modal_muestra__observaciones.textContent =
        inputmodificarobservacionesTubo.value;
      modal_muestra__tincion.textContent = selectmodificartincionTubo.value;

      // Mostramos las sub-muestras para que se actualicen los cambios
      let respuesta = await cargarSubMuestras(muestraId);
      imprimirSubMuestras(respuesta);
    })

    .catch((error) => console.log(error));

  // Ocultamos el modal de modificación
  modalmodificarTubo.classList.remove("showmodal");
};

// Imprimir sub-muestras
const imprimirSubMuestras = (respuesta) => {
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
      let nuevafecha = muestra.fecha;
      fecha.textContent =
        nuevafecha.substring(8) +
        "-" +
        nuevafecha.substring(5, 7) +
        "-" +
        nuevafecha.substring(0, 4);

      let tincion = document.createElement("td");
      tincion.textContent = muestra.tincion;

      let btn = document.createElement("td");
      let btndetalle = document.createElement("I");
      btndetalle.className =
        "d-inline-block muestra__icon fa-solid fa-file-invoice muestra__icon--infomuestra";
      btndetalle.value = muestra.id_muestra;
      btndetalle.title = "Detalle Muestra";
      btn.appendChild(btndetalle);

      tr.appendChild(fecha);
      tr.appendChild(descripcion);
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

// Obtenemos una sub-muestra
const cargarSubMuestra = async (muestraid) => {
  const response = await fetch(`/api/muestrastubo/${muestraid}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

// Obtenemos las imagenes de una sub-muestra
const obtenerImagenesSubMuestra = async (muestraid) => {
  const response = await fetch(`/api/imagenestubo/muestra/${muestraid}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let imagenes = await response.json();
  return imagenes;
};

// Rellenamos los datos texto de la sub-muestra
const rellenarDatosSubMuestra = async (muestra) => {
  modal_muestra__descripcion.textContent = muestra.descripcion.substring(0, 60);
  modal_muestra__descripcion.title = muestra.descripcion;

  let nuevafecha = muestra.fecha;
  modal_muestra__fecha.textContent =
    nuevafecha.substring(8) +
    "-" +
    nuevafecha.substring(5, 7) +
    "-" +
    nuevafecha.substring(0, 4);

  modal_muestra__observaciones.textContent = muestra.observaciones;
  modal_muestra__tincion.textContent = muestra.tincion;
};

const mostrarImagenesSubMuestra = async (subMuestraIdParam) => {
  muestra__img.innerHTML = "";
  let imagenes = await obtenerImagenesSubMuestra(subMuestraIdParam);
  // Imagen de sustitución si no hay imagenes para una sub-muestra
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

  let newdiv = document.createElement("DIV");
  newdiv.classList.add(
    "container__aniadir",
    "d-flex",
    "align-items-center",
    "mt-1",
    "mx-2",
    "blue__color",
    "fs-1"
  );
  newdiv.innerHTML = '<i class="fa-solid fa-circle-plus"></i>';
  newdiv.title = "Añadir imagen";

  muestra__img.appendChild(newdiv);
};

const borrarSubMuestra = async () => {
  fetch(`/api/muestrastubo/${subMuestraId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async () => {
      modalVerDetalle.classList.remove("showmodal");
      // Mostramos las sub-muestras
      let muestras_list = await cargarSubMuestras(muestraId);
      imprimirSubMuestras(muestras_list);
    })
    .catch((error) => console.log(error));
};

const borrarImagenSubMuestra = async () => {
  if (imageId != undefined) {
    fetch(`/api/imagenestubo/${imageId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      mostrarImagenesSubMuestra(subMuestraId);
    });
  }
};

// Mostramos Detalle sub-muestra seleccionada
const detailSubMuestra = async (muestraid) => {
  // Cargamos la sub-muestra
  let muestra = await cargarSubMuestra(muestraid);
  subMuestraId = muestra.id_muestra;
  rellenarDatosSubMuestra(muestra);

  // generamos el codigo QR
  if (window.QRious) {
    new QRious({
      element: imgmuestra__qr,
      value: muestra.qr_muestra,
      size: 70,
      backgroundAlpha: 0,
      foreground: "#4ca0cc",
      level: "H",
    });
  }

  // Mostramos las imagenes de la sub-muestra seleccionada
  mostrarImagenesSubMuestra(subMuestraId);

  modalVerDetalle.classList.add("showmodal");
  modalVerDetalle.classList.remove("hidemodal");
};

// Añadir una imagen a la sub-muestra
const aniadirImagenSubMuestra = async () => {
  try {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: "Imágenes",
          accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] },
        },
      ],
    });
    const file = await fileHandle.getFile();

    let newImage = new FormData();
    newImage.append("imagen", file);
    newImage.append("muestratubo", subMuestraId);

    fetch("/api/imagenestubo/", {
      method: "POST",
      body: newImage,
    }).then(async () => {
      await mostrarImagenesSubMuestra(subMuestraId);
    });
  } catch (err) {
    console.error(err);
  }
};

const consultarMuestraQR = async (qr) => {
  const response = await fetch(`/api/tubos/qr/${qr}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  let muestras_data = await response.json();

  imprimirCasettes(muestras_data);
  if (muestras_data.length > 0) {
    let item = muestras_data[0];
    imprimirDetalleMuestra(item);
    muestraId = item.id_tubo;
    let subMuestras = await cargarSubMuestras(muestraId);
    imprimirSubMuestras(subMuestras);
  }
};

// Cargamos el modal datos user modificar
const cargarUserUpdateModal = async (event) => {
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

// ==================== EVENTOS ====================

// Consulta Muestras Recientes
document.addEventListener("DOMContentLoaded", async () => {
  body.style.display = "block";
  const respuesta = await cargarMuestrasIndex();
  imprimirCasettes(respuesta);
  let fechaActual = new Date().toISOString().split("T")[0];
  if (inputFecha) inputFecha.setAttribute("min", fechaActual);
  if (inputFechaUpdate) inputFechaUpdate.setAttribute("min", fechaActual);
  if (inputFechaTubo) inputFechaTubo.setAttribute("min", fechaActual);
});

// Consulta por Organo (Tipo de Muestra)
organos.addEventListener("change", async () => {
  const respuesta = await cargarPorOrgano();
  imprimirCasettes(respuesta, false);
});

// Consulta por número de Muestra
numMuestra.addEventListener("change", async () => {
  const respuesta = await cargarPorNumero();
  imprimirCasettes(respuesta, false);
});

// Consulta Detalle Muestra y Sub-Muestras
casettes.addEventListener("click", detalleMuestra);

// Consulta por fecha
fechainicio.addEventListener("change", consultaFechaInicio);
fechafin.addEventListener("change", consultaFechaFin);

// Todas las muestras
btnTodosMuestras.addEventListener("click", async () => {
  const respuesta = await cargarTodasMuestras();
  imprimirCasettes(respuesta);
});

// Crear Muestra Principal
btnNuevoMuestra.addEventListener("click", () => {
  if (!modalNuevoMuestra.classList.contains("showmodal")) {
    modalNuevoMuestra.classList.add("showmodal");
    modalNuevoMuestra.classList.remove("hidemodal");
  }
});

btnCerrarNuevoMuestra.addEventListener("click", () => {
  if (!modalNuevoMuestra.classList.contains("hidemodal")) {
    modalNuevoMuestra.classList.add("hidemodal");
    modalNuevoMuestra.classList.remove("showmodal");
  }
});

formNuevoMuestra.addEventListener("submit", crearMuestra);

// Modificar Muestra Principal
btnformmodificarmuestra.addEventListener("click", () => {
  if (!muestraId) {
    alertmuestra.classList.remove("ocultar");
  } else {
    cargarMuestraUpdateModal();
    if (!modalModificarMuestra.classList.contains("showmodal")) {
      modalModificarMuestra.classList.add("showmodal");
      modalModificarMuestra.classList.remove("hidemodal");
    }
  }
});

btnCerrarModificarMuestra.addEventListener("click", () => {
  if (!modalModificarMuestra.classList.contains("hidemodal")) {
    modalModificarMuestra.classList.add("hidemodal");
    modalModificarMuestra.classList.remove("showmodal");
  }
});

formModificarMuestra.addEventListener("submit", modificarMuestraUpdate);

// Borrar Muestra Principal
eliminarMuestraModal.addEventListener("show.bs.modal", (event) => {
  if (!muestraId) {
    event.preventDefault();
    alertmuestra.classList.remove("ocultar");
  }
});

btnborrar.addEventListener("click", borrarMuestra);

// mostrar modal imagen muestra
if (imagenMuestraModal) {
  imagenMuestraModal.addEventListener("show.bs.modal", (event) => {
    if (!muestraId) {
      event.preventDefault();
      alertmuestra.classList.remove("ocultar");
    }
  });
}

// mostrar modal qr sub-muestra
if (qrMuestraModal) {
  qrMuestraModal.addEventListener("show.bs.modal", (event) => {
    if (inputmuestra__qr) {
      inputmuestra__qr.style.display = "none";
      inputmuestra__qr.focus();
    }
  });
}

// Crear Sub-Muestra (Detalle)
btnNuevoDetalle.addEventListener("click", () => {
  if (!muestraId) {
    alertmuestra.classList.remove("ocultar");
  } else {
    if (!modalNuevoDetalle.classList.contains("showmodal")) {
      modalNuevoDetalle.classList.add("showmodal");
      modalNuevoDetalle.classList.remove("hidemodal");
    }
  }
});

btnCerrarNuevoDetalle.addEventListener("click", () => {
  if (!modalNuevoDetalle.classList.contains("hidemodal")) {
    modalNuevoDetalle.classList.add("hidemodal");
    modalNuevoDetalle.classList.remove("showmodal");
  }
});

if (btnCerrarVerDetalle) {
  btnCerrarVerDetalle.addEventListener("click", () => {
    if (!modalVerDetalle.classList.contains("hidemodal")) {
      modalVerDetalle.classList.add("hidemodal");
      modalVerDetalle.classList.remove("showmodal");
    }
    muestra__img.innerHTML = "";
  });
}

formNuevoDetalle.addEventListener("submit", crearSubMuestra);

// Modificar Sub-Muestra
if (btnModificarDetalle) {
  btnModificarDetalle.addEventListener("click", () => {
    if (!muestraId) {
      alertmuestra.classList.remove("ocultar");
    } else {
      cargarSubMuestraUpdateModal();
      if (!modalmodificarTubo.classList.contains("showmodal")) {
        modalmodificarTubo.classList.add("showmodal");
        modalmodificarTubo.classList.remove("hidemodal");
      }
    }
  });
}

if (btnformcerrarmodificarTubo) {
  btnformcerrarmodificarTubo.addEventListener("click", () => {
    if (!modalmodificarTubo.classList.contains("hidemodal")) {
      modalmodificarTubo.classList.add("hidemodal");
      modalmodificarTubo.classList.remove("showmodal");
    }
  });
}

if (formModificarTubo) {
  formModificarTubo.addEventListener("submit", modificarSubMuestraUpdate);
}

// Consulta Detalle Sub-Muestras
muestras.addEventListener("click", (event) => {
  if (event.target.nodeName == "I") {
    detailSubMuestra(event.target.value);
  }
});

// Visualizamos la imagen seleccionada
muestra__img.addEventListener("click", async (event) => {
  if (event.target.nodeName === "IMG") {
    visor__img.src = event.target.src;
    imageId = event.target.id;
  }
  if (event.target.nodeName === "I") aniadirImagenSubMuestra();
});

if (inputcassette__qr) inputcassette__qr.value = "";
if (input__consultarqr) input__consultarqr.value = "";

// Lectura codigo qr
if (qrConsultaModal) {
  qrConsultaModal.addEventListener("show.bs.modal", () => {
    if (input__consultarqr) {
      input__consultarqr.style.display = "none";
      input__consultarqr.focus();
    }
  });

  qrConsultaModal.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      let tipo = input__consultarqr.value.substring(0, 5);
      if (tipo === "--c--" || tipo === "--m--") {
        consultarMuestraQR(input__consultarqr.value);
      }
      let mimodal = bootstrap.Modal.getInstance(qrConsultaModal);
      if (mimodal) mimodal.hide();
      input__consultarqr.value = "";
    } else {
      input__consultarqr.value += event.key;
    }
  });
}

if (btn__imprimrqr) btn__imprimrqr.addEventListener("click", () => imprimirQR("cassette"));
if (btn__imprimirqrmuestra) btn__imprimirqrmuestra.addEventListener("click", () => imprimirQR("muestra"));

if (btnborrarmuestra) btnborrarmuestra.addEventListener("click", borrarSubMuestra);
if (btnborrarimagenmuestra) btnborrarimagenmuestra.addEventListener("click", borrarImagenSubMuestra);

// Guardar solo el informe de resultados
const guardarInformeMedico = async () => {
  if (!currentMuestraId) {
    alert("Por favor, selecciona una muestra primero.");
    return;
  }

  const datosReporte = {
    accion: "actualizarInformeMedico",
    muestraId: currentMuestraId,
    descripcion: muestraInformeDescripcion.value,
    fecha: muestraInformeFecha.value,
    tincion: muestraInformeTincion.value,
    observaciones: muestraInformeObservaciones.value,
    imagen: "",
  };

  if (muestraInformeImagen && muestraInformeImagen.files && muestraInformeImagen.files.length > 0) {
    const imgReader = new FileReader();
    imgReader.readAsDataURL(muestraInformeImagen.files[0]);
    imgReader.onload = async function () {
      datosReporte.imagen = imgReader.result.split(',')[1];
      guardarDatosReporteMuestra(datosReporte);
    };
    return;
  }
  guardarDatosReporteMuestra(datosReporte);
};

const guardarDatosReporteMuestra = async (datosReporte) => {
  try {
    const res = await fetch(`/api/tubos/${currentMuestraId}/actualizar_informe/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosReporte),
    });

    const data = await res.json();
    alert("Informe actualizado correctamente");
  } catch (error) {
    console.error("Error al guardar el informe:", error);
    alert("Error al guardar el informe de resultados.");
  }
};

if (btnGuardarInforme) {
  btnGuardarInforme.addEventListener("click", guardarInformeMedico);
}

// Toggle section views
const sectionMuestras = document.getElementById("sectionMuestras");
const sectionInforme = document.getElementById("sectionInforme");
const btnToggleInforme = document.getElementById("btnToggleInforme");
const btnToggleTubos = document.getElementById("btnToggleTubos");

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
