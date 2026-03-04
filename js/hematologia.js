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
