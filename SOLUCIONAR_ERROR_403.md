# 🚨 Solución Error 403 en Firebase Storage

## ¿Por qué aparece el error 403?

El error 403 significa "Forbidden" (Prohibido). Esto ocurre cuando:
- ❌ Las reglas de Storage están bloqueando las operaciones
- ❌ Storage no está completamente inicializado
- ❌ Hay un problema con las variables de entorno
- ❌ El usuario no está autenticado correctamente

---

## ✅ SOLUCIÓN PASO A PASO

### 1️⃣ Verifica que Storage esté habilitado

1. Ve a: **https://console.firebase.google.com/**
2. Selecciona tu proyecto: **nook-webapp**
3. Click en **"Storage"** en el menú lateral izquierdo
4. Si ves un botón **"Get Started"**, significa que NO está habilitado aún:
   - Click en "Get Started"
   - Selecciona modo: **"Start in test mode"** (IMPORTANTE: selecciona test mode)
   - Click en "Next"
   - Selecciona ubicación (ej: us-central1)
   - Click en "Done"
   - ⏱️ Espera 1-2 minutos

### 2️⃣ Configura las reglas en MODO TEST (temporalmente)

Primero vamos a usar reglas permisivas para probar que funciona:

1. Ve a Storage → Pestaña **"Rules"**
2. **Borra todo** el contenido actual
3. Copia y pega estas reglas TEMPORALES:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // TEMPORAL: Permite todo durante 7 días
      allow read, write: if request.time < timestamp.date(2025, 1, 1);
    }
  }
}
```

4. Click en **"Publish"**
5. ⏱️ **Espera 60 segundos**

### 3️⃣ Verifica las variables de entorno

Abre tu archivo `.env.local` y verifica que tengas TODAS estas variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com  # ← IMPORTANTE
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

**Para obtener STORAGE_BUCKET:**
1. Ve a Firebase Console → Project Settings (⚙️ arriba a la izquierda)
2. Click en la pestaña **"General"**
3. Busca el campo **"Storage bucket"**
4. Copia el valor (ejemplo: `nook-webapp.appspot.com`)
5. Añádelo a tu `.env.local`

### 4️⃣ Reinicia el servidor de desarrollo

```bash
# Detén el servidor (Ctrl + C)
# Luego reinicia:
npm run dev
```

### 5️⃣ Limpia la caché del navegador

1. Abre DevTools (F12)
2. Click derecho en el botón de refrescar
3. Selecciona **"Empty Cache and Hard Reload"** (Vaciar caché y recargar)

### 6️⃣ Verifica que el usuario esté autenticado

El error 403 también puede ocurrir si el usuario no está autenticado. Verifica:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña **"Application"** → **"Local Storage"**
3. Busca entradas de Firebase (firebase:authUser...)
4. Si no hay nada, cierra sesión y vuelve a iniciar sesión

---

## 🧪 Prueba que funciona

Después de hacer los pasos anteriores:

1. Ve a tu app: `http://localhost:3000`
2. Inicia sesión
3. Ve al perfil
4. Click en "Edit Profile"
5. Intenta subir una imagen de perfil
6. Abre la consola del navegador (F12) para ver si hay errores

### Si aún hay error 403:

En la consola del navegador deberías ver algo como:

```
FirebaseError: Firebase Storage: User does not have permission to access 'users/abc123/profile.jpg'
```

Si ves este error, copia el mensaje completo y pégalo aquí.

---

## 🔒 Después de que funcione: Reglas de Seguridad

Una vez que confirmes que todo funciona con las reglas temporales, cámbiala a las reglas seguras:

1. Ve a Storage → Rules
2. Reemplaza con estas reglas seguras:

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
    
    // Profile pictures: users/{userId}/profile.{ext}
    match /users/{userId}/profile.{ext} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) && isValidImage();
      allow delete: if isOwner(userId);
    }
    
    // Banner images: users/{userId}/banner.{ext}
    match /users/{userId}/banner.{ext} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) && isValidImage();
      allow delete: if isOwner(userId);
    }
    
    // Block everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click en "Publish"
4. Vuelve a probar subir una imagen

---

## 🐛 Otros problemas comunes

### Error: "No default bucket found"

**Solución:**
```javascript
// En lib/firebase.ts, cambia:
export const storage = getStorage(app);

// Por esto (especifica el bucket):
export const storage = getStorage(app, "gs://tu-proyecto.appspot.com");
```

### Error: "CORS policy"

**Solución:**
1. Ve a Google Cloud Console: https://console.cloud.google.com/
2. Selecciona tu proyecto
3. Ve a Cloud Storage
4. Click en los 3 puntos del bucket → "Edit bucket permissions"
5. Añade CORS (esto es avanzado, pregúntame si lo necesitas)

### Error: "quota exceeded"

**Solución:**
- Verifica que no estés en el límite del plan gratuito
- Ve a Firebase Console → Usage & Billing

---

## 📞 ¿Sigues con problemas?

Si después de seguir todos los pasos aún tienes el error 403:

1. **Copia el mensaje de error completo** de la consola del navegador
2. **Haz una captura** de las reglas de Storage que tienes configuradas
3. **Verifica** que el `.env.local` tenga el STORAGE_BUCKET correcto

---

## ✅ Checklist

Marca lo que ya has hecho:

- [ ] Storage está habilitado en Firebase Console
- [ ] Reglas temporales están publicadas
- [ ] Variable NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET está en .env.local
- [ ] Servidor de desarrollo reiniciado
- [ ] Caché del navegador limpiada
- [ ] Usuario autenticado en la app
- [ ] Probado subir una imagen

Si todos están marcados y aún hay error, el problema es más específico. Comparte el error exacto de la consola.

