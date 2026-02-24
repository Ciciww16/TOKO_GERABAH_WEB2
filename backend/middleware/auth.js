const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ msg: "No token, authorization denied" });

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded; // {id, name, role}
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Token salah" });
    }
};