const lang = document.getElementById('language-select').value;
const name = `item.name_${lang}`
fetch(`/api/products?lang=${lang}`)
  .then(response => response.json())
  .then(data => {
    const collection = document.getElementById('collection');
    collection.innerHTML = '';
    data.data.forEach(item => {
      console.log(data.data);
      const productDiv = document.createElement('div');
      productDiv.classList.add('item');
      productDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="img-fluid">
        <h4>
          <a href="item-industries?id=${item.id}">${item.name}</a>
        </h4>
      `;
      collection.appendChild(productDiv);
    });
  })
  .catch(error => console.error('Error fetching products:', error));