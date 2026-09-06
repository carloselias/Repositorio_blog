const User = require("../modelos/usuarios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registro = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validar campos
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios"
            });
        }

        // Verificar si el correo ya existe
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "El correo electrónico ya está registrado"
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Usuario registrado correctamente",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al registrar el usuario"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "El correo y la contraseña son obligatorios"
            });
        }

        // Buscar usuario
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Correo o contraseña incorrectos"
            });
        }

        // Comparar contraseña
        const passwordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordCorrect) {
            return res.status(401).json({
                message: "Correo o contraseña incorrectos"
            });
        }

        // Crear JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al iniciar sesión"
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.json({
            user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener los datos del usuario"
        });
    }
};

module.exports = {
    registro,
    login,
    getMe
};