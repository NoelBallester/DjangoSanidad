// API Helper para Django REST Framework
// Mapea las funciones del sistema PHP a las APIs de Django

const API_BASE = '/api';

// ==================== CASSETTES ====================

export const cassettesAPI = {
  // Cargar últimos 10 cassettes
  index: async () => {
    const response = await fetch(`${API_BASE}/cassettes/index/`);
    return response.json();
  },

  // Cargar todos los cassettes
  todos: async () => {
    const response = await fetch(`${API_BASE}/cassettes/todos/`);
    return response.json();
  },

  // Crear nuevo cassette
  crear: async (data) => {
    const response = await fetch(`${API_BASE}/cassettes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Obtener cassette por ID
  obtener: async (id) => {
    const response = await fetch(`${API_BASE}/cassettes/${id}/`);
    return response.json();
  },

  // Actualizar cassette
  actualizar: async (id, data) => {
    const response = await fetch(`${API_BASE}/cassettes/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Eliminar cassette
  eliminar: async (id) => {
    const response = await fetch(`${API_BASE}/cassettes/${id}/`, {
      method: 'DELETE'
    });
    return response.ok;
  },

  // Buscar por órgano
  porOrgano: async (organo) => {
    const response = await fetch(`${API_BASE}/cassettes/por_organo/${organo}/`);
    return response.json();
  },

  // Buscar por número
  porNumero: async (numero) => {
    const response = await fetch(`${API_BASE}/cassettes/por_numero/${numero}/`);
    return response.json();
  },

  // Buscar por fecha específica
  porFecha: async (fecha) => {
    const response = await fetch(`${API_BASE}/cassettes/por_fecha/${fecha}/`);
    return response.json();
  },

  // Buscar por rango de fechas
  porRangoFechas: async (inicio, fin) => {
    const response = await fetch(`${API_BASE}/cassettes/rango_fechas/?inicio=${inicio}&fin=${fin}`);
    return response.json();
  },

  // Buscar por QR
  porQR: async (qr) => {
    const response = await fetch(`${API_BASE}/cassettes/por_qr/${qr}/`);
    return response.json();
  },

  // Actualizar informe médico
  actualizarInforme: async (id, data) => {
    const response = await fetch(`${API_BASE}/cassettes/${id}/actualizar_informe/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

// ==================== CITOLOGIAS ====================

export const citologiasAPI = {
  // Cargar últimas 10 citologías
  index: async () => {
    const response = await fetch(`${API_BASE}/citologias/index/`);
    return response.json();
  },

  // Cargar todas las citologías
  todos: async () => {
    const response = await fetch(`${API_BASE}/citologias/todos/`);
    return response.json();
  },

  // Crear nueva citología
  crear: async (data) => {
    const response = await fetch(`${API_BASE}/citologias/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Obtener citología por ID
  obtener: async (id) => {
    const response = await fetch(`${API_BASE}/citologias/${id}/`);
    return response.json();
  },

  // Actualizar citología
  actualizar: async (id, data) => {
    const response = await fetch(`${API_BASE}/citologias/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Eliminar citología
  eliminar: async (id) => {
    const response = await fetch(`${API_BASE}/citologias/${id}/`, {
      method: 'DELETE'
    });
    return response.ok;
  },

  // Buscar por órgano
  porOrgano: async (organo) => {
    const response = await fetch(`${API_BASE}/citologias/por_organo/${organo}/`);
    return response.json();
  },

  // Buscar por número
  porNumero: async (numero) => {
    const response = await fetch(`${API_BASE}/citologias/por_numero/${numero}/`);
    return response.json();
  },

  // Buscar por fecha específica
  porFecha: async (fecha) => {
    const response = await fetch(`${API_BASE}/citologias/por_fecha/${fecha}/`);
    return response.json();
  },

  // Buscar por rango de fechas
  porRangoFechas: async (inicio, fin) => {
    const response = await fetch(`${API_BASE}/citologias/rango_fechas/?inicio=${inicio}&fin=${fin}`);
    return response.json();
  },

  // Buscar por QR
  porQR: async (qr) => {
    const response = await fetch(`${API_BASE}/citologias/por_qr/${qr}/`);
    return response.json();
  },

  // Actualizar informe médico
  actualizarInforme: async (id, data) => {
    const response = await fetch(`${API_BASE}/citologias/${id}/actualizar_informe/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

// ==================== MUESTRAS (CASSETTES) ====================

export const muestrasAPI = {
  // Crear muestra
  crear: async (data) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    const response = await fetch(`${API_BASE}/muestras/`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },

  // Obtener muestra por ID
  obtener: async (id) => {
    const response = await fetch(`${API_BASE}/muestras/${id}/`);
    return response.json();
  },

  // Actualizar muestra
  actualizar: async (id, data) => {
    const response = await fetch(`${API_BASE}/muestras/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Eliminar muestra
  eliminar: async (id) => {
    const response = await fetch(`${API_BASE}/muestras/${id}/`, {
      method: 'DELETE'
    });
    return response.ok;
  },

  // Obtener muestras por cassette
  porCassette: async (cassetteId) => {
    const response = await fetch(`${API_BASE}/muestras/por_cassette/${cassetteId}/`);
    return response.json();
  },

  // Buscar por QR
  porQR: async (qr) => {
    const response = await fetch(`${API_BASE}/muestras/por_qr/${qr}/`);
    return response.json();
  }
};

// ==================== MUESTRAS CITOLOGIA ====================

export const muestrasCitologiaAPI = {
  // Crear muestra
  crear: async (data) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    const response = await fetch(`${API_BASE}/muestrascitologia/`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },

  // Obtener muestra por ID
  obtener: async (id) => {
    const response = await fetch(`${API_BASE}/muestrascitologia/${id}/`);
    return response.json();
  },

  // Actualizar muestra
  actualizar: async (id, data) => {
    const response = await fetch(`${API_BASE}/muestrascitologia/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Eliminar muestra
  eliminar: async (id) => {
    const response = await fetch(`${API_BASE}/muestrascitologia/${id}/`, {
      method: 'DELETE'
    });
    return response.ok;
  },

  // Obtener muestras por citología
  porCitologia: async (citologiaId) => {
    const response = await fetch(`${API_BASE}/muestrascitologia/por_citologia/${citologiaId}/`);
    return response.json();
  },

  // Buscar por QR
  porQR: async (qr) => {
    const response = await fetch(`${API_BASE}/muestrascitologia/por_qr/${qr}/`);
    return response.json();
  }
};

// ==================== IMÁGENES ====================

export const imagenesAPI = {
  // Crear imagen
  crear: async (data) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    const response = await fetch(`${API_BASE}/imagenes/`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },

  // Eliminar imagen
  eliminar: async (id) => {
    const response = await fetch(`${API_BASE}/imagenes/${id}/`, {
      method: 'DELETE'
    });
    return response.ok;
  },

  // Obtener imágenes por muestra
  porMuestra: async (muestraId) => {
    const response = await fetch(`${API_BASE}/imagenes/por_muestra/${muestraId}/`);
    return response.json();
  }
};

// ==================== IMÁGENES CITOLOGÍA ====================

export const imagenesCitologiaAPI = {
  // Crear imagen
  crear: async (data) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    const response = await fetch(`${API_BASE}/imagenescitologia/`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },

  // Eliminar imagen
  eliminar: async (id) => {
    const response = await fetch(`${API_BASE}/imagenescitologia/${id}/`, {
      method: 'DELETE'
    });
    return response.ok;
  },

  // Obtener imágenes por muestra
  porMuestra: async (muestraId) => {
    const response = await fetch(`${API_BASE}/imagenescitologia/por_muestra/${muestraId}/`);
    return response.json();
  }
};
