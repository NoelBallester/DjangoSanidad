// ============================================================
// HEMATOLOGÍA JS - Adaptado del módulo de Bioquímica
// ============================================================

const token = sessionStorage.getItem("token");
const body = document.getElementById("body");

// Tabla de hematologías principales
const listaMuestras = document.getElementById("Muestras");
// Tabla de sub-muestras
const listaTubos = document.getElementById("muestras");
// Filtros
const organos = document.getElementById("organos");
const numMuestras = document.getElementById("numMuestras");

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

// Botón eliminar hematología principal
const btnborrar = document.getElementById("btnborrar");
// Modal confirmación eliminar
const confirmarEliminar = document.getElementById("confirmEliminarHematologia");
const confirmarEliminarSubMuestra = document.getElementById("confirmEliminarSubMuestra");

// Modales Hematología Principal (nueva/modificar)
const modalnuevaMuestras = document.getElementById("modalnuevaMuestras");
const btnformnuevaMuestras = document.getElementById("btnformnuevaMuestras");
const btnformcerrarnuevaMuestras = document.getElementById("btnformcerrarnuevaMuestras");
const nuevaMuestras = document.getElementById("nuevaMuestras");

const modalupdateMuestras = document.getElementById("modalupdateMuestras");
const modificarMuestras = document.getElementById("modificarMuestras");
const btnformmodificarMuestras = document.getElementById("btnformmodificarMuestras");
const btnformcerrarmodificarMuestras = document.getElementById("btnformcerrarmodificarMuestras");

// Mostrar todas las muestras
const todasMuestras = document.getElementById("todasMuestras");
const informesListaHematologia = document.getElementById("informes_lista_hematologia");
const btnNuevoInforme = document.getElementById("btnNuevoInforme");
const btnCancelarInforme = document.getElementById("btnCancelarInforme");
const modalNuevoInforme = document.getElementById("modalNuevoInforme");
const nuevoInformePanel = document.getElementById("nuevoInformePanel");

// Campos detalle hematología principal
const muestrasNumDisplay = document.getElementById("Muestras__Muestras");
const muestrasDescripcion = document.getElementById("Muestras__descripcion");
const muestrasOrgano = document.getElementById("Muestras__organo");
const muestrasFecha = document.getElementById("Muestras__fecha");
const muestrasTecnicoId = document.getElementById("Muestras__tecnico_id");
const muestrasCaracteristicas = document.getElementById("Muestras__caracteristicas");
const muestrasObservaciones = document.getElementById("Muestras__observaciones");
const muestrasDiagnostico = document.getElementById("Muestras__diagnostico");
const muestrasVolanteWrapper = document.getElementById("Muestras__volanteWrapper");
const muestrasVolanteText = document.getElementById("Muestras__volanteText");

// Botones de acción en detalle principal
const btnEliminarHematologia = document.getElementById("btnEliminarHematologia");

// Variables globales de informe - se asignan en DOMContentLoaded
let muestrasInformeDescripcion = null;
let muestrasInformeFecha = null;
let muestrasInformeTincion = null;
let muestrasInformeObservaciones = null;
let muestrasInformeImagen = null;
let muestrasInformePreviewWrap = null;
let muestrasInformePreview = null;
let btnGuardarInforme = null;
const informeStatus = document.getElementById("informeStatus");
const informeContextNum = document.getElementById("informeContextNum");
const informeContextDescripcion = document.getElementById("informeContextDescripcion");
const INFORME_TAB_KEY = "hematologia_active_tab";

// Detalle sub-muestra
let currentHematologiaId = null;
let informeEditandoId = null;
let informeGuardando = false;
let ultimaListaHematologias = [];
let evitarVaciadoListaPrincipal = false;

// Modales QR
const imgmuestra__qr = document.getElementById("imgmuestra__qr");
const inputmuestra__qr = document.getElementById("inputmuestra__qr");

// Modal QR principal
const imgMuestras__qr = document.getElementById("imgMuestras__qr");
const inputMuestras__qr = document.getElementById("inputMuestras__qr");
const btn__imprimirqrMuestras = document.getElementById("btn__imprimirqrMuestras");
const btn__imprimirqrmuestra = document.getElementById("btn__imprimirqrmuestra");

// Modal consulta QR
const qrConsultaModal = document.getElementById("qrConsultaModal");
let mimodal = qrConsultaModal ? new bootstrap.Modal(qrConsultaModal) : null;

// Fecha inicio/fin
const fechainicio = document.getElementById("fechainicio");
const fechafin = document.getElementById("fechafin");

// Alertas
const alertfecha = document.getElementById("alertfecha");
const alertfecha_text = document.getElementById("alertfecha_text");
const alertMuestras = document.getElementById("alertMuestras");

// IDs de trabajo
let hematologiaId = null;  // ID de la hematología principal seleccionada
let hematologiaQr = null;
let muestraId = null;       // ID de la sub-muestra seleccionada
let imageId = null;         // ID de la imagen seleccionada

// Formulario Nueva Hematología Principal
const inputMuestras = document.getElementById("inputMuestras");
const inputDescripcion = document.getElementById("inputDescripcion");
const inputFecha = document.getElementById("inputFecha");
const inputSelect = document.getElementById("inputSelect");
const inputCaracteristicas = document.getElementById("inputCaracteristicas");
const inputObservaciones = document.getElementById("inputObservaciones");
const inputMicroscopia = document.getElementById("inputMicroscopia");
const inputDiagnostico = document.getElementById("inputDiagnostico");
const inputPatologo = document.getElementById("inputPatologo");

// Formulario Modificar Hematología Principal
const inputMuestrasUpdate = document.getElementById("inputMuestrasUpdate");
const inputDescripcionUpdate = document.getElementById("inputDescripcionUpdate");
const inputFechaUpdate = document.getElementById("inputFechaUpdate");
const inputSelectUpdate = document.getElementById("inputSelectUpdate");
const inputCaracteristicasUpdate = document.getElementById("inputCaracteristicasUpdate");
const inputObservacionesUpdate = document.getElementById("inputObservacionesUpdate");
const inputMicroscopiaUpdate = document.getElementById("inputMicroscopiaUpdate");
const inputDiagnosticoUpdate = document.getElementById("inputDiagnosticoUpdate");
const inputPatologoUpdate = document.getElementById("inputPatologoUpdate");

// Sub-muestra - Nueva
const btnformnuevaMuestra = document.getElementById("btnformnuevaMuestra");
const btnformcerrarnuevaMuestra = document.getElementById("btnformcerrarnuevaMuestra");
const modalnuevaMuestra = document.getElementById("modalnuevaMuestra");
const inputdescripcionMuestra = document.getElementById("inputdescripcionMuestra");
const inputFechaMuestra = document.getElementById("inputFechaMuestra");
const selectTincionMuestra = document.getElementById("selectTincionMuestra");
const inputObservacionesMuestra = document.getElementById("inputObservacionesMuestra");
const inputMicroscopiaMuestra = document.getElementById("inputMicroscopiaMuestra");
const inputImagenesMuestra = document.getElementById("inputImagenesMuestra");
const nuevaMuestra = document.getElementById("nuevaMuestra");

// Sub-muestra - Modificar
const modalmodificarMuestra = document.getElementById("modalmodificarMuestra");
const modificarMuestra = document.getElementById("modificarMuestra");
const btnformmodificarmuestra = document.getElementById("btnformmodificarmuestra");
const btnformcerrarmodificarMuestra = document.getElementById("btnformcerrarmodificarMuestra");
const inputmodificardescripcionMuestra = document.getElementById("inputmodificardescripcionMuestra");
const inputmodificarfechaMuestra = document.getElementById("inputmodificarfechaMuestra");
const selectmodificartincionMuestra = document.getElementById("selectmodificartincionMuestra");
const inputmodificarobservacionesMuestra = document.getElementById("inputmodificarobservacionesMuestra");
const inputmodificarmicroscopiaMuestra = document.getElementById("inputmodificarmicroscopiaMuestra");

// Sub-muestra - Detalle
const modaldetalleMuestra = document.getElementById("modaldetalleMuestra");
const btncerrardetalleMuestra = document.getElementById("btncerrardetalleMuestra");
const muestra__descripcion = document.getElementById("muestra__descripcion");
const muestra__fecha = document.getElementById("muestra__fecha");
const muestra__observaciones = document.getElementById("muestra__observaciones");
const muestra__descripcion_microscopica = document.getElementById("muestra__descripcion_microscopica");
const muestra__tincion = document.getElementById("muestra__tincion");
const muestra__img = document.getElementById("muestra__img");
const visor__img = document.getElementById("visor__img");
const btnborrarimagenmuestra = document.getElementById("btnborrarimagenmuestra");
const btnaniadirimagenmuestra = document.getElementById("btnaniadirimagenmuestra");
const qrMuestraModal = document.getElementById("qrMuestraModal");

// QR Consulta
const btn__consultarqr = document.getElementById("btn__consultarqr");
const input__consultarqr = document.getElementById("input__consultarqr");
const manualQrBtn = document.getElementById("manualQrBtn");
const qrResolverBase = "/qr/resolver/";
let html5QrInstance = null;
const QR_RENDER_SIZE = 220;

const buildResolverUrl = (code) => {
  if (!code) return "";
  return `${window.location.origin}${qrResolverBase}?code=${encodeURIComponent(code)}`;
};

