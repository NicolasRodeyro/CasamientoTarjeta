/* =========================================================================
   CONFIGURACIÓN DE LA INVITACIÓN
   -------------------------------------------------------------------------
   Todo lo editable está acá: nombres, fecha, ubicación, WhatsApp, música,
   y textos. No hace falta tocar index.html ni main.js.
   (Excepción: los meta tags Open Graph de index.html, ver README.)
   ========================================================================= */

/* ✏️ NÚMERO DE WHATSAPP PARA CONFIRMAR ASISTENCIA
   Formato: código de país + código de área SIN el 0 + número SIN el 15.
   Sólo números: sin "+", espacios ni guiones.
   En Argentina, para celulares va "549" adelante (54 = país, 9 = celular).
   Ejemplo: (0351) 15 123-4567  →  "5493511234567"                         */
const WHATSAPP_NUMBER = "5493513645347";

window.INVITACION = {
  pareja: {
    nombre1: "Sil",
    nombre2: "José",
  },

  aniversario: {
    anios: 30,
    nombre: "Bodas de Perla", // 30 años = bodas de perla
  },

  evento: {
    // Fecha del evento: 23/01/2027. ⚠️ La hora (21:00) es provisoria.
    // Formato: "AAAA-MM-DDTHH:MM:SS-03:00"  (-03:00 = hora de Argentina)
    fecha: "2027-01-23T21:00:00-03:00",
    zonaHoraria: "America/Argentina/Buenos_Aires",
    duracionHoras: 6, // se usa para el botón "Agendar"
    tituloAgenda: "Aniversario 30 años · Silvana & José",
  },

  ubicacion: {
    nombre: "Salón Principal",
    direccion: "San Isidro, Villa Allende",
    // Lo que se busca en Google Maps al tocar "Cómo llegar".
    busquedaMaps: "Salón Principal, San Isidro, Villa Allende, Córdoba, Argentina",
    // Opcional: link exacto de Google Maps (en Maps: Compartir → Copiar vínculo).
    // Si lo completás, tiene prioridad sobre la búsqueda.
    linkMaps: "",
  },

  confirmacion: {
    whatsapp: WHATSAPP_NUMBER,
    // Mensaje que aparece escrito al abrir WhatsApp.
    mensaje: "¡Hola! Confirmo mi asistencia al aniversario de Sil y José!",
    // Opcional: fecha límite para confirmar, escrita como se va a leer.
    // Ej: "10 de enero". Si queda vacío, no se muestra.
    fechaLimite: "",
  },

  musica: {
    src: "audio/perfect.mp3",
    volumen: 0.35, // 0 a 1 (en iPhone el volumen lo maneja el teléfono)
  },

  textos: {
    sobreTexto: "Tenés una invitación",
    sobreBoton: "Abrir invitación",

    heroSubtitulo: "Aniversario de 30 años", // título de la pestaña y del evento en el calendario
    heroInvitacion: "Te invitamos a nuestro aniversario", // texto de la portada
    heroAnios: "30 años", // va debajo de heroInvitacion, en grande

    invitacionTitulo: "Treinta años",
    invitacionTexto:
      "Hace treinta años nos dijimos que sí, y desde entonces construimos una vida llena de amor, risas y compañía. Queremos celebrarlo con las personas que forman parte de nuestra historia.",
    invitacionFirma: "Con todo nuestro cariño",

    cuentaTitulo: "Falta muy poco",
    cuentaFinal: "¡Hoy es el gran día!",


    ubicacionTitulo: "¿Dónde?",

    dressCodeEtiqueta: "Dress code",
    dressCodeTitulo: "Vestimenta",
    dressCodeValor: "Elegante",
    dressCodeTexto: "Vení con tu mejor look para celebrar con nosotros.",

    confirmacionTitulo: "Confirmá tu asistencia",
    confirmacionTexto: "Tu confirmación nos ayuda a preparar todo. Es un solo toque.",

    cierre: "Te esperamos para celebrar juntos",
  },
};
