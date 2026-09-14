const API_URL = "/api";

/* =========================
   PUBLICACIONES
========================= */

async function getPosts() {

    try {

        const response =
            await fetch(`${API_URL}/pub`);

        if (!response.ok) {
            throw new Error(
                "No se pudieron obtener las publicaciones"
            );
        }

        const data = await response.json();

        return data.posts;

    } catch (error) {

        console.error(error);

        return [];
    }
}


async function loadPosts() {

    const posts = await getPosts();

    renderPosts(posts);
}


function renderPosts(posts) {

    const container =
        document.querySelector(".posts-list");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    posts.forEach(post => {

        const article =
            document.createElement("article");

        article.className = "post-card";

        article.innerHTML = `

            ${
                post.image
                ? `
                    <div class="post-image-container">
                        <img
                            src="${post.image}"
                            alt="${post.title}"
                            class="post-image"
                        >
                    </div>
                `
                : ""
            }

            <div class="post-content">

                <h2 class="post-title">
                    ${post.title}
                </h2>

                <div class="post-metadata">

                    <span class="post-author">
                        ${post.author?.name || "Usuario"}
                    </span>

                    <span class="post-date">
                        ${formatDate(post.createdAt)}
                    </span>

                </div>

                <div class="post-body">

                    <p class="post-text">
                        ${post.content}
                    </p>

                </div>

                <div class="post-interactions">

                    <button
                        class="like-button"
                        data-id="${post._id}"
                    >
                        <span class="like-icon">
                            ♥
                        </span>

                        <span class="like-text">
                            Me gusta
                        </span>

                        <span class="like-count">
                            ${post.likes?.length || 0}
                        </span>
                    </button>

                    <button
                        class="comments-button"
                        data-id="${post._id}"
                    >
                        <span class="comments-icon">
                            💬
                        </span>

                        <span class="comments-count">
                            0
                        </span>
                    </button>

                </div>

                <div class="post-actions">

                    <button
                        class="edit-post-button"
                        data-id="${post._id}"
                    >
                        Editar
                    </button>

                    <button
                        class="delete-post-button"
                        data-id="${post._id}"
                    >
                        Eliminar
                    </button>

                </div>

            </div>
        `;

        container.appendChild(article);
    });
}


/* =========================
   FECHAS
========================= */

function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "es-GT",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}


/* =========================
   AUTENTICACIÓN
========================= */

async function getCurrentUser() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/aut/me`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        if (!response.ok) {
            return null;
        }

        const data =
            await response.json();

        return data.user;

    } catch (error) {

        console.error(error);

        return null;
    }
}


/* =========================
   ELIMINAR POST
========================= */

async function deletePost(id) {

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                `${API_URL}/pub/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error al eliminar publicación"
            );
        }

        await loadPosts();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


/* =========================
   EVENTOS
========================= */

document.addEventListener(
    "click",
    async (event) => {

        if (
            event.target.classList.contains(
                "delete-post-button"
            )
        ) {

            const id =
                event.target.dataset.id;

            if (
                confirm(
                    "¿Deseas eliminar esta publicación?"
                )
            ) {

                await deletePost(id);
            }
        }

    }
);


/* =========================
   INICIO
========================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadPosts();

        const user =
            await getCurrentUser();

        if (user) {

            const userName =
                document.querySelector(
                    ".user-name"
                );

            if (userName) {
                userName.textContent =
                    user.name;
            }
        }

    }
);