const inputNumTubo = document.getElementById("inputNumTubo");
const token = sessionStorage.getItem("token");

const body = document.getElementById("body");
const tubos = document.getElementById("tubos_lista");  // tabla de muestras principales
const muestras = document.getElementById("tubos");  // tabla de tubos/análisis
const tipo_tubos = document.getElementById("tipo_tubos");
const numTubo = document.getElementById("numTubo");

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
const modalnuevoTubo = document.getElementById("modalnuevoTubo");
const btnformnuevotubo = document.getElementById("btnformnuevotubo");
const btnformmodificartubo = document.getElementById(
  "btnformmodificartubo"
);
const btnformcerrarnuevoTubo = document.getElementById(
  "btnformcerrarnuevoTubo"
);
const btnformcerrarmodificarTubo = document.getElementById(
  "btnformcerrarmodificarTubo"
);
const btnmodificar = document.getElementById("btnmodificar");
const nuevoTubo = document.getElementById("nuevoTubo");
const nuevaMuestra = document.getElementById("nuevaMuestra");

const tuboDescripcion = document.getElementById("tubo__descripcionMain");
const tuboTipoMuestra = document.getElementById("tubo__tipo_tuboMain");
const tuboTubo = document.getElementById("tubo__muestraMain");
const tuboFecha = document.getElementById("tubo__fechaMain");
const tuboTecnicoId = document.getElementById("tubo__tecnico_idMain");
const tuboCaracteristicas = document.getElementById(
  "tubo__caracteristicasMain"
);
const tuboObservaciones = document.getElementById(
  "tubo__observacionesMain"
);
const tuboInformeDescripcion = document.getElementById("tubo__informe_descripcion");
const tuboInformeFecha = document.getElementById("tubo__informe_fecha");
const tuboInformeTincion = document.getElementById("tubo__informe_tincion");
const tuboInformeObservaciones = document.getElementById("tubo__informe_observaciones");
const tuboInformeImagen = document.getElementById("tubo__informe_imagen");

const tuboImagen = document.getElementById("tubo__imagen");
const eliminarTuboModal = document.getElementById("eliminarTuboModal");

// Detalle Tubo
let currentTuboId = null;
const btnGuardarInforme = document.getElementById("btnGuardarInforme");
const btn__imprimrqr = document.getElementById("btn__imprimirqr");

// Modal qr
const imgtubo__qr = document.getElementById("imgtubo__qr");
const inputtubo__qr = document.getElementById("inputtubo__qr");

// Todos los tubos
const todosTubos = document.getElementById("todosTubos");

// Nuevo Tubo (Muestra)
const inputFecha = document.getElementById("inputFecha");
const inputDescripcion = document.getElementById("inputDescripcion");
const inputCaracteristicas = document.getElementById("inputCaracteristicas");
const inputObservaciones = document.getElementById("inputObservaciones");
const inputClinica = document.getElementById("inputClinica");
const inputMicroscopia = document.getElementById("inputMicroscopia");
const inputDiagnostico = document.getElementById("inputDiagnostico");
const inputPatologo = document.getElementById("inputPatologo");
const inputSelect = document.getElementById("inputSelect");
const inputImagenes = document.getElementById("inputImagenes");
const inputTubo = document.getElementById("inputTubo");

// Modificar Tubo
const modalupdateTubo = document.getElementById("modalupdateTuboMain");
const modificarTubo = document.getElementById("modificarTuboFormMain");
const btnmodificartubo = document.getElementById("btnformmodificartuboMain");
const inputFechaUpdate = document.getElementById("inputFechaUpdate");
const inputImagenesUpdate = document.getElementById("inputImagenesUpdate");

const inputDescripcionUpdate = document.getElementById(
  "inputDescripcionUpdate"
);
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
const inputClinicaUpdate = document.getElementById("inputClinicaUpdate");
const inputTuboUpdate = document.getElementById("inputTuboUpdate");

// Crear un análisis (Tubos)
const btnformnuevaMuestra = document.getElementById("btnformnuevaTubo");
const btnformcerrarnuevaMuestra = document.getElementById(
  "btnformcerrarnuevaTubo"
);

const modalnuevaMuestra = document.getElementById("modalnuevaTubo");

// Nueva Análisis
const inputdescripcionMuestra = document.getElementById(
  "inputdescripcionMuestra"
);
const inputFechaMuestra = document.getElementById("inputFechaMuestra");
const selectTincionMuestra = document.getElementById("selectTincionMuestra");
const inputObservacionesMuestra = document.getElementById(
  "inputObservacionesMuestra"
);
const inputImagenesMuestra = document.getElementById("inputImagenesMuestra");

