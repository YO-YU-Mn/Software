const jwt = require('jsonwebtoken');
const SECRET = 'university_secret_key';

function auth(req, res, next) {
    try {
        const token = req.headers.authorization;

        const decoded = jwt.verify(token, SECRET);

        req.user = decoded; 

        next();

    } catch (err) {
        res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = auth;