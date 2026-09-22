const API_URL = "/api";


const profileForm =
    document.querySelector("#profile-form");

const nameInput =
    document.querySelector("#profile-name");

const emailInput =
    document.querySelector("#profile-email");

const descriptionInput =
    document.querySelector("#profile-description");

const imageInput =
    document.querySelector("#profile-image");

const profileImageContainer =
    document.querySelector(
        "#profile-image-container"
    );

const profileMessage =
    document.querySelector(
        "#profile-message"
    );

const headerUserName =
    document.querySelector(
        "#header-user-name"
    );

const logoutButton =
    document.querySelector(
        "#logout-button"
    );


// ==========================================
// Mostrar mensaje
// ==========================================

function showMessage(message, type) {

    profileMessage.textContent =
        message;

    profileMessage.className =
        `form-message ${type}`;

}


// ==========================================
// Cargar usuario
// ==========================================

async function loadProfile() {

    const token =
        localStorage.getItem("token");


    if (!token) {

        window.location.href =
            "login.html";

        return;

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


        const data =
            await response.json();


        if (!response.ok) {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

            return;

        }


        const user =
            data.user;


        // Nombre

        nameInput.value =
            user.name || "";


        // Correo

        emailInput.value =
            user.email || "";


        // Descripción

        descriptionInput.value =
            user.description || "";


        // Nombre en encabezado

        headerUserName.textContent =
            user.name || "Usuario";


        // Foto

        renderProfileImage(
            user.profileImage
        );


    } catch (error) {

        console.error(
            "Error al cargar perfil:",
            error
        );


        showMessage(
            "No se pudo cargar el perfil",
            "error"
        );

    }

}


// ==========================================
// Mostrar foto de perfil
// ==========================================

function renderProfileImage(image) {

    if (image) {

        profileImageContainer.innerHTML = `

            <img
                src="${image}"
                alt="Foto de perfil"
                class="profile-image"
            >

        `;

    } else {

        profileImageContainer.innerHTML = `

            <p>
                No tienes una foto de perfil.
            </p>

        `;

    }

}


// ==========================================
// Vista previa
// ==========================================

imageInput.addEventListener(
    "change",
    () => {

        const image =
            imageInput.files[0];


        if (!image) {
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
                image.type
            )
        ) {

            showMessage(
                "Solo se permiten imágenes JPG, PNG, WEBP o GIF",
                "error"
            );

            imageInput.value = "";

            return;

        }


        if (
            image.size >
            5 * 1024 * 1024
        ) {

            showMessage(
                "La imagen no puede superar los 5 MB",
                "error"
            );

            imageInput.value = "";

            return;

        }


        const imageURL =
            URL.createObjectURL(image);


        profileImageContainer.innerHTML = `

            <img
                src="${imageURL}"
                alt="Vista previa"
                class="profile-image"
            >

        `;

    }
);


// ==========================================
// Guardar perfil
// ==========================================

profileForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const token =
            localStorage.getItem("token");


        if (!token) {

            window.location.href =
                "login.html";

            return;

        }


        const name =
            nameInput.value.trim();

        const description =
            descriptionInput.value.trim();

        const image =
            imageInput.files[0];


        // Validar nombre

        if (!name) {

            showMessage(
                "El nombre es obligatorio",
                "error"
            );

            return;

        }


        // Validar longitud del nombre

        if (
            name.length > 100
        ) {

            showMessage(
                "El nombre no puede superar los 100 caracteres",
                "error"
            );

            return;

        }


        // Validar descripción

        if (
            description.length > 500
        ) {

            showMessage(
                "La descripción no puede superar los 500 caracteres",
                "error"
            );

            return;

        }


        try {

            showMessage(
                "Guardando cambios...",
                "loading"
            );


            const formData =
                new FormData();


            formData.append(
                "name",
                name
            );


            formData.append(
                "description",
                description
            );


            if (image) {

                formData.append(
                    "profileImage",
                    image
                );

            }


            const response =
                await fetch(
                    `${API_URL}/aut/perfil`,
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
                    "No se pudo actualizar el perfil"
                );

            }


            showMessage(
                "Perfil actualizado correctamente",
                "success"
            );


            // Actualizar nombre del encabezado

            headerUserName.textContent =
                data.user.name;


            // Mostrar nueva imagen

            renderProfileImage(
                data.user.profileImage
            );


            // Limpiar input de imagen

            imageInput.value = "";


        } catch (error) {

            console.error(
                "Error al actualizar perfil:",
                error
            );


            showMessage(
                error.message,
                "error"
            );

        }

    }
);


// ==========================================
// Cerrar sesión
// ==========================================

logoutButton.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "token"
        );

        window.location.href =
            "index.html";

    }
);


// ==========================================
// Inicializar
// ==========================================

loadProfile();