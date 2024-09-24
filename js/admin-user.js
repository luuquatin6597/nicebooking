// Hiển thị danh sách người dùng với tìm kiếm và lọc vai trò
function displayUsers(searchValue = '', roleFilter = '') {
    const users = getUsers();
    const userTableBody = document.getElementById('userTable'); // Assuming userTable is the <tbody>
    if (userTableBody) {
        userTableBody.innerHTML = ''; // Xóa bảng hiện tại

        // Lọc người dùng dựa trên giá trị tìm kiếm và vai trò
        const filteredUsers = users.filter(user =>
            user.fullName && user.fullName.toLowerCase().includes(searchValue.toLowerCase()) &&
            (roleFilter === '' || user.role === roleFilter) // Kiểm tra roleFilter có khớp với user.role
        );

        // Hiển thị người dùng đã lọc
        filteredUsers.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th class="align-content-center" scope="row">${index + 1}</th>
                <td class="align-content-center">${user.fullName || ''}</td>
                <td class="align-content-center">${user.dateOfBirth || ''}</td>
                <td class="align-content-center">${user.gender === 'Male' ? 'Male' : 'Female'}</td>
                <td class="align-content-center">${user.email || ''}</td>
                <td class="align-content-center">${user.phone || ''}</td>
                <td class="align-content-center">${user.address || ''}</td>
                <td class="align-content-center">${user.role || ''}</td>
                <td class="align-content-center">${user.createDate || ''}</td>
                <td class="align-content-center">${user.status ? 'Active' : 'Inactive'}</td>
                <td class="align-content-center">
                    <button class="btn btn-warning" onclick="editUser(${index})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteUser(${index})" ${user.status ? '' : 'disabled'}>Delete</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }
}

// Xử lý sự kiện tìm kiếm
function handleSearch() {
    const searchValue = document.getElementById('searchInput').value;
    const roleFilter = document.querySelector('input[name="roleFilter"]:checked')?.value || '';
    displayUsers(searchValue, roleFilter); // Cập nhật hiển thị với kết quả tìm kiếm và bộ lọc vai trò
}

// Lọc theo vai trò
function filterByRole(role) {
    displayUsers('', role); // Hiển thị người dùng với bộ lọc vai trò
}

// Đặt lại tìm kiếm
function resetSearch() {
    document.getElementById('searchInput').value = '';
    displayUsers(); // Hiển thị tất cả người dùng
}

// Gán sự kiện cho các nút lọc vai trò
document.addEventListener('DOMContentLoaded', function () {
    const filterClientsBtn = document.getElementById('filterClientsBtn');
    const filterStaffsBtn = document.getElementById('filterStaffsBtn');

    filterClientsBtn.addEventListener('click', () => filterByRole('client'));
    filterStaffsBtn.addEventListener('click', () => filterByRole('staff'));
    
    displayUsers(); // Hiển thị danh sách người dùng khi tải trang

    // Gán sự kiện cho các nút tìm kiếm và đặt lại
    const searchBtn = document.getElementById('searchBtn');
    const resetSearchBtn = document.getElementById('resetSearchBtn');

    if (searchBtn && resetSearchBtn) {
        searchBtn.addEventListener('click', handleSearch);
        resetSearchBtn.addEventListener('click', resetSearch);
    }

    // Gán sự kiện cho form thêm người dùng
    const addNewForm = document.getElementById('addNewForm');
    if (addNewForm) {
        addNewForm.addEventListener('submit', addUser);
    }

    // Đặt lại form khi offcanvas đóng
    const canvasAddNew = document.getElementById('canvasAddNew');
    if (canvasAddNew) {
        canvasAddNew.addEventListener('hidden.bs.offcanvas', function () {
            document.getElementById('addNewForm').reset();
            const addButton = document.querySelector('.offcanvas-footer .btn-primary');
            if (addButton) {
                addButton.textContent = 'Add';
            }
        });
    }
});

