var xhr = new XMLHttpRequest();
var numOfProducts = document.querySelector(".numOfProducts");
let arr = document.cookie.slice(document.cookie.indexOf("=") + 1).split(",");
var productsIds = new Set([...arr]);
productsIds.delete("");

var products;
if (numOfProducts && productsIds) {
  numOfProducts.innerHTML = productsIds.size;
}
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
    var response = xhr.response;
    products = JSON.parse(response);
    let categories = new Set();
    for (let i = 0; i < products.length; i++) {
      categories.add(products[i].category);
    }
    categories = [...categories];
    let arr = [];
    for (let i = 0; i < categories.length; i++) {
      let counter = 0;
      for (let j = 0; j < products.length; j++) {
        if (products[j].category == categories[i]) {
          counter++;
        }
      }
      arr[categories[i]] = counter;
    }
    var body = document.querySelector("body");
    if (getCurrentPage() == "index.html") {
      let counter = 1;
      for (let key in arr) {
        let value = arr[key];
        let section = document.createElement("section");
        section.classList.add(`${counter}th`);
        section.innerHTML = `<div class="header">
                                <div class="name">
                                    <b>
                                        ${
                                          key.charAt(0).toUpperCase() +
                                          key.slice(1)
                                        }
                                    </b>(${value} items)
                                </div>
                                <div class="sort">
                                    Sort By:<span class="by">
                                        Best Match <i class="fa-solid fa-chevron-down"></i>
                                    </span>
                                </div>
                            </div>`;
        let sectionBody = document.createElement("div");
        sectionBody.classList.add("body");
        for (let index = 0; index < products.length; index++) {
          if (products[index].category == key) {
            let product = document.createElement("div");
            product.classList.add("card");
            let rating = products[index].rating.rate;
            let starContainer = document.createElement("div");
            starContainer.classList.add("rate");
            let fullStars = Math.floor(rating);
            let halfStar = rating % 1 >= 0.5;
            let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
            for (let i = 0; i < fullStars; i++) {
              let fullStar = document.createElement("i");
              fullStar.classList.add("fas", "fa-star");
              starContainer.appendChild(fullStar);
            }
            if (halfStar) {
              let halfStarElement = document.createElement("i");
              halfStarElement.classList.add("fas", "fa-star-half-alt");
              starContainer.appendChild(halfStarElement);
            }
            for (let i = 0; i < emptyStars; i++) {
              let emptyStar = document.createElement("i");
              emptyStar.classList.add("far", "fa-star");
              starContainer.appendChild(emptyStar);
            }
            product.innerHTML = `
              <div class="image" onclick="goToProductPage(${products[index].id})">
                <img src="${products[index].image}" alt="" />
                <div class="title">${products[index].title}</div>
              </div>
              <div class="content">
                <div class="price">${products[index].price} EGP</div>
                <div class="discount">4.5555.0 EGP</div>
                <div class="free">Free Shipping</div>
                <button class="add" id="the${products[index].id}" onclick="addToCart(${products[index].id})">ADD TO CART</button>
              </div>
            `;
            let contentDiv = product.querySelector(".content");

            contentDiv.insertBefore(starContainer, contentDiv.children[1]);
            sectionBody.appendChild(product);
          }
        }

        section.appendChild(sectionBody);
        body.appendChild(section);
      }
    } else if (getCurrentPage() == "cart.html") {
      let h1 = document.querySelector(".container h1");
      h1.innerHTML = `Shopping Cart (${productsIds.size})`;
      let left = document.querySelector(".container .left");
      let right = document.querySelector(".container .right .up .total p");
      let arr = [...productsIds];
      for (let i = 0; i < products.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (products[i].id == arr[j]) {
            let propertyContent = "";
            for (let property in products[i]) {
              propertyContent += `
              <div class="row">
                <div class="first">${property}</div>
                <div class="second">${products[i][property]}</div>
              </div>`;
            }
            let card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
            <div class="image">
              <img src="${products[i].image}" alt="" />
            </div>
            <div class="content">
              <div class="name"> 
                ${products[i].title}
              </div>
              <div class="details">
                <div class="price">${products[i].price} EGP</div>
                <div class="quantity">
                  <span>QTY</span>
                  <input type="number" min="1" max="10" id="id${products[i].id}" value="1" onchange="getTotal()"/>
                </div>
              </div>
              <div class="free">
                <i class="fa-solid fa-check"></i>
                Free Shipping
              </div>
          <div class="info">
            ${propertyContent}
          </div>
          </div>
          <div class="footer">
            <span class="save">Save for Later</span>
            <span class="delete" id="The${products[i].id}" onclick=deleteFromCart(${products[i].id})>Delete</span>
          </div>
          `;
            left.appendChild(card);
          }
        }
      }
      right.innerHTML = `${getTotal()} <span>EGP</span>`;
    } else if (getCurrentPage() == "product.html") {
      let product = document.querySelector(".product");
      let id = getId();
      for (let i = 0; i < products.length; i++) {
        if (products[i].id == id) {
          let rating = products[i].rating.rate;
          let starContainer = document.createElement("div");
          starContainer.classList.add("rate");
          let fullStars = Math.floor(rating);
          let halfStar = rating % 1 >= 0.5;
          let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
          for (let i = 0; i < fullStars; i++) {
            let fullStar = document.createElement("i");
            fullStar.classList.add("fas", "fa-star");
            starContainer.appendChild(fullStar);
          }
          if (halfStar) {
            let halfStarElement = document.createElement("i");
            halfStarElement.classList.add("fas", "fa-star-half-alt");
            starContainer.appendChild(halfStarElement);
          }
          for (let i = 0; i < emptyStars; i++) {
            let emptyStar = document.createElement("i");
            emptyStar.classList.add("far", "fa-star");
            starContainer.appendChild(emptyStar);
          }
          product.innerHTML = `<div class="left">
          <div class="main-image">
            <img src="${products[i].image}" alt="" />
          </div>
          <div class="images">
            <img src="${products[i].image}" alt="" />
            <img src="${products[i].image}" alt="" />
            <img src="${products[i].image}" alt="" />
          </div>
        </div>
        <div class="right">
          <h1>${products[i].title}</h1>
          <div class="price">
            <div class="new-price">${products[i].price}$</div>
            <div class="old-price">2350$</div>
          </div>
          <div class="details">
            <span class="description active">Description</span>
            <span class="basic-info">Basic Info</span>
            <span class="caliber">Caliber</span>
          </div>
          <p>
          ${products[i].description}
          </p>
          <div class="buttons">
            <button class="add" id="the${products[i].id}" onclick="addProductToCart(${products[i].id})"> 
              <i class="fa-solid fa-cart-shopping"></i>
              ADD TO CART
            </button>
            <button class="buy">BUY NOW</button>
          </div>
        </div>`;
          let right = product.querySelector(".right");
          right.insertBefore(starContainer, right.children[1]);
        }
      }
    }
  }
};

xhr.open("GET", "../json/products.json");
xhr.send("");
function getTotal() {
  let total = 0;
  let cartItems = document.querySelectorAll(".container .left .card");
  cartItems.forEach((item) => {
    let priceElement = item.querySelector(".price");
    let quantityElement = item.querySelector(".quantity input");
    if (priceElement && quantityElement) {
      let price = parseFloat(priceElement.innerText.replace("EGP", "").trim());
      let quantity = parseInt(quantityElement.value);
      total += price * quantity;
    }
  });
  let totalPriceElement = document.querySelector(
    ".container .right .up .total p"
  );
  totalPriceElement.innerHTML = `${total} <span>EGP</span>`;
  return total;
}

window.onload = function () {
  for (let y = 0; y < products.length; y++) {
    checkIsAdded(products[y].id);
  }
};

function checkIsAdded(id) {
  if (productsIds.has(id + "")) {
    let btn = document.querySelector(`#the${id}`);
    if (btn) {
      btn.classList.remove("add");
      btn.classList.add("remove");
      btn.innerHTML = "REMOVE FROM CART";
    }
  }
}

function goToCartPage() {
  window.location.href = "cart.html";
}

function goToProductPage(id) {
  window.location.href = `product.html?id=${id}`;
}

function addToCart(id) {
  let btn = document.querySelector(`#the${id}`);
  let currentDate = new Date();
  let dateAfterMonth = currentDate.setMonth(currentDate.getMonth() + 1);
  if (btn.classList.contains("add")) {
    productsIds.add(id + "");
    btn.innerHTML = "REMOVE FROM CART";
  } else {
    productsIds.delete(id + "");
    btn.innerHTML = "ADD TO CART";
  }
  numOfProducts.innerHTML = `${productsIds.size}`;
  document.cookie = `id=${[...productsIds]};expires=${dateAfterMonth}`;
  btn.classList.toggle("add");
  btn.classList.toggle("remove");
}

function addProductToCart(id) {
  let btn = document.querySelector(`#the${id}`);
  let currentDate = new Date();
  let dateAfterMonth = currentDate.setMonth(currentDate.getMonth() + 1);
  if (btn.classList.contains("add")) {
    productsIds.add(id + "");
    btn.innerHTML = "REMOVE FROM CART";
    btn.style.backgroundColor = "#00d0ff";
  } else {
    productsIds.delete(id + "");
    btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> ADD TO CART`;
    btn.style.backgroundColor = "white";
  }
  document.cookie = `id=${[...productsIds]};expires=${dateAfterMonth}`;
  btn.classList.toggle("add");
  btn.classList.toggle("remove");
}

function deleteFromCart(id) {
  let btn = document.querySelector(`#The${id}`);
  let currentDate = new Date();
  let dateAfterMonth = currentDate.setMonth(currentDate.getMonth() + 1);
  productsIds.delete(id + "");
  let h1 = document.querySelector(".container h1");
  h1.innerHTML = `Shopping Cart (${productsIds.size})`;
  document.cookie = `id=${[...productsIds]};expires=${dateAfterMonth}`;
  console.log(btn.parentElement.parentElement.remove());
  getTotal();
}

function getCurrentPage() {
  var currentPage = window.location.href;
  currentPage = currentPage.split(/[?#]/)[0];
  currentPage = currentPage.split("/");
  currentPage = currentPage[currentPage.length - 1];
  return currentPage;
}

function getId() {
  let queryString = window.location.search;
  let productId = queryString.split("id=")[1]?.split("&")[0];
  return productId;
}
