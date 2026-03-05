// Hematología front-end logic - Clean global scope version
const token = sessionStorage.getItem("token");

// CSRF helper: get cookie and return headers for fetch calls
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function getHeaders(method = 'GET', isForm = false) {
  const headers = {};
  const m = method.toUpperCase();
  if (!isForm && m !== 'GET') headers['Content-Type'] = 'application/json';
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(m)) {
    const csrf = getCookie('csrftoken');
    if (csrf) headers['X-CSRFToken'] = csrf;
  }
  return headers;
}

// DOM elements - global scope
const MuestrasTable = document.getElementById("Muestras");
const muestrasSubTable = document.getElementById("muestras");
const numMuestrasSelect = document.getElementById("numMuestras");

const muestraDescripcion = document.getElementById("Muestras__descripcion");
const muestraTipo = document.getElementById("Muestras__tipo");
const muestraOrgano = document.getElementById("Muestras__organo");
const muestraMuestraNum = document.getElementById("Muestras__Muestras");
const muestraFecha = document.getElementById("Muestras__fecha");
const muestraCaracteristicas = document.getElementById("Muestras__caracteristicas");
const muestraObservaciones = document.getElementById("Muestras__observaciones");

const formnuevaMuestra = document.getElementById("nuevaMuestra");
const formnuevaMuestras = document.getElementById("nuevaMuestras");
const formmodificarMuestra = document.getElementById("modificarMuestra");
const modalnuevaMuestra = document.getElementById("modalnuevaMuestra");
const modalnuevaMuestras = document.getElementById("modalnuevaMuestras");
const modaldetalleMuestra = document.getElementById("modaldetalleMuestra");
const modalmodificarMuestra = document.getElementById("modalmodificarMuestra");

const btnformnuevaMuestras = document.getElementById("btnformnuevaMuestras");
const btnformcerrarnuevaMuestras = document.getElementById("btnformcerrarnuevaMuestras");
const btnformnuevaMuestra = document.getElementById("btnformnuevaMuestra");
const btnformcerrarnuevaMuestra = document.getElementById("btnformcerrarnuevaMuestra");
const btncerrardetalleMuestra = document.getElementById("btncerrardetalleMuestra");
const btnformmodificarMuestras = document.getElementById("btnformmodificarMuestras");
const btnformmodificarmuestra = document.getElementById("btnformmodificarmuestra");
const btnformcerrarmodificarMuestra = document.getElementById("btnformcerrarmodificarMuestra");
const btnformcerrarmodificarMuestras = document.getElementById("btnformcerrarmodificarMuestras");
const btnEliminarHematologia = document.getElementById("btnEliminarHematologia");
const btnToggleMuestras = document.getElementById("btnToggleMuestras");
const btnToggleInforme = document.getElementById("btnToggleInforme");
const btnGuardarInforme = document.getElementById("btnGuardarInforme");

const det_muestra__descripcion = document.getElementById("muestra__descripcion");
const det_muestra__fecha = document.getElementById("muestra__fecha");
const det_muestra__tincion = document.getElementById("muestra__tincion");
const det_muestra__observaciones = document.getElementById("muestra__observaciones");
const visor__img = document.getElementById("visor__img");
const listado__img = document.getElementById("muestra__img");

const sectionMuestras = document.getElementById("sectionMuestras");
const sectionInforme = document.getElementById("sectionInforme");

const muestraInformeDescripcion = document.getElementById("muestraInformeDescripcion");
const muestraInformeFecha = document.getElementById("muestraInformeFecha");
const muestraInformeTincion = document.getElementById("muestraInformeTincion");
const muestraInformeObservaciones = document.getElementById("muestraInformeObservaciones");
const muestraInformeImagen = document.getElementById("muestraInformeImagen");

// State variables
let hematologiaId = null;
let subMuestraId = null;

