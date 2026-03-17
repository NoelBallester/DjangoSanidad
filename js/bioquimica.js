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

// Variables que se asignarán en DOMContentLoaded
let tuboInformeDescripcion = null;
let tuboInformeFecha = null;
let tuboInformeTincion = null;
let tuboInformeObservaciones = null;
let tuboInformeImagen = null;
let tuboInformePreviewWrap = null;
let tuboInformePreview = null;
let btnGuardarInforme = null;
const informeStatus = document.getElementById("informeStatus");
const informeContextNum = document.getElementById("informeContextNum");
const informeContextDescripcion = document.getElementById("informeContextDescripcion");
const INFORME_TAB_KEY = "bioquimica_active_tab";

const tuboImagen = document.getElementById("tubo__imagen");
const eliminarTuboModal = document.getElementById("eliminarTuboModal");

// Detalle Tubo
let currentTuboId = null;
let informeEditandoId = null;
let informeGuardando = false;
const btn__imprimrqr = document.getElementById("btn__imprimirqr");
const btn__imprimrqrAlt = document.getElementById("btn__imprimirqrtubo");

// Modal qr
const imgtubo__qr = document.getElementById("imgtubo__qr");
const inputtubo__qr = document.getElementById("inputtubo__qr");

// Todos los tubos
const todosTubos = document.getElementById("todosTubos");
const informesListaTubo = document.getElementById("informes_lista_tubo");
const btnNuevoInforme = document.getElementById("btnNuevoInforme");
const btnCancelarInforme = document.getElementById("btnCancelarInforme");
const modalNuevoInforme = document.getElementById("modalNuevoInforme");
const nuevoInformePanel = document.getElementById("nuevoInformePanel");

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
const btnformnuevaMuestra = document.getElementById("btnformnuevaMuestra");
const btnformcerrarnuevaMuestra = document.getElementById(
  "btnformcerrarnuevaMuestra"
);

const modalnuevaMuestra = document.getElementById("modalnuevaMuestra");

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
const btncerrarmuestradetalle = document.getElementById(
  "btncerrarmuestradetalle"
);
const btnaniadirimagenmuestra = document.getElementById(
  "btnaniadirimagenmuestra"
);

// Modificar análisis
const modificarMuestra = document.getElementById("modificarAnalysisForm");
const modalmodificarMuestra = document.getElementById("modalmodificarAnalysis");
const modaldetalleMuestra = document.getElementById("modaldetalleTubo");
const btnformmodificarMuestra = document.getElementById(
  "btnformmodificarMuestra"
);
const btnformcerrarmodificarMuestra = document.getElementById(
  "btnformcerrarmodificarMuestra"
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
const manualQrBtn = document.getElementById("manualQrBtn");
const qrConsultaModal = document.getElementById("qrConsultaModal");
let mimodal = new bootstrap.Modal(document.getElementById("qrConsultaModal"));
const qrResolverBase = "/qr/resolver/";
let html5QrInstance = null;
const QR_RENDER_SIZE = 220;

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

const buildResolverUrl = (code) => {
  if (!code) return "";
  return `${window.location.origin}${qrResolverBase}?code=${encodeURIComponent(code)}`;
};

const cerrarModalQrConsulta = () => {
  if (!qrConsultaModal || !window.bootstrap?.Modal) return;
  const modal = window.bootstrap.Modal.getInstance(qrConsultaModal) || new window.bootstrap.Modal(qrConsultaModal);
  modal.hide();
};

const resolverTextoEscaneado = async (text) => {
  const value = (text || "").trim();
  if (!value) return;

  let code = value;
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      const parsed = new URL(value);
      const codeParam = parsed.searchParams.get("code");
      if (codeParam) {
        code = codeParam;
      } else {
        window.location.href = value;
        return;
      }
    } catch (_) {
      window.location.href = value;
      return;
    }
  }

  if (await consultarTuboQR(code, true)) {
    cerrarModalQrConsulta();
    return;
  }
  if (await consultarMuestraQR(code, true)) {
    cerrarModalQrConsulta();
    return;
  }

  alert("No se encontró ningún registro para ese QR.");
};

const irConsultaQr = async () => {
  await resolverTextoEscaneado(input__consultarqr?.value || "");
};

window.irConsultaQr = irConsultaQr;

if (manualQrBtn) {
  manualQrBtn.onclick = irConsultaQr;
}

if (input__consultarqr) {
  input__consultarqr.onkeydown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      irConsultaQr();
    }
  };
}

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

function formatFecha(fechaStr) {
  if (!fechaStr) return "";
  return (
    fechaStr.substring(8) +
    "-" +
    fechaStr.substring(5, 7) +
    "-" +
    fechaStr.substring(0, 4)
  );
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
      alert("Error al crear el análisis: " + error.message);
    });
};

const cargarTodosTubos = async () => {
  return await fetch("/api/tubos/todos/").then((data) => data.json());
};

const cargarPorTipo = async () => {
  return await fetch(`/api/tubos/organo/${tipo_tubos.value}/`)
    .then((data) => data.json())
    .catch((error) => console.log("Error en cargarPorTipo: " + error));
};

const cargarPorNumero = async () => {
  return await fetch(`/api/tubos/numero/${numTubo.value}/`)
    .then((data) => data.json())
    .catch((error) => console.log("Error en cargarPorNumero: " + error));
};

