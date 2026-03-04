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
const modalnuevoMuestra = document.getElementById("modalnuevoMuestra");
const btnformnuevomuestra = document.getElementById("btnformnuevomuestra");
const btnformmodificarmuestra = document.getElementById(
  "btnformmodificarmuestra"
);
const btnformcerrarnuevoMuestra = document.getElementById(
  "btnformcerrarnuevoMuestra"
);
const btnformcerrarmodificarMuestra = document.getElementById(
  "btnformcerrarmodificarMuestra"
);
const btnmodificar = document.getElementById("btnmodificar");
const nuevoMuestra = document.getElementById("nuevoMuestra");
const nuevaMuestra = document.getElementById("nuevaMuestra");

const muestraDescripcion = document.getElementById("muestra__descripcion");
const muestraOrgano = document.getElementById("muestra__organo");
const muestraMuestra = document.getElementById("muestra__muestra");
const muestraFecha = document.getElementById("muestra__fecha");
const muestraCaracteristicas = document.getElementById(
  "muestra__caracteristicas"
);
const muestraObservaciones = document.getElementById(
  "muestra__observaciones"
);
const muestraInformeDescripcion = document.getElementById("muestra__informe_descripcion");
const muestraInformeFecha = document.getElementById("muestra__informe_fecha");
const muestraInformeTincion = document.getElementById("muestra__informe_tincion");
const muestraInformeObservaciones = document.getElementById("muestra__informe_observaciones");
const muestraInformeImagen = document.getElementById("muestra__informe_imagen");

const muestraImagen = document.getElementById("muestra__imagen");
const eliminarMuestraModal = document.getElementById("eliminarMuestraModal");

// Detalle Muestra
let currentMuestraId = null;
const btnGuardarInforme = document.getElementById("btnGuardarInforme");
const btn__imprimrqr = document.getElementById("btn__imprimirqr");

// Modal qr
const imgmuestra__qr = document.getElementById("imgmuestra__qr");
const inputmuestra__qr = document.getElementById("inputmuestra__qr");

// Todos los bioquimica
const todosMuestras = document.getElementById("todosMuestras");

// Nuevo Cassete
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
const inputImagenes = document.getElementById("inputImagenes");

// Modificar Cassete
const modalupdateMuestra = document.getElementById("modalupdateMuestra");
const modificarMuestra = document.getElementById("modificarMuestra");
const btnmodificarmuestra = document.getElementById("btnmodificarmuestra");
const inputFechaUpdate = document.getElementById("inputFechaUpdate");
const inputImagenesUpdate = document.getElementById("inputImagenesUpdate");

const inputDescripcionUpdate = document.getElementById(
  "inputDescripcionUpdate"
);
const inputMuestraUpdate = document.getElementById("inputMuestraUpdate");
const inputCaracteristicasUpdate = document.getElementById(
  "inputCaracteristicasUpdate"
);
const inputObservacionesUpdate = document.getElementById(
  "inputObservacionesUpdate"
);
const inputClinicaUpdate = document.getElementById("inputClinicaUpdate");
const inputMicroscopiaUpdate = document.getElementById("inputMicroscopiaUpdate");
const inputDiagnosticoUpdate = document.getElementById("inputDiagnosticoUpdate");
const inputPatologoUpdate = document.getElementById("inputPatologoUpdate");
const inputSelectUpdate = document.getElementById("inputSelectUpdate");

// Crear una muestra
const btnformnuevaMuestra = document.getElementById("btnformnuevaMuestra");
const btnformcerrarnuevaMuestra = document.getElementById(
  "btnformcerrarnuevaMuestra"
);

const modalnuevaMuestra = document.getElementById("modalnuevaMuestra");

// Nueva Muestra
const inputdescripcionMuestra = document.getElementById(
  "inputdescripcionMuestra"
);
const inputFechaMuestra = document.getElementById("inputFechaMuestra");
const selectTincionMuestra = document.getElementById("selectTincionMuestra");
const inputObservacionesMuestra = document.getElementById(
  "inputObservacionesMuestra"
);
const inputImagenesMuestra = document.getElementById("inputImagenesMuestra");

// Detalle Muestra
const muestra__descripcion = document.getElementById("muestra__descripcion");
const muestra__fecha = document.getElementById("muestra__fecha");
const muestra__observaciones = document.getElementById(
  "muestra__observaciones"
);
const muestra__tincion = document.getElementById("muestra__tincion");

