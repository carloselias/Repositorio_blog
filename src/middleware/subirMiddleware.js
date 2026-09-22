const multer = require("multer");
const path = require("path");

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
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/webp" || file.mimetype === "image/gif") {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten archivos JPEG, PNG, JPG, WEBP y GIF"), false);
    }
};

const subir = multer({
    storage: almacenamiento,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = subir;