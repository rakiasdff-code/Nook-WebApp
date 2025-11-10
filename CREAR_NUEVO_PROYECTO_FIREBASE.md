# 🔄 Crear Nuevo Proyecto Firebase (Región Gratuita)

## Por qué necesitas esto

Tu proyecto actual está en una región que **NO soporta Storage gratuito**. 

La solución más simple es crear un nuevo proyecto en una región que SÍ lo soporte.

---

## ✅ PASO 1: Crear nuevo proyecto

1. Ve a: **https://console.firebase.google.com/**

2. Click en **"Add project"** (Agregar proyecto)

3. **Nombre del proyecto**:
   ```
   nook-webapp
   ```
   (Si ese nombre ya está tomado, usa: `nook-webapp-production` o similar)

4. **Paso 2: Google Analytics** → Puedes deshabilitarlo o dejarlo

5. **IMPORTANTE - Paso 3: Ubicación del proyecto**:
   - Selecciona: **`nam5 (United States)`** o **`us-central1`**
   - ✅ Estas regiones SÍ tienen Storage gratuito

6. Click en **"Create project"**

7. ⏱️ Espera 1-2 minutos

---

## ✅ PASO 2: Habilitar Authentication

1. En el nuevo proyecto, click en **"Authentication"** (menú lateral)

2. Click en **"Get started"**

3. Click en **"Email/Password"**

4. Habilita ambas opciones:
   - ✅ Email/Password
   - ✅ Email link (passwordless sign-in)

5. Click en **"Save"**

---

## ✅ PASO 3: Habilitar Firestore

1. Click en **"Firestore Database"** (menú lateral)

2. Click en **"Create database"**

3. Selecciona: **"Start in production mode"**

4. Ubicación: Debería ser automáticamente la que elegiste (`us-central1`)

5. Click en **"Enable"**

6. Ve a la pestaña **"Rules"** y pega las reglas:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isEmailVerified() {
      return isAuthenticated() && request.auth.token.email_verified == true;
    }
    
    match /users/{userId} {
      allow read: if isOwner(userId);
      
      allow create: if isOwner(userId)
                    && request.resource.data.uid == userId
                    && request.resource.data.email == request.auth.token.email;
      
      allow update: if isOwner(userId)
                    && request.resource.data.uid == resource.data.uid
                    && request.resource.data.email == resource.data.email;
      
      allow delete: if false;
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

7. Click en **"Publish"**

---

## ✅ PASO 4: Habilitar Storage

1. Click en **"Storage"** (menú lateral)

2. Click en **"Get started"**

3. Selecciona: **"Start in test mode"** (para desarrollo)

4. Ubicación: Debería ser automáticamente `us-central1`

5. Click en **"Done"**

6. ✅ **Ahora SÍ deberías ver el Storage sin el aviso de región**

7. Ve a la pestaña **"Rules"** y pega:

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

8. Click en **"Publish"**

---

## ✅ PASO 5: Obtener credenciales

1. Click en el ícono de ⚙️ (arriba izquierda) → **"Project settings"**

2. Scroll down hasta **"Your apps"**

3. Click en el ícono **`</>`** (Web)

4. Nickname: `nook-web-app`

5. **NO marques** "Also set up Firebase Hosting"

6. Click en **"Register app"**

7. Copia las credenciales que aparecen

---

## ✅ PASO 6: Actualizar .env.local

Abre tu archivo `.env.local` y reemplaza TODAS las variables con las nuevas:

```bash
# Firebase Configuration - NUEVO PROYECTO
NEXT_PUBLIC_FIREBASE_API_KEY=nueva_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nuevo-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nuevo-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nuevo-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=nuevo_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=nuevo_app_id
```

---

## ✅ PASO 7: Reiniciar servidor

```bash
# Detén el servidor (Ctrl + C)
# Elimina caché (opcional pero recomendado)
rm -rf .next

# Reinicia
npm run dev
```

---

## ✅ PASO 8: Probar

1. Ve a: `http://localhost:3000`

2. **Registra un nuevo usuario** (el anterior era del proyecto viejo)

3. Verifica email

4. Inicia sesión

5. Ve al perfil → Edit Profile → Sube una imagen

6. ✅ **Debería funcionar sin errores 403**

---

## 🗑️ PASO 9: (Opcional) Eliminar proyecto viejo

Si todo funciona bien:

1. Ve a Firebase Console

2. Selecciona el proyecto **VIEJO**

3. Project Settings (⚙️) → General

4. Scroll down → **"Delete project"**

5. Confirma

---

## ✅ Verificación Final

Después de todo esto, verifica:

- [ ] Storage aparece en Firebase Console sin el aviso de región
- [ ] Puedes subir imágenes desde tu app
- [ ] Las imágenes se guardan en Storage
- [ ] Las URLs de las imágenes funcionan
- [ ] No hay errores 403

---

## 📊 Plan Gratuito en la Nueva Región

Con `us-central1` tienes GRATIS:

| Servicio | Límite Gratuito |
|----------|-----------------|
| **Storage** | 5 GB |
| **Descargas** | 1 GB/día |
| **Firestore Lecturas** | 50,000/día |
| **Firestore Escrituras** | 20,000/día |
| **Authentication** | Ilimitado |

Suficiente para miles de usuarios.

---

## 🎯 Resumen

1. ✅ Nuevo proyecto en región `us-central1`
2. ✅ Authentication habilitado
3. ✅ Firestore con reglas
4. ✅ Storage con reglas
5. ✅ Credenciales en `.env.local`
6. ✅ Servidor reiniciado
7. ✅ Todo funciona sin error 403

**¡Listo para producción!** 🚀

