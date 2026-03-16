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

const necropsias = document.getElementById("necropsias");
const muestras = document.getElementById("muestras");
const organos = document.getElementById("organos");
const numNecropsia = document.getElementById("numNecropsia");

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
const modalnuevaNecropsia = document.getElementById("modalnuevaNecropsia");
const btnformnuevanecropsia = document.getElementById("btnformnuevanecropsia");
const btnformmodificarnecropsia = document.getElementById(
  "btnformmodificarnecropsia"
);
const btnformcerrarnuevaNecropsia = document.getElementById(
  "btnformcerrarnuevaNecropsia"
);
const btnformcerrarmodificarNecropsia = document.getElementById(
  "btnformcerrarmodificarNecropsia"
);
const btnmodificar = document.getElementById("btnmodificar");
const nuevaNecropsia = document.getElementById("nuevaNecropsia");
const nuevaMuestra = document.getElementById("nuevaMuestra");

const necropsiaDescripcion = document.getElementById("necropsia__descripcion");
const necropsiaOrgano = document.getElementById("necropsia__organo");
const necropsiaNecropsia = document.getElementById("necropsia__necropsia");
const necropsiaTipo = document.getElementById("necropsia__tipo");
const necropsiaFecha = document.getElementById("necropsia__fecha");
const necropsiaTecnicoId = document.getElementById("necropsia__tecnico_id");
const necropsiaCaracteristicas = document.getElementById(
  "necropsia__caracteristicas"
);
const necropsiaObservaciones = document.getElementById(
  "necropsia__observaciones"
);

const necropsiaInformeDescripcion = document.getElementById("necropsia__informe_descripcion");
const necropsiaInformeFecha = document.getElementById("necropsia__informe_fecha");
const necropsiaInformeTincion = document.getElementById("necropsia__informe_tincion");
const necropsiaInformeObservaciones = document.getElementById("necropsia__informe_observaciones");
const necropsiaInformeImagen = document.getElementById("necropsia__informe_imagen");
const btnGuardarInforme = document.getElementById("btnGuardarInforme");
let currentNecropsiaId = null;

const necropsiaImagen = document.getElementById("necropsia__imagen");
const eliminarCassetteModal = document.getElementById("eliminarCassetteModal");

// Detalle Necropsia
const btn__imprimrqr = document.getElementById("btn__imprimirqr");

// Modal qr
const imgcassette__qr = document.getElementById("imgcassette__qr");
const inputcassette__qr = document.getElementById("inputcassette__qr");

// Todas las necropsias
const todasNecropsias = document.getElementById("todasNecropsias");

// Nueva Necropsia
const inputFecha = document.getElementById("inputFecha");
const inputNecropsia = document.getElementById("inputNecropsia");
const inputDescripcion = document.getElementById("inputDescripcion");
const inputTipoNecropsia = document.getElementById("inputTipoNecropsia");
const inputCaracteristicas = document.getElementById("inputCaracteristicas");
const inputObservaciones = document.getElementById("inputObservaciones");
const inputMicroscopia = document.getElementById("inputMicroscopia");
const inputDiagnostico = document.getElementById("inputDiagnostico");
const inputPatologo = document.getElementById("inputPatologo");
const inputSelect = document.getElementById("inputSelect");

// Modificar Necropsia
const modalupdateNecropsia = document.getElementById("modalupdateNecropsia");
const modificarNecropsia = document.getElementById("modificarNecropsia");
const btnmodificarnecropsia = document.getElementById("btnmodificarnecropsia");
const inputFechaUpdate = document.getElementById("inputFechaUpdate");
const inputImagenesUpdate = document.getElementById("inputImagenesUpdate");

const inputDescripcionUpdate = document.getElementById(
  "inputDescripcionUpdate"
);
const inputNecropsiaUpdate = document.getElementById("inputNecropsiaUpdate");
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
const alertnecropsia = document.getElementById("alertnecropsia");
const alertfecha = document.getElementById("alertfecha");
const alertfecha_text = document.getElementById("alertfecha_text");

