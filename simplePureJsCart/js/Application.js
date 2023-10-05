const cartState = {};

const listOfItems = [
    {
        itemName: "Велик 1",
        itemPrice: "200",
        itemImg: "bicycle1.png"
    },
    {
        itemName: "Велик 2",
        itemPrice: "220",
        itemImg: "bicycle1.png"
    },
    {
        itemName: "Велик 3",
        itemPrice: "250",
        itemImg: "bicycle1.png"
    }
];

drawCatalogue = (appendTo) => {
    if (!appendTo || appendTo === "") {
        return;
    }
    const appendToDiv = document.querySelector(appendTo);
    if (!appendToDiv) {
        return;
    }
    listOfItems.forEach((catalogueItem) => {
        const catalogueItemDiv = document.createElement("div");
        catalogueItemDiv.classList.add("catalogue-item");

        const itemImg = document.createElement("img");
        itemImg.src = "./images/" + catalogueItem.itemImg;

        const itemName = document.createElement("div");
        itemName.classList.add("item-name");
        const itemNameTextNode = document.createTextNode(catalogueItem.itemName);
        itemName.appendChild(itemNameTextNode);

        const itemPrice = document.createElement("div");
        itemPrice.classList.add("item-name");
        const itemPriceTextNode = document.createTextNode("$" + catalogueItem.itemPrice);
        itemPrice.appendChild(itemPriceTextNode);

        const toCartButton = document.createElement("div");
        toCartButton.classList.add("add-item-to-cart");
        const toCartButtonTextNode = document.createTextNode("в корзину");
        toCartButton.appendChild(toCartButtonTextNode);

        toCartButton.addEventListener("click", () => {
            addToCart(catalogueItem);
        });

        catalogueItemDiv.appendChild(itemImg);
        catalogueItemDiv.appendChild(itemName);
        catalogueItemDiv.appendChild(itemPrice);
        catalogueItemDiv.appendChild(toCartButton);
        appendToDiv.appendChild(catalogueItemDiv);
    });
}

addToCart = (item) => {
    let itemState = cartState[item.itemName];
    if (!itemState) {
        cartState[item.itemName] = {...item, price: 0, count: 0};
        itemState = cartState[item.itemName];
    }
    itemState.count += 1;
    itemState.price = itemState.count * item.itemPrice;

    updateCartContents();
}

updateCartContents = () => {
    const cartItemsContainer = document.querySelector(".cart-items-container");
    const checkoutBtn = document.querySelector(".checkout-button .amount");
    const cartItemsAmount = document.querySelector(".cart-indicator");
    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;
    let totalAmount = 0;
    for (let itemKey in cartState) {
        const newItem = cartState[itemKey];

        totalPrice += parseInt(newItem.itemPrice) * parseInt(newItem.count);
        totalAmount += parseInt(newItem.count);

        const cartItemDiv = document.createElement("div");
        cartItemDiv.classList.add("cart-item");

        const cartControlsDiv = document.createElement("div");
        cartControlsDiv.classList.add("cart-item-controls");

        const itemImg = document.createElement("img");
        itemImg.src = "./images/" + newItem.itemImg;

        const cartItemDscDiv = document.createElement("div");
        cartItemDscDiv.classList.add("item-dsc");

        const itemName = document.createElement("div");
        itemName.classList.add("item-name");
        const itemNameTextNode = document.createTextNode(newItem.itemName);
        itemName.appendChild(itemNameTextNode);

        const itemCount = document.createElement("div");
        itemCount.classList.add("item-count");
        const itemCountTextNode = document.createTextNode(newItem.count);
        itemCount.appendChild(itemCountTextNode);

        const itemPrice = document.createElement("div");
        itemPrice.classList.add("item-name");
        const itemPriceTextNode = document.createTextNode("$" + newItem.itemPrice);
        itemPrice.appendChild(itemPriceTextNode);

        const decreaseCount = document.createElement("div");
        decreaseCount.classList.add("btn");
        decreaseCount.classList.add("decrease");
        const decreaseCountTextNode = document.createTextNode("-");
        decreaseCount.appendChild(decreaseCountTextNode);

        decreaseCount.addEventListener("click", () => {
            newItem.count -= 1;
            if (newItem.count > 0) {
                totalPrice -= parseInt(newItem.itemPrice);
                totalAmount -= 1;
                itemCount.innerHTML = newItem.count;
                checkoutBtn.innerHTML = totalPrice;
                cartItemsAmount.innerHTML = totalAmount;
                return;
            }
            newItem.count = 1;
        });

        const increaseCount = document.createElement("div");
        increaseCount.classList.add("btn");
        increaseCount.classList.add("increase");
        const increaseCountTextNode = document.createTextNode("+");
        increaseCount.appendChild(increaseCountTextNode);

        increaseCount.addEventListener("click", () => {
            newItem.count += 1;
            itemCount.innerHTML = newItem.count;
            totalAmount += 1;
            totalPrice += parseInt(newItem.itemPrice);
            checkoutBtn.innerHTML = totalPrice;
            cartItemsAmount.innerHTML = totalAmount;
        });

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid");
        deleteIcon.classList.add("fa-trash");

        const deleteItemDiv = document.createElement("div");
        deleteItemDiv.classList.add("btn");
        deleteItemDiv.appendChild(deleteIcon);

        deleteItemDiv.addEventListener("click", () => {
            totalPrice -= parseInt(newItem.itemPrice) * parseInt(newItem.count);
            totalAmount -= newItem.count;
            delete cartState[itemKey];
            decreaseCount.remove();
            increaseCount.remove();
            deleteItemDiv.remove();
            cartControlsDiv.remove();
            itemName.remove();
            itemPrice.remove();
            itemCount.remove();
            cartItemDscDiv.remove();
            itemImg.remove();
            cartItemDscDiv.remove();
            cartItemDiv.remove();
            checkoutBtn.innerHTML = totalPrice;
            cartItemsAmount.innerHTML = totalAmount;

            if (Object.keys(cartState).length === 0) {
                cartItemsContainer.innerHTML = "<div class='empty-cart'>корзина пуста</div>";
            }
        });

        cartControlsDiv.appendChild(decreaseCount);
        cartControlsDiv.appendChild(increaseCount);
        cartControlsDiv.appendChild(deleteItemDiv);

        cartItemDscDiv.appendChild(itemName);
        cartItemDscDiv.appendChild(itemPrice);
        cartItemDscDiv.appendChild(itemCount);
        cartItemDscDiv.appendChild(cartControlsDiv);

        cartItemDiv.appendChild(itemImg);
        cartItemDiv.appendChild(cartItemDscDiv);
        cartItemsContainer.appendChild(cartItemDiv);
    }

    checkoutBtn.innerHTML = totalPrice;
    cartItemsAmount.innerHTML = totalAmount;
}

toggleCart = () => {
    const cartButton = document.querySelector(".cart-header");
    if (!cartButton) {
        return;
    }
    const cartContents = cartButton.querySelector(".cart-contents");
    if (!cartContents) {
        return;
    }
    cartButton.addEventListener("click", (e) => {
        if (cartContents.contains(e.target) || e.target.classList.contains("fa-trash")
            || e.target.classList.contains("btn")) {
            return;
        }
        cartContents.style.display = cartContents.style.display === "none" ||
        cartContents.style.display === "" ? "block" : "none";
    });
}

(function () {
    toggleCart();
    drawCatalogue(".catalogue");
})()
