# 🔧 Troubleshooting - Nook WebApp

Esta guía te ayudará a resolver los problemas más comunes.

---

## 📧 Problema: No se envía el email de verificación

### ✅ PASO 1: Verifica la consola del navegador

Abre la consola del navegador (`Cmd + Option + J` en Mac, `F12` en Windows) y busca estos mensajes:

#### **Si ves esto** → ✅ El email se envió correctamente:
```
[Auth] Enviando email de verificación...
[Auth] ✅ Email de verificación enviado exitosamente a: tu@email.com
[Auth] ℹ️ El usuario debe revisar su bandeja de entrada
```

**Acción**: Revisa tu bandeja de entrada y **carpeta de spam**.

---

#### **Si ves esto** → ❌ Hay un error:
```
[Auth] ❌ ERROR al enviar email: ...
[Auth] Error code: auth/...
[Auth] Error message: ...
```

**Acción**: Copia el error completo y sigue los pasos según el código de error:

---

### 🔍 Códigos de error comunes:

#### **Error: `auth/invalid-api-key`**
**Causa**: Las credenciales de Firebase en `.env.local` son incorrectas.

**Solución**:
1. Ve a Firebase Console → Project Settings → General
2. Copia las credenciales correctas
3. Actualiza `.env.local`
4. Reinicia el servidor (`pnpm dev`)

---

#### **Error: `auth/network-request-failed`**
**Causa**: No hay conexión a internet o Firebase está bloqueado.

**Solución**:
1. Verifica tu conexión a internet
2. Si usas VPN, desconéctala temporalmente
3. Verifica que Firebase no esté bloqueado por firewall

---

#### **Error: `auth/too-many-requests`**
**Causa**: Demasiados intentos de enviar emails.

**Solución**:
1. Espera 15-30 minutos
2. Intenta de nuevo
3. En Firebase Console → Authentication → Settings → Enable Email enumeration protection

---

### ✅ PASO 2: Verifica configuración de Firebase

#### A. Ve a Firebase Console:
https://console.firebase.google.com/

#### B. Selecciona tu proyecto:
`nook-webapp`

#### C. Ve a Authentication → Templates:

1. **Email address verification** debe estar habilitado
2. Debe tener configurado:
   - **From name**: Nook (o el nombre que quieras)
   - **From email**: `noreply@nook-webapp.firebaseapp.com` (por defecto)
   - **Reply to**: Tu email de soporte

#### D. Verifica que el template tenga contenido:

Debe verse algo así:
```
Subject: Verify your email for %APP_NAME%
Body: Hello %DISPLAY_NAME%, Follow this link to verify...
```

Si está vacío o deshabilitado, actívalo.

---

### ✅ PASO 3: Verifica límites de Firebase

Firebase tiene límites en el plan gratuito:

1. Ve a Firebase Console → Usage
2. Verifica:
   - **Authentication**: Límite de 100 emails/día en plan gratuito
   - Si alcanzaste el límite, espera hasta el día siguiente

---

### ✅ PASO 4: Prueba manual desde Firebase Console

1. Ve a Firebase Console → Authentication → Users
2. Selecciona un usuario
3. Click en los 3 puntos → "Send verification email"
4. Si aparece un error aquí, es un problema de configuración de Firebase

---

### ✅ PASO 5: Revisa tu bandeja de entrada

#### A. Busca en spam:
- Gmail: Ve a "Spam" o "Promociones"
- Outlook: Ve a "Correo no deseado"

#### B. Busca por remitente:
- `noreply@nook-webapp.firebaseapp.com`
- Asunto: "Verify your email"

#### C. Whitelist el dominio:
Agrega `@nook-webapp.firebaseapp.com` a tus contactos

---

## 🏠 Problema: Home no muestra textos personalizados

### ✅ Diagnóstico:

Abre la consola del navegador en la página de home y verifica:

#### **Si ves**:
```javascript
user: { uid: "...", email: "...", emailVerified: true }
userProfile: { displayName: "...", email: "...", ... }
```

**Acción**: Los datos están cargando correctamente. El problema está en el componente.

---

