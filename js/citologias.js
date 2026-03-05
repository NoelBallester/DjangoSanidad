const inputCassete = document.getElementById("inputCassete");
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

const citologias = document.getElementById("citologias");
const muestras = document.getElementById("muestras");
const organos = document.getElementById("organos");
const numCitologia = document.getElementById("numCitologia");

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
const modalnuevaCitologia = document.getElementById("modalnuevaCitologia");
const btnformnuevacitologia = document.getElementById("btnformnuevacitologia");
const btnformmodificarcitologia = document.getElementById(
  "btnformmodificarcitologia"
);
const btnformcerrarnuevaCitologia = document.getElementById(
  "btnformcerrarnuevaCitologia"
);
const btnformcerrarmodificarCitologia = document.getElementById(
  "btnformcerrarmodificarCitologia"
);
const btnmodificar = document.getElementById("btnmodificar");
const nuevaCitologia = document.getElementById("nuevaCitologia");
const nuevaMuestra = document.getElementById("nuevaMuestra");

const citologiaDescripcion = document.getElementById("citologia__descripcion");
const citologiaOrgano = document.getElementById("citologia__organo");
const citologiaCitologia = document.getElementById("citologia__citologia");
const citologiaTipo = document.getElementById("citologia__tipo");
const citologiaFecha = document.getElementById("citologia__fecha");
const citologiaCaracteristicas = document.getElementById(
  "citologia__caracteristicas"
);
const citologiaObservaciones = document.getElementById(
  "citologia__observaciones"
);

const citologiaInformeDescripcion = document.getElementById("citologia__informe_descripcion");
const citologiaInformeFecha = document.getElementById("citologia__informe_fecha");
const citologiaInformeTincion = document.getElementById("citologia__informe_tincion");
const citologiaInformeObservaciones = document.getElementById("citologia__informe_observaciones");
const citologiaInformeImagen = document.getElementById("citologia__informe_imagen");
const btnGuardarInforme = document.getElementById("btnGuardarInforme");
let currentCitologiaId = null;

const citologiaImagen = document.getElementById("citologia__imagen");
const eliminarCassetteModal = document.getElementById("eliminarCassetteModal");

// Detalle Citología
const btn__imprimrqr = document.getElementById("btn__imprimirqr");

// Modal qr
const imgcassette__qr = document.getElementById("imgcassette__qr");
const inputcassette__qr = document.getElementById("inputcassette__qr");

// Todas las citologías
const todasCitologias = document.getElementById("todasCitologias");

// Nueva Citologia
const inputFecha = document.getElementById("inputFecha");
const inputCitologia = document.getElementById("inputCitologia");
const inputDescripcion = document.getElementById("inputDescripcion");
const inputTipoCitologia = document.getElementById("inputTipoCitologia");
const inputCaracteristicas = document.getElementById("inputCaracteristicas");
const inputObservaciones = document.getElementById("inputObservaciones");
const inputMicroscopia = document.getElementById("inputMicroscopia");
const inputDiagnostico = document.getElementById("inputDiagnostico");
const inputPatologo = document.getElementById("inputPatologo");
const inputSelect = document.getElementById("inputSelect");

// Modificar Citología
const modalupdateCitologia = document.getElementById("modalupdateCitologia");
const modificarCitologia = document.getElementById("modificarCitologia");
const btnmodificarcitologia = document.getElementById("btnmodificarcitologia");
const inputFechaUpdate = document.getElementById("inputFechaUpdate");
const inputImagenesUpdate = document.getElementById("inputImagenesUpdate");

const inputDescripcionUpdate = document.getElementById(
  "inputDescripcionUpdate"
);
const inputCitologiaUpdate = document.getElementById("inputCitologiaUpdate");
const inputTipoUpdate = document.getElementById("inputTipoUpdate");
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
const modificarMuestra = document.getElementById("modificarMuestra");
const modalmodificarMuestra = document.getElementById("modalmodificarMuestra");
const btnformmodificarMuestra = document.getElementById(
  "btnformmodificarmuestra"
);
const btnformcerrarmodificarMuestra = document.getElementById(
  "btnformcerrarmodificarMuestra"
);

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
const imgmuestra__qr = document.getElementById("imgmuestra__qr");
const inputmuestra__qr = document.getElementById("inputmuestra__qr");
const btn__imprimirqrmuestra = document.getElementById(
  "btn__imprimirqrmuestra"
);

