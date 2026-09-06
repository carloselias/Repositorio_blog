const jwt = require("jsonwebtoken");

const autMiddleware = (req, res, next) => {
    const autHeader = req.headers.authorization;

    if (!autHeader || !autHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "No se proporcionó un token válido"
        });
    }

    const token = autHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token inválido o expirado"
        });
    }
};

module.exports = autMiddleware;