const muestra__img = document.getElementById("muestra__img");
const btncerrardetalleMuestra = document.getElementById(
  "btncerrardetalleMuestra"
);

// Modificar Muestra
// Datos para modicar una muestra
const inputmodificardescripcionMuestra = document.getElementById(
  "inputmodificardescripcionMuestra"
);

const inputmodificarfechaMuestra = document.getElementById(
  "inputmodificarfechaMuestra"
);

const selectmodificartincionMuestra = document.getElementById(
  "selectmodificartincionMuestra"
);

const inputmodificarobservacionesMuestra = document.getElementById(
  "inputmodificarobservacionesMuestra"
);
// Borrar Muestra
const btnborrarmuestra = document.getElementById("btnborrarmuestra");

// Borrar Imagen Muestra
const btnborrarimagenmuestra = document.getElementById(
  "btnborrarimagenmuestra"
);

const qrMuestraModal = document.getElementById("qrMuestraModal");
// Consutar por código qr
const btn__consultarqr = document.getElementById("btn__consultarqr");
const input__consultarqr = document.getElementById("input__consultarqr");
const qrConsultaModal = document.getElementById("qrConsultaModal");
let mimodal = new bootstrap.Modal(document.getElementById("qrConsultaModal"));

// Fecha inicio fin para consultas
const fechainicio = document.getElementById("fechainicio");
const fechafin = document.getElementById("fechafin");

// Alert error
const alertmuestra = document.getElementById("alertmuestra");
const alertfecha = document.getElementById("alertfecha");
const alertfecha_text = document.getElementById("alertfecha_text");

// id del cassete de trabajo
let muestraId = null;

// qr cassete
let muestraqr = null;

// id imagene seleccionada
let imageId = null;

const files = document.getElementById("files");

