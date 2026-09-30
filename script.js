/* =====================================
   NOVACART - TASK 5
===================================== */


/* =====================================
   SELECT ELEMENTS
===================================== */

const productGrid =
    document.getElementById("productGrid");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const sortFilter =
    document.getElementById("sortFilter");

const loading =
    document.getElementById("loading");

const noProducts =
    document.getElementById("noProducts");

const apiMessage =
    document.getElementById("apiMessage");

const cartButton =
    document.getElementById("cartButton");

const closeCartButton =
    document.getElementById("closeCart");

const cartSidebar =
    document.getElementById("cartSidebar");

const overlay =
    document.getElementById("overlay");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const checkoutButton =
    document.getElementById("checkoutButton");

const menuButton =
    document.getElementById("menuButton");

const navMenu =
    document.getElementById("navMenu");


/* =====================================
   VARIABLES
===================================== */

let products = [];

let cart =
    JSON.parse(
        localStorage.getItem("novaCart")
    ) || [];


/* =====================================
   FALLBACK PRODUCTS
   Used if API is unavailable
===================================== */

const fallbackProducts = [

    {
        id: 101,

        title: "Wireless Headphones",

        price: 2499,

        category: "electronics",

        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",

        rating: 4.5,

        reviews: 120
    },


    {
        id: 102,

        title: "Smart Watch",

        price: 3999,

        category: "electronics",

        image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",

        rating: 4.3,

        reviews: 95
    },


    {
        id: 103,

        title: "Classic T-Shirt",

        price: 1299,

        category: "fashion",

        image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80",

        rating: 4.2,

        reviews: 80
    },


    {
        id: 104,

        title: "Running Shoes",

        price: 2999,

        category: "fashion",

        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",

        rating: 4.6,

        reviews: 150
    },


    {
        id: 105,

        title: "Elegant Necklace",

        price: 1999,

        category: "jewelry",

        image:
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80",

        rating: 4.7,

        reviews: 110
    },


    {
        id: 106,

        title: "Laptop Backpack",

        price: 1799,

        category: "fashion",

        image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80",

        rating: 4.4,

        reviews: 75
    },


    {
        id: 107,

        title: "Bluetooth Speaker",

        price: 2199,

        category: "electronics",

        image:
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=500&q=80",

        rating: 4.5,

        reviews: 88
    },


    {
        id: 108,

        title: "Sunglasses",

        price: 999,

        category: "fashion",

        image:
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80",

        rating: 4.1,

        reviews: 65
    }

];


/* =====================================
   LOAD PRODUCTS FROM API
===================================== */

async function loadProducts() {

    loading.style.display = "block";

    noProducts.style.display = "none";

    apiMessage.textContent = "";


    try {

        const response =
            await fetch(
                "https://fakestoreapi.com/products"
            );


        if (!response.ok) {

            throw new Error(
                "API request failed"
            );
        }


        const apiProducts =
            await response.json();


        /*
            Convert API products into
            our own product structure.
        */

        products =
            apiProducts.map(product => {

                let category = "fashion";


                if (
                    product.category ===
                    "electronics"
                ) {

                    category =
                        "electronics";

                }


                else if (
                    product.category ===
                    "jewelery"
                ) {

                    category =
                        "jewelry";

                }


                return {

                    id: product.id,

                    title: product.title,

                    price:
                        Math.round(
                            product.price * 85
                        ),

                    category: category,

                    image: product.image,

                    rating:
                        product.rating.rate,

                    reviews:
                        product.rating.count
                };

            });


        apiMessage.textContent =
            "Products loaded from API.";


    }

    catch (error) {

        /*
            If API fails, use local
            fallback products.
        */

        products =
            fallbackProducts;


        apiMessage.textContent =
            "API unavailable — showing local products.";

        console.log(
            "API failed. Fallback products loaded."
        );

    }


    loading.style.display = "none";


    displayProducts(products);

}


/* =====================================
   DISPLAY PRODUCTS
===================================== */