// Detalle Análisis
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

// Modificar análisis
const modificarMuestra = document.getElementById("modificarAnalysisForm");
const modalmodificarMuestra = document.getElementById("modalmodificarAnalysis");
const modaldetalleMuestra = document.getElementById("modaldetalleTubo");
const btnformmodificarMuestra = document.getElementById(
  "btnformmodificartubo" // This one seems to not be duplicated in my grep? Let's check.
);
const btnformcerrarmodificarMuestra = document.getElementById(
  "btnformcerrarmodificarTubo"
);

// Datos para modificar un análisis
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
// Borrar Análisis
const btnborrarmuestra = document.getElementById("btnborrarmuestra");

// Borrar Imagen Análisis
const btnborrarimagenmuestra = document.getElementById(
  "btnborrarimagenmuestra"
);

const qrMuestraModal = document.getElementById("qrMuestraModal");
const imgmuestra__qr = document.getElementById("imgmuestra__qr");
const inputmuestra__qr = document.getElementById("inputmuestra__qr");
const btn__imprimirqrmuestra = document.getElementById(
  "btn__imprimirqrmuestra"
);

// Consultar por código qr
const btn__consultarqr = document.getElementById("btn__consultarqr");
const input__consultarqr = document.getElementById("input__consultarqr");
const qrConsultaModal = document.getElementById("qrConsultaModal");
let mimodal = new bootstrap.Modal(document.getElementById("qrConsultaModal"));

// Fecha inicio fin para consultas
const fechainicio = document.getElementById("fechainicio");
const fechafin = document.getElementById("fechafin");

// Alert error
const alerttubo = document.getElementById("alerttubo");
const alertfecha = document.getElementById("alertfecha");
const alertfecha_text = document.getElementById("alertfecha_text");

// id del tubo de trabajo
let tuboId = null;

// qr tubo
let tuboqr = null;

// id análisis del tubo
let muestraId = null;

// id imagen seleccionada
let imageId = null;

const files = document.getElementById("files");

// Utility to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Initialize Authentication from server if missing
const initAuth = async () => {
  if (!sessionStorage.getItem("tecnico_id")) {
    try {
      const response = await fetch("/api/tecnicos/me/");
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("tecnico_id", data.id_tecnico);
        sessionStorage.setItem("rol", data.is_superuser ? "admin" : "user");
        console.log("Sesión restaurada desde el servidor");
      }
    } catch (error) {
      console.error("Error al restaurar sesión:", error);
    }
  }
};

initAuth();

// Carga Tubos al inicio
const cargarTubosIndex = async () => {
  return await fetch("/api/tubos/index/").then(data => data.json());
};

// Carga el detalle del tubo seleccionado
const cargarTubo = async (tuboId) => {
  return await fetch(`/api/tubos/${tuboId}/`).then(data => data.json());
};

const crearTubo = async (event) => {
  event.preventDefault();

  // Si no hay tecnico_id, intentar recuperarlo antes de fallar
  if (!sessionStorage.getItem("tecnico_id")) {
    await initAuth();
  }

  // Validar que tecnico_id esté disponible
  const tecnicoId = sessionStorage.getItem("tecnico_id");
  if (!tecnicoId) {
    alert("Error: Usuario no autenticado. Por favor inicia sesión nuevamente.");
    return;
  }

  const data = {
    muestra: inputTubo.value,
    fecha: inputFecha.value,
    descripcion: inputDescripcion.value,
    caracteristicas: inputCaracteristicas.value,
    observaciones: inputObservaciones.value,
    organo: inputSelect.value,
    informacion_clinica: inputClinica.value,
    descripcion_microscopica: inputMicroscopia.value,
    diagnostico_final: inputDiagnostico.value,
    patologo_responsable: inputPatologo.value,
    tecnico: tecnicoId,
  };

  fetch("/api/tubos/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Limpiar formulario
      nuevoTubo.reset();
      // Cerrar modal
      modalnuevoTubo.classList.remove("showmodal");
      modalnuevoTubo.classList.add("hidemodal");

      // En vez de recargar la página, actualizamos los datos
      const respuesta = await cargarTodosTubos();
      imprimirTubos(respuesta);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al crear la muestra: " + error.message);
    });
};

const cargarTodosTubos = async () => {
  return await fetch("/api/tubos/todos/").then((data) => data.json());
};

