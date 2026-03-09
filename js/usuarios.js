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
        fetch('modelo/tecnicos/tecnicos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                accion: 'listartecnicos'
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.exito) {
                    renderUsuarios(data.tecnicos);
                } else {
                    console.error(data.error);
                    alert("Error cargando usuarios: " + data.error);
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
            fetch('modelo/tecnicos/tecnicos.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accion: 'eliminartecnico',
                    id_tecnico: id
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.exito) {
                        cargarUsuarios();
                    } else {
                        alert('Error eliminando: ' + data.error);
                    }
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

        // Use identificador for register to satisfy the backend fallback logically
        const bodyContent = {
            accion: accion,
            centro: inputCentro.value,
            rol: inputRol.value,
            password: inputPassword.value
        };

        if (accion === 'modificartecnico') {
            bodyContent.id_tecnico = inputIdUsuario.value;
        }

        fetch('modelo/tecnicos/tecnicos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyContent)
        })
            .then(res => res.json())
            .then(data => {
                if (data.exito || data.user) {
                    // Success
                    modalUsuarioObj.hide();
                    cargarUsuarios();

                    if (accion === 'registro') {
                        alert(`El nuevo técnico se ha creado exitosamente con el ID: ${data.id_tecnico}\nApunte este ID para iniciar sesión.`);
                    }
                } else {
                    errorFormUsuario.textContent = data.error || "Ocurrió un error inesperado";
                    errorFormUsuario.classList.remove('d-none');
                }
            })
            .catch(err => console.error(err));

    });

    // Iniciar
    cargarUsuarios();
});