// API methods
const api = {
  index: () => fetch("/api/hematologia/index/").then((r) => r.json()),
  todos: () => fetch("/api/hematologia/todos/").then((r) => r.json()),
  get: (id) => fetch(`/api/hematologia/${id}/`).then((r) => r.json()),
  post: (data) => fetch("/api/hematologia/", { 
    method: "POST", 
    headers: getHeaders('POST'),
    body: JSON.stringify(data)
  }),
  subByHematologia: (id) => fetch(`/api/muestrashematologia/hematologia/${id}/`).then((r) => r.json()),
  getSub: (id) => fetch(`/api/muestrashematologia/${id}/`).then((r) => r.json()),
  postSub: (formData) => fetch("/api/muestrashematologia/", { 
    method: "POST", 
    headers: getHeaders('POST', true),
    body: formData 
  }),
  updateSub: (id, data) => fetch(`/api/muestrashematologia/${id}/`, {
    method: "PUT",
    headers: getHeaders('PUT'),
    body: JSON.stringify(data)
  }),
  deleteSub: (id) => fetch(`/api/muestrashematologia/${id}/`, { 
    method: "DELETE",
    headers: getHeaders('DELETE')
  }),
  deleteHematologia: (id) => fetch(`/api/hematologia/${id}/`, { 
    method: "DELETE",
    headers: getHeaders('DELETE')
  }),
  imagenesSub: (id) => fetch(`/api/imageneshematologia/muestra/${id}/`).then((r) => r.json()),
  updateInforme: (id, formData) => fetch(`/api/hematologia/${id}/actualizar_informe/`, {
    method: "POST",
    headers: getHeaders('POST', true),
    body: formData
  }),
};