const cargarPorTipo = async () => {
  return await fetch(`/api/tubos/por_organo/?organo=${tipo_tubos.value}`)
    .then((data) => data.json())
    .catch((error) => console.log("Error en cargarPorTipo: " + error));
};

const cargarPorNumero = async () => {
  return await fetch(`/api/tubos/por_numero/?numero=${numTubo.value}`)
    .then((data) => data.json())
    .catch((error) => console.log("Error en cargarPorNumero: " + error));
};

const obtenerTubosFecha = async (fecha) => {
  const response = await fetch(`/api/tubos/por_fecha/?fecha=${fecha}`);
  return await response.json();
};

const obtenerTubosFechaRango = async (inicio, fin) => {
  const response = await fetch(`/api/tubos/rango_fechas/?inicio=${inicio}&fin=${fin}`);
  return await response.json();
};

const borrarTubo = () => {
  fetch(`/api/tubos/${tuboId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    }
  })
    .then((response) => {
      if (response.ok) {
        console.log("Muestra eliminada");
        eliminarTuboModal.classList.remove("showmodal");
        eliminarTuboModal.classList.add("hidemodal");
        setTimeout(() => {
          location.href = "bioquimica.html";
        }, 500);
      } else {
        alert("Error al eliminar la muestra");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al eliminar la muestra: " + error.message);
    });
};

const cargarTuboUpdateModal = async (event) => {
  if (!tuboId) {
    if (event) event.preventDefault();
    alerttubo.classList.remove("ocultar");
  } else {
    let tubo = await cargarTubo(tuboId);
    inputDescripcionUpdate.value = tubo.descripcion;
    inputFechaUpdate.value = tubo.fecha;
    inputCaracteristicasUpdate.value = tubo.caracteristicas;
    inputObservacionesUpdate.value = tubo.observaciones;
    inputClinicaUpdate.value = tubo.informacion_clinica || "";
    inputMicroscopiaUpdate.value = tubo.descripcion_microscopica || "";
    inputDiagnosticoUpdate.value = tubo.diagnostico_final || "";
    inputPatologoUpdate.value = tubo.patologo_responsable || "";
    inputSelectUpdate.value = tubo.organo;
    inputTuboUpdate.value = tubo.muestra;
  }
};

const modificarTuboUpdate = async (event) => {
  event.preventDefault();

  const tecnicoId = sessionStorage.getItem("tecnico_id");
  if (!tecnicoId) {
    alert("Error: Usuario no autenticado. Por favor inicia sesión nuevamente.");
    return;
  }

  const data = {
    tubo: inputTuboUpdate.value,
    fecha: inputFechaUpdate.value,
    descripcion: inputDescripcionUpdate.value,
    caracteristicas: inputCaracteristicasUpdate.value,
    observaciones: inputObservacionesUpdate.value,
    organo: inputSelectUpdate.value,
    informacion_clinica: inputClinicaUpdate.value,
    descripcion_microscopica: inputMicroscopiaUpdate.value,
    diagnostico_final: inputDiagnosticoUpdate.value,
    patologo_responsable: inputPatologoUpdate.value,
    tecnico: tecnicoId,
  };

  await fetch(`/api/tubos/${tuboId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Muestra actualizada");
        modalupdateTubo.classList.remove("showmodal");
        // En vez de recargar la página, actualizamos los datos
        actualizarVistaYLista(tuboId);
      } else {
        alert("Error al actualizar la muestra");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al actualizar la muestra: " + error.message);
    });
};

const actualizarVistaYLista = async (id) => {
  let tubo = await cargarTubo(id);
  imprimirDataTubo(tubo);
  const respuesta = await cargarTodosTubos();
  imprimirTubos(respuesta);
};

const cargarMuestras = async (tuboId) => {
  return await fetch(`/api/muestrastubo/tubo/${tuboId}/`).then((data) => data.json());
};

const limpiarModalMuestra = () => {
  inputdescripcionMuestra.value = "";
  inputFechaMuestra.value = "";
  inputObservacionesMuestra.value = "";
  selectTincionMuestra.value = "";
  inputImagenesMuestra.value = "";
};

const cargarMuestraUpdateModal = async (event) => {
  if (!tuboId) {
    if (event) event.preventDefault();
    alerttubo.classList.remove("ocultar");
  } else {
    const response = await fetch(`/api/muestrastubo/${muestraId}/`);
    let muestra = await response.json();
    inputmodificardescripcionMuestra.value = muestra.descripcion;
    inputmodificarfechaMuestra.value = muestra.fecha;
    selectmodificartincionMuestra.value = muestra.tincion;
    inputmodificarobservacionesMuestra.value = muestra.observaciones;
  }
};

