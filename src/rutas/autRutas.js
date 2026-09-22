const express = require("express");

const {
    registro,
    login,
    getMe,
    updatePerfil
} = require("../controladores/autControlador");

const autMiddleware = require("../middleware/autMiddleware");
const subirPerfilImage = require("../middleware/subirPerfilMiddleware");
const router = express.Router();

router.post("/registro", registro);

router.post("/login", login);

router.get("/me", autMiddleware, getMe);

router.put(
    "/perfil",
    autMiddleware,
    subirPerfilImage.single("profileImage"),
    updatePerfil
);

module.exports = router;