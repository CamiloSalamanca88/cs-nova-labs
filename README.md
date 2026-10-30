# CS Nova Labs: sitio web corporativo

Sitio de una sola página, hecho con HTML5 semántico, CSS3 y JavaScript sin frameworks ni dependencias.
No requiere compilación: funciona al abrir `index.html` y se publica subiendo la carpeta tal cual.

## Estructura

```
cs-nova-labs/
├── index.html              Página completa (header, hero, servicios, método, proyectos, nosotros, contacto, footer)
├── robots.txt              Indicaciones para buscadores
├── sitemap.xml             Mapa del sitio
└── assets/
    ├── css/
    │   ├── base.css        Tokens de diseño (colores, tipografía, espaciado), reset y accesibilidad
    │   ├── layout.css      Contenedor, header, menú móvil, secciones y footer
    │   └── components.css  Botones, hero, servicios, método, proyectos, nosotros y formulario
    ├── js/
    │   ├── config.js       ← ÚNICO archivo para tus datos: WhatsApp, correo, redes y enlaces
    │   ├── main.js         Header, menú móvil, sección activa y aplicación de config.js
    │   ├── hero-nova.js    Animación del hero (canvas)
    │   └── contact.js      Validación del formulario y envío por WhatsApp
    └── img/
        ├── favicon.svg
        ├── og-image.png    Imagen para compartir en redes (1200×630)
        └── proyecto-*.svg  Capturas PROVISIONALES del portafolio
```

## Cómo verlo en tu computador

**Opción 1, la más rápida:** haz doble clic en `index.html`.

**Opción 2, servidor local** (recomendado para probar como si estuviera publicado):

```bash
cd cs-nova-labs
python -m http.server 8080      # o: npx serve .
```

Luego abre http://localhost:8080. Si usas VS Code, la extensión *Live Server* también sirve.

## Configuración (antes de publicar)

Edita `assets/js/config.js`:

| Campo | Ejemplo | Efecto |
|---|---|---|
| `whatsappNumber` | `"51987654321"` | Solo dígitos, con código de país (51 Perú, 56 Chile). Activa el formulario y los enlaces. |
| `whatsappDisplay` | `"+51 987 654 321"` | Cómo se ve el número en la página. |
| `email` | `"contacto@tudominio.com"` | Enlace `mailto:` en contacto y footer. |
| `social.*` | URL completa | Las redes vacías se ocultan; si todas están vacías, se oculta la columna. |
| `projects.vademecum` | URL de demo o caso | Muestra el enlace "Ver proyecto". Vacío = oculto. |

## Contenido provisional que debes revisar

Están marcados con `<!-- PROVISIONAL -->` en `index.html`:

1. **Dominio:** `https://www.csnovalabs.com/` aparece en `canonical`, `og:url`, `og:image`, JSON-LD, `robots.txt` y `sitemap.xml`. Reemplázalo por el dominio real.
2. **Capturas del portafolio:** reemplaza `assets/img/proyecto-vademecum.svg` y `proyecto-condominios.svg` por capturas reales (idealmente `.webp`, 1600×1000) y actualiza el `src` en `index.html`.
3. **Proyecto de condominios:** confirma con tu cliente que puedes mostrarlo antes de publicar.
4. **Nosotros:** el texto de presentación, la misión y la visión son borradores. Revísalos y ajústalos a tu voz.
5. **Tecnologías del hero:** confirma que la lista refleja lo que realmente ofreces.

## Cómo funciona el formulario

No hay backend. Al enviar, el formulario valida los campos y abre WhatsApp (`wa.me`) con el mensaje armado; la persona solo presiona enviar.
Ningún dato se guarda en un servidor. Si más adelante quieres recibir los mensajes por correo, puedes cambiar el envío en `contact.js` por un servicio como Formspree o por un endpoint propio (por ejemplo, en Spring Boot).

## Publicación (gratis)

- **Netlify:** arrastra la carpeta a https://app.netlify.com/drop.
- **GitHub Pages:** sube la carpeta a un repositorio y activa *Settings → Pages* sobre la rama principal.
- **Cloudflare Pages / Vercel:** conecta el repositorio; no hay comando de build y el directorio de salida es la raíz.

Después de publicar, registra el sitio en Google Search Console y envía `sitemap.xml`.

## Personalizar la marca

Todos los colores, tamaños y radios están en `:root` dentro de `assets/css/base.css`.
La tipografía es **Schibsted Grotesk** (Google Fonts); si no carga, se usa la fuente del sistema.
El logotipo es provisional: es el mismo símbolo SVG en el header, el footer y `favicon.svg`.

## Accesibilidad y rendimiento incluidos

- Enlace "Saltar al contenido", foco visible, etiquetas en todos los campos y errores anunciados.
- Respeta `prefers-reduced-motion`: sin animaciones si el sistema lo pide.
- La animación del hero se pausa cuando no está visible o la pestaña está oculta.
- Imágenes con dimensiones declaradas y carga diferida (`loading="lazy"`).
- Contraste AA en los textos principales sobre fondos claros y oscuros.
