const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const lang = document.getElementById("language-select").value;
const name = `item.name_${lang}`;
fetch(`/api/products/detail?lang=${lang}&id=${id}`)
  .then((response) => response.json())
  .then((response) => {
    console.log(response.data[0].name);

    document.getElementById("product-name").textContent = response.data[0].name;
    document.getElementById("product-description").textContent =
      response.data[0].description;
    document.getElementById("product-name-highlight").textContent =
      response.data[0].name;
    document.getElementById("product-name-photos").textContent =
      response.data[0].name;
    const benefitsList = document.getElementById("product-benefits");
    benefitsList.innerHTML = ""; 
    for (let i = 1; i <= 5; i++) {
      if (response.data[0][`benefits${i}`]) {
        const li = document.createElement("li");
        li.textContent = response.data[0][`benefits${i}`];
        benefitsList.appendChild(li);
      }
    }
    const productImage = document.getElementById("product-image");
    productImage.src = response.data[0].image;
    productImage.alt = response.data[0].name;
  })
  .catch((error) => console.error("Error fetching products:", error));

fetch(`/api/products?lang=${lang}`)
  .then((response) => response.json())
  .then((data) => {
    const productList = document.getElementById("product-list");
    data.data.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<a href="item-industries?id=${item.id}">${item.name}</a>`;
      productList.appendChild(listItem);
    });
  })
  .catch((error) => console.error("Error fetching products:", error));
