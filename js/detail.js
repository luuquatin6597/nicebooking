function loadProductDetail(product) {
    $('.hotel-detail .hotel-name h1').html(product.title)

    const productImg = product.image.split(', ')
    $('.img-gallery .slider').html(
        productImg.map((image, index) => {
            return `
            <div class="item px-1" data-index="${index}">
                <img class="img-fluid rounded-3 h-100 object-fit-cover w-100" src="${image}" alt="">
            </div>
            `
        })
    )

    sliderGallery()

    const maximum = $('.maximum')[0]
    maximum.children[0].textContent = `People: ${product.maxPeople}`
    maximum.children[1].textContent = `Bed: ${product.maxBed}`
    maximum.children[2].textContent = `Bathroom: ${product.maxBathroom}`

    const form = $('.book-form')
    form.find('.sale').text(formatCurrency(product.salePrice)).attr('data-sale-price', product.salePrice)
    form.find('.root').text(formatCurrency(product.price)).attr('data-root-price', product.price)
    form.attr('data-max-people', product.maxPeople)
}

function sliderGallery() {
    $('#slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: '<i class="bi bi-chevron-left text-white slick-prev"></i>',
        nextArrow: '<i class="bi bi-chevron-right text-white slick-next"></i>',
        responsive: [
            {
            breakpoint: 1200,
            settings: {
                slidesToShow: 2,
                dots: false,
                arrows: true
            }
            },
            {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                dots: true,
                arrows: false
            }
            }
        ]
    });
}

function getDate(element) {
    var dateParts = element.value.split('/');
    var date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    return date;
}

function setDateInput() {
    const dateStartInput = $('#dateStart')
    const dateEndInput = $('#dateEnd')
  
    if($('#product-detail-page').length > 0){
        const dateStart = new Date()
        const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000)

        dateStartInput.datepicker({
            defaultDate: dateStart,
            dateFormat: "dd/mm/yy",
            minDate: dateStart,
            onSelect: function(dateText, inst) {
                dateEndInput.datepicker("option", "minDate", dateText)
                updateBookingDetails();
            },
        })
        
        dateEndInput.datepicker({
            defaultDate: dateEnd,
            dateFormat: "dd/mm/yy",
            minDate: dateEnd,
            onSelect: function(dateText, inst) {
                dateStartInput.datepicker("option", "maxDate", dateText)
                updateBookingDetails();
            }
        })
        
        dateStartInput.datepicker("setDate", dateStart)
        dateEndInput.datepicker("setDate", dateEnd)
        updateBookingDetails()
    } else if ($('#checkout-page').length > 0) {
        const checkoutData = sessionGetCheckout()
        const dateStart = checkoutData.dateStart
        const dateEnd = checkoutData.dateEnd

        dateStartInput.datepicker({
            defaultDate: dateStart,
            dateFormat: "dd/mm/yy",
            minDate: dateStart,
            onSelect: function(dateText, inst) {
                dateEndInput.datepicker("option", "minDate", dateText)
                updateBookingDetails();
            },
        })
        
        dateEndInput.datepicker({
            defaultDate: dateEnd,
            dateFormat: "dd/mm/yy",
            minDate: dateEnd,
            onSelect: function(dateText, inst) {
                dateStartInput.datepicker("option", "maxDate", dateText)
                updateBookingDetails();
            }
        })
        
        dateStartInput.datepicker("setDate", dateStart)
        dateEndInput.datepicker("setDate", dateEnd)
        updateBookingDetails()
    }
}

