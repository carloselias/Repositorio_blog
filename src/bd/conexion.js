const mongoose = require('mongoose');
let databaseError = null;
const conectarBD = async () => {
    try {
        // Tomar la URI desde las variables de entorno
        const uri = process.env.MONGODB_URI; 
        
        if (!uri) {
            throw new Error('La variable MONGODB_URI no está definida en el archivo .env');
        }

        // Establecer la conexión
        await mongoose.connect(uri);
        console.log('Conexión a la base de datos establecida');
        databaseError = null;
    }
    catch (error) {
        console.error(
            "Error de conexión a MongoDB:",
            error
        );

        databaseError =
            error.code ||
            error.name ||
            "500_DATABASE_CONNECTION_ERROR";

        throw error;
    }
};

mongoose.connection.on(
    "connected",
    () => {

        console.log(
            "MongoDB: conexión establecida"
        );

        databaseError = null;
    }
);
mongoose.connection.on(
    "disconnected",
    () => {

        console.error(
            "MongoDB: conexión perdida"
        );

        databaseError =
            "503_DATABASE_DISCONNECTED";
    }
);
mongoose.connection.on(
    "reconnected",
    () => {

        console.log(
            "MongoDB: conexión restablecida"
        );

        databaseError = null;
    }
);
mongoose.connection.on(
    "error",
    (error) => {

        console.error(
            "MongoDB: error de conexión:",
            error
        );

        databaseError =
            error.code ||
            error.name ||
            "500_DATABASE_CONNECTION_ERROR";
    }
);

const getDatabaseError = () => {

    return databaseError;
};

module.exports = {
    conectarBD,
    getDatabaseError
};