const modificarMuestraUpdate = async (event) => {
  event.preventDefault();

  const data = {
    fecha: inputmodificarfechaMuestra.value,
    descripcion: inputmodificardescripcionMuestra.value,
    observaciones: inputmodificarobservacionesMuestra.value,
    tincion: selectmodificartincionMuestra.value,
    tubo: tuboId
  };

  await fetch(`/api/muestrastubo/${muestraId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify(data),
  })
    .then(async () => {
      // Actualizamos los datos del detalle del análisis
      muestra__descripcion.textContent = inputmodificardescripcionMuestra.value;
      let newfecha = inputmodificarfechaMuestra.value;
      muestra__fecha.textContent =
        newfecha.substring(8) +
        "-" +
        newfecha.substring(5, 7) +
        "-" +
        newfecha.substring(0, 4);

      muestra__observaciones.textContent =
        inputmodificarobservacionesMuestra.value;
      muestra__tincion.textContent = selectmodificartincionMuestra.value;

      // Mostramos los análisis para que se actualicen
      let respuesta = await cargarMuestras(tuboId);
      imprimirMuestras(respuesta);

      modalmodificarMuestra.classList.remove("showmodal");
      modalmodificarMuestra.classList.add("hidemodal");
    })
};

const consultaFechaInicio = async () => {
  alertfecha.classList.add("ocultar");
  let respuesta;
  if (!fechafin.value) {
    respuesta = await obtenerTubosFecha(fechainicio.value);
  } else {
    if (new Date(fechainicio.value) > new Date(fechafin.value)) {
      alertfecha.classList.add("ocultar");
      alertfecha_text.textContent = "La fecha de inicio debe ser menor";
      alertfecha.classList.remove("ocultar");
    } else {
      alertfecha.classList.add("ocultar");
      respuesta = await obtenerTubosFechaRango(
        fechainicio.value,
        fechafin.value
      );
    }
  }
  imprimirTubos(respuesta, false);
};

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
      const respuesta = await obtenerTubosFechaRango(
        fechainicio.value,
        fechafin.value
      );
      imprimirTubos(respuesta, false);
    }
  }
};

const imprimirTubos = (respuesta, rebuildDropdown = true) => {
  tubos.innerHTML = "";
  if (rebuildDropdown) {
    numTubo.innerHTML = "<option disabled selected>Nº Tubo</option>";
  }

  let fragmento = document.createDocumentFragment();
  let fragmentselect = document.createDocumentFragment();
  if (respuesta.length > 0) {
    respuesta.map((tubo) => {
      // Para cargar los números de tubo
      let option = document.createElement("OPTION");
      option.textContent = tubo.muestra;
      fragmentselect.appendChild(option);

      // Para mostrar los tubos
      let tr = document.createElement("tr");
      tr.classList.add("table__row");

      // Muestra / Paciente
      let ntubo = document.createElement("td");
      ntubo.textContent = tubo.muestra;

      let fecha = document.createElement("td");
      let newfecha = tubo.fecha;

      fecha.textContent =
        newfecha.substring(8) +
        "-" +
        newfecha.substring(5, 7) +
        "-" +
        newfecha.substring(0, 4);

      let descripcion = document.createElement("td");
      descripcion.textContent = tubo.descripcion.substring(0, 50);
      descripcion.title = tubo.descripcion;

      let tipo_muestra = document.createElement("td");
      tipo_muestra.textContent = tubo.tipo_muestra;

      let btndetalle = document.createElement("I");
      btndetalle.className =
        "d-inline-block tubo__icon fa-solid fa-file-invoice tubo__icon--infotubo";
      btndetalle.dataset.id = tubo.id_muestra;
      btndetalle.title = "Detalle Muestra";

      let btnCont = document.createElement("td");
      btnCont.appendChild(btndetalle);

      tr.appendChild(ntubo);
      tr.appendChild(fecha);
      tr.appendChild(descripcion);
      tr.appendChild(tipo_muestra);
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
    tr.textContent = "No se ha encontrado ninguna muestra";
    fragmento.appendChild(tr);
  }

  tubos.appendChild(fragmento);
  if (rebuildDropdown) {
    numTubo.appendChild(fragmentselect);
  }
};

// Peticiones al seleccionar un tubo
const detalleTubo = async (event) => {
  const icon = event.target.closest("i.fa-file-invoice");
  if (icon) {
    alerttubo.classList.add("ocultar");
    tuboId = icon.dataset.id;

    let respuesta = await cargarTubo(tuboId);
    imprimirDataTubo(respuesta);

    let muestras_resp = await cargarMuestras(tuboId);
    imprimirMuestras(muestras_resp);
  }
};

// Muestra el detalle de un tubo
const imprimirDataTubo = (respuesta) => {
  tuboDescripcion.textContent = respuesta.descripcion;
  tuboTipoMuestra.textContent = respuesta.tipo_muestra;
  // tuboTubo.textContent = respuesta.muestra; // Element doesn't exist in HTML
  tuboTecnicoId.textContent = respuesta.tecnico;
  
  // Show the muestra/paciente number in the header
  const tuboNumElement = document.getElementById("tubo__tubo");
  if (tuboNumElement) {
    tuboNumElement.textContent = respuesta.muestra;
  }

  // Formato Fecha
  let newfecha = respuesta.fecha;
  if (newfecha) {
    tuboFecha.textContent =
      newfecha.substring(8) +
      "-" +
      newfecha.substring(5, 7) +
      "-" +
      newfecha.substring(0, 4);
  } else {
    tuboFecha.textContent = "";
  }

  tuboCaracteristicas.textContent = respuesta.caracteristicas;
  tuboObservaciones.textContent = respuesta.observaciones;

  tuboInformeDescripcion.value = respuesta.informe_descripcion || "";
  tuboInformeFecha.value = respuesta.informe_fecha || "";
  tuboInformeTincion.value = respuesta.informe_tincion || "";
  tuboInformeObservaciones.value = respuesta.informe_observaciones || "";
  currentTuboId = respuesta.id_muestra;

  // generamos el codigo QR
  if (window.QRious) {
    new QRious({
      element: document.querySelector("#imgtubo__qr"),
      value: respuesta.qr_muestra,
      size: 70,
      backgroundAlpha: 0,
      foreground: "#4ca0cc",
      level: "H",
    });
  }
};

// Crear nuevo análisis
const crearMuestra = async (event) => {
  event.preventDefault();
  let newMuestra = new FormData();
  newMuestra.append("descripcion", inputdescripcionMuestra.value);
  newMuestra.append("fecha", inputFechaMuestra.value);
  newMuestra.append("observaciones", inputObservacionesMuestra.value);
  newMuestra.append("tincion", selectTincionMuestra.value);
  if (inputImagenesMuestra.files[0]) {
    newMuestra.append("imagen", inputImagenesMuestra.files[0]);
  }
  newMuestra.append("tubo", tuboId);
  await fetch("/api/muestrastubo/", {
    method: "POST",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: newMuestra,
  }).then(async () => {
    modalnuevaMuestra.classList.remove("showmodal");
    modalnuevaMuestra.classList.add("hidemodal");
    limpiarModalMuestra();
    let muestras_resp = await cargarMuestras(tuboId);
    imprimirMuestras(muestras_resp);
  }).catch(err => console.error(err));
};

// Imprimir análisis
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
      let newfecha = muestra.fecha;
      fecha.textContent =
        newfecha.substring(8) +
        "-" +
        newfecha.substring(5, 7) +
        "-" +
        newfecha.substring(0, 4);

      let tincion = document.createElement("td");
      tincion.textContent = muestra.tincion;

      let btn = document.createElement("td");
      let btndetalle = document.createElement("I");
      btndetalle.className =
        "d-inline-block tubo__icon fa-solid fa-file-invoice tubo__icon--infotubo";
      btndetalle.dataset.id = muestra.id_muestra;
      btndetalle.title = "Detalle Análisis";
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
    tr.textContent = "No se ha encontrado ningún análisis";
    fragmento.appendChild(tr);
  }
  muestras.appendChild(fragmento);
};

// Obtenemos un análisis
const cargarMuestra = async (muestraid) => {
  const response = await fetch(`/api/muestrastubo/${muestraId}/`);
  return await response.json();
};

// Obtenemos las imágenes de un análisis
const obtenerImagenesMuestra = async (muestraid) => {
  const response = await fetch(`/api/imagenestubo/muestra/${muestraid}/`);
  return await response.json();
};

// Rellenamos los datos del análisis
const rellenarDatosMuestra = async (muestra) => {
  muestra__descripcion.textContent = muestra.descripcion.substring(0, 60);
  muestra__descripcion.title = muestra.descripcion;

  let newfecha = muestra.fecha;
  muestra__fecha.textContent =
    newfecha.substring(8) +
    "-" +
    newfecha.substring(5, 7) +
    "-" +
    newfecha.substring(0, 4);

  muestra__observaciones.textContent = muestra.observaciones;
  muestra__tincion.textContent = muestra.tincion;
};

const borrarImagenMuestra = async () => {
  if (imageId != undefined) {
    fetch(`/api/imagenestubo/${imageId}/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    }).then(() => {
      mostrarImagenesMuestra(muestraId);
    });
  }
};

