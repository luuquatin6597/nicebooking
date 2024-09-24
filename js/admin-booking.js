function displayBooking(){
    var dataArray = getBooking()
    var tableBooking = $('#tableBooking')
    tableBooking.html = '' 

    $.each(dataArray, function (i, e) { 
        const row = document.createElement('tr')
        row.innerHTML = `
            <th class="align-content-center px-3" scope="row">${i + 1}</th>
            <td class="align-content-center px-3">${e.hotelId}</td>
            <td class="align-content-center px-3">${e.fullName}</td>
            <td class="align-content-center px-3">${e.email}</td>
            <td class="align-content-center px-3">${e.phone}</td>
            <td class="align-content-center px-3">${e.dateStart}</td>
            <td class="align-content-center px-3">${e.dateEnd}</td>
            <td class="align-content-center px-3">${e.adultsQuantity}</td>
            <td class="align-content-center px-3">${e.childrenQuantity}</td>
            <td class="align-content-center px-3">${formatCurrency(e.price.sale)}</td>
            <td class="align-content-center px-3">${formatCurrency(e.price.root)}</td>
            <td class="align-content-center px-3">${formatCurrency(e.price.tax)}</td>
            <td class="align-content-center px-3">${formatCurrency(e.price.total)}</td>
            <td class="align-content-center px-3">${e.payment.creditCardNumber}</td>
        `;
        tableBooking.append(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayBooking()
})