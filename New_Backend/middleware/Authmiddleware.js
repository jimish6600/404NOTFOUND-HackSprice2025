const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    console.log(req.headers)
    const token = req.headers['authorization']; // Get token from header
    console.log(req.headers['authorization'])
    if (!token) return res.status(401).send({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticate;
