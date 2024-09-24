function benefitsSlider() {
    $('#benefitsSlider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        arrows: false,
        prevArrow: '<i class="bi bi-chevron-left text-white slick-prev"></i>',
        nextArrow: '<i class="bi bi-chevron-right text-white slick-next"></i>',
        infinite: true,
        responsive: [
        {
            breakpoint: 768,
            settings: {
            slidesToShow: 3
            }
        },
        {
            breakpoint: 510,
            settings: {
            slidesToShow: 2
            }
        }
        ]
    });
}

function superSale(){
    const products = getProducts()
    const superSale = $('#superSale')
    superSale.innerHTML = ''

    products.forEach((product, index) => {
      if(index <= 3){
        const productContainer = document.createElement('div')
        productContainer.className = 'col-xl-3 col-md-6 col-sm-12 mb-3'
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
        superSale.append(productContainer);
      }
    });
}

function goodPrice(){
  const products = getProducts()
  const goodPrice = $('#goodPrice')
  goodPrice.innerHTML = ''

  products.forEach((product, index) => {
    if(index > 3){
      const productContainer = document.createElement('div')
      productContainer.className = 'col-xl-4 col-md-6 col-12'
      productContainer.innerHTML = `
                <div class="card border-0 shadow overflow-hidden flex-row">
                    <a href="detail.html?id=${index}" class="card-img-top position-relative p-2">
                        <div class="card-label position-absolute py-1 px-2">
                            <span>-${discount(product.price, product.salePrice)}%</span>
                        </div>
                        <img class="card-img-top object-fit-cover"
                            src="${product.image.split(',')[0]}"
                            alt="img">
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
                </div>`

      goodPrice.append(productContainer);
    }
  })
}

function submitSearch(e) {
    e.preventDefault()
    console.log('e.currentTarget[0].value', e.currentTarget[0].value)
    console.log('e.currentTarget[1].value', e.currentTarget[1].value)

    const params = new URLSearchParams();
    if (e.currentTarget[0].value) params.set('search', e.currentTarget[0].value);
    if (e.currentTarget[1].value !== 'All room') params.set('type', e.currentTarget[1].value);

    const url = new URL('html/category.html', window.location.origin);
    url.search = params.toString();
    //window.history.pushState({}, '', url.href);
    window.location.href = url.href
}

document.addEventListener('DOMContentLoaded', function () {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    
    $('.search-bar').on('submit', submitSearch)
    superSale()
    goodPrice()
    benefitsSlider()
});