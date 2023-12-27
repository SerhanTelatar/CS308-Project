document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", handleLogout);
    }

    function handleLogout(event) {
        event.preventDefault();

        fetch("/login/logout", {
            method: "GET",
            credentials: "same-origin",
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "/login";
            } else {
                console.error("Logout failed:", data.message);
            }
        })
        .catch(error => {
            console.error("Error during logout:", error);
        });
    }
});

