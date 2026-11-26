// Dirección de la API que devuelve una foto al azar
const URL_API = "https://dog.ceo/api/breeds/image/random";

// Referencias a los elementos del HTML
const foto = document.getElementById("foto");
const estado = document.getElementById("estado");
const boton = document.getElementById("boton");

// Saca la raza de la URL de la imagen.
// Ejemplo: ".../breeds/hound-afghan/n0208.jpg" → "hound afghan"
function obtenerRaza(urlImagen) {
  const partes = urlImagen.split("/");         // corta el texto en cada "/"
  const raza = partes[partes.indexOf("breeds") + 1]; // toma lo que viene después de "breeds"
  return raza.replace("-", " ");
}

// Función asíncrona: puede "esperar" (await) sin congelar la página
async function mostrarPerro() {
  boton.disabled = true;          // evita que se hagan muchos clics seguidos
  estado.textContent = "Cargando…";

  try {
    // 1) Pedimos los datos a la API y esperamos la respuesta
    const respuesta = await fetch(URL_API);

    // 2) fetch NO falla con errores HTTP (404, 500): hay que revisarlo a mano
    if (!respuesta.ok) {
      throw new Error("Error HTTP " + respuesta.status);
    }

    // 3) Convertimos el cuerpo de la respuesta (texto JSON) en un objeto
    const datos = await respuesta.json();

    // 4) Usamos los datos: "message" trae la URL de la foto
    foto.src = datos.message;
    foto.alt = "Foto de un perro de raza " + obtenerRaza(datos.message);
    estado.textContent = obtenerRaza(datos.message);
  } catch (error) {
    // Entra acá si no hay internet o si lanzamos el error del paso 2
    estado.textContent = "No se pudo cargar la foto. Probá de nuevo.";
    console.error(error);
  } finally {
    // Se ejecuta siempre, salga bien o mal
    boton.disabled = false;
  }
}

// Cada clic en el botón trae otra foto
boton.addEventListener("click", mostrarPerro);

// Primera foto al cargar la página
mostrarPerro();