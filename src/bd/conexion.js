const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        // Tomar la URI desde las variables de entorno
        const uri = process.env.MONGODB_URI; 
        
        if (!uri) {
            throw new Error('La variable MONGODB_URI no está definida en el archivo .env');
        }

        // Establecer la conexión
        await mongoose.connect(uri);
        console.log('Conexión a la base de datos establecida');
    }
    catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};

module.exports = conectarDB;