const detailMuestra = async (muestraid) => {
  // Cargamos el análisis
  let muestra = await cargarMuestra(muestraid);
  muestraId = muestra.id_muestra;
  rellenarDatosMuestra(muestra);

  // Generamos el código QR
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

  // Mostramos las imágenes del análisis
  mostrarImagenesMuestra(muestraId);

  modaldetalleMuestra.classList.add("showmodal");
  modaldetalleMuestra.classList.remove("hidemodal");
};

const aniadirImagenMuestra = async () => {
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
    newImage.append("muestra", muestraId);

    fetch("/api/imagenestubo/", {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: newImage,
    }).then(async () => {
      await mostrarImagenesMuestra(muestraId);
    });
  } catch (err) {
    console.error(err);
  }
};

const imprimirQR = (elemento) => {
  let qrimprimir;
  if (elemento == "tubo") {
    qrimprimir = imgtubo__qr.src;
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

const mostrarImagenesMuestra = async (muestraId_val) => {
  muestra__img.innerHTML = "";
  let imagenes = await obtenerImagenesMuestra(muestraId_val);
  // Imagen de sustitución si no hay imágenes
  if (imagenes.length == 0) {
    if (typeof visor__img !== 'undefined') visor__img.src = "./assets/images/no_disponible.jpg";
  } else {
    imagenes.forEach((imagen, index) => {
      let newimg = document.createElement("IMG");
      newimg.id = imagen.id_imagen;
      newimg.src = `data:image/jpeg;base64,${imagen.imagen}`;

      newimg.classList.add("muestra__img");

      if (index == 0) {
        if (typeof visor__img !== 'undefined') visor__img.src = newimg.src;
        imageId = newimg.id;
      }

      // Añadimos cada una de las imágenes
      let newdiv = document.createElement("DIV");
      newdiv.classList.add("container__muestraimg", "border", "m-1");
      newdiv.appendChild(newimg);
      muestra__img.appendChild(newdiv);
    });
  }
};

const borrarMuestra = async () => {
  fetch(`/api/muestrastubo/${muestraId}/`, {
    method: "DELETE",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  })
    .then(async () => {
      modaldetalleMuestra.classList.remove("showmodal");
      let muestras = await cargarMuestras(tuboId);
      imprimirMuestras(muestras);
    }).catch(err => console.error(err));
};

const consultarTuboQR = async (qr) => {
  const response = await fetch(`/api/tubos/por_qr/?qr=${qr}`);
  let tubo = await response.json();
  if (tubo.length > 0) {
    imprimirTubos(tubo);
    tubo = tubo[0];
    imprimirDataTubo(tubo);
    tuboId = tubo.id_muestra;
    let muestras_resp = await cargarMuestras(tuboId);
    imprimirMuestras(muestras_resp);
  } else {
    alert("No se encontró ningún tubo con ese QR");
  }
};

const consultarMuestraQR = async (qr) => {
  let response = await fetch(`/api/muestrastubo/por_qr/?qr=${qr}`);
  let muestra = await response.json();
  if (muestra.length > 0) {
    let tubo_response = await fetch(`/api/tubos/${muestra[0].tubo}/`);
    let tubo = await tubo_response.json();
    consultarTuboQR(tubo.qr_muestra);
    detailMuestra(muestra[0].id_muestra);
  } else {
    alert("No se encontró ninguna muestra");
  }
};

// Cargamos el modal datos de usuario para modificar
const cargarUserUpdateModal = async (event) => {
  let userId = sessionStorage.getItem("tecnico_id");
  const response = await fetch(
    "modelo/tecnicos/tecnicos.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        accion: "cargarTecnicoId",
        id_tecnico: userId,
      }),
    }
  );

  let user = await response.json();

  inputUpdateNombreUser.value = user.nombre || user.name || "";
  inputUpdateApellidosUser.value = user.apellidos;
  inputUpdateCentroUser.value = user.centro;
  inputUpdateCorreoUser.value = user.email;
};

