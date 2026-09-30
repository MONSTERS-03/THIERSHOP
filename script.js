// @ts-nocheck

// ============================================================
// THIERSHOP — SCRIPT
// ============================================================


// ============================================================
// PRODUITS
// ============================================================

const products = [

    {
        id: 1,
        name: "T-shirt Premium",
        category: "Vêtements",
        price: 8500,
        oldPrice: 11000,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 2,
        name: "Ensemble Streetwear",
        category: "Vêtements",
        price: 18000,
        oldPrice: 23000,
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 3,
        name: "Sneakers Urban",
        category: "Chaussures",
        price: 25000,
        oldPrice: 30000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 4,
        name: "Sneakers Classic",
        category: "Chaussures",
        price: 22000,
        oldPrice: 27000,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 5,
        name: "Sac à main",
        category: "Accessoires",
        price: 15000,
        oldPrice: 19000,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 6,
        name: "Parfum Premium",
        category: "Beauté",
        price: 12000,
        oldPrice: 16000,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 7,
        name: "Chemise Élégante",
        category: "Vêtements",
        price: 14000,
        oldPrice: 18000,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 8,
        name: "Chemise Élégante",
        category: "Vêtements",
        price: 28000,
        oldPrice: 34000,
        image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80"
    }

];


// ============================================================
// ÉTAT
// ============================================================

let cart = loadCart();
let favorites = loadFavorites();

let currentCategory = "Tous";
let currentSearch = "";


// ============================================================
// PRIX
// ============================================================

function formatPrice(price) {

    return price.toLocaleString("fr-FR") + " FCFA";

}


function getDiscount(product) {

    if (!product.oldPrice || product.oldPrice <= product.price) {
        return 0;
    }

    return Math.round(
        ((product.oldPrice - product.price) /
        product.oldPrice) * 100
    );

}


// ============================================================
// LOCAL STORAGE — PANIER
// ============================================================

function saveCart() {

    localStorage.setItem(
        "thiershop_cart",
        JSON.stringify(cart)
    );

}


function loadCart() {

    try {

        const saved =
            localStorage.getItem("thiershop_cart");

        if (!saved) {
            return [];
        }

        const parsed = JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        return [];

    }

}


// ============================================================
// LOCAL STORAGE — FAVORIS
// ============================================================

function saveFavorites() {

    localStorage.setItem(
        "thiershop_favorites",
        JSON.stringify(favorites)
    );

}


function loadFavorites() {

    try {

        const saved =
            localStorage.getItem("thiershop_favorites");

        if (!saved) {
            return [];
        }

        const parsed = JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        return [];

    }

}


// ============================================================
// CARTE PRODUIT
// ============================================================

function createProductCard(product) {

    const card =
        document.createElement("div");

    card.className = "product";

    const isFavorite =
        favorites.includes(product.id);

    const discount =
        getDiscount(product);

    card.innerHTML = `

        <div class="product-visual">

            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            ${
                discount > 0
                    ? `
                        <span class="product-discount">
                            -${discount}%
                        </span>
                    `
                    : ""
            }

            <button
                class="favorite-button ${
                    isFavorite ? "is-favorite" : ""
                }"
                onclick="toggleFavorite(${product.id})"
                aria-label="Ajouter aux favoris"
            >
                ${isFavorite ? "♥" : "♡"}
            </button>

        </div>


        <div class="product-info">

            <div class="product-category">
                ${product.category}
            </div>

            <h3 class="product-name">
                ${product.name}
            </h3>

            <div class="product-prices">

                <span class="product-price">
                    ${formatPrice(product.price)}
                </span>

                ${
                    product.oldPrice
                        ? `
                            <span class="product-old-price">
                                ${formatPrice(product.oldPrice)}
                            </span>
                        `
                        : ""
                }

            </div>

            <button
                class="add-button"
                onclick="addToCart(${product.id})"
            >
                Ajouter au panier
            </button>

        </div>
    `;

    return card;

}


// ============================================================
// AFFICHER LES PRODUITS
// ============================================================

function displayProducts(list = products) {

    const container =
        document.getElementById("products");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (list.length === 0) {

        container.innerHTML = `
            <div class="no-products">
                <strong>Aucun produit trouvé</strong>
                <br>
                <span>
                    Essayez une autre recherche ou catégorie.
                </span>
            </div>
        `;

        return;

    }

    list.forEach(product => {

        container.appendChild(
            createProductCard(product)
        );

    });

}


// ============================================================
// OFFRES
// ============================================================

function displayOffers() {

    const container =
        document.getElementById("offers-products");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const offers =
        products
            .filter(product =>
                getDiscount(product) > 0
            )
            .slice(0, 4);

    offers.forEach(product => {

        container.appendChild(
            createProductCard(product)
        );

    });

}


// ============================================================
// RECHERCHE + FILTRE
// ============================================================

function applyFilters() {

    const query =
        currentSearch
            .toLowerCase()
            .trim();

    let results = [...products];

    if (currentCategory !== "Tous") {

        results =
            results.filter(product =>
                product.category === currentCategory
            );

    }

    if (query) {

        results =
            results.filter(product => {

                const name =
                    product.name.toLowerCase();

                const category =
                    product.category.toLowerCase();

                return (
                    name.includes(query) ||
                    category.includes(query)
                );

            });

    }

    displayProducts(results);

}


function searchProducts() {

    const input =
        document.getElementById("search");

    if (!input) {
        return;
    }

    currentSearch = input.value;

    const shopSearch =
        document.getElementById("product-search");

    if (shopSearch) {
        shopSearch.value = input.value;
    }

    applyFilters();

}


