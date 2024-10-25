// Danh sách phòng ký túc xá hợp lệ
const danhSachPhongHopLe = ['101', '102', '103', '104'];

// Danh sách phòng có người ở
const danhSachPhongCoNguoiO = ['101', '102', '103'];

// Lấy danh sách các phòng đã có trong bảng điện nước
function layDanhSachPhongDaCo() {
    const rows = document.querySelectorAll('#dichvu-table tbody tr');
    return Array.from(rows).map(row => row.cells[0].innerText);
}

// Hàm hiển thị thông báo trên giao diện
function hienThongBao(noiDung, loai = 'error') {
    const thongbao = document.getElementById('thongbao');
    thongbao.innerText = noiDung;
    thongbao.className = loai; // 'error' hoặc 'success'
    thongbao.classList.remove('hidden');

    setTimeout(() => {
        thongbao.classList.add('hidden');
    }, 3000);
}

// Hàm lưu dữ liệu vào localStorage
function luuDuLieu() {
    const rows = document.querySelectorAll('#dichvu-table tbody tr');
    const data = Array.from(rows).map(row => ({
        phong: row.cells[0].innerText,
        tienDien: row.cells[1].innerText,
        tienNuoc: row.cells[2].innerText,
        dichVu: row.cells[3].innerText,
        ngayTao: row.cells[4].innerText,
        trangThai: row.cells[5].innerText,
    }));
    localStorage.setItem('dichVuData', JSON.stringify(data));
}

function dinhDangTienTe(amount) {
    return amount.toLocaleString('vi-VN');
}

// Hàm tải dữ liệu từ localStorage
function taiDuLieu() {
    const data = JSON.parse(localStorage.getItem('dichVuData')) || [];
    const tableBody = document.querySelector('#dichvu-table tbody');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${item.phong}</td>
            <td>${dinhDangTienTe(item.tienDien)}</td>
            <td>${dinhDangTienTe(item.tienNuoc)}</td>
            <td>${dinhDangTienTe(item.dichVu)}</td>
            <td>${item.ngayTao}</td>
            <td>${item.trangThai}</td>
            <td>
                <button class="edit-button" data-phong="${item.phong}">Chỉnh sửa</button>
                <button class="delete-button" data-phong="${item.phong}">Xóa</button>
            </td>
        `;
        tableBody.appendChild(newRow);
    });

    attachEventListeners(); // Gọi hàm để gán sự kiện
}

// Hàm gán sự kiện cho các nút xóa và chỉnh sửa
function attachEventListeners() {
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function () {
            const phong = this.getAttribute('data-phong');
            hienModalXacNhan(phong, function(confirmed) {
                if (confirmed) {
                    xoaDuLieuPhong(phong);
                    taiDuLieu();
                    hienThongBao(`Đã xóa dữ liệu cho phòng ${phong}!`, 'success');
                }
            });
        });
    });

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function () {
            const phong = this.getAttribute('data-phong');
            chinhSuaDuLieuPhong(phong);
        });
    });
}

// Hàm hiển thị modal xác nhận
function hienModalXacNhan(phong, callback) {
    const modal = document.getElementById('confirm-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');

    confirmMessage.innerText = `Bạn có chắc chắn muốn xóa dữ liệu cho phòng ${phong}?`;
    modal.classList.remove('hidden');

    confirmYes.onclick = function() {
        callback(true);
        modal.classList.add('hidden'); // Đóng modal
    };

    confirmNo.onclick = function() {
        callback(false);
        modal.classList.add('hidden'); // Đóng modal
    };
}

// Hàm xóa dữ liệu cho một phòng
function xoaDuLieuPhong(phong) {
    const data = JSON.parse(localStorage.getItem('dichVuData')) || [];
    const filteredData = data.filter(item => item.phong !== phong);

    localStorage.setItem('dichVuData', JSON.stringify(filteredData));
}

// Hàm chỉnh sửa dữ liệu cho một phòng
function chinhSuaDuLieuPhong(phong) {
    const data = JSON.parse(localStorage.getItem('dichVuData')) || [];
    const phongData = data.find(item => item.phong === phong);

    document.getElementById('phong').value = phongData.phong;
    document.getElementById('dien').value = phongData.tienDien / 3000;
    document.getElementById('nuoc').value = phongData.tienNuoc / 20000;

    document.getElementById('dichvu-form').onsubmit = function(event) {
        event.preventDefault();
        capNhatDuLieuPhong(phongData);
    };
}

// Hàm cập nhật dữ liệu phòng
function capNhatDuLieuPhong(phongData) {
    const phong = document.getElementById('phong').value;
    const soDien = parseInt(document.getElementById('dien').value);
    const soNuoc = parseInt(document.getElementById('nuoc').value);

    if (isNaN(soDien) || soDien <= 0) {
        hienThongBao(`Số điện phải là số dương!`, 'error');
        return;
    }
    if (isNaN(soNuoc) || soNuoc <= 0) {
        hienThongBao(`Số nước phải là số dương!`, 'error');
        return;
    }

    const tienDien = soDien * 3000;
    const tienNuoc = soNuoc * 20000;

    phongData.tienDien = tienDien;
    phongData.tienNuoc = tienNuoc;
    phongData.dichVu = 100000;
    phongData.ngayTao = new Date().toLocaleDateString('vi-VN');
    phongData.trangThai = 'Chưa thanh toán';

    const data = JSON.parse(localStorage.getItem('dichVuData'));
    const index = data.findIndex(item => item.phong === phong);
    data[index] = phongData;

    localStorage.setItem('dichVuData', JSON.stringify(data));
    taiDuLieu();
    hienThongBao(`Đã cập nhật dữ liệu cho phòng ${phong}!`, 'success');
}

document.getElementById('dichvu-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const phong = document.getElementById('phong').value;
    const soDien = parseInt(document.getElementById('dien').value) || 0;
    const soNuoc = parseInt(document.getElementById('nuoc').value) || 0;

    const phongDaCo = layDanhSachPhongDaCo();

    if (!danhSachPhongHopLe.includes(phong)) {
        hienThongBao(`Phòng ${phong} không hợp lệ!`, 'error');
        return;
    }

    if (phongDaCo.includes(phong)) {
        hienThongBao(`Phòng ${phong} đã có trong hệ thống!`, 'error');
        return;
    }

    if (!danhSachPhongCoNguoiO.includes(phong)) {
        hienThongBao(`Phòng ${phong} không có người ở!`, 'error');
        return;
    }

    if (soDien <= 0) {
        hienThongBao(`Số điện phải là số dương!`, 'error');
        return;
    }
    if (soNuoc <= 0) {
        hienThongBao(`Số nước phải là số dương!`, 'error');
        return;
    }

    const newData = {
        phong: phong,
        tienDien: soDien * 3000,
        tienNuoc: soNuoc * 20000,
        dichVu: 100000,
        ngayTao: new Date().toLocaleDateString('vi-VN'),
        trangThai: 'Chưa thanh toán'
    };

    const existingData = JSON.parse(localStorage.getItem('dichVuData')) || [];
    existingData.push(newData);
    localStorage.setItem('dichVuData', JSON.stringify(existingData));

    taiDuLieu();
    hienThongBao(`Đã thêm dữ liệu cho phòng ${phong}!`, 'success');
    document.getElementById('dichvu-form').reset(); // Đặt lại form
});

document.getElementById('clear-local-storage').addEventListener('click', function () {
    localStorage.removeItem('dichVuData');
    taiDuLieu();
    hienThongBao(`Đã xóa tất cả dữ liệu!`, 'success');
});

// Tải dữ liệu khi trang được load
window.onload = taiDuLieu;
