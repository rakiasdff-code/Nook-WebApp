# 🚀 Configuración Rápida de Firebase Storage

## Pasos para configurar Storage (5 minutos)

### 1️⃣ Habilitar Storage en Firebase Console

```
1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: nook-webapp
3. Click en "Storage" en el menú lateral
4. Click en "Get Started"
5. Click en "Next" → Selecciona ubicación → "Done"
```

### 2️⃣ Configurar Reglas de Seguridad

```
1. En Storage, click en la pestaña "Rules"
2. Copia el contenido del archivo: storage.rules
3. Pega en el editor de Firebase Console
4. Click en "Publish"
```

**O copia directamente estas reglas:**

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isValidImage() {
      return request.resource.size < 5 * 1024 * 1024
             && request.resource.contentType.matches('image/.*');
    }
    
    match /users/{userId}/profile.{ext} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) && isValidImage();
      allow delete: if isOwner(userId);
    }
    
    match /users/{userId}/banner.{ext} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) && isValidImage();
      allow delete: if isOwner(userId);
    }
    
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### 3️⃣ Verificar variables de entorno

Asegúrate de tener en tu `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
```

Si no la tienes:
1. Ve a Firebase Console → Project Settings → General
2. Copia el valor de "Storage bucket"
3. Añádelo a tu `.env.local`
4. Reinicia el servidor de desarrollo

### 4️⃣ Probar la configuración

```
1. npm run dev
2. Inicia sesión en la app
3. Ve al perfil → Edit Profile
4. Sube una imagen de perfil
5. Click en "Save Changes"
6. Verifica en Firebase Console → Storage que se haya subido
```

---

## ✅ ¿Qué se ha implementado?

### Archivos creados/modificados:

- ✅ `storage.rules` - Reglas de seguridad de Storage
- ✅ `lib/storage.ts` - Funciones helper para subir/eliminar imágenes
- ✅ `app/(main)/profile/page.tsx` - Actualizado para usar Storage
- ✅ `lib/AuthContext.tsx` - Actualizado con suscripción en tiempo real
- ✅ `types/index.ts` - Tipos actualizados con campos de imagen

### Características:

- ✅ Subida de imágenes de perfil (máx 5MB)
- ✅ Subida de imágenes de banner (máx 5MB)
- ✅ Vista previa antes de guardar
- ✅ Validación de tamaño y tipo de archivo
- ✅ URLs seguras de Firebase Storage
- ✅ Actualización en tiempo real en toda la app
- ✅ Spinner de carga durante la subida

---

## 📝 Notas importantes

1. **Las imágenes ya NO se guardan en base64** ✅
   - Antes: base64 en Firestore (límite de 1MB)
   - Ahora: URLs de Storage (sin límite práctico)

2. **Las reglas de Storage son restrictivas**:
   - Solo el propietario puede subir/eliminar sus imágenes
   - Máximo 5MB por imagen
   - Solo archivos de tipo imagen

3. **Actualización automática**:
   - Gracias a `onSnapshot`, los cambios se reflejan instantáneamente
   - El nombre y las imágenes se actualizan en Header, Home y Perfil

---

## 🐛 Si algo no funciona

1. **Verifica la consola del navegador** (F12)
2. **Verifica que las reglas de Storage estén publicadas**
3. **Espera 60 segundos después de publicar las reglas**
4. **Reinicia el servidor de desarrollo**

---

**Documentación completa**: Ver `STORAGE_SETUP.md`

