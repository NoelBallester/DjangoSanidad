// Hematología front-end logic (inspired by citologias.js)
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

const numMuestras = document.getElementById("numMuestras");
const organos = document.getElementById("organos");
const Muestras = document.getElementById("Muestras"); // tabla superior (hematologías)
const muestras = document.getElementById("muestras"); // tabla inferior (muestras de hematología)

const todasMuestrasBtn = document.getElementById("todasMuestras");
const btnformnuevaMuestras = document.getElementById("btnformnuevaMuestras");

// Detalle hematología (panel derecho)
const Muestras__descripcion = document.getElementById("Muestras__descripcion");
const Muestras__tipo = document.getElementById("Muestras__tipo");
const Muestras__organo = document.getElementById("Muestras__organo");
const Muestras__fecha = document.getElementById("Muestras__fecha");
const Muestras__caracteristicas = document.getElementById("Muestras__caracteristicas");
const Muestras__observaciones = document.getElementById("Muestras__observaciones");
const Muestras__Muestras = document.getElementById("Muestras__Muestras");

// Consulta por fechas
const fechainicio = document.getElementById("fechainicio");
const fechafin = document.getElementById("fechafin");

let hematologiaId = null;
// Clean, unified hematologia frontend
(() => {
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
  const modalnuevaMuestra = document.getElementById("modalnuevaMuestra");
  const modaldetalleMuestra = document.getElementById("modaldetalleMuestra");

  const det_muestra__descripcion = document.getElementById("muestra__descripcion");
  const det_muestra__fecha = document.getElementById("muestra__fecha");
  const det_muestra__tincion = document.getElementById("muestra__tincion");
  const det_muestra__observaciones = document.getElementById("muestra__observaciones");
  const visor__img = document.getElementById("visor__img");
  const listado__img = document.getElementById("muestra__img");

  let hematologiaId = null;
  let subMuestraId = null;

  const api = {
    index: () => fetch("/api/hematologia/index/").then((r) => r.json()),
    todos: () => fetch("/api/hematologia/todos/").then((r) => r.json()),
    get: (id) => fetch(`/api/hematologia/${id}/`).then((r) => r.json()),
    subByHematologia: (id) => fetch(`/api/muestrashematologia/hematologia/${id}/`).then((r) => r.json()),
    getSub: (id) => fetch(`/api/muestrashematologia/${id}/`).then((r) => r.json()),
    postSub: (formData) => fetch(`/api/muestrashematologia/`, { method: "POST", body: formData }),
    deleteSub: (id) => fetch(`/api/muestrashematologia/${id}/`, { method: "DELETE" }),
    deleteHematologia: (id) => fetch(`/api/hematologia/${id}/`, { method: "DELETE" }),
    imagenesSub: (id) => fetch(`/api/imageneshematologia/muestra/${id}/`).then((r) => r.json()),
  };

  function formatDateISOToDMY(iso) {
    if (!iso) return "";
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  function renderHematologias(list) {
    if (!MuestrasTable) return;
    MuestrasTable.innerHTML = "";
    if (numMuestrasSelect) numMuestrasSelect.innerHTML = "<option selected disabled>Nº Muestra</option>";

    list.forEach((h) => {
      const tr = document.createElement("tr");
      const fecha = formatDateISOToDMY(h.fecha);
      const idField = h.id_hematologia || h.id || h.pk || h.id_hematologia;
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

      const subs = await api.subByHematologia(hematologiaId);
      renderSubMuestras(subs || []);
    } catch (e) {
      console.error("Error mostrando detalle:", e);
    }
  }

  // Click handlers delegated from tables
  MuestrasTable?.addEventListener("click", async (ev) => {
    const t = ev.target.closest("[data-id]");
    if (!t) return;
    const id = t.getAttribute("data-id");
    await showHematologiaDetail(id);
  });

  muestrasSubTable?.addEventListener("click", async (ev) => {
    const t = ev.target.closest("[data-id]");
    if (!t) return;
    subMuestraId = t.getAttribute("data-id");
    const sub = await api.getSub(subMuestraId);
    if (!sub) return;
    if (det_muestra__descripcion) det_muestra__descripcion.textContent = sub.descripcion || "";
    if (det_muestra__fecha) det_muestra__fecha.textContent = formatDateISOToDMY(sub.fecha);
    if (det_muestra__tincion) det_muestra__tincion.textContent = sub.tincion || "";
    if (det_muestra__observaciones) det_muestra__observaciones.textContent = sub.observaciones || "";

    // load images
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

    // show detail modal
    if (modaldetalleMuestra) modaldetalleMuestra.classList.add("showmodal");
  });

  // Create sub-muestra
  formnuevaMuestra?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!hematologiaId) {
      alert("Seleccione una hematología antes de crear una sub-muestra");
      return;
    }
    const formData = new FormData();
    formData.append("descripcion", document.getElementById("inputdescripcionMuestra").value);
    formData.append("fecha", document.getElementById("inputFechaMuestra").value);
    formData.append("tincion", document.getElementById("selectTincionMuestra").value);
    formData.append("observaciones", document.getElementById("inputObservacionesMuestra").value);
    formData.append("hematologia", hematologiaId);
    const file = document.getElementById("inputImagenesMuestra").files[0];
    if (file) formData.append("imagen", file);

    try {
      const res = await api.postSub(formData);
      if (res.ok) {
        if (modalnuevaMuestra) modalnuevaMuestra.classList.remove("showmodal");
        const subs = await api.subByHematologia(hematologiaId);
        renderSubMuestras(subs || []);
      } else {
        const err = await res.text();
        console.error("Error creando sub-muestra:", err);
        alert("Error creando sub-muestra");
      }
    } catch (e) {
      console.error(e);
      alert("Error creando sub-muestra");
    }
  });

  // Delete sub-muestra (icon inside detail modal with title "Borrar Muestra")
  const deleteIcon = modaldetalleMuestra?.querySelector('[title="Borrar Muestra"]');
  if (deleteIcon) {
    deleteIcon.addEventListener("click", async () => {
      if (!subMuestraId) { alert("Seleccione una sub-muestra"); return; }
      if (!confirm("¿Desea eliminar esta sub-muestra?")) return;
      try {
        const res = await api.deleteSub(subMuestraId);
        if (res.ok) {
          modaldetalleMuestra.classList.remove("showmodal");
          const subs = await api.subByHematologia(hematologiaId);
          renderSubMuestras(subs || []);
        } else {
          alert("Error al eliminar la sub-muestra");
        }
      } catch (e) { console.error(e); alert("Error al eliminar la sub-muestra"); }
    });
  }

  // Delete hematologia (confirm button id confirmEliminarHematologia)
  const confirmEliminarHematologia = document.getElementById("confirmEliminarHematologia");
  if (confirmEliminarHematologia) {
    confirmEliminarHematologia.addEventListener("click", async () => {
      if (!hematologiaId) { alert("Seleccione una hematología"); return; }
      try {
        const res = await api.deleteHematologia(hematologiaId);
        if (res.ok) location.reload(); else alert("Error al eliminar hematología");
      } catch (e) { console.error(e); alert("Error al eliminar hematología"); }
    });
  }

  // Initial load
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const data = await api.index();
      renderHematologias(data || []);
    } catch (e) { console.error("Error cargando hematologías:", e); }
  });
})();
            </td>
        `;
        muestrasSubTable.appendChild(tr);
    });
};

const mostrarDetalleHematologia = (h) => {
    hematologiaId = h.id_hematologia;
    currentHematologiaId = h.id_hematologia;

    muestraMuestraNum.textContent = h.hematologia;
    muestraDescripcion.textContent = h.descripcion.substring(0, 50);
    muestraTipo.textContent = h.organo; // En html es Muestras__tipo, en backend es organo? Ojo.
    muestraOrgano.textContent = h.organo;

    const f = h.fecha.split("-");
    muestraFecha.textContent = `${f[2]}-${f[1]}-${f[0]}`;

    muestraCaracteristicas.textContent = h.caracteristicas;
    muestraObservaciones.textContent = h.observaciones;

    // Informe
    muestraInformeDescripcion.value = h.informe_descripcion || "";
    muestraInformeFecha.value = h.informe_fecha || "";
    muestraInformeTincion.value = h.informe_tincion || "";
    muestraInformeObservaciones.value = h.informe_observaciones || "";

    // QR (si existe qrious)
    const qrCanvas = document.getElementById("qrCanvasMain");
    if (window.QRious && qrCanvas) {
        new QRious({
            element: qrCanvas,
            value: h.qr_hematologia,
            size: 200,
            backgroundAlpha: 0,
            foreground: "#4ca0cc",
            level: "H",
        });
    }
};

// --- LOGICA DE ELIMINACION ---
const btnEliminarHematologia = document.getElementById("btnEliminarHematologia");
const confirmEliminarHematologia = document.getElementById("confirmEliminarHematologia");
const eliminarMuestrasModal = new bootstrap.Modal(document.getElementById('eliminarMuestrasModal'));

btnEliminarHematologia?.addEventListener("click", () => {
    if (!hematologiaId) {
        alertMuestras.classList.remove("ocultar");
        return;
    }
    eliminarMuestrasModal.show();
});

confirmEliminarHematologia?.addEventListener("click", async () => {
    if (!hematologiaId) return;
    const res = await fetch(`/api/hematologia/${hematologiaId}/`, {
        method: "DELETE"
    });
    if (res.ok) {
        location.reload();
    } else {
        alert("Error al eliminar la muestra");
    }
});

// --- EVENTOS ---

MuestrasTable.addEventListener("click", async (e) => {
    if (e.target.classList.contains("fa-file-invoice")) {
        const id = e.target.getAttribute("data-id");
        const h = await cargarHematologia(id);
        mostrarDetalleHematologia(h);
        const subs = await cargarSubMuestras(id);
        imprimirSubMuestras(subs);
        alertMuestras.classList.add("ocultar");
    }
});

muestrasSubTable.addEventListener("click", async (e) => {
    if (e.target.classList.contains("fa-file-invoice")) {
        subMuestraId = e.target.getAttribute("data-id");
        const response = await fetch(`/api/muestrashematologia/${subMuestraId}/`).then(r => r.json());

        det_muestra__descripcion.textContent = response.descripcion;
        const f = response.fecha.split("-");
        det_muestra__fecha.textContent = `${f[2]}-${f[1]}-${f[0]}`;
        det_muestra__tincion.textContent = response.tincion;
        det_muestra__observaciones.textContent = response.observaciones;

        // Imagenes
        listado__img.innerHTML = "";
        const imagenes = await cargarImagenesSubMuestra(subMuestraId);
        if (imagenes.length === 0) {
            visor__img.src = "./assets/images/no_disponible.jpg";
        } else {
            imagenes.forEach((img, idx) => {
                const imgEl = document.createElement("img");
                imgEl.src = `data:image/jpeg;base64,${img.imagen_base64}`;
                imgEl.classList.add("muestra__img", "m-1");
                imgEl.style.width = "60px";
                imgEl.style.cursor = "pointer";
                imgEl.onclick = () => {
                    visor__img.src = imgEl.src;
                    imageId = img.id_imagen;
                };
                if (idx === 0) {
                    visor__img.src = imgEl.src;
                    imageId = img.id_imagen;
                }
                listado__img.appendChild(imgEl);
            });
        }
        modaldetalleMuestra.classList.add("showmodal");
    }
});

// Modales abrir/cerrar
btnformnuevaMuestras?.addEventListener("click", () => modalnuevaMuestras.classList.add("showmodal"));
btnformcerrarnuevaMuestras?.addEventListener("click", () => modalnuevaMuestras.classList.remove("showmodal"));

btnformmodificarMuestras?.addEventListener("click", async () => {
    if (!hematologiaId) {
        alertMuestras.classList.remove("ocultar");
        return;
    }
    const h = await cargarHematologia(hematologiaId);
    document.getElementById("inputMuestrasUpdate").value = h.hematologia;
    document.getElementById("inputDescripcionUpdate").value = h.descripcion;
    document.getElementById("inputTipoUpdate").value = h.organo;
    document.getElementById("inputFechaUpdate").value = h.fecha;
    document.getElementById("inputSelectUpdate").value = h.organo;
    document.getElementById("inputCaracteristicas").value = h.caracteristicas; // Ojo IDs en html modal
    document.getElementById("inputObservaciones").value = h.observaciones;

    modalupdateMuestras.classList.add("showmodal");
});
btnformcerrarmodificarMuestras?.addEventListener("click", () => modalupdateMuestras.classList.remove("showmodal"));

btnformnuevaMuestra?.addEventListener("click", () => {
    if (!hematologiaId) {
        alertMuestras.classList.remove("ocultar");
        return;
    }
    modalnuevaMuestra.classList.add("showmodal");
});
btnformcerrarnuevaMuestra?.addEventListener("click", () => modalnuevaMuestra.classList.remove("showmodal"));
btncerrardetalleMuestra?.addEventListener("click", () => modaldetalleMuestra.classList.remove("showmodal"));

// Formulario Creación principal
formnuevaMuestras?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const tecnicoId = sessionStorage.getItem("user") || 1;
    const data = {
        hematologia: document.getElementById("inputMuestras").value,
        descripcion: document.getElementById("inputDescripcion").value,
        organo: document.getElementById("inputTipoMuestras").value,
        fecha: document.getElementById("inputFecha").value,
        caracteristicas: document.getElementById("inputCaracteristicas").value,
        observaciones: document.getElementById("inputObservaciones").value,
        tecnico: tecnicoId
    };

    const res = await fetch("/api/hematologia/", {
        method: "POST",
        headers: getHeaders('POST'),
        body: JSON.stringify(data)
    });
    if (res.ok) location.reload();
});

// Formulario Creación sub-muestra
formnuevaMuestra?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("descripcion", document.getElementById("inputdescripcionMuestra").value);
    formData.append("fecha", document.getElementById("inputFechaMuestra").value);
    formData.append("tincion", document.getElementById("selectTincionMuestra").value);
    formData.append("observaciones", document.getElementById("inputObservacionesMuestra").value);
    formData.append("hematologia", hematologiaId);

    const file = document.getElementById("inputImagenesMuestra").files[0];
    if (file) formData.append("imagen", file);

    const res = await fetch("/api/muestrashematologia/", {
        method: "POST",
        headers: getHeaders('POST', true),
        body: formData
    });
    if (res.ok) {
        modalnuevaMuestra.classList.remove("showmodal");
        const subs = await cargarSubMuestras(hematologiaId);
        imprimirSubMuestras(subs);
    }
});

  // Borrar sub-muestra desde el modal de detalle
  const btnDeleteSubFromDetail = document.querySelector('#modaldetalleMuestra [title="Borrar Muestra"]');
  if (btnDeleteSubFromDetail) {
    btnDeleteSubFromDetail.addEventListener("click", async () => {
      if (!subMuestraId) {
        alert("Seleccione una sub-muestra antes de borrar");
        return;
      }
      if (!confirm("¿Desea eliminar esta sub-muestra?")) return;
      const res = await fetch(`/api/muestrashematologia/${subMuestraId}/`, { 
        method: "DELETE",
        headers: getHeaders('DELETE')
      });
      if (res.ok) {
        modaldetalleMuestra.classList.remove("showmodal");
        const subs = await cargarSubMuestras(hematologiaId);
        imprimirSubMuestras(subs);
      } else {
        alert("Error al eliminar la sub-muestra");
      }
    });
  }

// Guardar Informe
btnGuardarInforme?.addEventListener("click", async () => {
    if (!hematologiaId) return;

    const formData = new FormData();
    formData.append("informe_descripcion", muestraInformeDescripcion.value);
    formData.append("informe_fecha", muestraInformeFecha.value);
    formData.append("informe_tincion", muestraInformeTincion.value);
    formData.append("informe_observaciones", muestraInformeObservaciones.value);

    const file = muestraInformeImagen.files[0];
    if (file) formData.append("informe_imagen", file);

    const res = await fetch(`/api/hematologia/${hematologiaId}/actualizar_informe/`, {
        method: "POST",
        headers: getHeaders('POST', true),
        body: formData
    });
    if (res.ok) alert("Informe guardado correctamente");
});

// Toggles
btnToggleInforme?.addEventListener("click", () => {
    sectionMuestras.classList.add("d-none");
    sectionInforme.classList.remove("d-none");
});
btnToggleMuestras?.addEventListener("click", () => {
    sectionInforme.classList.add("d-none");
    sectionMuestras.classList.remove("d-none");
});

// Carga inicial
window.onload = async () => {
    const data = await cargarHematologiasIndex();
    imprimirHematologias(data);
};
