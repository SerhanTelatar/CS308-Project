// login.js
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");
  
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault(); 
  
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (!username || !password) {
        alert("Please fill in all fields.");
        return;
      }
  
      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          window.location.href = "/home"; // Ensure this line is executed
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Login failed:", error.message);
        alert("Login failed. Please try again.");
      }
    });
  });
  