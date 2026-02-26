// ===== Login API =====
async function loginUser(email, password) {
    try {
        const response = await axios.post('/api/users/login', {
            email: email,
            password: password
        });

        // ถ้ามี token ให้เก็บและไป dashboard ทันที
        if (response.status === 200 && response.data && response.data.token) {
            console.log('✅ Login successful');
            // เก็บ token ใน cookie (ระยะเวลา 1 วัน)
            document.cookie = "token=" + response.data.token + "; path=/; max-age=86400";
            // รีไดเรกต์ไปหน้า dashboard ทันที
            window.location.assign('/dashboard');
            return;
        }

        // ถ้าไม่มี token ให้แสดงข้อความผิดพลาดถ้ามี
        const msg = (response.data && response.data.message) ? response.data.message : 'Login failed';
        console.warn('❌ Login failed:', msg);
        alert('❌ ' + msg);
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error: ' + (error.response?.data?.message || error.message));
    }
}

// ===== Register API =====
async function registerUser(username, email, password) {
    try {
        const response = await axios.post('/api/users/register', {
            username: username,
            email: email,
            password: password
        });

        if (response.data.success) {
            console.log('✅ Register successful');
            alert('Registration successful! Please login.');
            // เปลี่ยนไปหน้า Login
            document.getElementById('loginBtn').click();
            // Clear form
            document.getElementById('registerForm').reset();
        } else {
            alert('❌ Register failed: ' + response.data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error: ' + (error.response?.data?.message || error.message));
    }
}
