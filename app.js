const products = [
  { id:1, name:"Camisa Blanca", price:25, desc:"Clásica de algodón.", img:"imagenes/camisa.jpg" },
  { id:2, name:"Pantalón Jeans", price:40, desc:"Jeans azules modernos.", img:"imagenes/jean.jpg" },
  { id:3, name:"Vestido Floral", price:35, desc:"Vestido fresco floral.", img:"imagenes/vestido-corto.webp" },
];

let idx = 0;
let cart = JSON.parse(localStorage.getItem("cart"))||[];
let favs = JSON.parse(localStorage.getItem("fav"))||[];

const imgEl = document.getElementById("product-img"),
      nameEl = document.getElementById("product-name"),
      descEl = document.getElementById("product-description"),
      priceEl = document.getElementById("product-price"),
      addBtn = document.getElementById("add-btn"),
      prevBtn = document.getElementById("prev-btn"),
      nextBtn = document.getElementById("next-btn"),
      favBtn = document.getElementById("fav-btn"),
      cartBtn = document.getElementById("cart-btn"),
      cartCount = document.getElementById("cart-count");

function render() {
  const p = products[idx];
  imgEl.src = p.img; imgEl.alt=p.name;
  nameEl.textContent = p.name;
  descEl.textContent = p.desc;
  priceEl.textContent = `$${p.price.toFixed(2)}`;
  cartCount.textContent = cart.length;
  favBtn.textContent = favs.includes(p.id) ? "❤️" : "🤍";
}

prevBtn.onclick = () => { idx = (idx-1+products.length)%products.length; render(); };
nextBtn.onclick = () => { idx = (idx+1)%products.length; render(); };

addBtn.onclick = () => {
  if(!cart.includes(products[idx].id)) cart.push(products[idx].id);
  localStorage.setItem("cart", JSON.stringify(cart));
  cartCount.textContent = cart.length;
};

favBtn.onclick = () => {
  const id = products[idx].id;
  favs = favs.includes(id) ? favs.filter(x=>x!==id) : [...favs,id];
  localStorage.setItem("fav", JSON.stringify(favs));
  render();
};

cartBtn.onclick = () => {
  const list = cart.map(id => {
    const p = products.find(x=>x.id===id);
    return `${p.name} — $${p.price}`;
  }).join("\n");
  const res = prompt(`Productos en carrito:\n${list || "vacío"}\n\nEscribe el nombre exacto para eliminar:`);
  if(res) {
    const toRemove = products.find(x=>x.name===res);
    if(toRemove) {
      cart = cart.filter(id => id!==toRemove.id);
      localStorage.setItem("cart", JSON.stringify(cart));
      cartCount.textContent = cart.length;
    } else alert("No encontrado");
  }
};

cartBtn.onclick = () => {
  const modal = document.createElement("div");
  modal.style = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center;
    z-index:2000;
  `;

  const box = document.createElement("div");
  box.style = `
    background:white; padding:20px; border-radius:8px; width:90%; max-width:400px;
    max-height:80vh; overflow:auto; position:relative;
  `;

  box.innerHTML = `<h2 style="margin-bottom:16px;">🛒 Tu Carrito</h2>`;

  if (cart.length === 0) {
    box.innerHTML += `<p>Tu carrito está vacío</p>`;
  } else {
    cart.forEach((id, index) => {
      const p = products.find(x => x.id === id);
      const item = document.createElement("div");
      item.style = "display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;";
      item.innerHTML = `
        <div>
          <strong>${p.name}</strong><br>
          <span>$${p.price.toFixed(2)}</span>
        </div>
        <button style="border:none; background:none; color:#c0392b; font-size:20px; cursor:pointer;">❌</button>
      `;
      item.querySelector("button").onclick = () => {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        cartCount.textContent = cart.length;
        document.body.removeChild(modal);
        cartBtn.click(); // Recargar el modal
      };
      box.appendChild(item);
    });
  }

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Cerrar";
  closeBtn.style = `
    margin-top:20px; background:#c0392b; color:white; border:none;
    padding:10px 20px; border-radius:6px; cursor:pointer;
  `;
  closeBtn.onclick = () => document.body.removeChild(modal);

  box.appendChild(closeBtn);
  modal.appendChild(box);
  document.body.appendChild(modal);
};

window.onload = render;