const obtenerTubosFecha = async (fecha) => {
  const response = await fetch(`/api/tubos/fecha/${fecha}/`);
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
        alert("Error al eliminar el análisis");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al eliminar el análisis: " + error.message);
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

  const data = {};
  if (inputFechaUpdate.value) data.fecha = inputFechaUpdate.value;
  if (inputTuboUpdate.value) data.muestra = inputTuboUpdate.value;
  if (inputSelectUpdate.value) data.organo = inputSelectUpdate.value;
  if (inputDescripcionUpdate.value) data.descripcion = inputDescripcionUpdate.value;
  if (inputCaracteristicasUpdate.value) data.caracteristicas = inputCaracteristicasUpdate.value;
  if (inputObservacionesUpdate.value) data.observaciones = inputObservacionesUpdate.value;
  if (inputClinicaUpdate.value) data.informacion_clinica = inputClinicaUpdate.value;
  if (inputMicroscopiaUpdate.value) data.descripcion_microscopica = inputMicroscopiaUpdate.value;
  if (inputDiagnosticoUpdate.value) data.diagnostico_final = inputDiagnosticoUpdate.value;
  if (inputPatologoUpdate.value) data.patologo_responsable = inputPatologoUpdate.value;
  // Assuming qr_tubo is a new field and inputQRUpdate exists
  if (typeof inputQRUpdate !== 'undefined' && inputQRUpdate.value) data.qr_tubo = inputQRUpdate.value;
  data.tecnico = tecnicoId;

  await fetch(`/api/tubos/${tuboId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      if (response.ok) {
        console.log("Muestra actualizada");
        modalupdateTubo.classList.remove("showmodal");
        // En vez de recargar la página, actualizamos los datos
        actualizarVistaYLista(tuboId);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const mensaje = errorData.error || errorData.detail || JSON.stringify(errorData) || "Error desconocido";
        alert("Error al actualizar el análisis: " + mensaje);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al actualizar el análisis: " + error.message);
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
  if (!tuboId || !muestraId) {
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

  const data = {};
  if (inputmodificarfechaMuestra.value) data.fecha = inputmodificarfechaMuestra.value;
  if (inputmodificardescripcionMuestra.value) data.descripcion = inputmodificardescripcionMuestra.value;
  if (inputmodificarobservacionesMuestra.value) data.observaciones = inputmodificarobservacionesMuestra.value;
  if (selectmodificartincionMuestra.value) data.tincion = selectmodificartincionMuestra.value;
  data.tubo = tuboId; // El tubo padre sigue siendo necesario o al menos no molesta

  await fetch(`/api/muestrastubo/${muestraId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      if (response.ok) {
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
      } else {
        const errorData = await response.json().catch(() => ({}));
        const mensaje = errorData.error || errorData.detail || JSON.stringify(errorData) || "Error desconocido";
        alert("Error al actualizar la muestra: " + mensaje);
      }
    })
};