const limpiarParametrosQrUrl = () => {
  if (!window.history?.replaceState) return;
  window.history.replaceState({}, document.title, window.location.pathname);
};

const restaurarEstadoDesdeUrl = async () => {
  const params = new URLSearchParams(window.location.search);
  const hematologiaParam = params.get("hematologia");
  const muestraParam = params.get("muestra");

  if (!hematologiaParam && !muestraParam) return false;

  try {
    if (hematologiaParam) {
      const hematologia = await cargarHematologia(hematologiaParam);
      if (hematologia?.id_hematologia) {
        imprimirDetalleHematologia(hematologia);
        hematologiaId = hematologia.id_hematologia;
        const subMuestras = await cargarSubMuestras(hematologiaId);
        imprimirSubMuestras(subMuestras);
      }
    }

    if (muestraParam) {
      await detailSubMuestra(muestraParam);
    }

    limpiarParametrosQrUrl();
    return true;
  } catch (error) {
    console.error("Error restaurando estado desde URL en hematología:", error);
    return false;
  }
};

const cerrarModalQrConsulta = () => {
  if (!qrConsultaModal || !window.bootstrap?.Modal) return;
  const modal = window.bootstrap.Modal.getInstance(qrConsultaModal) || new window.bootstrap.Modal(qrConsultaModal);
  modal.hide();
};

const resolverTextoEscaneado = async (text) => {
  const value = (text || "").trim();
  if (!value) return;

  if (value.startsWith("http://") || value.startsWith("https://")) {
    window.location.href = value;
    return;
  }

  window.location.href = `${qrResolverBase}?code=${encodeURIComponent(value)}`;
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

// ============================================================
// UTILIDADES
// ============================================================

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

function mostrarEstadoInforme(mensaje, tipo = "success") {
  if (!informeStatus) return;
  informeStatus.className = `alert alert-${tipo} py-2 px-3 mb-3`;
  informeStatus.textContent = mensaje;
}

function actualizarEtiquetaBotonInforme() {
  if (!btnGuardarInforme || informeGuardando) return;
  btnGuardarInforme.innerHTML = informeEditandoId
    ? '<i class="fa-solid fa-pen-to-square me-2"></i> Actualizar Informe'
    : '<i class="fa-solid fa-save me-2"></i> Guardar Informe';
}

function limpiarEstadoInforme() {
  if (!informeStatus) return;
  informeStatus.classList.add("d-none");
  informeStatus.textContent = "";
}

function cambiarEstadoBotonGuardar(guardando) {
  if (!btnGuardarInforme) return;
  if (guardando) {
    btnGuardarInforme.disabled = true;
    btnGuardarInforme.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Guardando informe...';
  } else {
    btnGuardarInforme.disabled = false;
    actualizarEtiquetaBotonInforme();
  }
}

function actualizarContextoInformeHematologia(numero = "", descripcion = "") {
  if (informeContextNum) informeContextNum.textContent = numero || "—";
  if (informeContextDescripcion) {
    informeContextDescripcion.textContent = descripcion || "Selecciona una cita para ver los detalles";
  }
}

const cargarInformesHematologia = async (idHematologia) => {
  const response = await fetch(`/api/informesresultado/hematologia/${idHematologia}/`);
  return await response.json();
};

const cargarInformeEnFormularioHematologia = (informe) => {
  if (muestrasInformeDescripcion) muestrasInformeDescripcion.value = informe.descripcion || "";
  if (muestrasInformeFecha) muestrasInformeFecha.value = informe.fecha || "";
  if (muestrasInformeTincion) muestrasInformeTincion.value = informe.tincion || "";
  if (muestrasInformeObservaciones) muestrasInformeObservaciones.value = informe.observaciones || "";
  actualizarPreviewInformeHematologia(informe.informe_imagen_url || informe.imagen_url || informe.imagen_base64 || "");
  mostrarEstadoInforme("Informe cargado en el formulario.", "info");
};

const obtenerUrlInformeHematologia = (informe) => {
  if (!informe) return "";
  if (informe.imagen_url) return informe.imagen_url;
  if (informe.informe_imagen_url) return informe.informe_imagen_url;
  if (informe.imagen_base64) return `data:application/octet-stream;base64,${informe.imagen_base64}`;
  return "";
};

window.verInformeHematologia = (url) => {
  if (!url) {
    mostrarEstadoInforme("Este informe no tiene archivo adjunto.", "warning");
    return;
  }
  window.open(url, "_blank", "noopener");
};

window.verInfoInformeHematologia = async (informeId) => {
  if (!informeId) return;
  try {
    const res = await fetch(`/api/informesresultado/${informeId}/`);
    if (!res.ok) throw new Error("No se pudo cargar la informacion del informe");
    const informe = await res.json();
    const host = informesListaHematologia?.closest('.informe__scroll');
    if (!host) return;

    let panel = document.getElementById('infoInformePanelHematologia');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'infoInformePanelHematologia';
      panel.className = 'mb-3 p-3 rounded';
      panel.style.background = 'var(--bg-light)';
      panel.style.border = '1px solid var(--border-color)';
      panel.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="Muestras__title m-0">Detalle del informe</h3>
          <button type="button" class="btn btn-outline-secondary btn-sm" id="cerrarInfoInformeHematologia">Cerrar</button>
        </div>
        <div class="blue__color"><strong>Fecha:</strong> <span data-field="fecha">-</span></div>
        <div class="blue__color mt-2"><strong>Descripcion:</strong> <span data-field="descripcion">-</span></div>
        <div class="blue__color mt-2"><strong>Tipo De Análisis:</strong> <span data-field="tincion">-</span></div>
        <div class="blue__color mt-2"><strong>Observaciones:</strong></div>
        <div class="blue__color mt-1" data-field="observaciones">-</div>
      `;
      const tableWrap = informesListaHematologia.closest('.table__scroll');
      host.insertBefore(panel, tableWrap);
      panel.querySelector('#cerrarInfoInformeHematologia').addEventListener('click', () => {
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

window.editarInformeHematologia = async (informeId) => {
  const targetId = currentHematologiaId || hematologiaId;
  if (!targetId || !informeId) return;
  const informes = await cargarInformesHematologia(targetId);
  const informe = informes.find((item) => String(item.id_informe) === String(informeId));
  if (!informe) return;
  informeEditandoId = String(informe.id_informe);
  actualizarEtiquetaBotonInforme();
  cargarInformeEnFormularioHematologia(informe);
  mostrarPanelNuevoInformeHematologia(false);
};

window.eliminarInformeHematologia = async (informeId) => {
  const targetId = currentHematologiaId || hematologiaId;
  if (!targetId || !informeId) return;
  if (!confirm("¿Eliminar este informe?")) return;

  try {
    await borrarInformeHematologia(informeId);
    mostrarEstadoInforme("Informe eliminado correctamente.", "success");
    await refrescarInformesHematologia(targetId);
  } catch (error) {
    console.error(error);
    mostrarEstadoInforme("Error al eliminar el informe.", "danger");
  }
};

window.guardarInformeHematologia = async () => {
  const targetId = currentHematologiaId || hematologiaId;
  if (!targetId) {
    mostrarEstadoInforme("Selecciona una cita para guardar el informe.", "warning");
    return;
  }
  if (informeGuardando) return;
  informeGuardando = true;
  cambiarEstadoBotonGuardar(true);

  try {
    mostrarEstadoInforme("Guardando informe...", "info");
    const descripcion = document.getElementById("Muestras__informe_descripcion")?.value || "";
    const fecha = document.getElementById("Muestras__informe_fecha")?.value || "";
    const tincion = document.getElementById("Muestras__informe_tincion")?.value || "";
    const observaciones = document.getElementById("Muestras__informe_observaciones")?.value || "";
    const inputFile = document.getElementById("Muestras__informe_imagen");
    const payload = { descripcion, fecha, tincion, observaciones, hematologia: targetId };

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
    ocultarPanelNuevoInformeHematologia();
    await refrescarInformesHematologia(targetId);
  } catch (error) {
    console.error(error);
    mostrarEstadoInforme(error.message || "Error al guardar el informe.", "danger");
  } finally {
    informeGuardando = false;
    cambiarEstadoBotonGuardar(false);
  }
};

const borrarInformeHematologia = async (informeId) => {
  await fetch(`/api/informesresultado/${informeId}/`, {
    method: "DELETE",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
};

const imprimirInformesHematologia = (informes) => {
  if (!informesListaHematologia) return;
  informesListaHematologia.innerHTML = "";

  if (!informes || informes.length === 0) {
    informesListaHematologia.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">No hay informes registrados.</td></tr>';
    return;
  }

  const fragmento = document.createDocumentFragment();
  informes.forEach((informe) => {
    const urlInforme = obtenerUrlInformeHematologia(informe);
    const tieneArchivo = Boolean(obtenerUrlInformeHematologia(informe));
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
      <i class="fa-solid fa-circle-info Muestras__icon Muestras__icon--infoMuestras me-2" title="Ver datos del formulario" data-action="info" data-id="${informe.id_informe}"></i>
      <i class="fa-solid fa-file-import Muestras__icon Muestras__icon--infoMuestras me-2 ${tieneArchivo ? '' : 'text-muted'}" title="Ver informe" data-action="ver" data-id="${informe.id_informe}" data-url="${urlInforme || ''}"></i>
      <i class="fa-solid fa-file-pen Muestras__icon Muestras__icon--infoMuestras me-2" title="Editar informe" data-action="cargar" data-id="${informe.id_informe}"></i>
      <i class="fa-solid fa-trash-can Muestras__icon Muestras__icon--infoMuestras" title="Eliminar informe" data-action="eliminar" data-id="${informe.id_informe}"></i>
    `;

    tr.appendChild(tdFecha);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdTincion);
    tr.appendChild(tdAcciones);
    fragmento.appendChild(tr);
  });

  informesListaHematologia.appendChild(fragmento);
};

