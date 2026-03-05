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
            registerBtn.style.borderBottomColor = "#4f46e5";
            loginBtn.classList.remove("border-indigo-600","text-indigo-600");
            loginBtn.style.borderBottomColor = "transparent";
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            loginForm.classList.remove("hidden");
            registerForm.classList.add("hidden");

            loginBtn.classList.add("border-indigo-600","text-indigo-600");
            loginBtn.style.borderBottomColor = "#4f46e5";
            registerBtn.classList.remove("border-indigo-600","text-indigo-600");
            registerBtn.style.borderBottomColor = "transparent";
        });
    }

    // ===== Form Submit Handlers =====
    // Login Form Submit
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = this.querySelector('input[name="email"]').value;
            const password = this.querySelector('input[name="password"]').value;
            
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            loginUser(email, password);
        });
    }

    // Register Form Submit
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const username = this.querySelector('input[name="username"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const password = this.querySelector('input[name="password"]').value;
            
            if (!username || !email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            registerUser(username, email, password);
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

    // เช็ค real-time เมื่อพิมพ์
    passwordInput.addEventListener("input", function () {
        passwordTouched = true;
        validatePassword();
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
                registerSubmitBtn.classList.remove("bg-indigo-600", "cursor-not-allowed");
                registerSubmitBtn.classList.add("bg-indigo-700", "hover:bg-indigo-700");
            } else {
                registerSubmitBtn.disabled = true;
                registerSubmitBtn.classList.add("bg-indigo-600", "cursor-not-allowed");
                registerSubmitBtn.classList.remove("bg-indigo-700", "hover:bg-indigo-700");
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
        if (condition) {
            // ถูกแล้ว ให้ซ่อน
            element.classList.add("hidden");
        } else {
            // ยังผิด ให้แสดงเป็นแดง
            element.classList.remove("hidden");
            element.classList.add("text-red-500");
            element.classList.remove("text-green-500");
        }
    }

    // ===== Password Visibility Toggle =====
    function togglePasswordVisibility(fieldId, imgElement) {
        const field = document.getElementById(fieldId);
        if (field.type === 'password') {
            field.type = 'text';
        } else {
            field.type = 'password';
        }
    }
    
    // Make function globally accessible
    window.togglePasswordVisibility = togglePasswordVisibility;

});