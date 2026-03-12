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

const body = document.getElementById("body");
const casettes = document.getElementById("casettes");
const muestras = document.getElementById("muestras");
const organos = document.getElementById("organos");
const numCassette = document.getElementById("numCassette");

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
const modalnuevoCassette = document.getElementById("modalnuevoCassette");
const btnformnuevocassette = document.getElementById("btnformnuevocassette");
const btnformmodificarcassette = document.getElementById(
  "btnformmodificarcassette"
);
const btnformcerrarnuevoCassette = document.getElementById(
  "btnformcerrarnuevoCassette"
);
const btnformcerrarmodificarCassette = document.getElementById(
  "btnformcerrarmodificarCassette"
);
const btnmodificar = document.getElementById("btnmodificar");
const nuevoCassette = document.getElementById("nuevoCassette");
const nuevaMuestra = document.getElementById("nuevaMuestra");

const cassetteDescripcion = document.getElementById("cassette__descripcion");
const cassetteOrgano = document.getElementById("cassette__organo");
const cassetteCassette = document.getElementById("cassette__cassette");
const cassetteFecha = document.getElementById("cassette__fecha");
const cassetteTecnicoId = document.getElementById("cassette__tecnico_id");
const cassetteCaracteristicas = document.getElementById(
  "cassette__caracteristicas"
);
const cassetteObservaciones = document.getElementById(
  "cassette__observaciones"
);
const cassetteInformeDescripcion = document.getElementById("cassette__informe_descripcion");
const cassetteInformeFecha = document.getElementById("cassette__informe_fecha");
const cassetteInformeTincion = document.getElementById("cassette__informe_tincion");
const cassetteInformeObservaciones = document.getElementById("cassette__informe_observaciones");
const cassetteInformeImagen = document.getElementById("cassette__informe_imagen");

const cassetteImagen = document.getElementById("cassette__imagen");
const eliminarCassetteModal = document.getElementById("eliminarCassetteModal");

// Detalle Cassette
let currentCassetteId = null;
const btnGuardarInforme = document.getElementById("btnGuardarInforme");
const btn__imprimrqr = document.getElementById("btn__imprimirqr");

// Modal qr
const imgcassette__qr = document.getElementById("imgcassette__qr");
const inputcassette__qr = document.getElementById("inputcassette__qr");

// Todos los cassettes
const todosCassettes = document.getElementById("todosCassettes");

// Nuevo Cassete
const inputFecha = document.getElementById("inputFecha");
const inputCassette = document.getElementById("inputCassette");
const inputDescripcion = document.getElementById("inputDescripcion");
const inputCaracteristicas = document.getElementById("inputCaracteristicas");
const inputObservaciones = document.getElementById("inputObservaciones");
const inputMicroscopia = document.getElementById("inputMicroscopia");
const inputDiagnostico = document.getElementById("inputDiagnostico");
const inputPatologo = document.getElementById("inputPatologo");
const inputSelect = document.getElementById("inputSelect");
const inputImagenes = document.getElementById("inputImagenes");

// Modificar Cassete
const modalupdateCassette = document.getElementById("modalupdateCassette");
const modificarCassette = document.getElementById("modificarCassette");
const btnmodificarcassette = document.getElementById("btnmodificarcassette");
const inputFechaUpdate = document.getElementById("inputFechaUpdate");
const inputImagenesUpdate = document.getElementById("inputImagenesUpdate");

const inputDescripcionUpdate = document.getElementById(
  "inputDescripcionUpdate"
);
const inputCassetteUpdate = document.getElementById("inputCassetteUpdate");
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
const alertcassette = document.getElementById("alertcassette");
const alertfecha = document.getElementById("alertfecha");
const alertfecha_text = document.getElementById("alertfecha_text");

// id del cassete de trabajo
let cassetteId = null;

// qr cassete
let cassetteqr = null;

// id muestra cassete
let muestraId = null;

// id imagene seleccionada
let imageId = null;

const files = document.getElementById("files");
const qrResolverBase = "/qr/resolver/";
const QR_RENDER_SIZE = 220;

const buildResolverUrl = (code) => {
  if (!code) return "";
  return `${window.location.origin}${qrResolverBase}?code=${encodeURIComponent(code)}`;
};

