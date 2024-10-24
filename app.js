const express = require('express');
const path = require('path');
const i18n = require('i18n');
var app = express();
const router = require("./src/routes/index")
const routeruser = require("./src/routes/user")
const db = require('./src/model/connect');
const fs = require('fs');
require('dotenv').config();


// set the view engine to ejs
app.use(express.json());
app.use('/public', express.static('public'))
app.use('/forms', express.static('forms'))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
i18n.configure({
    locales: ['en', 'vi', 'zh'],  // Các ngôn ngữ được hỗ trợ
    directory: path.join(__dirname, 'locales'),  // Thư mục chứa file ngôn ngữ
    defaultLocale: 'vi',  // Ngôn ngữ mặc định
    queryParameter: 'lang',  // Thay đổi ngôn ngữ qua query URL
    autoReload: true,
    syncFiles: true,
    cookie: 'lang'  // Sử dụng cookie để lưu ngôn ngữ người dùng đã chọn
});

// Sử dụng i18n trong toàn bộ ứng dụng
app.use(i18n.init);

app.use((req, res, next) => {
    res.locals.__ = res.__;  // Cho phép truy cập trực tiếp hàm __ trong EJS
    next();
});

app.use('/', router);
app.use('/api', routeruser);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server đang lắng nghe tại http://localhost:${port}`);
});