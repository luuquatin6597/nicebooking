function loadProductCheckout(product) {
    const form = $('.book-form')
    form.find('.hotel-name').text(product.title)
    form.find('.sale').text(formatCurrency(product.salePrice)).attr('data-sale-price', product.salePrice)
    form.find('.root').text(formatCurrency(product.price)).attr('data-root-price', product.price)
    form.attr('data-max-people', product.maxPeople)

    const getUser = checkUserAccount()

    form.find('input[name="email"]').val(getUser.email)
    form.find('input[name="fullName"]').val(getUser.fullName)
    form.find('input[name="phone"]').val(getUser.phone)

    const creditCardNumberInput = form.find('#creditCardNumber');
    const expirationDateInput = form.find('#expirationDate');
    const securityCodeInput = form.find('#securityCode');

    // Lắng nghe sự kiện input
    creditCardNumberInput.on('input', function() {
        var value = $(this).val().replace(/\D/g, '');
        var formattedValue = '';
        for (var i = 0; i < value.length; i++) {
            if (i % 4 === 0 && i !== 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        if (value.length > 16) {
            formattedValue = formattedValue.substring(0, 19); // 19 là độ dài tối đa của chuỗi có 16 số và 3 khoảng trắng
        }
        $(this).val(formattedValue)
    });

    expirationDateInput.on('input', function() {
        var value = $(this).val().replace(/\D/g, '');
        if (value.length > 6) {
            $(this).val($(this).val().substring(0, 6));
        }

        var formattedValue = '';
        if (value.length === 2) {
            formattedValue = value + '/';
        } else if (value.length === 4) {
            formattedValue = value.substring(0, 2) + '/' + value.substring(2);
        } else {
            formattedValue = value;
        }

        $(this).val(formattedValue);
        var date = new Date();
        var month = date.getMonth() + 1;
        var year = date.getFullYear().toString().substring(2);
        if (value.length === 4) {
            var inputMonth = value.substring(0, 2);
            var inputYear = value.substring(2);
            if (inputMonth < 1 || inputMonth > 12 || inputYear < year || (inputYear === year && inputMonth <= month)) {
                $(this).val('');
            }
        }
    });

    securityCodeInput.on('input', function() {
        var value = $(this).val().replace(/\D/g, '');
        if (value.length > 3) {
            $(this).val(value.substring(0, 3));
        }
    });
}

async function submitCheckoutForm(e) {
    e.preventDefault()

    const form = $(e.currentTarget)
    const formElements = e.currentTarget.querySelectorAll('input, select, textarea')
    const subTotal = form.find('.sub-total p:last-child');
    const tax = form.find('.tax p:last-child');
    const total = form.find('.total p:last-child');
    const btnSubmit = form.find('button[type="submit"]');
    const spinner = form.find('.spinner-border');

    spinner.show()
    btnSubmit.addClass('disabled')

    let checkoutArray = {}

    const getSession = sessionGetCheckout()
    checkoutArray['hotelId'] = getSession.hotelId

    checkoutArray['price'] = {
        'sale': form.find('.sale')[0].getAttribute('data-sale-price'),
        'root': form.find('.root')[0].getAttribute('data-root-price'),
        'subTotal': subTotal.attr('data-sub-total'),
        'tax': tax.attr('data-tax'),
        'total': total.attr('data-total'),
    }

    checkoutArray['payment'] = {
        'creditCardNumber': form.find('#creditCardNumber').val(),
        'expirationDate': form.find('#expirationDate').val(),
        'securityCode': form.find('#securityCode').val(),
    }

    checkoutArray['createTime'] = Date.now()

    formElements.forEach((el) => {
        if(el.name !== 'creditCardNumber' && el.name !== 'expirationDate' && el.name !== 'securityCode')
            checkoutArray[el.name] = el.value
    });

    const booking = getBooking()
    booking.push(checkoutArray)

    try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await saveBooking(booking)
        sessionStorage.setItem('currentBooking', JSON.stringify(checkoutArray))
        spinner.hide()
        btnSubmit.removeClass('disabled')
        $('.hotel-detail').hide()
        $('.success-content').show()

    } catch (error){
        console.error(error.message)
    }
}

function backToPreviousPage() {
    const id = sessionGetCheckout()
    if (id.length === 0) {
        window.location.href = 'category.html'
    } else {
        window.history.back()
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if($('#checkout-page').length > 0) {
        const products = getProducts()
        const id = sessionGetCheckout()
        
        if (id.length === 0) {
            $('.book-form').hide()
            $('.blank-content').show()
            $('.back-btn').html('<i class="bi bi-arrow-left d-flex align-items-center justify-content-center"></i> Come to Category Page')
            youMayAlsoLike(products[0])
        } else {
            $('.blank-content').hide()
            const product = products.find((product, index) => index === parseInt(id.hotelId))
            loadProductCheckout(product)
            $('.book-form').submit(submitCheckoutForm)
            youMayAlsoLike(product)
        }
    }
})