document.addEventListener("DOMContentLoaded", function () {

    // ===== Toggle Login / Register =====
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (registerBtn) {
        registerBtn.addEventListener("click", function () {
            registerForm.classList.remove("hidden");
            loginForm.classList.add("hidden");

            registerBtn.classList.add("border-indigo-600","text-indigo-600");
            loginBtn.classList.remove("border-indigo-600","text-indigo-600");
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            loginForm.classList.remove("hidden");
            registerForm.classList.add("hidden");

            loginBtn.classList.add("border-indigo-600","text-indigo-600");
            registerBtn.classList.remove("border-indigo-600","text-indigo-600");
        });
    }

    // ===== Password Validation =====
    const passwordInput = document.getElementById("regPassword");
    const lengthEl = document.getElementById("length");
    const upperEl = document.getElementById("uppercase");
    const lowerEl = document.getElementById("lowercase");
    const numberEl = document.getElementById("number");
    const registerSubmitBtn = document.getElementById("registerBtnSubmit");

    if (!registerForm || !passwordInput) return;

    let passwordTouched = false;

    // แสดง validation เมื่อผู้ใช้ blur ออกจากฟิลด์
    passwordInput.addEventListener("blur", function () {
        passwordTouched = true;
        validatePassword();
    });

    // อัปเดต validation แบบ real-time หลังจากที่ touched แล้ว
    passwordInput.addEventListener("input", function () {
        if (passwordTouched) {
            validatePassword();
        }
    });

    function validatePassword() {
        let password = passwordInput.value;

        let lengthCheck = password.length >= 8;
        let upperCheck = /[A-Z]/.test(password);
        let lowerCheck = /[a-z]/.test(password);
        let numberCheck = /[0-9]/.test(password);

        showRule(lengthEl, lengthCheck);
        showRule(upperEl, upperCheck);
        showRule(lowerEl, lowerCheck);
        showRule(numberEl, numberCheck);

        let isValid = lengthCheck && upperCheck && lowerCheck && numberCheck;
        
        // Enable/disable ปุ่ม Register ตามความถูกต้องของ password
        if (registerSubmitBtn) {
            if (isValid) {
                registerSubmitBtn.disabled = false;
                registerSubmitBtn.classList.remove("bg-purple-400", "cursor-not-allowed");
                registerSubmitBtn.classList.add("bg-purple-600", "hover:bg-purple-700");
            } else {
                registerSubmitBtn.disabled = true;
                registerSubmitBtn.classList.add("bg-purple-400", "cursor-not-allowed");
                registerSubmitBtn.classList.remove("bg-purple-600", "hover:bg-purple-700");
            }
        }

        return isValid;
    }

    registerForm.addEventListener("submit", function (e) {
        passwordTouched = true;
        
        if (!validatePassword()) {
            e.preventDefault();
        }
    });

    function showRule(element, condition) {
        element.classList.remove("hidden");

        if (condition) {
            element.classList.remove("text-red-500");
            element.classList.add("text-green-500");
        } else {
            element.classList.add("text-red-500");
            element.classList.remove("text-green-500");
        }
    }

});