// Carga Cassettes al inicio
const cargarCassettesIndex = async () => {
  return await fetch("/api/cassettes/index/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Crear Cassettes
const crearCassette = async (event) => {
  event.preventDefault();

  try {
    const tecnicoId = sessionStorage.getItem("user") || 1;

    const response = await fetch("/api/cassettes/", {
      method: "POST",
      headers: getHeaders('POST', false),
      body: JSON.stringify({
        cassette: inputCassette.value,
        fecha: inputFecha.value,
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
      // backend may return 201 with or without JSON
      let created = null;
      try {
        const ct = response.headers.get('content-type') || '';
        if (ct.includes('application/json')) created = await response.json();
      } catch (e) {
        created = null;
      }

      if (created) {
        // if created object returned, navigate to its detail or refresh list
        location.href = 'cassettes.html';
      } else {
        location.href = 'cassettes.html';
      }
    } else {
      let errorObj = null;
      try { errorObj = await response.json(); } catch (e) { errorObj = null; }
      console.error("Error al crear cassette:", errorObj || response.statusText || response.status);
      alert("Error al crear el cassette: " + (errorObj ? JSON.stringify(errorObj) : response.statusText || response.status));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al crear el cassette");
  }
};

// Carga todos lo cassettes desde el botón
const cargarTodosCassettes = async () => {
  return await fetch("/api/cassettes/todos/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Carga el detalle del cassette seleccionado
const cargarCassette = async (cassetteId) => {
  return await fetch(`/api/cassettes/${cassetteId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Obtener cassettes por organo
const cargarPorOrgano = async () => {
  return await fetch(`/api/cassettes/organo/${organos.value}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((data) => data.json())
    .catch((error) => console.log("No se esta ejecutando" + error));
};

// Obtener cassettes por número de cassette
const cargarPorNumero = async () => {
  return await fetch(`/api/cassettes/numero/${numCassette.value}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((data) => data.json())
    .catch((error) => console.log("No se esta ejecutando" + error));
};

// Obtener cassettes por fecha
const obtenerCassettesFecha = async (fecha) => {
  const response = await fetch(`/api/cassettes/por_fecha/${fecha}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  return await response.json();
};

// Obtener cassettes por rango de fechas
const obtenerCassettesFechaRango = async (fechainicio, fechafin) => {
  const response = await fetch(`/api/cassettes/rango_fechas/?inicio=${fechainicio}&fin=${fechafin}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  return await response.json();
};

// Borrar un cassette
// (implementation moved later in file with CSRF handling)

// Consulta cassettes en una fecha
const consultaFechaInicio = async () => {
  alertfecha.classList.add("ocultar");
  let respuesta;
  if (!fechafin.value) {
    respuesta = await obtenerCassettesFecha(fechainicio.value);
  } else {
    if (new Date(fechainicio.value) > new Date(fechafin.value)) {
      alertfecha.classList.add("ocultar");
      alertfecha_text.textContent = "La fecha de inicio debe ser menor";
      alertfecha.classList.remove("ocultar");
    } else {
      alertfecha.classList.add("ocultar");
      respuesta = await obtenerCassettesFechaRango(
        fechainicio.value,
        fechafin.value
      );
    }
  }
  imprimirCasettes(respuesta, false);
};

// Consulta cassettes entre dos fechas
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
      const respuesta = await obtenerCassettesFechaRango(
        fechainicio.value,
        fechafin.value
      );
      imprimirCasettes(respuesta, false);
    }
  }
};

// Muestra los datos de los cassettes por pantalla
const imprimirCasettes = (respuesta, rebuildDropdown = true) => {
  casettes.innerHTML = "";
  if (rebuildDropdown) {
    numCassette.innerHTML = "<option disabled selected>Nº Cassette</option>";
    let optionTodos = document.createElement("OPTION");
    optionTodos.value = "*";
    optionTodos.textContent = "Todos";
    numCassette.appendChild(optionTodos);
  }

  let fragmento = document.createDocumentFragment();
  let fragmentselect = document.createDocumentFragment();
  if (respuesta.length > 0) {
    respuesta.map((casete) => {
      // Para cargar los números de cassette
      let option = document.createElement("OPTION");
      option.value = casete.cassette;
      option.textContent = casete.cassette;
      fragmentselect.appendChild(option);

      // Para mostrar los cassettes
      let tr = document.createElement("tr");
      tr.classList.add("table__row");

      // Número de Cassette
      let ncassette = document.createElement("td");
      ncassette.textContent = casete.cassette;

      let fecha = document.createElement("td");
      nuevafecha = casete.fecha;

      fecha.textContent =
        nuevafecha.substring(8) +
        "-" +
        nuevafecha.substring(5, 7) +
        "-" +
        nuevafecha.substring(0, 4);
      let descripcion = document.createElement("td");
      descripcion.textContent = casete.descripcion.substring(0, 50);
      descripcion.title = casete.descripcion;

      let organo = document.createElement("td");
      organo.textContent = casete.organo;

      let btndetalle = document.createElement("I");
      btndetalle.className =
        "d-inline-block cassette__icon fa-solid fa-eye cassette__icon--infocassette";
      btndetalle.value = casete.id_casette;
      btndetalle.title = "Detalle Cassette";

      let btnCont = document.createElement("td");
      btnCont.appendChild(btndetalle);

      tr.appendChild(ncassette);
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
    tr.textContent = "No se ha encontrado nigún cassette";
    fragmento.appendChild(tr);
  }

  casettes.appendChild(fragmento);
  if (rebuildDropdown) {
    numCassette.appendChild(fragmentselect);
  }
};

//Peticiones de Cassette y Muestras al seleccionar un Cassette y llama a
// mostrar cassettes y mostrar muestras
const detalleCassette = async (event) => {
  if (event.target.classList.contains("fa-eye")) {
    alertcassette.classList.add("ocultar");
    cassetteId = event.target.value;

    let respuesta = await cargarCassette(cassetteId);
    imprimirDataCassette(respuesta);

    respuesta = await cargarMuestras(cassetteId);
    imprimirMuestras(respuesta);
  }

  if (event.target.classList.contains("fa-trash-can")) {
    console.log(event.target.data - value);
  }
};

// Muestra el detalle de un cassette
const imprimirDataCassette = (respuesta) => {
  cassetteDescripcion.textContent = respuesta.descripcion.substring(0, 50);
  cassetteOrgano.textContent = respuesta.organo;
  cassetteCassette.textContent = respuesta.cassette;
  cassetteTecnicoId.textContent = respuesta.tecnico || "";

  // Formato Fecha
  nuevafecha = respuesta.fecha;
  cassetteFecha.textContent =
    nuevafecha.substring(8) +
    "-" +
    nuevafecha.substring(5, 7) +
    "-" +
    nuevafecha.substring(0, 4);

  cassetteCaracteristicas.textContent = respuesta.caracteristicas;
  cassetteObservaciones.textContent = respuesta.observaciones;
  cassetteInformeDescripcion.value = respuesta.informe_descripcion || "";
  cassetteInformeFecha.value = respuesta.informe_fecha || "";
  cassetteInformeTincion.value = respuesta.informe_tincion || "";
  cassetteInformeObservaciones.value = respuesta.informe_observaciones || "";
  // cassetteInformeImagen handling would require image logic depending on how it's sent
  currentCassetteId = respuesta.id_casette;

  // Le paso la imagen al visor de imagenes
  // Si tiene o no imagen
  respuesta.imagen
    ? (cassetteImagen.src = `data:image/jpeg;base64,${respuesta.imagen}`)
    : (cassetteImagen.src = "./assets/images/no_disponible.jpg");

  inputcassette__qr.style.display = "none";
  inputcassette__qr.focus();

  // generamos el codigo QR
  new QRious({
    element: document.querySelector("#imgcassette__qr"),
    value: buildResolverUrl(respuesta.qr_casette), // La URL o el texto
    size: QR_RENDER_SIZE,
    background: "#ffffff",
    backgroundAlpha: 1,
    foreground: "#000000",
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

// Cargamos el modal datos cassete modificar
const cargarCassetteUpdateModal = async (event) => {
  if (!cassetteId) {
    event.preventDefault();
    alertcassette.classList.remove("ocultar");
  } else {
    let cassette = await cargarCassette(cassetteId);
    inputCassetteUpdate.value = cassette.cassette;
    inputDescripcionUpdate.value = cassette.descripcion;
    inputFechaUpdate.value = cassette.fecha;
    inputCaracteristicasUpdate.value = cassette.caracteristicas;
    inputObservacionesUpdate.value = cassette.observaciones;
    inputMicroscopiaUpdate.value = cassette.descripcion_microscopica || "";
    inputDiagnosticoUpdate.value = cassette.diagnostico_final || "";
    inputPatologoUpdate.value = cassette.patologo_responsable || "";
    inputSelectUpdate.value = cassette.organo;
  }
};

const modificarCassetteUpdate = async (event) => {
  event.preventDefault();
  await fetch(`/api/cassettes/${cassetteId}/`, {
    method: "PUT",
    headers: getHeaders('PUT', false),
    body: JSON.stringify({
      cassette: inputCassetteUpdate.value,
      fecha: inputFechaUpdate.value,
      descripcion: inputDescripcionUpdate.value,
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
        location.href = "cassettes.html";
      }
    })
    .catch((error) => console.log(error));
};

// MUESTRAS

// Carga Muestras de un Cassette
const cargarMuestras = async (cassetteId) => {
  return await fetch(`/api/muestras/por_cassette/${cassetteId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((data) => data.json());
};

// Crear nueva muestra
const crearMuestra = async (event) => {
  event.preventDefault();

  let newMuestra = new FormData();
  newMuestra.append("descripcion", inputdescripcionMuestra.value);
  newMuestra.append("fecha", inputFechaMuestra.value);
  newMuestra.append("observaciones", inputObservacionesMuestra.value);
  newMuestra.append("tincion", selectTincionMuestra.value);
  newMuestra.append("imagen", inputImagenesMuestra.files[0]);
  newMuestra.append("cassette", cassetteId);

  try {
    const response = await fetch("/api/muestras/", {
      method: "POST",
      headers: getHeaders('POST', true),
      body: newMuestra,
    });
    if (response.ok) {
      modalnuevaMuestra.classList.remove("showmodal");
      modalnuevaMuestra.classList.add("hidemodal");
      limpiarModalMuestra();
      imprimirMuestras(await cargarMuestras(cassetteId));
    } else {
      let err = null;
      try { err = await response.json(); } catch (e) { err = null; }
      console.error('Error creando muestra', err || response.statusText || response.status);
      alert('Error creando muestra: ' + (err ? JSON.stringify(err) : response.statusText || response.status));
    }
  } catch (error) {
    console.log("No se esta ejecutando correctamente la inserción" + error);
  }
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
  if (!cassetteId) {
    event.preventDefault();
    alertcassette.classList.remove("ocultar");
  } else {
    const response = await fetch(`/api/muestras/${muestraId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
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

  await fetch(`/api/muestras/${muestraId}/`, {
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

      muestra__observaciones.textContent = inputmodificarobservacionesMuestra.value;
      muestra__tincion.textContent = selectmodificartincionMuestra.value;

      // Mostramos las muestras para que se actulicen los cambios
      respuesta = await cargarMuestras(cassetteId);
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
        "d-inline-block cassette__icon fa-solid fa-eye cassette__icon--infocassette";
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
  const response = await fetch(`/api/muestras/${muestraid}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  return await response.json();
};

// Obtenemos las imagenes de una muestra
const obtenerImagenesMuestra = async (muestraid) => {
  const response = await fetch(`/api/imagenes/por_muestra/${muestraid}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
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

  // let newdiv = document.createElement("DIV");
  // newdiv.classList.add(
  //   "container__aniadir",
  //   "d-flex",
  //   "align-items-center",
  //   "mt-1",
  //   "mx-2",
  //   "blue__color",
  //   "fs-1"
  // );
  // newdiv.innerHTML = '<i class="fa-solid fa-circle-plus"></i>';
  // newdiv.title = "Añadir imagen";

  // muestra__img.appendChild(newdiv);
};

const borrarMuestra = async () => {
  try {
    const response = await fetch(`/api/muestras/${muestraId}/`, {
      method: "DELETE",
      headers: getHeaders('DELETE', false),
    });
    if (response.ok) {
      modaldetalleMuestra.classList.remove("showmodal");
      let muestras = await cargarMuestras(cassetteId);
      imprimirMuestras(muestras);
    } else {
      let err = null;
      try { err = await response.json(); } catch (e) { err = null; }
      console.error('Error borrando muestra', err || response.statusText || response.status);
      alert('Error borrando muestra: ' + (err ? JSON.stringify(err) : response.statusText || response.status));
    }
  } catch (error) {
    console.error(error);
  }

};

const borrarImagenMuestra = async () => {
  if (imageId != undefined) {
    try {
      const response = await fetch(`/api/imagenes/${imageId}/`, {
        method: "DELETE",
        headers: getHeaders('DELETE', false),
      });
      if (response.ok) {
        mostrarImagenesMuestra(muestraId);
      } else {
        console.error('Error borrando imagen', response.statusText || response.status);
      }
    } catch (e) {
      console.error(e);
    }
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
    value: buildResolverUrl(muestra.qr_muestra), // La URL o el texto
    size: QR_RENDER_SIZE,
    background: "#ffffff",
    backgroundAlpha: 1,
    foreground: "#000000",
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
      const response = await fetch("/api/imagenes/", {
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

const consultarCassetteQR = async (qr) => {
  const response = await fetch(`/api/cassettes/por_qr/${qr}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  let cassette = await response.json();

  // Mostrar los datos del cassette
  imprimirCasettes(cassette);
  // Obtenemos un array, pq nos viene bien para la consulta de cassettes que espera un array
  //Obtenemos el primero, aunque sólo nos devuelve uno, para la consulta de un cassette
  cassette = cassette[0];

  // Mostramos el detalle del cassette
  imprimirDataCassette(cassette);

  // Mostramos las muestras del cassette
  cassetteId = cassette.id_casette;
  let muestras = await cargarMuestras(cassetteId);
  imprimirMuestras(muestras);
};

const consultarMuestraQR = async (qr) => {
  // Obtengo la muestra para obtener el id del cassette
  let response = await fetch(`/api/muestras/por_qr/${qr}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let muestra = await response.json();
  if (Array.isArray(muestra)) {
    muestra = muestra[0];
  }
  // Obtengo el cassette de la muestra
  response = await fetch(`/api/cassettes/${muestra.cassette}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  // Mostramos el cassete de la muestra
  let cassette = await response.json();
  consultarCassetteQR(cassette.qr_casette);
  detailMuestra(muestra.id_muestra);
};

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

// Consulta Cassettes Recientes
document.addEventListener("DOMContentLoaded", async () => {
  body.style.display = "block";
  const respuesta = await cargarCassettesIndex();
  imprimirCasettes(respuesta);
  let fechaActual = new Date().toISOString().split("T")[0];
  // Para que no se pueda seleccionar una fecha anterior a la actual
  inputFecha.setAttribute("min", fechaActual);
  inputFechaUpdate.setAttribute("min", fechaActual);
  inputFechaMuestra.setAttribute("min", fechaActual);
});

// Consulta por Organo
organos.addEventListener("change", async () => {
  const respuesta = await cargarPorOrgano();
  imprimirCasettes(respuesta, false);
});

// Consulta por Número de Cassette
numCassette.addEventListener("change", async () => {
  let respuesta;
  if (numCassette.value === "*") {
    respuesta = await cargarTodosCassettes();
  } else {
    respuesta = await cargarPorNumero();
  }
  // Solicitud del usuario: filtrar la tabla pero NO el desplegable de arriba
  imprimirCasettes(respuesta, false);
});

// Consulta Detalle Cassete y Muestras
casettes.addEventListener("click", detalleCassette);

// Consulta por fecha
fechainicio.addEventListener("change", consultaFechaInicio);

fechafin.addEventListener("change", consultaFechaFin);

// Todos los cassettes
todosCassettes.addEventListener("click", async () => {
  const respuesta = await cargarTodosCassettes();
  imprimirCasettes(respuesta);
});

// Crear Cassette
btnformnuevocassette.addEventListener("click", () => {
  if (!modalnuevoCassette.classList.contains("showmodal")) {
    modalnuevoCassette.classList.add("showmodal");
    modalnuevoCassette.classList.remove("hidemodal");
  }
});

btnformcerrarnuevoCassette.addEventListener("click", () => {
  if (!modalnuevoCassette.classList.contains("hidemodal")) {
    modalnuevoCassette.classList.add("hidemodal");
    modalnuevoCassette.classList.remove("showmodal");
  }
});

nuevoCassette.addEventListener("submit", crearCassette);

// Modificar Cassette
btnformmodificarcassette.addEventListener("click", () => {
  if (!cassetteId) {
    alertcassette.classList.remove("ocultar");
  } else {
    cargarCassetteUpdateModal();
    if (!modalupdateCassette.classList.contains("showmodal")) {
      modalupdateCassette.classList.add("showmodal");
      modalupdateCassette.classList.remove("hidemodal");
    }
  }
});

btnformcerrarmodificarCassette.addEventListener("click", () => {
  if (!modalupdateCassette.classList.contains("hidemodal")) {
    modalupdateCassette.classList.add("hidemodal");
    modalupdateCassette.classList.remove("showmodal");
  }
});

modificarCassette.addEventListener("submit", modificarCassetteUpdate);

// Borrar un cassette
const borrarCassette = async () => {
  try {
    const response = await fetch(`/api/cassettes/${cassetteId}/`, {
      method: "DELETE",
      headers: getHeaders('DELETE', false),
    });
    if (response.ok) {
      location.href = "cassettes.html";
    } else {
      let err = null;
      try { err = await response.json(); } catch (e) { err = null; }
      console.error('Error borrando cassette', err || response.statusText || response.status);
      alert('Error borrando cassette: ' + (err ? JSON.stringify(err) : response.statusText || response.status));
    }
  } catch (e) {
    console.error(e);
    alert('Error borrando cassette');
  }
};
imagenCassetteModal.addEventListener("show.bs.modal", (event) => {
  // comprobamos si ha seleccionado un cassette
  if (!cassetteId) {
    event.preventDefault();
    alertcassette.classList.remove("ocultar");
  }
});

// mostrar modal qr muestra
qrMuestraModal.addEventListener("show.bs.modal", (event) => {
  inputmuestra__qr.style.display = "none";
  inputmuestra__qr.focus();
});

// mostrar modal qr cassette
qrCassetteModal.addEventListener("show.bs.modal", (event) => {
  // comprobamos si ha seleccionado un cassette
  if (!cassetteId) {
    event.preventDefault();
    alertcassette.classList.remove("ocultar");
    inputcassette__qr.focus();
  }
});

// Crear Muestra
btnformnuevaMuestra.addEventListener("click", () => {
  if (!cassetteId) {
    alertcassette.classList.remove("ocultar");
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
  if (!cassetteId) {
    alertcassette.classList.remove("ocultar");
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

const btnaniadirimagenmuestra = document.getElementById("btnaniadirimagenmuestra");
if (btnaniadirimagenmuestra) {
  btnaniadirimagenmuestra.addEventListener("click", aniadirImagenMuestra);
}

// Guardar solo el informe de resultados
const guardarInformeMedico = async () => {
  if (!currentCassetteId) {
    alert("Por favor, selecciona un cassette primero.");
    return;
  }

  const datosReporte = {
    informe_descripcion: cassetteInformeDescripcion.value,
    informe_fecha: cassetteInformeFecha.value,
    informe_tincion: cassetteInformeTincion.value,
    informe_observaciones: cassetteInformeObservaciones.value,
  };

  if (cassetteInformeImagen.files.length > 0) {
    const imgReader = new FileReader();
    imgReader.readAsDataURL(cassetteInformeImagen.files[0]);
    imgReader.onload = async function () {
      datosReporte.informe_imagen = imgReader.result; // base64 with data: prefix
      guardarDatosReporteCassette(datosReporte);
    };
    return;
  }
  guardarDatosReporteCassette(datosReporte);
};

const guardarDatosReporteCassette = async (datosReporte) => {
  try {
    const res = await fetch(`/api/cassettes/${currentCassetteId}/actualizar_informe/`, {
      method: "POST",
      headers: getHeaders('POST', false),
      body: JSON.stringify(datosReporte),
    });

    const data = await res.json();
    alert(data); // "Informe actualizado correctamente"
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
