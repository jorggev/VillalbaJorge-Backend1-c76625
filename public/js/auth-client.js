// Cliente simple para login/logout y mostrar usuario en la navbar
(function () {
  const TOKEN_KEY = "authToken";

  function setToken(token) { localStorage.setItem(TOKEN_KEY, token); }
  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function removeToken() { localStorage.removeItem(TOKEN_KEY); }

  async function fetchCurrent() {
    const token = getToken();
    if (!token) {
      return null;
    }
    try {
      const res = await fetch("/api/sessions/current", {
        headers: { Authorization: "Bearer " + token }
      });
      if (!res.ok) {
        removeToken();
        return null;
      }
      const json = await res.json();
      return json.payload || null;
    } catch (err) {
      removeToken();
      return null;
    }
  }

  async function handleLoginForm(e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorEl = document.getElementById("login-error");
    const registerSuggest = document.getElementById("register-suggestion");
    if (errorEl) errorEl.style.display = "none";
    if (registerSuggest) registerSuggest.style.display = "none";

    try {
      const res = await fetch("/api/sessions/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      let json = {};
      try { json = await res.json(); } catch (e) {}

      if (!res.ok) {
        // usuario no existe -> mostrar sugerencia de registro
        if (res.status === 404) {
          if (registerSuggest) registerSuggest.style.display = "";
          if (errorEl) { errorEl.textContent = json.message || "Usuario no encontrado"; errorEl.style.display = "block"; }
          return;
        }

        // credenciales inválidas u otro error
        if (errorEl) { errorEl.textContent = json.message || "Credenciales incorrectas"; errorEl.style.display = "block"; }
        return;
      }

      const token = json.token;
      if (!token) {
        if (errorEl) { errorEl.textContent = "Respuesta inválida del servidor"; errorEl.style.display = "block"; }
        return;
      }

      setToken(token);
      window.location.href = "/";
    } catch (err) {
      if (errorEl) { errorEl.textContent = "Error de conexión"; errorEl.style.display = "block"; }
    }
  }

  // Manejo del formulario de registro (si estás en /register)
  async function handleRegisterForm(e) {
    e.preventDefault();
    const errorEl = document.getElementById("register-error");
    const successEl = document.getElementById("register-success");
    if (errorEl) errorEl.style.display = "none";
    if (successEl) successEl.style.display = "none";

    const first_name = document.getElementById("first_name")?.value?.trim();
    const last_name = document.getElementById("last_name")?.value?.trim();
    const email = document.getElementById("email")?.value?.trim();
    const age = Number(document.getElementById("age")?.value || 0);
    const password = document.getElementById("password")?.value;

    try {
      const res = await fetch("/api/sessions/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, email, age, password })
      });
      const json = await res.json();
      if (!res.ok) {
        if (errorEl) { errorEl.textContent = json.message || "Error en registro"; errorEl.style.display = "block"; }
        return;
      }
      if (successEl) { successEl.textContent = "Usuario creado correctamente. Redirigiendo..."; successEl.style.display = "block"; }
      // esperar 1s y redirigir a login
      setTimeout(() => window.location.href = "/login", 1000);
    } catch (err) {
      if (errorEl) { errorEl.textContent = "Error de conexión"; errorEl.style.display = "block"; }
    }
  }

  // renderizar nav: si hay usuario muestra nombre, profile y logout; si no, botón login
  async function renderNav() {
    const nav = document.getElementById("nav-user");
    if (!nav) return;
    const user = await fetchCurrent();
    toggleCartVisibility(user);

    if (user) {
      nav.innerHTML = `
        <span style="margin-right:12px">Hola, ${escapeHtml(user.first_name || user.email)}</span>
        <a href="/profile" style="margin-right:8px">Mi perfil</a>
        <button id="nav-logout">Cerrar sesión</button>
      `;
      const outBtn = document.getElementById("nav-logout");
      if (outBtn) outBtn.addEventListener("click", doLogout);
    } else {
      nav.innerHTML = `<a href="/login">Iniciar sesión</a>`;
    }
  }

  // muestra/oculta botón carrito
  function toggleCartVisibility(user) {
    const btn = document.getElementById("cart-toggle");
    if (!btn) return;
    if (user) btn.style.display = ""; // restablece display (usa reglas css por defecto)
    else btn.style.display = "none";
  }

  function escapeHtml(text) {
    return String(text || "").replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) loginForm.addEventListener("submit", handleLoginForm);

    const registerForm = document.getElementById("register-form");
    if (registerForm) registerForm.addEventListener("submit", handleRegisterForm);

    // register suggestion button already links to /register; no extra handler required

    // render nav and cart visibility as before
    if (typeof renderNav === "function") await renderNav();
    const currentUser = await fetchCurrent();
    if (typeof toggleCartVisibility === "function") toggleCartVisibility(currentUser);
  });
})();