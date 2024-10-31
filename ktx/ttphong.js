const spInput = document.getElementById("sp");
const slInput = document.getElementById("sl");
const ttInput = document.getElementById("tt");
const button = document.querySelector("button");
const tableBody = document.querySelector("tbody");
function addStudentToRoom() {
    const roomNumber = spInput.value;
    const additionalStudents = parseInt(slInput.value);
    if (roomNumber === "" || isNaN(additionalStudents)) {
        alert("Vui lòng điền đầy đủ thông tin hợp lệ");
        return;
    }
    const rows = tableBody.getElementsByTagName("tr");
    let roomFound = false;
    for (let row of rows) {
        const roomCell = row.cells[0];
        const currentStudentsCell = row.cells[1];
        const statusCell = row.cells[2];
        if (roomCell.textContent === roomNumber) {
            roomFound = true;
            const currentStudents = parseInt(currentStudentsCell.textContent.split("/")[0]);
            const newStudentCount = currentStudents + additionalStudents;
            if (newStudentCount < 0) {
                alert("Không thể giảm số lượng sinh viên phòng xuống dưới 0");
                return;
            }
            if (newStudentCount > 4) {
                alert("Vượt quá giới hạn số sinh viên 1 phòng");
                return;
            }
            currentStudentsCell.textContent = `${newStudentCount}/4`;
            if (newStudentCount === 4) {
                statusCell.textContent = "Đã Đầy";
            } else if (newStudentCount === 0) {
                statusCell.textContent = "Còn Trống";
            } else {
                statusCell.textContent = "Còn Trống";
            }
            break;
        }
    }
    if (!roomFound) {
        alert("Số phòng không tồn tại");
    }
    spInput.value = "";
    slInput.value = "";
}
button.addEventListener("click", addStudentToRoom);
