const API_URL = "/api";


// ====================================
// OBTENER ID DE LA URL
// ====================================

const params =
    new URLSearchParams(
        window.location.search
    );

const postId =
    params.get("id");


// ====================================
// ELEMENTOS DEL FORMULARIO
// ====================================

const form =
    document.querySelector(
        "#edit-post-form"
    );

const titleInput =
    document.querySelector(
        "#post-title"
    );

const contentInput =
    document.querySelector(
        "#post-content"
    );

const imageInput =
    document.querySelector(
        "#post-image"
    );

const currentImageContainer =
    document.querySelector(
        "#current-image-container"
    );

const imagePreviewContainer =
    document.querySelector(
        "#image-preview-container"
    );

const imagePreview =
    document.querySelector(
        "#image-preview"
    );

const formMessage =
    document.querySelector(
        "#form-message"
    );


// ====================================
// VERIFICAR ID
// ====================================

if (!postId) {

    formMessage.textContent =
        "No se especificó una publicación.";

    formMessage.classList.add(
        "error-message"
    );

    form.style.display = "none";
}


// ====================================
// OBTENER PUBLICACIÓN
// ====================================

async function getPost() {

    try {

        const response =
            await fetch(
                `${API_URL}/pub/${postId}`
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "No se pudo obtener la publicación"
            );
        }

        return data.post;

    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            true
        );

        return null;
    }
}


// ====================================
// CARGAR DATOS
// ====================================

async function loadPost() {

    const post =
        await getPost();

    if (!post) {
        return;
    }


    // Título

    titleInput.value =
        post.title;


    // Contenido

    contentInput.value =
        post.content;


    // Imagen

    if (post.image) {

        currentImageContainer.innerHTML = `

            <img
                src="${post.image}"
                alt="${post.title}"
                class="post-image"
            >

        `;

    } else {

        currentImageContainer.innerHTML = `

            <p>
                Esta publicación no tiene imagen.
            </p>

        `;
    }
}


// ====================================
// VISTA PREVIA DE NUEVA IMAGEN
// ====================================

imageInput.addEventListener(
    "change",
    () => {

        const file =
            imageInput.files[0];

        if (!file) {

            imagePreviewContainer.style.display =
                "none";

            imagePreview.src = "";

            return;
        }


        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            showMessage(
                "Solo se permiten imágenes JPG, PNG, WEBP o GIF.",
                true
            );

            imageInput.value = "";

            return;
        }


        const imageURL =
            URL.createObjectURL(file);

        imagePreview.src =
            imageURL;

        imagePreviewContainer.style.display =
            "block";
    }
);


// ====================================
// ACTUALIZAR PUBLICACIÓN
// ====================================

async function updatePost() {

    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        showMessage(
            "Debes iniciar sesión para editar una publicación.",
            true
        );

        return;
    }


    const title =
        titleInput.value.trim();

    const content =
        contentInput.value.trim();

    const image =
        imageInput.files[0];


    // ====================================
    // VALIDACIÓN BÁSICA
    // ====================================

    if (title.length < 5) {

        showMessage(
            "El título debe tener al menos 5 caracteres.",
            true
        );

        return;
    }


    if (title.length > 150) {

        showMessage(
            "El título no puede superar los 150 caracteres.",
            true
        );

        return;
    }


    if (content.length < 10) {

        showMessage(
            "El contenido debe tener al menos 10 caracteres.",
            true
        );

        return;
    }


    // ====================================
    // FORMDATA
    // ====================================

    const formData =
        new FormData();

    formData.append(
        "title",
        title
    );

    formData.append(
        "content",
        content
    );


    if (image) {

        formData.append(
            "image",
            image
        );
    }


    try {

        const response =
            await fetch(
                `${API_URL}/pub/${postId}`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: formData
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "No se pudo actualizar la publicación"
            );
        }


        showMessage(
            "Publicación actualizada correctamente.",
            false
        );


        // Esperar un momento y regresar

        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 1000);


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            true
        );
    }
}


// ====================================
// SUBMIT DEL FORMULARIO
// ====================================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        await updatePost();

    }
);


// ====================================
// MOSTRAR MENSAJE
// ====================================

function showMessage(
    message,
    isError
) {

    formMessage.textContent =
        message;

    formMessage.classList.remove(
        "error-message",
        "success-message"
    );


    if (isError) {

        formMessage.classList.add(
            "error-message"
        );

    } else {

        formMessage.classList.add(
            "success-message"
        );
    }
}


// ====================================
// INICIALIZAR
// ====================================

if (postId) {
    loadPost();
}