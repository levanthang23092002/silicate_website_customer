window.addEventListener("DOMContentLoaded", (event) => {

  const imagePreview = document.getElementById("imagePreview");
  const imageInput = document.getElementById("imageInput");
  const uploadBtn = document.getElementById("uploadBtn");

  const uploadSection = document.getElementById("uploadSection");
  const listProductSection = document.getElementById("listProductSection");
  const detailProductSection = document.getElementById("EditProductSection");
  const addProductSection = document.getElementById("addProductSection")

  const btnManagerImages = document.getElementById("manageImages");
  const btnListProduct = document.getElementById("listProducts");
  const btnAddProduct = document.getElementById("addProduct");
  const btnGoBack = document.getElementById("GoBackBtn");

  uploadSection.style.display = "block";
  listProductSection.style.display = "none";
  addProductSection.style.display = "none";
  detailProductSection.style.display = "none";

  btnManagerImages.addEventListener("click", function () {
    uploadSection.style.display = "block";
    listProductSection.style.display = "none";
    addProductSection.style.display = "none";
    detailProductSection.style.display = "none";
  });

  btnListProduct.addEventListener("click", function () {
    uploadSection.style.display = "none";
    listProductSection.style.display = "block";
    addProductSection.style.display = "none";
    detailProductSection.style.display = "none";
  });

  btnGoBack.addEventListener("click", function () {
    uploadSection.style.display = "none";
    listProductSection.style.display = "block";
    addProductSection.style.display = "none";
    detailProductSection.style.display = "none";
  });

  btnAddProduct.addEventListener("click", function () {
    uploadSection.style.display = "none";
    listProductSection.style.display = "none";
    detailProductSection.style.display = "none";
    addProductSection.style.display = "block";
  });

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  }

  const token = getCookie('token');

  fetch("/api/images")
    .then((response) => response.json())
    .then((images) => {
      if (Array.isArray(images)) {
        images.forEach((image) => {
          addImageToPreview(image);
        });
      } else {
        console.error("API không trả về một mảng:", images);
      }
    })
    .catch((error) => {
      console.error("Lỗi khi tải ảnh:", error);
    });

  let listProductHtml = document.getElementById("list-product-container");
  fetch("/api/products")
    .then((response) => response.json())
    .then((products) => {
      if (Array.isArray(products.data)) {
        let htmlContent = "";
        products.data.forEach((item) => {
          htmlContent += `
              <div class="col-3">
                <a class="item-product-link" href="javascript:void(0)" data-id="${item.id}">
                  <div class="item-product">
                    <div class="image-left">
                      <div>
                          <img src="${item.image}" alt="">
                      </div>
                    </div>
                    <div class="title-right">
                      <h5>${item.name}</h5>
                    </div>
                  </div>
                </a>
              </div>
            `;
        });
        listProductHtml.innerHTML = htmlContent;
        attachClickEvent();
      } else {
        console.error("Lỗi dữ liệu");
      }
    })
    .catch((error) => {
      console.error("Xảy ra lỗi khi gọi API", error);
    });

  function attachClickEvent() {
    const productLinks = document.querySelectorAll('.item-product-link');
    productLinks.forEach(link => {
      link.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        fetch("/api//products/detail/admin?id=" + id)
          .then((response) => response.json())
          .then(async (product) => {
            const dataItem = await product.data[0];
            await detailProductSectionBlock()

            updateProductFields('vi', dataItem);
            updateProductFields('en', dataItem);
            updateProductFields('zh', dataItem);
            document.getElementById("imageDetailPreview").src = dataItem[`image`];
            document.getElementById("imageDetailPreview").alt = dataItem[`name_vi`]; ``
            document.getElementById("productDetail").dataset.idProduct = dataItem[`id`];
          })
          .catch((error) => {
            console.error("Xảy ra lỗi khi gọi API", error);
          });
      });
    });
  }

  function detailProductSectionBlock() {
    uploadSection.style.display = "none";
    detailProductSection.style.display = "block";
    listProductSection.style.display = "none"
    addProductSection.style.display = "none";
  }

  function updateProductFields(language, data) {
    document.getElementById(`productNameUpdate_${language}`).value = data[`name_${language}`];
    document.getElementById(`productDescriptionUpdate_${language}`).value = data[`description_${language}`];
    document.getElementById(`productBenefitsUpdate1_${language}`).value = data[`benefits1_${language}`];
    document.getElementById(`productBenefitsUpdate2_${language}`).value = data[`benefits2_${language}`];
    document.getElementById(`productBenefitsUpdate3_${language}`).value = data[`benefits3_${language}`];
    document.getElementById(`productBenefitsUpdate4_${language}`).value = data[`benefits4_${language}`];
    document.getElementById(`productBenefitsUpdate5_${language}`).value = data[`benefits5_${language}`];
  }

  document.getElementById("productImageUpdate").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = document.getElementById("imageDetailPreview");
        preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById("DeleteProductBtn").addEventListener('click', function () {
    const productElement = document.getElementById('productDetail');
    const id = productElement.getAttribute('data-id-product');

    fetch(`/api/products/delete?id=${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          alert("Xóa Thành Công!")
          uploadSection.style.display = "none";
          listProductSection.style.display = "block";
          addProductSection.style.display = "none";
          detailProductSection.style.display = "none";
          let listProductHtml = document.getElementById("list-product-container");

          fetch("/api/products")
            .then((response) => response.json())
            .then((products) => {
              if (Array.isArray(products.data)) {
                let htmlContent = "";
                products.data.forEach((item) => {
                  htmlContent += `
              <div class="col-3">
                <a class="item-product-link" href="javascript:void(0)" data-id="${item.id}">
                  <div class="item-product">
                    <div class="image-left">
                      <div>
                          <img src="${item.image}" alt="">
                      </div>
                    </div>
                    <div class="title-right">
                      <h5>${item.name}</h5>
                    </div>
                  </div>
                </a>
              </div>
            `;
                });
                listProductHtml.innerHTML = htmlContent;
                attachClickEvent();
              } else {
                console.error("Lỗi dữ liệu");
              }
            })
            .catch((error) => {
              console.error("Xảy ra lỗi khi gọi API", error);
            });
        }
      })
  })

  document.getElementById("UpdateProductBtn").addEventListener('click', function () {
    const productElement = document.getElementById('productDetail');
    const id = productElement.getAttribute('data-id-product');
    const formData = new FormData();
    formData.append(
      "name_vi",
      document.getElementById("productNameUpdate_vi").value
    );
    formData.append(
      "description_vi",
      document.getElementById("productDescriptionUpdate_vi").value
    );
    formData.append(
      "benefits1_vi",
      document.getElementById("productBenefitsUpdate1_vi").value
    );
    formData.append(
      "benefits2_vi",
      document.getElementById("productBenefitsUpdate2_vi").value
    );
    formData.append(
      "benefits3_vi",
      document.getElementById("productBenefitsUpdate3_vi").value
    );
    formData.append(
      "benefits4_vi",
      document.getElementById("productBenefitsUpdate4_vi").value
    );
    formData.append(
      "benefits5_vi",
      document.getElementById("productBenefitsUpdate5_vi").value
    );

    formData.append(
      "name_en",
      document.getElementById("productNameUpdate_en").value
    );
    formData.append(
      "description_en",
      document.getElementById("productDescriptionUpdate_en").value
    );
    formData.append(
      "benefits1_en",
      document.getElementById("productBenefitsUpdate1_en").value
    );
    formData.append(
      "benefits2_en",
      document.getElementById("productBenefitsUpdate2_en").value
    );
    formData.append(
      "benefits3_en",
      document.getElementById("productBenefitsUpdate3_en").value
    );
    formData.append(
      "benefits4_en",
      document.getElementById("productBenefitsUpdate4_en").value
    );
    formData.append(
      "benefits5_en",
      document.getElementById("productBenefitsUpdate5_en").value
    );

    formData.append(
      "name_zh",
      document.getElementById("productNameUpdate_zh").value
    );
    formData.append(
      "description_zh",
      document.getElementById("productDescriptionUpdate_zh").value
    );
    formData.append(
      "benefits1_zh",
      document.getElementById("productBenefitsUpdate1_zh").value
    );
    formData.append(
      "benefits2_zh",
      document.getElementById("productBenefitsUpdate2_zh").value
    );
    formData.append(
      "benefits3_zh",
      document.getElementById("productBenefitsUpdate3_zh").value
    );
    formData.append(
      "benefits4_zh",
      document.getElementById("productBenefitsUpdate4_zh").value
    );
    formData.append(
      "benefits5_zh",
      document.getElementById("productBenefitsUpdate5_zh").value
    );

    const productImage = document.getElementById("productImageUpdate").files[0];
    if (productImage) {
      const imageName = productImage.name;
      const imagePath = `../../public/images/Ui/related-product/${imageName}`;
      formData.append("image", imagePath);
      formData.append("imageupload", productImage);
    } else {
      const imageDetailPreview = document.getElementById("imageDetailPreview");
      const imageSrc = imageDetailPreview.src;
      const imageNameFromSrc = imageSrc.substring(imageSrc.lastIndexOf('/') + 1);
      const baseURL = window.location.origin;
      const relativeImagePath = imageSrc.replace(baseURL, '..');
      formData.append("image", relativeImagePath);
      formData.append("imageName", imageNameFromSrc);
    }
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    fetch(`/api/products/update?id=${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success === true)
          alert("Cập nhập thành công")
        else
          alert("Cập nhập Không thành công")
      })
      .catch((err) => {
         if(err)
          alert("Lỗi Hệ Thống")
      })
  })

  uploadBtn.addEventListener("click", function () {
    const files = imageInput.files;
    if (files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
      fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {

          if (data.uploadedImages) {
            data.uploadedImages.forEach((image) => {
              addImageToPreview(image);
              setTimeout(() => {
                alert("Thêm Thành công");
              }, 100);
            });
          } else {
            alert(data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tải lên:", error);
        });
    } else {
      alert("Vui lòng chọn ít nhất một tệp để tải lên.");
    }
  });

  function addImageToPreview(image) {
    const imgContainer = document.createElement("div");
    imgContainer.style.position = "relative";
    const img = document.createElement("img");
    img.src = `../../public/images/Ui/partner/${image}`;
    img.alt = image;
    img.style.cursor = "pointer";
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Xóa";
    deleteBtn.style.display = "none";
    deleteBtn.style.position = "absolute";
    deleteBtn.style.top = "5px";
    deleteBtn.style.right = "5px";
    imgContainer.addEventListener("mouseenter", () => {
      deleteBtn.style.display = "block";
    });
    imgContainer.addEventListener("mouseleave", () => {
      deleteBtn.style.display = "none";
    });

    deleteBtn.addEventListener("click", () => {
      if (confirm("Bạn có chắc chắn muốn xóa ảnh này không?")) {
        fetch(`/api/delete/${image}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              imgContainer.remove();
              alert("Ảnh đã được xóa thành công");
            } else {
              alert("Xóa ảnh thất bại: " + data.message);
            }
          })
          .catch((error) => {
            console.error("Lỗi khi xóa ảnh:", error);
          });
      }
    });

    imgContainer.appendChild(img);
    imgContainer.appendChild(deleteBtn);
    imagePreview.appendChild(imgContainer);
  }

  document
    .getElementById("submitProductBtn")
    .addEventListener("click", function (event) {
      const formData = new FormData();
      formData.append(
        "name_vi",
        document.getElementById("productName_vi").value
      );
      formData.append(
        "description_vi",
        document.getElementById("productDescription_vi").value
      );
      formData.append(
        "benefits1_vi",
        document.getElementById("productBenefits1_vi").value
      );
      formData.append(
        "benefits2_vi",
        document.getElementById("productBenefits2_vi").value
      );
      formData.append(
        "benefits3_vi",
        document.getElementById("productBenefits3_vi").value
      );
      formData.append(
        "benefits4_vi",
        document.getElementById("productBenefits4_vi").value
      );
      formData.append(
        "benefits5_vi",
        document.getElementById("productBenefits5_vi").value
      );

      formData.append(
        "name_en",
        document.getElementById("productName_en").value
      );
      formData.append(
        "description_en",
        document.getElementById("productDescription_en").value
      );
      formData.append(
        "benefits1_en",
        document.getElementById("productBenefits1_en").value
      );
      formData.append(
        "benefits2_en",
        document.getElementById("productBenefits2_en").value
      );
      formData.append(
        "benefits3_en",
        document.getElementById("productBenefits3_en").value
      );
      formData.append(
        "benefits4_en",
        document.getElementById("productBenefits4_en").value
      );
      formData.append(
        "benefits5_en",
        document.getElementById("productBenefits5_en").value
      );

      formData.append(
        "name_zh",
        document.getElementById("productName_zh").value
      );
      formData.append(
        "description_zh",
        document.getElementById("productDescription_zh").value
      );
      formData.append(
        "benefits1_zh",
        document.getElementById("productBenefits1_zh").value
      );
      formData.append(
        "benefits2_zh",
        document.getElementById("productBenefits2_zh").value
      );
      formData.append(
        "benefits3_zh",
        document.getElementById("productBenefits3_zh").value
      );
      formData.append(
        "benefits4_zh",
        document.getElementById("productBenefits4_zh").value
      );
      formData.append(
        "benefits5_zh",
        document.getElementById("productBenefits5_zh").value
      );

      const productImage = document.getElementById("productImage").files[0];
      if (productImage) {
        const imageName = productImage.name;
        const imagePath = `../../public/images/Ui/related-product/${imageName}`;
        formData.append("image", imagePath);
        formData.append("imageupload", productImage);
      }

      fetch("/api/addproduct", {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log("Response Status:", response.status);
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
          alert("Sản phẩm đã được thêm thành công!");
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Có lỗi xảy ra khi thêm sản phẩm.");
        });
    });


  document.getElementById("btnLogout").addEventListener("click", function () {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    window.location.href = "/login";
  });

  const btnSidebar = document.getElementsByClassName("children-title");
  Array.from(btnSidebar).forEach(function (item) {
    item.addEventListener('click', function () {
      if (item.classList.contains('active')) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });

});
