# Invitación · Aniversario 30 años · Silvana & José

Landing page estática (HTML + CSS + JS, sin frameworks). Se publica tal cual en GitHub Pages, Netlify o Vercel.

## Estructura

```
index.html        → secciones de la página
css/styles.css    → estilos (paleta y fuentes en :root)
js/config.js      → ✏️ TODO lo editable: nombres, fecha, ubicación, WhatsApp, música, textos
js/main.js        → lógica (un módulo por sección)
images/           → todas las imágenes
audio/            → música de fondo
```

Orden de la página: sobre de entrada → portada → invitación → cuenta regresiva → ubicación → confirmación.

## Imágenes que espera el proyecto

Reemplazá los archivos de `images/` por las fotos reales **con el mismo nombre** (en formato `.jpg`).

| Archivo              | Dónde se usa                          | Proporción          | Tamaño sugerido |
|----------------------|---------------------------------------|---------------------|-----------------|
| `foto-6.jpg`         | Foto en marco de arco (invitación)    | Vertical 4:5        | 900 × 1125      |
| `og-aniversario.jpg` | Vista previa al compartir por WhatsApp | Horizontal 1.91:1   | 1200 × 630      |

Consejos: que pesen menos de ~300 KB cada una (se puede comprimir en squoosh.app). Las fotos se recortan automáticamente para llenar el marco, así que conviene que la pareja esté centrada.
Las fotos originales (incluida la `.heic` del iPhone, que los navegadores no muestran) quedaron en `fotos-originales/`, que la página no usa.

## Música

Copiá la canción en **`audio/perfect.mp3`** (exactamente ese nombre, en minúsculas).

- Suena al tocar "Abrir invitación" en el sobre de entrada (los navegadores no permiten arrancar audio sin un toque), se repite en loop y tiene un botón flotante para pausar.
- Si el archivo no está, la invitación funciona igual y el botón de música no aparece.
- Conviene que pese menos de ~5 MB (MP3 a 128 kbps), porque la mayoría la abre con datos del celular.
- Volumen en `musica.volumen` de `config.js`. En iPhone el volumen lo controla el teléfono.

## Editar contenido

Todo está en `js/config.js`. Lo más importante:

```js
evento: {
  fecha: "2027-01-23T21:00:00-03:00",   // 23/01/2027 — confirmar la hora (21:00 es provisoria)
}
```

Otros datos importantes en `config.js`:

- `WHATSAPP_NUMBER` (arriba de todo): número para confirmar asistencia. Formato: código de país + área sin 0 + número sin 15, sólo dígitos. Ej: (0351) 15 123-4567 → `5493511234567`. Mientras tenga X, el formulario avisa que falta configurarlo.
- `ubicacion`: nombre y dirección del salón. Para que "Cómo llegar" apunte al lugar exacto, pegá en `linkMaps` el link de Google Maps (Compartir → Copiar vínculo).
- `confirmacion`: mensajes de WhatsApp, cantidad máxima de personas y fecha límite opcional.

**Excepción:** los textos de vista previa de WhatsApp (meta tags `og:` en `index.html`) se editan directo en el HTML, porque WhatsApp no ejecuta JavaScript.

## Antes de compartir el link

1. Publicar el sitio y copiar la URL final (ej. `https://usuario.github.io/aniversario/`).
2. En `index.html`, completar `og:url` con esa URL y cambiar `og:image` a la URL completa:
   `https://usuario.github.io/aniversario/images/og-aniversario.jpg` (WhatsApp necesita la dirección completa).
3. Si WhatsApp sigue mostrando una vista previa vieja, agregá `?v=2` al final del link.

## Agregar secciones nuevas (ubicación, confirmación, etc.)

1. En `index.html`, copiar un bloque `<section class="section ...">` antes del comentario "PRÓXIMAS SECCIONES". Alternar fondos `section--blanco`, `section--marfil`, `section--crema`.
2. Textos nuevos → en `textos` de `config.js`, y en el HTML con `data-text="clave"`.
3. Si necesita lógica, crear una función `initAlgo()` en `js/main.js` y agregarla a `MODULOS`.
4. Para que un elemento aparezca suavemente al scrollear, darle la clase `reveal`.
