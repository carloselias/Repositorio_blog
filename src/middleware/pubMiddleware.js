const validator = require("validator");

const validarPub = (req, res, next) => {

    const { title, content } = req.body;

    const errors = [];

    // Título
    if (!title || validator.isEmpty(title.trim())) {

        errors.push("El título es obligatorio");

    } else if (!validator.isLength(title.trim(), { min: 5, max: 150 })) {

        errors.push(
            "El título debe tener entre 5 y 150 caracteres"
        );
    }


    // Contenido
    if (!content || validator.isEmpty(content.trim())) {

        errors.push("El contenido es obligatorio");

    } else if (!validator.isLength(content.trim(), { min: 10 })) {

        errors.push(
            "El contenido debe tener al menos 10 caracteres"
        );
    }


    if (errors.length > 0) {

        return res.status(400).json({
            message: "Error de validación",
            errors
        });
    }

    next();
};

module.exports = validarPub;