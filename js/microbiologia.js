const inputNumMicrobiologia = document.getElementById("inputNumMicrobiologia");
const token = sessionStorage.getItem("token");

const body = document.getElementById("body");
const microbiologias = document.getElementById("microbiologias_lista");  // tabla de muestras principales
const muestras = document.getElementById("microbiologias");  // tabla de microbiologias/análisis
const tipo_microbiologias = document.getElementById("tipo_microbiologias");
const numMicrobiologia = document.getElementById("numMicrobiologia");

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
const modalnuevoMicrobiologia = document.getElementById("modalnuevoMicrobiologia");
const btnformnuevomicrobiologia = document.getElementById("btnformnuevomicrobiologia");
const btnformmodificarmicrobiologia = document.getElementById(
  "btnformmodificarmicrobiologia"
);
const btnformcerrarnuevoMicrobiologia = document.getElementById(
  "btnformcerrarnuevoMicrobiologia"
);
const btnformcerrarmodificarMicrobiologia = document.getElementById(
  "btnformcerrarmodificarMicrobiologia"
);
const btnmodificar = document.getElementById("btnmodificar");
const nuevoMicrobiologia = document.getElementById("nuevoMicrobiologia");
const nuevaMuestra = document.getElementById("nuevaMuestra");

const microbiologiaDescripcion = document.getElementById("microbiologia__descripcionMain");
const microbiologiaTipoMuestra = document.getElementById("microbiologia__tipo_microbiologiaMain");
const microbiologiaMicrobiologia = document.getElementById("microbiologia__muestraMain");
const microbiologiaFecha = document.getElementById("microbiologia__fechaMain");
const microbiologiaTecnicoId = document.getElementById("microbiologia__tecnico_idMain");
const microbiologiaCaracteristicas = document.getElementById(
  "microbiologia__caracteristicasMain"
);
const microbiologiaObservaciones = document.getElementById(
  "microbiologia__observacionesMain"
);

// Variables que se asignarán en DOMContentLoaded
let microbiologiaInformeDescripcion = null;
let microbiologiaInformeFecha = null;
let microbiologiaInformeTincion = null;
let microbiologiaInformeObservaciones = null;
let microbiologiaInformeImagen = null;
let microbiologiaInformePreviewWrap = null;
let microbiologiaInformePreview = null;
let btnGuardarInforme = null;
const informeStatus = document.getElementById("informeStatus");
const informeContextNum = document.getElementById("informeContextNum");
const informeContextDescripcion = document.getElementById("informeContextDescripcion");
const INFORME_TAB_KEY = "microbiologia_active_tab";

const microbiologiaImagen = document.getElementById("microbiologia__imagen");
const eliminarMicrobiologiaModal = document.getElementById("eliminarMicrobiologiaModal");

// Detalle Microbiologia
let currentMicrobiologiaId = null;
const btn__imprimrqr = document.getElementById("btn__imprimirqr");

// Modal qr
const imgmicrobiologia__qr = document.getElementById("imgmicrobiologia__qr");
const inputmicrobiologia__qr = document.getElementById("inputmicrobiologia__qr");

// Todos los microbiologias
const todosMicrobiologias = document.getElementById("todosMicrobiologias");
const informesListaMicrobiologia = document.getElementById("informes_lista_microbiologia");
const btnNuevoInforme = document.getElementById("btnNuevoInforme");
const btnCancelarInforme = document.getElementById("btnCancelarInforme");
const modalNuevoInforme = document.getElementById("modalNuevoInforme");
const nuevoInformePanel = document.getElementById("nuevoInformePanel");

// Nuevo Microbiologia (Muestra)
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
const inputMicrobiologia = document.getElementById("inputMicrobiologia");

// Modificar Microbiologia
const modalupdateMicrobiologia = document.getElementById("modalupdateMicrobiologiaMain");
const modificarMicrobiologia = document.getElementById("modificarMicrobiologiaFormMain");
const btnmodificarmicrobiologia = document.getElementById("btnformmodificarmicrobiologiaMain");
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
const inputMicrobiologiaUpdate = document.getElementById("inputMicrobiologiaUpdate");

// Crear un análisis (Microbiologias)
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
const modaldetalleMuestra = document.getElementById("modaldetalleMicrobiologia");
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
const qrConsultaModal = document.getElementById("qrConsultaModal");
let mimodal = new bootstrap.Modal(document.getElementById("qrConsultaModal"));

// Fecha inicio fin para consultas
const fechainicio = document.getElementById("fechainicio");
const fechafin = document.getElementById("fechafin");

// Alert error
const alertmicrobiologia = document.getElementById("alertmicrobiologia");
const alertfecha = document.getElementById("alertfecha");
const alertfecha_text = document.getElementById("alertfecha_text");

// id del microbiologia de trabajo
let microbiologiaId = null;

// qr microbiologia
let microbiologiaqr = null;

// id análisis del microbiologia
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

