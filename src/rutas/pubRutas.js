const express = require("express");

const {
    crearPub,
    getPubs,
    getPubsId,
    actualizarPub,
    eliminarPub
} = require("../controladores/pubControlador");

const autMiddleware = require("../middleware/autMiddleware");

const router = express.Router();

// Lectura pública
router.get("/", getPubs);

router.get("/:id", getPubsId);

// Operaciones que requieren autenticación
router.post("/", autMiddleware, crearPub);

router.put("/:id", autMiddleware, actualizarPub);

router.delete("/:id", autMiddleware, eliminarPub);

module.exports = router;