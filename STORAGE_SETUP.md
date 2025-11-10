# 🗄️ Configuración de Firebase Storage

Esta guía te ayudará a configurar Firebase Storage para almacenar imágenes de perfil y banners.

---

## 📋 PASO 1: Habilitar Firebase Storage

### 1. Ve a Firebase Console

Abre: **https://console.firebase.google.com/**

### 2. Selecciona tu proyecto

Haz clic en: `nook-webapp`

### 3. Ve a Storage

En el menú lateral izquierdo, busca y haz clic en **"Storage"**

### 4. Inicia Storage

- Haz clic en el botón **"Get Started"** (Comenzar)
- Aparecerá un diálogo con las reglas de seguridad
- Haz clic en **"Next"** (Siguiente)

### 5. Selecciona la ubicación

- Elige una ubicación cercana a tus usuarios (por ejemplo: `us-central1` para Estados Unidos o `europe-west1` para Europa)
- Haz clic en **"Done"** (Listo)

⏱️ **Espera 1-2 minutos** mientras Firebase crea el bucket de Storage.

---

## 🔒 PASO 2: Configurar Reglas de Seguridad

### 1. Ve a la pestaña "Rules"

En Storage, haz clic en la pestaña **"Rules"** (en la parte superior)

### 2. Copia y pega las reglas de seguridad

Borra todo el contenido actual y copia esto:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the file
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Helper function to validate image file
    function isValidImage() {
      return request.resource.size < 5 * 1024 * 1024 // Max 5MB
             && request.resource.contentType.matches('image/.*');
    }
    
    // ========================================
    // USER PROFILE IMAGES
    // ========================================
    
    // Profile pictures: users/{userId}/profile.{ext}
    match /users/{userId}/profile.{ext} {
      // Allow read if authenticated
      allow read: if isAuthenticated();
      
      // Allow write only to owner and valid image
      allow write: if isOwner(userId) && isValidImage();
      
      // Allow delete only to owner
      allow delete: if isOwner(userId);
    }
    
    // Banner images: users/{userId}/banner.{ext}
    match /users/{userId}/banner.{ext} {
      // Allow read if authenticated
      allow read: if isAuthenticated();
      
      // Allow write only to owner and valid image
      allow write: if isOwner(userId) && isValidImage();
      
      // Allow delete only to owner
      allow delete: if isOwner(userId);
    }
    
    // ========================================
    // DEFAULT: Block everything else
    // ========================================
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### 3. Publica las reglas

Haz clic en el botón **"Publish"** (azul, arriba a la derecha)

⏱️ **Espera 30-60 segundos** para que las reglas se propaguen.

---

## 🔒 ¿Qué hacen estas reglas?

### Estructura de archivos

```
storage/
  └── users/
      └── {userId}/
          ├── profile.jpg    (foto de perfil)
          └── banner.png     (imagen de banner)
```

### Restricciones de seguridad

| Regla | Descripción |
|-------|-------------|
| **Autenticación** | Solo usuarios autenticados pueden leer/escribir |
| **Propiedad** | Solo el propietario puede subir/eliminar sus propias imágenes |
| **Tamaño máximo** | Las imágenes deben ser menores a 5MB |
| **Tipo de archivo** | Solo se permiten archivos de tipo `image/*` |

### Ejemplos de operaciones

✅ **Permitido:**
- Usuario con UID `abc123` sube imagen a `users/abc123/profile.jpg`
- Usuario con UID `abc123` lee su imagen de `users/abc123/banner.png`

❌ **Bloqueado:**
- Usuario intenta subir imagen de más de 5MB
- Usuario intenta subir un archivo PDF
- Usuario con UID `abc123` intenta leer/escribir en `users/xyz789/profile.jpg`

---

## ✅ PASO 3: Verificar la configuración

### 1. Verifica que el Storage Bucket esté correcto

Ve a tu archivo `.env.local` y verifica que tengas:

```bash
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
```

Si no lo tienes, añádelo. Puedes encontrar el valor en:
- Firebase Console → Project Settings → General
- Busca "Storage bucket"

### 2. Prueba subir una imagen

1. Ve a tu aplicación en desarrollo: `http://localhost:3000`
2. Inicia sesión
3. Ve al perfil
4. Haz clic en "Edit Profile"
5. Intenta cambiar la foto de perfil o el banner
6. Haz clic en "Save Changes"

