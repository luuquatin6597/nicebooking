function displayProducts() {
    const products = getProducts()
    const productTableBody = document.getElementById('tableProducts')
    productTableBody.innerHTML = ''

    products.forEach((product, index) => {
        const row = document.createElement('tr')
        var productImage = product.image.split(',')[0]
        row.innerHTML = `
            <th class="align-content-center px-3" scope="row">${index + 1}</th>
            <td class="align-content-center px-3"><img class="object-fit-cover" src="${productImage}" width="150px" height="100px" /></td>
            <td class="align-content-center px-3">${product.title}</td>
            <td class="align-content-center px-3">${product.type}</td>
            <td class="align-content-center px-3">${product.maxPeople}</td>
            <td class="align-content-center px-3">${product.maxBed}</td>
            <td class="align-content-center px-3">${product.maxBathroom}</td>
            <td class="align-content-center px-3">${product.name}</td>
            <td class="align-content-center px-3">${product.address}</td>
            <td class="align-content-center px-3">${formatCurrency(product.salePrice)}</td>
            <td class="align-content-center px-3">${formatCurrency(product.price)}</td>
            <td class="align-content-center px-3">${product.createDate}</td>
            <td class="align-content-center px-3">${product.status}</td>
            <td class="align-content-center px-3">
                <button class="btn btn-warning" onclick="handleEdit(${index})"${!product.status && 'disabled'}>Edit</button>
                <button class="btn btn-danger" onclick="handleDelete(${index})" ${!product.status && 'disabled'}>Delete</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

var num = 0;
var images = [];
let editingIndex = null;

$(document).ready(function() {
    $('#pro-image').on('change', function(event) {
        readImage(event);
    });
    
    $(document).on('click', '.image-cancel', function() {
        let no = $(this).data('no');
        $(".preview-image.preview-show-"+no).remove();
    
        images = images.filter((image, index) => index !== no);
    
        $("#pro-image").attr("data-images-list", JSON.stringify(images));
    });
});

function readImage(event) {
    if (window.File && window.FileList && window.FileReader) {
        var files = event.target.files;
        var output = $(".preview-images-zone");

        for (let i = 0; i < files.length; i++) {
            var file = files[i];
            if (!file.type.match('image')) continue;

            var fileName = '../assets/images/' + file.name
            
            var html =  '<div class="border preview-image preview-show-' + num + '">' +
            '<div class="image-cancel p-1 rounded-circle bg-white border" data-no="' + num + '"><i class="bi bi-x"></i></div>' +
            '<div class="image-zone"><img id="pro-img-' + num + '" src="' + fileName + '"></div>' +
            '</div>';

            output.append(html);
            num = num + 1;
            images.push(fileName);

            $("#pro-image").attr("data-images-list", JSON.stringify(images));
        }
        $("#pro-image").val('');
    } else {
        console.log('Browser not support');
    }
}

function handleEdit(event) {
    const index = event
    let products = getProducts()
    const form = document.querySelector("#canvasAddNew #addNewForm")

    const product = products[index]

    // Render hình ảnh vào preview-images-zone
    const imagesList = product.image.split(', ')
    const previewImagesZone = $('.preview-images-zone')

    imagesList.forEach((image, index) => {
        const html = `
            <div class="border preview-image preview-show-${index}">
                <div class="image-cancel p-1 rounded-circle bg-white border" data-no="${index}"><i class="bi bi-x"></i></div>
                <div class="image-zone"><img id="pro-img-${index}" src="${image}"></div>
            </div>
        `;
        previewImagesZone.get(0).insertAdjacentHTML('beforeend', html);
    });

    // Cập nhật attribute data-images-list
    $("#pro-image").attr("data-images-list", JSON.stringify(imagesList));

    form.elements["title"].value = product.title;
    form.querySelector("select").value = product.type;
    form.elements["maxBed"].value = product.maxBed;
    form.elements["maxPeople"].value = product.maxPeople;
    form.elements["maxBathroom"].value = product.maxBathroom;
    form.elements["name"].value = product.name;
    form.elements["address"].value = product.address;
    form.elements["map"].value = product.map;
    form.elements["price"].value = product.price;
    form.elements["salePrice"].value = product.salePrice;
    
    editingIndex = index;

    const offcanvas = document.querySelector("#canvasAddNew");
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
    bsOffcanvas.show();
}

function handleDelete(event) {
    const index = event;
    let products = getProducts();
    const product = products[index];
    const modal = document.getElementById('deleteModal');
    const modalBody = modal.querySelector('.modal-body');
    const submitButton = modal.querySelector('.submit-modal');
    modalBody.innerHTML = `Do you want to delete this hotel?`;

    modal.addEventListener('show.bs.modal', function () {
        submitButton.addEventListener('click', function() {
            product.status = false
            saveProducts(products)
            displayProducts() // Cập nhật danh sách
            myModal.hide()
        });
    });

    var myModal = new bootstrap.Modal(modal);
    myModal.show();
}

document.addEventListener("DOMContentLoaded", () => {
    displayProducts()

    const form = document.querySelector("#canvasAddNew #addNewForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const imagesList = JSON.parse($("#pro-image").attr("data-images-list"));
        const image = imagesList.join(', ');
        const title = form.elements["title"].value;
        const type = form.querySelector("select").value;
        const maxBed = form.elements["maxBed"].value;
        const maxPeople = form.elements["maxPeople"].value;
        const maxBathroom = form.elements["maxBathroom"].value;
        const name = form.elements["name"].value;
        const address = form.elements["address"].value;
        const map = form.elements["map"].value;
        const price = form.elements["price"].value;
        const salePrice = form.elements["salePrice"].value;

        let products = getProducts()

        const product = {
            image: image,
            title: title,
            type: type,
            maxBed: maxBed,
            maxPeople: maxPeople,
            maxBathroom: maxBathroom,
            name: name,
            address: address,
            map: map,
            price: price,
            salePrice: salePrice,
            createDate: new Date().toISOString().slice(0, 10),
            status: true
        };

        if (editingIndex !== null) {
            products[editingIndex] = product;
            editingIndex = null; 
        } else {
            products.push(product);
        }

        saveProducts(products)

  
        displayProducts()
        form.reset()
       
        document.querySelector('.btn-close').click()
    });
});

$('#canvasAddNew').on('hide.bs.offcanvas', function () {
    const form = $(this).find('form');
    form[0].reset();
    $(this).find('.preview-images-zone .preview-image').remove();
});