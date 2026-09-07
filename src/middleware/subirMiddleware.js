const multer = require("multer");
const path = require("path");

console.log(">>> uploadMiddleware.js CARGADO");

const almacenamiento = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "images/");
    },

    filename: (req, file, cb) => {

        console.log("FILE ORIGINAL:", file.originalname);
        console.log("FILE MIME:", file.mimetype);

        const extension = path.extname(file.originalname);

        console.log("EXTENSION:", extension);

        const filename =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

        console.log("GENERATED FILENAME:", filename);

        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    console.log("========== ARCHIVO ==========");
    console.log("Nombre:", file.originalname);
    console.log("MIME:", file.mimetype);
    console.log("Campo:", file.fieldname);
    console.log("=============================");

    cb(null, true);
};

const subir = multer({
    storage: almacenamiento,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = subir;