// Helper functions
function formatDateISOToDMY(iso) {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function formatDateDMYToISO(dmy) {
  if (!dmy) return "";
  const parts = dmy.split("-");
  if (parts.length !== 3) return dmy;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function renderHematologias(list) {
  if (!MuestrasTable) return;
  MuestrasTable.innerHTML = "";
  if (numMuestrasSelect) numMuestrasSelect.innerHTML = "<option selected disabled>Nº Muestra</option>";

  list.forEach((h) => {
    const tr = document.createElement("tr");
    const fecha = formatDateISOToDMY(h.fecha);
    const idField = h.id_hematologia || h.id || h.pk;
    tr.innerHTML = `
      <td>${h.hematologia || "-"}</td>
      <td>${fecha}</td>
      <td title="${h.descripcion || ""}">${(h.descripcion || "").substring(0, 50)}</td>
      <td>${h.organo || "-"}</td>
      <td><i class="fa-solid fa-file-invoice blue__color--negrita fs-5 icono__efect" data-id="${idField}" title="Ver Detalle"></i></td>
    `;
    MuestrasTable.appendChild(tr);
    if (numMuestrasSelect && h.hematologia) {
      const opt = document.createElement("option");
      opt.value = h.hematologia;
      opt.textContent = h.hematologia;
      numMuestrasSelect.appendChild(opt);
    }
  });
}

function renderSubMuestras(list) {
  if (!muestrasSubTable) return;
  muestrasSubTable.innerHTML = "";
  list.forEach((m) => {
    const tr = document.createElement("tr");
    const fecha = formatDateISOToDMY(m.fecha);
    const idField = m.id_muestra || m.id || m.pk;
    tr.innerHTML = `
      <td>${fecha}</td>
      <td>${m.descripcion || ""}</td>
      <td>${m.tincion || ""}</td>
      <td><i class="fa-solid fa-file-invoice blue__color--negrita fs-5 icono__efect btn-detalle-sub" data-id="${idField}" title="Detalle Sub-muestra"></i></td>
    `;
    muestrasSubTable.appendChild(tr);
  });
}

async function showHematologiaDetail(id) {
  try {
    const h = await api.get(id);
    hematologiaId = h.id_hematologia || h.id || h.pk || id;
    if (muestraMuestraNum) muestraMuestraNum.textContent = h.hematologia || "";
    if (muestraDescripcion) muestraDescripcion.textContent = (h.descripcion || "").substring(0, 200);
    if (muestraTipo) muestraTipo.textContent = h.organo || "";
    if (muestraOrgano) muestraOrgano.textContent = h.organo || "";
    if (muestraFecha) muestraFecha.textContent = formatDateISOToDMY(h.fecha);
    if (muestraCaracteristicas) muestraCaracteristicas.textContent = h.caracteristicas || "";
    if (muestraObservaciones) muestraObservaciones.textContent = h.observaciones || "";

    // Load informe data if exists
    if (muestraInformeDescripcion) muestraInformeDescripcion.value = h.informe_descripcion || "";
    if (muestraInformeFecha) muestraInformeFecha.value = h.informe_fecha || "";
    if (muestraInformeTincion) muestraInformeTincion.value = h.informe_tincion || "";
    if (muestraInformeObservaciones) muestraInformeObservaciones.value = h.informe_observaciones || "";

    const subs = await api.subByHematologia(hematologiaId);
    renderSubMuestras(subs || []);
  } catch (e) {
    console.error("Error mostrando detalle:", e);
  }
}

// Event Listeners - Click handlers
if (MuestrasTable) {
  MuestrasTable.addEventListener("click", async (ev) => {
    const t = ev.target.closest("[data-id]");
    if (!t) return;
    const id = t.getAttribute("data-id");
    await showHematologiaDetail(id);
  });
}

if (muestrasSubTable) {
  muestrasSubTable.addEventListener("click", async (ev) => {
    const t = ev.target.closest("[data-id]");
    if (!t) return;
    subMuestraId = t.getAttribute("data-id");
    try {
      const sub = await api.getSub(subMuestraId);
      if (!sub) return;
      if (det_muestra__descripcion) det_muestra__descripcion.textContent = sub.descripcion || "";
      if (det_muestra__fecha) det_muestra__fecha.textContent = formatDateISOToDMY(sub.fecha);
      if (det_muestra__tincion) det_muestra__tincion.textContent = sub.tincion || "";
      if (det_muestra__observaciones) det_muestra__observaciones.textContent = sub.observaciones || "";

      // Load images
      if (listado__img) listado__img.innerHTML = "";
      try {
        const imgs = await api.imagenesSub(subMuestraId);
        if (imgs && imgs.length > 0) {
          imgs.forEach((img, idx) => {
            const imgEl = document.createElement("img");
            imgEl.src = `data:image/jpeg;base64,${img.imagen_base64}`;
            imgEl.className = "muestra__img m-1";
            imgEl.style.width = "60px";
            imgEl.style.cursor = "pointer";
            imgEl.addEventListener("click", () => { if (visor__img) visor__img.src = imgEl.src; });
            listado__img.appendChild(imgEl);
            if (idx === 0 && visor__img) visor__img.src = imgEl.src;
          });
        } else if (visor__img) {
          visor__img.src = "./assets/images/no_disponible.jpg";
        }
      } catch (e) {
        console.error("Error cargando imágenes:", e);
      }

      // Show detail modal
      if (modaldetalleMuestra) modaldetalleMuestra.classList.add("showmodal");
    } catch (e) {
      console.error("Error cargando detalle de sub-muestra:", e);
    }
  });
}

// Modal controls
btnformnuevaMuestras?.addEventListener("click", () => {
  if (modalnuevaMuestras) modalnuevaMuestras.classList.add("showmodal");
});

btnformcerrarnuevaMuestras?.addEventListener("click", () => {
  if (modalnuevaMuestras) modalnuevaMuestras.classList.remove("showmodal");
});

btnformnuevaMuestra?.addEventListener("click", () => {
  if (!hematologiaId) {
    alert("Seleccione una hematología antes de crear una sub-muestra");
    return;
  }
  if (modalnuevaMuestra) modalnuevaMuestra.classList.add("showmodal");
});

btnformcerrarnuevaMuestra?.addEventListener("click", () => {
  if (modalnuevaMuestra) modalnuevaMuestra.classList.remove("showmodal");
});

btncerrardetalleMuestra?.addEventListener("click", () => {
  if (modaldetalleMuestra) modaldetalleMuestra.classList.remove("showmodal");
});

// Abrir modal para editar sub-muestra
btnformmodificarmuestra?.addEventListener("click", () => {
  if (!subMuestraId) {
    alert("Seleccione una sub-muestra antes de modificar");
    return;
  }
  // Cargar datos actuales en los campos de edición
  const descripcion = det_muestra__descripcion?.textContent || "";
  let fecha = det_muestra__fecha?.textContent || "";
  const tincion = det_muestra__tincion?.textContent || "";
  const observaciones = det_muestra__observaciones?.textContent || "";
  
  // Convertir fecha de DMY a ISO format si es necesario
  if (fecha && fecha.includes("-")) {
    const partes = fecha.split("-");
    if (partes.length === 3 && partes[0].length === 2) {
      // Es DMY (DD-MM-YYYY), convertir a ISO (YYYY-MM-DD)
      fecha = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
  }
  
  document.getElementById("inputmodificardescripcionMuestra").value = descripcion;
  document.getElementById("inputmodificarfechaMuestra").value = fecha;
  document.getElementById("selectmodificartincionMuestra").value = tincion;
  document.getElementById("inputmodificarobservacionesMuestra").value = observaciones;
  
  if (modaldetalleMuestra) modaldetalleMuestra.classList.remove("showmodal");
  if (modalmodificarMuestra) modalmodificarMuestra.classList.add("showmodal");
});

btnformcerrarmodificarMuestra?.addEventListener("click", () => {
  if (modalmodificarMuestra) modalmodificarMuestra.classList.remove("showmodal");
});

btnformmodificarMuestras?.addEventListener("click", async () => {
  if (!hematologiaId) {
    alert("Seleccione una hematología antes de modificarla");
    return;
  }
  // Implement update modal logic here
});

btnformcerrarmodificarMuestras?.addEventListener("click", () => {
  // Close update modal
});

btnToggleMuestras?.addEventListener("click", () => {
  if (sectionMuestras && sectionInforme) {
    sectionInforme.classList.add("d-none");
    sectionMuestras.classList.remove("d-none");
  }
});

btnToggleInforme?.addEventListener("click", () => {
  if (sectionMuestras && sectionInforme) {
    sectionMuestras.classList.add("d-none");
    sectionInforme.classList.remove("d-none");
  }
});

// Form submissions
formnuevaMuestras?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const tecnicoId = sessionStorage.getItem("user") || 1;
  const data = {
    hematologia: document.getElementById("inputMuestras")?.value || "",
    descripcion: document.getElementById("inputDescripcion")?.value || "",
    organo: document.getElementById("inputTipoMuestras")?.value || "",
    fecha: document.getElementById("inputFecha")?.value || "",
    caracteristicas: document.getElementById("inputCaracteristicas")?.value || "",
    observaciones: document.getElementById("inputObservaciones")?.value || "",
    tecnico: tecnicoId
  };

  try {
    const res = await api.post(data);
    if (res.ok) {
      alert("✓ Hematología creada correctamente");
      location.reload();
    } else {
      const err = await res.text();
      console.error("Error creando hematología:", err);
      alert("✗ Error creando hematología");
    }
  } catch (e) {
    console.error("Error:", e);
    alert("✗ Error creando hematología");
  }
});

formnuevaMuestra?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!hematologiaId) {
    alert("Seleccione una hematología antes de crear una sub-muestra");
    return;
  }

  const formData = new FormData();
  formData.append("descripcion", document.getElementById("inputdescripcionMuestra")?.value || "");
  formData.append("fecha", document.getElementById("inputFechaMuestra")?.value || "");
  formData.append("tincion", document.getElementById("selectTincionMuestra")?.value || "");
  formData.append("observaciones", document.getElementById("inputObservacionesMuestra")?.value || "");
  formData.append("hematologia", hematologiaId);

  const file = document.getElementById("inputImagenesMuestra")?.files[0];
  if (file) formData.append("imagen", file);

  try {
    const res = await api.postSub(formData);
    if (res.ok) {
      console.log("✓ Sub-muestra creada exitosamente");
      if (modalnuevaMuestra) modalnuevaMuestra.classList.remove("showmodal");
      const subs = await api.subByHematologia(hematologiaId);
      renderSubMuestras(subs || []);
      if (formnuevaMuestra) formnuevaMuestra.reset();
      alert("✓ Sub-muestra guardada correctamente");
    } else {
      const err = await res.text();
      console.error("Error creando sub-muestra:", err);
      alert(`✗ Error: ${err}`);
    }
  } catch (e) {
    console.error("Error:", e);
    alert("✗ Error creando sub-muestra");
  }
});