const refrescarInformesHematologia = async (idHematologia) => {
  if (!idHematologia) {
    imprimirInformesHematologia([]);
    return;
  }
  const informes = await cargarInformesHematologia(idHematologia);
  imprimirInformesHematologia(informes);
  return informes;
};

const limpiarFormularioInformeHematologia = () => {
  informeEditandoId = null;
  actualizarEtiquetaBotonInforme();
  if (muestrasInformeDescripcion) muestrasInformeDescripcion.value = "";
  if (muestrasInformeFecha) muestrasInformeFecha.value = "";
  if (muestrasInformeTincion) muestrasInformeTincion.value = "";
  if (muestrasInformeObservaciones) muestrasInformeObservaciones.value = "";
  if (muestrasInformeImagen) muestrasInformeImagen.value = "";
  actualizarPreviewInformeHematologia("");
};

const actualizarPreviewInformeHematologia = (imagen) => {
  if (!muestrasInformePreviewWrap || !muestrasInformePreview) return;
  if (!imagen) {
    muestrasInformePreview.src = "";
    muestrasInformePreviewWrap.classList.add("d-none");
    return;
  }
  muestrasInformePreview.src = imagen.startsWith("data:") || imagen.startsWith("http") || imagen.startsWith("/")
    ? imagen
    : `data:image/jpeg;base64,${imagen}`;
  muestrasInformePreviewWrap.classList.remove("d-none");
};

const mostrarPanelNuevoInformeHematologia = (limpiar = true) => {
  if (!modalNuevoInforme) return;
  if (limpiar) limpiarFormularioInformeHematologia();
  modalNuevoInforme.classList.remove("d-none");
  modalNuevoInforme.classList.add("d-flex");
};

const ocultarPanelNuevoInformeHematologia = () => {
  if (!modalNuevoInforme) return;
  informeEditandoId = null;
  actualizarEtiquetaBotonInforme();
  modalNuevoInforme.classList.add("d-none");
  modalNuevoInforme.classList.remove("d-flex");
};

const obtenerHematologiaSeleccionadaParaInforme = () => {
  return currentHematologiaId || hematologiaId;
};

// ============================================================
// AUTENTICACIÓN
// ============================================================

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

// ============================================================
// API - HEMATOLOGÍA PRINCIPAL
// ============================================================

const cargarHematologiasIndex = async () => {
  return await fetch("/api/hematologia/index/").then((r) => r.json());
};

const normalizarListaApi = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
};

const esRespuestaErrorApi = (payload) => {
  return Boolean(payload && typeof payload === "object" && !Array.isArray(payload) && (payload.error || payload.detail));
};

const cargarTodasHematologias = async () => {
  const payload = await fetch("/api/hematologia/todos/").then((r) => r.json());
  let lista = normalizarListaApi(payload);
  if (lista.length > 0) return lista;

  // Fallback defensivo: en algunos entornos legacy /todos/ puede responder con error o formato inesperado.
  if (esRespuestaErrorApi(payload) || (payload && !Array.isArray(payload) && !Array.isArray(payload.results))) {
    try {
      const payloadList = await fetch("/api/hematologia/").then((r) => r.json());
      lista = normalizarListaApi(payloadList);
      if (lista.length > 0) return lista;
    } catch (error) {
      console.warn("Fallback /api/hematologia/ falló", error);
    }

    try {
      const payloadIndex = await fetch("/api/hematologia/index/").then((r) => r.json());
      return normalizarListaApi(payloadIndex);
    } catch (error) {
      console.warn("Fallback /api/hematologia/index/ falló", error);
    }
  }

  return lista;
};

const cargarHematologia = async (id) => {
  return await fetch(`/api/hematologia/${id}/`).then((r) => r.json());
};

const cargarPorOrgano = async () => {
  const val = organos ? organos.value : "*";
  return await fetch(`/api/hematologia/organo/${val}/`).then((r) => r.json());
};

const cargarPorNumero = async () => {
  const val = numMuestras ? numMuestras.value : "";
  return await fetch(`/api/hematologia/numero/${val}/`).then((r) => r.json());
};

const obtenerHematologiasPorFecha = async (fecha) => {
  return await fetch(`/api/hematologia/fecha/${fecha}/`).then((r) => r.json());
};

const obtenerHematologiasPorRango = async (inicio, fin) => {
  return await fetch(`/api/hematologia/rango_fechas/?inicio=${inicio}&fin=${fin}`).then((r) => r.json());
};

// ============================================================
// CRUD - HEMATOLOGÍA PRINCIPAL
// ============================================================

