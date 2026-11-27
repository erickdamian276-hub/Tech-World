/*
  TECH WORLD
  Funciones de acceso, navegación e interacciones de la página principal.
  No usa librerías externas.
*/
"use strict";

/* Datos de demostración. Deben coincidir con los que se muestran en index.html. */
const USUARIO_DEMO = "techworld";
const CLAVE_DEMO = "azul2026";
const CLAVE_SESION = "techworld_usuario";

const temasFondo = [
  { clase: "tema-noche", nombre: "Noche" },
  { clase: "tema-electrico", nombre: "Azul eléctrico" },
  { clase: "tema-grafito", nombre: "Grafito" }
];

const galerias = {
  hero: ["img/hero-1.svg", "img/hero-2.svg"],
  tecnologia: ["img/tecnologia-1.svg", "img/tecnologia-2.svg"],
  computadoras: ["img/computadoras-1.svg", "img/computadoras-2.svg"],
  videojuegos: ["img/videojuegos-1.svg", "img/videojuegos-2.svg"],
  dispositivos: ["img/dispositivos-1.svg", "img/dispositivos-2.svg"]
};

const textosBienvenida = [
  {
    titulo: "Bienvenido a TECH WORLD",
    texto: "Un sitio para conocer ideas actuales de tecnología, equipos de cómputo, videojuegos y dispositivos que usamos cada día."
  },
  {
    titulo: "La tecnología también se explora",
    texto: "Cambia el fondo, recorre las tarjetas y compara cómo se presenta cada tema dentro del mismo sitio."
  },
  {
    titulo: "Un recorrido por el mundo digital",
    texto: "Computadoras, videojuegos y dispositivos conviven aquí como partes de una misma experiencia."
  }
];

let indiceFondo = 0;
let indiceGaleria = 0;
let indiceTexto = 0;

function iniciar() {
  const pagina = document.body.dataset.pagina;

  if (pagina === "acceso") {
    iniciarAcceso();
  }

  if (pagina === "inicio") {
    iniciarSitio();
  }
}

/* Muestra un aviso de error o de confirmación en el formulario. */
function mostrarMensaje(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = "mensaje " + tipo;
}

/* Valida campos vacíos y solo abre inicio.html con los datos correctos. */
function iniciarAcceso() {
  const formulario = document.querySelector("#formulario-acceso");
  const usuario = document.querySelector("#usuario");
  const clave = document.querySelector("#clave");
  const mensaje = document.querySelector("#mensaje-acceso");

  if (!formulario || !usuario || !clave || !mensaje) {
    return;
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = usuario.value.trim();
    const contrasena = clave.value.trim();

    usuario.classList.remove("invalido");
    clave.classList.remove("invalido");
    formulario.classList.remove("sacudir");

    if (!nombre && !contrasena) {
      usuario.classList.add("invalido");
      clave.classList.add("invalido");
      mostrarMensaje(mensaje, "Completa el usuario y la contraseña para continuar.", "error");
      usuario.focus();
      animarError(formulario);
      return;
    }

    if (!nombre) {
      usuario.classList.add("invalido");
      mostrarMensaje(mensaje, "El campo de usuario está vacío.", "error");
      usuario.focus();
      animarError(formulario);
      return;
    }

    if (!contrasena) {
      clave.classList.add("invalido");
      mostrarMensaje(mensaje, "El campo de contraseña está vacío.", "error");
      clave.focus();
      animarError(formulario);
      return;
    }

    if (nombre !== USUARIO_DEMO || contrasena !== CLAVE_DEMO) {
      usuario.classList.add("invalido");
      clave.classList.add("invalido");
      mostrarMensaje(mensaje, "Usuario o contraseña incorrectos. Usa los datos de demostración.", "error");
      animarError(formulario);
      return;
    }

    sessionStorage.setItem(CLAVE_SESION, nombre);
    mostrarMensaje(mensaje, "Acceso correcto. Abriendo la página principal...", "ok");

    window.setTimeout(function () {
      window.location.href = "inicio.html";
    }, 700);
  });
}

function animarError(formulario) {
  formulario.classList.add("sacudir");
  window.setTimeout(function () {
    formulario.classList.remove("sacudir");
  }, 450);
}

/* Prepara menú, sesión, animaciones y botones de la página principal. */
function iniciarSitio() {
  prepararMenu();
  mostrarSesion();
  prepararAparicion();
  prepararInteracciones();
  prepararTarjetas();
  prepararCierre();
}