// Editar sub-muestra
formmodificarMuestra?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!subMuestraId) {
    alert("No hay sub-muestra seleccionada");
    return;
  }

  const data = {
    descripcion: document.getElementById("inputmodificardescripcionMuestra")?.value || "",
    fecha: document.getElementById("inputmodificarfechaMuestra")?.value || "",
    tincion: document.getElementById("selectmodificartincionMuestra")?.value || "",
    observaciones: document.getElementById("inputmodificarobservacionesMuestra")?.value || "",
    hematologia: hematologiaId
  };

  try {
    const res = await api.updateSub(subMuestraId, data);
    if (res.ok) {
      console.log("✓ Sub-muestra actualizada");
      if (modalmodificarMuestra) modalmodificarMuestra.classList.remove("showmodal");
      
      // Actualizamos el detalle y la tabla
      const sub = await api.getSub(subMuestraId);
      if (det_muestra__descripcion) det_muestra__descripcion.textContent = sub.descripcion || "";
      if (det_muestra__fecha) det_muestra__fecha.textContent = formatDateISOToDMY(sub.fecha);
      if (det_muestra__tincion) det_muestra__tincion.textContent = sub.tincion || "";
      if (det_muestra__observaciones) det_muestra__observaciones.textContent = sub.observaciones || "";
      
      const subs = await api.subByHematologia(hematologiaId);
      renderSubMuestras(subs || []);
      
      alert("✓ Sub-muestra actualizada correctamente");
      if (modaldetalleMuestra) modaldetalleMuestra.classList.add("showmodal");
    } else {
      const err = await res.text();
      console.error("Error actualizando:", err);
      alert(`✗ Error: ${err}`);
    }
  } catch (e) {
    console.error("Error:", e);
    alert("✗ Error actualizando sub-muestra");
  }
});

