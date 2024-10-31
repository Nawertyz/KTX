const danhSachPhongHopLe = ['101', '102', '103', '104', '105', '106', '107'];
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("dichvu-form");
    const tableBody = document.querySelector("#dichvu-table tbody");
    const clearBtn = document.getElementById("clear-local-storage");
    let currentRow = null; 
    function addData(phong, dien, nuoc) {
        const row = document.createElement("tr");
        const dienCost = dien * 3000; 
        const nuocCost = nuoc * 20000; 
        const dichvuCost = 100000;    
        row.innerHTML = `
            <td>${phong}</td>
            <td>${formatNumber(dienCost)}</td>
            <td>${formatNumber(nuocCost)}</td>
            <td>${formatNumber(dichvuCost)}</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td><button class="status-btn">Chưa thanh toán</button></td> 
            <td>
                <button class="edit-btn">Chỉnh sửa</button>
                <button class="delete-btn">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
        alert("Đã thêm thành công");
    }
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const phong = document.getElementById("phong").value;
        const dien = parseFloat(document.getElementById("dien").value);
        const nuoc = parseFloat(document.getElementById("nuoc").value);
        if (!danhSachPhongHopLe.includes(phong)) {
            alert("Phòng không tồn tại"); 
            return; 
        }
        if (isNaN(dien) || dien < 0 || isNaN(nuoc) || nuoc < 0) {
            alert("Không hợp lệ"); 
            return; 
        }
        if (currentRow) {
            const dienCost = dien * 3000;
            const nuocCost = nuoc * 20000;
            const dichvuCost = 100000;
            currentRow.cells[0].textContent = phong;
            currentRow.cells[1].textContent = formatNumber(dienCost);
            currentRow.cells[2].textContent = formatNumber(nuocCost);
            currentRow.cells[3].textContent = formatNumber(dichvuCost);
            alert("Đã cập nhật!");
            currentRow = null; 
        } else {
            addData(phong, dien, nuoc);
        }
        form.reset(); 
    });
    tableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("status-btn")) {
            const button = event.target;
            button.innerText = button.innerText === "Đã thanh toán" ? "Chưa thanh toán" : "Đã thanh toán";
            button.classList.toggle("paid"); 
        }
    });
    tableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            const confirmDelete = confirm("Bạn có chắc chắn muốn xóa không?");
            if (confirmDelete) {
                event.target.closest("tr").remove();
            }
        } else if (event.target.classList.contains("edit-btn")) {
            const row = event.target.closest("tr");
            const cells = row.querySelectorAll("td");
            currentRow = row;
            const phong = cells[0].textContent;
            const dienCost = parseFloat(cells[1].textContent.replace(/\./g, '').replace(/,/g, '')); 
            const nuocCost = parseFloat(cells[2].textContent.replace(/\./g, '').replace(/,/g, '')); 
            document.getElementById("phong").value = phong;
            document.getElementById("dien").value = dienCost / 3000; 
            document.getElementById("nuoc").value = nuocCost / 20000; 
        }
    });
    clearBtn.addEventListener("click", function () {
        const confirmClear = confirm("Bạn có chắc chắn muốn xóa tất cả dữ liệu không?");
        if (confirmClear) {
            tableBody.innerHTML = "";
            alert("Tất cả dữ liệu đã bị xóa");
        }
    });
});
