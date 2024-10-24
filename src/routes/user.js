const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const auth = express.Router();
const verifiToken = require('../config/verifyToken');
const usercontroller = require('../controller/user');
const { sendEmailService } = require('../config/sendEmail');

function uploadImages(imagesPath) {
    const imagesDirectory = path.join(__dirname, imagesPath);
    if (!fs.existsSync(imagesDirectory)) {
        fs.mkdirSync(imagesDirectory, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, imagesDirectory);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });

    return multer({ storage: storage });
}




const imagesDirectory = path.join(__dirname, '../../public/images/Ui/partner');
const upload = uploadImages('../../public/images/Ui/partner');
const imgproduct = uploadImages('../../public/images/Ui/related-product');

auth.post('/login', usercontroller.login);

auth.get('/images', (req, res) => {
    fs.readdir(imagesDirectory, (err, files) => {
        if (err) {
            console.error('Lỗi chi tiết:', err);
            return res.status(500).json({ error: 'Không thể đọc thư mục' });
        }
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        res.json(imageFiles);
    });
});

//Upload file
auth.post('/upload',verifiToken, upload.array('images', 10), (req, res) => {
    console.log(req.body)
    const uploadedImages = req.files.map(file => file.filename);
    res.json({ uploadedImages });
});

//Delete image
auth.delete('/delete/:image', verifiToken, (req, res) => {
    const image = req.params.image;
    const imagePath = path.join(__dirname, `../../public/images/Ui/partner/${image}`);

    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error('Lỗi khi xóa ảnh:', err);
            return res.status(500).json({ success: false, message: 'Không thể xóa ảnh. ' + err.message });
        }
        res.json({ success: true, message: 'Ảnh đã được xóa thành công' });
    });
});

//Add product
auth.post('/addproduct', verifiToken, imgproduct.array('imageupload', 10), usercontroller.addproduct, (req, res) => {
    const uploadedImages = req.files.map(file => file.filename);
    res.json({ uploadedImages });
});

//Get list products
auth.get('/products', usercontroller.getListProduct);

//Get product detail by id
auth.get('/products/detail', usercontroller.getProduct);

auth.get('/products/detail/admin', usercontroller.getProductDetail);

auth.delete('/products/delete',verifiToken, usercontroller.deleteProduct);

auth.put('/products/update',verifiToken,imgproduct.array('imageupload', 10), usercontroller.updateProduct, (req, res)=>{
    
});
//Send email into end user
auth.post('/send-email', async (req, res) => {
    const data = req.body.data;
    try {
        const info = await sendEmailService(data);
        res.json({ success: true, info });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

module.exports = auth;
