const express = require("express");

const {
    registro,
    login,
    getMe
} = require("../controladores/autControlador");

const autMiddleware = require("../middleware/autMiddleware");

const router = express.Router();

router.post("/registro", registro);

router.post("/login", login);

router.get("/me", autMiddleware, getMe);

module.exports = router;