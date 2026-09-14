require("dotenv").config();

const express = require("express");
const conectarDB = require("./bd/conexion");

const autRutas= require("./rutas/autRutas");
const pubRutas = require("./rutas/pubRutas");

const app = express();

conectarDB();

const path = require("path");

app.use(express.static(path.join(__dirname, "../public")));

app.use(
    "/images",
    express.static(path.join(__dirname, "../images"))
);

// Middleware
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

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});