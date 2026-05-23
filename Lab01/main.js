const input = document.querySelector("#product_name");
const addButton = document.querySelector(".add");
const shoppingList = document.querySelector(".shopping-list");
const rightCard = document.querySelector(".right_card");

let products = JSON.parse(localStorage.getItem("products")) || [
    {
        id: 1,
        name: "Помідори",
        amount: 2,
        bought: true,
        editing: false
    },
    {
        id: 2,
        name: "Печиво",
        amount: 2,
        bought: false,
        editing: false
    },
    {
        id: 3,
        name: "Сир",
        amount: 1,
        bought: false,
        editing: false
    }
];
function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function addProduct() {
    const name = input.value.trim();

    if (!name){ 
        return;
    }
    const newProduct = {
        id: Date.now(),
        name: name,
        amount: 1,
        bought: false,
        editing: false
    };

    products.push(newProduct);
    input.value = "";
    input.focus();

    renderProducts();
}

addButton.addEventListener("click", addProduct);
input.addEventListener("keydown", event => {
    if (event.key === "Enter"){
        addProduct();
    }
});

function renderProducts(){
    saveProducts();

    shoppingList.innerHTML = "";
   
    products.forEach(product => {
        const row = document.createElement("div");
        if (product.bought) {
            row.classList.add("product-row", "bought-row");
            row.innerHTML = `
                <span class="bought-product-name" data-id="${product.id}">${product.name}</span>
                <span class="bought-product-amount">${product.amount}</span>
                <button class="status" data-action="toggle" type="button" data-tooltip="Повернути товар у список" data-id="${product.id}">Не куплено</button>
            `;
        } else {
            row.classList.add("product-row");
            row.innerHTML = `
                ${
                    product.editing
                        ? `<input class="product-name-editiable" type="text" value="${product.name}" data-action="edit-input" data-id="${product.id}">`
                        : `<span class="product-name" data-action="start-edit" data-id="${product.id}">${product.name}</span>`
                }
                <div class="controls">
                    <button class = "minus ${product.amount === 1? "disabled" : ""}" ${product.amount === 1 ? "disabled" : ""} data-action="minus" type="button" data-tooltip="Зменшити кількість" data-id="${product.id}">-</button>
                    <span class="product-amount">${product.amount}</span>
                    <button class="plus" data-action="plus" type="button" data-tooltip="Збільшити кількість" data-id="${product.id}">+</button>
                </div>
                <button class="status" data-action="toggle" type="button" data-tooltip="Позначити як куплено" data-id="${product.id}">Куплено</button>
                <button class="delete-product" data-action="delete" type="button" data-tooltip="Видалити товар" data-id="${product.id}">×</button>
            `; 
        }
        shoppingList.appendChild(row);
    });
    const editInput = shoppingList.querySelector(".product-name-editiable");
    if (editInput) {
        editInput.focus();
        editInput.setSelectionRange(editInput.value.length, editInput.value.length);
    }
    renderStats();
}

shoppingList.addEventListener("click", event => {
    const action = event.target.dataset.action;
    const id = Number(event.target.dataset.id);

    if (!action || !id) {
        return;
    }
    if (action === "delete"){
        products = products.filter(product => product.id !== id);
        renderProducts();
        return;
    }
    const product = products.find(product => product.id === id);
    if (!product){
        return;
    }
    if (action === "plus"){
        product.amount++;
    }
    if (action === "minus"){
        if (product.amount > 1){
            product.amount--;
        }
    }
    if (action === "toggle") {
        product.bought = !product.bought;
        product.editing = false;
    }
    if (action === "start-edit") {
        product.editing = true;
    }
    renderProducts();
});
shoppingList.addEventListener("blur", event => {
    if (event.target.dataset.action !== "edit-input") {
        return;
    }
    const id = Number(event.target.dataset.id);
    const product = products.find(product => product.id === id);

    if (!product) {
        return;
    }
    const newName = event.target.value.trim();
    if (newName){
        product.name = newName;
    }
    product.editing = false;
    renderProducts();
}, true);

shoppingList.addEventListener("keydown", event => {
    if (event.target.dataset.action !== "edit-input") {
        return;
    }

    if (event.key === "Enter") {
        event.target.blur();
    }
});
function renderStats(){
    const notBoughtProducts = products.filter(product => !product.bought);
    const boughtProducts = products.filter(product => product.bought);
    rightCard.innerHTML = `
    <h2 class="left">Залишилося</h2>
    ${notBoughtProducts.map(product => `
    <span class="product-item">
        ${product.name}
        <span class="amount-left-product">${product.amount}</span>
    </span>
    `).join("")}
    <h2 class="bought">Куплено</h2>
    ${boughtProducts.map(product => `
    <span class="product-item-bought">
        ${product.name}
        <span class="amount-left-product">${product.amount}</span>
    </span>
    `).join("")}
    `;
}
renderProducts();