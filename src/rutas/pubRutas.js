const express = require("express");

const {
    crearPub,
    getPubs,
    getPubsId,
    actualizarPub,
    eliminarPub
} = require("../controladores/pubControlador");

const autMiddleware = require("../middleware/autMiddleware");
const subir = require("../middleware/subirMiddleware");

const router = express.Router();

router.get("/", getPubs);

router.get("/:id", getPubsId);

router.post(
    "/",
    autMiddleware,
    subir.single("image"),
    crearPub
);

router.put(
    "/:id",
    autMiddleware,
    subir.single("image"),
    actualizarPub
);

router.delete("/:id", autMiddleware, eliminarPub);

module.exports = router;