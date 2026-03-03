// Datos registro
const form_container = document.getElementById("form_container");
const form_password = document.getElementById("form_password");
const form_sendpassword = document.getElementById("form_sendpassword");

const form_register = document.getElementById("form_register");
const btn_register = document.getElementById("btn_register");

const input_name = document.getElementById("input_name");
const input_lastname = document.getElementById("input_lastname");
const input_center = document.getElementById("input_center");
const input_course = document.getElementById("input_course");
const input_id = document.getElementById("input_id");
const input_password = document.getElementById("input_password");
const input_password2 = document.getElementById("input_password2");
const register__error = document.getElementById("register__error");
const email__error = document.getElementById("email__error");

// Datos login
const login = document.getElementById("login");
const form_login = document.getElementById("form_login");
const btn_login = document.getElementById("btn_login");
const inputlogin_id = document.getElementById("inputlogin_id");
const inputlogin_password = document.getElementById("inputlogin_password");
const login__error = document.getElementById("login__error");

// Datos Password
const forgot_password = document.getElementById("forgot_password");

// Datos email
const inputpassword_id = document.getElementById("inputpassword_id");

// Login
const userLogin = (event) => {
  event.preventDefault();

  fetch("modelo/tecnicos/tecnicos.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      accion: "login",
      identificador: inputlogin_id.value,
      password: inputlogin_password.value,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.error) {
        login__error.textContent = response.error;
        login__error.style.display = "block";
      } else {
        // Store session data
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userId", response['user.id_tecnico']);
        sessionStorage.setItem("rol", response.rol);

        form_login.reset();
        window.location.href = "./index.html";
      }
    })
    .catch((error) => console.log(error));
};

// Register
const userRegister = (event) => {
  event.preventDefault();
  if (input_password.value !== input_password2.value) {
    register__error.textContent = "Las contraseñas no son iguales";
    register__error.style.display = "block";
  } else {
    fetch("modelo/tecnicos/tecnicos.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accion: "registro",

        nombre: input_name.value,
        apellidos: input_lastname.value,
        centro: input_center.value,
        password: input_password.value,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.user) {
          form_register.reset();
          register__error.textContent = "¡Registro exitoso! Tu identificador es: " + response.id_tecnico;
          register__error.classList.add('success-msg');
          register__error.style.display = "block";

          // Opcional: Redirigir al login tras unos segundos
          setTimeout(() => {
            forms.classList.remove("show-signup");
            register__error.style.display = "none";
            register__error.classList.remove('success-msg');
          }, 8000);
        } else {
          register__error.classList.remove('success-msg');
          register__error.textContent = response.error;
          register__error.style.display = "block";
          register__error.style.color = ""; // Limpiar cualquier color inline previo
        }
      })
      .catch((error) => console.log("Esto falla " + error));
  }
};

// Enviar nueva Contraseña
const getNewPassword = (event) => {
  event.preventDefault();

  fetch("modelo/tecnicos/tecnicos.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accion: "solicitacontrasena",
      identificador: inputpassword_id.value,
    }),
  }) //  Aqui acaba el fetch
    .then((response) => response.json())
    .then((response) => {
      console.log("response" + response);
    })
    .catch((error) => console.log(error));
};

form_login.addEventListener("submit", userLogin);
form_register.addEventListener("submit", userRegister);
form_sendpassword.addEventListener("submit", getNewPassword);

form_container.addEventListener("click", (event) => {
  if (event.target.tagName === "INPUT") {
    login__error.style.display = "none";
    register__error.style.display = "none";
  }
});
inputpassword_id.addEventListener("click", () => {
  email__error.style.display = "none";
});

// ----------------------------------------------------
// Controles del formulario.
// ----------------------------------------------------

const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");

pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    let pwFields =
      eyeIcon.parentElement.parentElement.querySelectorAll(".password");

    pwFields.forEach((password) => {
      if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("bx-hide", "bx-show");
        return;
      }
      password.type = "password";
      eyeIcon.classList.replace("bx-show", "bx-hide");
    });
  });
});

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    forms.classList.toggle("show-signup");
  });
});

forgot_password.addEventListener("click", () => {
  login.style.display = "none";
  form_password.style.display = "block";
});
