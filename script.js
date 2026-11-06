const products = [
    { id: 1, name: 'bengbeng', price: 5000, img: 'img/bengbeng.webp' },
    { id: 2, name: 'cimory', price: 2000, img: 'img/cimory.png' },
    { id: 3, name: 'coki-coki', price: 3000, img: 'img/coki-coki.jpg' },
    { id: 4, name: 'qtela', price: 2000, img: 'img/qtela.png' },
    { id: 5, name: 'teh pucuk', price: 5000, img: 'img/teh pucuk.avif' }
];

let cart = [];

const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID").format(number);


// Menampilkan daftar produk
function displayProduct() {
    const productsContainer = document.getElementById("product");

    if (!productsContainer) {
        console.error("Elemen #product tidak ditemukan!");
        return;
    }

    productsContainer.innerHTML = "";

    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        const img = document.createElement("img");
        img.src = product.img;
        img.alt = product.name;

        img.onerror = function () {
            console.error("Gambar tidak ditemukan:", product.img);
            img.onerror = null;
            img.alt = "Gambar tidak tersedia";
        };

        const title = document.createElement("h3");
        title.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = "Rp " + formatRupiah(product.price);

        const button = document.createElement("button");
        button.textContent = "Tambah ke Keranjang";

        button.addEventListener("click", () => {
            addToCart(product.id);
        });

        productDiv.append(img, title, price, button);
        productsContainer.appendChild(productDiv);
    });
}


// Menambah produk ke keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}


// Mengubah jumlah barang
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    updateCart();
}


// Menampilkan isi keranjang dan total harga
function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    if (!cartItemsContainer || !totalPriceElement) {
        console.error("Elemen keranjang atau total harga tidak ditemukan!");
        return;
    }

    cartItemsContainer.innerHTML = "";

    let totalPrice = 0;

    if (cart.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "Keranjang masih kosong.";
        cartItemsContainer.appendChild(emptyMessage);
    }

    cart.forEach(item => {
        const listItem = document.createElement("li");

        const itemInfo = document.createElement("span");
        itemInfo.classList.add("item-info");
        itemInfo.textContent =
            `${item.name} - Rp ${formatRupiah(item.price)} x ${item.quantity} = Rp ${formatRupiah(item.price * item.quantity)}`;

        const controls = document.createElement("div");
        controls.classList.add("quantity-controls");

        const minusButton = document.createElement("button");
        minusButton.textContent = "-";
        minusButton.setAttribute("aria-label", "Kurangi " + item.name);

        minusButton.addEventListener("click", () => {
            changeQuantity(item.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plusButton = document.createElement("button");
        plusButton.textContent = "+";
        plusButton.setAttribute("aria-label", "Tambah " + item.name);

        plusButton.addEventListener("click", () => {
            changeQuantity(item.id, 1);
        });

        controls.append(minusButton, quantity, plusButton);
        listItem.append(itemInfo, controls);
        cartItemsContainer.appendChild(listItem);

        totalPrice += item.price * item.quantity;
    });

    totalPriceElement.textContent = formatRupiah(totalPrice);
}


// Proses checkout
function checkout() {
    if (cart.length === 0) {
        alert("Keranjang Anda kosong.");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const payment = prompt(
        `Total belanja Anda Rp ${formatRupiah(total)}.\n` +
        "Masukkan jumlah pembayaran (angka saja):"
    );

    if (payment === null) return;

    const paymentText = payment.trim();

    if (!/^\d+$/.test(paymentText)) {
        alert("Masukkan pembayaran berupa angka bulat yang valid.");
        return;
    }

    const paymentAmount = Number(paymentText);

    if (!Number.isSafeInteger(paymentAmount)) {
        alert("Jumlah pembayaran terlalu besar.");
        return;
    }

    if (paymentAmount < total) {
        alert("Uang Anda tidak mencukupi.");
        return;
    }

    const change = paymentAmount - total;

    alert(
        "PEMBAYARAN BERHASIL!\n\n" +
        `Total belanja: Rp ${formatRupiah(total)}\n` +
        `Pembayaran: Rp ${formatRupiah(paymentAmount)}\n` +
        `Kembalian: Rp ${formatRupiah(change)}`
    );

    cart = [];
    updateCart();
}


// Mengosongkan keranjang
function clearCart() {
    if (cart.length === 0) {
        alert("Keranjang sudah kosong.");
        return;
    }

    const confirmClear = confirm(
        "Apakah kamu yakin ingin mengosongkan keranjang?"
    );

    if (confirmClear) {
        cart = [];
        updateCart();
    }
}


// Menjalankan program setelah HTML dimuat
document.addEventListener("DOMContentLoaded", () => {
    const checkoutButton = document.getElementById("checkout-btn");
    const clearCartButton = document.getElementById("clear-cart-btn");

    if (checkoutButton) {
        checkoutButton.addEventListener("click", checkout);
    }

    if (clearCartButton) {
        clearCartButton.addEventListener("click", clearCart);
    }

    displayProduct();
    updateCart();
});