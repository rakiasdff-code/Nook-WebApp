# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [No publicado] - En desarrollo

### Próximas funcionalidades
- Sistema de atmospheres con video y audio
- Integración completa con Google Books API
- Sistema de suscripciones con Stripe
- Importación de datos desde Goodreads

---

## [0.1.0] - 2025-11-08

### ✨ Añadido
- **Estructura inicial del proyecto** con Next.js 14 y App Router
- **Sistema de autenticación** con Firebase (email/password)
- **Diseño UI** completo con:
  - Tailwind CSS 3 para estilos
  - Componentes Radix UI (botones, cards, forms, etc.)
  - Paleta de colores personalizada (Brand Forest, Nook Green)
  - Tipografías: Vollkorn (serif) e Inter (sans-serif)
  
- **Páginas implementadas**:
  - `/` - Página de inicio con redirect a /home
  - `/home` - Dashboard principal del usuario
  - `/login` - Página de inicio de sesión
  - `/register` - Página de registro

- **Componentes**:
  - Header con navegación
  - Logo de Nook
  - Layouts para auth y main app
  - Biblioteca completa de componentes UI (Radix)

- **Configuración**:
  - Firebase configurado (Auth, Firestore, Storage)
  - Variables de entorno para Firebase y Stripe
  - TypeScript con configuración estricta
  - ESLint y Prettier

### 🏗️ Infraestructura
- Configuración de Git con SSH
- Repositorio conectado a GitHub
- Estructura de carpetas organizada:
  - `/app` - Páginas y layouts de Next.js
  - `/components` - Componentes reutilizables
  - `/lib` - Utilidades y configuraciones
  - `/types` - Definiciones TypeScript
  - `/public` - Recursos estáticos

### 📝 Documentación
- README.md completo con:
  - Descripción del proyecto
  - Tech stack
  - Instrucciones de instalación
  - Estructura del proyecto
  - Guía de configuración de Firebase y Stripe

---

## Tipos de cambios

- **✨ Añadido** - Para funcionalidades nuevas
- **🔄 Cambiado** - Para cambios en funcionalidades existentes
- **⚠️ Deprecado** - Para funcionalidades que se eliminarán pronto
- **🗑️ Eliminado** - Para funcionalidades eliminadas
- **🐛 Arreglado** - Para corrección de bugs
- **🔒 Seguridad** - Para vulnerabilidades de seguridad

---

## Roadmap

### v0.2.0 - Gestión de Biblioteca (Próxima versión)
- [ ] Búsqueda de libros con Google Books API
- [ ] Añadir libros a la biblioteca personal
- [ ] Estados de lectura (Leyendo, Leído, Quiero leer, Abandonado)
- [ ] Sistema de progreso de lectura
- [ ] Notas y valoraciones de libros

### v0.3.0 - Atmospheres (Ambientes inmersivos)
- [ ] Galería de atmospheres predefinidas
- [ ] Reproductor de video de fondo
- [ ] Reproductor de audio ambiental
- [ ] Atmospheres premium

### v0.4.0 - Sistema de Suscripciones
- [ ] Integración completa con Stripe
- [ ] Planes Free y Premium
- [ ] Gestión de suscripciones
- [ ] Webhooks de Stripe

### v0.5.0 - Funciones Sociales
- [ ] Listas personalizadas de libros
- [ ] Compartir nooks y bibliotecas
- [ ] Hilos de discusión
- [ ] Sistema de recomendaciones

---

**Última actualización**: 8 de noviembre de 2025

