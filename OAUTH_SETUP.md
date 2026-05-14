# 🔐 Configuración de Google OAuth 2.0

## ✅ Estado Actual
Todo está implementado correctamente. Solo necesitas:

### 1. Crear Credenciales de Google Cloud

**Pasos en Google Cloud Console:**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto (o selecciona uno existente)
3. Habilita la API **Google+ API**
4. Ve a **Credenciales** → **Crear Credenciales** → **ID de Cliente OAuth 2.0**
5. Tipo: **Aplicación web**
6. Orígenes autorizados:
   ```
   http://localhost:3000
   http://localhost:3001
   ```
7. URIs autorizados de redirección:
   ```
   http://localhost:3001/api/auth/google/callback
   ```
8. Copia: **Client ID** y **Client Secret**

### 2. Configurar Variables de Entorno

**Archivo: `backend/.env`** (ya existe, actualizar):

```env
# Google OAuth 2.0
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
GOOGLE_ALLOWED_DOMAIN=universidad.edu.gt
```

⚠️ **IMPORTANTE**: Reemplaza `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` con los valores reales de Google Cloud.

### 3. Configurar Dominio Institucional (Opcional)

Si quieres permitir SOLO ciertos dominios de email (ej: `@universidad.edu.gt`):
- Actualiza `GOOGLE_ALLOWED_DOMAIN` en `.env`
- El backend rechazará automáticamente otros dominios

Para permitir **cualquier dominio**, comenta esta validación en `backend/src/config/passport.js` línea 17-19:
```javascript
// if (domain !== process.env.GOOGLE_ALLOWED_DOMAIN) {
//   return done(null, false, { message: 'Dominio no autorizado' });
// }
```

### 4. Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 5. Iniciar Servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 6. Probar Flujo de Autenticación

1. Abre `http://localhost:3000`
2. Haz clic en **"Continuar con Google (estudiantes)"**
3. Inicia sesión con tu cuenta Google
4. Deberías ser redirigido a la página principal como estudiante

## 🔄 Flujo de Autenticación Completado

```
Frontend               Backend              Google
  │                     │                    │
  │─ Click Google ─────→│                    │
  │                     │─── Redirect ──────→│
  │                     │                    │
  │                     │←─ User Auth ───────│
  │                     │                    │
  │←─ Token + Redirect ─│                    │
  │                     │                    │
  │─ Extract Token ────→│                    │
  │─ GET /auth/me ──────│                    │
  │←─ User Data ────────│                    │
  │                     │                    │
  └─ Redirect + Login ──┘                    │
```

## 📋 Checklist de Validación

- [ ] Variables de entorno actualizadas con credenciales de Google
- [ ] Base de datos creada: `mysql -u root -p < backend/migrations/001_initial.sql`
- [ ] `npm install` ejecutado en backend y frontend
- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 3000
- [ ] CORS habilitado (`backend/.env` tiene `FRONTEND_URL=http://localhost:3000`)
- [ ] Prueba de login con Google exitosa

## 🐛 Troubleshooting

### "Dominio no autorizado"
- Verifica que tu email en Google está en el dominio autorizado
- O deshabilita la validación de dominio (ver sección 3)

### "Token no recibido"
- Asegúrate que `GOOGLE_CALLBACK_URL` en `.env` es correcto
- Verifica que la URI coincide exactamente en Google Cloud Console

### CORS Error
- Revisa `backend/.env`: `FRONTEND_URL=http://localhost:3000`
- Reinicia el servidor backend

### Usuario no se crea
- Verifica que la tabla `usuario` existe: `mysql -u root -p bolsa_empleo -e "DESC usuario;"`
- Revisa logs del backend en terminal

## 📚 Archivos Modificados

✅ `frontend/src/pages/AuthCallback.js` - Implementado completamente
✅ `backend/src/config/passport.js` - Ya estaba listo
✅ `backend/src/routes/auth.js` - Ya estaba listo
✅ `backend/src/index.js` - Ya estaba listo
✅ `frontend/src/services/AuthContext.js` - Ya estaba listo

## 🚀 Próximos Pasos

Una vez que Google OAuth funcione:
1. Implementar refresh tokens (opcional)
2. Agregar logout
3. Crear panel de estudiante
4. Implementar búsqueda de ofertas de trabajo
5. Agregar formulario de postulación