function searchProductsFromShop() {

    const input =
        document.getElementById("product-search");

    if (!input) {
        return;
    }

    currentSearch = input.value;

    const headerSearch =
        document.getElementById("search");

    if (headerSearch) {
        headerSearch.value = input.value;
    }

    applyFilters();

}


function filterProducts(category) {

    currentCategory =
        category || "Tous";

    const select =
        document.getElementById("categoryFilter");

    if (select) {
        select.value = currentCategory;
    }

    applyFilters();

    scrollToProducts();

}


function scrollToProducts() {

    const section =
        document.getElementById("boutique");

    if (!section) {
        return;
    }

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ============================================================
// PANIER
// ============================================================

function addToCart(id) {

    const existing =
        cart.find(item =>
            item.id === id
        );

    if (existing) {

        existing.quantity++;

    } else {

        const product =
            products.find(item =>
                item.id === id
            );

        if (!product) {
            return;
        }

        cart.push({
            ...product,
            quantity: 1
        });

    }

    saveCart();

    updateCart();

    showMessage(
        "Produit ajouté au panier 🛒"
    );

}


function updateCart() {

    const countElement =
        document.getElementById("cart-count");

    const container =
        document.getElementById("cart-items");

    const totalElement =
        document.getElementById("cart-total");


    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    if (countElement) {
        countElement.textContent = count;
    }


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML = `
            <div class="no-products">
                Votre panier est vide 🛒
            </div>
        `;

        if (totalElement) {
            totalElement.textContent = "0 FCFA";
        }

        return;

    }


    let total = 0;


    cart.forEach(item => {

        total +=
            item.price * item.quantity;

        const div =
            document.createElement("div");

        div.className =
            "cart-product";

        div.innerHTML = `

            <div class="cart-product-info">

                <strong>
                    ${item.name}
                </strong>

                <br>

                <small>
                    ${formatPrice(item.price)}
                </small>

            </div>

            <div class="quantity">

                <button
                    onclick="changeQuantity(${item.id}, -1)"
                >
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="changeQuantity(${item.id}, 1)"
                >
                    +
                </button>

            </div>
        `;

        container.appendChild(div);

    });


    if (totalElement) {

        totalElement.textContent =
            formatPrice(total);

    }

}


function changeQuantity(id, change) {

    const item =
        cart.find(product =>
            product.id === id
        );

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {

        cart =
            cart.filter(product =>
                product.id !== id
            );

    }

    saveCart();

    updateCart();

}


// ============================================================
// MODALE PANIER
// ============================================================

function openCart() {

    const modal =
        document.getElementById("cart-modal");

    if (!modal) {
        return;
    }

    updateCart();

    modal.style.display = "block";

}


function closeCart() {

    const modal =
        document.getElementById("cart-modal");

    if (modal) {
        modal.style.display = "none";
    }

}


// ============================================================
// CHECKOUT
// ============================================================

function openCheckout() {

    if (cart.length === 0) {

        showMessage(
            "Votre panier est vide."
        );

        return;

    }

    window.location.href =
        "./checkout.html";

}


function closeCheckout() {

    const modal =
        document.getElementById("checkout-modal");

    if (modal) {
        modal.style.display = "none";
    }

}


// ============================================================
// FAVORIS
// ============================================================

function toggleFavorite(id) {

    const index =
        favorites.indexOf(id);

    if (index === -1) {

        favorites.push(id);

        showMessage(
            "Produit ajouté aux favoris ❤️"
        );

    } else {

        favorites.splice(index, 1);

        showMessage(
            "Produit retiré des favoris."
        );

    }

    saveFavorites();

    applyFilters();

}


function showFavorites() {

    const favoriteProducts =
        products.filter(product =>
            favorites.includes(product.id)
        );

    if (favoriteProducts.length === 0) {

        showMessage(
            "Vous n'avez encore aucun favori ❤️"
        );

        return;

    }

    currentCategory = "Tous";
    currentSearch = "";

    const headerSearch =
        document.getElementById("search");

    const shopSearch =
        document.getElementById("product-search");

    if (headerSearch) {
        headerSearch.value = "";
    }

    if (shopSearch) {
        shopSearch.value = "";
    }

    displayProducts(favoriteProducts);

    scrollToProducts();

}


// ============================================================
// MESSAGE
// ============================================================

function showMessage(message) {

    alert(message);

}


// ============================================================
// CLIC EN DEHORS DES MODALES
// ============================================================

window.addEventListener(
    "click",
    function(event) {

        const cartModal =
            document.getElementById("cart-modal");

        const checkoutModal =
            document.getElementById("checkout-modal");

        if (event.target === cartModal) {
            closeCart();
        }

        if (event.target === checkoutModal) {
            closeCheckout();
        }

    }
);


// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayProducts();

        displayOffers();

        updateCart();

    }
);


// ============================================================
// ACCESSIBILITÉ DES FONCTIONS HTML
// ============================================================

window.searchProducts = searchProducts;
window.searchProductsFromShop = searchProductsFromShop;
window.filterProducts = filterProducts;
window.scrollToProducts = scrollToProducts;

window.addToCart = addToCart;
window.changeQuantity = changeQuantity;

window.openCart = openCart;
window.closeCart = closeCart;

window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;

window.toggleFavorite = toggleFavorite;
window.showFavorites = showFavorites;

window.showMessage = showMessage;