// id del citlogía de trabajo
let necropsiaId = null;

// qr cassete
let cassetteqr = null;

// id muestra cassete
let muestraId = null;

// id imagene seleccionada
let imageId = null;

const files = document.getElementById("files");

// Carga Necropsias al inicio
const cargarNecropsiaIndex = async () => {
  return await fetch("/api/necropsias/index/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Crear necropsia
const crearNecropsia = async (event) => {
  event.preventDefault();

  try {
    // Get or use default technician
    const tecnicoId = sessionStorage.getItem("user") || 1;

    const response = await fetch("/api/necropsias/", {
      method: "POST",
      headers: getHeaders('POST', false),
      body: JSON.stringify({
        necropsia: inputNecropsia.value,
        fecha: inputFecha.value,
        tipo_necropsia: inputTipoNecropsia.value,
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
        // imprimirDetalleNecropsia expects the API shape (id_necropsia)
        imprimirDetalleNecropsia(created);
        // load its muestras
        necropsiaId = created.id_necropsia || created.id || created.pk;
        const muestrasResp = await cargarMuestras(necropsiaId);
        imprimirMuestras(muestrasResp);
        // close modal
        if (modalnuevaNecropsia) {
          modalnuevaNecropsia.classList.remove('showmodal');
          modalnuevaNecropsia.classList.add('hidemodal');
        }
      } else {
        // Backend did not return JSON; refresh list to show created item without throwing error
        location.href = 'necropsias.html';
      }
    } else {
      let errorObj = null;
      try { errorObj = await response.json(); } catch (e) { errorObj = null; }
      console.error("Error al crear necropsia:", errorObj || response.statusText || response.status);
      alert("Error al crear la necropsia: " + (errorObj ? JSON.stringify(errorObj) : response.statusText || response.status));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al crear la necropsia");
  }
};

// Carga todas las necropsias desde el botón
const cargarTodasNecropsias = async () => {
  return await fetch("/api/necropsias/todos/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Carga el detalle de la necropsia seleccionada
const cargarNecropsia = async (necropsiaId) => {
  return await fetch(`/api/necropsias/${necropsiaId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Obtener necropsias por organo
const cargarPorOrgano = async () => {
  return await fetch(`/api/necropsias/organo/${organos.value}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((data) => data.json())
    .catch((error) => console.log("No se esta ejecutando" + error));
};

// Obtener necropsias por número de necropsia
const cargarPorNumero = async () => {
  return await fetch(`/api/necropsias/numero/${numNecropsia.value}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((data) => data.json())
    .catch((error) => console.log("No se esta ejecutando" + error));
};

// Obtener necropsias por fecha
const obtenerNecropsiaFecha = async (fecha) => {
  const response = await fetch(`/api/necropsias/por_fecha/${fecha}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  return await response.json();
};

// Obtener necropsias por rango de fechas
const obtenerNecropsiaFechaRango = async (fechainicio, fechafin) => {
  const response = await fetch(`/api/necropsias/rango_fechas/?inicio=${fechainicio}&fin=${fechafin}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  return await response.json();
};

// Borrar una necropsia
const borrarNecropsia = () => {
  (async () => {
    try {
      const res = await fetch(`/api/necropsias/${necropsiaId}/`, {
        method: 'DELETE',
        headers: getHeaders('DELETE', false)
      });
      if (res.ok) {
        // refresh page or reload list
        location.href = 'necropsias.html';
      } else {
        console.error('Error borrando necropsia', res.status);
        alert('Error al borrar la necropsia');
      }
    } catch (e) {
      console.error(e);
      alert('Error al borrar la necropsia');
    }
  })();
};

// Consulta necropsias en una fecha
const consultaFechaInicio = async () => {
  alertfecha.classList.add("ocultar");
  let respuesta;
  if (!fechafin.value) {
    respuesta = await obtenerNecropsiaFecha(fechainicio.value);
  } else {
    if (new Date(fechainicio.value) > new Date(fechafin.value)) {
      alertfecha.classList.add("ocultar");
      alertfecha_text.textContent = "La fecha de inicio debe ser menor";
      alertfecha.classList.remove("ocultar");
    } else {
      alertfecha.classList.add("ocultar");
      respuesta = await obtenerNecropsiaFechaRango(
        fechainicio.value,
        fechafin.value
      );
    }
  }
  imprimirNecropsias(respuesta, false);
};

// Consulta necropsias entre dos fechas
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
      const respuesta = await obtenerNecropsiaFechaRango(
        fechainicio.value,
        fechafin.value
      );
      imprimirNecropsias(respuesta, false);
    }
  }
};

// Muestra los datos de las necropsias por pantalla
const imprimirNecropsias = (respuesta, rebuildDropdown = true) => {
  necropsias.innerHTML = "";
  if (rebuildDropdown) {
    numNecropsia.innerHTML =
      "<option disabled selected>Nº Necropsia</option>";
    let optionTodos = document.createElement("OPTION");
    optionTodos.value = "*";
    optionTodos.textContent = "Todos";
    numNecropsia.appendChild(optionTodos);
  }

  let fragmento = document.createDocumentFragment();
  let fragmentselect = document.createDocumentFragment();
  if (respuesta.length > 0) {
    respuesta.map((necropsia) => {
      // Para cargar los números de necropsia
      let option = document.createElement("OPTION");
      option.value = necropsia.necropsia; // Usamos el número, no el ID interno
      option.textContent = necropsia.necropsia;
      fragmentselect.appendChild(option);

      // Para mostrar necropsias
      let tr = document.createElement("tr");
      tr.classList.add("table__row");

      // Número de necropsia
      let nnecropsia = document.createElement("td");
      nnecropsia.textContent = necropsia.necropsia;

      let fecha = document.createElement("td");
      nuevafecha = necropsia.fecha;

      fecha.textContent =
        nuevafecha.substring(8) +
        "-" +
        nuevafecha.substring(5, 7) +
        "-" +
        nuevafecha.substring(0, 4);
      let descripcion = document.createElement("td");
      descripcion.textContent = necropsia.descripcion.substring(0, 50);
      descripcion.title = necropsia.descripcion;

      let organo = document.createElement("td");
      organo.textContent = necropsia.organo;

      let btndetalle = document.createElement("I");
      btndetalle.className =
        "d-inline-block cassette__icon fa-solid fa-eye cassette__icon--infocassette";
      btndetalle.value = necropsia.id_necropsia;
      btndetalle.title = "Detalle Necropsia";

      let btnCont = document.createElement("td");
      btnCont.appendChild(btndetalle);

      tr.appendChild(nnecropsia);
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
    tr.textContent = "No se ha encontrado niguna Necropsia";
    fragmento.appendChild(tr);
  }

  necropsias.appendChild(fragmento);
  if (rebuildDropdown) {
    numNecropsia.appendChild(fragmentselect);
  }
};

//Peticiones de necropsia y Muestras al seleccionar un necropsia y llama a
// mostrar necropsias y mostrar muestras
const detalleNecropsia = async (event) => {
  if (event.target.classList.contains("fa-eye")) {
    alertnecropsia.classList.add("ocultar");
    necropsiaId = event.target.value;

    let respuesta = await cargarNecropsia(necropsiaId);
    imprimirDetalleNecropsia(respuesta);

    respuesta = await cargarMuestras(necropsiaId);
    imprimirMuestras(respuesta);
  }

  if (event.target.classList.contains("fa-trash-can")) {
    console.log(event.target.data - value);
  }
};

// Muestra el detalle de una necropsia
const imprimirDetalleNecropsia = (respuesta) => {
  necropsiaDescripcion.textContent = respuesta.descripcion.substring(0, 50);
  necropsiaOrgano.textContent = respuesta.organo;
  necropsiaNecropsia.textContent = respuesta.necropsia;
  necropsiaTipo.textContent = respuesta.tipo_necropsia;
  necropsiaTecnicoId.textContent = respuesta.tecnico || "";

  // Formato Fecha
  nuevafecha = respuesta.fecha;
  necropsiaFecha.textContent =
    nuevafecha.substring(8) +
    "-" +
    nuevafecha.substring(5, 7) +
    "-" +
    nuevafecha.substring(0, 4);

  necropsiaCaracteristicas.textContent = respuesta.caracteristicas;
  necropsiaObservaciones.textContent = respuesta.observaciones;

  necropsiaInformeDescripcion.value = respuesta.informe_descripcion || "";
  necropsiaInformeFecha.value = respuesta.informe_fecha || "";
  necropsiaInformeTincion.value = respuesta.informe_tincion || "";
  necropsiaInformeObservaciones.value = respuesta.informe_observaciones || "";
  // necropsiaInformeImagen logic would depend on base64 rendering
  currentNecropsiaId = respuesta.id_necropsia;

  // Le paso la imagen al visor de imagenes
  // Si tiene o no imagen
  /*  console.log(respuesta)
  respuesta.imagen
    ? (necropsiaImagen.src = `data:image/jpeg;base64,${respuesta.imagen}`)
    : (necropsiaImagen.src = "./assets/images/no_disponible.jpg");

  inputcassette__qr.style.display = "none";
  inputcassette__qr.focus(); */

  // generamos el codigo QR
  new QRious({
    element: document.querySelector("#imgcassette__qr"),
    value: respuesta.qr_necropsia, // La URL o el texto
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

// Cargamos el modal datos necropsia modificar
const cargarNecropsiaUpdateModal = async (event) => {
  if (!necropsiaId) {
    event.preventDefault();
    alertnecropsia.classList.remove("ocultar");
  } else {
    let necropsia = await cargarNecropsia(necropsiaId);
    inputNecropsiaUpdate.value = necropsia.necropsia;
    inputDescripcionUpdate.value = necropsia.descripcion;
    inputTipoUpdate.value = necropsia.tipo_necropsia;
    inputFechaUpdate.value = necropsia.fecha;
    inputCaracteristicasUpdate.value = necropsia.caracteristicas;
    inputObservacionesUpdate.value = necropsia.observaciones;
    inputMicroscopiaUpdate.value = necropsia.descripcion_microscopica || "";
    inputDiagnosticoUpdate.value = necropsia.diagnostico_final || "";
    inputPatologoUpdate.value = necropsia.patologo_responsable || "";
    inputSelectUpdate.value = necropsia.organo;
  }
};

const modificarNecropsiaUpdate = async (event) => {
  event.preventDefault();
  await fetch(`/api/necropsias/${necropsiaId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      necropsia: inputNecropsiaUpdate.value,
      fecha: inputFechaUpdate.value,
      descripcion: inputDescripcionUpdate.value,
      tipo_necropsia: inputTipoUpdate.value,
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
        location.href = "necropsias.html";
      }
    })
    .catch((error) => console.log(error));
};

// MUESTRAS

// Carga Muestras de una necropsia
const cargarMuestras = async (necropsiaId) => {
  return await fetch(`/api/muestrasnecropsia/por_necropsia/${necropsiaId}/`, {
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
  newMuestra.append("necropsia", necropsiaId);

  await fetch("/api/muestrasnecropsia/", {
    method: "POST",
    // Include CSRF token header but do not set Content-Type (browser will set multipart boundary)
    headers: getHeaders('POST', true),
    body: newMuestra,
  })
    .then(async () => {
      modalnuevaMuestra.classList.remove("showmodal");
      modalnuevaMuestra.classList.add("hidemodal");
      limpiarModalMuestra();
      imprimirMuestras(await cargarMuestras(necropsiaId));
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
  if (!necropsiaId) {
    event.preventDefault();
    alertnecropsia.classList.remove("ocultar");
  } else {
    const response = await fetch(`/api/muestrasnecropsia/${muestraId}/`, {
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

  await fetch(`/api/muestrasnecropsia/${muestraId}/`, {
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
      respuesta = await cargarMuestras(necropsiaId);
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
      btn.style.whiteSpace = "nowrap";

      let btndetalle = document.createElement("I");
      btndetalle.className =
        "d-inline-block cassette__icon fa-solid fa-eye cassette__icon--infocassette me-2";
      btndetalle.dataset.id = muestra.id_muestra;
      btndetalle.dataset.action = "view";
      btndetalle.title = "Detalle Muestra";

      let btneditar = document.createElement("I");
      btneditar.className =
        "d-inline-block cassette__icon fa-solid fa-file-pen cassette__icon--infocassette me-2";
      btneditar.dataset.id = muestra.id_muestra;
      btneditar.dataset.action = "edit";
      btneditar.title = "Modificar Muestra";

      let btneliminar = document.createElement("I");
      btneliminar.className =
        "d-inline-block cassette__icon fa-solid fa-trash-can text-danger";
      btneliminar.dataset.id = muestra.id_muestra;
      btneliminar.dataset.action = "delete";
      btneliminar.title = "Eliminar Muestra";

      btn.appendChild(btndetalle);
      btn.appendChild(btneditar);
      btn.appendChild(btneliminar);

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
  const response = await fetch(`/api/muestrasnecropsia/${muestraid}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

// Obtenemos las imagenes de una muestra
const obtenerImagenesMuestra = async (muestraid) => {
  const response = await fetch(`/api/imagenesnecropsia/por_muestra/${muestraid}/`, {
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
  const visorImagen = document.getElementById("visor__img");

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

  // Mostrar imágenes en el contenedor
  if (imagenes.length > 0) {
    muestra__img.style.display = "flex";
    muestra__img.classList.remove("muestra__galeria--vacia");
    if (visorImagen) {
      visorImagen.classList.remove("visor__img--empty");
      visorImagen.alt = "Vista previa de la muestra";
    }
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
        if (visorImagen) visorImagen.src = newimg.src;
        imageId = newimg.id;
      }

      // Añadimos cada una de las imagenes
      muestra__img.appendChild(newimg);
    });
  } else {
    renderEstadoSinImagen();
  }
};

const borrarMuestra = async () => {
  fetch(`/api/muestrasnecropsia/${muestraId}/`, {
    method: "DELETE",
    headers: getHeaders('DELETE', false),
  })
    .then(async () => {
      modaldetalleMuestra.classList.remove("showmodal");
      // Mostramos las muestras del cassette
      let muestras = await cargarMuestras(necropsiaId);
      imprimirMuestras(muestras);
    })
    .catch((error) => console.log(error));
};

const borrarImagenMuestra = async () => {
  if (imageId != undefined) {
    fetch(`/api/imagenesnecropsia/${imageId}/`, {
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
const aniadirImagenMuestra = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '*/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    let newImage = new FormData();
    newImage.append("imagen", file);
    newImage.append("muestra", muestraId);
    try {
      const response = await fetch("/api/imagenesnecropsia/", {
        method: "POST",
        headers: getHeaders('POST', true),
        body: newImage,
      });
      if (response.ok) {
        await mostrarImagenesMuestra(muestraId);
      } else {
        console.error('Error añadiendo imagen', response.status);
        alert('Error al subir la imagen');
      }
    } catch (err) {
      console.error(err);
    }
  };
  input.click();
};

const consultarNecropsiaQR = async (qr) => {
  const response = await fetch(`/api/necropsias/por_qr/${qr}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  let necropsia = await response.json();

  // Mostrar los datos de la necropsia
  imprimirNecropsias(necropsia);
  // Obtenemos un array, pq nos viene bien para la consulta de necropsias que espera un array
  //Obtenemos el primero, aunque sólo nos devuelve uno, para la consulta de una necropsia
  necropsia = necropsia[0];

  // Mostramos el detalle de la necropsia
  imprimirDetalleNecropsia(necropsia);

  // Mostramos las muestras de la necropsia
  necropsiaId = necropsia.id_necropsia;
  let muestras = await cargarMuestras(necropsiaId);
  imprimirMuestras(muestras);
};

const consultarMuestraQR = async (qr) => {
  // Obtengo la muestra para obtener el id de la necropsia
  let response = await fetch(`/api/muestrasnecropsia/por_qr/${qr}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let muestra = await response.json();
  if (Array.isArray(muestra)) {
    muestra = muestra[0];
  }
  // Obtengo la necropsia de la muestra
  response = await fetch(`/api/necropsias/${muestra.necropsia}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  // Mostramos la necropsia de la muestra
  let necropsia = await response.json();
  consultarNecropsiaQR(necropsia.qr_necropsia);
  detailMuestra(muestra.id_muestra);
};;

// Cargamos el modal datos cassete modificar
const cargarUserUpdateModal = async (event) => {
  let userId = sessionStorage.getItem("user");
  const response = await fetch(
    "http://localhost:3000/api/tecnicos/" + userId,
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



// Consulta Necropsia Recientes
document.addEventListener("DOMContentLoaded", async () => {
  body.style.display = "block";
  const respuesta = await cargarNecropsiaIndex();
  imprimirNecropsias(respuesta);
  let fechaActual = new Date().toISOString().split("T")[0];
  // Para que no se pueda seleccionar una fecha anterior a la actual
  inputFecha.setAttribute("min", fechaActual);
  inputFechaUpdate.setAttribute("min", fechaActual);
  inputFechaMuestra.setAttribute("min", fechaActual);
});

// Consulta por Organo
organos.addEventListener("change", async () => {
  const respuesta = await cargarPorOrgano();
  imprimirNecropsias(respuesta, false);
});

// Consulta por número de Necropsia
numNecropsia.addEventListener("change", async () => {
  let respuesta;
  if (numNecropsia.value === "*") {
    respuesta = await cargarTodasNecropsias();
  } else {
    respuesta = await cargarPorNumero();
  }
  // Solicitud del usuario: filtrar la tabla pero NO el desplegable de arriba
  imprimirNecropsias(respuesta, false);
});

// Consulta Detalle Necropsias y Muestras
necropsias.addEventListener("click", detalleNecropsia);

// Consulta por fecha
fechainicio.addEventListener("change", consultaFechaInicio);

fechafin.addEventListener("change", consultaFechaFin);

// Todas las necropsias
todasNecropsias.addEventListener("click", async () => {
  const respuesta = await cargarTodasNecropsias();
  imprimirNecropsias(respuesta);
});

// Crear Necropsia
btnformnuevanecropsia.addEventListener("click", () => {
  if (!modalnuevaNecropsia.classList.contains("showmodal")) {
    modalnuevaNecropsia.classList.add("showmodal");
    modalnuevaNecropsia.classList.remove("hidemodal");
  }
});

btnformcerrarnuevaNecropsia.addEventListener("click", () => {
  if (!modalnuevaNecropsia.classList.contains("hidemodal")) {
    modalnuevaNecropsia.classList.add("hidemodal");
    modalnuevaNecropsia.classList.remove("showmodal");
  }
});

nuevaNecropsia.addEventListener("submit", crearNecropsia);

// Modificar Necropsia
btnformmodificarnecropsia.addEventListener("click", () => {
  if (!necropsiaId) {
    alertnecropsia.classList.remove("ocultar");
  } else {
    cargarNecropsiaUpdateModal();
    if (!modalupdateNecropsia.classList.contains("showmodal")) {
      modalupdateNecropsia.classList.add("showmodal");
      modalupdateNecropsia.classList.remove("hidemodal");
    }
  }
});

btnformcerrarmodificarNecropsia.addEventListener("click", () => {
  if (!modalupdateNecropsia.classList.contains("hidemodal")) {
    modalupdateNecropsia.classList.add("hidemodal");
    modalupdateNecropsia.classList.remove("showmodal");
  }
});

modificarNecropsia.addEventListener("submit", modificarNecropsiaUpdate);

// Borrar Necropsia
eliminarCassetteModal.addEventListener("show.bs.modal", (event) => {
  // comprobamos si ha seleccionado una necropsia
  if (!necropsiaId) {
    event.preventDefault();
    alertnecropsia.classList.remove("ocultar");
  }
});

btnborrar.addEventListener("click", borrarNecropsia);

// mostrar modal imagen necropsia
imagenCassetteModal.addEventListener("show.bs.modal", (event) => {
  // comprobamos si ha seleccionado una necropsia
  if (!necropsiaId) {
    event.preventDefault();
    alertnecropsia.classList.remove("ocultar");
  }
});

// mostrar modal qr muestra
qrMuestraModal.addEventListener("show.bs.modal", (event) => {
  inputmuestra__qr.style.display = "none";
  inputmuestra__qr.focus();
});

// mostrar modal qr necropsia
qrCassetteModal.addEventListener("show.bs.modal", (event) => {
  // comprobamos si ha seleccionado una necropsia
  if (!necropsiaId) {
    event.preventDefault();
    alertnecropsia.classList.remove("ocultar");
    inputcassette__qr.focus();
  }
});

// Crear Muestra
btnformnuevaMuestra.addEventListener("click", () => {
  if (!necropsiaId) {
    alertnecropsia.classList.remove("ocultar");
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
  if (!necropsiaId) {
    alertnecropsia.classList.remove("ocultar");
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
    if (!necropsiaId || !muestraId) {
      alertnecropsia.classList.remove("ocultar");
      return;
    }
    await cargarMuestraUpdateModal();
    if (!modalmodificarMuestra.classList.contains("showmodal")) {
      modalmodificarMuestra.classList.add("showmodal");
      modalmodificarMuestra.classList.remove("hidemodal");
    }
    return;
  }

  if (action === "delete") {
    if (confirm("¿Estás seguro de eliminar este análisis?")) {
      await borrarMuestra();
    }
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

const btnaniadirimagenmuestra = document.getElementById("btnaniadirimagenmuestra");
if (btnaniadirimagenmuestra) {
  btnaniadirimagenmuestra.addEventListener("click", aniadirImagenMuestra);
}

// Guardar solo el informe de resultados
const guardarInformeMedico = async () => {
  if (!currentNecropsiaId) {
    alert("Por favor, selecciona una necropsia primero.");
    return;
  }

  const datosReporte = {
    accion: "actualizarInformeMedico",
    necropsiaId: currentNecropsiaId,
    descripcion: necropsiaInformeDescripcion.value,
    fecha: necropsiaInformeFecha.value,
    tincion: necropsiaInformeTincion.value,
    observaciones: necropsiaInformeObservaciones.value,
    imagen: necropsiaInformeImagen.files.length > 0 ? "" : "", // Basic fallback
  };

  if (necropsiaInformeImagen.files.length > 0) {
    const imgReader = new FileReader();
    imgReader.readAsDataURL(necropsiaInformeImagen.files[0]);
    imgReader.onload = async function () {
      datosReporte.imagen = imgReader.result.split(',')[1]; // Get base64
      guardarDatosReporteNecropsia(datosReporte);
    };
    return;
  }
  guardarDatosReporteNecropsia(datosReporte);
};

const guardarDatosReporteNecropsia = async (datosReporte) => {
  try {
    const res = await fetch(`/api/necropsias/${currentNecropsiaId}/actualizar_informe/`, {
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
