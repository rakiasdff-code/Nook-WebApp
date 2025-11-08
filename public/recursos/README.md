# Recursos necesarios para la página de autenticación

Por favor, coloca los siguientes archivos en esta carpeta (`/public/recursos/`):

## 1. Background de ilustración
- **Nombre del archivo:** `background-illustration-access.jpg` (o `.png`)
- **Descripción:** Imagen de fondo para la sección izquierda de las páginas de login y registro
- **Dimensiones recomendadas:** 960x1080px (la mitad de 1920x1080)
- **Notas:** Esta imagen aparecerá con una capa semi-transparente de color #EFEDEB al 50% de opacidad

## 2. Logo de Nook
- **Nombre del archivo:** `logo-nook.svg` (o `.png`)
- **Descripción:** Logo de la aplicación que aparece en la esquina superior izquierda
- **Dimensiones recomendadas:** Ancho de aproximadamente 200-300px
- **Formato:** Preferiblemente SVG para mejor calidad en cualquier resolución

## Archivos alternativos temporales

Si no tienes estos archivos listos, puedes usar imágenes placeholder temporales:
- Para el background, puedes usar cualquier imagen relacionada con libros o lectura
- Para el logo, puedes crear un simple archivo SVG con el texto "Nook"

## Configuración actual

El componente `AuthLayout.tsx` está configurado para usar estos archivos:
- `/recursos/background-illustration-access.jpg`
- `/recursos/logo-nook.svg`

Si necesitas usar nombres de archivo diferentes, actualiza las rutas en `/components/auth/AuthLayout.tsx`.