function displayProducts(items) {

    productGrid.innerHTML = "";


    if (items.length === 0) {

        noProducts.style.display =
            "block";

        return;
    }


    noProducts.style.display =
        "none";


    const fragment =
        document.createDocumentFragment();


    items.forEach(product => {

        const card =
            document.createElement("article");


        card.className =
            "product-card";


        card.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.title}"
                class="product-image"
                loading="lazy"
            >

            <h3>
                ${product.title}
            </h3>

            <p class="category">
                ${product.category}
            </p>

            <p class="rating">
                ⭐ ${product.rating}
                (${product.reviews})
            </p>

            <div class="product-bottom">

                <span class="price">
                    ₹${product.price}
                </span>

                <button
                    type="button"
                    class="add-button"
                    data-id="${product.id}"
                >
                    Add
                </button>

            </div>
        `;


        fragment.appendChild(card);

    });


    productGrid.appendChild(fragment);

}


/* =====================================
   SEARCH + FILTER + SORT
===================================== */

function updateProducts() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        categoryFilter.value;


    const selectedSort =
        sortFilter.value;


    let filteredProducts =
        products.filter(product => {

            const matchesSearch =
                product.title
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                selectedCategory === "all" ||
                product.category ===
                selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    /* PRICE LOW TO HIGH */

    if (
        selectedSort ===
        "price-low"
    ) {

        filteredProducts.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    /* PRICE HIGH TO LOW */

    if (
        selectedSort ===
        "price-high"
    ) {

        filteredProducts.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    /* RATING HIGH TO LOW */

    if (
        selectedSort ===
        "rating"
    ) {

        filteredProducts.sort(
            (a, b) =>
                b.rating - a.rating
        );

    }


    displayProducts(
        filteredProducts
    );

}


/* =====================================
   FILTER EVENTS
===================================== */

searchInput.addEventListener(
    "input",
    updateProducts
);


categoryFilter.addEventListener(
    "change",
    updateProducts
);


sortFilter.addEventListener(
    "change",
    updateProducts
);


/* =====================================
   ADD PRODUCT TO CART
===================================== */

productGrid.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".add-button"
            );


        if (!button) {
            return;
        }


        const productId =
            Number(
                button.dataset.id
            );


        const existingProduct =
            cart.find(
                item =>
                    item.id === productId
            );


        if (existingProduct) {

            existingProduct.quantity++;

        }

        else {

            cart.push({

                id: productId,

                quantity: 1

            });

        }


        saveCart();

        updateCart();

        openCart();

    }
);


/* =====================================
   SAVE CART
===================================== */

function saveCart() {

    localStorage.setItem(
        "novaCart",
        JSON.stringify(cart)
    );

}


/* =====================================
   UPDATE CART
===================================== */

function updateCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <p class="empty-cart">
                Your cart is empty.
            </p>

        `;


        cartCount.textContent = "0";

        cartTotal.textContent = "₹0";

        return;
    }


    let total = 0;

    let totalItems = 0;


    cart.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id === item.id
            );


        if (!product) {
            return;
        }


        total +=
            product.price *
            item.quantity;


        totalItems +=
            item.quantity;


        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.title}"
            >

            <div>

                <h4>
                    ${product.title}
                </h4>

                <span class="cart-price">
                    ₹${product.price}
                </span>

                <div class="quantity-controls">

                    <button
                        type="button"
                        data-action="decrease"
                        data-id="${product.id}"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        data-action="increase"
                        data-id="${product.id}"
                    >
                        +
                    </button>

                    <button
                        type="button"
                        class="remove-item"
                        data-action="remove"
                        data-id="${product.id}"
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;


        cartItems.appendChild(
            cartItem
        );

    });


    cartCount.textContent =
        totalItems;


    cartTotal.textContent =
        `₹${total}`;

}


/* =====================================
   CART BUTTONS
===================================== */

cartItems.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (!button) {
            return;
        }


        const productId =
            Number(
                button.dataset.id
            );


        const action =
            button.dataset.action;


        const item =
            cart.find(
                product =>
                    product.id ===
                    productId
            );


        if (!item) {
            return;
        }


        if (
            action ===
            "increase"
        ) {

            item.quantity++;

        }


        if (
            action ===
            "decrease"
        ) {

            item.quantity--;

            if (item.quantity <= 0) {

                cart =
                    cart.filter(
                        product =>
                            product.id !==
                            productId
                    );

            }

        }


        if (
            action ===
            "remove"
        ) {

            cart =
                cart.filter(
                    product =>
                        product.id !==
                        productId
                );

        }


        saveCart();

        updateCart();

    }
);


/* =====================================
   OPEN CART
===================================== */

function openCart() {

    cartSidebar.classList.add(
        "open"
    );

    overlay.classList.add(
        "show"
    );

}


/* =====================================
   CLOSE CART
===================================== */

function closeCart() {

    cartSidebar.classList.remove(
        "open"
    );

    overlay.classList.remove(
        "show"
    );

}


cartButton.addEventListener(
    "click",
    openCart
);


closeCartButton.addEventListener(
    "click",
    closeCart
);


overlay.addEventListener(
    "click",
    closeCart
);


/* =====================================
   CHECKOUT
===================================== */

checkoutButton.addEventListener(
    "click",
    function() {

        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;
        }


        alert(
            "Order placed successfully! 🎉"
        );


        cart = [];


        saveCart();

        updateCart();

        closeCart();

    }
);


/* =====================================
   CONTACT FORM VALIDATION
===================================== */

const contactForm =
    document.getElementById(
        "contactForm"
    );


contactForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "name"
            );

        const email =
            document.getElementById(
                "email"
            );

        const message =
            document.getElementById(
                "message"
            );


        const nameError =
            document.getElementById(
                "nameError"
            );

        const emailError =
            document.getElementById(
                "emailError"
            );

        const messageError =
            document.getElementById(
                "messageError"
            );

        const success =
            document.getElementById(
                "formSuccess"
            );


        nameError.textContent = "";

        emailError.textContent = "";

        messageError.textContent = "";

        success.textContent = "";


        let valid = true;


        /* NAME */

        if (
            name.value.trim() === ""
        ) {

            nameError.textContent =
                "Please enter your name.";

            valid = false;
        }


        /* EMAIL */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            email.value.trim() === ""
        ) {

            emailError.textContent =
                "Please enter your email.";

            valid = false;

        }

        else if (
            !emailPattern.test(
                email.value.trim()
            )
        ) {

            emailError.textContent =
                "Please enter a valid email.";

            valid = false;

        }


        /* MESSAGE */

        if (
            message.value.trim() === ""
        ) {

            messageError.textContent =
                "Please enter a message.";

            valid = false;

        }


        /* SUCCESS */

        if (valid) {

            success.textContent =
                "✓ Message submitted successfully!";

            contactForm.reset();

        }

    }
);


/* =====================================
   MOBILE MENU
===================================== */

menuButton.addEventListener(
    "click",
    function() {

        navMenu.classList.toggle(
            "show"
        );

    }
);


navMenu.addEventListener(
    "click",
    function(event) {

        if (
            event.target.tagName ===
            "A"
        ) {

            navMenu.classList.remove(
                "show"
            );

        }

    }
);


/* =====================================
   INITIALIZE APPLICATION
===================================== */

loadProducts();

updateCart();