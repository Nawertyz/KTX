const tenInput = document.getElementById("ten");
const msvInput = document.getElementById("msv");
const tienInput = document.getElementById("tien");
const addButton = document.querySelector("button[type='submit']");
const tableBody = document.querySelector("table tbody");
let currentRow = null; 
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); 
}
function addOrUpdateInvoice(event) {
    event.preventDefault(); 
    const ten = tenInput.value.trim();
    const msv = msvInput.value.trim();
    const tien = tienInput.value.trim();
    if (ten === "" || msv === "" || tien === "") {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
    if (!nameRegex.test(ten)) {
        alert("Hãy nhập đúng họ tên của bạn");
        return;
    }
    const tienValue = parseFloat(tien);
    if (isNaN(tienValue) || tienValue <= 0) {
        alert("Không hợp lệ");
        return;
    }
    if (currentRow) {
        currentRow.cells[0].textContent = ten;
        currentRow.cells[1].textContent = msv;
        currentRow.cells[2].textContent = formatNumber(tienValue) + " VND"; 
        alert("Đã cập nhật hóa đơn");
        currentRow = null;
    } else {
        const existingRows = tableBody.getElementsByTagName("tr");
        for (let row of existingRows) {
            const existingMsv = row.cells[1].innerText.trim();
            if (existingMsv === msv) {
                alert("Mã sinh viên đã tồn tại");
                return;
            }
        }
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${ten}</td>
            <td>${msv}</td>
            <td>${formatNumber(tienValue)} VND</td> <!-- Sử dụng hàm formatNumber -->
            <td>${new Date().toLocaleDateString()}</td>
            <td><button class="status-btn">Chưa thanh toán</button></td>
            <td>
                <button class="edit-btn">Chỉnh sửa</button>
                <button class="delete-btn">Xóa</button>
            </td>
        `;
        tableBody.appendChild(newRow);
    }
    tenInput.value = "";
    msvInput.value = "";
    tienInput.value = "";
}
function toggleStatus(button) {
    button.innerText = button.innerText === "Đã thanh toán" ? "Chưa thanh toán" : "Đã thanh toán";
    button.classList.toggle("paid"); 
}
function deleteRow(button) {
    const row = button.closest("tr");
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa không?");
    if (confirmDelete) {
        tableBody.removeChild(row);
    }
}
function editRow(button) {
    currentRow = button.closest("tr");
    const cells = currentRow.querySelectorAll("td");
    tenInput.value = cells[0].textContent;
    msvInput.value = cells[1].textContent;
    const tienText = cells[2].textContent.replace(/ VND/, '').replace(/\./g, ''); 
    tienInput.value = parseFloat(tienText.replace(/,/g, '')).toString(); 
}
addButton.addEventListener("click", addOrUpdateInvoice);
tableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        deleteRow(event.target);
    } else if (event.target.classList.contains("edit-btn")) {
        editRow(event.target);
    } else if (event.target.classList.contains("status-btn")) {
        toggleStatus(event.target);
    }
});
