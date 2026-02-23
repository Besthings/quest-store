document.addEventListener("DOMContentLoaded", function () {

    const passwordInput = document.getElementById("regPassword");
    const registerBtn = document.getElementById("registerBtnSubmit");

    const lengthEl = document.getElementById("length");
    const upperEl = document.getElementById("uppercase");
    const lowerEl = document.getElementById("lowercase");
    const numberEl = document.getElementById("number");

    if (!passwordInput) return;

    passwordInput.addEventListener("keyup", validatePassword);

    function validatePassword() {
        let password = passwordInput.value;

        let lengthCheck = password.length >= 8;
        let upperCheck = /[A-Z]/.test(password);
        let lowerCheck = /[a-z]/.test(password);
        let numberCheck = /[0-9]/.test(password);

        updateStatus(lengthEl, lengthCheck);
        updateStatus(upperEl, upperCheck);
        updateStatus(lowerEl, lowerCheck);
        updateStatus(numberEl, numberCheck);

        if (lengthCheck && upperCheck && lowerCheck && numberCheck) {
            registerBtn.disabled = false;
            registerBtn.classList.remove("bg-purple-400", "cursor-not-allowed");
            registerBtn.classList.add("bg-purple-600", "hover:bg-purple-700");
        } else {
            registerBtn.disabled = true;
            registerBtn.classList.add("bg-purple-400", "cursor-not-allowed");
            registerBtn.classList.remove("bg-purple-600", "hover:bg-purple-700");
        }
    }

    function updateStatus(element, condition) {
        if (condition) {
            element.classList.remove("text-red-500");
            element.classList.add("text-green-500");
        } else {
            element.classList.add("text-red-500");
            element.classList.remove("text-green-500");
        }
    }

});