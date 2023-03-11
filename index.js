let allProducts;
let sliceCountStart = 0;
let sliceCountEnd = 8;
const fetchProduct = () => {
    loading(true)
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(data => {
            allProducts = data;
            showProducts(data.slice(sliceCountStart, sliceCountEnd), false)
        });
}
const showProducts = (data, search) => {
    let products;
    if (data.length > 8) {
        products = data.slice(sliceCountStart, sliceCountEnd);
    } else {
        products = data;
    }
    const showMoreBtn = document.getElementById("showMore");
    if (sliceCountEnd > 20 || data.length < 8) {
        showMoreBtn.classList.add("d-none")
    } else {
        showMoreBtn.classList.remove("d-none")
    }
    const contain = document.getElementById("allProduct");
    if (search === true) {
        contain.innerHTML = "";
    }
    products.forEach(product => {
        const { image, title, description, id, price } = product;
        const div = document.createElement("div");
        div.classList.add("product", "col-3");
        div.innerHTML = `
            <div class="card h-100">
                <img src="${image}" class="card-img-top card-image" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${title.slice(0, 30)}...</h5>
                    <h6>price : $ ${price}</h6>
                    <p class="card-text">${description.slice(0, 100)}...</p>
                </div>
                <div class="card-footer">
                    <a class="btn btn-outline-secondary detailsCart" onclick="productDetails(${id})" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</a>
                    <a id="${id + 100}" class="btn btn-primary" onclick="cartDetails('${price}','${id}')" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">Add to cart</a>
                </div>
            </div>
        `
        contain.appendChild(div);
        const addToCart = document.getElementById(`${id + 100}`);
        addToCart.addEventListener("click", function () {
            addToCart.classList.add("disabled")
        });
    });
    loading(false)
}
const productDetails = (id) => {
    fetch(`https://fakestoreapi.com/products/${id}`)
        .then((res) => res.json())
        .then((data) => showDetails(data));
}
const showDetails = (data) => {
    const { title, image, description, rating, price } = data;
    document.getElementById("title").innerText = title;
    const details = document.getElementById("details-body");
    details.innerHTML = `
        <img src="${image}" class="img-fluid" alt="...">
        <div>
            <h5>price : $${price}</h5>
            <h3>Description</h3>
            <p>${description}</p>
        </div>
        <div class="rating">
            <h3>Rating : ${rating.rate}</h3>
            ${generateRating(rating.rate)}
        </div>
    `
}
const cartDetails = (price, id) => {
    fetch(`https://fakestoreapi.com/products/${id}`)
        .then((res) => res.json())
        .then((data) => addCart(data, price, id));
}
const addCart = (data, price, id) => {
    const { image, title } = data;
    const cartBody = document.getElementById("cart-body");
    cartBody.innerHTML += `
        <div class="card mb-3 cart-item">
            <div class="row g-0 align-items-center">
              <div class="col-2">
                <img src="${image}" class="cart-image rounded-start" alt="...">
              </div>
              <div class="col-10">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="card-title">${title.slice(0, 25)}...</h6>
                        <button onclick="closeBtn(${data.id})" type="button" class="btn-close closeCart"></button>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="card-text">$ <span id="${id + 200}">${price}</span></p>
                        <div class="d-flex align-items-center">
                            <button onclick="decrease('${id}','${price}')" id="decrease" class="btn btn-default countBtn"><i class="fas fa-minus"></i></button>
                            <input id="${id}" type="number" class="counter form-control text-center" value="1">
                            <button onclick="increase('${id}','${price}')" id="increase" class="btn btn-default countBtn"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
              </div>
            </div>
        </div>
    `;
    priceUpdate(price);
    const cartClose = document.getElementsByClassName("closeCart");
    for (const close of cartClose) {
        close.addEventListener("click", function () {
            close.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "none";
        })
    }
}
const closeBtn = (id) => {
    const addToCart = document.getElementById(parseInt(id) + 100);
    addToCart.classList.remove("disabled");
}
const increase = (id, price) => {
    const productPrice = parseFloat(price);
    const quantity = updateProducts(true, id);
    increasesProductPrice(quantity, id + 200, productPrice);
}
const decrease = (id, price) => {
    const productPrice = price;
    const quantity = updateProducts(false, id);
    decreasesProductPrice(quantity, id + 200, productPrice);
}
const updateProducts = (isIncrease, inputField) => {
    const countField = document.getElementById(inputField);
    const countStr = countField.value;
    const previousCount = parseInt(countStr);
    let newQuantity;
    if (isIncrease === true) {
        newQuantity = previousCount + 1;
    } else {
        if (previousCount === 1) {
            return;
        } else {
            newQuantity = previousCount - 1;
        }
    }
    countField.value = newQuantity;
    return newQuantity;
}
const setInnerText = (id, value) => {
    document.getElementById(id).innerText = parseFloat(value).toFixed(2);
}
const increasesProductPrice = (quantity, id, price) => {
    const finalPrice = quantity * price;
    updateTotal(price, true);
    setInnerText(id, finalPrice);
}

const decreasesProductPrice = (quantity, id, price) => {
    const finalPrice = quantity * price;
    if (isNaN(finalPrice)) {
        return;
    } else {
        updateTotal(price, false)
        setInnerText(id, finalPrice);
    }
}
document.getElementById("showMore").addEventListener("click", function () {
    sliceCountStart += 8
    sliceCountEnd += 8;
    fetchProduct();
});
document.getElementById("searchBtn").addEventListener("click", function () {
    loading(true)
    const inputField = document.getElementById("searchValue");
    const inputValue = inputField.value;
    const searchProduct = allProducts.filter(product => product.title.includes(`${inputValue}`));
    sliceCountStart = 0;
    sliceCountEnd = 8;
    showProducts(searchProduct, true);
})
const loading = (isLoading) => {
    const body = document.getElementById("body");
    const loader = document.getElementById("loader");
    if (isLoading) {
        body.classList.add("body")
        loader.classList.remove("d-none")
    } else {
        body.classList.remove("body")
        loader.classList.add("d-none")
    }
}
const generateRating = (rating) => {
    let ratingHtml = "";
    for (let i = 1; i <= Math.floor(rating); i++) {
        ratingHtml += `<i class="fa-solid fa-star"></i>`
    } if (rating - Math.floor(rating) > 0) {
        ratingHtml += `<i class="fa-regular fa-star-half-stroke"></i>`
    }
    return ratingHtml;
}
const priceUpdate = (price) => {
    const previousPrice = document.getElementById("total").innerText;
    const prices = parseFloat(previousPrice);
    const productPrice = prices + parseFloat(price);
    setInnerText("total", productPrice)
}
const updateTotal = (newPrice, status) => {
    const previousPrice = document.getElementById("total").innerText;
    const prices = parseFloat(previousPrice);
    if (status === true) {
        const newTotalPrice = prices + newPrice;
        setInnerText("total", newTotalPrice);
    } else {
        const newTotalPrice = prices - newPrice;
        setInnerText("total", newTotalPrice);
    }
}
fetchProduct();