function formatearFecha(fechaStr) {
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

// Carga Microbiologias al inicio
const cargarMicrobiologiasIndex = async () => {
  return await fetch("/api/microbiologias/index/").then(data => data.json());
};

// Carga el detalle del microbiologia seleccionado
const cargarMicrobiologia = async (microbiologiaId) => {
  return await fetch(`/api/microbiologias/${microbiologiaId}/`).then(data => data.json());
};

const crearMicrobiologia = async (event) => {
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
    muestra: inputMicrobiologia.value,
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

  fetch("/api/microbiologias/", {
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
      nuevoMicrobiologia.reset();
      // Cerrar modal
      modalnuevoMicrobiologia.classList.remove("showmodal");
      modalnuevoMicrobiologia.classList.add("hidemodal");

      // En vez de recargar la página, actualizamos los datos
      const respuesta = await cargarTodosMicrobiologias();
      imprimirMicrobiologias(respuesta);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al crear la muestra: " + error.message);
    });
};

const cargarTodosMicrobiologias = async () => {
  return await fetch("/api/microbiologias/todos/").then((data) => data.json());
};

const cargarPorTipo = async () => {
  return await fetch(`/api/microbiologias/organo/${tipo_microbiologias.value}/`)
    .then((data) => data.json())
    .catch((error) => console.log("Error en cargarPorTipo: " + error));
};

const cargarPorNumero = async () => {
  return await fetch(`/api/microbiologias/numero/${numMicrobiologia.value}/`)
    .then((data) => data.json())
    .catch((error) => console.log("Error en cargarPorNumero: " + error));
};

const obtenerMicrobiologiasFecha = async (fecha) => {
  const response = await fetch(`/api/microbiologias/fecha/${fecha}/`);
  return await response.json();
};

const obtenerMicrobiologiasFechaRango = async (inicio, fin) => {
  const response = await fetch(`/api/microbiologias/rango_fechas/?inicio=${inicio}&fin=${fin}`);
  return await response.json();
};

const borrarMicrobiologia = () => {
  fetch(`/api/microbiologias/${microbiologiaId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    }
  })
    .then((response) => {
      if (response.ok) {
        console.log("Muestra eliminada");
        eliminarMicrobiologiaModal.classList.remove("showmodal");
        eliminarMicrobiologiaModal.classList.add("hidemodal");
        setTimeout(() => {
          location.href = "microbiologia.html";
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

const cargarMicrobiologiaUpdateModal = async (event) => {
  if (!microbiologiaId) {
    if (event) event.preventDefault();
    alertmicrobiologia.classList.remove("ocultar");
  } else {
    let microbiologia = await cargarMicrobiologia(microbiologiaId);
    inputDescripcionUpdate.value = microbiologia.descripcion;
    inputFechaUpdate.value = microbiologia.fecha;
    inputCaracteristicasUpdate.value = microbiologia.caracteristicas;
    inputObservacionesUpdate.value = microbiologia.observaciones;
    inputClinicaUpdate.value = microbiologia.informacion_clinica || "";
    inputMicroscopiaUpdate.value = microbiologia.descripcion_microscopica || "";
    inputDiagnosticoUpdate.value = microbiologia.diagnostico_final || "";
    inputPatologoUpdate.value = microbiologia.patologo_responsable || "";
    inputSelectUpdate.value = microbiologia.organo;
    inputMicrobiologiaUpdate.value = microbiologia.muestra;
  }
};

const modificarMicrobiologiaUpdate = async (event) => {
  event.preventDefault();

  const tecnicoId = sessionStorage.getItem("tecnico_id");
  if (!tecnicoId) {
    alert("Error: Usuario no autenticado. Por favor inicia sesión nuevamente.");
    return;
  }

  const data = {
    microbiologia: inputMicrobiologiaUpdate.value,
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

  await fetch(`/api/microbiologias/${microbiologiaId}/`, {
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
        modalupdateMicrobiologia.classList.remove("showmodal");
        // En vez de recargar la página, actualizamos los datos
        actualizarVistaYLista(microbiologiaId);
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
  let microbiologia = await cargarMicrobiologia(id);
  imprimirDataMicrobiologia(microbiologia);
  const respuesta = await cargarTodosMicrobiologias();
  imprimirMicrobiologias(respuesta);
};

const cargarMuestras = async (microbiologiaId) => {
  return await fetch(`/api/muestrasmicrobiologia/microbiologia/${microbiologiaId}/`).then((data) => data.json());
};

const limpiarModalMuestra = () => {
  inputdescripcionMuestra.value = "";
  inputFechaMuestra.value = "";
  inputObservacionesMuestra.value = "";
  selectTincionMuestra.value = "";
  inputImagenesMuestra.value = "";
};

const cargarMuestraUpdateModal = async (event) => {
  if (!microbiologiaId || !muestraId) {
    if (event) event.preventDefault();
    alertmicrobiologia.classList.remove("ocultar");
  } else {
    const response = await fetch(`/api/muestrasmicrobiologia/${muestraId}/`);
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
    microbiologia: microbiologiaId
  };

  await fetch(`/api/muestrasmicrobiologia/${muestraId}/`, {
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
      let respuesta = await cargarMuestras(microbiologiaId);
      imprimirMuestras(respuesta);

      modalmodificarMuestra.classList.remove("showmodal");
      modalmodificarMuestra.classList.add("hidemodal");
    })
};

const consultaFechaInicio = async () => {
  alertfecha.classList.add("ocultar");
  mostrarEstadoSinSeleccion();
  let respuesta;
  if (!fechafin.value) {
    respuesta = await obtenerMicrobiologiasFecha(fechainicio.value);
  } else {
    if (new Date(fechainicio.value) > new Date(fechafin.value)) {
      alertfecha.classList.add("ocultar");
      alertfecha_text.textContent = "La fecha de inicio debe ser menor";
      alertfecha.classList.remove("ocultar");
    } else {
      alertfecha.classList.add("ocultar");
      respuesta = await obtenerMicrobiologiasFechaRango(
        fechainicio.value,
        fechafin.value
      );
    }
  }
  imprimirMicrobiologias(respuesta, false);
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
      const respuesta = await obtenerMicrobiologiasFechaRango(
        fechainicio.value,
        fechafin.value
      );
      imprimirMicrobiologias(respuesta, false);
    }
  }
};

const mostrarEstadoSinSeleccion = () => {
  microbiologiaId = null;
  muestraId = null;
  imageId = null;
  currentMicrobiologiaId = null;

  const microbiologiaNumElement = document.getElementById("microbiologia__microbiologia");
  if (microbiologiaNumElement) {
    microbiologiaNumElement.textContent = "";
  }

  microbiologiaDescripcion.textContent = "Selecciona una cita para ver los detalles";
  microbiologiaTipoMuestra.textContent = "";
  microbiologiaTecnicoId.textContent = "";
  microbiologiaFecha.textContent = "";
  microbiologiaCaracteristicas.textContent = "";
  microbiologiaObservaciones.textContent = "";

  if (microbiologiaInformeDescripcion) microbiologiaInformeDescripcion.value = "";
  if (microbiologiaInformeFecha) microbiologiaInformeFecha.value = "";
  if (microbiologiaInformeTincion) microbiologiaInformeTincion.value = "";
  if (microbiologiaInformeObservaciones) microbiologiaInformeObservaciones.value = "";
  if (microbiologiaInformeImagen) microbiologiaInformeImagen.value = "";

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

  ocultarPanelNuevoInformeMicrobiologia();

  if (informesListaMicrobiologia) {
    informesListaMicrobiologia.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">Selecciona una cita para ver los informes.</td></tr>';
  }
};

const cargarInformesMicrobiologia = async (idMicrobiologia) => {
  const response = await fetch(`/api/informesresultado/microbiologia/${idMicrobiologia}/`);
  return await response.json();
};

const cargarInformeEnFormularioMicrobiologia = (informe) => {
  if (microbiologiaInformeDescripcion) microbiologiaInformeDescripcion.value = informe.descripcion || "";
  if (microbiologiaInformeFecha) microbiologiaInformeFecha.value = informe.fecha || "";
  if (microbiologiaInformeTincion) microbiologiaInformeTincion.value = informe.tincion || "";
  if (microbiologiaInformeObservaciones) microbiologiaInformeObservaciones.value = informe.observaciones || "";
  actualizarPreviewInformeMicrobiologia(informe.imagen_base64 || "");
  mostrarEstadoInforme("Informe cargado en el formulario.", "info");
};

const borrarInformeMicrobiologia = async (informeId) => {
  await fetch(`/api/informesresultado/${informeId}/`, {
    method: "DELETE",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
};

const imprimirInformesMicrobiologia = (informes) => {
  if (!informesListaMicrobiologia) return;
  informesListaMicrobiologia.innerHTML = "";

  if (!informes || informes.length === 0) {
    informesListaMicrobiologia.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">No hay informes registrados.</td></tr>';
    return;
  }

  const fragmento = document.createDocumentFragment();
  informes.forEach((informe) => {
    const tr = document.createElement("tr");
    tr.classList.add("table__row");

    const tdFecha = document.createElement("td");
    tdFecha.textContent = informe.fecha ? formatearFecha(informe.fecha) : "Sin fecha";

    const tdDescripcion = document.createElement("td");
    tdDescripcion.textContent = (informe.descripcion || "").substring(0, 70) || "Sin descripción";
    tdDescripcion.title = informe.descripcion || "";

    const tdTincion = document.createElement("td");
    tdTincion.textContent = informe.tincion || "Sin resultado";

    const tdAcciones = document.createElement("td");
    tdAcciones.classList.add("text-end");
    tdAcciones.innerHTML = `
      <i class="fa-solid fa-file-import microbiologia__icon microbiologia__icon--infomicrobiologia me-2" title="Cargar en formulario" data-action="cargar" data-id="${informe.id_informe}"></i>
      <i class="fa-solid fa-trash-can microbiologia__icon microbiologia__icon--infomicrobiologia" title="Eliminar informe" data-action="eliminar" data-id="${informe.id_informe}"></i>
    `;

    tr.appendChild(tdFecha);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdTincion);
    tr.appendChild(tdAcciones);
    fragmento.appendChild(tr);
  });

  informesListaMicrobiologia.appendChild(fragmento);
};

const refrescarInformesMicrobiologia = async (idMicrobiologia) => {
  if (!idMicrobiologia) {
    imprimirInformesMicrobiologia([]);
    return;
  }
  const informes = await cargarInformesMicrobiologia(idMicrobiologia);
  imprimirInformesMicrobiologia(informes);
  return informes;
};

const limpiarFormularioInformeMicrobiologia = () => {
  if (microbiologiaInformeDescripcion) microbiologiaInformeDescripcion.value = "";
  if (microbiologiaInformeFecha) microbiologiaInformeFecha.value = "";
  if (microbiologiaInformeTincion) microbiologiaInformeTincion.value = "";
  if (microbiologiaInformeObservaciones) microbiologiaInformeObservaciones.value = "";
  if (microbiologiaInformeImagen) microbiologiaInformeImagen.value = "";
  actualizarPreviewInformeMicrobiologia("");
};

const actualizarPreviewInformeMicrobiologia = (imagen) => {
  if (!microbiologiaInformePreviewWrap || !microbiologiaInformePreview) return;
  if (!imagen) {
    microbiologiaInformePreview.src = "";
    microbiologiaInformePreviewWrap.classList.add("d-none");
    return;
  }
  microbiologiaInformePreview.src = imagen.startsWith("data:image") ? imagen : `data:image/jpeg;base64,${imagen}`;
  microbiologiaInformePreviewWrap.classList.remove("d-none");
};

const mostrarPanelNuevoInformeMicrobiologia = (limpiar = true) => {
  if (!modalNuevoInforme) return;
  if (limpiar) limpiarFormularioInformeMicrobiologia();
  modalNuevoInforme.classList.remove("d-none");
  modalNuevoInforme.classList.add("d-flex");
};

const ocultarPanelNuevoInformeMicrobiologia = () => {
  if (!modalNuevoInforme) return;
  modalNuevoInforme.classList.add("d-none");
  modalNuevoInforme.classList.remove("d-flex");
};

const actualizarContextoInforme = () => {
  const num = document.getElementById("microbiologia__microbiologia")?.textContent?.trim() || "—";
  const descripcion = (microbiologiaDescripcion?.textContent || "").trim() || "Selecciona una cita para ver los detalles";
  if (informeContextNum) informeContextNum.textContent = num;
  if (informeContextDescripcion) informeContextDescripcion.textContent = descripcion;
};

const mostrarEstadoInforme = (mensaje, tipo = "success") => {
  if (!informeStatus) return;
  informeStatus.className = `alert alert-${tipo} py-2 px-3 mb-3`;
  informeStatus.textContent = mensaje;
};

const cambiarEstadoBotonGuardar = (guardando) => {
  if (!btnGuardarInforme) return;
  if (guardando) {
    btnGuardarInforme.disabled = true;
    btnGuardarInforme.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Guardando informe...';
  } else {
    btnGuardarInforme.disabled = false;
    btnGuardarInforme.innerHTML = '<i class="fa-solid fa-save me-2"></i> Guardar Informe de Resultados';
  }
};

const imprimirMicrobiologias = (respuesta, rebuildDropdown = true) => {
  microbiologias.innerHTML = "";
  if (rebuildDropdown) {
    numMicrobiologia.innerHTML = "<option selected value=''>Nº Muestra</option>";
  }

  let fragmento = document.createDocumentFragment();
  let fragmentselect = document.createDocumentFragment();
  if (respuesta.length > 0) {
    respuesta.map((microbiologia) => {
      // Para cargar los números de microbiologia
      let option = document.createElement("OPTION");
      option.value = microbiologia.muestra;
      option.textContent = microbiologia.muestra;
      fragmentselect.appendChild(option);

      // Para mostrar los microbiologias
      let tr = document.createElement("tr");
      tr.classList.add("table__row");

      // Muestra / Paciente
      let nmicrobiologia = document.createElement("td");
      nmicrobiologia.textContent = microbiologia.muestra;

      let fecha = document.createElement("td");
      let newfecha = microbiologia.fecha;

      fecha.textContent =
        newfecha.substring(8) +
        "-" +
        newfecha.substring(5, 7) +
        "-" +
        newfecha.substring(0, 4);

      let descripcion = document.createElement("td");
      descripcion.textContent = microbiologia.descripcion.substring(0, 50);
      descripcion.title = microbiologia.descripcion;

      let tipo_muestra = document.createElement("td");
      tipo_muestra.textContent = microbiologia.tipo_muestra;

      let btndetalle = document.createElement("I");
      btndetalle.className =
        "d-inline-block microbiologia__icon fa-solid fa-file-invoice microbiologia__icon--infomicrobiologia icono__efect";
      btndetalle.dataset.id = microbiologia.id_muestra;
      btndetalle.title = "Detalle Muestra";

      let btnCont = document.createElement("td");
      btnCont.appendChild(btndetalle);

      tr.appendChild(nmicrobiologia);
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

  microbiologias.appendChild(fragmento);
  if (rebuildDropdown) {
    numMicrobiologia.appendChild(fragmentselect);
  }
};

// Peticiones al seleccionar un microbiologia
const detalleMicrobiologia = async (event) => {
  const icon = event.target.closest("i.fa-file-invoice");
  if (icon) {
    alertmicrobiologia.classList.add("ocultar");
    microbiologiaId = icon.dataset.id;

    let respuesta = await cargarMicrobiologia(microbiologiaId);
    imprimirDataMicrobiologia(respuesta);

    let muestras_resp = await cargarMuestras(microbiologiaId);
    imprimirMuestras(muestras_resp);
  }
};

// Muestra el detalle de un microbiologia
const imprimirDataMicrobiologia = (respuesta) => {
  microbiologiaDescripcion.textContent = respuesta.descripcion;
  microbiologiaTipoMuestra.textContent = respuesta.tipo_muestra;
  // microbiologiaMicrobiologia.textContent = respuesta.muestra; // Element doesn't exist in HTML
  microbiologiaTecnicoId.textContent = respuesta.tecnico;

  // Show the muestra/paciente number in the header
  const microbiologiaNumElement = document.getElementById("microbiologia__microbiologia");
  if (microbiologiaNumElement) {
    microbiologiaNumElement.textContent = respuesta.muestra;
  }

  // Formato Fecha
  let newfecha = respuesta.fecha;
  if (newfecha) {
    microbiologiaFecha.textContent =
      newfecha.substring(8) +
      "-" +
      newfecha.substring(5, 7) +
      "-" +
      newfecha.substring(0, 4);
  } else {
    microbiologiaFecha.textContent = "";
  }

  microbiologiaCaracteristicas.textContent = respuesta.caracteristicas;
  microbiologiaObservaciones.textContent = respuesta.observaciones;

  microbiologiaInformeDescripcion.value = respuesta.informe_descripcion || "";
  microbiologiaInformeFecha.value = respuesta.informe_fecha || "";
  microbiologiaInformeTincion.value = respuesta.informe_tincion || "";
  microbiologiaInformeObservaciones.value = respuesta.informe_observaciones || "";
  currentMicrobiologiaId = respuesta.id_muestra;
  actualizarContextoInforme();
  refrescarInformesMicrobiologia(currentMicrobiologiaId);
  console.log("imprimirDataMicrobiologia - currentMicrobiologiaId asignado como:", currentMicrobiologiaId, "respuesta completa:", respuesta);

  // generamos el codigo QR
  if (window.QRious) {
    new QRious({
      element: document.querySelector("#imgmicrobiologia__qr"),
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
  console.log("=== crearMuestra EJECUTADA ===");
  console.log("microbiologiaId:", microbiologiaId);

  if (!microbiologiaId) {
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
  newMuestra.append("microbiologia", microbiologiaId);

  console.log("Datos para FormData:");
  for (let [key, value] of newMuestra.entries()) {
    console.log(`  ${key}:`, value);
  }

  try {
    const response = await fetch("/api/muestrasmicrobiologia/", {
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
    let muestras_resp = await cargarMuestras(microbiologiaId);
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
      let btndetalle = document.createElement("I");
      btndetalle.className =
        "d-inline-block microbiologia__icon fa-solid fa-file-invoice microbiologia__icon--infomicrobiologia icono__efect";
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
  const response = await fetch(`/api/muestrasmicrobiologia/${muestraid}/`);
  return await response.json();
};

// Obtenemos las imágenes de un análisis
const obtenerImagenesMuestra = async (muestraid) => {
  const response = await fetch(`/api/imagenesmicrobiologia/muestra/${muestraid}/`);
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
    fetch(`/api/imagenesmicrobiologia/${imageId}/`, {
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
    // Crear un input file temporal
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      let newImage = new FormData();
      newImage.append("imagen", file);
      newImage.append("muestra", muestraId);

      console.log("Subiendo imagen para muestra:", muestraId);

      const response = await fetch("/api/imagenesmicrobiologia/", {
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
  if (elemento == "microbiologia") {
    qrimprimir = imgmicrobiologia__qr.src;
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
    muestra__img.style.display = "none";
    if (typeof visor__img !== 'undefined') visor__img.src = "./assets/images/no_disponible.jpg";
  } else {
    muestra__img.style.display = "flex";
    imagenes.forEach((imagen, index) => {
      let newimg = document.createElement("IMG");
      newimg.id = imagen.id_imagen;
      newimg.src = `data:image/jpeg;base64,${imagen.imagen_base64}`;

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
  fetch(`/api/muestrasmicrobiologia/${muestraId}/`, {
    method: "DELETE",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  })
    .then(async () => {
      modaldetalleMuestra.classList.remove("showmodal");
      let muestras = await cargarMuestras(microbiologiaId);
      imprimirMuestras(muestras);
    }).catch(err => console.error(err));
};

const consultarMicrobiologiaQR = async (qr) => {
  const response = await fetch(`/api/microbiologias/por_qr/?qr=${qr}`);
  let microbiologia = await response.json();
  if (microbiologia.length > 0) {
    imprimirMicrobiologias(microbiologia);
    microbiologia = microbiologia[0];
    imprimirDataMicrobiologia(microbiologia);
    microbiologiaId = microbiologia.id_muestra;
    let muestras_resp = await cargarMuestras(microbiologiaId);
    imprimirMuestras(muestras_resp);
  } else {
    alert("No se encontró ningún microbiologia con ese QR");
  }
};

const consultarMuestraQR = async (qr) => {
  let response = await fetch(`/api/muestrasmicrobiologia/por_qr/?qr=${qr}`);
  let muestra = await response.json();
  if (muestra.length > 0) {
    let microbiologia_response = await fetch(`/api/microbiologias/${muestra[0].microbiologia}/`);
    let microbiologia = await microbiologia_response.json();
    consultarMicrobiologiaQR(microbiologia.qr_muestra);
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

// Consulta Microbiologias Recientes
document.addEventListener("DOMContentLoaded", async () => {
  console.log("=== DOMContentLoaded EJECUTADO ===");

  // Asignar elementos globales que podrían no existir al cargar el script
  btnGuardarInforme = document.getElementById("btnGuardarInforme");
  microbiologiaInformeDescripcion = document.getElementById("microbiologia__informe_descripcion");
  microbiologiaInformeFecha = document.getElementById("microbiologia__informe_fecha");
  microbiologiaInformeTincion = document.getElementById("microbiologia__informe_tincion");
  microbiologiaInformeObservaciones = document.getElementById("microbiologia__informe_observaciones");
  microbiologiaInformeImagen = document.getElementById("microbiologia__informe_imagen");
  microbiologiaInformePreviewWrap = document.getElementById("microbiologia__informe_preview_wrap");
  microbiologiaInformePreview = document.getElementById("microbiologia__informe_preview");

  console.log("btnGuardarInforme encontrado:", btnGuardarInforme ? "SÍ" : "NO");
  console.log("Elementos de informe encontrados:", {
    descripcion: microbiologiaInformeDescripcion ? "SÍ" : "NO",
    fecha: microbiologiaInformeFecha ? "SÍ" : "NO",
    tincion: microbiologiaInformeTincion ? "SÍ" : "NO",
    observaciones: microbiologiaInformeObservaciones ? "SÍ" : "NO",
    imagen: microbiologiaInformeImagen ? "SÍ" : "NO"
  });

  body.style.display = "block";
  const respuesta = await cargarMicrobiologiasIndex();
  imprimirMicrobiologias(respuesta);
  mostrarEstadoSinSeleccion();
  let fechaActual = new Date().toISOString().split("T")[0];
  // Para que no se pueda seleccionar una fecha anterior a la actual
  inputFecha.setAttribute("min", fechaActual);
  inputFechaUpdate.setAttribute("min", fechaActual);
  inputFechaMuestra.setAttribute("min", fechaActual);

  // Toggle section views
  const sectionMicrobiologiasTable = document.getElementById("sectionMicrobiologias");
  const sectionInforme = document.getElementById("sectionInforme");
  const btnToggleInforme = document.getElementById("btnToggleInforme");
  const btnToggleMicrobiologias = document.getElementById("btnToggleMicrobiologias");
  const panelInforme = sectionInforme ? sectionInforme.firstElementChild : null;
  const scrollInternosInforme = sectionInforme
    ? sectionInforme.querySelectorAll(".informe__scroll, .table__scroll, .table__scroll--m")
    : [];

  const abrirMenuInformes = () => {
    if (!sectionMicrobiologiasTable || !sectionInforme) return;
    sectionMicrobiologiasTable.classList.add("d-none");
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
    sectionInforme.style.background = "rgba(2, 8, 23, 0.92)";
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

    localStorage.setItem(INFORME_TAB_KEY, "informe");
    actualizarContextoInforme();
  };

  const cerrarMenuInformes = () => {
    if (!sectionMicrobiologiasTable || !sectionInforme) return;
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

    sectionMicrobiologiasTable.classList.remove("d-none");
    localStorage.setItem(INFORME_TAB_KEY, "muestras");
  };

  if (btnToggleInforme && sectionMicrobiologiasTable && sectionInforme) {
    btnToggleInforme.addEventListener("click", () => {
      abrirMenuInformes();
    });
  }

  if (btnToggleMicrobiologias && sectionMicrobiologiasTable && sectionInforme) {
    btnToggleMicrobiologias.addEventListener("click", () => {
      cerrarMenuInformes();
    });
  }

  const tabActiva = localStorage.getItem(INFORME_TAB_KEY);
  if (tabActiva === "informe" && sectionMicrobiologiasTable && sectionInforme) {
    abrirMenuInformes();
  }

  if (btnNuevoInforme) {
    btnNuevoInforme.addEventListener("click", () => {
      mostrarPanelNuevoInformeMicrobiologia(true);
    });
  }

  if (microbiologiaInformeImagen) {
    microbiologiaInformeImagen.addEventListener("change", () => {
      const file = microbiologiaInformeImagen.files && microbiologiaInformeImagen.files[0];
      if (!file) {
        actualizarPreviewInformeMicrobiologia("");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => actualizarPreviewInformeMicrobiologia(reader.result || "");
      reader.readAsDataURL(file);
    });
  }

  if (btnCancelarInforme) {
    btnCancelarInforme.addEventListener("click", () => {
      ocultarPanelNuevoInformeMicrobiologia();
    });
  }

  if (modalNuevoInforme) {
    modalNuevoInforme.addEventListener("click", (event) => {
      if (event.target === modalNuevoInforme) {
        ocultarPanelNuevoInformeMicrobiologia();
      }
    });
  }

  // Consulta por Tipo de Muestra
  tipo_microbiologias.addEventListener("change", async () => {
    mostrarEstadoSinSeleccion();
    // Si está vacío o es "Todos", cargar todo
    if (!tipo_microbiologias.value || tipo_microbiologias.value === "" || tipo_microbiologias.value === "*") {
      if (numMicrobiologia) numMicrobiologia.value = "";
      if (fechainicio) fechainicio.value = "";
      if (fechafin) fechafin.value = "";
      // Cargar todos y reconstruir dropdown
      const respuesta = await cargarTodosMicrobiologias();
      imprimirMicrobiologias(respuesta, true);
    } else {
      // Solo limpiar número si selecciona un tipo específico
      if (numMicrobiologia) numMicrobiologia.value = "";
      const respuesta = await cargarPorTipo();
      imprimirMicrobiologias(respuesta, true); // Reconstruir dropdown con los resultados filtrados
    }
  });

  // Consulta por Número de Microbiologia
  numMicrobiologia.addEventListener("change", async () => {
    mostrarEstadoSinSeleccion();
    // Permitir volver a la primera opción (vacía)
    if (!numMicrobiologia.value || numMicrobiologia.value === "") {
      // Si selecciona la opción inicial, cargar todos
      const respuesta = await cargarTodosMicrobiologias();
      imprimirMicrobiologias(respuesta, true);
      tipo_microbiologias.value = "";
      return;
    }
    
    // Si selecciona un número específico, limpiar el filtro de tipo
    tipo_microbiologias.value = "";
    const respuesta = await cargarPorNumero();
    imprimirMicrobiologias(respuesta, false);
  });

  // Consulta Detalle Microbiologia y Análisis
  microbiologias.addEventListener("click", detalleMicrobiologia);

  // Consulta por fecha
  fechainicio.addEventListener("change", consultaFechaInicio);

  fechafin.addEventListener("change", consultaFechaFin);

  // Todos los microbiologias
  todosMicrobiologias.addEventListener("click", async () => {
    mostrarEstadoSinSeleccion();
    const respuesta = await cargarTodosMicrobiologias();
    imprimirMicrobiologias(respuesta);
  });

  // Crear nuevos Microbiologias
  btnformnuevomicrobiologia.addEventListener("click", () => {
    if (!modalnuevoMicrobiologia.classList.contains("showmodal")) {
      modalnuevoMicrobiologia.classList.add("showmodal");
      modalnuevoMicrobiologia.classList.remove("hidemodal");
      modalnuevoMicrobiologia.style.display = "flex";
    }
  });

  btnformcerrarnuevoMicrobiologia.addEventListener("click", () => {
    if (!modalnuevoMicrobiologia.classList.contains("hidemodal")) {
      modalnuevoMicrobiologia.classList.add("hidemodal");
      modalnuevoMicrobiologia.classList.remove("showmodal");
      setTimeout(() => {
        modalnuevoMicrobiologia.style.display = "none";
      }, 300);
    }
  });

  nuevoMicrobiologia.addEventListener("submit", crearMicrobiologia);

  // Modificar Microbiologia
  btnmodificarmicrobiologia.addEventListener("click", () => {
    if (!modalupdateMicrobiologia.classList.contains("showmodal")) {
      cargarMicrobiologiaUpdateModal();
      modalupdateMicrobiologia.classList.add("showmodal");
      modalupdateMicrobiologia.classList.remove("hidemodal");
      modalupdateMicrobiologia.style.display = "flex";
    }
  });

  btnformcerrarmodificarMicrobiologia.addEventListener("click", () => {
    if (!modalupdateMicrobiologia.classList.contains("hidemodal")) {
      modalupdateMicrobiologia.classList.add("hidemodal");
      modalupdateMicrobiologia.classList.remove("showmodal");
      setTimeout(() => {
        modalupdateMicrobiologia.style.display = "none";
      }, 300);
    }
  });

  modificarMicrobiologia.addEventListener("submit", modificarMicrobiologiaUpdate);

  eliminarMicrobiologiaModal.addEventListener("show.bs.modal", (event) => {
    microbiologiaId = event.relatedTarget.dataset.id || microbiologiaId;
  });

  btnborrar.addEventListener("click", borrarMicrobiologia);

  qrMuestraModal.addEventListener("show.bs.modal", (event) => {
    imgmuestra__qr.src = `data:image/svg+xml;base64,`;
  });

  qrMuestraModal.addEventListener("show.bs.modal", (event) => {
    imgmuestra__qr.src = `data:image/svg+xml;base64,`;
  });

  // Crear Análisis
  btnformnuevaMuestra.addEventListener("click", () => {
    if (!microbiologiaId) {
      alertmicrobiologia.classList.remove("ocultar");
    } else {
      if (!modalnuevaMuestra.classList.contains("showmodal")) {
        modalnuevaMuestra.classList.add("showmodal");
        modalnuevaMuestra.classList.remove("hidemodal");
        modalnuevaMuestra.style.display = "flex";
      }
    }
  });

  if (btnformcerrarnuevaMuestra) {
    btnformcerrarnuevaMuestra.addEventListener("click", () => {
      if (!modalnuevaMuestra.classList.contains("hidemodal")) {
        modalnuevaMuestra.classList.add("hidemodal");
        modalnuevaMuestra.classList.remove("showmodal");
        setTimeout(() => {
          modalnuevaMuestra.style.display = "none";
        }, 300);
      }
    });
  }

  if (btncerrardetalleMuestra) {
    btncerrardetalleMuestra.addEventListener("click", () => {
      if (!modaldetalleMuestra.classList.contains("hidemodal")) {
        modaldetalleMuestra.classList.add("hidemodal");
        modaldetalleMuestra.classList.remove("showmodal");
        setTimeout(() => {
          modaldetalleMuestra.style.display = "none";
        }, 300);
      }
      muestra__img.innerHTML = "";
    });
  }

  if (btncerrarmuestradetalle) {
    btncerrarmuestradetalle.addEventListener("click", () => {
      if (!modaldetalleMuestra.classList.contains("hidemodal")) {
        modaldetalleMuestra.classList.add("hidemodal");
        modaldetalleMuestra.classList.remove("showmodal");
        setTimeout(() => {
          modaldetalleMuestra.style.display = "none";
        }, 300);
      }
      muestra__img.innerHTML = "";
    });
  }

  if (btnborrarmuestra) {
    btnborrarmuestra.addEventListener("click", () => {
      if (confirm("¿Estás seguro de eliminar este análisis?")) {
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
      if (!microbiologiaId || !muestraId) {
        alertmicrobiologia.classList.remove("ocultar");
      } else {
        cargarMuestraUpdateModal();
        if (!modalmodificarMuestra.classList.contains("showmodal")) {
          modalmodificarMuestra.classList.add("showmodal");
          modalmodificarMuestra.classList.remove("hidemodal");
          // Asegurar que el modal se muestre con flexbox
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
        // Ocultar después de la animación
        setTimeout(() => {
          modalmodificarMuestra.style.display = "none";
        }, 300);
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

  inputmicrobiologia__qr.value = "";
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

  // Lectura código QR de Microbiologia/Muestra
  qrConsultaModal.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      let tipo = input__consultarqr.value.substring(0, 5);
      if (tipo === "--m--") {
        consultarMicrobiologiaQR(input__consultarqr.value);
      } else {
        consultarMuestraQR(input__consultarqr.value);
      }
      input__consultarqr.value = "";
    } else {
      input__consultarqr.value += event.key;
    }
  });

  // Guardar Informe de Resultados
  const guardarInformeMedico = async () => {
    console.log("=== FUNCIÓN guardarInformeMedico EJECUTADA ===");
    console.log("currentMicrobiologiaId:", currentMicrobiologiaId);

    if (!currentMicrobiologiaId) {
      console.error("ERROR: No hay microbiologiaId seleccionado");
      mostrarEstadoInforme("Selecciona una cita para guardar el informe.", "warning");
      return;
    }

    mostrarEstadoInforme("Guardando informe...", "info");
    cambiarEstadoBotonGuardar(true);

    console.log("Datos a enviar:");
    console.log("- informe_descripcion:", microbiologiaInformeDescripcion.value);
    console.log("- informe_fecha:", microbiologiaInformeFecha.value);
    console.log("- informe_tincion:", microbiologiaInformeTincion.value);
    console.log("- informe_observaciones:", microbiologiaInformeObservaciones.value);

    const datosReporte = {
      descripcion: microbiologiaInformeDescripcion.value,
      fecha: microbiologiaInformeFecha.value,
      tincion: microbiologiaInformeTincion.value,
      observaciones: microbiologiaInformeObservaciones.value,
      microbiologia: currentMicrobiologiaId,
    };

    // Procesar imagen si existe
    if (microbiologiaInformeImagen.files.length > 0) {
      console.log("Hay imagen para procesar");
      const file = microbiologiaInformeImagen.files[0];
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
        if (microbiologiaInformeImagen) microbiologiaInformeImagen.value = "";
        ocultarPanelNuevoInformeMicrobiologia();
        await refrescarInformesMicrobiologia(currentMicrobiologiaId);
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
      guardarInformeMedico();
    });
  } else {
    console.error("=== ERROR: btnGuardarInforme NO ENCONTRADO ===");
  }

  if (informesListaMicrobiologia) {
    informesListaMicrobiologia.addEventListener("click", async (event) => {
      const target = event.target.closest("i[data-action]");
      if (!target) return;
      const action = target.dataset.action;
      const informeId = target.dataset.id;
      if (!currentMicrobiologiaId || !informeId) return;

      const informes = await cargarInformesMicrobiologia(currentMicrobiologiaId);
      const informe = informes.find((item) => String(item.id_informe) === String(informeId));
      if (!informe) return;

      if (action === "cargar") {
        cargarInformeEnFormularioMicrobiologia(informe);
        mostrarPanelNuevoInformeMicrobiologia(false);
      }

      if (action === "eliminar") {
        if (!confirm("¿Eliminar este informe?")) return;
        await borrarInformeMicrobiologia(informeId);
        mostrarEstadoInforme("Informe eliminado correctamente.", "success");
        await refrescarInformesMicrobiologia(currentMicrobiologiaId);
      }
    });
  }
});