function updateBookingDetails() {
    const form = $('.book-form')

    const dateStartInput = form.find('input[name="dateStart"]')
    const dateEndInput = form.find('input[name="dateEnd"]')
    const startDate = getDate(dateStartInput[0])
    const endDate = getDate(dateEndInput[0])
    const daysDiff = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)))
    const perElement = $('.per');
    const subTotal = form.find('.sub-total p:last-child');
    const tax = form.find('.tax p:last-child');
    const total = form.find('.total p:last-child');

    const adultQuantityInput = form.find('input[name="adultsQuantity"]')
    const childrenQuantityInput = form.find('input[name="childrenQuantity"]')
    const adults = parseInt(adultQuantityInput.val());
    const children = parseInt(childrenQuantityInput.val());
    const totalPeople = adults + children;

    const maxPeople = parseInt(form.attr('data-max-people'));

    if (totalPeople === maxPeople) {
        form.find('.plus').attr('disabled', true).addClass('disabled');
    } else {
        form.find('.plus').removeAttr('disabled').removeClass('disabled');
    }

    perElement.html(`<span class="text-black-50">Day: ${daysDiff}</span> - <span class="text-black-50">Person: ${adults} adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} ${children > 1 ? 'children' : 'child'}` : ''}</span>`);

    var basePrice = parseInt(form.find('.sale')[0].getAttribute('data-sale-price'))
    const totalPrice = basePrice * daysDiff;
    subTotal.text(`${formatCurrency(totalPrice)}`).attr('data-sub-total', totalPrice);

    const currentPage = window.location.pathname;
    if (currentPage === '/html/checkout.html') {
        tax.text(formatCurrency(totalPrice * 0.1)).attr('data-tax', totalPrice * 0.1);
        total.text(formatCurrency(totalPrice + (totalPrice * 0.1))).attr('data-total', totalPrice + (totalPrice * 0.1));
    }
}

function quantityMinus() {
    const input = $(this).parent().find('input[type="number"]')
    const currentValue = parseInt(input.val())
    const minValue = input.attr('name') === 'adultsQuantity' ? 1 : 0

    if (currentValue > minValue) {
        input.val(currentValue - 1)
        if (currentValue - 1 === minValue) {
            $(this).attr('disabled', true)
            $(this).addClass('disabled')
        }
        updateBookingDetails()
    }
}

function quantityPlus() {
    const input = $(this).parent().find('input[type="number"]')
    const currentValue = parseInt(input.val())
    input.val(currentValue + 1)
    const minusButton = $(this).parent().find('.minus')
    minusButton.removeAttr('disabled')
    minusButton.removeClass('disabled')
    updateBookingDetails()
}

function submitDetailForm(e) {
    e.preventDefault()

    var getUserData = checkUserAccount()

    if(typeof getUserData === 'object') {
        const formElements = e.currentTarget.querySelectorAll('input, select, textarea')
    
        let checkoutArray = {}
    
        formElements.forEach((el) => {
            checkoutArray[el.name] = el.value
        });
    
        checkoutArray['hotelId'] = new URLSearchParams(window.location.search).get('id')
    
        sessionSaveCheckout(checkoutArray)
    
        window.location.href = 'checkout.html'
    } else {
        window.location.href = 'login.html'
    }
}

async function youMayAlsoLike(mainProduct) {
    const products = await getProducts()
    var cardList = $('.also-like .card-list')

    await products.forEach((product, index) => {
        if(product.type === mainProduct.type && JSON.stringify(product) !== JSON.stringify(mainProduct)) {
            const productContainer = document.createElement('div')
            productContainer.className = 'item mb-5'
            productContainer.innerHTML = `
                <div class="card w-100 border-0 shadow overflow-hidden">
                    <a href="detail.html?id=${index}" class="card-img-top">
                        <div class="card-label position-absolute top-0 end-0 py-1 px-2"><span>-${discount(product.price, product.salePrice)}%</span>
                        </div>
                        <img class="card-img-top object-fit-cover"
                            src="${product.image.split(',')[0]}"
                            alt="img">
                    </a>
                    <div class="card-body">
                        <a class="card-title link-primary text-decoration-none mb-1 fw-bold text-body" href="detail.html?id=${index}">${product.title}</a>
                        <p class="card-price mb-3 d-flex align-items-center gap-2">
                            <span class="sale fw-bold">${formatCurrency(product.salePrice)}</span>
                            <span class="text-decoration-line-through">${formatCurrency(product.price)}</span>
                        </p>
                        <p class="card-name mb-1 d-flex align-items-center gap-1 text-primary">
                            <i class="bi bi-geo"></i>
                            <span class="overflow-hidden text-nowrap text-truncate">${product.name}</span>
                        </p>
                        <span class="card-type badge rounded-pill border">Type: ${product.type}</span>
                        <div class="mt-3 card-info d-flex align-items-center text-black-50 gap-2">
                        <span class="border-end pe-2">Max people: ${product.maxPeople}</span>
                        <span class="border-end pe-2">Bed: ${product.maxBed}</span>
                        <span>Bathroom: ${product.maxBathroom}</span>
                        </div>
                    </div>
                </div>
            `;
            cardList.append(productContainer)
        }
    })

    await cardList.slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: '<i class="bi bi-chevron-left text-white slick-prev"></i>',
        nextArrow: '<i class="bi bi-chevron-right text-white slick-next"></i>',
        responsive: [
            {
            breakpoint: 1200,
            settings: {
                slidesToShow: 2,
                arrows: true
            }
            },
            {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                arrows: false,
                dots: true
            }
            }
        ]
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const products = getProducts()

    if($('#product-detail-page').length > 0) {
        const id = new URLSearchParams(window.location.search).get('id')
        const product = products.find((product, index) => index === parseInt(id))
        loadProductDetail(product)
        youMayAlsoLike(product)
    }

    setDateInput()

    $('.quantity .minus').click(quantityMinus)
    $('.quantity .plus').click(quantityPlus)

    if($('#product-detail-page').length > 0)
        $('.book-form').submit(submitDetailForm)
})