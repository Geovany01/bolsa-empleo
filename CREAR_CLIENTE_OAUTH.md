# 🔑 Crear Cliente OAuth 2.0 - DESDE DONDE ESTÁS AHORA

## Lo que ves en tu pantalla

Tu captura muestra que ya estás en la sección correcta (**Credenciales**). Ahora necesitas crear el cliente OAuth.

---

## Paso 1️⃣: Haz clic en "Crear credenciales"

En tu pantalla, busca el botón azul que dice **"+ Crear credenciales"** (esquina superior derecha).

Cuando hagas clic, se abrirá un **menú desplegable** con estas opciones:

```
📌 Clave de API
📌 ID de cliente de OAuth ← SELECCIONA ESTA
📌 Cuenta de servicio
📌 Ayúdame a elegir
```

---

## Paso 2️⃣: Selecciona "ID de cliente de OAuth"

Haz clic en **"ID de cliente de OAuth"**.

Se abrirá un popup que dice:

> **"Para usar un ID de cliente, debe configurar primero una pantalla de consentimiento de OAuth"**

Con dos opciones:
- Cancelar
- **Configurar pantalla de consentimiento** ← HACES CLIC AQUÍ

---

## Paso 3️⃣: Configura la Pantalla de Consentimiento

Cuando hagas clic en "Configurar pantalla de consentimiento", aparecerá un formulario con la pregunta:

**"¿Tipo de usuario?"**

Selecciona: **"Externo"** (porque es para desarrollo local)

Haz clic en **"Crear"**

---

## Paso 4️⃣: Llena el Formulario

Se abrirá un formulario largo. Completa solo estos campos:

| Campo | Valor |
|-------|-------|
| **Nombre de la app** | `Bolsa de Empleo` |
| **Email de soporte del usuario** | Tu email (ej: tumail@gmail.com) |
| **Información de contacto del desarrollador** | Tu email |

Haz clic en **"Guardar y continuar"** (abajo a la derecha)

---

## Paso 5️⃣: Permisos (Scopes)

En la siguiente página dice **"Permisos"**. 

Simplemente haz clic en **"Guardar y continuar"** sin cambiar nada.

---

## Paso 6️⃣: Resumen

Aparecerá una página de resumen. Haz clic en **"Volver al panel"** o **"Volver a las credenciales"**.

---

## Paso 7️⃣: Ahora Sí - Crear el Cliente OAuth

Estás de vuelta en la página de Credenciales.

Haz clic nuevamente en **"+ Crear credenciales"** → **"ID de cliente de OAuth"**

Ahora sí aparecerá un formulario preguntando:

**"¿Desde dónde llamarás la API?"**

Selecciona: **"Aplicación web"**

Haz clic en **"Crear"**

---

## Paso 8️⃣: Configura las URLs Autorizadas

En el formulario que aparece, busca las secciones:

### Orígenes autorizados de JavaScript
Haz clic en **"+ Agregar URI"** y agrega:
```
http://localhost:3000
http://localhost:3001
```

### URIs autorizados de redireccionamiento
Haz clic en **"+ Agregar URI"** y agrega:
```
http://localhost:3001/api/auth/google/callback
```

Haz clic en **"Crear"**

---

## Paso 9️⃣: ¡COPIA TUS CREDENCIALES!

Se abrirá un popup con tu **Client ID** y **Client Secret**.

**IMPORTANTE**: Copia ambos valores ahora, porque si cierras el popup, tendrás que crear nuevas credenciales.

```
📋 Client ID: [copiar]
🔐 Client Secret: [copiar]
```

---

## 🎯 Una vez que tengas tus valores

Edita tu archivo `backend/.env`:

```env
GOOGLE_CLIENT_ID=pega_tu_client_id_aqui
GOOGLE_CLIENT_SECRET=pega_tu_client_secret_aqui
```

**Ejemplo real (NO uses estos valores):**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-1234567890abcdefghij
```

---

## ✅ Checklist

- [ ] Hiciste clic en "Crear credenciales"
- [ ] Seleccionaste "ID de cliente de OAuth"
- [ ] Configuraste la pantalla de consentimiento (Tipo: Externo)
- [ ] Llenaste: Nombre de app, Email de soporte, Email de desarrollador
- [ ] Creaste el cliente OAuth (Tipo: Aplicación web)
- [ ] Agregaste los orígenes autorizados:
  - `http://localhost:3000`
  - `http://localhost:3001`
- [ ] Agregaste la URI de redirección:
  - `http://localhost:3001/api/auth/google/callback`
- [ ] Copiaste tu Client ID y Client Secret
- [ ] Actualizaste el archivo `backend/.env`

---

## ❓ ¿Perdiste tus credenciales?

Si cierras el popup sin copiar, no hay problema:

1. Ve de vuelta a **Credenciales**
2. Bajo **"IDs de clientes de OAuth 2.0"**, verás tu cliente creado
3. Haz clic en él para ver el **Client ID** y **Client Secret**

---

## 🚀 Una vez hayas completado esto...

Avísame y probaremos el flujo completo:
1. Iniciamos el backend: `npm run dev`
2. Iniciamos el frontend: `npm start`
3. Hacemos clic en "Continuar con Google"
4. ¡Deberías loguear exitosamente!
