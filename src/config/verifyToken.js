const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authtoken = req.headers['authorization'];
  let token;
  if (!authtoken) {
    return res.status(401).json({ message: 'Cần Đăng Nhập Để Thay đổi' });
  } else {
    token = authtoken.split(' ')[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Lỗi Đăng Nhập' });
  }
};

module.exports = verifyToken;