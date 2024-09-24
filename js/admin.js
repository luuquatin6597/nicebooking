function formatCurrency(price) {
    return parseInt(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function discount(originalPrice, salePrice) {
  const discount = originalPrice - salePrice;
  const discountPercentage = (discount / originalPrice) * 100;
  return discountPercentage.toFixed(2);
}

function saveProducts(products) {
    localStorage.setItem('productData', JSON.stringify(products));
}

function getProducts() {
    return JSON.parse(localStorage.getItem('productData')) || [];
}

function checkUserAccount(){
    return JSON.parse(localStorage.getItem('authenticatedUser')) || []
}

// Lưu người dùng vào localStorage
function saveUsers(users) {
    localStorage.setItem('userData', JSON.stringify(users));
}

// Lấy danh sách người dùng từ localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('userData')) || [];
}

function logout(){
    const modal = document.getElementById('logoutModal')
    const submitButton = modal.querySelector('.submit-modal');

    if (modal && submitButton) {
        modal.addEventListener('show.bs.modal', function () {
            submitButton.addEventListener('click', function() {
                console.log(checkUserAccount())
                if (window.location.href.includes('admin')) {
                    localStorage.removeItem('authenticatedUser')
                    window.location.href = 'login.html'
                } else {
                    localStorage.removeItem('authenticatedUser')
                    window.location.reload();
                }
            });
        });

        var myModal = new bootstrap.Modal(modal);
        myModal.show();
    }
}

function sessionSaveCheckout(checkout) {
    sessionStorage.setItem('checkout', JSON.stringify(checkout));
}

function sessionGetCheckout() {
    return JSON.parse(sessionStorage.getItem('checkout')) || [];
}

function saveBooking(booking){
    localStorage.setItem('bookingData', JSON.stringify(booking));
}

function getBooking() {
    return JSON.parse(localStorage.getItem('bookingData')) || [];
}

document.addEventListener('DOMContentLoaded', function () {
    const userAccount = checkUserAccount()

    if(window.location.href.includes('admin')) {
        if(userAccount.length !== 0){
            if(userAccount.role === 'staff') {
                $('#currentUser').html(`
                    <a href="#" class="logged border border-primary rounded-pill bg-white text-decoration-none dropdown-toggle d-flex align-items-center justify-content-center"
                        id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
                        Hi, ${userAccount.fullName}
                    </a>
                    <ul class="dropdown-menu text-small" aria-labelledby="dropdownUser">
                        <li><a class="dropdown-item" href="#">Profile</a></li>
                        <li><a class="dropdown-item" href="#" onclick="logout()">Sign out</a></li>
                    </ul>
                `)
            } else {            
                window.location.href = 'homepage.html'
            }
        } else {
            window.location.href = 'login.html'
        }
    } else {
        if(userAccount.length !== 0){
            $('#currentUser').html(`
                <a href="#" class="logged border border-primary rounded-pill bg-white text-decoration-none dropdown-toggle d-flex align-items-center justify-content-center"
                    id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
                    Hi, ${userAccount.fullName}
                </a>
                <ul class="dropdown-menu text-small" aria-labelledby="dropdownUser">
                    <li><a class="dropdown-item" href="#">Profile</a></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">Sign out</a></li>
                </ul>
            `)
        } else {
            $('#currentUser').html(`
                <a href="login.html"
                    class="login border border-primary rounded-pill bg-white text-decoration-none d-flex align-items-center justify-content-center"
                    id="dropdownUser">
                    Login
                </a>
            `)
        }
    }
});

function showSpinner() {
    $('.category-spinner-bg, .category-spinner').show();
}

function hideSpinner() {
    setTimeout(() => {
        $('.category-spinner-bg, .category-spinner').hide();
    }, 500);
}

function createChartDailySales() {
    var dataPoints = [];
  
    var options = {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Daily Sales Data"
        },
        axisX: {
            valueFormatString: "DD MMM YYYY",
        },
        axisY: {
            title: "VNĐ",
            titleFontSize: 24
        },
        data: [{
            type: "spline",
            yValueFormatString: "###,###,### ₫",
            dataPoints: dataPoints
        }]
    };
  
    var getBookingData = getBooking();

    for (var i = 0; i < getBookingData.length; i++) {
        dataPoints.push({
            x: new Date(getBookingData[i].createTime),
            y: parseInt(getBookingData[i].price.total)
        })
    }
    if ($("#chartContainer") && $("#chartContainer").length > 0)
        $("#chartContainer").CanvasJSChart(options)
}

function createChartPie(){
    var getProductsData = getProducts()
    const roomCountByType = {
        'Double room': 0,
        'Family room': 0,
        'Queen room': 0,
        'Single room': 0,
        'Dorm': 0
    };

    for (const booking of getProductsData) {
        const roomType = booking.type;
        if (!roomCountByType[roomType]) {
            roomCountByType[roomType] = 0;
        }
        roomCountByType[roomType]++;
    }

    var options = {
        title: {
            text: "Room Type Total"
        },
        data: [{
                type: "pie",
                startAngle: 45,
                showInLegend: "true",
                legendText: "{label}",
                indexLabel: "{label} ({y})",
                yValueFormatString:"#,##0.#"%"",
                dataPoints: [
                    { label: "Single room", y: roomCountByType['Single room'] },
                    { label: "Double room", y: roomCountByType['Double room'] },
                    { label: "Queen room", y: roomCountByType['Queen room'] },
                    { label: "Family room", y: roomCountByType['Family room'] },
                    { label: "Dorm", y: roomCountByType['Dorm'] },
                ]
        }]
    };
    if ($("#chartPieContainer") && $("#chartPieContainer").length > 0)
        $("#chartPieContainer").CanvasJSChart(options);
}

document.addEventListener("DOMContentLoaded", () => {
    if($('#admin-page')) {
        createChartDailySales()
        createChartPie()
    }
});