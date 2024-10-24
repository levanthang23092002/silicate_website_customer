document.addEventListener("DOMContentLoaded", function () {
  let images = []; // Khởi tạo mảng rỗng để chứa danh sách ảnh
  let currentIndex = 0; // Bắt đầu từ ảnh đầu tiên
  const numVisibleImages = 6; // Số lượng ảnh sẽ hiển thị
  const imageContainer = document.getElementById("imageContainer");

  // Lấy danh sách ảnh từ API
  fetch("/api/images")
    .then((response) => response.json())
    .then((data) => {
      images = data.map((image) => `../public/images/Ui/partner/${image}`);
      displayInitialImages(); // Hiển thị 6 ảnh đầu tiên
      setInterval(updateImages, 3000); // Chuyển ảnh sau mỗi 3 giây
    })
    .catch((error) => {
      console.error("Lỗi khi tải ảnh từ API:", error);
    });

  // Hàm hiển thị 6 ảnh ban đầu
  function displayInitialImages() {
    for (let i = 0; i < Math.min(numVisibleImages, images.length); i++) {
      const imageDiv = document.createElement("div");
      imageDiv.className = "col-md-2 image-container";
      const img = document.createElement("img");
      img.src = images[i];
      img.alt = `Image ${i + 1}`;
      imageDiv.appendChild(img);
      imageContainer.appendChild(imageDiv);
    }
  }

  // Hàm cập nhật ảnh
  function updateImages() {
    // Kiểm tra nếu còn ảnh trong mảng
    if (images.length === 0) {
      console.log("Không có ảnh để hiển thị");
      return;
    }

    // Xóa ảnh đầu tiên
    if (imageContainer.firstChild) {
      imageContainer.removeChild(imageContainer.firstChild);
    }

    // Thêm ảnh mới vào cuối
    const newImageDiv = document.createElement("div");
    newImageDiv.className = "col-md-2 image-container";
    const newImage = document.createElement("img");
    newImage.src = images[currentIndex];
    newImage.alt = `Image ${currentIndex + 1}`;
    newImageDiv.appendChild(newImage);
    imageContainer.appendChild(newImageDiv);

    // Tăng chỉ số ảnh
    currentIndex = (currentIndex + 1) % images.length; // Nếu đã đến ảnh cuối thì quay lại ảnh đầu

    // Đảm bảo chỉ có 6 ảnh hiển thị
    while (imageContainer.children.length > numVisibleImages) {
      imageContainer.removeChild(imageContainer.firstChild);
    }
  }

  fetch("/api/products")
    .then((response) => response.json())
    .then((response) => {
      const datas = response.data;
      const images = datas.map(data => data.image);
      const listImageProduct = document.getElementById("listImageProduct");
      listImageProduct.innerHTML = "";
      datas.forEach((data) => {
        const itemProduct = document.createElement("div");
        itemProduct.className = "item-product col-md-3 image-container";
        const imgElement = document.createElement("img");
        imgElement.src = data.image;
        imgElement.alt = data.name;
        itemProduct.appendChild(imgElement); // Thêm thẻ img vào thẻ div
        listImageProduct.appendChild(itemProduct); // Thêm thẻ div vào thẻ chứa
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
});