// EVENTOS

// Modificar Usuario
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

// Consulta Tubos Recientes
document.addEventListener("DOMContentLoaded", async () => {
  body.style.display = "block";
  const respuesta = await cargarTubosIndex();
  imprimirTubos(respuesta);
  let fechaActual = new Date().toISOString().split("T")[0];
  // Para que no se pueda seleccionar una fecha anterior a la actual
  inputFecha.setAttribute("min", fechaActual);
  inputFechaUpdate.setAttribute("min", fechaActual);
  inputFechaMuestra.setAttribute("min", fechaActual);
});

// Consulta por Tipo de Muestra
tipo_tubos.addEventListener("change", async () => {
  const respuesta = await cargarPorTipo();
  imprimirTubos(respuesta, false);
});

// Consulta por Número de Tubo
numTubo.addEventListener("change", async () => {
  const respuesta = await cargarPorNumero();
  imprimirTubos(respuesta, false);
});

// Consulta Detalle Tubo y Análisis
tubos.addEventListener("click", detalleTubo);

// Consulta por fecha
fechainicio.addEventListener("change", consultaFechaInicio);

fechafin.addEventListener("change", consultaFechaFin);

// Todos los tubos
todosTubos.addEventListener("click", async () => {
  const respuesta = await cargarTodosTubos();
  imprimirTubos(respuesta);
});

