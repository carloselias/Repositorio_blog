const Post = require("../modelos/publicaciones");

// Crear publicación
const crearPub = async (req, res) => {
    try {
        const { title, content } = req.body;

        let image = null;

        if (req.file) {
            image = `/images/${req.file.filename}`;
        }

        const post = await Post.create({
            title,
            content,
            image,
            author: req.user.id
        });

        const populatedPost = await Post.findById(post._id)
            .populate("author", "name email role");

        res.status(201).json({
            message: "Publicación creada correctamente",
            post: populatedPost
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al crear la publicación"
        });
    }
};


// Obtener todas las publicaciones
const getPubs = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name email role profileImage")
            .sort({ createdAt: -1 });

        res.json({
            count: posts.length,
            posts
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener las publicaciones"
        });
    }
};


// Obtener una publicación
const getPubsId = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "name email role");

        if (!post) {
            return res.status(404).json({
                message: "Publicación no encontrada"
            });
        }

        res.json({
            post
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener la publicación"
        });
    }
};


// Editar publicación
const actualizarPub = async (req, res) => {
    try {
        const { title, content } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Publicación no encontrada"
            });
        }

        const isAuthor =
            post.author.toString() === req.user.id;

        const isAdmin =
            req.user.role === "admin";

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({
                message: "No tienes permisos para editar esta publicación"
            });
        }

        if (title !== undefined) {
            post.title = title;
        }

        if (content !== undefined) {
            post.content = content;
        }

        if (req.file) {
            post.image = `/images/${req.file.filename}`;
        }

        await post.save();

        const updatedPost = await Post.findById(post._id)
            .populate("author", "name email role");

        res.json({
            message: "Publicación actualizada correctamente",
            post: updatedPost
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al actualizar la publicación"
        });
    }
};


// Eliminar publicación
const eliminarPub = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Publicación no encontrada"
            });
        }

        // Comprobar permisos
        const isAuthor =
            post.author.toString() === req.user.id;

        const isAdmin =
            req.user.role === "admin";

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({
                message: "No tienes permisos para eliminar esta publicación"
            });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({
            message: "Publicación eliminada correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al eliminar la publicación"
        });
    }
};

const toggleLike = async (req, res) => {

    try {

        const { id } = req.params;

        const post =
            await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                message: "Publicación no encontrada"
            });
        }

        const userId = req.user.id;

        const alreadyLiked =
            post.likes.some(
                like => like.toString() === userId
            );

        if (alreadyLiked) {

            // Quitar like

            post.likes =
                post.likes.filter(
                    like =>
                        like.toString() !== userId
                );

        } else {

            // Agregar like

            post.likes.push(userId);
        }

        await post.save();

        res.json({
            message: alreadyLiked
                ? "Like eliminado"
                : "Like agregado",

            liked: !alreadyLiked,

            likesCount:
                post.likes.length
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al procesar el like"
        });
    }
};

module.exports = {
    crearPub,
    getPubs,
    getPubsId,
    actualizarPub,
    eliminarPub,
    toggleLike
};