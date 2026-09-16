require("dotenv").config();

const express = require("express");
const {conectarBD,
    getDatabaseError
} = require("./bd/conexion");
const autRutas= require("./rutas/autRutas");
const pubRutas = require("./rutas/pubRutas");

const app = express();
const PORT = process.env.PORT || 3000;

const path = require("path");
app.use("/svg", express.static(path.join(__dirname, "../svg")));
app.use((req, res, next) => {

    const databaseError = getDatabaseError();

    const allowedPaths = [
        "/error-bd.html",
        "/styles.css"
    ];

    if (databaseError && !allowedPaths.includes(req.path)) {
        return res.redirect(
        `/error-bd.html?code=${encodeURIComponent(databaseError)}`
        );
    }

    next();
});

app.use(express.static(path.join(__dirname, "../public")));
app.use("/images", express.static(path.join(__dirname, "../images")));

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use("/images", express.static("images"));

app.use("/api/aut", autRutas);
app.use("/api/pub", pubRutas);

// Ruta de prueba
app.get("/", (req, res) => {
    res.json({
        message: "API del blog funcionando"
    });
});

const startServer = async () => {

    try {

        await conectarBD();

        console.log(
            "La aplicación inició con conexión a MongoDB"
        );

    } catch (error) {

        console.error(
            "La aplicación inició sin conexión a MongoDB",
            error
        );
    }

    app.listen(
        PORT,
        () => {

            console.log(
                `Servidor ejecutándose en http://localhost:${PORT}`
            );

        }
    );
};

startServer();