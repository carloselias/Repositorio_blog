const Comment = require("../modelos/comentarios");
const Post = require("../modelos/publicaciones");

const getComments = async (req, res) => {
    try {

        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Publicación no encontrada"
            });
        }

        const comments = await Comment.find({
            post: postId
        })
            .populate("author", "name email role")
            .sort({ createdAt: -1 });

        res.json({
            comments
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al obtener los comentarios"
        });
    }
};

const createComment = async (req, res) => {
    try {

        const { postId } = req.params;
        const { content } = req.body;

        if (!content || content.trim() === "") {
            return res.status(400).json({
                message: "El comentario no puede estar vacío"
            });
        }

        if (content.trim().length > 500) {
            return res.status(400).json({
                message: "El comentario no puede superar los 500 caracteres"
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Publicación no encontrada"
            });
        }

        const comment = await Comment.create({
            content: content.trim(),
            author: req.user.id,
            post: postId
        });

        const populatedComment =
            await Comment.findById(comment._id)
                .populate("author", "name email role");

        res.status(201).json({
            message: "Comentario creado correctamente",
            comment: populatedComment
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al crear el comentario"
        });
    }
};

const deleteComment = async (req, res) => {
    try {

        const { commentId } = req.params;

        const comment =
            await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "404 Comentario no encontrado"
            });
        }

        const isAuthor =
            comment.author.toString() === req.user.id;

        const isAdmin =
            req.user.role === "admin";

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({
                message:
                    "No tienes permisos para eliminar este comentario"
            });
        }

        await Comment.findByIdAndDelete(commentId);

        res.json({
            message: "Comentario eliminado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al eliminar el comentario"
        });
    }
};

module.exports = {
    getComments,
    createComment,
    deleteComment
};