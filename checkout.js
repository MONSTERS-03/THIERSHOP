// @ts-nocheck

// ============================================================
// THIERSHOP — CHECKOUT
// ============================================================

const API_URL = "https://thiershop-server.onrender.com";

const DELIVERY_PRICES = {
    standard: 1500,
    express: 3000
};


// ============================================================
// PANIER
// ============================================================

function loadCheckoutCart() {

    try {

        const saved =
            localStorage.getItem("thiershop_cart");

        if (!saved) return [];

        const cart =
            JSON.parse(saved);

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error("Erreur panier :", error);

        return [];

    }

}


// ============================================================
// FORMAT PRIX
// ============================================================

function formatCheckoutPrice(price) {

    return Number(price).toLocaleString("fr-FR") + " FCFA";

}


// ============================================================
// PANIER
// ============================================================

const cart = loadCheckoutCart();


// ============================================================
// AFFICHER COMMANDE
// ============================================================

function displayCheckout() {

    const container =
        document.getElementById("checkout-items");

    const countElement =
        document.getElementById("summary-count");

    const subtotalElement =
        document.getElementById("summary-subtotal");

    if (!container) return;

    container.innerHTML = "";

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="checkout-empty">
                <div>🛒</div>
                <strong>
                    Votre panier est vide
                </strong>
                <p>
                    Ajoutez des produits avant de commander.
                </p>
            </div>
        `;

        if (countElement) {
            countElement.textContent = "0 article";
        }

        if (subtotalElement) {
            subtotalElement.textContent = "0 FCFA";
        }

        updateTotal();

        return;
    }


    let subtotal = 0;
    let count = 0;


    cart.forEach(item => {

        const price =
            Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 0;

        subtotal += price * quantity;
        count += quantity;


        const div =
            document.createElement("div");

        div.className =
            "checkout-item";


        div.innerHTML = `

            <div class="checkout-item-image">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <span>
                    ${quantity}
                </span>

            </div>

            <div class="checkout-item-info">

                <strong>
                    ${item.name}
                </strong>

                <small>
                    ${item.category || ""}
                </small>

            </div>

            <strong class="checkout-item-price">
                ${formatCheckoutPrice(
                    price * quantity
                )}
            </strong>

        `;

        container.appendChild(div);

    });


    if (countElement) {

        countElement.textContent =
            count +
            (count > 1
                ? " articles"
                : " article");

    }


    if (subtotalElement) {

        subtotalElement.textContent =
            formatCheckoutPrice(subtotal);

    }


    updateTotal();

}


// ============================================================
// LIVRAISON
// ============================================================

function getSelectedDelivery() {

    const selected =
        document.querySelector(
            'input[name="delivery"]:checked'
        );

    return selected
        ? selected.value
        : "standard";

}


// ============================================================
// TOTAL
// ============================================================

function updateTotal() {

    const subtotal =
        cart.reduce(
            (total, item) => {

                const price =
                    Number(item.price) || 0;

                const quantity =
                    Number(item.quantity) || 0;

                return total + price * quantity;

            },
            0
        );


    const delivery =
        DELIVERY_PRICES[
            getSelectedDelivery()
        ] || 0;


    const total =
        subtotal + delivery;


    const deliveryElement =
        document.getElementById(
            "summary-delivery"
        );

    const totalElement =
        document.getElementById(
            "summary-total"
        );


    if (deliveryElement) {

        deliveryElement.textContent =
            formatCheckoutPrice(delivery);

    }


    if (totalElement) {

        totalElement.textContent =
            formatCheckoutPrice(total);

    }

}


// ============================================================
// VALIDATION
// ============================================================

function validateCheckout() {

    const name =
        document.getElementById(
            "checkout-name"
        );

    const phone =
        document.getElementById(
            "checkout-phone"
        );

    const city =
        document.getElementById(
            "checkout-city"
        );

    const address =
        document.getElementById(
            "checkout-address"
        );


    const fields = [
        name,
        phone,
        city,
        address
    ];


    for (const field of fields) {

        if (!field || !field.value.trim()) {

            if (field) {
                field.focus();
            }

            alert(
                "Veuillez remplir tous les champs."
            );

            return false;

        }

    }


    return true;

}


// ============================================================
// ENVOYER LA COMMANDE AU SERVEUR
// ============================================================

async function confirmCheckout() {

    if (cart.length === 0) {

        alert(
            "Votre panier est vide."
        );

        return;

    }


    if (!validateCheckout()) {

        return;

    }


    const name =
        document.getElementById(
            "checkout-name"
        ).value.trim();

    const phone =
        document.getElementById(
            "checkout-phone"
        ).value.trim();

    const city =
        document.getElementById(
            "checkout-city"
        ).value.trim();

    const address =
        document.getElementById(
            "checkout-address"
        ).value.trim();


    const delivery =
        getSelectedDelivery();


    const deliveryPrice =
        DELIVERY_PRICES[delivery] || 0;


    const subtotal =
        cart.reduce(
            (total, item) => {

                const price =
                    Number(item.price) || 0;

                const quantity =
                    Number(item.quantity) || 0;

                return total + price * quantity;

            },
            0
        );


    const total =
        subtotal + deliveryPrice;


    const orderNumber =
        "THIER-" +
        Date.now()
            .toString()
            .slice(-6);


    const order = {

        orderNumber,

        customer: {

            name,
            phone,
            city,
            address

        },

        delivery: {

            type: delivery,

            price: deliveryPrice

        },

        items: cart,

        subtotal,

        total

    };


    try {

        const response =
            await fetch(
                `${API_URL}/api/orders`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(order)
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Erreur serveur"
            );

        }


        console.log(
            "Commande envoyée :",
            result
        );


        alert(

            "Commande enregistrée !\n\n" +

            "N° : " +
            orderNumber +

            "\nClient : " +
            name +

            "\nTotal : " +
            formatCheckoutPrice(total) +

            "\n\nConnexion au paiement Wave : prochaine étape."

        );


    } catch (error) {

        console.error(
            "Erreur commande :",
            error
        );


        alert(

            "Impossible de contacter le serveur THIERSHOP.\n\n" +

            "Vérifie que le serveur est bien lancé."

        );

    }

}


// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayCheckout();


        const deliveryInputs =
            document.querySelectorAll(
                'input[name="delivery"]'
            );


        deliveryInputs.forEach(input => {

            input.addEventListener(
                "change",
                updateTotal
            );

        });

    }
);