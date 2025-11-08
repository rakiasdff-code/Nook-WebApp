# Convención de Commits

Este proyecto sigue la especificación [Conventional Commits](https://www.conventionalcommits.org/es/).

## Formato

```
<tipo>[alcance opcional]: <descripción>

[cuerpo opcional]

[nota de pie opcional]
```

## Tipos

### Principales
- **feat**: Nueva funcionalidad para el usuario
- **fix**: Corrección de bug
- **docs**: Cambios solo en documentación
- **style**: Cambios de formato (espacios, comas, etc.) sin afectar el código
- **refactor**: Refactorización de código sin cambiar funcionalidad
- **perf**: Mejoras de rendimiento
- **test**: Añadir o corregir tests
- **chore**: Cambios en el proceso de build o herramientas auxiliares

### Especiales
- **BREAKING CHANGE**: Cambio que rompe compatibilidad (va en el pie del commit)

## Ejemplos

### ✅ Buenos commits

```bash
feat(auth): agregar autenticación con Google
fix(bookshelf): corregir error al cargar libros
docs(readme): actualizar instrucciones de instalación
style(home): ajustar espaciado en hero section
refactor(api): simplificar lógica de búsqueda de libros
perf(images): optimizar carga de portadas de libros
test(auth): añadir tests para login
chore(deps): actualizar dependencias de Next.js
```

### ❌ Malos commits

```bash
cambios varios
fix bug
update
wip
asdfasdf
cambios de hoy
```

## Alcance (opcional)

El alcance especifica qué parte del código afecta el commit:

- `auth` - Sistema de autenticación
- `bookshelf` - Biblioteca de libros
- `nook` - Ambientes/atmospheres
- `ui` - Componentes de interfaz
- `api` - Endpoints o llamadas API
- `db` - Base de datos/Firestore
- `config` - Configuración

## Descripción

- Usar el imperativo: "agregar" no "agregado" ni "agrega"
- No capitalizar la primera letra
- No poner punto final
- Máximo 50 caracteres

## Cuerpo (opcional)

- Explicar **qué** y **por qué**, no el **cómo**
- Separar del título con una línea en blanco
- Usar viñetas si es necesario

## Ejemplos completos

### Ejemplo simple
```bash
git commit -m "feat(bookshelf): agregar filtro por género"
```

### Ejemplo con cuerpo
```bash
git commit -m "feat(auth): implementar recuperación de contraseña

- Agregar formulario de recuperación
- Enviar email con link de reset
- Integrar con Firebase Auth"
```

### Ejemplo con BREAKING CHANGE
```bash
git commit -m "feat(api)!: cambiar estructura de respuesta de libros

BREAKING CHANGE: La API ahora devuelve 'bookData' en lugar de 'data'"
```

## Workflow recomendado

```bash
# 1. Hacer cambios en el código
# 2. Ver qué cambió
git status
git diff

# 3. Agregar archivos específicos (mejor que git add .)
git add app/bookshelf/page.tsx
git add components/BookCard.tsx

# 4. Commit con mensaje descriptivo
git commit -m "feat(bookshelf): agregar tarjetas de libros con portada"

# 5. Push
git push
```

## Tips

### ✅ DO (Hacer)
- Un commit por funcionalidad/fix
- Commits pequeños y frecuentes
- Mensajes descriptivos y claros
- Revisar los cambios antes de commitear

### ❌ DON'T (No hacer)
- Commits gigantes con muchos cambios
- Mensajes vagos ("fix", "update", "cambios")
- Commitear código que no compila
- Commitear archivos de configuración local (.env.local)

## Referencias

- [Conventional Commits](https://www.conventionalcommits.org/es/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [Semantic Versioning](https://semver.org/lang/es/)

