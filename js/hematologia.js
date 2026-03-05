// Hematología front-end logic (inspired by citologias.js)
const token = sessionStorage.getItem("token");

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

let currentHematologiaId = null;

// --------- API calls ---------
const cargarHematologiaIndex = async () => {
  return await fetch("/api/hematologia/index/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.json());
};

const cargarTodasHematologias = async () => {
  return await fetch("/api/hematologia/todos/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.json());
};

const cargarHematologia = async (id) => {
  return await fetch(`/api/hematologia/${id}/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.json());
};

const cargarPorOrgano = async (organo) => {
  return await fetch(`/api/hematologia/organo/${encodeURIComponent(organo)}/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.json());
};

const cargarPorNumero = async (numero) => {
  return await fetch(`/api/hematologia/numero/${encodeURIComponent(numero)}/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.json());
};

const obtenerHematologiaFechaRango = async (inicio, fin) => {
  return await fetch(`/api/hematologia/rango_fechas/?inicio=${inicio}&fin=${fin}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.json());
};

// Muestras de una hematología
const cargarMuestras = async (hematologiaId) => {
  return await fetch(`/api/muestrashematologia/hematologia/${hematologiaId}/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.json());
};

// --------- Render helpers ---------
const imprimirHematologias = (lista, rebuildDropdown = true) => {
  if (!Muestras) return;
  Muestras.innerHTML = "";
  if (rebuildDropdown && numMuestras) {
    numMuestras.innerHTML = "<option disabled selected>Nº Muestra</option>";
    let optionTodos = document.createElement("OPTION");
    optionTodos.value = "*";
    optionTodos.textContent = "Todos";
    numMuestras.appendChild(optionTodos);
  }

  const frag = document.createDocumentFragment();
  lista.forEach((h) => {
    // add option to number selector
    if (rebuildDropdown && numMuestras) {
      const opt = document.createElement("OPTION");
      opt.value = h.hematologia || h.id || "";
      opt.textContent = h.hematologia || h.id || "-";
      numMuestras.appendChild(opt);
    }

    const tr = document.createElement("TR");
    tr.innerHTML = `
      <td>${h.hematologia || "-"}</td>
      <td>${h.fecha || "-"}</td>
      <td>${h.descripcion || h.detalle || "-"}</td>
      <td>${h.organo || "-"}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary btn-ver-hematologia" data-id="${h.id}">Ver</button>
      </td>
    `;
    frag.appendChild(tr);
  });
  Muestras.appendChild(frag);

  // attach listeners
  document.querySelectorAll(".btn-ver-hematologia").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      const detalle = await cargarHematologia(id);
      if (detalle) {
        currentHematologiaId = id;
        llenarDetalleHematologia(detalle);
        const resp = await cargarMuestras(id);
        imprimirMuestras(resp);
      }
    });
  });
};

const imprimirMuestras = (lista) => {
  if (!muestras) return;
  muestras.innerHTML = "";
  const frag = document.createDocumentFragment();
  lista.forEach((m) => {
    const tr = document.createElement("TR");
    tr.innerHTML = `
      <td>${m.fecha || "-"}</td>
      <td>${m.descripcion || m.detalle || "-"}</td>
      <td>${m.tincion || m.tipo || "-"}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary btn-detalle-muestra" data-id="${m.id}">Detalle</button>
      </td>
    `;
    frag.appendChild(tr);
  });
  muestras.appendChild(frag);

  document.querySelectorAll(".btn-detalle-muestra").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      // Obtener detalle de la muestra desde la API de imagenes o muestras si necesario
      // Por ahora cargamos desde la lista mostrada (no mantenemos cache aquí).
      const res = await fetch(`/api/muestras/${id}/`, { method: "GET", headers: { "Content-Type": "application/json" } });
      if (res.ok) {
        const d = await res.json();
        mostrarDetalleMuestra(d);
      }
    });
  });
};

const llenarDetalleHematologia = (h) => {
  if (Muestras__descripcion) Muestras__descripcion.textContent = h.descripcion || "";
  if (Muestras__tipo) Muestras__tipo.textContent = h.tipo || "";
  if (Muestras__organo) Muestras__organo.textContent = h.organo || "";
  if (Muestras__fecha) Muestras__fecha.textContent = h.fecha || "";
  if (Muestras__caracteristicas) Muestras__caracteristicas.textContent = h.caracteristicas || "";
  if (Muestras__observaciones) Muestras__observaciones.textContent = h.observaciones || "";
  if (Muestras__Muestras) Muestras__Muestras.textContent = h.hematologia || h.id || "";
};

const mostrarDetalleMuestra = (m) => {
  // Actualiza modal o detalles de muestra si existen elementos
  const elDesc = document.getElementById("muestra__descripcion");
  const elFecha = document.getElementById("muestra__fecha");
  const elTinc = document.getElementById("muestra__tincion");
  const elObs = document.getElementById("muestra__observaciones");
  if (elDesc) elDesc.textContent = m.descripcion || m.detalle || "";
  if (elFecha) elFecha.textContent = m.fecha || "";
  if (elTinc) elTinc.textContent = m.tincion || m.tipo || "";
  if (elObs) elObs.textContent = m.observaciones || "";

  const modalEl = document.getElementById("detalleMuestraModal") || document.getElementById("qrMuestrasModal") || document.getElementById("qrMuestraModal");
  if (modalEl) {
    try {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    } catch (e) {
      // bootstrap not available or modal id different
    }
  }
};

// --------- Event bindings ---------
if (todasMuestrasBtn) {
  todasMuestrasBtn.addEventListener("click", async () => {
    const resp = await cargarTodasHematologias();
    imprimirHematologias(resp, true);
  });
}

if (organos) {
  organos.addEventListener("change", async () => {
    if (organos.value === "*") {
      const resp = await cargarTodasHematologias();
      imprimirHematologias(resp);
    } else {
      const resp = await cargarPorOrgano(organos.value);
      imprimirHematologias(resp);
    }
  });
}

if (numMuestras) {
  numMuestras.addEventListener("change", async () => {
    if (numMuestras.value === "*") {
      const resp = await cargarTodasHematologias();
      imprimirHematologias(resp, false);
    } else {
      const resp = await cargarPorNumero(numMuestras.value);
      imprimirHematologias(resp, false);
    }
  });
}

if (fechainicio) {
  fechainicio.addEventListener("change", async () => {
    if (!fechafin.value) {
      const resp = await fetch(`/api/hematologia/fecha/${fechainicio.value}/`).then(r=>r.json());
      imprimirHematologias(resp, false);
    } else {
      if (new Date(fechainicio.value) > new Date(fechafin.value)) return;
      const resp = await obtenerHematologiaFechaRango(fechainicio.value, fechafin.value);
      imprimirHematologias(resp, false);
    }
  });
}

if (fechafin) {
  fechafin.addEventListener("change", async () => {
    if (!fechainicio.value) return;
    if (new Date(fechainicio.value) > new Date(fechafin.value)) return;
    const resp = await obtenerHematologiaFechaRango(fechainicio.value, fechafin.value);
    imprimirHematologias(resp, false);
  });
}

// Load index on start
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const resp = await cargarHematologiaIndex();
    imprimirHematologias(resp, true);
  } catch (e) {
    console.error("Error cargando hematologías:", e);
  }
});
console.log("Hematologia.js cargado correctamente");
const token = sessionStorage.getItem("token");
console.log("Token:", token);

const MuestrasTable = document.getElementById("Muestras"); // La tabla principal
const muestrasSubTable = document.getElementById("muestras"); // La tabla de sub-muestras
const organosSelect = document.getElementById("organos");
const numMuestrasSelect = document.getElementById("numMuestras");

// Mapeo detallado de elementos basado en hematologia.html
const muestraDescripcion = document.getElementById("Muestras__descripcion");
const muestraTipo = document.getElementById("Muestras__tipo");
const muestraOrgano = document.getElementById("Muestras__organo");
const muestraMuestraNum = document.getElementById("Muestras__Muestras");
const muestraFecha = document.getElementById("Muestras__fecha");
const muestraCaracteristicas = document.getElementById("Muestras__caracteristicas");
const muestraObservaciones = document.getElementById("Muestras__observaciones");

const muestraInformeDescripcion = document.getElementById("Muestras__informe_descripcion");
const muestraInformeFecha = document.getElementById("Muestras__informe_fecha");
const muestraInformeTincion = document.getElementById("Muestras__informe_tincion");
const muestraInformeObservaciones = document.getElementById("Muestras__informe_observaciones");
const muestraInformeImagen = document.getElementById("Muestras__informe_imagen");
const btnGuardarInforme = document.getElementById("btnGuardarInforme");

let currentHematologiaId = null;
let hematologiaId = null; // Para manejo de seleccion
let subMuestraId = null;
let imageId = null;

// Modales y botones de control
const modalnuevaMuestras = document.getElementById("modalnuevaMuestras");
const btnformnuevaMuestras = document.getElementById("btnformnuevaMuestras");
const btnformcerrarnuevaMuestras = document.getElementById("btnformcerrarnuevaMuestras");
const formnuevaMuestras = document.getElementById("nuevaMuestras");

const modalupdateMuestras = document.getElementById("modalupdateMuestras");
const btnformmodificarMuestras = document.getElementById("btnformmodificarMuestras");
const btnformcerrarmodificarMuestras = document.getElementById("btnformcerrarmodificarMuestras");
const formmodificarMuestras = document.getElementById("modificarMuestras");

// Modal Nueva Sub-Muestra
const modalnuevaMuestra = document.getElementById("modalnuevaMuestra");
const btnformnuevaMuestra = document.getElementById("btnformnuevaMuestra");
const btnformcerrarnuevaMuestra = document.getElementById("btnformcerrarnuevaMuestra");
const formnuevaMuestra = document.getElementById("nuevaMuestra");

// Modal Detalle Sub-Muestra
const modaldetalleMuestra = document.getElementById("modaldetalleMuestra");
const btncerrardetalleMuestra = document.getElementById("btncerrardetalleMuestra");

// Elementos detalle sub-muestra
const det_muestra__descripcion = document.getElementById("muestra__descripcion");
const det_muestra__fecha = document.getElementById("muestra__fecha");
const det_muestra__tincion = document.getElementById("muestra__tincion");
const det_muestra__observaciones = document.getElementById("muestra__observaciones");
const visor__img = document.getElementById("visor__img");
const listado__img = document.getElementById("muestra__img");

const btnborrarimagenmuestra = document.getElementById("btnborrarimagenmuestra");

// QR Modals
const qrMuestrasModal = document.getElementById("qrMuestrasModal");
const imgcassette__qr = document.getElementById("imgcassette__qr"); // Ojo: ID de citologia/bioquimica en HTML? 
// No, en hematologia.html el modal es #qrMuestrasModal y el img parece ser qrMuestrasModal img? No lo vi.
// Reviso hematologia.html: <div id="btn__qr" data-bs-toggle="modal" data-bs-target="#qrMuestrasModal">

// Consultas
const fechainicio = document.getElementById("fechainicio");
const fechafin = document.getElementById("fechafin");
const alertMuestras = document.getElementById("alertMuestras");
const alertfecha = document.getElementById("alertfecha");
const alertfecha_text = document.getElementById("alertfecha_text");

// Section toggle
const btnToggleInforme = document.getElementById("btnToggleInforme");
const btnToggleMuestras = document.getElementById("btnToggleMuestras");
const sectionMuestras = document.getElementById("sectionMuestras");
const sectionInforme = document.getElementById("sectionInforme");

// --- FUNCIONES API ---

const cargarHematologiasIndex = async () => {
    return await fetch("/api/hematologia/index/").then(r => r.json());
};

const cargarTodasHematologias = async () => {
    return await fetch("/api/hematologia/todos/").then(r => r.json());
};

const cargarHematologia = async (id) => {
    return await fetch(`/api/hematologia/${id}/`).then(r => r.json());
};

const cargarSubMuestras = async (id) => {
    return await fetch(`/api/muestrashematologia/hematologia/${id}/`).then(r => r.json());
};

const cargarImagenesSubMuestra = async (muestraid) => {
    return await fetch(`/api/imageneshematologia/muestra/${muestraid}/`).then(r => r.json());
};

// --- RENDERIZADO ---

const imprimirHematologias = (lista, rebuildSelect = true) => {
    MuestrasTable.innerHTML = "";
    if (rebuildSelect) numMuestrasSelect.innerHTML = "<option selected disabled>Nº Muestra</option>";

    lista.forEach(item => {
        // Opción select
        if (rebuildSelect) {
            const opt = document.createElement("option");
            opt.value = item.hematologia;
            opt.textContent = item.hematologia;
            numMuestrasSelect.appendChild(opt);
        }

        // Fila tabla
        const tr = document.createElement("tr");
        tr.classList.add("table__row");

        const f = item.fecha.split("-");
        const fechaFormateada = `${f[2]}-${f[1]}-${f[0]}`;

        tr.innerHTML = `
            <td>${item.hematologia}</td>
            <td>${fechaFormateada}</td>
            <td title="${item.descripcion}">${item.descripcion.substring(0, 50)}</td>
            <td>${item.organo}</td>
            <td>
                <i class="fa-solid fa-file-invoice blue__color--negrita fs-5 icono__efect" 
                   data-id="${item.id_hematologia}" title="Ver Detalle"></i>
            </td>
        `;
        MuestrasTable.appendChild(tr);
    });
};

const imprimirSubMuestras = (lista) => {
    muestrasSubTable.innerHTML = "";
    lista.forEach(m => {
        const tr = document.createElement("tr");
        tr.classList.add("table__row");
        const f = m.fecha.split("-");
        const fechaFormateada = `${f[2]}-${f[1]}-${f[0]}`;

        tr.innerHTML = `
            <td>${fechaFormateada}</td>
            <td>${m.descripcion}</td>
            <td>${m.tincion}</td>
            <td>
                <i class="fa-solid fa-file-invoice blue__color--negrita fs-5 icono__efect btn-detalle-sub" 
                   data-id="${m.id_muestra}" title="Detalle Sub-muestra"></i>
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
        headers: { "Content-Type": "application/json" },
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
      const res = await fetch(`/api/muestrashematologia/${subMuestraId}/`, { method: "DELETE" });
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
    if (!currentHematologiaId) return;

    const formData = new FormData();
    formData.append("informe_descripcion", muestraInformeDescripcion.value);
    formData.append("informe_fecha", muestraInformeFecha.value);
    formData.append("informe_tincion", muestraInformeTincion.value);
    formData.append("informe_observaciones", muestraInformeObservaciones.value);

    const file = muestraInformeImagen.files[0];
    if (file) formData.append("informe_imagen", file);

    const res = await fetch(`/api/hematologia/${currentHematologiaId}/actualizar_informe/`, {
        method: "POST",
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