// Crear nuevos Tubos
btnformnuevotubo.addEventListener("click", () => {
  if (!modalnuevoTubo.classList.contains("showmodal")) {
    modalnuevoTubo.classList.add("showmodal");
    modalnuevoTubo.classList.remove("hidemodal");
  }
});

btnformcerrarnuevoTubo.addEventListener("click", () => {
  if (!modalnuevoTubo.classList.contains("hidemodal")) {
    modalnuevoTubo.classList.add("hidemodal");
    modalnuevoTubo.classList.remove("showmodal");
  }
});

nuevoTubo.addEventListener("submit", crearTubo);

// Modificar Tubo
btnmodificartubo.addEventListener("click", () => {
  if (!tuboId) {
    alerttubo.classList.remove("ocultar");
  } else {
    cargarTuboUpdateModal();
    if (!modalupdateTubo.classList.contains("showmodal")) {
      modalupdateTubo.classList.add("showmodal");
      modalupdateTubo.classList.remove("hidemodal");
    }
  }
});

btnformcerrarmodificarTubo.addEventListener("click", () => {
  if (!modalupdateTubo.classList.contains("hidemodal")) {
    modalupdateTubo.classList.add("hidemodal");
    modalupdateTubo.classList.remove("showmodal");
  }
});

modificarTubo.addEventListener("submit", modificarTuboUpdate);

// Borrar Tubo
eliminarTuboModal.addEventListener("show.bs.modal", (event) => {
  if (!tuboId) {
    event.preventDefault();
    alerttubo.classList.remove("ocultar");
  }
});

btnborrar.addEventListener("click", borrarTubo);

// Modal QR análisis
qrMuestraModal.addEventListener("show.bs.modal", (event) => {
  inputmuestra__qr.style.display = "none";
  inputmuestra__qr.focus();
});

// Modal QR análisis - segundo listener
qrMuestraModal.addEventListener("show.bs.modal", (event) => {
  if (!muestraId) {
    event.preventDefault();
    alerttubo.classList.remove("ocultar");
  }
});

