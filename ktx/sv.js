document.querySelector("form").addEventListener("submit", (e) => e.preventDefault());
const msvInput = document.getElementById("msv");
const spInput = document.getElementById("sp");
const button = document.querySelector("button");
const tableBody = document.querySelector("tbody");
const validRooms = ["101", "102", "103", "104", "105", "106", "107"];
const roomStatus = {
    "101": "Đã Đầy",
    "102": "Còn Trống",
    "103": "Còn Trống",
    "104": "Đã Đầy",
    "105": "Còn Trống",
    "106": "Đã Đầy",
    "107": "Đã Đầy",
};
const studentData = {
    "2021001": { name: "Nguyễn Văn A", gender: "Nam", hometown: "Hải Phòng", contact: "0123456789", dob: "01/01/2000", class: "CNTT",room:"101" },
    "2021002": { name: "Trần Thị B", gender: "Nữ", hometown: "Hải Dương", contact: "0987654321", dob: "02/02/2001", class: "CNTT" ,room:"102"},
    "2021003": { name: "Nguyễn Văn C", gender: "Nam", hometown: "Cao Bằng", contact: "0331254669", dob: "03/03/2002", class: "CNTT" ,room:"101" },
    "2021004": { name: "Trịnh Hồng D", gender: "Nữ", hometown: "Hà Nội", contact: "0789456123", dob: "04/04/2003", class: "CNTT" ,room:"102"},
    "2021005": { name: "Nguyễn Văn E", gender: "Nam", hometown: "Thái Bình", contact: "01239876", dob: "05/05/2004", class: "CNTT" ,room:"101"},
    "2021006": { name: "Nguyễn Văn F", gender: "Nam", hometown: "Quảng Ninh", contact: "0159875321", dob: "06/06/2005", class: "CNTT",room:"101" },
    "2021007": { name: "Nguyễn Thị G", gender: "Nữ", hometown: "Hồ Chí Minh", contact: "0123578977", dob: "07/07/2006", class: "CNTT" ,room:"102"},
};
let currentRow = null;
function isStudentExists(msv) {
    for (let row of tableBody.rows) {
        if (row.cells[0].textContent === msv) {
            return true;
        }
    }
    return false;
}
function validateRoom(room) {
    return validRooms.includes(room);
}
function isValidDate(date) {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(date);
}
function validateGender(gender) {
    return gender === "Nam" || gender === "Nữ" || gender === "nam" || gender === "nữ";
}
function addOrUpdateStudent() {
    const msv = msvInput.value.trim();
    const roomNumber = spInput.value.trim();
    if (msv === "" || roomNumber === "") {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
    }
    if (isStudentExists(msv)) {
        alert("Mã sinh viên đã có trong bảng");
        return;
    }
    if (!validateRoom(roomNumber)) {
        alert("Phòng không hợp lệ");
        return;
    }
    if (roomStatus[roomNumber] === "Đã Đầy") {
        alert("Phòng không còn trống");
        return;
    }
    let student = studentData[msv];
    if (!student) {
        const name = prompt("Nhập tên sinh viên:");
        const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
        if (!nameRegex.test(name)) {
            alert("Hãy nhập đúng họ tên của bạn");
            return;
        }
        const dob = prompt("Nhập ngày sinh (dd/mm/yyyy):");
        if (!isValidDate(dob)) {
            alert("Hãy nhập đúng định dạng");
            return;
        }
        const className = prompt("Nhập lớp:");
        const gender = prompt("Nhập giới tính (Nam/Nữ):");
        if (!validateGender(gender)) {
            alert("Hãy nhập đúng yêu cầu");
            return;
        }
        const hometown = prompt("Nhập quê quán:") || "Không xác định";
        if (!nameRegex.test(hometown)) {
            alert("Hãy nhập đúng quê quán của bạn");
            return;
        }
        const contact = prompt("Nhập số liên hệ:") || "Không xác định";
        student = {
            name, dob, class: className, gender, hometown, contact
        };
        studentData[msv] = student;
    }
    if (currentRow) {
        currentRow.cells[0].textContent = msv;
        currentRow.cells[1].textContent = student.name;
        currentRow.cells[2].textContent = student.gender;
        currentRow.cells[3].textContent = student.hometown;
        currentRow.cells[4].textContent = student.dob;
        currentRow.cells[5].textContent = student.class;
        currentRow.cells[6].textContent = roomNumber;
        currentRow.cells[7].textContent = student.contact;
        alert("Đã cập nhật thông tin sinh viên");
        currentRow = null;
    } else {
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).textContent = msv;
        newRow.insertCell(1).textContent = student.name;
        newRow.insertCell(2).textContent = student.gender;
        newRow.insertCell(3).textContent = student.hometown;
        newRow.insertCell(4).textContent = student.dob;
        newRow.insertCell(5).textContent = student.class;
        newRow.insertCell(6).textContent = roomNumber;
        newRow.insertCell(7).textContent = student.contact;

        const actionCell = newRow.insertCell(8);
        const editButton = document.createElement("button");
        editButton.textContent = "Chỉnh sửa";
        editButton.style.marginRight = "5px";
        editButton.addEventListener("click", () => editStudent(newRow));
        actionCell.appendChild(editButton);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Xóa";
        deleteButton.addEventListener("click", () => deleteStudent(newRow));
        actionCell.appendChild(deleteButton);
    }
    msvInput.value = "";
    spInput.value = "";
}
function editStudent(row) {
    const cells = row.querySelectorAll("td");
    msvInput.value = cells[0].textContent;
    const name = prompt("Nhập tên sinh viên:", cells[1].textContent);
    const dob = prompt("Nhập ngày sinh (dd/mm/yyyy):", cells[4].textContent);
    const className = prompt("Nhập lớp:", cells[5].textContent);
    const gender = prompt("Nhập giới tính (Nam/Nữ):", cells[2].textContent);
    const hometown = prompt("Nhập quê quán:", cells[3].textContent);
    const contact = prompt("Nhập số liên hệ:", cells[7].textContent);
    const roomNumber = prompt("Nhập số phòng:", cells[6].textContent);
    if (!validateRoom(roomNumber)) {
        alert("Phòng không hợp lệ");
        return;
    }
    if (roomStatus[roomNumber] === "Đã Đầy") {
        alert("Phòng không còn trống");
        return;
    }
    cells[1].textContent = name;
    cells[2].textContent = gender;
    cells[3].textContent = hometown;
    cells[4].textContent = dob;
    cells[5].textContent = className;
    cells[6].textContent = roomNumber;
    cells[7].textContent = contact;
    alert("Đã cập nhật thông tin sinh viên");
    currentRow = null;
}
function deleteStudent(row) {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa không?");
    if (confirmDelete) {
        tableBody.deleteRow(row.rowIndex - 1);
    }
}
button.addEventListener("click", addOrUpdateStudent);
function loadDefaultStudents() {
    tableBody.innerHTML = "";
    for (let msv in studentData) {
        const student = studentData[msv];
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).textContent = msv;
        newRow.insertCell(1).textContent = student.name;
        newRow.insertCell(2).textContent = student.gender;
        newRow.insertCell(3).textContent = student.hometown;
        newRow.insertCell(4).textContent = student.dob;
        newRow.insertCell(5).textContent = student.class;
        // Sử dụng số phòng từ studentData, nếu không có thì hiển thị "Không có phòng"
        newRow.insertCell(6).textContent = student.room || "Không có phòng";
        newRow.insertCell(7).textContent = student.contact;
        const actionCell = newRow.insertCell(8);
        const editButton = document.createElement("button");
        editButton.textContent = "Chỉnh sửa";
        editButton.style.marginRight = "5px";
        editButton.addEventListener("click", () => editStudent(newRow));
        actionCell.appendChild(editButton);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Xóa";
        deleteButton.addEventListener("click", () => deleteStudent(newRow));
        actionCell.appendChild(deleteButton);
    }
}
loadDefaultStudents(); 
