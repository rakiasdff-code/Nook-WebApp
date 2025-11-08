# 🔥 Configuración de Firebase - Reglas de Seguridad

Este documento explica cómo configurar las reglas de seguridad de Firestore para tu aplicación Nook.

## 📋 Pasos para configurar las reglas

### 1. Ve a Firebase Console

Abre: **https://console.firebase.google.com/**

### 2. Selecciona tu proyecto

Haz click en: `nook-webapp`

### 3. Ve a Firestore Database

En el menú lateral izquierdo, busca y haz click en **"Firestore Database"**

### 4. Abre la pestaña "Rules"

En la parte superior, haz click en la pestaña **"Rules"**

### 5. Copia y pega las reglas

Borra todo el contenido actual y pega esto:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is the owner
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Check if email is verified
    function isEmailVerified() {
      return isAuthenticated() && request.auth.token.email_verified == true;
    }
    
    // ========================================
    // COLLECTION: users
    // ========================================
    match /users/{userId} {
      
      // RULE 1: Read - Users can only read their own profile
      allow read: if isOwner(userId);
      
      // RULE 2: Create - Only during registration with verified email
      allow create: if isOwner(userId)
                    && isEmailVerified()
                    && request.resource.data.uid == userId
                    && request.resource.data.email == request.auth.token.email
                    && request.resource.data.subscription == "free"
                    && request.resource.data.keys().hasAll(['uid', 'email', 'displayName', 'createdAt', 'subscription']);
      
      // RULE 3: Update - Can update own profile but with restrictions
      allow update: if isOwner(userId)
                    && request.resource.data.uid == resource.data.uid
                    && request.resource.data.email == resource.data.email
                    && request.resource.data.subscription == resource.data.subscription
                    && request.resource.data.createdAt == resource.data.createdAt;
      
      // RULE 4: Delete - Not allowed from client
      allow delete: if false;
    }
    
    // ========================================
    // COLLECTION: books (for future)
    // ========================================
    match /books/{bookId} {
      // Read: Authenticated users can read any book
      allow read: if isAuthenticated();
      
      // Create: Only if user owns the book
      allow create: if isAuthenticated() 
                    && request.resource.data.userId == request.auth.uid;
      
      // Update/Delete: Only owner can modify
      allow update, delete: if isAuthenticated() 
                            && resource.data.userId == request.auth.uid;
    }
    
    // ========================================
    // DEFAULT: Block everything else
    // ========================================
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 6. Publica las reglas

Haz click en el botón **"Publish"** (azul, arriba a la derecha)

---

## 🔒 ¿Qué hacen estas reglas?

### Colección `users`

| Operación | Permiso | Explicación |
|-----------|---------|-------------|
| **Read** | Solo el propietario | Un usuario solo puede leer su propio perfil |
| **Create** | Solo con email verificado | Solo puede crear su perfil si su email está verificado y los datos son válidos |
| **Update** | Solo el propietario con restricciones | Puede actualizar su perfil PERO no puede cambiar email, UID ni suscripción |
| **Delete** | Bloqueado | Nadie puede borrar perfiles desde el cliente |

### Restricciones de seguridad

- ✅ Email debe estar verificado para crear perfil
- ✅ No se puede crear con plan "premium" (solo "free")
- ✅ No se puede modificar la suscripción desde el cliente
- ✅ No se puede cambiar el email desde el cliente
- ✅ No se puede leer información de otros usuarios

---

## 🧪 Verificar que funciona

Después de publicar las reglas:

1. **Borra todos los usuarios de prueba anteriores**:
   - Ve a Firebase Console → Authentication
   - Elimina todos los usuarios de prueba

2. **Limpia Firestore**:
   - Ve a Firestore Database → Data
   - Elimina todos los documentos de la colección `users`

3. **Prueba el flujo completo**:
   - Registra un nuevo usuario
   - Verifica el email
   - Haz login
   - Verifica que se cree el perfil y llegues a home

---

## ⚠️ Problemas comunes

### Error: "Missing or insufficient permissions"

**Causa**: Las reglas están bloqueando la operación

**Solución**:
- Verifica que el email esté verificado
- Asegúrate de que el usuario esté autenticado
- Revisa la consola del navegador para ver el error específico

### Error: "Document already exists"

**Causa**: Intentando crear un perfil que ya existe

**Solución**:
- Elimina el documento en Firestore Database
- O usa `update` en lugar de `create`

---

## 📊 Monitorear el uso

Para ver las operaciones que se están ejecutando:

1. Ve a Firestore Database → **Usage**
2. Revisa las métricas de lectura/escritura
3. Si ves operaciones sospechosas, revisa las reglas

---

## 🔄 Siguiente paso: Reglas en producción

Cuando estés listo para producción, considera:

1. **Agregar rate limiting** con Firebase App Check
2. **Validación de datos** más estricta
3. **Logs de auditoría** con Cloud Functions
4. **Backup automático** de Firestore

---

**¿Tienes dudas?** Revisa la documentación oficial:
https://firebase.google.com/docs/firestore/security/get-started

