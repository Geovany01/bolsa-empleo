# 📋 PASO 1: Habilitar Google+ API en Google Cloud Console

## Opción A: Crear Nuevo Proyecto (RECOMENDADO para principiantes)

### Paso 1️⃣ - Ir a Google Cloud Console
1. Abre https://console.cloud.google.com/
2. **Inicia sesión** con tu cuenta de Google (la misma que usarás para desarrollar)

### Paso 2️⃣ - Crear un Nuevo Proyecto
1. En la parte superior izquierda, verás un **selector de proyecto** (o dice "My First Project")
2. Haz clic en ese selector → se abrirá un popup
3. Busca el botón **"NEW PROJECT"** (azul) en la parte superior del popup
4. Llena el formulario:
   - **Project name:** `bolsa-empleo` (o el nombre que quieras)
   - **Organization:** Déjalo como está (o sin seleccionar)
5. Haz clic en **CREATE**
6. Espera a que se cree (toma ~30 segundos)

### Paso 3️⃣ - Habilitar la API de Google+
Una vez creado el proyecto:

1. En el menú de la izquierda, busca **"APIs & Services"** → click
2. Luego click en **"Enabled APIs & services"** o **"Library"**
3. En el buscador que aparece, escribe: `google plus`
4. Aparecerá **"Google+ API"** → click en ella
5. Haz clic en el botón azul **ENABLE**
6. Espera a que aparezca un mensaje verde confirmando que está habilitada

### Paso 4️⃣ - Crear Credenciales (OAuth 2.0)
1. Sigue en la página de Google+ API
2. Busca el botón **"CREATE CREDENTIALS"** (azul, esquina superior derecha)
3. Se abrirá un formulario. Completa así:

**Pregunta 1: ¿Qué datos necesitas acceder?**
   - Selecciona: **"User data"**

**Pregunta 2: ¿Desde dónde llamarás la API?**
   - Selecciona: **"Web browser (Javascript)"**

**Pregunta 3: ¿Qué datos necesitas?**
   - Selecciona: **"User data"**
   - Haz clic en **"NEXT"**

4. **Crear pantalla de consentimiento OAuth:**
   - Si pide crear una "OAuth consent screen", haz clic en **"CREATE OAUTH CLIENT ID"**
   - En el popup:
     - **User type:** Selecciona **"External"**
     - Haz clic en **CREATE**
   
5. **Llenar Pantalla de Consentimiento:**
   - **App name:** `Bolsa de Empleo`
   - **User support email:** Tu email personal
   - En "Developer contact," agrega tu email también
   - Haz clic en **SAVE AND CONTINUE**
   - En "Scopes", simplemente haz clic en **SAVE AND CONTINUE**
   - En "Summary", haz clic en **BACK TO DASHBOARD**

### Paso 5️⃣ - Obtener tus Credenciales
1. De vuelta en el menú izquierdo: **APIs & Services** → **Credentials**
2. Bajo **"OAuth 2.0 Client IDs"**, verás una tabla
3. Haz clic en el cliente que creaste (o en el nombre si hay solo uno)
4. Se abrirá un panel con:
   - **Client ID** (copiar)
   - **Client Secret** (copiar)

5. También necesitas agregar **URIs autorizados**:
   - En el mismo panel, busca la sección **"Authorized JavaScript origins"**
   - Haz clic en **"+ ADD URI"**
   - Agrega estas dos:
     ```
     http://localhost:3000
     http://localhost:3001
     ```
   - En **"Authorized redirect URIs"**, agrega:
     ```
     http://localhost:3001/api/auth/google/callback
     ```
   - Haz clic en **SAVE**

---

## 🎯 Checklist Final

- ✅ Proyecto creado en Google Cloud
- ✅ Google+ API habilitada
- ✅ Pantalla de consentimiento OAuth creada
- ✅ Cliente OAuth 2.0 creado (Web browser)
- ✅ Client ID copiado
- ✅ Client Secret copiado
- ✅ URIs autorizados agregados:
  - `http://localhost:3000`
  - `http://localhost:3001`
  - `http://localhost:3001/api/auth/google/callback`

---

## 📝 Una vez tengas tus Credenciales

Copia esto en tu archivo `backend/.env`:

```env
GOOGLE_CLIENT_ID=AQUI_VA_TU_CLIENT_ID
GOOGLE_CLIENT_SECRET=AQUI_VA_TU_CLIENT_SECRET
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
GOOGLE_ALLOWED_DOMAIN=universidad.edu.gt
FRONTEND_URL=http://localhost:3000
```

Reemplaza:
- `AQUI_VA_TU_CLIENT_ID` con el valor que copiaste
- `AQUI_VA_TU_CLIENT_SECRET` con el valor que copiaste

---

## ❓ Preguntas Frecuentes

**P: ¿Dónde encuentro estas opciones?**
R: Todo está en https://console.cloud.google.com/ → menú izquierdo → "APIs & Services"

**P: ¿Qué es OAuth 2.0?**
R: Es un protocolo de seguridad que permite a tu aplicación acceder a datos de Google sin guardar contraseñas.

**P: ¿Por qué necesito localhost:3000 y localhost:3001?**
R: 3000 es el frontend (React) y 3001 es el backend (Express). Ambos necesitan estar autorizados.

**P: ¿Qué pasa si me equivoco?**
R: Puedes editar las credenciales en cualquier momento. Ve a Credentials → haz clic en el Cliente → edita y guarda.

**P: ¿Es seguro poner estas credenciales en .env?**
R: Sí, porque `.env` está en `.gitignore` y nunca se sube a GitHub. Es solo para desarrollo local.

---

## 🎓 Próximo Paso

Una vez hayas completado esto, actualiza tu `backend/.env` y avísame para que probemos el flujo completo.
