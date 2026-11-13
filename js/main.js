/* =========================================================================
   Lógica de la invitación. Cada sección tiene su propio módulo (función init*).
   Para sumar una sección nueva: escribir su init y agregarla a MODULOS al final.
   Los datos vienen de js/config.js (window.INVITACION).
   ========================================================================= */

(function () {
  "use strict";

  const CONFIG = window.INVITACION;

  // Si config.js tiene un error (ej. falta una coma), no dejamos la página
  // bloqueada detrás del sobre: lo quitamos y avisamos en la consola.
  if (!CONFIG) {
    console.error("No se pudo leer js/config.js. Revisá que no tenga errores de sintaxis.");
    document.body.classList.remove("sobre-cerrado");
    const s = document.querySelector("[data-sobre]");
    if (s) s.remove();
    return;
  }
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const pad = (n) => String(n).padStart(2, "0");
  const capitalizar = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const fechaEvento = new Date(CONFIG.evento.fecha);

  /* ---------- Textos: data-text="clave" (de textos) o "ruta.completa" ---------- */
  function initTextos() {
    $$("[data-text]").forEach((el) => {
      const clave = el.dataset.text;
      const valor = clave.includes(".")
        ? clave.split(".").reduce((o, k) => (o ? o[k] : undefined), CONFIG)
        : CONFIG.textos[clave];
      if (valor !== undefined && valor !== null) el.textContent = valor;
    });
    const p = CONFIG.pareja;
    document.title = `${p.nombre1} & ${p.nombre2} · ${CONFIG.textos.heroSubtitulo}`;
  }

  /* ---------- Fecha formateada en español ---------- */
  function initFecha() {
    if (isNaN(fechaEvento)) {
      console.warn("Fecha inválida en config.js:", CONFIG.evento.fecha);
      return;
    }
    const tz = CONFIG.evento.zonaHoraria;
    const fmt = (opts, d = fechaEvento) => new Intl.DateTimeFormat("es-AR", { timeZone: tz, ...opts }).format(d);
    const fin = new Date(fechaEvento.getTime() + (CONFIG.evento.duracionHoras || 0) * 3600 * 1000);
    const partes = {
      diaSemana: capitalizar(fmt({ weekday: "long" })),
      dia: fmt({ day: "numeric" }),
      mes: capitalizar(fmt({ month: "long" })),
      anio: fmt({ year: "numeric" }),
      hora: fmt({ hour: "2-digit", minute: "2-digit", hour12: false }),
      horaFin: fmt({ hour: "2-digit", minute: "2-digit", hour12: false }, fin),
    };
    $$("[data-fecha]").forEach((el) => {
      const v = partes[el.dataset.fecha];
      if (v) el.textContent = v;
    });
  }

  /* ---------- Cuenta regresiva ---------- */
  function initCuentaRegresiva() {
    const box = $("[data-countdown]");
    const final = $("[data-countdown-final]");
    if (!box || isNaN(fechaEvento)) return;

    const unidades = {
      dias: $('[data-unit="dias"]', box),
      horas: $('[data-unit="horas"]', box),
      minutos: $('[data-unit="minutos"]', box),
      segundos: $('[data-unit="segundos"]', box),
    };
    let timer;

    function tick() {
      const diff = fechaEvento - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        box.hidden = true;
        final.textContent = CONFIG.textos.cuentaFinal;
        final.hidden = false;
        const agendar = $("[data-agendar]");
        if (agendar) agendar.hidden = true;
        return;
      }
      const s = Math.floor(diff / 1000);
      unidades.dias.textContent = pad(Math.floor(s / 86400));
      unidades.horas.textContent = pad(Math.floor((s % 86400) / 3600));
      unidades.minutos.textContent = pad(Math.floor((s % 3600) / 60));
      unidades.segundos.textContent = pad(s % 60);
    }

    tick();
    timer = setInterval(tick, 1000);
  }

  /* ---------- Botones "Agendar" (Google Calendar + .ics para iPhone) ---------- */
  function initAgendar() {
    const google = $("[data-agendar-google]");
    const ics = $("[data-agendar-ics]");
    if (!google || !ics || isNaN(fechaEvento)) return;

    const ev = CONFIG.evento;
    const fin = new Date(fechaEvento.getTime() + ev.duracionHoras * 3600 * 1000);
    const utc = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const u = CONFIG.ubicacion || {};
    const lugar = [u.nombre, u.direccion].filter(Boolean).join(", ");
    const detalle = `${CONFIG.textos.heroSubtitulo} · ${CONFIG.pareja.nombre1} & ${CONFIG.pareja.nombre2}`;

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: ev.tituloAgenda,
      dates: `${utc(fechaEvento)}/${utc(fin)}`,
      details: detalle,
      location: lugar,
    });
    google.href = `https://calendar.google.com/calendar/render?${params}`;

    const contenido = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Invitacion Aniversario//ES",
      "BEGIN:VEVENT",
      `UID:${utc(fechaEvento)}-aniversario@invitacion`,
      `DTSTAMP:${utc(new Date())}`,
      `DTSTART:${utc(fechaEvento)}`,
      `DTEND:${utc(fin)}`,
      `SUMMARY:${ev.tituloAgenda}`,
      `DESCRIPTION:${detalle}`,
      lugar ? `LOCATION:${lugar.replace(/,/g, "\\,")}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ].filter(Boolean).join("\r\n");
    ics.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(contenido);
    ics.download = "aniversario.ics";
  }

  /* ---------- Aparición suave al hacer scroll ---------- */
  function initReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Música de fondo ---------- */
  // Si el archivo no existe o no se puede reproducir, el botón queda oculto
  // y la página sigue funcionando normalmente.
  let musica = null;

  function initMusica() {
    const btn = $("[data-musica]");
    const cfg = CONFIG.musica || {};
    if (!btn || !cfg.src) return;

    const audio = new Audio();
    audio.loop = true;
    audio.preload = "metadata"; // alcanza para detectar si el archivo existe
    audio.volume = typeof cfg.volumen === "number" ? cfg.volumen : 0.35;

    let disponible = true;
    let quiereSonar = false;

    function actualizarBoton() {
      const sonando = !audio.paused;
      btn.classList.toggle("is-playing", sonando);
      btn.setAttribute("aria-pressed", String(sonando));
      btn.setAttribute("aria-label", sonando ? "Pausar música" : "Reproducir música");
    }

    function reproducir() {
      if (!disponible) return;
      const p = audio.play();
      if (p && p.catch) p.catch(actualizarBoton); // bloqueado o sin archivo: sin errores visibles
    }

    audio.addEventListener("error", () => {
      disponible = false;
      btn.hidden = true;
      console.info(`Música no disponible (${cfg.src}). La invitación funciona igual.`);
    });
    audio.addEventListener("play", actualizarBoton);
    audio.addEventListener("pause", actualizarBoton);
    audio.src = cfg.src;

    btn.addEventListener("click", () => {
      if (audio.paused) { quiereSonar = true; reproducir(); }
      else { quiereSonar = false; audio.pause(); }
    });

    // Pausar cuando se cambia de app/pestaña y retomar al volver
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) audio.pause();
      else if (quiereSonar) reproducir();
    });

    musica = {
      iniciar() {
        quiereSonar = true;
        if (disponible) btn.hidden = false;
        reproducir();
        actualizarBoton();
      },
    };
  }

  /* ---------- Pantalla de entrada (sobre) ---------- */
  let sobreListo = false;

  function initSobre() {
    const sobre = $("[data-sobre]");
    if (!sobre) { document.body.classList.remove("sobre-cerrado"); return; }

    const p = CONFIG.pareja;
    const iniciales = $("[data-iniciales]", sobre);
    if (iniciales) iniciales.textContent = `${p.nombre1.charAt(0)}&${p.nombre2.charAt(0)}`;

    const boton = $("[data-abrir]", sobre);
    const rapido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    boton.addEventListener("click", () => {
      // La música tiene que arrancar dentro del mismo toque del usuario.
      if (musica) musica.iniciar();
      sobre.classList.add("is-abriendo");
      setTimeout(() => {
        sobre.classList.add("is-oculto");
        document.body.classList.remove("sobre-cerrado");
      }, rapido ? 0 : 900);
      setTimeout(() => { sobre.hidden = true; }, rapido ? 50 : 1800);
    }, { once: true });

    boton.focus({ preventScroll: true });
    sobreListo = true;
  }

  /* ---------- Ubicación ---------- */
  function initUbicacion() {
    const u = CONFIG.ubicacion;
    const link = $("[data-maps]");
    if (!u || !link) return;
    const busqueda = u.busquedaMaps || [u.nombre, u.direccion].filter(Boolean).join(", ");
    link.href = u.linkMaps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(busqueda)}`;
  }

  /* ---------- Confirmación de asistencia por WhatsApp ---------- */
  function initConfirmacion() {
    const boton = $("[data-whatsapp]");
    const c = CONFIG.confirmacion;
    if (!boton || !c) return;

    const limite = $("[data-confirmar-limite]");
    if (limite && c.fechaLimite) {
      limite.textContent = `Te pedimos confirmar antes del ${c.fechaLimite}`;
      limite.hidden = false;
    }

    const numero = String(c.whatsapp || "").replace(/\D/g, "");
    if (/x/i.test(c.whatsapp || "") || numero.length < 10) {
      // Número sin configurar: el botón no abre un link roto.
      console.warn("Completá WHATSAPP_NUMBER en js/config.js");
      const aviso = $("[data-whatsapp-aviso]");
      boton.addEventListener("click", (e) => {
        e.preventDefault();
        if (aviso) aviso.hidden = false;
      });
      return;
    }
    boton.href = `https://wa.me/${numero}?text=${encodeURIComponent(c.mensaje || "")}`;
  }

  /* ---------- Arranque ---------- */
  const MODULOS = [
    initTextos,
    initFecha,
    initMusica,      // antes que initSobre
    initSobre,
    initCuentaRegresiva,
    initAgendar,
    initUbicacion,
    initConfirmacion,
    initReveal,
    // próximas secciones: agregar acá su init
  ];

  MODULOS.forEach((fn) => {
    try { fn(); } catch (err) { console.error(`Error en ${fn.name}:`, err); }
  });

  // Red de seguridad: si el sobre no se pudo preparar, que no tape la página.
  if (!sobreListo) {
    document.body.classList.remove("sobre-cerrado");
    const s = $("[data-sobre]");
    if (s) s.hidden = true;
  }
})();
