document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userRole = sessionStorage.getItem('rol');

    if (isLoggedIn !== 'true') {
        window.location.href = './registro.html';
        return;
    }

    if (userRole !== 'admin') {
        // Not authorized, redirect back to index
        window.location.href = './index.html';
        return;
    }

    // Show navbar users link since we are admin
    document.getElementById('nav-usuarios-container').style.display = 'block';

    const tablaUsuarios = document.getElementById('tablaUsuarios');
    const formUsuario = document.getElementById('formUsuario');
    const modalUsuarioLabel = document.getElementById('modalUsuarioLabel');
    const modalUsuarioObj = new bootstrap.Modal(document.getElementById('modalUsuario'));
    const btnNuevoUsuario = document.getElementById('btnNuevoUsuario');
    const errorFormUsuario = document.getElementById('errorFormUsuario');
    const passwordHelp = document.getElementById('passwordHelp');

    const inputIdUsuario = document.getElementById('inputIdUsuario');
    const inputCentro = document.getElementById('inputCentro');
    const inputRol = document.getElementById('inputRol');
    const inputPassword = document.getElementById('inputPassword');

    // Cargar Usuarios
    const cargarUsuarios = () => {
        fetch('/api/tecnicos/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                // Soportar tanto respuesta paginada como lista simple
                const usuarios = data.results || data.technicos || data || [];
                if (Array.isArray(usuarios)) {
                    renderUsuarios(usuarios);
                } else {
                    console.error("Formato de datos inesperado:", data);
                }
            })
            .catch(err => console.error(err));
    };

    const renderUsuarios = (usuarios) => {
        tablaUsuarios.innerHTML = '';
        usuarios.forEach(user => {
            const tr = document.createElement('tr');

            let rolBadge = '';
            if (user.rol === 'admin') rolBadge = '<span class="badge" style="background-color: var(--accent-secondary);">Administrador</span>';
            else if (user.rol === 'patologia') rolBadge = '<span class="badge" style="background-color: var(--title-color);">Patología</span>';
            else if (user.rol === 'laboratorio') rolBadge = '<span class="badge" style="background-color: var(--accent-color);">Laboratorio</span>';

            tr.innerHTML = `
                <td>${user.id_tecnico}</td>
                <td>${user.centro}</td>
                <td>${rolBadge}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary border__color me-2" onclick="editarUsuario(${user.id_tecnico}, '${user.centro}', '${user.rol}')" title="Editar Técnico">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    ${user.id_tecnico !== sessionStorage.getItem('userId') ? `
                    <button class="btn btn-sm btn-outline-danger" onclick="borrarUsuario(${user.id_tecnico})" title="Eliminar Técnico">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                    ` : ''}
                </td>
            `;
            tablaUsuarios.appendChild(tr);
        });
    };

    // Global Functions for buttons
    window.editarUsuario = (id, centro, rol) => {
        modalUsuarioLabel.textContent = 'Editar Técnico (ID: ' + id + ')';
        inputIdUsuario.value = id;
        inputCentro.value = centro;
        inputRol.value = rol;
        inputPassword.value = '';
        inputPassword.required = false;
        passwordHelp.textContent = '(Dejar en blanco para no cambiar)';
        errorFormUsuario.classList.add('d-none');
        modalUsuarioObj.show();
    };

    window.borrarUsuario = (id) => {
        if (confirm(`¿Estás seguro de que quieres eliminar al técnico con ID ${id}? Toda su información asociada se perderá.`)) {
            fetch('/api/tecnicos/' + id + '/', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(res => res.json())
                .then(data => {
                    cargarUsuarios();
                })
                .catch(err => console.error(err));
        }
    };

    btnNuevoUsuario.addEventListener('click', () => {
        formUsuario.reset();
        inputIdUsuario.value = '';
        modalUsuarioLabel.textContent = 'Nuevo Técnico';
        inputPassword.required = true;
        passwordHelp.textContent = '(Obligatorio para nuevos)';
        errorFormUsuario.classList.add('d-none');
    });

    formUsuario.addEventListener('submit', (e) => {
        e.preventDefault();

        const accion = inputIdUsuario.value ? 'modificartecnico' : 'registro';
        const isCreate = !inputIdUsuario.value;
        
        const requestData = {
            centro: inputCentro.value,
            rol: inputRol.value
        };
        
        if (inputPassword.value) {
            requestData.password = inputPassword.value;
        }

        const url = isCreate ? '/api/tecnicos/' : '/api/tecnicos/' + inputIdUsuario.value + '/';
        const method = isCreate ? 'POST' : 'PUT';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        })
            .then(res => {
                if (!res.ok) throw new Error('Error en la respuesta');
                return res.json();
            })
            .then(data => {
                modalUsuarioObj.hide();
                cargarUsuarios();

                if (isCreate) {
                    alert(`El nuevo técnico se ha creado exitosamente con el ID: ${data.id_tecnico}\nApunte este ID para iniciar sesión.`);
                }
            })
            .catch(err => {
                console.error(err);
                errorFormUsuario.textContent = "Ocurrió un error procesando la solicitud";
                errorFormUsuario.classList.remove('d-none');
            });

    });

    // Iniciar
    cargarUsuarios();
});
