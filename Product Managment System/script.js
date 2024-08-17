"use strict";

//Selecting DOM elements
const title = document.getElementById("title");
const price = document.getElementById("price");
const taxes = document.getElementById("taxes");
const ads = document.getElementById("ads");
const discount = document.getElementById("discount");
const total = document.getElementById("total");
const count = document.getElementById("count");
const category = document.getElementById("category");
const create = document.getElementById("create");
const search = document.getElementById("search");
const searchByTitle = document.getElementById("searchByTitle");
const searchByCategory = document.getElementById("searchByCategory");
const tbody = document.querySelector("tbody");
const deleteAll = document.getElementById("deleteAll");

//state variable
let state = "create";
let searchState = "title";
//fake variable (to get index from updateProduct function)
let temp;

//get Total value
const getTotal = function () {
  if (Number(price.value) > 0) {
    let sum =
      Number(price.value) +
      Number(taxes.value) +
      Number(ads.value) -
      Number(discount.value);
    total.innerHTML = sum;
    total.style.backgroundColor = "#036e03";
  } else {
    total.innerHTML = `Invalid`;
    total.style.backgroundColor = "#d10024";
  }
};

//Create Element
let productData = JSON.parse(localStorage.getItem("product")) || [];
let id = 1;

create.addEventListener("click", function () {
  let product = {
    title: title.value,
    count: count.value,
    category: category.value,
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
  };

  if (
    state === "create" &&
    title.value != "" &&
    price.value != "" &&
    category.value != ""
  ) {
    //count function
    if (product.count > 1 && product.count < 100) {
      for (let i = 0; i < product.count; i++) {
        productData.push(product);
        clearData();
      }
    } else {
      productData.push(product);
      clearData();
    }
  } else {
    productData[temp] = product;
    count.classList.remove("hidden");
    create.innerHTML = "Create";
    state = "create";
    clearData();
  }

  //Save element to local storage
  localStorage.setItem("product", JSON.stringify(productData));
  showData();
});

//clear data
const clearData = function () {
  title.value = "";
  count.value = "";
  category.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "Total";
};

//show data in table
const showData = function () {
  getTotal();
  tbody.innerHTML = "";

  productData.forEach((element, index) => {
    tbody.innerHTML += `<tr>
        <td>${index + 1}</td>
        <td>${element.title}</td>
        <td>${element.price}</td>
        <td>${element.taxes}</td>
        <td>${element.ads}</td>
        <td>${element.discount}</td>
        <td>${element.category}</td>
        <td>${element.total}</td>
        <td> <button id ="update" onclick="updateProduct(${index})">Update </button> </td>
        <td> <button id ="delete" onclick="deleteProduct(${index})">Delete </button> </td>
        </tr>`;
  });

  if (!productData.length > 0) {
    deleteAll.classList.add("hidden");
  } else {
    deleteAll.classList.remove("hidden");
    deleteAll.innerText = `Delete All (${productData.length})`;
  }
};
// Initial display of data
showData();

// delete product from table
const deleteProduct = function (index) {
  productData.splice(index, 1);

  localStorage.product = JSON.stringify(productData);
  showData();
};

//delete all products
deleteAll.addEventListener("click", function () {
  productData = [];
  localStorage.clear();
  showData();
});

//update product
const updateProduct = function (index) {
  title.value = productData[index].title;
  category.value = productData[index].category;
  price.value = productData[index].price;
  taxes.value = productData[index].taxes;
  ads.value = productData[index].ads;
  discount.value = productData[index].discount;

  getTotal();

  count.classList.add("hidden");

  create.innerHTML = "Update";

  state = "update";

  temp = index;

  scroll({
    top: 0,
    behavior: "smooth",
  });
};

//search function based on searchState
const getSearchState = function (id) {
  if (id === "searchByTitle") {
    searchState = "title";
  } else {
    searchState = "category";
  }
  search.placeholder = "Search By " + searchState;
  search.focus();
  search.value = "";
  showData();
};

const searchData = function (value) {
  tbody.innerHTML = ""; // Clear previous search results

  // Determine which key to search by
  let searchKey = searchState === "title" ? "title" : "category";

  // Filter the productData array based on the search term
  let filteredProducts = productData.filter((product) =>
    product[searchKey].toLowerCase().includes(value.toLowerCase())
  );

  // Display the filtered products
  filteredProducts.forEach((element, index) => {
    tbody.innerHTML += `<tr>
        <td>${index + 1}</td>
        <td>${element.title}</td>
        <td>${element.price}</td>
        <td>${element.taxes}</td>
        <td>${element.ads}</td>
        <td>${element.discount}</td>
        <td>${element.category}</td>
        <td>${element.total}</td>
        <td> <button id ="update" onclick="updateProduct(${productData.indexOf(
          element
        )})">Update</button> </td>
        <td> <button id ="delete" onclick="deleteProduct(${productData.indexOf(
          element
        )})">Delete</button> </td>
      </tr>`;
  });
};
