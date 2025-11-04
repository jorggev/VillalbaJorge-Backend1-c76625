// cart-client.js creado para manejar la interaccion del carrito de compras en el frontend
(function () {
  const CART_KEY = "cartId";
  const cartToggleSel = "#cart-toggle";
  const cartPanelSel = "#cart-panel";
  const cartItemsSel = "#cart-items";
  const cartCountSel = "#cart-count";
  const cartTotalSel = "#cart-total";

  async function ensureCart() {
    let cid = localStorage.getItem(CART_KEY);
    if (!cid) {
      const res = await fetch("/api/cart", { method: "POST" });
      const data = await res.json();
      cid = data.payload?._id || data.payload?.id || data.payload;
      if (cid) localStorage.setItem(CART_KEY, cid);
    }
    return cid;
  }

  async function fetchCart() {
    const cid = localStorage.getItem(CART_KEY);
    if (!cid) return null;
    const res = await fetch(`/api/cart/${cid}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.payload || [];
  }

  async function addProduct(pid, qty = 1) {
    const cid = await ensureCart();
    await fetch(`/api/cart/${cid}/product/${pid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    });
    await renderCart();
  }

  async function setProductQuantity(pid, qty) {
    const cid = await ensureCart();
    await fetch(`/api/cart/${cid}/product/${pid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    });
    await renderCart();
  }

  async function removeProduct(pid) {
    const cid = await ensureCart();
    await fetch(`/api/cart/${cid}/product/${pid}`, { method: "DELETE" });
    await renderCart();
  }

  function escapeHtml(text) {
    return String(text || "").replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  async function renderCart() {
    const raw = await fetchCart();
    const cartItemsEl = document.querySelector(cartItemsSel);
    const cartCountEl = document.querySelector(cartCountSel);
    const cartTotalEl = document.querySelector(cartTotalSel);
    if (!cartItemsEl) return;

    // agregamos por producto (por si hay entradas duplicadas)
    const map = new Map();
    let total = 0;
    raw.forEach(entry => {
      const prod = entry.product || {};
      const id = String(prod._id || prod.id || prod);
      const qty = Number(entry.quantity) || 0;
      if (!map.has(id)) map.set(id, { product: prod, quantity: 0 });
      map.get(id).quantity += qty;
    });

    cartItemsEl.innerHTML = "";
    let count = 0;
    for (const [id, obj] of map.entries()) {
      const prod = obj.product;
      const qty = obj.quantity;
      count += qty;
      const price = Number(prod.price || 0);
      total += price * qty;

      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="${escapeHtml(prod.thumbnail || "")}" alt="${escapeHtml(prod.title)}">
        <div class="details">
          <div class="title">${escapeHtml(prod.title || "Producto")}</div>
          <div>Precio: ${price} × <span class="qty">${qty}</span></div>
        </div>
        <div class="actions">
          <button class="cart-decrease" data-id="${id}">-</button>
          <button class="cart-increase" data-id="${id}">+</button>
          <button class="cart-remove" data-id="${id}">Eliminar</button>
        </div>
      `;
      cartItemsEl.appendChild(div);
    }

    if (cartCountEl) cartCountEl.textContent = count;
    if (cartTotalEl) cartTotalEl.textContent = total;
  }

  function attachButtons() {
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.removeEventListener("click", btn._cartHandler);
      const handler = async function () {
        const pid = this.dataset.id;
        if (!pid) return;
        await addProduct(pid, 1);
      };
      btn._cartHandler = handler;
      btn.addEventListener("click", handler);
    });
  }

  function delegateCartActions() {
    const cartItemsEl = document.querySelector(cartItemsSel);
    if (!cartItemsEl) return;
    cartItemsEl.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (!id) return;
      if (e.target.classList.contains("cart-remove")) {
        await removeProduct(id);
      } else if (e.target.classList.contains("cart-increase")) {
        // aumentar en 1 (obtenemos cantidad actual y sumamos)
        const qtyEl = e.target.closest(".cart-item").querySelector(".qty");
        const current = Number(qtyEl?.textContent || 0);
        await setProductQuantity(id, current + 1);
      } else if (e.target.classList.contains("cart-decrease")) {
        const qtyEl = e.target.closest(".cart-item").querySelector(".qty");
        const current = Number(qtyEl?.textContent || 0);
        const next = Math.max(0, current - 1);
        await setProductQuantity(id, next);
      }
    });
  }

  function attachCartToggle() {
    const toggle = document.querySelector(cartToggleSel);
    const panel = document.querySelector(cartPanelSel);
    const close = document.querySelector("#cart-close");
    const clear = document.querySelector("#cart-clear");

    if (toggle && panel) {
      toggle.addEventListener("click", () => {
        panel.classList.toggle("open");
        panel.setAttribute("aria-hidden", !panel.classList.contains("open"));
      });
    }
    if (close && panel) {
      close.addEventListener("click", () => {
        panel.classList.remove("open");
        panel.setAttribute("aria-hidden", "true");
      });
    }
    if (clear) {
      clear.addEventListener("click", async () => {
        const cid = localStorage.getItem(CART_KEY);
        if (!cid) return;
        // eliminar cada producto vía API (simpler: set each to 0)
        const items = await fetch(`/api/cart/${cid}`).then(r => r.json()).then(d => d.payload || []);
        for (const e of items) {
          const pid = e.product?._id || e.product;
          await fetch(`/api/cart/${cid}/product/${pid}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: 0 })
          });
        }
        await renderCart();
      });
    }
  }

  // Inicializamos el carrito al cargar la página
  document.addEventListener("DOMContentLoaded", async () => {
    await ensureCart();
    attachButtons();
    attachCartToggle();
    delegateCartActions();
    await renderCart();
  });

})();