#### **Si ves**:
```javascript
user: null
userProfile: null
loading: true  // Se queda en true
```

**Causa**: AuthContext no está cargando correctamente.

**Solución**:
1. Verifica que `<Providers>` esté envolviendo todo en `app/layout.tsx`
2. Reinicia el servidor
3. Borra cookies y recarga la página

---

#### **Si ves**:
```javascript
user: { ... }
userProfile: null
```

**Causa**: El perfil no se creó en Firestore.

**Solución**:
1. Ve a Firebase Console → Firestore Database → Data
2. Verifica que exista la colección `users` con tu UID
3. Si no existe, ve a `/loading-register` para crearlo
4. O elimina el usuario de Authentication y regístrate de nuevo

---

## 🔒 Problema: Puedo acceder a /home sin login

### ✅ Diagnóstico:

1. **Cierra todas las pestañas** de localhost
2. **Borra cookies**:
   - Chrome: `Cmd + Shift + Delete` → Cookies
   - Firefox: `Cmd + Shift + Delete` → Cookies
3. **Abre** `http://localhost:3000/home`

**Resultado esperado**: Deberías ver un loading y luego redirigir a `/login`

---

### Si sigues accediendo sin login:

**Causa**: El usuario está guardado en el estado local.

**Solución**:
1. Abre la consola del navegador
2. Ejecuta:
   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   ```
3. Recarga la página

---

## 🔄 Problema: Polling no detecta verificación de email

### ✅ Verifica que el polling esté activo:

En la consola del navegador, después de registrarte, deberías ver:

```
🔄 Iniciando polling para verificar email...
🔍 Verificando si el email fue verificado...  (cada 3 segundos)
```

---

### Si NO ves estos mensajes:

**Causa**: El componente `EmailVerification` no se está mostrando.

**Solución**:
1. Verifica en la consola que veas:
   ```
   Usuario registrado exitosamente
   ⚠️ Mantener sesión activa para polling automático
   ```
2. Si no lo ves, hay un error en el registro

---

### Si ves los mensajes PERO no redirige:

**Causa**: El email no se ha verificado realmente o hay un problema con `checkEmailVerified()`.

**Solución**:
1. Verifica que **HICISTE CLICK** en el link del email
2. El link debe llevarte a una página de Firebase que diga "Your email has been verified"
3. **Vuelve** a la pestaña donde tienes "Check your inbox"
4. En máximo 3 segundos debería redirigir

---

## 🎨 Problema: No se ven los iconos/imágenes

### ✅ Solución:

1. Verifica que las imágenes existan en `public/recursos/`
2. Reinicia el servidor Next.js
3. Borra la caché: `rm -rf .next` y `pnpm dev`

---

## 🐛 Otros problemas comunes

### Error: "Module not found"
**Solución**:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

### Error: "Port 3000 already in use"
**Solución**:
```bash
lsof -ti:3000 | xargs kill -9
pnpm dev
```

---

### Error: Firestore "Missing or insufficient permissions"
**Solución**:
1. Ve a `FIREBASE_SETUP.md`
2. Sigue los pasos para configurar las reglas de desarrollo
3. Asegúrate de usar `firestore-dev.rules`

---

## 📞 ¿Necesitas más ayuda?

Si ninguna de estas soluciones funciona:

1. **Copia** TODOS los mensajes de la consola del navegador
2. **Copia** el error completo (incluyendo stack trace)
3. **Describe** exactamente qué pasos seguiste
4. **Incluye** capturas de pantalla si es posible

---

## ✅ Checklist antes de reportar un bug:

- [ ] Reinicié el servidor (`pnpm dev`)
- [ ] Borré la caché (`.next`, cookies, localStorage)
- [ ] Verifiqué la consola del navegador
- [ ] Verifiqué que `.env.local` esté configurado correctamente
- [ ] Verifiqué las reglas de Firestore
- [ ] Probé con un email diferente
- [ ] Revisé spam y bandeja de entrada
- [ ] Esperé al menos 1 minuto para que las reglas de Firebase se propaguen

---

**Última actualización**: 8 de noviembre de 2025