### 3. Verifica en Firebase Console

1. Ve a Firebase Console → Storage
2. Deberías ver la carpeta `users/` con tu UID
3. Dentro debería estar tu imagen subida

---

## 📊 Cómo funciona

### 1. Vista previa local (antes de guardar)

Cuando seleccionas una imagen:
- Se convierte a base64 temporalmente
- Se muestra como vista previa
- **NO se sube todavía**

### 2. Subida a Storage (al hacer clic en Save)

Cuando haces clic en "Save Changes":
1. Las imágenes se suben a Firebase Storage
2. Firebase retorna una URL pública (con token de seguridad)
3. La URL se guarda en Firestore en el perfil del usuario
4. Las imágenes se muestran usando esa URL

### 3. Actualización en tiempo real

Gracias a `onSnapshot` en `AuthContext`:
- Los cambios se reflejan automáticamente en toda la app
- No necesitas refrescar la página

---

## 🎯 Límites y Cuotas

### Plan Spark (Gratuito)

| Recurso | Límite |
|---------|--------|
| **Almacenamiento** | 5 GB |
| **Descargas por día** | 1 GB/día |
| **Subidas por día** | 20,000 archivos/día |

### Plan Blaze (Pago por uso)

- **Almacenamiento**: $0.026 por GB/mes
- **Descargas**: $0.12 por GB
- **Operaciones**: $0.05 por 10,000 operaciones

Para la mayoría de apps pequeñas, el plan gratuito es suficiente.

---

## 🐛 Problemas comunes

### Error: "Firebase Storage: User does not have permission"

**Causa**: Las reglas de Storage no están configuradas correctamente

**Solución**:
1. Ve a Firebase Console → Storage → Rules
2. Verifica que las reglas estén publicadas
3. Espera 60 segundos y vuelve a intentar

### Error: "The operation was cancelled"

**Causa**: El archivo es muy grande o la conexión se interrumpió

**Solución**:
- Reduce el tamaño de la imagen (usa herramientas como TinyPNG)
- Asegúrate de tener buena conexión a internet

### Error: "Firebase Storage: Object not found"

**Causa**: Intentando acceder a una imagen que no existe

**Solución**:
- Esto es normal si el usuario aún no ha subido imagen
- El código maneja esto automáticamente mostrando las iniciales

### Las imágenes no se cargan

**Causa**: URLs incorrectas o reglas de Storage muy restrictivas

**Solución**:
1. Verifica las reglas de Storage (deben permitir lectura a usuarios autenticados)
2. Revisa la consola del navegador para ver el error específico
3. Verifica que la URL de la imagen comience con `https://firebasestorage.googleapis.com`

---

## 🔐 Seguridad

### Buenas prácticas

✅ **Hacer:**
- Validar tamaño de imagen en el cliente (5MB máximo)
- Validar tipo de archivo (solo imágenes)
- Usar nombres de archivo consistentes (`profile.jpg`, `banner.png`)
- Permitir solo lectura/escritura al propietario

❌ **No hacer:**
- Permitir archivos de más de 5MB
- Permitir archivos que no sean imágenes
- Dar acceso de escritura a todos los usuarios
- Guardar imágenes en base64 en Firestore (usa Storage)

---

## 📈 Monitoreo

### Ver el uso de Storage

1. Ve a Firebase Console → Storage → Usage
2. Revisa:
   - Total de archivos
   - Espacio usado
   - Descargas del día

### Ver operaciones

1. Ve a Firebase Console → Storage → Files
2. Explora la carpeta `users/`
3. Haz clic en cualquier archivo para ver:
   - Tamaño
   - Tipo
   - URL pública
   - Fecha de creación

---

## 🚀 Optimizaciones futuras

### Compresión de imágenes

Considera agregar compresión automática:

```typescript
import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true
};

const compressedFile = await imageCompression(file, options);
```

### Cloud Functions para redimensionar

Crea una Cloud Function que automáticamente:
- Redimensione imágenes de perfil a 200x200px
- Redimensione banners a 1200x400px
- Genere miniaturas

---

**¿Tienes dudas?** Revisa la documentación oficial:
https://firebase.google.com/docs/storage/web/start

