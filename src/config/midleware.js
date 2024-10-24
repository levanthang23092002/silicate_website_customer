const jwt = require('jsonwebtoken');

const middleware = (req, res, next) => {
    const authtoken = req.headers['cookie'];
    if (!authtoken) {
        res.redirect('login')

    } else {
       next();
    }
};

module.exports = middleware;