const crearHematologia = async (event) => {
  event.preventDefault();

  if (!sessionStorage.getItem("tecnico_id")) {
    await initAuth();
  }
  const tecnicoId = sessionStorage.getItem("tecnico_id");
  if (!tecnicoId) {
    alert("Error: Usuario no autenticado. Por favor inicia sesión nuevamente.");
    return;
  }

  const formData = new FormData();
  if (inputMuestras) formData.append("hematologia", inputMuestras.value);
  if (inputFecha) formData.append("fecha", inputFecha.value);
  if (inputDescripcion) formData.append("descripcion", inputDescripcion.value);
  if (inputCaracteristicas) formData.append("caracteristicas", inputCaracteristicas.value);
  if (inputObservaciones) formData.append("observaciones", inputObservaciones.value);
  if (inputSelect) formData.append("organo", inputSelect.value);
  if (typeof inputClinica !== "undefined" && inputClinica) formData.append("informacion_clinica", inputClinica.value);
  
  // Volante de petición
  if (inputMicroscopia && inputMicroscopia.files && inputMicroscopia.files[0]) {
    formData.append("volante_peticion", inputMicroscopia.files[0]);
  }
  
  if (inputDiagnostico) formData.append("diagnostico_final", inputDiagnostico.value);
  if (inputPatologo) formData.append("patologo_responsable", inputPatologo.value);
  formData.append("tecnico", tecnicoId);

  try {
    const response = await fetch("/api/hematologia/", {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(JSON.stringify(err));
    }

    if (nuevaMuestras) nuevaMuestras.reset();
    cerrarModal(modalnuevaMuestras);

    const respuesta = await cargarTodasHematologias();
    imprimirHematologias(respuesta);
  } catch (error) {
    console.error("Error al crear hematología:", error);
    alert("Error al crear la muestra: " + error.message);
  }
};

const borrarHematologia = async () => {
  if (!hematologiaId) {
    alert("No hay ninguna muestra seleccionada.");
    return;
  }

  try {
    const response = await fetch(`/api/hematologia/${hematologiaId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });

    if (response.ok) {
      console.log("Hematología eliminada");
      hematologiaId = null;
      limpiarDetalleHematologia();
      const respuesta = await cargarTodasHematologias();
      imprimirHematologias(respuesta);
    } else {
      alert("Error al eliminar la muestra");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al eliminar la muestra: " + error.message);
  }
};

const cargarHematologiaUpdateModal = async () => {
  if (!hematologiaId) {
    if (alertMuestras) alertMuestras.classList.remove("ocultar");
    return;
  }

  const h = await cargarHematologia(hematologiaId);
  if (inputMuestrasUpdate) inputMuestrasUpdate.value = h.hematologia || "";
  if (inputDescripcionUpdate) inputDescripcionUpdate.value = h.descripcion || "";
  if (inputFechaUpdate) inputFechaUpdate.value = h.fecha || "";
  if (inputSelectUpdate) inputSelectUpdate.value = h.organo || "";
  if (inputCaracteristicasUpdate) inputCaracteristicasUpdate.value = h.caracteristicas || "";
  if (inputObservacionesUpdate) inputObservacionesUpdate.value = h.observaciones || "";
  if (inputMicroscopiaUpdate) inputMicroscopiaUpdate.value = h.descripcion_microscopica || "";
  if (inputDiagnosticoUpdate) inputDiagnosticoUpdate.value = h.diagnostico_final || "";
  if (inputPatologoUpdate) inputPatologoUpdate.value = h.patologo_responsable || "";
};

const modificarHematologiaUpdate = async (event) => {
  event.preventDefault();

  const tecnicoId = sessionStorage.getItem("tecnico_id");
  if (!tecnicoId) {
    alert("Error: Usuario no autenticado.");
    return;
  }

  const formData = new FormData();
  if (inputMuestrasUpdate) formData.append("hematologia", inputMuestrasUpdate.value);
  if (inputFechaUpdate) formData.append("fecha", inputFechaUpdate.value);
  if (inputDescripcionUpdate) formData.append("descripcion", inputDescripcionUpdate.value);
  if (inputCaracteristicasUpdate) formData.append("caracteristicas", inputCaracteristicasUpdate.value);
  if (inputObservacionesUpdate) formData.append("observaciones", inputObservacionesUpdate.value);
  if (inputSelectUpdate) formData.append("organo", inputSelectUpdate.value);

  if (inputMicroscopiaUpdate && inputMicroscopiaUpdate.files && inputMicroscopiaUpdate.files[0]) {
    formData.append("volante_peticion", inputMicroscopiaUpdate.files[0]);
  }

  if (inputDiagnosticoUpdate) formData.append("diagnostico_final", inputDiagnosticoUpdate.value);
  if (inputPatologoUpdate) formData.append("patologo_responsable", inputPatologoUpdate.value);
  formData.append("tecnico", tecnicoId);

  try {
    const response = await fetch(`/api/hematologia/${hematologiaId}/`, {
      method: "PATCH",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: formData,
    });

    if (response.ok) {
      cerrarModal(modalupdateMuestras);
      const h = await cargarHematologia(hematologiaId);
      imprimirDetalleHematologia(h);
      const respuesta = await cargarTodasHematologias();
      imprimirHematologias(respuesta);
    } else {
      const err = await response.json();
      alert("Error al actualizar: " + JSON.stringify(err));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al actualizar: " + error.message);
  }
};

// ============================================================
// IMPRIMIR - HEMATOLOGÍAS PRINCIPALES
// ============================================================

const imprimirHematologias = (respuesta, rebuildDropdown = true) => {
  let lista = normalizarListaApi(respuesta);
  if (lista.length === 0 && evitarVaciadoListaPrincipal && ultimaListaHematologias.length > 0) {
    console.warn("Se evita vaciar la tabla principal de hematologías por respuesta vacía temporal.");
    lista = ultimaListaHematologias;
  }

  if (lista.length > 0) {
    ultimaListaHematologias = lista.slice();
  }

  if (!listaMuestras) return;
  listaMuestras.innerHTML = "";

  if (rebuildDropdown && numMuestras) {
    numMuestras.innerHTML = "<option disabled selected>Nº Muestra</option>";
  }

  const fragmento = document.createDocumentFragment();
  const fragmentselect = document.createDocumentFragment();

  if (lista.length > 0) {
    lista.forEach((h) => {
      // Para el dropdown
      if (rebuildDropdown && numMuestras) {
        const option = document.createElement("OPTION");
        option.textContent = h.hematologia;
        fragmentselect.appendChild(option);
      }

      // Fila de tabla
      const tr = document.createElement("tr");
      tr.classList.add("table__row");

      const tdNumero = document.createElement("td");
      tdNumero.textContent = h.hematologia || "";

      const tdFecha = document.createElement("td");
      tdFecha.textContent = formatFecha(h.fecha);

      const tdDescripcion = document.createElement("td");
      tdDescripcion.textContent = (h.descripcion || "").substring(0, 50);
      tdDescripcion.title = h.descripcion || "";

      const tdOrgano = document.createElement("td");
      tdOrgano.textContent = h.organo || "";

      const btndetalle = document.createElement("I");
      btndetalle.className = "d-inline-block fa-solid fa-eye Muestras__icon Muestras__icon--infoMuestras";
      btndetalle.dataset.id = h.id_hematologia;
      btndetalle.title = "Ver Aditivos";

      const tdBtn = document.createElement("td");
      tdBtn.appendChild(btndetalle);

      tr.appendChild(tdNumero);
      tr.appendChild(tdFecha);
      tr.appendChild(tdDescripcion);
      tr.appendChild(tdOrgano);
      tr.appendChild(tdBtn);

      fragmento.appendChild(tr);
    });
  } else {
    const span = document.createElement("span");
    span.classList.add("d-flex", "justify-content-center", "fw-bold", "text-danger", "text-opacity-50");
    span.textContent = "No se ha encontrado ninguna muestra";
    fragmento.appendChild(span);
  }

  listaMuestras.appendChild(fragmento);
  if (rebuildDropdown && numMuestras) {
    numMuestras.appendChild(fragmentselect);
  }
};

// ============================================================
// DETALLE - HEMATOLOGÍA PRINCIPAL
// ============================================================

const detalleHematologia = async (event) => {
  const icon = event.target.closest("i.fa-eye");
  if (icon) {
    if (alertMuestras) alertMuestras.classList.add("ocultar");
    hematologiaId = icon.dataset.id;

    const h = await cargarHematologia(hematologiaId);
    imprimirDetalleHematologia(h);

    const subMuestras = await cargarSubMuestras(hematologiaId);
    imprimirSubMuestras(subMuestras);
  }
};

const imprimirDetalleHematologia = (h) => {
  if (muestrasNumDisplay) muestrasNumDisplay.textContent = h.hematologia || "";
  if (muestrasDescripcion) muestrasDescripcion.textContent = h.descripcion || "";
  if (muestrasOrgano) muestrasOrgano.textContent = h.organo || "";
  if (muestrasFecha) muestrasFecha.textContent = formatFecha(h.fecha);
  if (muestrasTecnicoId) muestrasTecnicoId.textContent = h.tecnico || "—";
  if (muestrasCaracteristicas) muestrasCaracteristicas.textContent = h.caracteristicas || "";
  if (muestrasObservaciones) muestrasObservaciones.textContent = h.observaciones || "";
  if (muestrasDiagnostico) {
    muestrasDiagnostico.textContent = h.diagnostico_final || "";
  }

  // Renderizar el Volante de Petición
  if (muestrasVolanteWrapper && muestrasVolanteText) {
      if (h.volante_peticion_url) {
          const fileName = h.volante_peticion_nombre || "Volante_Adjunto.pdf";
          muestrasVolanteWrapper.innerHTML = `
              <a href="${h.volante_peticion_url}" target="_blank" class="btn btn-sm btn-outline-info d-block mt-2">
                  <i class="fa-solid fa-file-pdf me-2"></i>Ver ${fileName}
              </a>
          `;
      } else {
          muestrasVolanteWrapper.innerHTML = `<span id="Muestras__volanteText" class="blue__color">No adjuntado</span>`;
      }
  }

  // Rellenar campos del informe
  if (muestrasInformeDescripcion) muestrasInformeDescripcion.value = h.informe_descripcion || "";
  if (muestrasInformeFecha) muestrasInformeFecha.value = h.informe_fecha || "";
  if (muestrasInformeTincion) muestrasInformeTincion.value = h.informe_tincion || "";
  if (muestrasInformeObservaciones) muestrasInformeObservaciones.value = h.informe_observaciones || "";

  currentHematologiaId = h.id_hematologia;
  if (btnNuevoInforme) {
    btnNuevoInforme.disabled = false;
    btnNuevoInforme.removeAttribute("title");
  }
  actualizarContextoInformeHematologia(h.hematologia || "", h.descripcion || "");
  limpiarEstadoInforme();
  refrescarInformesHematologia(currentHematologiaId);

  // QR principal
  if (window.QRious && imgMuestras__qr) {
    new QRious({
      element: imgMuestras__qr,
      value: buildResolverUrl(h.qr_hematologia),
      size: QR_RENDER_SIZE,
      background: "#ffffff",
      backgroundAlpha: 1,
      foreground: "#000000",
      level: "H",
    });
    window.hematologiaQrUrl = buildResolverUrl(h.qr_hematologia);
  }
};

const limpiarDetalleHematologia = () => {
  if (muestrasNumDisplay) muestrasNumDisplay.textContent = "";
  if (muestrasDescripcion) muestrasDescripcion.textContent = "";
  if (muestrasOrgano) muestrasOrgano.textContent = "";
  if (muestrasFecha) muestrasFecha.textContent = "";
  if (muestrasTecnicoId) muestrasTecnicoId.textContent = "";
  if (muestrasCaracteristicas) muestrasCaracteristicas.textContent = "";
  if (muestrasObservaciones) muestrasObservaciones.textContent = "";
  if (listaTubos) listaTubos.innerHTML = "";
  if (muestrasInformeDescripcion) muestrasInformeDescripcion.value = "";
  if (muestrasInformeFecha) muestrasInformeFecha.value = "";
  if (muestrasInformeTincion) muestrasInformeTincion.value = "";
  if (muestrasInformeObservaciones) muestrasInformeObservaciones.value = "";
  if (muestrasInformeImagen) muestrasInformeImagen.value = "";
  ocultarPanelNuevoInformeHematologia();
  if (btnNuevoInforme) {
    btnNuevoInforme.disabled = true;
    btnNuevoInforme.title = "Selecciona una muestra para crear un informe";
  }
  actualizarContextoInformeHematologia();
  limpiarEstadoInforme();
  imprimirInformesHematologia([]);
};

// ============================================================
// API - SUB-MUESTRAS
// ============================================================

const cargarSubMuestras = async (hematologiaId) => {
  return await fetch(`/api/muestrashematologia/hematologia/${hematologiaId}/`).then((r) => r.json());
};

const cargarSubMuestra = async (id) => {
  const response = await fetch(`/api/muestrashematologia/${id}/`);
  return await response.json();
};

const obtenerImagenesSubMuestra = async (muestraId) => {
  const response = await fetch(`/api/imageneshematologia/muestra/${muestraId}/`);
  return await response.json();
};

// ============================================================
// CRUD - SUB-MUESTRAS
// ============================================================

const crearSubMuestra = async (event) => {
  event.preventDefault();
  console.log("=== crearSubMuestra EJECUTADA ===");
  console.log("hematologiaId:", hematologiaId);

  if (!hematologiaId) {
    alert("Por favor, selecciona una muestra de hematología primero.");
    return;
  }

  const formData = new FormData();
  formData.append("descripcion", inputdescripcionMuestra ? inputdescripcionMuestra.value : "");
  formData.append("fecha", inputFechaMuestra ? inputFechaMuestra.value : "");
  formData.append("observaciones", inputObservacionesMuestra ? inputObservacionesMuestra.value : "");
  formData.append("descripcion_microscopica", inputMicroscopiaMuestra ? inputMicroscopiaMuestra.value : "");
  formData.append("tincion", selectTincionMuestra ? selectTincionMuestra.value : "");
  formData.append("hematologia", hematologiaId);

  if (inputImagenesMuestra && inputImagenesMuestra.files[0]) {
    formData.append("imagen", inputImagenesMuestra.files[0]);
  }

  try {
    evitarVaciadoListaPrincipal = true;

    const response = await fetch("/api/muestrashematologia/", {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      alert("Error al crear análisis: " + JSON.stringify(errorData));
      return;
    }

    const data = await response.json();
    console.log("Sub-muestra creada:", data);

    const hematologiaSeleccionadaId = hematologiaId;

    cerrarModal(modalnuevaMuestra);
    limpiarFormularioSubMuestra();

    // Refresca tabla principal y reselecciona para evitar estado visual desincronizado.
    const hematologiasResp = await cargarTodasHematologias();
    if (Array.isArray(hematologiasResp) && hematologiasResp.length > 0) {
      imprimirHematologias(hematologiasResp, true);
    } else {
      console.warn("No se refrescó la tabla principal para evitar vaciarla con una respuesta inválida.", hematologiasResp);
    }

    const hematologiaSeleccionada = normalizarListaApi(hematologiasResp)
      .find((item) => String(item.id_hematologia) === String(hematologiaSeleccionadaId));
    if (hematologiaSeleccionada) {
      hematologiaId = hematologiaSeleccionadaId;
      imprimirDetalleHematologia(hematologiaSeleccionada);
    }

    const subMuestras = await cargarSubMuestras(hematologiaSeleccionadaId);
    imprimirSubMuestras(subMuestras);
    alert("Análisis creado correctamente");
  } catch (err) {
    console.error("Error en fetch:", err);
    alert("Error al crear análisis: " + err.message);
  } finally {
    evitarVaciadoListaPrincipal = false;
  }
};

const limpiarFormularioSubMuestra = () => {
  if (inputdescripcionMuestra) inputdescripcionMuestra.value = "";
  if (inputFechaMuestra) inputFechaMuestra.value = "";
  if (inputObservacionesMuestra) inputObservacionesMuestra.value = "";
  if (inputMicroscopiaMuestra) inputMicroscopiaMuestra.value = "";
  if (selectTincionMuestra) selectTincionMuestra.value = "";
  if (inputImagenesMuestra) inputImagenesMuestra.value = "";
};

const cargarSubMuestraUpdateModal = async () => {
  if (!muestraId) return;
  const m = await cargarSubMuestra(muestraId);
  if (inputmodificardescripcionMuestra) inputmodificardescripcionMuestra.value = m.descripcion || "";
  if (inputmodificarfechaMuestra) inputmodificarfechaMuestra.value = m.fecha || "";
  if (selectmodificartincionMuestra) selectmodificartincionMuestra.value = m.tincion || "";
  if (inputmodificarobservacionesMuestra) inputmodificarobservacionesMuestra.value = m.observaciones || "";
  if (inputmodificarmicroscopiaMuestra) inputmodificarmicroscopiaMuestra.value = m.descripcion_microscopica || "";
};

const modificarSubMuestraUpdate = async (event) => {
  event.preventDefault();

  const data = {};
  if (inputmodificarfechaMuestra && inputmodificarfechaMuestra.value) data.fecha = inputmodificarfechaMuestra.value;
  if (inputmodificardescripcionMuestra && inputmodificardescripcionMuestra.value) data.descripcion = inputmodificardescripcionMuestra.value;
  if (inputmodificarobservacionesMuestra && inputmodificarobservacionesMuestra.value) data.observaciones = inputmodificarobservacionesMuestra.value;
  if (inputmodificarmicroscopiaMuestra && inputmodificarmicroscopiaMuestra.value) data.descripcion_microscopica = inputmodificarmicroscopiaMuestra.value;
  if (selectmodificartincionMuestra && selectmodificartincionMuestra.value) data.tincion = selectmodificartincionMuestra.value;
  data.hematologia = hematologiaId;

  try {
    const response = await fetch(`/api/muestrashematologia/${muestraId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const mensaje = err.error || err.detail || JSON.stringify(err) || "Error desconocido";
      alert("Error al modificar: " + mensaje);
      return;
    }

    // Actualizar detalle visible
    if (muestra__descripcion) muestra__descripcion.textContent = inputmodificardescripcionMuestra ? inputmodificardescripcionMuestra.value : "";
    if (muestra__fecha) muestra__fecha.textContent = formatFecha(inputmodificarfechaMuestra ? inputmodificarfechaMuestra.value : "");
    if (muestra__observaciones) muestra__observaciones.textContent = inputmodificarobservacionesMuestra ? inputmodificarobservacionesMuestra.value : "";
    if (muestra__descripcion_microscopica) muestra__descripcion_microscopica.textContent = inputmodificarmicroscopiaMuestra ? inputmodificarmicroscopiaMuestra.value : "";
    if (muestra__tincion) muestra__tincion.textContent = selectmodificartincionMuestra ? selectmodificartincionMuestra.value : "";

    cerrarModal(modalmodificarMuestra);

    const subMuestras = await cargarSubMuestras(hematologiaId);
    imprimirSubMuestras(subMuestras);
  } catch (err) {
    console.error("Error:", err);
    alert("Error al modificar: " + err.message);
  }
};

const borrarSubMuestra = async () => {
  if (!muestraId) return;

  try {
    evitarVaciadoListaPrincipal = true;

    const response = await fetch(`/api/muestrashematologia/${muestraId}/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });

    if (response.ok) {
      cerrarModal(modaldetalleMuestra);
      const subMuestras = await cargarSubMuestras(hematologiaId);
      imprimirSubMuestras(subMuestras);

      const hematologiasResp = await cargarTodasHematologias();
      imprimirHematologias(hematologiasResp, true);
    } else {
      alert("Error al eliminar el análisis");
    }
  } catch (err) {
    console.error(err);
  } finally {
    evitarVaciadoListaPrincipal = false;
  }
};

// ============================================================
// IMPRIMIR - SUB-MUESTRAS
// ============================================================

const imprimirSubMuestras = (respuesta) => {
  const lista = normalizarListaApi(respuesta);
  if (!listaTubos) return;
  listaTubos.innerHTML = "";

  const fragmento = document.createDocumentFragment();

  if (lista.length > 0) {
    lista.forEach((m) => {
      const tr = document.createElement("tr");
      tr.classList.add("table__row");

      const tdFecha = document.createElement("td");
      tdFecha.textContent = formatFecha(m.fecha);

      const tdDesc = document.createElement("td");
      tdDesc.textContent = (m.descripcion || "").substring(0, 80);
      tdDesc.title = m.descripcion || "";

      const tdTincion = document.createElement("td");
      tdTincion.textContent = m.tincion || "";

      const tdBtn = document.createElement("td");
      tdBtn.style.whiteSpace = "nowrap";

      const btndetalle = document.createElement("I");
      btndetalle.className = "d-inline-block fa-solid fa-eye Muestras__icon Muestras__icon--infoMuestras me-2";
      btndetalle.dataset.id = m.id_muestra;
      btndetalle.dataset.action = "view";
      btndetalle.title = "Ver detalle";

      const btneditar = document.createElement("I");
      btneditar.className = "d-inline-block fa-solid fa-file-pen Muestras__icon Muestras__icon--infoMuestras me-2";
      btneditar.dataset.id = m.id_muestra;
      btneditar.dataset.action = "edit";
      btneditar.title = "Modificar análisis";

      const btneliminar = document.createElement("I");
      btneliminar.className = "d-inline-block fa-solid fa-trash-can text-danger Muestras__icon Muestras__icon--infoMuestras me-2";
      btneliminar.dataset.id = m.id_muestra;
      btneliminar.dataset.action = "delete";
      btneliminar.title = "Eliminar análisis";

      tdBtn.appendChild(btndetalle);
      tdBtn.appendChild(btneditar);
      tdBtn.appendChild(btneliminar);

      tr.appendChild(tdFecha);
      tr.appendChild(tdDesc);
      tr.appendChild(tdTincion);
      tr.appendChild(tdBtn);

      fragmento.appendChild(tr);
    });
  } else {
    const span = document.createElement("span");
    span.classList.add("fw-bold", "text-danger", "text-opacity-50");
    span.textContent = "No se ha encontrado ninguna sub-muestra";
    fragmento.appendChild(span);
  }

  listaTubos.appendChild(fragmento);
};

// ============================================================
// DETALLE - SUB-MUESTRA
// ============================================================

const detailSubMuestra = async (muestraid) => {
  const m = await cargarSubMuestra(muestraid);
  muestraId = m.id_muestra;

  if (muestra__descripcion) muestra__descripcion.textContent = m.descripcion || "Sin descripción";
  if (muestra__fecha) muestra__fecha.textContent = formatFecha(m.fecha);
  if (muestra__observaciones) muestra__observaciones.textContent = m.observaciones || "Sin observaciones";
  if (muestra__descripcion_microscopica) muestra__descripcion_microscopica.textContent = m.descripcion_microscopica || "Sin descripción";
  if (muestra__tincion) muestra__tincion.textContent = m.tincion || "Sin tipo";

  // QR sub-muestra
  if (window.QRious && imgmuestra__qr) {
    new QRious({
      element: imgmuestra__qr,
      value: buildResolverUrl(m.qr_muestra),
      size: QR_RENDER_SIZE,
      background: "#ffffff",
      backgroundAlpha: 1,
      foreground: "#000000",
      level: "H",
    });
    window.muestraHemaQrUrl = buildResolverUrl(m.qr_muestra);
    const modalImg = document.getElementById("imgmuestra__qr_modal");
    if (modalImg) {
      modalImg.src = imgmuestra__qr.toDataURL ? imgmuestra__qr.toDataURL() : imgmuestra__qr.src;
    }
  }

  await mostrarImagenesSubMuestra(muestraId);

  abrirModal(modaldetalleMuestra);
};


// ============================================================
// IMÁGENES - SUB-MUESTRA
// ============================================================

const mostrarImagenesSubMuestra = async (muestraId_val) => {
  if (!muestra__img) return;
  muestra__img.innerHTML = "";

  const imagenes = await obtenerImagenesSubMuestra(muestraId_val);
  const renderEstadoSinImagen = () => {
    muestra__img.style.display = "flex";
    muestra__img.classList.add("muestra__galeria--vacia");
    imageId = null;

    if (visor__img) {
      visor__img.src = "./assets/images/no_disponible.jpg";
      visor__img.classList.add("visor__img--empty");
      visor__img.alt = "Sin imagen disponible";
    }

    const emptyState = document.createElement("div");
    emptyState.className = "muestra__empty-state";
    emptyState.innerHTML = "<span class='muestra__empty-title'>Sin imagen adjunta</span><span class='muestra__empty-text'>Esta muestra no tiene ninguna vista previa disponible.</span>";
    muestra__img.appendChild(emptyState);
  };

  if (imagenes.length === 0) {
    renderEstadoSinImagen();
  } else {
    muestra__img.style.display = "flex";
    muestra__img.classList.remove("muestra__galeria--vacia");
    if (visor__img) {
      visor__img.classList.remove("visor__img--empty");
      visor__img.alt = "Vista previa de la muestra";
    }
    imagenes.forEach((imagen, index) => {
      const newimg = document.createElement("IMG");
      newimg.id = imagen.id_imagen;
      newimg.src = imagen.imagen_url || (imagen.imagen_base64 ? `data:image/jpeg;base64,${imagen.imagen_base64}` : "");
      newimg.classList.add("muestra__img", "rounded");
      newimg.style.height = "70px";
      newimg.style.objectFit = "cover";
      newimg.style.cursor = "pointer";

      if (index === 0) {
        if (visor__img) visor__img.src = newimg.src;
        imageId = newimg.id;
      }

      const container = document.createElement("DIV");
      container.classList.add("position-relative", "m-1");
      container.style.display = "inline-block";

      // Botón borrar individual (X)
      const btnDelete = document.createElement("BUTTON");
      btnDelete.innerHTML = '<i class="fa-solid fa-circle-xmark text-danger" style="font-size:.8rem;"></i>';
      btnDelete.className = "btn btn-sm position-absolute top-0 end-0 p-0";
      btnDelete.style.background = "rgba(255,255,255,.85)";
      btnDelete.style.borderRadius = "50%";
      btnDelete.style.width = "20px";
      btnDelete.style.height = "20px";
      btnDelete.style.lineHeight = "1";
      btnDelete.title = "Eliminar imagen";
      
      btnDelete.onclick = (e) => {
        e.stopPropagation();
        if (confirm("¿Eliminar esta imagen?")) {
          imageId = imagen.id_imagen;
          borrarImagenSubMuestra();
        }
      };

      newimg.onclick = () => {
        if (visor__img) visor__img.src = newimg.src;
        imageId = newimg.id;
      };

      container.appendChild(newimg);
      container.appendChild(btnDelete);
      muestra__img.appendChild(container);
    });
  }

  // Botón "+" al final de la galería (siempre visible como caja/placeholder)
  const btnAdd = document.createElement("DIV");
  btnAdd.innerHTML = '<i class="fa-solid fa-plus fs-4"></i>';
  btnAdd.className = "d-flex align-items-center justify-content-center m-1 rounded border border-2 border-dashed";
  btnAdd.style.height = "70px";
  btnAdd.style.width = "70px";
  btnAdd.style.cursor = "pointer";
  btnAdd.style.backgroundColor = "rgba(0,0,0,0.03)";
  btnAdd.style.color = "var(--blue-color, #0d6efd)";
  btnAdd.style.borderStyle = "dashed !important";
  btnAdd.title = "Añadir imagen";
  btnAdd.onclick = () => aniadirImagenSubMuestra();
  muestra__img.appendChild(btnAdd);
};

const aniadirImagenSubMuestra = async () => {
  try {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*/*";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("imagen", file);
      formData.append("muestra", muestraId);

      const response = await fetch("/api/imageneshematologia/", {
        method: "POST",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: formData,
      });

      if (response.ok) {
        await mostrarImagenesSubMuestra(muestraId);
      } else {
        alert("Error al subir la imagen");
      }
    };

    input.click();
  } catch (err) {
    console.error("Error:", err);
    alert("Error al añadir imagen: " + err.message);
  }
};

const borrarImagenSubMuestra = async () => {
  if (!imageId) return;

  if (confirm("¿Desea eliminar esta imagen?")) {
    try {
      await fetch(`/api/imageneshematologia/${imageId}/`, {
        method: "DELETE",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      });
      await mostrarImagenesSubMuestra(muestraId);
    } catch (err) {
      console.error(err);
    }
  }
};

// ============================================================
// CONSULTAS POR FECHA
// ============================================================

const consultaFechaInicio = async () => {
  if (alertfecha) alertfecha.classList.add("ocultar");
  let respuesta;
  if (!fechafin || !fechafin.value) {
    respuesta = await obtenerHematologiasPorFecha(fechainicio.value);
  } else {
    if (new Date(fechainicio.value) > new Date(fechafin.value)) {
      if (alertfecha_text) alertfecha_text.textContent = "La fecha de inicio debe ser menor";
      if (alertfecha) alertfecha.classList.remove("ocultar");
      return;
    }
    respuesta = await obtenerHematologiasPorRango(fechainicio.value, fechafin.value);
  }
  imprimirHematologias(respuesta, false);
};

const consultaFechaFin = async () => {
  if (!fechainicio || !fechainicio.value) {
    if (alertfecha_text) alertfecha_text.textContent = "Seleccione una fecha de inicio";
    if (alertfecha) alertfecha.classList.remove("ocultar");
    return;
  }
  if (new Date(fechainicio.value) > new Date(fechafin.value)) {
    if (alertfecha_text) alertfecha_text.textContent = "La fecha de inicio debe ser menor";
    if (alertfecha) alertfecha.classList.remove("ocultar");
    return;
  }
  if (alertfecha) alertfecha.classList.add("ocultar");
  const respuesta = await obtenerHematologiasPorRango(fechainicio.value, fechafin.value);
  imprimirHematologias(respuesta, false);
};

// ============================================================
// CONSULTAS QR
// ============================================================

const consultarHematologiaQR = async (qr, silent = false) => {
  const response = await fetch(`/api/hematologia/qr/${qr}/`);
  const lista = normalizarListaApi(await response.json());
  if (lista.length > 0) {
    imprimirHematologias(lista);
    const h = lista[0];
    imprimirDetalleHematologia(h);
    hematologiaId = h.id_hematologia;
    const subMuestras = await cargarSubMuestras(hematologiaId);
    imprimirSubMuestras(subMuestras);
    return true;
  } else {
    if (!silent) alert("No se encontró ninguna muestra con ese QR");
    return false;
  }
};

const consultarSubMuestraQR = async (qr, silent = false) => {
  const response = await fetch(`/api/muestrashematologia/qr/${qr}/`);
  const lista = await response.json();
  if (lista.length > 0) {
    const hResp = await fetch(`/api/hematologia/${lista[0].hematologia}/`);
    const h = await hResp.json();
    await consultarHematologiaQR(h.qr_hematologia, true);
    await detailSubMuestra(lista[0].id_muestra);
    return true;
  } else {
    if (!silent) alert("No se encontró ningún análisis con ese QR");
    return false;
  }
};

const imprimirQR = (elemento) => {
  let qrimprimir = "";

  if (elemento === "hematologia") {
    if (imgMuestras__qr?.src) {
      qrimprimir = imgMuestras__qr.src;
    } else if (imgMuestras__qr?.toDataURL) {
      qrimprimir = imgMuestras__qr.toDataURL();
    }
  }

  if (elemento === "muestra") {
    const modalImg = document.getElementById("imgmuestra__qr_modal");
    if (modalImg?.src) {
      qrimprimir = modalImg.src;
    } else if (imgmuestra__qr?.src) {
      qrimprimir = imgmuestra__qr.src;
    } else if (imgmuestra__qr?.toDataURL) {
      qrimprimir = imgmuestra__qr.toDataURL();
    }
  }

  if (!qrimprimir) {
    alert("No hay QR generado para imprimir todavía.");
    return;
  }

  const printWindow = window.open("", "Imprimir imagen");
  if (!printWindow) return;
  printWindow.document.write(
    "<html><head><title>Imprimir imagen</title></head><body><img src='" +
    qrimprimir +
    "'></body></html>"
  );
  printWindow.print();
  printWindow.close();
};

// ============================================================
// HELPERS MODALES
// ============================================================

function abrirModal(modal) {
  if (!modal) return;
  modal.classList.add("showmodal");
  modal.classList.remove("hidemodal");
}

function cerrarModal(modal) {
  if (!modal) return;
  modal.classList.remove("showmodal");
  modal.classList.add("hidemodal");
}

// ============================================================
// INFORME DE RESULTADOS
// ============================================================

const guardarInformeMedico = async () => {
  if (!currentHematologiaId) {
    mostrarEstadoInforme("Selecciona una cita para guardar el informe.", "warning");
    return;
  }

  mostrarEstadoInforme("Guardando informe...", "info");
  cambiarEstadoBotonGuardar(true);

  const datosReporte = {
    descripcion: muestrasInformeDescripcion ? muestrasInformeDescripcion.value : "",
    fecha: muestrasInformeFecha ? muestrasInformeFecha.value : "",
    tincion: muestrasInformeTincion ? muestrasInformeTincion.value : "",
    observaciones: muestrasInformeObservaciones ? muestrasInformeObservaciones.value : "",
    hematologia: currentHematologiaId,
  };

  // Procesar imagen si existe
  if (muestrasInformeImagen && muestrasInformeImagen.files.length > 0) {
    const file = muestrasInformeImagen.files[0];
    await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        datosReporte.imagen = reader.result;
        resolve();
      };
      reader.onerror = () => reject(new Error("Error al leer la imagen"));
    });
  }

  try {
    const res = await fetch(`/api/informesresultado/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(datosReporte),
    });

    if (res.ok) {
      mostrarEstadoInforme("Informe guardado correctamente.", "success");
      if (muestrasInformeImagen) muestrasInformeImagen.value = "";
      ocultarPanelNuevoInformeHematologia();
      await refrescarInformesHematologia(currentHematologiaId);
    } else {
      const errorData = await res.json();
      console.error("Error al guardar informe:", errorData);
      mostrarEstadoInforme("Error al guardar el informe.", "danger");
    }
  } catch (error) {
    console.error("Error al guardar informe:", error);
    mostrarEstadoInforme("Error al guardar el informe.", "danger");
  } finally {
    cambiarEstadoBotonGuardar(false);
  }
};


// ============================================================
// DOM CONTENT LOADED - EVENTOS
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
  console.log("=== Hematología DOMContentLoaded ===");

  // Garantiza que no queden restricciones de fecha por cache o scripts anteriores.
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    input.removeAttribute("min");
    input.removeAttribute("max");
  });

  // Asignar campos de informe
  muestrasInformeDescripcion = document.getElementById("Muestras__informe_descripcion");
  muestrasInformeFecha = document.getElementById("Muestras__informe_fecha");
  muestrasInformeTincion = document.getElementById("Muestras__informe_tincion");
  muestrasInformeObservaciones = document.getElementById("Muestras__informe_observaciones");
  muestrasInformeImagen = document.getElementById("Muestras__informe_imagen");
  muestrasInformePreviewWrap = document.getElementById("Muestras__informe_preview_wrap");
  muestrasInformePreview = document.getElementById("Muestras__informe_preview");
  btnGuardarInforme = document.getElementById("btnGuardarInforme");

  // Mostrar body
  if (body) body.style.display = "block";

  // Cargar hematologías iniciales
  const respuesta = await cargarHematologiasIndex();
  imprimirHematologias(respuesta);
  limpiarDetalleHematologia();
  await restaurarEstadoDesdeUrl();

  // Fechas sin restricciones - permite seleccionar cualquier fecha
  // Se elimina la restricción de fecha mínima para permitir fechas pasadas

  // ---- Toggle Informe / Muestras ----
  const sectionMuestrasDiv = document.getElementById("sectionMuestras");
  const sectionInformeDiv = document.getElementById("sectionInforme");
  const btnToggleInforme = document.getElementById("btnToggleInforme");
  const btnToggleMuestras = document.getElementById("btnToggleMuestras");
  const panelInforme = sectionInformeDiv ? sectionInformeDiv.firstElementChild : null;
  const scrollInternosInforme = sectionInformeDiv
    ? sectionInformeDiv.querySelectorAll(".informe__scroll, .table__scroll, .table__scroll--m")
    : [];

  const abrirMenuInformes = () => {
    if (!sectionMuestrasDiv || !sectionInformeDiv) return;
    sectionMuestrasDiv.classList.add("d-none");
    sectionInformeDiv.classList.remove("d-none");
    sectionInformeDiv.classList.add(
      "d-flex",
      "align-items-center",
      "justify-content-center",
      "position-fixed",
      "top-0",
      "start-0",
      "w-100",
      "h-100"
    );
    sectionInformeDiv.style.zIndex = "2147483600";
    sectionInformeDiv.style.background = "rgba(255, 255, 255, 0.92)";
    sectionInformeDiv.style.padding = "1rem";
    sectionInformeDiv.style.overflowY = "auto";

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
  };

  const cerrarMenuInformes = () => {
    if (!sectionMuestrasDiv || !sectionInformeDiv) return;
    sectionInformeDiv.classList.add("d-none");
    sectionInformeDiv.classList.remove(
      "d-flex",
      "align-items-center",
      "justify-content-center",
      "position-fixed",
      "top-0",
      "start-0",
      "w-100",
      "h-100"
    );
    sectionInformeDiv.style.zIndex = "";
    sectionInformeDiv.style.background = "";
    sectionInformeDiv.style.padding = "";
    sectionInformeDiv.style.overflowY = "";

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

    sectionMuestrasDiv.classList.remove("d-none");
    sessionStorage.setItem(INFORME_TAB_KEY, "muestras");
  };

  if (btnToggleInforme && sectionMuestrasDiv && sectionInformeDiv) {
    btnToggleInforme.addEventListener("click", () => {
      abrirMenuInformes();
    });
  }
  if (btnToggleMuestras && sectionMuestrasDiv && sectionInformeDiv) {
    btnToggleMuestras.addEventListener("click", () => {
      cerrarMenuInformes();
    });
  }

  // Detectar cambio de módulo y limpiar estado si es necesario
  const CURRENT_MODULE_KEY = "current_module";
  const currentModule = "hematologia";
  const lastModule = sessionStorage.getItem(CURRENT_MODULE_KEY);
  
  // Siempre limpiar el estado de informe al cargar la página
  // El estado se guardará si el usuario navega dentro del módulo
  sessionStorage.removeItem(INFORME_TAB_KEY);
  
  // Guardar módulo actual
  sessionStorage.setItem(CURRENT_MODULE_KEY, currentModule);

  if (btnNuevoInforme) {
    btnNuevoInforme.addEventListener("click", () => {
      if (!obtenerHematologiaSeleccionadaParaInforme()) {
        mostrarEstadoInforme("Selecciona una muestra antes de crear un informe.", "warning");
        return;
      }
      mostrarPanelNuevoInformeHematologia(true);
    });
  }

  if (muestrasInformeImagen) {
    muestrasInformeImagen.addEventListener("change", () => {
      const file = muestrasInformeImagen.files && muestrasInformeImagen.files[0];
      if (!file) {
        actualizarPreviewInformeHematologia("");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => actualizarPreviewInformeHematologia(reader.result || "");
      reader.readAsDataURL(file);
    });
  }

  if (btnCancelarInforme) {
    btnCancelarInforme.addEventListener("click", () => {
      ocultarPanelNuevoInformeHematologia();
    });
  }

  if (modalNuevoInforme) {
    modalNuevoInforme.addEventListener("click", (event) => {
      if (event.target === modalNuevoInforme) {
        ocultarPanelNuevoInformeHematologia();
      }
    });
  }

  // ---- Filtros ----
  if (organos) {
    organos.addEventListener("change", async () => {
      const respuesta = await cargarPorOrgano();
      imprimirHematologias(respuesta, false);
    });
  }

  if (numMuestras) {
    numMuestras.addEventListener("change", async () => {
      const respuesta = await cargarPorNumero();
      imprimirHematologias(respuesta, false);
    });
  }

  if (fechainicio) fechainicio.addEventListener("change", consultaFechaInicio);
  if (fechafin) fechafin.addEventListener("change", consultaFechaFin);

  // Mostrar todas
  if (todasMuestras) {
    todasMuestras.addEventListener("click", async () => {
      const respuesta = await cargarTodasHematologias();
      imprimirHematologias(respuesta);
      limpiarParametrosQrUrl();
    });
  }

  // ---- Click en lista principal ----
  if (listaMuestras) {
    listaMuestras.addEventListener("click", detalleHematologia);
  }

  // ---- Nueva Hematología Principal ----
  if (btnformnuevaMuestras) {
    btnformnuevaMuestras.addEventListener("click", () => {
      abrirModal(modalnuevaMuestras);
    });
  }
  if (btnformcerrarnuevaMuestras) {
    btnformcerrarnuevaMuestras.addEventListener("click", () => {
      cerrarModal(modalnuevaMuestras);
    });
  }
  if (nuevaMuestras) {
    nuevaMuestras.addEventListener("submit", crearHematologia);
  }

  // ---- Modificar Hematología Principal ----
  if (btnformmodificarMuestras) {
    btnformmodificarMuestras.addEventListener("click", () => {
      if (!hematologiaId) {
        if (alertMuestras) alertMuestras.classList.remove("ocultar");
        return;
      }
      cargarHematologiaUpdateModal();
      abrirModal(modalupdateMuestras);
    });
  }
  if (btnformcerrarmodificarMuestras) {
    btnformcerrarmodificarMuestras.addEventListener("click", () => {
      cerrarModal(modalupdateMuestras);
    });
  }
  if (modificarMuestras) {
    modificarMuestras.addEventListener("submit", modificarHematologiaUpdate);
  }

  // ---- Eliminar Hematología Principal ----
  // El botón btnEliminarHematologia abre el modal Bootstrap eliminarMuestrasModal
  // El confirmarEliminar hace la petición DELETE
  if (btnEliminarHematologia) {
    btnEliminarHematologia.addEventListener("click", () => {
      if (!hematologiaId) {
        if (alertMuestras) alertMuestras.classList.remove("ocultar");
        return;
      }
      // Abrir modal de confirmación
      const modalEliminar = document.getElementById("eliminarMuestrasModal");
      if (modalEliminar) {
        const bsModal = new bootstrap.Modal(modalEliminar);
        bsModal.show();
      }
    });
  }

  if (confirmarEliminar) {
    confirmarEliminar.addEventListener("click", async () => {
      await borrarHematologia();
      // Cerrar modal Bootstrap
      const modalEliminar = document.getElementById("eliminarMuestrasModal");
      if (modalEliminar) {
        const bsModal = bootstrap.Modal.getInstance(modalEliminar);
        if (bsModal) bsModal.hide();
      }
    });
  }

  // Soporte legacy: conservar sólo si el botón existe en plantillas antiguas.
  if (btnborrar) {
    btnborrar.addEventListener("click", borrarHematologia);
  }

  if (confirmarEliminarSubMuestra) {
    confirmarEliminarSubMuestra.addEventListener("click", async () => {
      await borrarSubMuestra();
      const modalEliminarSub = document.getElementById("eliminarMuestraModal");
      if (modalEliminarSub) {
        const bsModalSub = bootstrap.Modal.getInstance(modalEliminarSub);
        if (bsModalSub) bsModalSub.hide();
      }
    });
  }

  // ---- Nueva Sub-muestra ----
  if (btnformnuevaMuestra) {
    btnformnuevaMuestra.addEventListener("click", () => {
      if (!hematologiaId) {
        if (alertMuestras) alertMuestras.classList.remove("ocultar");
        return;
      }
      abrirModal(modalnuevaMuestra);
    });
  }
  if (btnformcerrarnuevaMuestra) {
    btnformcerrarnuevaMuestra.addEventListener("click", () => {
      cerrarModal(modalnuevaMuestra);
    });
  }
  if (nuevaMuestra) {
    nuevaMuestra.addEventListener("submit", crearSubMuestra);
  }

  // ---- Click en lista de sub-muestras ----
  if (listaTubos) {
    listaTubos.addEventListener("click", async (event) => {
      const icon = event.target.closest("i[data-action]");
      if (!icon) return;

      const id = icon.dataset.id;
      const action = icon.dataset.action;
      if (!id || !action) return;

      if (action === "view") {
        detailSubMuestra(id);
        return;
      }

      muestraId = id;

      if (action === "edit") {
        await cargarSubMuestraUpdateModal();
        cerrarModal(modaldetalleMuestra);
        abrirModal(modalmodificarMuestra);
        return;
      }

      if (action === "delete") {
        if (confirm("¿Estás seguro de eliminar esta sub-muestra?")) {
          await borrarSubMuestra();
        }
      }
    });
  }

  // ---- Cerrar detalle sub-muestra ----
  if (btncerrardetalleMuestra) {
    btncerrardetalleMuestra.addEventListener("click", () => {
      cerrarModal(modaldetalleMuestra);
      if (muestra__img) muestra__img.innerHTML = "";
    });
  }

  // ---- Modificar Sub-muestra ----
  if (btnformmodificarmuestra) {
    btnformmodificarmuestra.addEventListener("click", () => {
      cargarSubMuestraUpdateModal();
      cerrarModal(modaldetalleMuestra);
      abrirModal(modalmodificarMuestra);
    });
  }
  if (btnformcerrarmodificarMuestra) {
    btnformcerrarmodificarMuestra.addEventListener("click", () => {
      cerrarModal(modalmodificarMuestra);
    });
  }
  if (modificarMuestra) {
    modificarMuestra.addEventListener("submit", modificarSubMuestraUpdate);
  }

  // ---- Imágenes sub-muestra ----
  if (btnborrarimagenmuestra) {
    btnborrarimagenmuestra.addEventListener("click", borrarImagenSubMuestra);
  }

  if (btnaniadirimagenmuestra) {
    btnaniadirimagenmuestra.addEventListener("click", aniadirImagenSubMuestra);
  }

  if (muestra__img) {
    muestra__img.addEventListener("click", async (event) => {
      if (event.target.nodeName === "IMG") {
        if (visor__img) visor__img.src = event.target.src;
        imageId = event.target.id;
      }
    });
  }

  // El botón "añadir imagen" está en el detalle de sub-muestra como div/i con id btn__qr
  // En hematologia.html el área del modal detalle tiene id="btnformmodificarmuestra"
  // Añadimos un botón añadir imagen haciendo click en el visor__img
  // Mejor: creamos un listener en el área de imágenes para añadir
  const btnAddImg = document.querySelector("#modaldetalleMuestra .fa-file-pen");
  // (es el botón modificar sub-muestra, no imagen)

  // ---- QR Consulta ----
  if (input__consultarqr) input__consultarqr.value = "";
  if (inputmuestra__qr) inputmuestra__qr.value = "";
  if (inputMuestras__qr) inputMuestras__qr.value = "";

  // Lectura QR sub-muestra desde modal
  if (qrMuestraModal) {
    qrMuestraModal.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        consultarSubMuestraQR(inputmuestra__qr ? inputmuestra__qr.value : "");
        if (inputmuestra__qr) inputmuestra__qr.value = "";
      } else if (event.key.length === 1) {
        if (inputmuestra__qr) inputmuestra__qr.value += event.key;
      }
    });
  }

  // Lectura QR general
  if (qrConsultaModal) {
    qrConsultaModal.addEventListener("shown.bs.modal", () => {
      if (input__consultarqr) {
        input__consultarqr.value = "";
        input__consultarqr.focus();
      }

      if (!window.Html5Qrcode) return;
      if (!html5QrInstance) html5QrInstance = new Html5Qrcode("qr-reader");
      Html5Qrcode.getCameras().then((cameras) => {
        const cameraId = cameras?.[0]?.id;
        if (!cameraId) return;
        html5QrInstance.start(
          cameraId,
          { fps: 10, qrbox: 220 },
          (decodedText) => resolverTextoEscaneado(decodedText),
          () => {}
        );
      }).catch(() => {});
    });

    qrConsultaModal.addEventListener("hidden.bs.modal", () => {
      if (html5QrInstance?.isScanning) {
        html5QrInstance.stop().catch(() => {});
      }
    });

    input__consultarqr?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        resolverTextoEscaneado(input__consultarqr.value);
      }
    });

    manualQrBtn?.addEventListener("click", () => {
      resolverTextoEscaneado(input__consultarqr?.value || "");
    });

    btn__imprimirqrMuestras?.addEventListener("click", () => imprimirQR("hematologia"));
    btn__imprimirqrmuestra?.addEventListener("click", () => imprimirQR("muestra"));
  }

  // ---- Informe de resultados ----
  if (btnGuardarInforme) {
    btnGuardarInforme.addEventListener("click", (event) => {
      event.preventDefault();
      window.guardarInformeHematologia();
    });
  }

  if (informesListaHematologia) {
    informesListaHematologia.addEventListener("click", async (event) => {
      const target = event.target.closest("i[data-action]");
      if (!target) return;
      const action = target.dataset.action;
      const informeId = target.dataset.id;
      if (!informeId) return;

      if (action === "info") {
        event.preventDefault();
        await window.verInfoInformeHematologia(informeId);
        return;
      }

      if (!currentHematologiaId) return;

      const informes = await cargarInformesHematologia(currentHematologiaId);
      const informe = informes.find((item) => String(item.id_informe) === String(informeId));
      if (!informe) return;

      if (action === "cargar") {
        informeEditandoId = String(informe.id_informe);
        actualizarEtiquetaBotonInforme();
        cargarInformeEnFormularioHematologia(informe);
        mostrarPanelNuevoInformeHematologia(false);
      }

      if (action === "ver") {
        const urlInforme = obtenerUrlInformeHematologia(informe);
        if (!urlInforme) {
          mostrarEstadoInforme("Este informe no tiene archivo adjunto.", "warning");
          return;
        }
        window.open(urlInforme, "_blank", "noopener");
      }

      if (action === "eliminar") {
        if (!confirm("¿Eliminar este informe?")) return;
        await borrarInformeHematologia(informeId);
        mostrarEstadoInforme("Informe eliminado correctamente.", "success");
        await refrescarInformesHematologia(currentHematologiaId);
      }
    });
  }

  // ---- Añadir imagen desde modal detalle (clic en visor) ----
  if (visor__img) {
    visor__img.addEventListener("dblclick", () => {
      aniadirImagenSubMuestra();
    });
  }
});
