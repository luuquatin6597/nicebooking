document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordSection = document.getElementById('forgotPasswordSection');
    const otpSection = document.getElementById('otpSection');
    const changePasswordSection = document.getElementById('changePasswordSection');
    
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const otpForm = document.getElementById('otpForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    const forgotPasswordMessage = document.getElementById('forgotPasswordMessage');
    const otpMessage = document.getElementById('otpMessage');
    const changePasswordMessage = document.getElementById('changePasswordMessage');

    let userEmail;

    forgotPasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const storedUserData = JSON.parse(localStorage.getItem('userData'));

        const filter = storedUserData.filter((item) => item.email === email);
        
        if (filter.length > 0) {
            const authCode = 123456;  
            localStorage.setItem('authCode', authCode);

            userEmail = email;

            forgotPasswordSection.style.display = 'none';
            otpSection.style.display = 'block'; 

            forgotPasswordMessage.textContent = 'Mã OTP đã được gửi đến email của bạn.';
            forgotPasswordMessage.style.color = 'green';
        } else {
            forgotPasswordMessage.textContent = 'Vui lòng nhập lại địa chỉ email.';
            forgotPasswordMessage.style.color = 'red';
        }
    });

    otpForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const enteredOtp = document.getElementById('otp').value;
        const storedOtp = localStorage.getItem('authCode');
        
        if (enteredOtp === storedOtp) {
            otpMessage.textContent = 'Mã OTP hợp lệ.';
            otpMessage.style.color = 'green';

            otpSection.style.display = 'none';
            changePasswordSection.style.display = 'block';
        } else {
            otpMessage.textContent = 'Mã OTP không hợp lệ. Vui lòng thử lại.';
            otpMessage.style.color = 'red';
        }
    });

    changePasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            changePasswordMessage.textContent = 'Mật khẩu mới và xác nhận mật khẩu không khớp.';
            changePasswordMessage.style.color = 'red';
        } else if (newPassword.length < 6) {
            changePasswordMessage.textContent = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
            changePasswordMessage.style.color = 'red';
        } else {
        
            const storedUserData = JSON.parse(localStorage.getItem('userData'));
            
            const updatedUserData = storedUserData.map(user => {
                if (user.email === userEmail) {
                    return { ...user, password: newPassword }; 
                }
                return user;
            });

            localStorage.setItem('userData', JSON.stringify(updatedUserData));

            localStorage.removeItem('authCode');
            
            changePasswordMessage.textContent = 'Mật khẩu đã được đổi thành công.';
            changePasswordMessage.style.color = 'green';

            window.location.href = 'login.html';
        }
    });
});