function prepararMenu() {
  const boton = document.querySelector("#boton-menu");
  const navegacion = document.querySelector("#navegacion");

  if (!boton || !navegacion) {
    return;
  }

  boton.addEventListener("click", function () {
    const abierta = navegacion.classList.toggle("abierta");
    boton.setAttribute("aria-expanded", abierta ? "true" : "false");
  });

  navegacion.querySelectorAll("a").forEach(function (enlace) {
    enlace.addEventListener("click", function () {
      navegacion.classList.remove("abierta");
      boton.setAttribute("aria-expanded", "false");
    });
  });
}

function mostrarSesion() {
  const saludo = document.querySelector("#saludo-usuario");
  const nombre = sessionStorage.getItem(CLAVE_SESION);

  if (!saludo) {
    return;
  }

  if (nombre) {
    saludo.textContent = "Sesión de " + nombre;
  }
}

/* Anima las secciones cuando entran en la pantalla. */
function prepararAparicion() {
  const elementos = document.querySelectorAll(".revelar");

  if (!("IntersectionObserver" in window)) {
    elementos.forEach(function (elemento) {
      elemento.classList.add("visible");
    });
    return;
  }

  document.body.classList.add("js");

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.18 });

  elementos.forEach(function (elemento) {
    const rect = elemento.getBoundingClientRect();
    const visible = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;

    if (visible) {
      elemento.classList.add("visible");
    } else {
      observador.observe(elemento);
    }
  });
}

function prepararInteracciones() {
  const botonFondo = document.querySelector("#btn-fondo");
  const botonImagenes = document.querySelector("#btn-imagenes");
  const botonTextos = document.querySelector("#btn-textos");
  const estado = document.querySelector("#estado-interaccion");

  if (botonFondo) {
    botonFondo.addEventListener("click", function () {
      indiceFondo = (indiceFondo + 1) % temasFondo.length;
      aplicarFondo(temasFondo[indiceFondo]);
      escribirEstado(estado, "Fondo cambiado a " + temasFondo[indiceFondo].nombre + ".");
    });
  }

  if (botonImagenes) {
    botonImagenes.addEventListener("click", function () {
      indiceGaleria = (indiceGaleria + 1) % 2;
      cambiarImagenes(indiceGaleria);
      const numero = indiceGaleria + 1;
      escribirEstado(estado, "Se mostró la galería " + numero + " de imágenes.");
    });
  }

  if (botonTextos) {
    botonTextos.addEventListener("click", function () {
      indiceTexto = (indiceTexto + 1) % textosBienvenida.length;
      cambiarTextos(textosBienvenida[indiceTexto]);
      escribirEstado(estado, "Se actualizó el texto de bienvenida.");
    });
  }
}

function aplicarFondo(tema) {
  temasFondo.forEach(function (opcion) {
    document.body.classList.remove(opcion.clase);
  });
  document.body.classList.add(tema.clase);
}

function cambiarImagenes(indice) {
  const hero = document.querySelector("#imagen-hero");

  if (hero) {
    fundirImagen(hero, galerias.hero[indice]);
  }

  document.querySelectorAll(".imagen-tema").forEach(function (imagen) {
    const tema = imagen.dataset.tema;
    const rutas = galerias[tema];

    if (rutas && rutas[indice]) {
      fundirImagen(imagen, rutas[indice]);
    }
  });
}

function fundirImagen(imagen, ruta) {
  imagen.classList.add("cambiando");

  window.setTimeout(function () {
    imagen.src = ruta;
    imagen.classList.remove("cambiando");
  }, 180);
}

function cambiarTextos(contenido) {
  const titulo = document.querySelector("#titulo-bienvenida");
  const texto = document.querySelector("#texto-bienvenida");

  if (titulo) {
    titulo.textContent = contenido.titulo;
    titulo.classList.remove("pulso");
    void titulo.offsetWidth;
    titulo.classList.add("pulso");
  }

  if (texto) {
    texto.textContent = contenido.texto;
  }
}

function escribirEstado(elemento, mensaje) {
  if (elemento) {
    elemento.textContent = mensaje;
  }
}

/* Abre o cierra la información extra de cada tarjeta. */
function prepararTarjetas() {
  document.querySelectorAll(".tarjeta").forEach(function (tarjeta) {
    const boton = tarjeta.querySelector("button");

    if (!boton) {
      return;
    }

    boton.addEventListener("click", function () {
      const abierta = tarjeta.classList.toggle("abierta");
      boton.setAttribute("aria-expanded", abierta ? "true" : "false");
      boton.textContent = abierta ? "Ocultar" : "Ver más";
    });
  });
}

/* Limpia la sesión antes de volver al formulario. */
function prepararCierre() {
  const enlaces = document.querySelectorAll("#cerrar-sesion, #cerrar-sesion-pie");

  enlaces.forEach(function (enlace) {
    enlace.addEventListener("click", function () {
      sessionStorage.removeItem(CLAVE_SESION);
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar);
} else {
  iniciar();
}