const consultaFechaInicio = async () => {
  alertfecha.classList.add("ocultar");
  mostrarEstadoSinSeleccion();
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
  mostrarEstadoSinSeleccion();
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

const mostrarEstadoSinSeleccion = () => {
  tuboId = null;
  muestraId = null;
  imageId = null;
  currentTuboId = null;

  const tuboNumElement = document.getElementById("tubo__tubo");
  if (tuboNumElement) {
    tuboNumElement.textContent = "";
  }

  tuboDescripcion.textContent = "Selecciona una cita para ver los detalles";
  tuboTipoMuestra.textContent = "";
  tuboTecnicoId.textContent = "";
  tuboFecha.textContent = "";
  tuboCaracteristicas.textContent = "";
  tuboObservaciones.textContent = "";

  if (tuboInformeDescripcion) tuboInformeDescripcion.value = "";
  if (tuboInformeFecha) tuboInformeFecha.value = "";
  if (tuboInformeTincion) tuboInformeTincion.value = "";
  if (tuboInformeObservaciones) tuboInformeObservaciones.value = "";
  if (tuboInformeImagen) tuboInformeImagen.value = "";

  muestras.innerHTML = "";
  const estado = document.createElement("span");
  estado.classList.add("fw-bold", "text-danger", "text-opacity-50");
  estado.textContent = "Selecciona una cita para ver los detalles";
  muestras.appendChild(estado);

  if (informeContextNum) informeContextNum.textContent = "—";
  if (informeContextDescripcion) informeContextDescripcion.textContent = "Selecciona una cita para ver los detalles";
  if (informeStatus) {
    informeStatus.classList.add("d-none");
    informeStatus.textContent = "";
  }

  ocultarPanelNuevoInformeTubo();

  if (btnNuevoInforme) {
    btnNuevoInforme.disabled = true;
    btnNuevoInforme.title = "Selecciona una muestra para crear un informe";
  }

  if (informesListaTubo) {
    informesListaTubo.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">Selecciona una cita para ver los informes.</td></tr>';
  }
};

const cargarInformesTubo = async (idTubo) => {
  const response = await fetch(`/api/informesresultado/tubo/${idTubo}/`);
  return await response.json();
};

const cargarInformeEnFormularioTubo = (informe) => {
  if (tuboInformeDescripcion) tuboInformeDescripcion.value = informe.descripcion || "";
  if (tuboInformeFecha) tuboInformeFecha.value = informe.fecha || "";
  if (tuboInformeTincion) tuboInformeTincion.value = informe.tincion || "";
  if (tuboInformeObservaciones) tuboInformeObservaciones.value = informe.observaciones || "";
  actualizarPreviewInformeTubo(informe.informe_imagen_url || informe.imagen_url || informe.imagen_base64 || "");
  mostrarEstadoInforme("Informe cargado en el formulario.", "info");
};

const obtenerUrlInformeTubo = (informe) => {
  if (!informe) return "";
  if (informe.imagen_url) return informe.imagen_url;
  if (informe.informe_imagen_url) return informe.informe_imagen_url;
  if (informe.imagen_base64) return `data:application/octet-stream;base64,${informe.imagen_base64}`;
  return "";
};

window.verInformeBioquimica = (url) => {
  if (!url) {
    mostrarEstadoInforme("Este informe no tiene archivo adjunto.", "warning");
    return;
  }
  window.open(url, "_blank", "noopener");
};

window.verInfoInformeBioquimica = async (informeId) => {
  if (!informeId) return;
  try {
    const res = await fetch(`/api/informesresultado/${informeId}/`);
    if (!res.ok) throw new Error("No se pudo cargar la informacion del informe");
    const informe = await res.json();
    const host = informesListaTubo?.closest('.informe__scroll');
    if (!host) return;

    let panel = document.getElementById('infoInformePanelBioquimica');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'infoInformePanelBioquimica';
      panel.className = 'mb-3 p-3 rounded';
      panel.style.background = 'var(--bg-light)';
      panel.style.border = '1px solid var(--border-color)';
      panel.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="tubo__title m-0">Detalle del informe</h3>
          <button type="button" class="btn btn-outline-secondary btn-sm" id="cerrarInfoInformeBioquimica">Cerrar</button>
        </div>
        <div class="blue__color"><strong>Fecha:</strong> <span data-field="fecha">-</span></div>
        <div class="blue__color mt-2"><strong>Descripcion:</strong> <span data-field="descripcion">-</span></div>
        <div class="blue__color mt-2"><strong>Tincion:</strong> <span data-field="tincion">-</span></div>
        <div class="blue__color mt-2"><strong>Observaciones:</strong></div>
        <div class="blue__color mt-1" data-field="observaciones">-</div>
      `;
      const tableWrap = informesListaTubo.closest('.table__scroll');
      host.insertBefore(panel, tableWrap);
      panel.querySelector('#cerrarInfoInformeBioquimica').addEventListener('click', () => {
        panel.classList.add('d-none');
      });
    }

    panel.querySelector('[data-field="fecha"]').textContent = informe.fecha ? formatFecha(informe.fecha) : 'Sin fecha';
    panel.querySelector('[data-field="descripcion"]').textContent = informe.descripcion || 'Sin descripcion';
    panel.querySelector('[data-field="tincion"]').textContent = informe.tincion || 'Sin resultado';
    panel.querySelector('[data-field="observaciones"]').textContent = informe.observaciones || 'Sin observaciones';
    panel.classList.remove('d-none');
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    console.error(error);
    mostrarEstadoInforme("No se pudo cargar la informacion del informe.", "danger");
  }
};

window.editarInformeBioquimica = async (informeId) => {
  const targetId = currentTuboId || tuboId;
  if (!targetId || !informeId) return;
  const informes = await cargarInformesTubo(targetId);
  const informe = informes.find((item) => String(item.id_informe) === String(informeId));
  if (!informe) return;
  informeEditandoId = String(informe.id_informe);
  actualizarEtiquetaBotonInforme();
  cargarInformeEnFormularioTubo(informe);
  mostrarPanelNuevoInformeTubo(false);
};

window.eliminarInformeBioquimica = async (informeId) => {
  const targetId = currentTuboId || tuboId;
  if (!targetId || !informeId) return;
  if (!confirm("¿Eliminar este informe?")) return;

  try {
    await borrarInformeTubo(informeId);
    mostrarEstadoInforme("Informe eliminado correctamente.", "success");
    await refrescarInformesTubo(targetId);
  } catch (error) {
    console.error(error);
    mostrarEstadoInforme("Error al eliminar el informe.", "danger");
  }
};

window.guardarInformeBioquimica = async () => {
  const targetId = currentTuboId || tuboId;
  if (!targetId) {
    mostrarEstadoInforme("Selecciona una cita para guardar el informe.", "warning");
    return;
  }
  if (informeGuardando) return;
  informeGuardando = true;
  cambiarEstadoBotonGuardar(true);

  try {
    mostrarEstadoInforme("Guardando informe...", "info");
    const descripcion = document.getElementById("tubo__informe_descripcion")?.value || "";
    const fecha = document.getElementById("tubo__informe_fecha")?.value || "";
    const tincion = document.getElementById("tubo__informe_tincion")?.value || "";
    const observaciones = document.getElementById("tubo__informe_observaciones")?.value || "";
    const inputFile = document.getElementById("tubo__informe_imagen");
    const payload = { descripcion, fecha, tincion, observaciones, tubo: targetId };

    if (inputFile && inputFile.files && inputFile.files[0]) {
      payload.imagen = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result || "");
        reader.onerror = () => reject(new Error("Error al leer el archivo"));
        reader.readAsDataURL(inputFile.files[0]);
      });
    }

    const isEdit = Boolean(informeEditandoId);
    const endpoint = isEdit ? `/api/informesresultado/${informeEditandoId}/` : "/api/informesresultado/";
    const res = await fetch(endpoint, {
      method: isEdit ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "No se pudo guardar el informe");
    }
    mostrarEstadoInforme(isEdit ? "Informe actualizado correctamente." : "Informe guardado correctamente.", "success");
    informeEditandoId = null;
    actualizarEtiquetaBotonInforme();
    if (inputFile) inputFile.value = "";
    ocultarPanelNuevoInformeTubo();
    await refrescarInformesTubo(targetId);
  } catch (error) {
    console.error(error);
    mostrarEstadoInforme(error.message || "Error al guardar el informe.", "danger");
  } finally {
    informeGuardando = false;
    cambiarEstadoBotonGuardar(false);
  }
};

const borrarInformeTubo = async (informeId) => {
  await fetch(`/api/informesresultado/${informeId}/`, {
    method: "DELETE",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
};

const imprimirInformesTubo = (informes) => {
  if (!informesListaTubo) return;
  informesListaTubo.innerHTML = "";

  if (!informes || informes.length === 0) {
    informesListaTubo.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">No hay informes registrados.</td></tr>';
    return;
  }

  const fragmento = document.createDocumentFragment();
  informes.forEach((informe) => {
    const urlInforme = obtenerUrlInformeTubo(informe);
    const tieneArchivo = Boolean(obtenerUrlInformeTubo(informe));
    const tr = document.createElement("tr");
    tr.classList.add("table__row");

    const tdFecha = document.createElement("td");
    tdFecha.textContent = informe.fecha ? formatFecha(informe.fecha) : "Sin fecha";

    const tdDescripcion = document.createElement("td");
    tdDescripcion.textContent = (informe.descripcion || "").substring(0, 70) || "Sin descripción";
    tdDescripcion.title = informe.descripcion || "";

    const tdTincion = document.createElement("td");
    tdTincion.textContent = informe.tincion || "Sin resultado";

    const tdAcciones = document.createElement("td");
    tdAcciones.classList.add("text-end");
    tdAcciones.innerHTML = `
      <i class="fa-solid fa-circle-info tubo__icon tubo__icon--infotubo me-2" title="Ver datos del formulario" data-action="info" data-id="${informe.id_informe}"></i>
      <i class="fa-solid fa-file-import tubo__icon tubo__icon--infotubo me-2 ${tieneArchivo ? '' : 'text-muted'}" title="Ver informe" data-action="ver" data-id="${informe.id_informe}" data-url="${urlInforme || ''}"></i>
      <i class="fa-solid fa-file-pen tubo__icon tubo__icon--infotubo me-2" title="Editar informe" data-action="cargar" data-id="${informe.id_informe}"></i>
      <i class="fa-solid fa-trash-can tubo__icon tubo__icon--infotubo" title="Eliminar informe" data-action="eliminar" data-id="${informe.id_informe}"></i>
    `;

    tr.appendChild(tdFecha);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdTincion);
    tr.appendChild(tdAcciones);
    fragmento.appendChild(tr);
  });

  informesListaTubo.appendChild(fragmento);
};

const refrescarInformesTubo = async (idTubo) => {
  if (!idTubo) {
    imprimirInformesTubo([]);
    return;
  }
  const informes = await cargarInformesTubo(idTubo);
  imprimirInformesTubo(informes);
  return informes;
};

const limpiarFormularioInformeTubo = () => {
  informeEditandoId = null;
  actualizarEtiquetaBotonInforme();
  if (tuboInformeDescripcion) tuboInformeDescripcion.value = "";
  if (tuboInformeFecha) tuboInformeFecha.value = "";
  if (tuboInformeTincion) tuboInformeTincion.value = "";
  if (tuboInformeObservaciones) tuboInformeObservaciones.value = "";
  if (tuboInformeImagen) tuboInformeImagen.value = "";
  actualizarPreviewInformeTubo("");
};

const actualizarPreviewInformeTubo = (imagen) => {
  if (!tuboInformePreviewWrap || !tuboInformePreview) return;
  if (!imagen) {
    tuboInformePreview.src = "";
    tuboInformePreviewWrap.classList.add("d-none");
    return;
  }
  tuboInformePreview.src = imagen.startsWith("data:") || imagen.startsWith("http") || imagen.startsWith("/")
    ? imagen
    : `data:image/jpeg;base64,${imagen}`;
  tuboInformePreviewWrap.classList.remove("d-none");
};

const mostrarPanelNuevoInformeTubo = (limpiar = true) => {
  if (!modalNuevoInforme) return;
  if (limpiar) limpiarFormularioInformeTubo();
  modalNuevoInforme.classList.remove("d-none");
  modalNuevoInforme.classList.add("d-flex");
};

const ocultarPanelNuevoInformeTubo = () => {
  if (!modalNuevoInforme) return;
  informeEditandoId = null;
  actualizarEtiquetaBotonInforme();
  modalNuevoInforme.classList.add("d-none");
  modalNuevoInforme.classList.remove("d-flex");
};

const actualizarContextoInforme = () => {
  const num = document.getElementById("tubo__tubo")?.textContent?.trim() || "—";
  const descripcion = (tuboDescripcion?.textContent || "").trim() || "Selecciona una cita para ver los detalles";
  if (informeContextNum) informeContextNum.textContent = num;
  if (informeContextDescripcion) informeContextDescripcion.textContent = descripcion;
};

const mostrarEstadoInforme = (mensaje, tipo = "success") => {
  if (!informeStatus) return;
  informeStatus.className = `alert alert-${tipo} py-2 px-3 mb-3`;
  informeStatus.textContent = mensaje;
};

const actualizarEtiquetaBotonInforme = () => {
  if (!btnGuardarInforme || informeGuardando) return;
  btnGuardarInforme.innerHTML = informeEditandoId
    ? '<i class="fa-solid fa-pen-to-square me-2"></i> Actualizar Informe'
    : '<i class="fa-solid fa-save me-2"></i> Guardar Informe';
};

const cambiarEstadoBotonGuardar = (guardando) => {
  if (!btnGuardarInforme) return;
  if (guardando) {
    btnGuardarInforme.disabled = true;
    btnGuardarInforme.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Guardando informe...';
  } else {
    btnGuardarInforme.disabled = false;
    actualizarEtiquetaBotonInforme();
  }
};

const imprimirTubos = (respuesta, rebuildDropdown = true) => {
  tubos.innerHTML = "";
  if (rebuildDropdown) {
    numTubo.innerHTML = "<option selected value=''>Nº Muestra</option>";
  }

  let fragmento = document.createDocumentFragment();
  let fragmentselect = document.createDocumentFragment();
  if (respuesta.length > 0) {
    respuesta.map((tubo) => {
      // Para cargar los números de tubo
      let option = document.createElement("OPTION");
      option.value = tubo.muestra;
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
        "d-inline-block tubo__icon fa-solid fa-eye tubo__icon--infotubo";
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
  const icon = event.target.closest("i.fa-eye");
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
  if (btnNuevoInforme) {
    btnNuevoInforme.disabled = false;
    btnNuevoInforme.removeAttribute("title");
  }
  actualizarContextoInforme();
  refrescarInformesTubo(currentTuboId);
  console.log("imprimirDataTubo - currentTuboId asignado como:", currentTuboId, "respuesta completa:", respuesta);

  // generamos el codigo QR (sistema antiguo con QRious para compatibilidad)
  if (window.QRious) {
    const qrCode = respuesta.qr_tubo || respuesta.qr_muestra;
    new QRious({
      element: document.querySelector("#imgtubo__qr"),
      value: buildResolverUrl(qrCode),
      size: QR_RENDER_SIZE,
      background: "#ffffff",
      backgroundAlpha: 1,
      foreground: "#000000",
      level: "H",
    });
  }

  // Sistema nuevo: generar QR con QRCode.js para el modal moderno
  if (typeof QRCode !== 'undefined') {
    const qrCode = respuesta.qr_tubo || respuesta.qr_muestra;
    const qrUrl = buildResolverUrl(qrCode);
    if (typeof tuboQrActual !== 'undefined') {
      tuboQrActual = qrUrl;
    }
    const qrUrlEl = document.getElementById('qrcode-tubo-url');
    if (qrUrlEl) qrUrlEl.textContent = qrUrl;
    
    // Generar QR en el modal cuando se abre
    const modalEl = document.getElementById('qrTuboModal');
    if (modalEl) {
      modalEl.addEventListener('shown.bs.modal', function generarQr() {
        const qrWrap = document.getElementById('qrcode-tubo');
        if (qrWrap && qrUrl) {
          qrWrap.innerHTML = '';
          new QRCode(qrWrap, { text: qrUrl, width: 220, height: 220 });
        }
        modalEl.removeEventListener('shown.bs.modal', generarQr);
      }, { once: true });
    }
  }
};

// Crear nuevo análisis
const crearMuestra = async (event) => {
  event.preventDefault();
  console.log("=== crearMuestra EJECUTADA ===");
  console.log("tuboId:", tuboId);
  
  if (!tuboId) {
    alert("Por favor, selecciona una muestra primero.");
    return;
  }
  
  let newMuestra = new FormData();
  newMuestra.append("descripcion", inputdescripcionMuestra.value);
  newMuestra.append("fecha", inputFechaMuestra.value);
  newMuestra.append("observaciones", inputObservacionesMuestra.value);
  newMuestra.append("tincion", selectTincionMuestra.value);
  if (inputImagenesMuestra.files[0]) {
    newMuestra.append("imagen", inputImagenesMuestra.files[0]);
  }
  newMuestra.append("tubo", tuboId);
  
  console.log("Datos para FormData:");
  for (let [key, value] of newMuestra.entries()) {
    console.log(`  ${key}:`, value);
  }
  
  try {
    const response = await fetch("/api/muestrastubo/", {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: newMuestra,
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      alert("Error al crear análisis: " + JSON.stringify(errorData));
      return;
    }
    
    const data = await response.json();
    console.log("Análisis creado exitosamente:", data);
    
    modalnuevaMuestra.classList.remove("showmodal");
    modalnuevaMuestra.classList.add("hidemodal");
    limpiarModalMuestra();
    let muestras_resp = await cargarMuestras(tuboId);
    imprimirMuestras(muestras_resp);
    alert("Análisis creado correctamente");
  } catch (err) {
    console.error("Error en fetch:", err);
    alert("Error al crear análisis: " + err.message);
  }
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
      btn.style.whiteSpace = "nowrap";

      let btndetalle = document.createElement("I");
      btndetalle.className =
        "d-inline-block tubo__icon fa-solid fa-eye tubo__icon--infotubo me-2";
      btndetalle.dataset.id = muestra.id_muestra;
      btndetalle.dataset.action = "view";
      btndetalle.title = "Ver detalle";

      let btneditar = document.createElement("I");
      btneditar.className =
        "d-inline-block tubo__icon fa-solid fa-file-pen tubo__icon--infotubo me-2";
      btneditar.dataset.id = muestra.id_muestra;
      btneditar.dataset.action = "edit";
      btneditar.title = "Modificar muestra";

      let btneliminar = document.createElement("I");
      btneliminar.className =
        "d-inline-block tubo__icon fa-solid fa-trash-can text-danger";
      btneliminar.dataset.id = muestra.id_muestra;
      btneliminar.dataset.action = "delete";
      btneliminar.title = "Eliminar muestra";

      btn.appendChild(btndetalle);
      btn.appendChild(btneditar);
      btn.appendChild(btneliminar);

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

// Obtenemos un análisis
const cargarMuestra = async (muestraid) => {
  const response = await fetch(`/api/muestrastubo/${muestraid}/`);
  return await response.json();
};

// Obtenemos las imágenes de un análisis
const obtenerImagenesMuestra = async (muestraid) => {
  const response = await fetch(`/api/imagenestubo/muestra/${muestraid}/`);
  return await response.json();
};

// Rellenamos los datos del análisis
const rellenarDatosMuestra = async (muestra) => {
  muestra__descripcion.textContent = muestra.descripcion || 'Sin descripción';
  muestra__descripcion.title = muestra.descripcion;

  let newfecha = muestra.fecha;
  if (newfecha) {
    muestra__fecha.textContent =
      newfecha.substring(8) +
      "-" +
      newfecha.substring(5, 7) +
      "-" +
      newfecha.substring(0, 4);
  } else {
    muestra__fecha.textContent = 'Sin fecha';
  }

  muestra__observaciones.textContent = muestra.observaciones || 'Sin observaciones';
  muestra__tincion.textContent = muestra.tincion || 'Sin tinción';
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

  // Generamos el código QR (sistema antiguo con QRious para compatibilidad)
  if (window.QRious) {
    new QRious({
      element: imgmuestra__qr,
      value: buildResolverUrl(muestra.qr_muestra),
      size: QR_RENDER_SIZE,
      background: "#ffffff",
      backgroundAlpha: 1,
      foreground: "#000000",
      level: "H",
    });
  }

  // Sistema nuevo: preparar QR para modal moderno
  if (typeof QRCode !== 'undefined' && typeof muestraQrActual !== 'undefined') {
    const qrUrl = buildResolverUrl(muestra.qr_muestra);
    muestraQrActual = qrUrl;
    const qrUrlEl = document.getElementById('qrcode-muestra-url');
    if (qrUrlEl) qrUrlEl.textContent = qrUrl;
    
    // Configurar generación de QR cuando se abre el modal
    const modalEl = document.getElementById('qrMuestraModal');
    if (modalEl) {
      const generarQr = function() {
        const qrWrap = document.getElementById('qrcode-muestra');
        if (qrWrap && qrUrl) {
          qrWrap.innerHTML = '';
          new QRCode(qrWrap, { text: qrUrl, width: 220, height: 220 });
        }
      };
      modalEl.removeEventListener('shown.bs.modal', generarQr);
      modalEl.addEventListener('shown.bs.modal', generarQr, { once: true });
    }
  }

  // Mostramos las imágenes del análisis
  mostrarImagenesMuestra(muestraId);

  modaldetalleMuestra.classList.add("showmodal");
  modaldetalleMuestra.classList.remove("hidemodal");
};

const aniadirImagenMuestra = async () => {
  try {
    // Crear un input file temporal
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      let newImage = new FormData();
      newImage.append("imagen", file);
      newImage.append("muestra", muestraId);

      console.log("Subiendo imagen para muestra:", muestraId);

      const response = await fetch("/api/imagenestubo/", {
        method: "POST",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: newImage,
      });

      if (response.ok) {
        console.log("Imagen subida exitosamente");
        await mostrarImagenesMuestra(muestraId);
      } else {
        console.error("Error al subir imagen:", response.status);
        alert("Error al subir la imagen");
      }
    };

    // Abrir el selector de archivos
    input.click();
  } catch (err) {
    console.error("Error en aniadirImagenMuestra:", err);
    alert("Error al añadir imagen: " + err.message);
  }
};

const imprimirQR = (elemento) => {
  let qrimprimir;
  if (elemento == "tubo") {
    if (imgtubo__qr?.src) {
      qrimprimir = imgtubo__qr.src;
    } else if (imgtubo__qr?.toDataURL) {
      qrimprimir = imgtubo__qr.toDataURL();
    }
  } else {
    if (elemento == "muestra") {
      if (imgmuestra__qr?.src) {
        qrimprimir = imgmuestra__qr.src;
      } else if (imgmuestra__qr?.toDataURL) {
        qrimprimir = imgmuestra__qr.toDataURL();
      }
    }
  }

  if (!qrimprimir) {
    alert("No hay QR generado para imprimir todavía.");
    return;
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
  const visorImagen = typeof visor__img !== 'undefined' ? visor__img : document.getElementById("visor__img");

  const renderEstadoSinImagen = () => {
    muestra__img.style.display = "flex";
    muestra__img.classList.add("muestra__galeria--vacia");
    imageId = null;

    if (visorImagen) {
      visorImagen.src = "./assets/images/no_disponible.jpg";
      visorImagen.classList.add("visor__img--empty");
      visorImagen.alt = "Sin imagen disponible";
    }

    const emptyState = document.createElement("div");
    emptyState.className = "muestra__empty-state";
    emptyState.innerHTML = "<span class='muestra__empty-title'>Sin imagen adjunta</span><span class='muestra__empty-text'>Esta muestra no tiene ninguna vista previa disponible.</span>";
    muestra__img.appendChild(emptyState);
  };

  // Imagen de sustitución si no hay imágenes
  if (imagenes.length == 0) {
    renderEstadoSinImagen();
  } else {
    muestra__img.style.display = "flex";
    muestra__img.classList.remove("muestra__galeria--vacia");
    if (visorImagen) {
      visorImagen.classList.remove("visor__img--empty");
      visorImagen.alt = "Vista previa de la muestra";
    }
    imagenes.forEach((imagen, index) => {
      let newimg = document.createElement("IMG");
      newimg.id = imagen.id_imagen;
      newimg.src = imagen.imagen_url || (imagen.imagen_base64 ? `data:image/jpeg;base64,${imagen.imagen_base64}` : "");

      newimg.classList.add("muestra__img");

      if (index == 0) {
        if (visorImagen) visorImagen.src = newimg.src;
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

const consultarTuboQR = async (qr, silent = false) => {
  const response = await fetch(`/api/tubos/qr/${encodeURIComponent(qr)}/`);
  let tubo = await response.json();
  if (tubo.length > 0) {
    imprimirTubos(tubo);
    tubo = tubo[0];
    imprimirDataTubo(tubo);
    tuboId = tubo.id_muestra;
    let muestras_resp = await cargarMuestras(tuboId);
    imprimirMuestras(muestras_resp);
    return true;
  } else {
    if (!silent) alert("No se encontró ningún tubo con ese QR");
    return false;
  }
};

const consultarMuestraQR = async (qr, silent = false) => {
  let response = await fetch(`/api/muestrastubo/qr/${encodeURIComponent(qr)}/`);
  let muestra = await response.json();
  if (muestra.length > 0) {
    let tubo_response = await fetch(`/api/tubos/${muestra[0].tubo}/`);
    let tubo = await tubo_response.json();
    await consultarTuboQR(tubo.qr_tubo || tubo.qr_muestra, true);
    await detailMuestra(muestra[0].id_muestra);
    return true;
  } else {
    if (!silent) alert("No se encontró ningún análisis");
    return false;
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

// Guardar Informe de Resultados - SERÁ DEFINIDA EN DOMCONTENTLOADED

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
  console.log("=== DOMContentLoaded EJECUTADO ===");
  
  // Asignar elementos globales que podrían no existir al cargar el script
  btnGuardarInforme = document.getElementById("btnGuardarInforme");
  tuboInformeDescripcion = document.getElementById("tubo__informe_descripcion");
  tuboInformeFecha = document.getElementById("tubo__informe_fecha");
  tuboInformeTincion = document.getElementById("tubo__informe_tincion");
  tuboInformeObservaciones = document.getElementById("tubo__informe_observaciones");
  tuboInformeImagen = document.getElementById("tubo__informe_imagen");
  tuboInformePreviewWrap = document.getElementById("tubo__informe_preview_wrap");
  tuboInformePreview = document.getElementById("tubo__informe_preview");
  
  console.log("btnGuardarInforme encontrado:", btnGuardarInforme ? "SÍ" : "NO");
  console.log("Elementos de informe encontrados:", {
    descripcion: tuboInformeDescripcion ? "SÍ" : "NO",
    fecha: tuboInformeFecha ? "SÍ" : "NO",
    tincion: tuboInformeTincion ? "SÍ" : "NO",
    observaciones: tuboInformeObservaciones ? "SÍ" : "NO",
    imagen: tuboInformeImagen ? "SÍ" : "NO"
  });
  
  body.style.display = "block";
  const respuesta = await cargarTubosIndex();
  imprimirTubos(respuesta);
  mostrarEstadoSinSeleccion();
  let fechaActual = new Date().toISOString().split("T")[0];
  // Para que no se pueda seleccionar una fecha anterior a la actual
  // Se elimina la restricción de fecha mínima para permitir fechas pasadas
  // inputFecha.setAttribute("min", fechaActual);
  // inputFechaUpdate.setAttribute("min", fechaActual);
  // inputFechaMuestra.setAttribute("min", fechaActual);

  // Toggle section views
  const sectionTubosTable = document.getElementById("sectionTubos");
  const sectionInforme = document.getElementById("sectionInforme");
  const btnToggleInforme = document.getElementById("btnToggleInforme");
  const btnToggleTubos = document.getElementById("btnToggleTubos");
  const panelInforme = sectionInforme ? sectionInforme.firstElementChild : null;
  const scrollInternosInforme = sectionInforme
    ? sectionInforme.querySelectorAll(".informe__scroll, .table__scroll, .table__scroll--m")
    : [];

  const abrirMenuInformes = () => {
    if (!sectionTubosTable || !sectionInforme) return;
    sectionTubosTable.classList.add("d-none");
    sectionInforme.classList.remove("d-none");
    sectionInforme.classList.add(
      "d-flex",
      "align-items-center",
      "justify-content-center",
      "position-fixed",
      "top-0",
      "start-0",
      "w-100",
      "h-100"
    );
    sectionInforme.style.zIndex = "2147483600";
    sectionInforme.style.background = "rgba(255, 255, 255, 0.92)";
    sectionInforme.style.padding = "1rem";
    sectionInforme.style.overflowY = "auto";

    if (panelInforme) {
      panelInforme.style.maxWidth = "1100px";
      panelInforme.style.width = "100%";
      panelInforme.style.maxHeight = "none";
      panelInforme.style.overflowY = "visible";
      panelInforme.style.margin = "0";
    }

    scrollInternosInforme.forEach((el) => {
      el.style.height = "auto";
      el.style.maxHeight = "none";
      el.style.overflow = "visible";
      el.style.overflowY = "visible";
    });
    sessionStorage.setItem(INFORME_TAB_KEY, "informe");
    actualizarContextoInforme();
  };

  const cerrarMenuInformes = () => {
    if (!sectionTubosTable || !sectionInforme) return;
    sectionInforme.classList.add("d-none");
    sectionInforme.classList.remove(
      "d-flex",
      "align-items-center",
      "justify-content-center",
      "position-fixed",
      "top-0",
      "start-0",
      "w-100",
      "h-100"
    );
    sectionInforme.style.zIndex = "";
    sectionInforme.style.background = "";
    sectionInforme.style.padding = "";
    sectionInforme.style.overflowY = "";

    if (panelInforme) {
      panelInforme.style.maxWidth = "";
      panelInforme.style.width = "";
      panelInforme.style.maxHeight = "";
      panelInforme.style.overflowY = "";
      panelInforme.style.margin = "";
    }

    scrollInternosInforme.forEach((el) => {
      el.style.height = "";
      el.style.maxHeight = "";
      el.style.overflow = "";
      el.style.overflowY = "";
    });

    sectionTubosTable.classList.remove("d-none");
    sessionStorage.setItem(INFORME_TAB_KEY, "muestras");
  };

  if (btnToggleInforme && sectionTubosTable && sectionInforme) {
    btnToggleInforme.addEventListener("click", () => {
      abrirMenuInformes();
    });
  }

  if (btnToggleTubos && sectionTubosTable && sectionInforme) {
    btnToggleTubos.addEventListener("click", () => {
      cerrarMenuInformes();
    });
  }

  // Detectar cambio de módulo y limpiar estado si es necesario
  const CURRENT_MODULE_KEY = "current_module";
  const currentModule = "bioquimica";
  const lastModule = sessionStorage.getItem(CURRENT_MODULE_KEY);
  
  // Siempre limpiar el estado de informe al cargar la página
  // El estado se guardará si el usuario navega dentro del módulo
  sessionStorage.removeItem(INFORME_TAB_KEY);
  
  // Guardar módulo actual
  sessionStorage.setItem(CURRENT_MODULE_KEY, currentModule);

  if (btnNuevoInforme) {
    btnNuevoInforme.addEventListener("click", () => {
      if (!(currentTuboId || tuboId)) {
        mostrarEstadoInforme("Selecciona una muestra antes de crear un informe.", "warning");
        return;
      }
      mostrarPanelNuevoInformeTubo(true);
    });
  }

  if (tuboInformeImagen) {
    tuboInformeImagen.addEventListener("change", () => {
      const file = tuboInformeImagen.files && tuboInformeImagen.files[0];
      if (!file) {
        actualizarPreviewInformeTubo("");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => actualizarPreviewInformeTubo(reader.result || "");
      reader.readAsDataURL(file);
    });
  }

  if (btnCancelarInforme) {
    btnCancelarInforme.addEventListener("click", () => {
      ocultarPanelNuevoInformeTubo();
    });
  }

  if (modalNuevoInforme) {
    modalNuevoInforme.addEventListener("click", (event) => {
      if (event.target === modalNuevoInforme) {
        ocultarPanelNuevoInformeTubo();
      }
    });
  }

  // Consulta por Tipo de Muestra
  tipo_tubos.addEventListener("change", async () => {
    mostrarEstadoSinSeleccion();
    if (!tipo_tubos.value || tipo_tubos.value === "" || tipo_tubos.value === "*") {
      if (numTubo) numTubo.value = "";
      if (fechainicio) fechainicio.value = "";
      if (fechafin) fechafin.value = "";
      const respuesta = await cargarTodosTubos();
      imprimirTubos(respuesta, true);
    } else {
      if (numTubo) numTubo.value = "";
      const respuesta = await cargarPorTipo();
      imprimirTubos(respuesta, true);
    }
  });

  // Consulta por Número de Tubo
  numTubo.addEventListener("change", async () => {
    mostrarEstadoSinSeleccion();
    if (!numTubo.value || numTubo.value === "") {
      const respuesta = await cargarTodosTubos();
      imprimirTubos(respuesta, true);
      tipo_tubos.value = "";
      return;
    }

    tipo_tubos.value = "";
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
    mostrarEstadoSinSeleccion();
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
    if (!modalupdateTubo.classList.contains("showmodal")) {
      cargarTuboUpdateModal();
      modalupdateTubo.classList.add("showmodal");
      modalupdateTubo.classList.remove("hidemodal");
      modalupdateTubo.style.display = "flex";
    }
  });

  btnformcerrarmodificarTubo.addEventListener("click", () => {
    if (!modalupdateTubo.classList.contains("hidemodal")) {
      modalupdateTubo.classList.add("hidemodal");
      modalupdateTubo.classList.remove("showmodal");
      setTimeout(() => {
        modalupdateTubo.style.display = "none";
      }, 300);
    }
  });

  modificarTubo.addEventListener("submit", modificarTuboUpdate);

  eliminarTuboModal.addEventListener("show.bs.modal", (event) => {
    tuboId = event.relatedTarget.dataset.id || tuboId;
  });

  btnborrar.addEventListener("click", borrarTubo);

  qrMuestraModal.addEventListener("show.bs.modal", (event) => {
    imgmuestra__qr.src = `data:image/svg+xml;base64,`;
  });

  qrMuestraModal.addEventListener("show.bs.modal", (event) => {
    imgmuestra__qr.src = `data:image/svg+xml;base64,`;
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

  if (btnformcerrarnuevaMuestra) {
    btnformcerrarnuevaMuestra.addEventListener("click", () => {
      if (!modalnuevaMuestra.classList.contains("hidemodal")) {
        modalnuevaMuestra.classList.add("hidemodal");
        modalnuevaMuestra.classList.remove("showmodal");
      }
    });
  }

  if (btncerrardetalleMuestra) {
    btncerrardetalleMuestra.addEventListener("click", () => {
      if (!modaldetalleMuestra.classList.contains("hidemodal")) {
        modaldetalleMuestra.classList.add("hidemodal");
        modaldetalleMuestra.classList.remove("showmodal");
      }
      muestra__img.innerHTML = "";
    });
  }

  if (btncerrarmuestradetalle) {
    btncerrarmuestradetalle.addEventListener("click", () => {
      if (!modaldetalleMuestra.classList.contains("hidemodal")) {
        modaldetalleMuestra.classList.add("hidemodal");
        modaldetalleMuestra.classList.remove("showmodal");
      }
      muestra__img.innerHTML = "";
    });
  }

  if (btnborrarmuestra) {
    btnborrarmuestra.addEventListener("click", () => {
      if (confirm("¿Estás seguro de eliminar esta muestra?")) {
        borrarMuestra();
      }
    });
  }

  if (btnaniadirimagenmuestra) {
    btnaniadirimagenmuestra.addEventListener("click", () => {
      aniadirImagenMuestra();
    });
  }

  nuevaMuestra.addEventListener("submit", crearMuestra);

  // Modificar Análisis
  if (btnformmodificarMuestra) {
    btnformmodificarMuestra.addEventListener("click", () => {
      if (!tuboId || !muestraId) {
        alerttubo.classList.remove("ocultar");
      } else {
        cargarMuestraUpdateModal();
        if (!modalmodificarMuestra.classList.contains("showmodal")) {
          modalmodificarMuestra.classList.add("showmodal");
          modalmodificarMuestra.classList.remove("hidemodal");
          modalmodificarMuestra.style.display = "flex";
        }
      }
    });
  }

  if (btnformcerrarmodificarMuestra) {
    btnformcerrarmodificarMuestra.addEventListener("click", () => {
      if (!modalmodificarMuestra.classList.contains("hidemodal")) {
        modalmodificarMuestra.classList.add("hidemodal");
        modalmodificarMuestra.classList.remove("showmodal");
        setTimeout(() => {
          modalmodificarMuestra.style.display = "none";
        }, 300);
      }
    });
  }

  // Consulta Detalle Análisis
  muestras.addEventListener("click", async (event) => {
    const icon = event.target.closest("i[data-action]");
    if (!icon) return;

    const id = icon.dataset.id;
    const action = icon.dataset.action;
    if (!id || !action) return;

    if (action === "view") {
      detailMuestra(id);
      return;
    }

    muestraId = id;

    if (action === "edit") {
      if (!tuboId || !muestraId) {
        alerttubo.classList.remove("ocultar");
        return;
      }
      await cargarMuestraUpdateModal();
      if (!modalmodificarMuestra.classList.contains("showmodal")) {
        modalmodificarMuestra.classList.add("showmodal");
        modalmodificarMuestra.classList.remove("hidemodal");
        modalmodificarMuestra.style.display = "flex";
      }
      return;
    }

    if (action === "delete") {
      if (confirm("¿Estás seguro de eliminar esta muestra?")) {
        await borrarMuestra();
      }
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

  // Lectura código QR del análisis (ahora se maneja inline en la plantilla para mayor fiabilidad)


  input__consultarqr?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      resolverTextoEscaneado(input__consultarqr.value);
    }
  });

  manualQrBtn?.addEventListener("click", () => {
    resolverTextoEscaneado(input__consultarqr?.value || "");
  });

  // Impresión QR principal y de análisis
  btn__imprimrqr?.addEventListener("click", () => imprimirQR("tubo"));
  btn__imprimrqrAlt?.addEventListener("click", () => imprimirQR("tubo"));
  btn__imprimirqrmuestra?.addEventListener("click", () => imprimirQR("muestra"));

  // Guardar Informe de Resultados
  const guardarInformeMedico = async () => {
    console.log("=== FUNCIÓN guardarInformeMedico EJECUTADA ===");
    console.log("currentTuboId:", currentTuboId);
    
    if (!currentTuboId) {
      console.error("ERROR: No hay tuboId seleccionado");
      mostrarEstadoInforme("Selecciona una cita para guardar el informe.", "warning");
      return;
    }

    mostrarEstadoInforme("Guardando informe...", "info");
    cambiarEstadoBotonGuardar(true);

    console.log("Datos a enviar:");
    console.log("- informe_descripcion:", tuboInformeDescripcion.value);
    console.log("- informe_fecha:", tuboInformeFecha.value);
    console.log("- informe_tincion:", tuboInformeTincion.value);
    console.log("- informe_observaciones:", tuboInformeObservaciones.value);

    const datosReporte = {
      descripcion: tuboInformeDescripcion.value,
      fecha: tuboInformeFecha.value,
      tincion: tuboInformeTincion.value,
      observaciones: tuboInformeObservaciones.value,
      tubo: currentTuboId,
    };

    // Procesar imagen si existe
    if (tuboInformeImagen.files.length > 0) {
      console.log("Hay imagen para procesar");
      const file = tuboInformeImagen.files[0];
      console.log("Archivo:", file.name, "Tipo:", file.type, "Tamaño:", file.size);
      
      // Usar una Promise para esperar a que se lea la imagen
      await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          console.log("Imagen convertida a base64, longitud:", reader.result.length);
          console.log("Primeros 100 caracteres:", reader.result.substring(0, 100));
          datosReporte.imagen = reader.result;
          resolve();
        };
        reader.onerror = () => {
          console.error("Error al leer la imagen");
          reject(new Error("Error al leer la imagen"));
        };
      });
    } else {
      console.log("No hay imagen, enviando sin imagen");
    }
    
    console.log("datosReporte final antes de enviar:", {
      ...datosReporte,
      imagen: datosReporte.imagen ? `[BASE64 de ${datosReporte.imagen.length} caracteres]` : null
    });
    
    await guardarInformeAlBackend(datosReporte);
  };

  const guardarInformeAlBackend = async (datosReporte) => {
    console.log("=== Enviando datos al backend ===");
    console.log("URL:", `/api/informesresultado/`);
    console.log("imagen existe en datosReporte:", "imagen" in datosReporte);
    console.log("Tamaño de imagen:", datosReporte.imagen ? datosReporte.imagen.length : "null");
    
    // Para debugging, crear una copia sin la imagen para mostrar
    const datosParaMostrar = {
      ...datosReporte,
      imagen: datosReporte.imagen ? `[BASE64 de ${datosReporte.imagen.length} caracteres]` : null
    };
    console.log("Datos (sin imagen completa):", datosParaMostrar);
    
    try {
      const res = await fetch(`/api/informesresultado/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify(datosReporte),
      });

      console.log("Response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Respuesta OK:", data);
        mostrarEstadoInforme("Informe guardado correctamente.", "success");
        if (tuboInformeImagen) tuboInformeImagen.value = "";
        ocultarPanelNuevoInformeTubo();
        await refrescarInformesTubo(currentTuboId);
      } else {
        console.error("Error en respuesta:", res.status, res.statusText);
        const errorData = await res.json();
        console.error("Error data:", errorData);
        mostrarEstadoInforme("Error al guardar el informe.", "danger");
      }
    } catch (error) {
      console.error("Error de fetch:", error);
      mostrarEstadoInforme("Error al guardar el informe de resultados.", "danger");
    } finally {
      cambiarEstadoBotonGuardar(false);
    }
  };

  if (btnGuardarInforme) {
    console.log("=== Asignando listener a btnGuardarInforme ===");
    console.log("btnGuardarInforme:", btnGuardarInforme);
    console.log("Tipo de elemento:", btnGuardarInforme.tagName);
    console.log("ID del elemento:", btnGuardarInforme.id);
    
    btnGuardarInforme.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("=== CLICK EN BOTÓN EJECUTADO ===");
      console.log("Event:", event);
      window.guardarInformeBioquimica();
    });
  } else {
    console.error("=== ERROR: btnGuardarInforme NO ENCONTRADO ===");
  }

  if (informesListaTubo) {
    informesListaTubo.addEventListener("click", async (event) => {
      const target = event.target.closest("i[data-action]");
      if (!target) return;
      const action = target.dataset.action;
      const informeId = target.dataset.id;
      if (!informeId) return;

      if (action === "info") {
        event.preventDefault();
        await window.verInfoInformeBioquimica(informeId);
        return;
      }

      if (!currentTuboId) return;

      const informes = await cargarInformesTubo(currentTuboId);
      const informe = informes.find((item) => String(item.id_informe) === String(informeId));
      if (!informe) return;

      if (action === "cargar") {
        informeEditandoId = String(informe.id_informe);
        actualizarEtiquetaBotonInforme();
        cargarInformeEnFormularioTubo(informe);
        mostrarPanelNuevoInformeTubo(false);
      }

      if (action === "ver") {
        const urlInforme = obtenerUrlInformeTubo(informe);
        if (!urlInforme) {
          mostrarEstadoInforme("Este informe no tiene archivo adjunto.", "warning");
          return;
        }
        window.open(urlInforme, "_blank", "noopener");
      }

      if (action === "eliminar") {
        if (!confirm("¿Eliminar este informe?")) return;
        await borrarInformeTubo(informeId);
        mostrarEstadoInforme("Informe eliminado correctamente.", "success");
        await refrescarInformesTubo(currentTuboId);
      }
    });
  }
});
