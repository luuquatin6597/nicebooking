document.addEventListener('DOMContentLoaded', function () {
    var getCurrentBooking = JSON.parse(sessionStorage.getItem('currentBooking'));

    if (typeof getCurrentBooking === 'object') {
        var getProductData = getProducts();
        var filterProduct = getProductData.filter((product, index) => index === parseInt(getCurrentBooking.hotelId))[0];

        var productImg = filterProduct.image.split(',')[0]; // Lấy hình ảnh đầu tiên
        $('.book-infor img').attr('src', productImg);
        $('.hotel-name h1').text(filterProduct.title); // Hiển thị tiêu đề
        $('.maximum .people').text(`People: ${filterProduct.maxPeople}`); // Hiển thị số giường tối đa
        $('.maximum .bed').text(`Bed: ${filterProduct.maxBed}`); // Hiển thị số người tối đa
        $('.maximum .bathroom').text(`Bathroom: ${filterProduct.maxBathroom}`); // Hiển thị số phòng tắm tối đa
        
        $('.hotel-info .address span').text(filterProduct.address); // Hiện thị dia chi
        $('.hotel-info .map').html(filterProduct.map); // Hiện thị dia chi

        var getBookingData = getBooking();
        var filterBooking = getBookingData.filter((booking, index) => getCurrentBooking.createTime && booking.createTime)[0];
        console.log(filterBooking)

        var searchNumber = getBookingData.indexOf(filterBooking); // Gán searchNumber từ filterBooking
        displayBookingInfo(searchNumber);
        $('.blank-content').hide()
        $('.book-infor').show()
    }

    // Function to display hotel information
    function displayBookingInfo(index) {
        const dataBooking = JSON.parse(localStorage.getItem('bookingData')); // Lấy dữ liệu từ local storage
        if (dataBooking && dataBooking[index]) {
            const booking = dataBooking[index];

            // Update form fields with data from the object
            document.getElementById('email').value = booking.email || ''; // Cung cấp giá trị mặc định nếu không có
            document.getElementById('fullName').value = booking.fullName || '';
            document.getElementById('phone').value = booking.phone || '';
            $('.startDate').text('Start: ' + booking.dateStart)
            $('.endDate').text('End: ' + booking.dateEnd)
        } else {
            alert('Booking data not found');
        }
    }

    // Event listener for the search button
    $('.search-form').on('submit', function (event) {
        event.preventDefault(); // Ngăn không reload trang
        const dataBooking = JSON.parse(localStorage.getItem('bookingData')); // Lấy dữ liệu từ local storage
        const searchNumber = parseInt($('.search-input')[0].value);
        var getProductData = getProducts();
        var filterProduct = getProductData.filter((product, index) => index === searchNumber)[0];

        if (filterProduct) {
            var productImg = filterProduct.image.split(',')[0]; // Lấy hình ảnh đầu tiên
            $('.book-infor img').attr('src', productImg);
            $('.hotel-name h1').text(filterProduct.title); // Hiển thị tiêu đề
            $('.maximum .people').text(`People: ${filterProduct.maxPeople}`); // Hiển thị số giường tối đa
            $('.maximum .bed').text(`Bed: ${filterProduct.maxBed}`); // Hiển thị số người tối đa
            $('.maximum .bathroom').text(`Bathroom: ${filterProduct.maxBathroom}`); // Hiển thị số phòng tắm tối đa
            
            $('.hotel-info .address span').text(filterProduct.address); // Hiện thị dia chi
            $('.hotel-info .map').html(filterProduct.map); // Hiện thị dia chi

            displayBookingInfo(searchNumber);
            $('.blank-content').hide()
            $('.book-infor').show()
        } else {
            alert('Hotel not found for this number');
        }
    });
});