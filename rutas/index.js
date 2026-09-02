const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {

    res.send("Backend está funcionando");

});

app.get("/api/blog", (req, res) => {

    res.json({
        nombre: "Mi Blog",
        curso: "Desarrollo Web",
        estado: "Funcionando"
    });

});

const listaArticulos = [
        {
            id: 1,
            titulo: "Mi primer artículo",
            autor: "Carlos"
        },
        {
            id: 2,
            titulo: "Aprendiendo Backend",
            autor: "Ana"
        },
        {
            id: 3,
            titulo: "Node.js y Express",
            autor: "Pedro"
        }
];

app.get("/api/articulos", (req, res) => {

    res.json(listaArticulos);

});

app.get("/api/articulos/:id", (req, res) => {
    
  // Capturas el ID de la URL y lo conviertes a número
  const idBuscar = parseInt(req.params.id);

  // Buscas el elemento dentro de la lista común
  const articuloEncontrado = listaArticulos.find(articulo => articulo.id === idBuscar);

  // Si no existe, devuelves un error 404
  if (!articuloEncontrado) {
    return res.status(404).json({ error: 'El artículo no existe' });
  }

  // Si existe, devuelves el elemento encontrado en formato JSON
  res.json(articuloEncontrado);

});

app.get("/api/calculadora/:operacion/:a/:b", (req, res) => {

    const operacion = req.params.operacion;
    const a = Number(req.params.a);
    const b = Number(req.params.b);

    let resultado;

    if (operacion === "suma") {
        resultado = a + b;
    }
    else if (operacion === "resta") {
        resultado = a - b;
    }
    else if (operacion === "multiplicacion") {
        resultado = a * b;
    }
    else if (operacion === "division") {
        resultado = a / b;
    }
    else {
        return res.json({
            error: "Operación no válida"
        });
    }

    res.json({
        operacion: operacion,
        numero1: a,
        numero2: b,
        resultado: resultado
    });

});

app.listen(2560, () => {

    console.log("Backend funcionando en http://localhost:2560");

});