// Crear Análisis
btnformnuevaMuestra.addEventListener("click", () => {
  if (!tuboId) {
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

if (btncerrardetalleMuestra) {
  btncerrardetalleMuestra.addEventListener("click", () => {
    if (!modaldetalleMuestra.classList.contains("hidemodal")) {
      modaldetalleMuestra.classList.add("hidemodal");
      modaldetalleMuestra.classList.remove("showmodal");
    }
    muestra__img.innerHTML = "";
  });
}

nuevaMuestra.addEventListener("submit", crearMuestra);

// Modificar Análisis
btnformmodificarMuestra.addEventListener("click", () => {
  if (!tuboId) {
    alerttubo.classList.remove("ocultar");
  } else {
    cargarMuestraUpdateModal();
    if (!modalmodificarMuestra.classList.contains("showmodal")) {
      modalmodificarMuestra.classList.add("showmodal");
      modalmodificarMuestra.classList.remove("hidemodal");
    }
  }
});

if (btnformcerrarmodificarMuestra) {
  btnformcerrarmodificarMuestra.addEventListener("click", () => {
    if (!modalmodificarMuestra.classList.contains("hidemodal")) {
      modalmodificarMuestra.classList.add("hidemodal");
      modalmodificarMuestra.classList.remove("showmodal");
    }
  });
}

// Consulta Detalle Análisis
muestras.addEventListener("click", (event) => {
  if (event.target.nodeName == "I") {
    detailMuestra(event.target.dataset.id);
  }
});

// Visualizamos la imagen seleccionada
if (muestra__img) {
  muestra__img.addEventListener("click", async (event) => {
    if (event.target.nodeName === "IMG") {
      if (typeof visor__img !== 'undefined') visor__img.src = event.target.src;
      imageId = event.target.id;
    }
    if (event.target.nodeName === "I") aniadirImagenMuestra();
  });
}

inputtubo__qr.value = "";
input__consultarqr.value = "";

// Lectura código QR del análisis
qrMuestraModal.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    consultarMuestraQR(inputmuestra__qr.value);
    inputmuestra__qr.value = "";
  } else {
    inputmuestra__qr.value += event.key;
  }
});

qrConsultaModal.addEventListener("show.bs.modal", () => {
  input__consultarqr.style.display = "none";
  input__consultarqr.focus();
});

// Consulta por QR tanto de Tubo como de Análisis
qrConsultaModal.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    let tipo = input__consultarqr.value.substring(0, 5);
    if (tipo === "--m--") {
      consultarTuboQR(input__consultarqr.value);
    }
    if (tipo === "--a--") {
      consultarMuestraQR(input__consultarqr.value);
    }
    mimodal.hide();
    input__consultarqr.value = "";
  } else {
    input__consultarqr.value += event.key;
  }
});

btn__imprimrqr.addEventListener("click", () => imprimirQR("tubo"));

btn__imprimirqrmuestra.addEventListener("click", () => imprimirQR("muestra"));

if (btnborrarmuestra) {
  btnborrarmuestra.addEventListener("click", borrarMuestra);
}

if (btnborrarimagenmuestra) {
  btnborrarimagenmuestra.addEventListener("click", borrarImagenMuestra);
}

// Guardar solo el informe de resultados
const guardarInformeMedico = async () => {
  if (!currentTuboId) {
    alert("Por favor, selecciona una muestra primero.");
    return;
  }

  const datosReporte = {
    accion: "actualizarInformeMedico",
    muestraId: currentTuboId,
    descripcion: tuboInformeDescripcion.value,
    fecha: tuboInformeFecha.value,
    tincion: tuboInformeTincion.value,
    observaciones: tuboInformeObservaciones.value,
    imagen: tuboInformeImagen.files.length > 0 ? "" : "",
  };

  if (tuboInformeImagen.files.length > 0) {
    const imgReader = new FileReader();
    imgReader.readAsDataURL(tuboInformeImagen.files[0]);
    imgReader.onload = async function () {
      datosReporte.imagen = imgReader.result.split(',')[1];
      guardarDatosReporteTubo(datosReporte);
    };
    return;
  }
  guardarDatosReporteTubo(datosReporte);
};

const guardarDatosReporteTubo = async (datosReporte) => {
  try {
    const res = await fetch(`/api/tubos/${datosReporte.muestraId}/actualizar_informe/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosReporte),
    });

    const data = await res.json();
    alert(data);
  } catch (error) {
    console.error("Error al guardar el informe:", error);
    alert("Error al guardar el informe de resultados.");
  }
};

if (btnGuardarInforme) {
  btnGuardarInforme.addEventListener("click", guardarInformeMedico);
}

// Toggle section views
const sectionTubosTable = document.getElementById("sectionTubos"); // El contenedor de la tabla de análisis
const sectionInforme = document.getElementById("sectionInforme");
const btnToggleInforme = document.getElementById("btnToggleInforme");
const btnToggleTubos = document.getElementById("btnToggleTubos");

if (btnToggleInforme && sectionTubosTable && sectionInforme) {
  btnToggleInforme.addEventListener("click", () => {
    sectionTubosTable.classList.add("d-none");
    sectionInforme.classList.remove("d-none");
  });
}

if (btnToggleTubos && sectionTubosTable && sectionInforme) {
  btnToggleTubos.addEventListener("click", () => {
    sectionInforme.classList.add("d-none");
    sectionTubosTable.classList.remove("d-none");
  });
}
