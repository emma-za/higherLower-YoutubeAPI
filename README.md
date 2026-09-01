# Higher or Lower · YouTube API

Un juego web inspirado en la dinámica de *Higher or Lower*: compara dos videos de YouTube y adivina si el segundo tiene más o menos visualizaciones que el primero.

La aplicación consulta datos reales mediante YouTube Data API v3, revela el resultado con una animación y conserva el mejor puntaje del jugador en su navegador.

**Demo:** [labs.paginee.com/higherLower](https://labs.paginee.com/higherLower/)

## Cómo jugar

1. Observa el número de visualizaciones del video de la izquierda.
2. Decide si el video de la derecha tiene más (`Higher`) o menos (`Lower`) visualizaciones.
3. Si aciertas, aumenta tu racha y aparece un nuevo video.
4. Si fallas, la partida termina y puedes comenzar de nuevo.

Las miniaturas también funcionan como reproductores de YouTube: puedes reproducir, pausar y reanudar los videos durante la partida.

## Características

- Datos reales de visualizaciones obtenidos desde YouTube.
- Selección aleatoria de videos sin repeticiones inmediatas.
- Caché durante la sesión para reducir llamadas a la API.
- Puntuación actual y récord guardado con `localStorage`.
- Reproductores integrados de YouTube.
- Animación de conteo al revelar las visualizaciones.
- Confeti al responder correctamente.
- Diseño oscuro inspirado en YouTube.
- Interfaz dividida al estilo *Higher or Lower*.
- Diseño adaptable para escritorio, laptop y dispositivos móviles.
- Manejo visible de errores de red o respuestas inválidas.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- PHP
- YouTube Data API v3
- YouTube Embed Player

No utiliza frameworks ni requiere un proceso de compilación.

## Estructura del proyecto

```text
higherLower/
├── api/
│   └── youtubeProxy.php
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── index.html
├── logo.jpg
└── pest.png
```

`youtubeProxy.php` actúa como intermediario entre el navegador y YouTube. De esta forma, la API key nunca se envía al cliente.

## Instalación local

### Requisitos

- PHP 8 o superior.
- Acceso HTTPS desde PHP.
- Una API key con acceso a YouTube Data API v3.

### 1. Clona el repositorio

```bash
git clone https://github.com/emma-za/higherLower-YoutubeAPI
cd higherLower
```

### 2. Configura la API key

Crea `api_keys.php` en la raíz del proyecto:

```php
<?php

$API_KEY = 'TU_API_KEY_DE_YOUTUBE';
```

El proxy local utiliza esta ruta:

```php
require_once dirname(__DIR__) . '/api_keys.php';
```

### 3. Inicia el servidor

```bash
php -S localhost:8000
```

Abre [http://localhost:8000](http://localhost:8000) en el navegador.

## Configuración en producción

En producción, guarda la API key fuera del directorio público. Una estructura posible es:

```text
/home/USUARIO/
├── secure/
│   └── api_key.php
└── public_html/
    └── higherLower/
        ├── api/
        │   └── youtubeProxy.php
        └── ...
```

Después, ajusta el `require_once` de `youtubeProxy.php` según la estructura real del servidor:

```php
require_once dirname(__DIR__, 3) . '/secure/api_key.php';
```

Si publicas el juego dentro de una subcarpeta, conserva la ruta relativa del proxy en JavaScript:

```javascript
const proxyUrl = new URL('api/youtubeProxy.php', document.baseURI);
```

## Seguridad

- Restringe la API key exclusivamente a **YouTube Data API v3** desde Google Cloud Console.
- Nunca guardes credenciales dentro de JavaScript o HTML.
- Mantén el archivo de configuración fuera del directorio público en producción.
- Si una clave se publica accidentalmente, revócala y genera una nueva.

## Autor

Creado por [@emm_zaid](https://x.com/emm_zaid).