// Consutar por código qr
const btn__consultarqr = document.getElementById("btn__consultarqr");
const input__consultarqr = document.getElementById("input__consultarqr");
const qrConsultaModal = document.getElementById("qrConsultaModal");
let mimodal = new bootstrap.Modal(document.getElementById("qrConsultaModal"));

// Fecha inicio fin para consultas
const fechainicio = document.getElementById("fechainicio");
const fechafin = document.getElementById("fechafin");

// Alert error
const alertcitologia = document.getElementById("alertcitologia");
const alertfecha = document.getElementById("alertfecha");
const alertfecha_text = document.getElementById("alertfecha_text");

// id del citlogía de trabajo
let citologiaId = null;

// qr cassete
let cassetteqr = null;

// id muestra cassete
let muestraId = null;

// id imagene seleccionada
let imageId = null;

const files = document.getElementById("files");

// Carga Citologías al inicio
const cargarCitologiaIndex = async () => {
  return await fetch("/api/citologias/index/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Crear citologia
const crearCitologia = async (event) => {
  event.preventDefault();

  try {
    // Get or use default technician
    const tecnicoId = sessionStorage.getItem("user") || 1;

    const response = await fetch("/api/citologias/", {
      method: "POST",
      headers: getHeaders('POST', false),
      body: JSON.stringify({
        citologia: inputCitologia.value,
        fecha: inputFecha.value,
        tipo_citologia: inputTipoCitologia.value,
        descripcion: inputDescripcion.value,
        caracteristicas: inputCaracteristicas.value,
        observaciones: inputObservaciones.value,
        descripcion_microscopica: inputMicroscopia.value,
        diagnostico_final: inputDiagnostico.value,
        patologo_responsable: inputPatologo.value,
        tecnico: tecnicoId,
        organo: inputSelect.value,
      }),
    });

    if (response.ok) {
      // Try to parse JSON response; some backends may return 201 with empty body
      let created = null;
      try {
        const ct = response.headers.get('content-type') || '';
        if (ct.includes('application/json')) created = await response.json();
      } catch (e) {
        created = null;
      }

      if (created) {
        // imprimirDetalleCitologia expects the API shape (id_citologia)
        imprimirDetalleCitologia(created);
        // load its muestras
        citologiaId = created.id_citologia || created.id || created.pk;
        const muestrasResp = await cargarMuestras(citologiaId);
        imprimirMuestras(muestrasResp);
        // close modal
        if (modalnuevaCitologia) {
          modalnuevaCitologia.classList.remove('showmodal');
          modalnuevaCitologia.classList.add('hidemodal');
        }
      } else {
        // Backend did not return JSON; refresh list to show created item without throwing error
        location.href = 'citologias.html';
      }
    } else {
      let errorObj = null;
      try { errorObj = await response.json(); } catch (e) { errorObj = null; }
      console.error("Error al crear citología:", errorObj || response.statusText || response.status);
      alert("Error al crear la citología: " + (errorObj ? JSON.stringify(errorObj) : response.statusText || response.status));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al crear la citología");
  }
};

// Carga todas las citologías desde el botón
const cargarTodasCitologias = async () => {
  return await fetch("/api/citologias/todos/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Carga el detalle de la citología seleccionada
const cargarCitologia = async (citologiaId) => {
  return await fetch(`/api/citologias/${citologiaId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Obtener citologías por organo
const cargarPorOrgano = async () => {
  return await fetch(`/api/citologias/organo/${organos.value}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((data) => data.json())
    .catch((error) => console.log("No se esta ejecutando" + error));
};

// Obtener citologías por número de citología
const cargarPorNumero = async () => {
  return await fetch(`/api/citologias/numero/${numCitologia.value}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((data) => data.json())
    .catch((error) => console.log("No se esta ejecutando" + error));
};

// Obtener citologías por fecha
const obtenerCitologiaFecha = async (fecha) => {
  const response = await fetch(`/api/citologias/por_fecha/${fecha}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  return await response.json();
};

// Obtener citologías por rango de fechas
const obtenerCitologiaFechaRango = async (fechainicio, fechafin) => {
  const response = await fetch(`/api/citologias/rango_fechas/?inicio=${fechainicio}&fin=${fechafin}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  return await response.json();
};

// Borrar una citología
const borrarCitologia = () => {
  (async () => {
    try {
      const res = await fetch(`/api/citologias/${citologiaId}/`, {
        method: 'DELETE',
        headers: getHeaders('DELETE', false)
      });
      if (res.ok) {
        // refresh page or reload list
        location.href = 'citologias.html';
      } else {
        console.error('Error borrando citología', res.status);
        alert('Error al borrar la citología');
      }
    } catch (e) {
      console.error(e);
      alert('Error al borrar la citología');
    }
  })();
};

// Consulta citologías en una fecha
const consultaFechaInicio = async () => {
  alertfecha.classList.add("ocultar");
  let respuesta;
  if (!fechafin.value) {
    respuesta = await obtenerCitologiaFecha(fechainicio.value);
  } else {
    if (new Date(fechainicio.value) > new Date(fechafin.value)) {
      alertfecha.classList.add("ocultar");
      alertfecha_text.textContent = "La fecha de inicio debe ser menor";
      alertfecha.classList.remove("ocultar");
    } else {
      alertfecha.classList.add("ocultar");
      respuesta = await obtenerCitologiaFechaRango(
        fechainicio.value,
        fechafin.value
      );
    }
  }
  imprimirCitologias(respuesta, false);
};

// Consulta citologias entre dos fechas
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
      const respuesta = await obtenerCitologiaFechaRango(
        fechainicio.value,
        fechafin.value
      );
      imprimirCitologias(respuesta, false);
    }
  }
};

// Muestra los datos de las citologías por pantalla
const imprimirCitologias = (respuesta, rebuildDropdown = true) => {
  citologias.innerHTML = "";
  if (rebuildDropdown) {
    numCitologia.innerHTML =
      "<option disabled selected>Nº Citología</option>";
    let optionTodos = document.createElement("OPTION");
    optionTodos.value = "*";
    optionTodos.textContent = "Todos";
    numCitologia.appendChild(optionTodos);
  }

  let fragmento = document.createDocumentFragment();
  let fragmentselect = document.createDocumentFragment();
  if (respuesta.length > 0) {
    respuesta.map((citologia) => {
      // Para cargar los números de citología
      let option = document.createElement("OPTION");
      option.value = citologia.citologia; // Usamos el número, no el ID interno
      option.textContent = citologia.citologia;
      fragmentselect.appendChild(option);

      // Para mostrar citologías
      let tr = document.createElement("tr");
      tr.classList.add("table__row");

      // Número de citologia
      let ncitologia = document.createElement("td");
      ncitologia.textContent = citologia.citologia;

      let fecha = document.createElement("td");
      nuevafecha = citologia.fecha;

      fecha.textContent =
        nuevafecha.substring(8) +
        "-" +
        nuevafecha.substring(5, 7) +
        "-" +
        nuevafecha.substring(0, 4);
      let descripcion = document.createElement("td");
      descripcion.textContent = citologia.descripcion.substring(0, 50);
      descripcion.title = citologia.descripcion;

      let organo = document.createElement("td");
      organo.textContent = citologia.organo;

      let btndetalle = document.createElement("I");
      btndetalle.className =
        "d-inline-block cassette__icon fa-solid fa-file-invoice cassette__icon--infocassette";
      btndetalle.value = citologia.id_citologia;
      btndetalle.title = "Detalle Citología";

      let btnCont = document.createElement("td");
      btnCont.appendChild(btndetalle);

      tr.appendChild(ncitologia);
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
    tr.textContent = "No se ha encontrado niguna Citologia";
    fragmento.appendChild(tr);
  }

  citologias.appendChild(fragmento);
  if (rebuildDropdown) {
    numCitologia.appendChild(fragmentselect);
  }
};

//Peticiones de citología y Muestras al seleccionar un citología y llama a
// mostrar citologías y mostrar muestras
const detalleCitologia = async (event) => {
  if (event.target.classList.contains("fa-file-invoice")) {
    alertcitologia.classList.add("ocultar");
    citologiaId = event.target.value;

    let respuesta = await cargarCitologia(citologiaId);
    imprimirDetalleCitologia(respuesta);

    respuesta = await cargarMuestras(citologiaId);
    imprimirMuestras(respuesta);
  }

  if (event.target.classList.contains("fa-trash-can")) {
    console.log(event.target.data - value);
  }
};

// Muestra el detalle de una citología
const imprimirDetalleCitologia = (respuesta) => {
  citologiaDescripcion.textContent = respuesta.descripcion.substring(0, 50);
  citologiaOrgano.textContent = respuesta.organo;
  citologiaCitologia.textContent = respuesta.citologia;
  citologiaTipo.textContent = respuesta.tipo_citologia;

  // Formato Fecha
  nuevafecha = respuesta.fecha;
  citologiaFecha.textContent =
    nuevafecha.substring(8) +
    "-" +
    nuevafecha.substring(5, 7) +
    "-" +
    nuevafecha.substring(0, 4);

  citologiaCaracteristicas.textContent = respuesta.caracteristicas;
  citologiaObservaciones.textContent = respuesta.observaciones;

  citologiaInformeDescripcion.value = respuesta.informe_descripcion || "";
  citologiaInformeFecha.value = respuesta.informe_fecha || "";
  citologiaInformeTincion.value = respuesta.informe_tincion || "";
  citologiaInformeObservaciones.value = respuesta.informe_observaciones || "";
  // citologiaInformeImagen logic would depend on base64 rendering
  currentCitologiaId = respuesta.id_citologia;

  // Le paso la imagen al visor de imagenes
  // Si tiene o no imagen
  /*  console.log(respuesta)
  respuesta.imagen
    ? (citologiaImagen.src = `data:image/jpeg;base64,${respuesta.imagen}`)
    : (citologiaImagen.src = "./assets/images/no_disponible.jpg");

  inputcassette__qr.style.display = "none";
  inputcassette__qr.focus(); */

  // generamos el codigo QR
  new QRious({
    element: document.querySelector("#imgcassette__qr"),
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
  if (elemento == "cassette") {
    qrimprimir = imgcassette__qr.src;
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

// Cargamos el modal datos citologia modificar
const cargarCitologiaUpdateModal = async (event) => {
  if (!citologiaId) {
    event.preventDefault();
    alertcitologia.classList.remove("ocultar");
  } else {
    let citologia = await cargarCitologia(citologiaId);
    inputCitologiaUpdate.value = citologia.citologia;
    inputDescripcionUpdate.value = citologia.descripcion;
    inputTipoUpdate.value = citologia.tipo_citologia;
    inputFechaUpdate.value = citologia.fecha;
    inputCaracteristicasUpdate.value = citologia.caracteristicas;
    inputObservacionesUpdate.value = citologia.observaciones;
    inputMicroscopiaUpdate.value = citologia.descripcion_microscopica || "";
    inputDiagnosticoUpdate.value = citologia.diagnostico_final || "";
    inputPatologoUpdate.value = citologia.patologo_responsable || "";
    inputSelectUpdate.value = citologia.organo;
  }
};

const modificarCitologiaUpdate = async (event) => {
  event.preventDefault();
  await fetch(`/api/citologias/${citologiaId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      citologia: inputCitologiaUpdate.value,
      fecha: inputFechaUpdate.value,
      descripcion: inputDescripcionUpdate.value,
      tipo_citologia: inputTipoUpdate.value,
      caracteristicas: inputCaracteristicasUpdate.value,
      observaciones: inputObservacionesUpdate.value,
      descripcion_microscopica: inputMicroscopiaUpdate.value,
      diagnostico_final: inputDiagnosticoUpdate.value,
      patologo_responsable: inputPatologoUpdate.value,
      tecnico: sessionStorage.getItem("user"),
      organo: inputSelectUpdate.value,
    }),
  })
    .then((response) => {
      if (response.ok) {
        location.href = "citologias.html";
      }
    })
    .catch((error) => console.log(error));
};

// MUESTRAS

// Carga Muestras de una citología
const cargarMuestras = async (citologiaId) => {
  return await fetch(`/api/muestrascitologia/por_citologia/${citologiaId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
};

// Crear nueva muestra
const crearMuestra = async (event) => {
  event.preventDefault();

  // SI QUEREMOS GUARDAR UNA IMAGEN CON PDO NECESITAMOS UN FormData
  let newMuestra = new FormData();
  newMuestra.append("descripcion", inputdescripcionMuestra.value);
  newMuestra.append("fecha", inputFechaMuestra.value);
  newMuestra.append("observaciones", inputObservacionesMuestra.value);
  newMuestra.append("tincion", selectTincionMuestra.value);
  newMuestra.append("citologia", citologiaId);

  await fetch("/api/muestrascitologia/", {
    method: "POST",
    // Include CSRF token header but do not set Content-Type (browser will set multipart boundary)
    headers: getHeaders('POST', true),
    body: newMuestra,
  })
    .then(async () => {
      modalnuevaMuestra.classList.remove("showmodal");
      modalnuevaMuestra.classList.add("hidemodal");
      limpiarModalMuestra();
      imprimirMuestras(await cargarMuestras(citologiaId));
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
const cargarMuestraUpdateModal = async (event) => {
  if (!citologiaId) {
    event.preventDefault();
    alertcitologia.classList.remove("ocultar");
  } else {
    const response = await fetch(`/api/muestrascitologia/${muestraId}/`, {
      method: "GET",
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

// Modificar muestra
const modificarMuestraUpdate = async (event) => {
  event.preventDefault();

  await fetch(`/api/muestrascitologia/${muestraId}/`, {
    method: "PUT",
    headers: getHeaders('PUT', false),
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

      // Mostramos las muestras para que se actualicen los cambios
      respuesta = await cargarMuestras(citologiaId);
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
        "d-inline-block cassette__icon fa-solid fa-file-invoice cassette__icon--infocassette";
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

// Obtenemos una muestra
const cargarMuestra = async (muestraid) => {
  const response = await fetch(`/api/muestrascitologia/${muestraid}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

// Obtenemos las imagenes de una muestra
const obtenerImagenesMuestra = async (muestraid) => {
  const response = await fetch(`/api/imagenescitologia/por_muestra/${muestraid}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let imagenes = await response.json();
  return imagenes;
};

// rellenamos los datos texto de la muestra
const rellenarDatosMuestra = async (muestra) => {
  muestra__descripcion.textContent = muestra.descripcion.substring(0, 60);
  muestra__descripcion.title = muestra.descripcion;

  nuevafecha = muestra.fecha;
  muestra__fecha.textContent =
    nuevafecha.substring(8) +
    "-" +
    nuevafecha.substring(5, 7) +
    "-" +
    nuevafecha.substring(0, 4);

  muestra__observaciones.textContent = muestra.observaciones;
  muestra__tincion.textContent = muestra.tincion;
};

const mostrarImagenesMuestra = async (muestaId) => {
  muestra__img.innerHTML = "";
  let imagenes = await obtenerImagenesMuestra(muestraId);
  // Mostrar imágenes en el contenedor
  if (imagenes.length > 0) {
    imagenes.forEach((imagen, index) => {
      let newimg = document.createElement("IMG");
      newimg.id = imagen.id_imagen;
      newimg.src = `data:image/jpeg;base64,${imagen.imagen}`;
      newimg.classList.add("muestra__img", "rounded");
      newimg.style.maxWidth = "150px";
      newimg.style.maxHeight = "150px";
      newimg.style.objectFit = "cover";
      newimg.style.border = "1px solid #ccc";
      newimg.style.cursor = "pointer";

      if (index == 0) {
        imageId = newimg.id;
      }

      // Añadimos cada una de las imagenes
      muestra__img.appendChild(newimg);
    });
  }
};

const borrarMuestra = async () => {
  fetch(`/api/muestrascitologia/${muestraId}/`, {
    method: "DELETE",
    headers: getHeaders('DELETE', false),
  })
    .then(async () => {
      modaldetalleMuestra.classList.remove("showmodal");
      // Mostramos las muestras del cassette
      let muestras = await cargarMuestras(citologiaId);
      imprimirMuestras(muestras);
    })
    .catch((error) => console.log(error));
};

const borrarImagenMuestra = async () => {
  if (imageId != undefined) {
    fetch(`/api/imagenescitologia/${imageId}/`, {
      method: "DELETE",
      headers: getHeaders('DELETE', false),
    }).then(() => {
      mostrarImagenesMuestra(muestraId);
    });
  }
};

// Mostramos Detalle muestra seleccionada
const detailMuestra = async (muestraid) => {
  // Cargamos la muestra
  let muestra = await cargarMuestra(muestraid);
  muestraId = muestra.id_muestra;
  rellenarDatosMuestra(muestra);

  // generamos el codigo QR
  new QRious({
    element: imgmuestra__qr,
    value: muestra.qr_muestra, // La URL o el texto
    size: 70,
    backgroundAlpha: 0, // 0 para fondo transparente
    foreground: "#4ca0cc", // Color del QR
    level: "H", // Puede ser L,M,Q y H (L es el de menor nivel, H el mayor)
  });

  // Mostramos las imagenes de la muestra seleccionada
  mostrarImagenesMuestra(muestraId);

  modaldetalleMuestra.classList.add("showmodal");
  modaldetalleMuestra.classList.remove("hidemodal");
};

// Añadir una imagen a la muestra
const aniadirImagenMuestra = async () => {
  try {
    // Abrir el cuadro de para seleccionar un archivo,
    // Puede fallar con algún navegador.... con chrome, edge sin problemas
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

    fetch("/api/imagenescitologia/", {
      method: "POST",
      headers: getHeaders('POST', true),
      body: newImage,
    }).then(async () => {
      await mostrarImagenesMuestra(muestraId);
    });
  } catch (err) {
    console.error(err);
  }
};

const consultarCitologiaQR = async (qr) => {
  const response = await fetch(`/api/citologias/por_qr/${qr}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  let citologia = await response.json();

  // Mostrar los datos de la citología
  imprimirCitologias(citologia);
  // Obtenemos un array, pq nos viene bien para la consulta de citologías que espera un array
  //Obtenemos el primero, aunque sólo nos devuelve uno, para la consulta de una citología
  citologia = citologia[0];

  // Mostramos el detalle de la citología
  imprimirDetalleCitologia(citologia);

  // Mostramos las muestras de la citología
  citologiaId = citologia.id_citologia;
  let muestras = await cargarMuestras(citologiaId);
  imprimirMuestras(muestras);
};

const consultarMuestraQR = async (qr) => {
  // Obtengo la muestra para obtener el id de la citología
  let response = await fetch(`/api/muestrascitologia/por_qr/${qr}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let muestra = await response.json();
  if (Array.isArray(muestra)) {
    muestra = muestra[0];
  }
  // Obtengo la citología de la muestra
  response = await fetch(`/api/citologias/${muestra.citologia}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  // Mostramos la citología de la muestra
  let citologia = await response.json();
  consultarCitologiaQR(citologia.qr_citologia);
  detailMuestra(muestra.id_muestra);
};;

// Cargamos el modal datos cassete modificar
const cargarUserUpdateModal = async (event) => {
  let userId = sessionStorage.getItem("user");
  const response = await fetch(
    "http://localhost:3000/sanitaria/tecnicos/" + userId,
    {
      method: "GET",
      headers: {
        token: sessionStorage.getItem("token"),
      },
    }
  );

  let user = await response.json();

  inputUpdateNombreUser.value = user.nombre;
  inputUpdateApellidosUser.value = user.apellidos;
  inputUpdateCentroUser.value = user.centro;
  inputUpdateCorreoUser.value = user.email;
  /*  inputUpdatePass1User.value = user.password;
  inputUpdatePass2User.value = user.password; */
};
// Eventos



// Consulta Citología Recientes
document.addEventListener("DOMContentLoaded", async () => {
  body.style.display = "block";
  const respuesta = await cargarCitologiaIndex();
  imprimirCitologias(respuesta);
  let fechaActual = new Date().toISOString().split("T")[0];
  // Para que no se pueda seleccionar una fecha anterior a la actual
  inputFecha.setAttribute("min", fechaActual);
  inputFechaUpdate.setAttribute("min", fechaActual);
  inputFechaMuestra.setAttribute("min", fechaActual);
});

// Consulta por Organo
organos.addEventListener("change", async () => {
  const respuesta = await cargarPorOrgano();
  imprimirCitologias(respuesta, false);
});

// Consulta por número de Citologia
numCitologia.addEventListener("change", async () => {
  let respuesta;
  if (numCitologia.value === "*") {
    respuesta = await cargarTodasCitologias();
  } else {
    respuesta = await cargarPorNumero();
  }
  // Solicitud del usuario: filtrar la tabla pero NO el desplegable de arriba
  imprimirCitologias(respuesta, false);
});

// Consulta Detalle Citologías y Muestras
citologias.addEventListener("click", detalleCitologia);

// Consulta por fecha
fechainicio.addEventListener("change", consultaFechaInicio);

fechafin.addEventListener("change", consultaFechaFin);

// Todas las citologías
todasCitologias.addEventListener("click", async () => {
  const respuesta = await cargarTodasCitologias();
  imprimirCitologias(respuesta);
});

// Crear Citología
btnformnuevacitologia.addEventListener("click", () => {
  if (!modalnuevaCitologia.classList.contains("showmodal")) {
    modalnuevaCitologia.classList.add("showmodal");
    modalnuevaCitologia.classList.remove("hidemodal");
  }
});

btnformcerrarnuevaCitologia.addEventListener("click", () => {
  if (!modalnuevaCitologia.classList.contains("hidemodal")) {
    modalnuevaCitologia.classList.add("hidemodal");
    modalnuevaCitologia.classList.remove("showmodal");
  }
});

nuevaCitologia.addEventListener("submit", crearCitologia);

// Modificar Citología
btnformmodificarcitologia.addEventListener("click", () => {
  if (!citologiaId) {
    alertcitologia.classList.remove("ocultar");
  } else {
    cargarCitologiaUpdateModal();
    if (!modalupdateCitologia.classList.contains("showmodal")) {
      modalupdateCitologia.classList.add("showmodal");
      modalupdateCitologia.classList.remove("hidemodal");
    }
  }
});

btnformcerrarmodificarCitologia.addEventListener("click", () => {
  if (!modalupdateCitologia.classList.contains("hidemodal")) {
    modalupdateCitologia.classList.add("hidemodal");
    modalupdateCitologia.classList.remove("showmodal");
  }
});

modificarCitologia.addEventListener("submit", modificarCitologiaUpdate);

// Borrar Citología
eliminarCassetteModal.addEventListener("show.bs.modal", (event) => {
  // comprobamos si ha seleccionado una citología
  if (!citologiaId) {
    event.preventDefault();
    alertcitologia.classList.remove("ocultar");
  }
});

btnborrar.addEventListener("click", borrarCitologia);

// mostrar modal imagen citologia
imagenCassetteModal.addEventListener("show.bs.modal", (event) => {
  // comprobamos si ha seleccionado una citología
  if (!citologiaId) {
    event.preventDefault();
    alertcitologia.classList.remove("ocultar");
  }
});

// mostrar modal qr muestra
qrMuestraModal.addEventListener("show.bs.modal", (event) => {
  inputmuestra__qr.style.display = "none";
  inputmuestra__qr.focus();
});

// mostrar modal qr citologia
qrCassetteModal.addEventListener("show.bs.modal", (event) => {
  // comprobamos si ha seleccionado una citología
  if (!citologiaId) {
    event.preventDefault();
    alertcitologia.classList.remove("ocultar");
    inputcassette__qr.focus();
  }
});

// Crear Muestra
btnformnuevaMuestra.addEventListener("click", () => {
  if (!citologiaId) {
    alertcitologia.classList.remove("ocultar");
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

nuevaMuestra.addEventListener("submit", crearMuestra);

// Modificar Muestra
btnformmodificarMuestra.addEventListener("click", () => {
  if (!citologiaId) {
    alertcitologia.classList.remove("ocultar");
  } else {
    cargarMuestraUpdateModal();
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

modificarMuestra.addEventListener("submit", modificarMuestraUpdate);

// Consulta Detalle Muestras
muestras.addEventListener("click", (event) => {
  if (event.target.nodeName == "I") {
    detailMuestra(event.target.value);
  }
});

// Gestionar click en imágenes para seleccionar/eliminar
muestra__img.addEventListener("click", async (event) => {
  if (event.target.nodeName === "IMG") {
    imageId = event.target.id;
  }
  if (event.target.nodeName === "I") aniadirImagenMuestra();
});
inputcassette__qr.value = "";
input__consultarqr.value = "";

// Lectura codigo qr
qrCassetteModal.addEventListener("keydown", (event) => {
  // inputcassette__qr.focus();
  if (event.key === "Enter") {
    consultarCassetteQR(inputcassette__qr.value);
    inputcassette__qr.value = "";
  } else {
    inputcassette__qr.value += event.key;
  }
});

qrConsultaModal.addEventListener("show.bs.modal", () => {
  input__consultarqr.style.display = "none";
  input__consultarqr.focus();
});

// Consulta por QR tanto de Cassette como de Muestra
qrConsultaModal.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    let tipo = input__consultarqr.value.substring(0, 5);
    if (tipo === "--c--") {
      consultarCassetteQR(input__consultarqr.value);
    }
    if (tipo === "--m--") {
      consultarMuestraQR(input__consultarqr.value);
    }
    mimodal.hide();
    input__consultarqr.value = "";
  } else {
    input__consultarqr.value += event.key;
  }
});

btn__imprimrqr.addEventListener("click", () => imprimirQR("cassette"));

btn__imprimirqrmuestra.addEventListener("click", () => imprimirQR("muestra"));

btnborrarmuestra.addEventListener("click", borrarMuestra);
btnborrarimagenmuestra.addEventListener("click", borrarImagenMuestra);

// Guardar solo el informe de resultados
const guardarInformeMedico = async () => {
  if (!currentCitologiaId) {
    alert("Por favor, selecciona una citología primero.");
    return;
  }

  const datosReporte = {
    accion: "actualizarInformeMedico",
    citologiaId: currentCitologiaId,
    descripcion: citologiaInformeDescripcion.value,
    fecha: citologiaInformeFecha.value,
    tincion: citologiaInformeTincion.value,
    observaciones: citologiaInformeObservaciones.value,
    imagen: citologiaInformeImagen.files.length > 0 ? "" : "", // Basic fallback
  };

  if (citologiaInformeImagen.files.length > 0) {
    const imgReader = new FileReader();
    imgReader.readAsDataURL(citologiaInformeImagen.files[0]);
    imgReader.onload = async function () {
      datosReporte.imagen = imgReader.result.split(',')[1]; // Get base64
      guardarDatosReporteCitologia(datosReporte);
    };
    return;
  }
  guardarDatosReporteCitologia(datosReporte);
};

const guardarDatosReporteCitologia = async (datosReporte) => {
  try {
    const res = await fetch(`/api/citologias/${currentCitologiaId}/actualizar_informe/`, {
      method: "POST",
      headers: getHeaders('POST', false),
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
