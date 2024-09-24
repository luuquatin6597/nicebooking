async function youMayAlsoLike() {
    const products = await getProducts()
    var cardList = $('.also-like .card-list')

    await products.forEach((product, index) => {
        if(index < 8) {
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

function goodPrice(minPrice, maxPrice, products = getProducts()) {
    const goodPriceContainer = $('#goodPrice');
    goodPriceContainer.html('');

    products.filter(product => product.salePrice >= minPrice && product.salePrice <= maxPrice)
        .forEach((product, index) => {
            const productContainer = document.createElement('div');
            productContainer.className = 'col-xl-4 col-md-6 col-12';
            productContainer.innerHTML = `
                <div class="card border-0 shadow overflow-hidden flex-row">
                    <a href="detail.html?id=${index}" class="card-img-top position-relative p-2">
                        <div class="card-label position-absolute py-1 px-2">
                            <span>-${discount(product.price, product.salePrice)}%</span>
                        </div>
                        <img class="card-img-top object-fit-cover" src="${product.image.split(',')[0]}" alt="img">
                    </a>
                    <div class="card-body p-2">
                        <a href="detail.html?id=${index}" class="card-title link-primary text-decoration-none fw-bold text-body mb-1">${product.title}</a>
                        <p class="card-name mb-1 d-flex align-items-center gap-1 mb-1 text-primary">
                            <i class="bi bi-geo"></i>
                            <span class="overflow-hidden text-nowrap text-truncate">${product.name}</span>
                        </p>
                        <p class="card-price mb-0 d-flex flex-column">
                            <span class="sale fw-bold">${formatCurrency(product.salePrice)}</span>
                            <span class="text-decoration-line-through">${formatCurrency(product.price)}</span>
                        </p>
                    </div>
                </div>`;
            goodPriceContainer.append(productContainer);
        });
}

function getDate(element) {
    var dateParts = element.value.split('/');
    var date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    return date;
}

function createDatePicker() {
    const dateStartInput = $('#dateStart')
    const dateEndInput = $('#dateEnd')
  
        const dateStart = new Date()
        const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000)

        dateStartInput.datepicker({
            defaultDate: dateStart,
            dateFormat: "dd/mm/yy",
            minDate: dateStart,
            onSelect: function(dateText, inst) {
                dateEndInput.datepicker("option", "minDate", dateText)
            },
        })
        
        dateEndInput.datepicker({
            defaultDate: dateEnd,
            dateFormat: "dd/mm/yy",
            minDate: dateEnd,
            onSelect: function(dateText, inst) {
                dateStartInput.datepicker("option", "maxDate", dateText)
            }
        })
        
        dateStartInput.datepicker("setDate", dateStart)
        dateEndInput.datepicker("setDate", dateEnd)
}

function createSliderPrice(){
    const data = getProducts();

    const minSalePrice = Math.min(...data.map(item => item.salePrice));
    const maxSalePrice = Math.max(...data.map(item => item.salePrice));

    $("#slider-range").slider({
        range: true,
        min: minSalePrice,
        max: maxSalePrice,
        step: 10000,
        values: [minSalePrice, maxSalePrice],
        classes: {
            'ui-slider': 'rounded-pill border',
            'ui-slider-handle': 'bg-white border shadow-none rounded-circle',
            'ui-slider-range': 'bg-primary'
        },
        create: function(event, ui) {
            event.target.children[1].innerHTML = `<label>${formatCurrency(minSalePrice)}</label>`
            event.target.children[2].innerHTML = `<label>${formatCurrency(maxSalePrice)}</label>`
        },
        slide: function (event, ui) {
            event.target.children[1].innerHTML = `<label>${formatCurrency(ui.values[0])}</label>`
            event.target.children[2].innerHTML = `<label>${formatCurrency(ui.values[1])}</label>`
        },
        start: function (event, ui) {
            $('.category-spinner-bg, .category-spinner').show()
        },
        stop: function (event, ui) {
            goodPrice(ui.values[0], ui.values[1]);
            setTimeout(() => {
                $('.category-spinner-bg, .category-spinner').hide()
            }, 500)
        }
    });
}
function search() {
    showSpinner()
    const searchInput = $('#searchBard').val();
    const roomType = $('#roomType').val();
    const minPrice = $("#slider-range").slider("values", 0);
    const maxPrice = $("#slider-range").slider("values", 1);

    const params = new URLSearchParams();
    if (searchInput) params.set('search', searchInput);
    if (roomType && roomType !== 'all room') params.set('type', roomType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    const url = new URL(window.location.href);
    url.search = params.toString();

    window.history.pushState({}, '', url.href);

    const products = getProducts();
    const filteredProducts = products.filter(product => {
        const productName = product.name.toLowerCase();
        const productTitle = product.title.toLowerCase();
        const searchInputLower = searchInput.toLowerCase();
        const roomTypeCondition = roomType === 'all room' || product.type === roomType;
        const priceCondition = product.salePrice >= minPrice && product.salePrice <= maxPrice;

        return (productName.includes(searchInputLower) || productTitle.includes(searchInputLower)) && roomTypeCondition && priceCondition;
    });

    goodPrice(minPrice, maxPrice, filteredProducts)
    hideSpinner()
}

function getMinAndMaxSalePrice() {
    const products = getProducts();
    const minSalePrice = Math.min(...products.map(item => item.salePrice));
    const maxSalePrice = Math.max(...products.map(item => item.salePrice));
    return { minSalePrice, maxSalePrice };
}

function getCategoryParams() {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    const search = params.get('search');
    const roomType = params.get('type');
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');

    return { search, roomType, minPrice, maxPrice };
}

function renderProducts(params) {
    const products = getProducts();

    const filteredProducts = products.filter(product => {
        const productName = product.name.toLowerCase();
        const productTitle = product.title.toLowerCase();
        const searchInputLower = params.search ? params.search.toLowerCase() : '';

        const roomTypeCondition = params.roomType ? product.type === params.roomType : true;
        const priceCondition = params.minPrice && params.maxPrice ? 
            product.salePrice >= (parseInt(params.minPrice)) && product.salePrice <= (parseInt(params.maxPrice)) : 
            true;

        return (productName.includes(searchInputLower) || productTitle.includes(searchInputLower)) && roomTypeCondition && priceCondition;
    });

    goodPrice(params.minPrice ? parseInt(params.minPrice) : 0, params.maxPrice ? parseInt(params.maxPrice) : Infinity, filteredProducts);

    hideSpinner();
}

function initCategoryPage() {
    showSpinner()
    const params = getCategoryParams()
    renderProducts(params)
}

// Khởi tạo dữ liệu khi DOM được tải xong
document.addEventListener('DOMContentLoaded', function () {
    createSliderPrice()
    //createDatePicker()
    
    $('#searchBard').on('input', search)
    //$('#dateStart').on('change', search)
    //$('#dateEnd').on('change', search)
    $('#roomType').on('change', search)
    $("#slider-range").on('slidechange', search)
    
    initCategoryPage()

    youMayAlsoLike()
    //superSale()
});