// Carga Muestras al inicio
const cargarMuestrasIndex = async () => {
  return await fetch("/api/tubos/index/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
};

// Crear Muestras
const crearMuestra = (event) => {
  event.preventDefault(); // evita que se envie el formulario y por tanto que se recargue la página

  fetch("/api/tubos/", {
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
  }).then((response) => response.json());
  location.href = "bioquimica.html";
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
  return await fetch(`/api/tubos/por_organo/${organos.value}/`, {
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
  return await fetch(`/api/tubos/por_numero/${numMuestra.value}/`, {
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
  const response = await fetch(`/api/tubos/por_fecha/${fecha}/`, {
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
    respuesta.map((casete) => {
      // Para cargar los números de muestra
      let option = document.createElement("OPTION");
      option.textContent = casete.id_casette;
      fragmentselect.appendChild(option);

      // Para mostrar los bioquimica
      let tr = document.createElement("tr");
      tr.classList.add("table__row");

      // Número de Muestra
      let nmuestra = document.createElement("td");
      nmuestra.textContent = casete.id_casette;

      let fecha = document.createElement("td");
      nuevafecha = casete.fecha;

      fecha.textContent =
        nuevafecha.substring(8) +
        "-" +
        nuevafecha.substring(5, 7) +
        "-" +
        nuevafecha.substring(0, 4);
      let descripcion = document.createElement("td");
      descripcion.textContent = casete.descripcion.substring(0, 50);
      descripcion.title = casete.descripcion;

      let organo = document.createElement("td");
      organo.textContent = casete.organo;

      let btndetalle = document.createElement("I");
      btndetalle.className =
        "d-inline-block muestra__icon fa-solid fa-file-invoice muestra__icon--infomuestra";
      btndetalle.value = casete.id_casette;
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

//Peticiones de Muestra y Muestras al seleccionar un Muestra y llama a
// mostrar bioquimica y mostrar muestras
const detalleMuestra = async (event) => {
  if (event.target.classList.contains("fa-file-invoice")) {
    alertmuestra.classList.add("ocultar");
    muestraId = event.target.value;

    let respuesta = await cargarMuestra(muestraId);
    imprimirDataMuestra(respuesta);

    respuesta = await cargarMuestras(muestraId);
    imprimirMuestras(respuesta);
  }

  if (event.target.classList.contains("fa-trash-can")) {
    console.log(event.target.data - value);
  }
};

// Muestra el detalle de un muestra
const imprimirDataMuestra = (respuesta) => {
  muestraDescripcion.textContent = respuesta.descripcion.substring(0, 50);
  muestraOrgano.textContent = respuesta.organo;
  muestraMuestra.textContent = respuesta.muestra;

  // Formato Fecha
  nuevafecha = respuesta.fecha;
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
  // muestraInformeImagen handling would require image logic depending on how it's sent
  currentMuestraId = respuesta.id_casette;

  // Le paso la imagen al visor de imagenes
  // Si tiene o no imagen
  respuesta.imagen
    ? (muestraImagen.src = `data:image/jpeg;base64,${respuesta.imagen}`)
    : (muestraImagen.src = "./assets/images/no_disponible.jpg");

  inputmuestra__qr.style.display = "none";
  inputmuestra__qr.focus();

  // generamos el codigo QR
  new QRious({
    element: document.querySelector("#imgmuestra__qr"),
    value: respuesta.qr_casette, // La URL o el texto
    size: 70,
    backgroundAlpha: 0, // 0 para fondo transparente
    foreground: "#4ca0cc", // Color del QR
    level: "H", // Puede ser L,M,Q y H (L es el de menor nivel, H el mayor)
  });
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
    inputMuestraUpdate.value = muestra.id_casette;
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
  await fetch("modelo/bioquimica/bioquimica.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accion: "modificarMuestra",

      muestraId: muestraId,

      fecha: inputFechaUpdate.value,
      descripcion: inputDescripcionUpdate.value,
      muestra: inputMuestraUpdate.value,
      caracteristicas: inputCaracteristicasUpdate.value,
      observaciones: inputObservacionesUpdate.value,
      clinica: inputClinicaUpdate.value,
      microscopia: inputMicroscopiaUpdate.value,
      diagnostico: inputDiagnosticoUpdate.value,
      patologo: inputPatologoUpdate.value,
      tecnicoIdTecnico: sessionStorage.getItem("user"),
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

// MUESTRAS

// Carga Muestras de un Tubo
const cargarMuestrasTubo = async (tuboId) => {
  return await fetch(`/api/muestrastubo/por_tubo/${tuboId}/`, {
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
      modalnuevaMuestra.classList.remove("showmodal");
      modalnuevaMuestra.classList.add("hidemodal");
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

// Cargamos el modal datos muestra a modificar
const cargarMuestraTuboUpdateModal = async (event) => { // Renamed from cargarMuestraUpdateModal
  if (!muestraId) {
    event.preventDefault();
    alertmuestra.classList.remove("ocultar");
  } else {
    const response = await fetch(`/api/muestrastubo/${muestraId}/`, { // Updated URL
      method: "GET", // Updated method
      headers: {
        "Content-Type": "application/json",
      },
    });

    let muestra = await response.json();
    inputmodificardescripcionMuestra.value = muestra.descripcion;
    inputmodificarfechaMuestra.value = muestra.fecha;
    selectmodificartincionMuestra.value = muestra.tincion;
    inputmodificarobservacionesMuestra.value = muestra.observaciones;
  }
};

// Modificar muestra de tubo
const modificarMuestraTuboUpdate = async (event) => {
  event.preventDefault();

  await fetch(`/api/muestrastubo/${muestraId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fecha: inputmodificarfechaMuestra.value,
      descripcion: inputmodificardescripcionMuestra.value,
      observaciones: inputmodificarobservacionesMuestra.value,
      tincion: selectmodificartincionMuestra.value,
    }),
  })
    .then(async () => {
      // Actualizamos los datos del detalle de la muestra
      muestra__descripcion.textContent = inputmodificardescripcionMuestra.value;
      nuevafecha = inputmodificarfechaMuestra.value;
      muestra__fecha.textContent =
        nuevafecha.substring(8) +
        "-" +
        nuevafecha.substring(5, 7) +
        "-" +
        nuevafecha.substring(0, 4);

      // muestra__fecha.textContent = inputmodificarfechaMuestra.value;
      muestra__observaciones.textContent =
        inputmodificarobservacionesMuestra.value;
      muestra__tincion.textContent = selectmodificartincionMuestra.value;

      // Mostramos las muestras para que se actulicen los cambios
      let respuesta = await cargarMuestrasTubo(currentMuestraId);
      imprimirMuestras(respuesta);
    })

    .catch((error) => console.log(error));

  // Ocultamos el modal de modificación
  modalmodificarMuestra.classList.remove("showmodal");
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
      btndetalle.value = muestra.id_muestra;
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
  const response = await fetch(`/api/imagenestubo/por_muestra/${muestraid}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  let imagenes = await response.json();
  return imagenes;
};

// Rellenamos los datos texto de la muestra
const rellenarDatosMuestra = async (muestra) => {
  muestra__descripcion.textContent = muestra.descripcion.substring(0, 60);
  muestra__descripcion.title = muestra.descripcion;

  let nuevafecha = muestra.fecha;
  muestra__fecha.textContent =
    nuevafecha.substring(8) +
    "-" +
    nuevafecha.substring(5, 7) +
    "-" +
    nuevafecha.substring(0, 4);

  muestra__observaciones.textContent = muestra.observaciones;
  muestra__tincion.textContent = muestra.tincion;
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
      modaldetalleMuestra.classList.remove("showmodal");
      // Mostramos las muestras del tubo
      let muestras = await cargarMuestrasTubo(currentMuestraId);
      imprimirMuestras(muestras);
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

// Mostramos Detalle muestra seleccionada
const detailMuestra = async (muestraid) => {
  // Cargamos la muestra
  let muestra = await cargarDetalleMuestraTubo(muestraid);
  muestraId = muestra.id_muestra;
  rellenarDatosMuestra(muestra);

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

  // Mostramos las imagenes de la muestra seleccionada
  mostrarImagenesMuestra(muestraId);

  modaldetalleMuestra.classList.add("showmodal");
  modaldetalleMuestra.classList.remove("hidemodal");
};

const aniadirImagenMuestraTubo = async () => {
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
    newImage.append("muestratubo", muestraId);

    fetch("/api/imagenestubo/", {
      method: "POST",
      body: newImage,
    }).then(async () => {
      await mostrarImagenesMuestra(muestraId);
    });
  } catch (err) {
    console.error(err);
  }
};

const consultarMuestraTuboQR = async (qr) => {
  const response = await fetch(`/api/tubos/por_qr/${qr}/`, {
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
    currentMuestraId = tubo_item.id_casette;
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

organos.addEventListener("change", async () => {
  const respuesta = await cargarPorOrgano();
  imprimirCasettes(respuesta, false);
});

numMuestra.addEventListener("change", async () => {
  const respuesta = await cargarPorNumero();
  imprimirCasettes(respuesta, false);
});

casettes.addEventListener("click", detalleMuestra);

fechainicio.addEventListener("change", consultaFechaInicio);
fechafin.addEventListener("change", consultaFechaFin);

todosMuestras.addEventListener("click", async () => {
  const respuesta = await cargarTodosMuestras();
  imprimirCasettes(respuesta);
});

btnformnuevomuestra.addEventListener("click", () => {
  if (!modalnuevoMuestra.classList.contains("showmodal")) {
    modalnuevoMuestra.classList.add("showmodal");
    modalnuevoMuestra.classList.remove("hidemodal");
  }
});

btnformcerrarnuevoMuestra.addEventListener("click", () => {
  if (!modalnuevoMuestra.classList.contains("hidemodal")) {
    modalnuevoMuestra.classList.add("hidemodal");
    modalnuevoMuestra.classList.remove("showmodal");
  }
});

nuevoMuestra.addEventListener("submit", crearMuestra);

btnformmodificarmuestra.addEventListener("click", () => {
  if (!currentMuestraId) {
    alerttubo.classList.remove("ocultar");
  } else {
    cargarMuestraUpdateModal();
    if (!modalupdateMuestra.classList.contains("showmodal")) {
      modalupdateMuestra.classList.add("showmodal");
      modalupdateMuestra.classList.remove("hidemodal");
    }
  }
});

btnformcerrarmodificarMuestra.addEventListener("click", () => {
  if (!modalupdateMuestra.classList.contains("hidemodal")) {
    modalupdateMuestra.classList.add("hidemodal");
    modalupdateMuestra.classList.remove("showmodal");
  }
});

modificarMuestra.addEventListener("submit", modificarMuestraUpdate);

eliminarMuestraModal.addEventListener("show.bs.modal", (event) => {
  if (!currentMuestraId) {
    event.preventDefault();
    alerttubo.classList.remove("ocultar");
  }
});

btnborrar.addEventListener("click", borrarMuestraTubo);

imagenMuestraModal.addEventListener("show.bs.modal", (event) => {
  if (!currentMuestraId) {
    event.preventDefault();
    alerttubo.classList.remove("ocultar");
  }
});

qrMuestraModal.addEventListener("show.bs.modal", (event) => {
  if (!currentMuestraId) {
    event.preventDefault();
    alerttubo.classList.remove("ocultar");
  } else {
    inputmuestra__qr.style.display = "none";
    inputmuestra__qr.focus();
  }
});

btnformnuevaMuestra.addEventListener("click", () => {
  if (!currentMuestraId) {
    alerttubo.classList.remove("ocultar");
  } else {
    if (!modalnuevaMuestra.classList.contains("showmodal")) {
      modalnuevaMuestra.classList.add("showmodal");
      modalnuevaMuestra.classList.remove("hidemodal");
    }
  }
});

btnformcerrarnuevaMuestra.addEventListener("click", () => {
  if (!modalnuevaMuestra.classList.contains("hidemodal")) {
    modalnuevaMuestra.classList.add("hidemodal");
    modalnuevaMuestra.classList.remove("showmodal");
  }
});

btncerrardetalleMuestra.addEventListener("click", () => {
  if (!modaldetalleMuestra.classList.contains("hidemodal")) {
    modaldetalleMuestra.classList.add("hidemodal");
    modaldetalleMuestra.classList.remove("showmodal");
  }
  muestra__img.innerHTML = "";
});

nuevaMuestra.addEventListener("submit", crearMuestraTubo);

btnformmodificarMuestra.addEventListener("click", () => {
  if (!muestraId) {
    alertfecha.classList.remove("ocultar");
  } else {
    cargarMuestraTuboUpdateModal();
    if (!modalmodificarMuestra.classList.contains("showmodal")) {
      modalmodificarMuestra.classList.add("showmodal");
      modalmodificarMuestra.classList.remove("hidemodal");
    }
  }
});

btnformcerrarmodificarMuestra.addEventListener("click", () => {
  if (!modalmodificarMuestra.classList.contains("hidemodal")) {
    modalmodificarMuestra.classList.add("hidemodal");
    modalmodificarMuestra.classList.remove("showmodal");
  }
});

modificarMuestra.addEventListener("submit", modificarMuestraTuboUpdate);

muestras.addEventListener("click", (event) => {
  if (event.target.nodeName == "I" || event.target.classList.contains("fa-file-invoice")) {
    let id = event.target.value || event.target.getAttribute("value");
    if (id) detailMuestra(id);
  }
});

muestra__img.addEventListener("click", async (event) => {
  if (event.target.nodeName === "IMG") {
    visor__img.src = event.target.src;
    imageId = event.target.id;
  }
  if (event.target.classList.contains("fa-circle-plus")) aniadirImagenMuestraTubo();
});

qrMuestraModal.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    consultarMuestraTuboQR(inputmuestra__qr.value);
    inputmuestra__qr.value = "";
  }
});

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

if (btn__imprimrqr) btn__imprimrqr.addEventListener("click", () => imprimirQR("tubo"));
if (btn__imprimirqrmuestra) btn__imprimirqrmuestra.addEventListener("click", () => imprimirQR("muestra"));
if (btnborrarmuestra) btnborrarmuestra.addEventListener("click", borrarMuestraTuboDetalle);
if (btnborrarimagenmuestra) btnborrarimagenmuestra.addEventListener("click", borrarImagenMuestraTubo);

const guardarInformeMedico = async () => {
  if (!currentMuestraId) {
    alert("Por favor, selecciona un tubo primero.");
    return;
  }

  const payload = {
    informe_descripcion: muestraInformeDescripcion.value,
    informe_fecha: muestraInformeFecha.value,
    informe_tincion: muestraInformeTincion.value,
    informe_observaciones: muestraInformeObservaciones.value,
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
const btnToggleMuestras = document.getElementById("btnToggleMuestras");

if (btnToggleInforme && sectionMuestras && sectionInforme) {
  btnToggleInforme.addEventListener("click", () => {
    sectionMuestras.classList.add("d-none");
    sectionInforme.classList.remove("d-none");
  });
}

if (btnToggleMuestras && sectionMuestras && sectionInforme) {
  btnToggleMuestras.addEventListener("click", () => {
    sectionInforme.classList.add("d-none");
    sectionMuestras.classList.remove("d-none");
  });
}
