# Bolsa de Empleo Universitaria

Plataforma web para conectar empresas con estudiantes universitarios. Las empresas publican ofertas laborales y los estudiantes se postulan usando su cuenta institucional de Google.

- **Backend:** Node.js + Express + MySQL
- **Frontend:** React (CSS puro, sin frameworks de estilos)
- **Auth:** Google OAuth 2.0 (estudiantes) + JWT/bcrypt (empresas y admin)

---

## Requisitos previos

- **Node.js 18+** ([descargar](https://nodejs.org))
- **MySQL 8+** ([descargar](https://dev.mysql.com/downloads/))
- **Cuenta de Google Cloud** (necesaria solo para el login de estudiantes; el resto del flujo funciona sin ella)

Verifica que estén instalados:

```powershell
node --version
npm --version
mysql --version
```

> **Windows: si `mysql --version` te da "command not found"**, es porque el instalador no agrega MySQL al PATH. Agrégalo con esto (PowerShell, no necesita admin):
>
> ```powershell
> $mysqlBin = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
> $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
> if ($userPath -notlike "*$mysqlBin*") {
>   [Environment]::SetEnvironmentVariable("Path", "$userPath;$mysqlBin", "User")
> }
> ```
>
> Cierra y abre una nueva PowerShell para que tome efecto. Si tu versión de MySQL no es 8.0, ajusta la ruta (ej. `MySQL Server 8.4`).

---

## Instalación paso a paso

### 1. Clonar el repositorio

```powershell
git clone <url-del-repo>
cd bolsa-empleo
```

### 2. Crear la base de datos

Conéctate a MySQL con la contraseña que definiste al instalar:

```powershell
mysql -u root -p
```

Dentro del prompt `mysql>`, ejecuta el script de migración (ajusta la ruta si tu repo está en otro lugar):

```sql
SOURCE C:/Proyectos/bolsa-empleo/backend/migrations/001_initial.sql;
exit;
```

> En Windows usa **barras normales `/`** dentro de SQL aunque el path sea Windows. MySQL las acepta.

Verifica que se crearon las tablas:

```powershell
mysql -u root -p -e "USE bolsa_empleo; SHOW TABLES;"
```

Debes ver: `empresa`, `oferta`, `postulacion`, `usuario`.

### 3. Cargar el usuario admin (seed)

**PowerShell (Windows):**

```powershell
Get-Content backend\seeds\001_data.sql | mysql -u root -p bolsa_empleo
```

**Bash / cmd:**

```bash
mysql -u root -p bolsa_empleo < backend/seeds/001_data.sql
```

> PowerShell no soporta el operador `<` para redirección de input. Usa `Get-Content | ...` en su lugar.

Esto crea un admin con credenciales:

- **Email:** `admin@universidad.edu.gt`
- **Contraseña:** `admin123`

> En producción cambia esa contraseña inmediatamente.

#### Seed opcional para desarrollo (`002_dev_users.sql`)

Si vas a probar la app localmente sin configurar Google OAuth, aplica también este seed que crea un estudiante de prueba y una empresa demo ya aprobada:

**PowerShell:**

```powershell
Get-Content backend\seeds\002_dev_users.sql | mysql -u root -p bolsa_empleo
```

**Bash:**

```bash
mysql -u root -p bolsa_empleo < backend/seeds/002_dev_users.sql
```

Crea estos usuarios (login desde `/login` con email/password):

| Rol | Email | Contraseña |
|---|---|---|
| Estudiante | `estudiante@universidad.edu.gt` | `estudiante123` |
| Empresa (aprobada) | `empresa@demo.com` | `empresa123` |

> **No usar este seed en producción.** Es solo para testing local.

### 4. Configurar variables de entorno del backend

```powershell
cd backend
copy .env.example .env
```

Edita `backend/.env` con tu editor favorito y completa:

| Variable | Qué poner |
|---|---|
| `DB_PASSWORD` | La contraseña de tu usuario `root` de MySQL |
| `JWT_SECRET` | Una cadena aleatoria larga (mínimo 32 caracteres) |
| `GOOGLE_ALLOWED_DOMAIN` | El dominio institucional (ej. `universidad.edu.gt`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Ver paso 6 abajo |

Las demás variables (`PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_NAME`, `GOOGLE_CALLBACK_URL`, `FRONTEND_URL`) ya tienen valores correctos para desarrollo local.

> Si por ahora no quieres configurar Google OAuth, deja los placeholders de Google. El backend arranca igual; solo fallará el botón "Continuar con Google".

### 5. Instalar dependencias

```powershell
# Desde la raíz del proyecto:
cd backend
npm install

cd ../frontend
npm install
```

### 6. (Opcional, recomendado) Configurar Google OAuth

Solo necesario para el login de estudiantes con cuenta institucional.

1. Ve a [Google Cloud Console](https://console.cloud.google.com).
2. Crea un proyecto nuevo (o elige uno existente).
3. **APIs y servicios → Pantalla de consentimiento OAuth**: configúrala como tipo "Externo" y agrega el dominio `localhost` a los autorizados.
4. **APIs y servicios → Credenciales → Crear credencial → ID de cliente OAuth**:
   - Tipo: **Aplicación web**
   - Orígenes JavaScript autorizados: `http://localhost:3000`
   - URI de redirección autorizado: `http://localhost:3001/api/auth/google/callback`
5. Copia el **Client ID** y el **Client Secret** al archivo `backend/.env`.
6. Reinicia el backend si estaba corriendo.

---

## Levantar el proyecto

Necesitas **dos terminales** abiertas en paralelo.

**Terminal 1 — Backend (puerto 3001):**

```powershell
cd backend
npm run dev
```

Deberías ver: `Servidor corriendo en puerto 3001`.

**Terminal 2 — Frontend (puerto 3000):**

```powershell
cd frontend
npm start
```

El navegador debería abrir automáticamente en `http://localhost:3000`.

### Verificar que el backend responde

```powershell
curl http://localhost:3001/api/health
```

Debes recibir `{"status":"ok","timestamp":"..."}`.

---

## Cómo probar el flujo

1. **Login admin:** entra a `http://localhost:3000/login` con `admin@universidad.edu.gt` / `admin123` y aprueba empresas desde el panel admin.
2. **Registro de empresa:** entra a `/registro/empresa`, crea una cuenta. Quedará en estado *pendiente* hasta que el admin la apruebe.
3. **Login empresa:** una vez aprobada, la empresa puede ingresar y publicar ofertas.
4. **Login estudiante:** desde `/login`, botón "Continuar con Google". Solo funciona si tu correo termina con el dominio configurado en `GOOGLE_ALLOWED_DOMAIN`.

---

## Estructura del proyecto

```
bolsa-empleo/
├── backend/
│   ├── src/
│   │   ├── config/        # database.js, passport.js
│   │   ├── middleware/    # auth.js (verificarToken, verificarRol)
│   │   ├── routes/        # auth, ofertas, postulaciones, empresas, admin
│   │   └── index.js       # entry point
│   ├── migrations/001_initial.sql
│   ├── seeds/001_data.sql
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/         # Una por vista
│   │   ├── services/AuthContext.js   # auth + helper api()
│   │   └── styles/global.css
│   └── public/
├── CLAUDE.md              # Instrucciones para Claude Code
└── README.md
```

---

## Solución de problemas comunes

**`Error: connect ECONNREFUSED 127.0.0.1:3306`**
MySQL no está corriendo. En Windows abre "Servicios" y verifica que `MySQL80` (o similar) esté en estado *En ejecución*.

**`Access denied for user 'root'@'localhost'`**
La contraseña en `backend/.env` (`DB_PASSWORD`) no coincide con la real de MySQL.

**`Error: Unknown database 'bolsa_empleo'`**
No corriste el script de migración del paso 2.

**El frontend muestra "Network Error" o "Failed to fetch"**
El backend no está corriendo, o está en otro puerto. Verifica con `curl http://localhost:3001/api/health`.

**Login con Google da error "Dominio no autorizado"**
El correo con el que intentas entrar no termina con el dominio configurado en `GOOGLE_ALLOWED_DOMAIN` del `.env`.

**Puerto 3000 o 3001 ocupado**
Cierra el proceso que lo está usando, o cambia el puerto en `backend/.env` (variable `PORT`) y en `frontend/package.json` (campo `proxy`).

---

## Comandos útiles

```powershell
# Resetear la base de datos (BORRA todos los datos)
mysql -u root -p -e "DROP DATABASE bolsa_empleo;"
mysql -u root -p < backend/migrations/001_initial.sql
mysql -u root -p bolsa_empleo < backend/seeds/001_data.sql

# Generar un nuevo hash bcrypt (por ejemplo para cambiar el admin)
cd backend
node -e "require('bcryptjs').hash('TU_PASSWORD', 10).then(console.log)"
```

---

## Equipo

| Integrante | Rol 1 | Rol 2 |
|---|---|---|
| Óscar Geovany Pérez Vásquez | Project Manager | QA / Tester |
| Boris Wladimir Menéndez Sandoval | Backend Developer | DBA |
|  Miguel Alejandro Romero Marroquín  | Frontend Developer | DevOps |
| Rocío Shalim de los Ángeles Tobías Chalí  | UX/UI Designer | Documentador Técnico |