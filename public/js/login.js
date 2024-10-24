

document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();   

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("/api/login", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
       function setCookie(name, value, hours) {
        const expires = new Date(Date.now() + hours * 3600 * 1000).toUTCString(); 
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; secure; samesite=strict`;
      }
      setCookie('token', result.data.token, 1);
      if (response.ok) {
         alert("Đăng nhập thành công!")
         
          window.location.href = "/dashboard";
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Lỗi trong quá trình đăng nhập:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  });
