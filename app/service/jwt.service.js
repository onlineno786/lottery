const jwt           = require('jsonwebtoken');
const secret        = process.env.JWT_SECRET;

exports.encode      = (data) => {
    return jwt.sign(data, secret)
};

exports.decode      = (token) => {
    return decoded  = jwt.verify(token, secret);
};