const express = require("express");

const {
    getComments,
    createComment,
    deleteComment
} = require("../controladores/comControlador");

const autMiddleware = require("../middleware/autMiddleware");

const router = express.Router();

// Ver comentarios
// Público

router.get(
    "/pub/:postId/comentarios",
    getComments
);

// Crear comentario
// Requiere login


router.post(
    "/pub/:postId/comentarios",
    autMiddleware,
    createComment
);

// Eliminar comentario
// Requiere login

router.delete(
    "/comentarios/:commentId",
    autMiddleware,
    deleteComment
);

module.exports = router;