// Delete handlers
btnEliminarHematologia?.addEventListener("click", async () => {
  if (!hematologiaId) {
    alert("Seleccione una hematología antes de eliminar");
    return;
  }
  if (!confirm("¿Desea eliminar esta hematología?")) return;
  try {
    const res = await api.deleteHematologia(hematologiaId);
    if (res.ok) {
      location.reload();
    } else {
      alert("Error al eliminar hematología");
    }
  } catch (e) {
    console.error("Error:", e);
    alert("Error al eliminar hematología");
  }
});

// Delete sub-muestra from detail modal
const deleteIcon = modaldetalleMuestra?.querySelector('[title="Borrar Muestra"]');
if (deleteIcon) {
  deleteIcon.addEventListener("click", async () => {
    if (!subMuestraId) {
      alert("Seleccione una sub-muestra antes de eliminar");
      return;
    }
    if (!confirm("¿Desea eliminar esta sub-muestra?")) return;
    try {
      const res = await api.deleteSub(subMuestraId);
      if (res.ok) {
        if (modaldetalleMuestra) modaldetalleMuestra.classList.remove("showmodal");
        const subs = await api.subByHematologia(hematologiaId);
        renderSubMuestras(subs || []);
      } else {
        alert("Error al eliminar sub-muestra");
      }
    } catch (e) {
      console.error("Error:", e);
      alert("Error al eliminar sub-muestra");
    }
  });
}

// Save informe
btnGuardarInforme?.addEventListener("click", async () => {
  if (!hematologiaId) {
    alert("Seleccione una hematología antes de guardar informe");
    return;
  }

  const formData = new FormData();
  formData.append("informe_descripcion", muestraInformeDescripcion?.value || "");
  formData.append("informe_fecha", muestraInformeFecha?.value || "");
  formData.append("informe_tincion", muestraInformeTincion?.value || "");
  formData.append("informe_observaciones", muestraInformeObservaciones?.value || "");

  const file = muestraInformeImagen?.files[0];
  if (file) formData.append("informe_imagen", file);

  try {
    const res = await api.updateInforme(hematologiaId, formData);
    if (res.ok) {
      alert("Informe guardado correctamente");
    } else {
      alert("Error al guardar informe");
    }
  } catch (e) {
    console.error("Error:", e);
    alert("Error al guardar informe");
  }
});

// Initial load
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await api.index();
    renderHematologias(data || []);
  } catch (e) {
    console.error("Error cargando hematologías:", e);
  }
});