// Thêm người dùng mới
function addUser(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const createUser = {};

    Array.from(form.elements).forEach(e => {
        if (e.type === 'radio' && e.checked) {
            createUser['gender'] = e.id === 'genderMale' ? 'Male' : 'Female';
        } else if (e.type !== 'submit') {
            createUser[e.name] = e.value;
        }
    });

    if (createUser['password'] !== createUser['confirmPassword']) {
        $('.invalid-feedback').show();
    } else {
        $('.invalid-feedback').hide();

        const newUser = {
            fullName: createUser['fullName'],
            dateOfBirth: createUser['dateOfBirth'],
            gender: createUser['gender'],
            email: createUser['email'],
            password: createUser['password'],
            phone: createUser['phone'],
            address: createUser['address'],
            role: createUser['role'],
            createDate: new Date().toISOString().slice(0, 10),
            status: true
        };

        // Lưu vào localStorage và hiển thị
        const users = getUsers();
        users.push(newUser);
        saveUsers(users);
        displayUsers();

        // Reset the form after adding a new user
        $('#addNewForm').trigger('reset');
        
        // Đóng form sau khi thêm xong
        document.querySelector('.btn-close').click();
    }
}

// Xóa người dùng
function deleteUser(index) {
    const users = getUsers();
    const user = users[index];
    const modal = document.getElementById('deleteModal');
    const modalBody = modal.querySelector('.modal-body');
    const submitButton = modal.querySelector('.submit-modal');
    modalBody.innerHTML = `Bạn có chắc chắn muốn xóa người dùng ${user.fullName} không?`;

    if (modal && submitButton) {
        modal.addEventListener('show.bs.modal', function () {
            submitButton.addEventListener('click', function() {
                user.status = false;
                saveUsers(users);
                displayUsers(); // Cập nhật danh sách
                myModal.hide();
            });
        });

        var myModal = new bootstrap.Modal(modal);
        myModal.show();
    }
}

// Chỉnh sửa người dùng
function editUser(index) {
    const form = document.getElementById('addNewForm');
    const users = getUsers();
    const user = users[index];

    if (form) {
        Array.from(form.elements).forEach(e => {
            if (e.type === 'radio') {
                e.checked = user.gender === 'Male' ? e.id === 'genderMale' : e.id === 'genderFemale';
            } else if (e.type !== 'submit') {
                if (e.type === 'password') {
                    e.parentNode.style.display = 'none';
                } else {
                    e.value = user[e.name];
                }
            }
        });

        // Cập nhật chức năng của nút 'Add' thành 'Save'
        const addButton = document.querySelector('.offcanvas-footer .btn-primary');
        if (addButton) {
            addButton.textContent = 'Save';
            addButton.onclick = function (event) {
                event.preventDefault();
                saveEditedUser(index);
            };
        }

        // Tự động mở form chỉnh sửa (offcanvas) mà không reset giá trị
        $('#canvasAddNew').offcanvas('show');
    }
}

// Lưu thông tin người dùng sau khi chỉnh sửa
function saveEditedUser(index) {
    const form = document.getElementById('addNewForm');
    const users = getUsers();
    const user = users[index];
  
    if (form) {
        // Đọc giá trị mới từ form
        Array.from(form.elements).forEach(e => {
            if (e.type === 'radio') {
                if (e.checked && e.id === 'genderMale') {
                    user.gender = 'Male';
                } else if (e.checked && e.id === 'genderFemale') {
                    user.gender = 'Female';
                }
            } else if (e.type !== 'submit' && e.type !== 'password') {
                user[e.name] = e.value;
            }
        });
  
        // Cập nhật giá trị người dùng
        users[index] = user;
  
        saveUsers(users);
        displayUsers();
  
        // Đổi lại nút 'Save' thành 'Add'
        const addButton = document.querySelector('.offcanvas-footer .btn-primary');
        if (addButton) {
            addButton.textContent = 'Add';
            addButton.onclick = addUser;
        }
  
        // Đóng form
        const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('canvasAddNew'));
        offcanvas.hide();
    }
}