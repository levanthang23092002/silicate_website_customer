require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../model/connect');

const User = {

    login: (data, callback) => {
        try {
            const query = "SELECT * FROM silicate.users WHERE gmail = ? AND pass = ?";
            db.query(query, data, (error, results) => {
                if (error) {
                    // Trả về lỗi nếu có vấn đề với câu truy vấn
                    return callback(error, null);
                }

                // Kiểm tra xem giá trị email và password có hợp lệ hay không
                if (!data[0] || !data[1]) {
                    // Trả về mã lỗi 1 nếu email hoặc mật khẩu rỗng
                    return callback(null, 1);
                }

                // Kiểm tra kết quả trả về từ truy vấn
                if (results.length === 0) {
                    // Trả về mã lỗi 0 nếu không tìm thấy người dùng
                    return callback(null, 0);
                } else {
                    const user = results[0]; // Lấy thông tin người dùng từ kết quả

                    // Tạo mã JWT
                    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });

                    // Trả về mã JWT và thông tin người dùng
                    return callback(null, { token, user });
                }
            });
        } catch (error) {
            console.log(error);
            callback(error, null);
        }
    },

    addproduct: (data, callback) => {
        try {
            let add = `INSERT INTO silicate.products 
                (name_vi, description_vi, benefits1_vi, benefits2_vi, benefits3_vi, benefits4_vi, benefits5_vi,
                name_en, description_en, benefits1_en, benefits2_en, benefits3_en, benefits4_en, benefits5_en,
                name_zh, description_zh, benefits1_zh, benefits2_zh, benefits3_zh, benefits4_zh, benefits5_zh, image) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            // Thực hiện truy vấn thêm sản phẩm
            db.query(add, data, (error, results) => {
                if (error) {
                    callback(error, null);
                } else {
                    // Sau khi thêm thành công, sử dụng LAST_INSERT_ID() để lấy lại sản phẩm vừa chèn
                    const selectQuery = `SELECT * FROM silicate.products WHERE id = LAST_INSERT_ID()`;

                    db.query(selectQuery, (err, result) => {
                        if (err) {
                            callback(err, null);
                        } else {
                            // Trả về sản phẩm vừa được chèn
                            callback(null, result[0]);
                        }
                    });
                }
            });
        } catch (error) {
            callback(error, null);
        }
    },
    getListProduct: (lang, callback) => {
        let listProduct = `SELECT id,name_${lang} as name, image FROM silicate.products`

        db.query(listProduct, (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                if (results.length == 0) {
                    callback(error, 1);
                } else {
                    callback(error, results);
                }
            }
        })
    },
    getProduct: (id, lang, callback) => {
        let product = `SELECT name_${lang} as name, description_${lang} as description, benefits1_${lang} as benefits1, benefits2_${lang} as benefits2, benefits3_${lang} as benefits3, benefits4_${lang} as benefits4, benefits5_${lang} as benefits5, image FROM silicate.products where id = ${id}`
        db.query(product, (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                if (results.length == 0) {
                    callback(error, 1);
                } else {
                    callback(error, results);
                }
            }
        })
    },

    getProductDetail: (id, callback) => {
        let product = `SELECT * FROM silicate.products where id = ${id}`
        db.query(product, (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                if (results.length == 0) {
                    callback(error, 1);
                } else {
                    callback(error, results);
                }
            }
        })
    },
    
    deleteProduct: (id, callback) => {
        let product = `delete from silicate.products where id = ${id}`
        db.query(product, (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                if (results.length == 0) {
                    callback(error, 1);
                } else {
                    callback(error, results);
                }
            }
        })
    },

    updateProduct: (id, data, callback) => {
        let query = `UPDATE silicate.products SET 
            name_vi = ?, description_vi = ?, benefits1_vi = ?, benefits2_vi = ?, benefits3_vi = ?, benefits4_vi = ?, benefits5_vi = ?,
            name_en = ?, description_en = ?, benefits1_en = ?, benefits2_en = ?, benefits3_en = ?, benefits4_en = ?, benefits5_en = ?,
            name_zh = ?, description_zh = ?, benefits1_zh = ?, benefits2_zh = ?, benefits3_zh = ?, benefits4_zh = ?, benefits5_zh = ?, image = ?
            WHERE id = ?`;  
    
        const queryData = [...data, id];  
        db.query(query, queryData, (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                console.log(results);
                if (results.affectedRows === 0) {  
                    callback(null, 1);  
                } else {
                    callback(null, results);  
                }
            }
        });
    }
}

module.exports = User;
