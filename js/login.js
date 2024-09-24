// Hiển thị form đăng ký khi nhấn vào "Register now" 
document.getElementById('showRegister').addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định (chuyển hướng)
    document.getElementById('loginContainer').style.display = 'none'; // Ẩn form đăng nhập
    document.getElementById('registerContainer').style.display = 'block'; // Hiển thị form đăng ký
});

// Quay lại form đăng nhập từ form đăng ký
document.getElementById('backToLogin').addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định
    document.getElementById('registerContainer').style.display = 'none'; // Ẩn form đăng ký
    document.getElementById('loginContainer').style.display = 'block'; // Hiển thị form đăng nhập
});

// Xử lý đăng ký
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullname').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const gender = document.querySelector('input[name="gender"]:checked').name == 'genderMale' ? 'Male' : 'Female';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
    } else {
        let storedUserData = JSON.parse(localStorage.getItem('userData')) || [];

        const userExists = storedUserData.some(user => user.email === email);
        if (userExists) {
            alert('Email already exists!');
        } else {
            const newUser = {
                fullName: fullName,
                dateOfBirth: dateOfBirth,
                gender: gender,
                email: email,
                password: password,
                phone: phone,
                address: address,
                role: 'client', // Mặc định vai trò là 'client'
                createDate: new Date().toISOString().slice(0, 10),
                status: true
            };

            storedUserData.push(newUser);
            localStorage.setItem('userData', JSON.stringify(storedUserData));

            alert('Đăng Ký Thành Công!');

            // Chuyển tới trang đăng nhập sau khi đăng ký thành công
            window.location.href = 'login.html';  
        }
    }
});


document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const loginUsername = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    const storedUserData = JSON.parse(localStorage.getItem('userData')) || [];

    const validUser = storedUserData.find(user => user.email === loginUsername && user.password === loginPassword);

    if (validUser) {
        localStorage.setItem('authenticatedUser', JSON.stringify(validUser));
        alert('Đăng nhập thành công!');
        if(validUser.role === 'client') {
            window.location.href = 'homepage.html';
        } else {
            window.location.href = 'admin.html';
        }
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
});