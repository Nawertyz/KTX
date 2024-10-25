document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login");
    const errorMessage = document.getElementById("error");

    loginForm?.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username === "admin" && password === "123456") {
            localStorage.setItem("loggedIn", "true");
            window.location.href = "ktx/main.html";
        } else {
            errorMessage.style.display = "block";
        }
    });

    if (localStorage.getItem("loggedIn") !== "true" && window.location.pathname !== "/index.html") {
        alert("Vui lòng đăng nhập!");
        window.location.href = "index.html";
    }
});

function logout() {
    localStorage.removeItem("loggedIn");
    alert("Đã đăng xuất!");
}
