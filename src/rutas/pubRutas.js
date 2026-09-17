const express = require("express");

const {
    crearPub,
    getPubs,
    getPubsId,
    actualizarPub,
    eliminarPub,
    toggleLike
} = require("../controladores/pubControlador");

const autMiddleware = require("../middleware/autMiddleware");
const subir = require("../middleware/subirMiddleware");
const validarPub = require("../middleware/pubMiddleware");
const router = express.Router();

router.get("/", getPubs);

router.get("/:id", getPubsId);

router.post(
    "/",
    autMiddleware,
    subir.single("image"),
    validarPub,
    crearPub
);

router.post(
    "/:id/like",
    autMiddleware,
    toggleLike
);

router.put(
    "/:id",
    autMiddleware,
    subir.single("image"),
    validarPub,
    actualizarPub
);

router.delete("/:id", autMiddleware, eliminarPub);

module.exports = router;