// register.js

document.addEventListener('DOMContentLoaded', function () {
  const handleFormSubmission = async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!name || !username || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    // check password strength 
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      alert('Password must be at least 8 characters long and include both numbers and alphabetic characters.');
      return;
    }


    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        window.location.href = '/login'; 
        registrationForm.reset();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error.message);
      alert('Registration failed. Please try again.');
    }
  };

  const registrationForm = document.querySelector('form');
  if (registrationForm) {
    registrationForm.addEventListener('submit', handleFormSubmission);
  }
});
