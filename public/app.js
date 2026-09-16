let currentUser = null;
let redirectToCreatePost = false;
const API_URL = "/api";

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
        const authorId =
            post.author?._id?.toString();

        const currentUserId =
            currentUser?._id?.toString();

        const isAuthor =
            currentUser &&
            authorId === currentUserId;

        const isAdmin =
            currentUser?.role === "admin";

        const canModify =
            isAuthor || isAdmin;

        const actionsHTML = canModify
            ? `
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
            `
            : "";

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
                        Comentarios

                        <span class="comments-count">
                            0
                        </span>

                    </button>

                </div>

                ${actionsHTML}

            </div>
        `;

        container.appendChild(article);
    });
}

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

async function login(email, password) {

    try {

        const response = await fetch(
            `${API_URL}/aut/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error al iniciar sesión"
            );
        }

        /*
         * Guardamos el JWT
         */
        localStorage.setItem(
            "token",
            data.token
        );

        /*
         * Si el login devuelve el usuario,
         * lo utilizamos directamente.
         */
        localStorage.setItem(
            "token",
            data.token
        );

        currentUser = await getCurrentUser();

        return data;

    } catch (error) {

        console.error(
            "Error de login:",
            error
        );

        throw error;
    }
}

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

        /*
         * Token inválido o expirado
         */
        if (response.status === 401) {

            localStorage.removeItem("token");

            return null;
        }

        if (!response.ok) {
            return null;
        }

        const data =
            await response.json();

        return data.user;

    } catch (error) {

        console.error(
            "Error obteniendo usuario:",
            error
        );

        return null;
    }
}

function openLoginModal() {

    const modal =
        document.querySelector("#login-modal");

    const email =
        document.querySelector("#login-email");

    const message =
        document.querySelector("#login-message");

    message.textContent = "";

    modal.style.display = "flex";

    email.focus();
}

function closeLoginModal() {

    const modal =
        document.querySelector("#login-modal");

    modal.style.display = "none";
}

function updateUserInterface() {

    const userName =
        document.querySelector(".user-name");

    const loginButton =
        document.querySelector("#login-button");

    const logoutButton =
        document.querySelector("#logout-button");


    if (currentUser) {

        /*
         * Usuario autenticado
         */

        userName.textContent =
            currentUser.name;

        loginButton.style.display =
            "none";

        logoutButton.style.display =
            "inline-block";

    } else {

        /*
         * Usuario no autenticado
         */

        userName.textContent =
            "Invitado";

        loginButton.style.display =
            "inline-block";

        logoutButton.style.display =
            "none";
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
    "DOMContentLoaded",
    async () => {

        /*
         * Comprobar si ya existe
         * una sesión guardada
         */
        currentUser =
            await getCurrentUser();

        updateUserInterface();

        /*
         * Cargar publicaciones después
         * de conocer al usuario.
         */
        await loadPosts();


        /* -------------------------
           Abrir login
           ------------------------- */

        document
            .querySelector("#login-button")
            .addEventListener(
                "click",
                openLoginModal
            );

        /* -------------------------
        Crear publicación
        ------------------------- */

        document
        .querySelectorAll(".create-post-button, .nav-link-create-post")
        .forEach((button) => {
            button.addEventListener("click", () => {
            if (currentUser) {
                window.location.href = "crearPub.html";
                return;
            }

            redirectToCreatePost = true;
            openLoginModal();
            });
        });


        /* -------------------------
           Cerrar login
           ------------------------- */

        document
            .querySelector("#close-login-modal")
            .addEventListener(
                "click",
                closeLoginModal
            );


        /* -------------------------
           Cerrar haciendo clic
           fuera del formulario
           ------------------------- */

        document
            .querySelector("#login-modal")
            .addEventListener(
                "click",
                (event) => {

                    if (
                        event.target.id ===
                        "login-modal"
                    ) {

                        closeLoginModal();
                    }
                }
            );


        /* -------------------------
           Formulario
           ------------------------- */

        document
            .querySelector("#login-form")
            .addEventListener(
                "submit",
                async (event) => {

                    event.preventDefault();


                    const email =
                        document
                            .querySelector(
                                "#login-email"
                            )
                            .value
                            .trim();


                    const password =
                        document
                            .querySelector(
                                "#login-password"
                            )
                            .value;


                    const message =
                        document
                            .querySelector(
                                "#login-message"
                            );


                    message.textContent =
                        "Iniciando sesión...";


                    try {
                        await login(
                            email,
                            password
                        );

                        /*
                         * Actualizar header
                         */
                        updateUserInterface();

                                                /*
                        * Si el login fue iniciado desde
                        * "Crear publicación", ir a la
                        * pantalla de creación.
                        */
                        if (redirectToCreatePost) {

                            redirectToCreatePost = false;

                            window.location.href =
                                "crearPub.html";

                            return;
                        }

                        /*
                         * Cerrar modal
                         */
                        closeLoginModal();


                        /*
                         * Limpiar formulario
                         */
                        document
                            .querySelector(
                                "#login-form"
                            )
                            .reset();


                        /*
                         * Volver a renderizar
                         * publicaciones.
                         */
                        await loadPosts();
                    } catch (error) {

                        message.textContent =
                            error.message;
                    }
                }
            );


        /* -------------------------
           Cerrar sesión
           ------------------------- */

        document
            .querySelector("#logout-button")
            .addEventListener(
                "click",
                async () => {

                    localStorage.removeItem(
                        "token"
                    );

                    currentUser = null;

                    updateUserInterface();

                    await loadPosts();
                }
            );

    }
);

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