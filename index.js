require('dotenv').config(); 

const express = require('express');
const conectarDB = require('./bd/conexion'); // O la ruta de tu db.js

const app = express();
conectarDB();