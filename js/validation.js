let errorname = document.getElementById("errorname");
let errorlastname = document.getElementById("errorlastname");
let erroremail = document.getElementById("erroremail");
let errorcenter = document.getElementById("errorcenter");
let errorcourse = document.getElementById("errorcourse");
let errorpassword = document.getElementById("errorpassword");
let errorrepeatpassword = document.getElementById("errorrepeatpassword");

let form = document.getElementById("form");

const validation = (event) => {
    event.preventDefault();

    errorname.textContent = ""
    errorlastname.textContent = ""
    erroremail.textContent = ""
    errorcenter.textContent = ""
    errorcourse.textContent = ""
    errorpassword.textContent = ""
    errorrepeatpassword.textContent = ""


    let valido = true;

    if (inputName.validity.valueMissing) {
        errorname.textContent = "El campo es requerido";

        valido = false;
    }

    if (inputLastNames.validity.valueMissing) {
        errorlastname.textContent = "El campo es requerido";

        valido = false;
    }

    if (inputEmail.validity.valueMissing) {
        erroremail.textContent = "El campo es requerido";

        valido = false;
    }

    if (inputCenter.validity.valueMissing) {
        errorcenter.textContent = "El campo es requerido";

        valido = false;
    }

    if (inputCourse.validity.valueMissing) {
        errorcourse.textContent = "El campo es requerido";

        valido = false;
    }

    if (inputPassword.validity.valueMissing) {
        errorpassword.textContent = "El campo es requerido";

        valido = false;
    }

    if (inputRepeatPassword.validity.valueMissing) {
        errorrepeatpassword.textContent = "El campo es requerido";

        valido = false;
    }

    if (valido && inputRepeatPassword.value != inputPassword.value) {
        errorrepeatpassword.textContent = "Las contraseñas no coinciden";

        valido = false;
    }

    if (valido) {
        processForm();
    }
};

form.addEventListener("submit", validation);