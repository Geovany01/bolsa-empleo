# CLAUDE.md — Instrucciones para Claude Code

## Proyecto
Bolsa de Empleo Universitaria — MVP para conectar empresas con estudiantes universitarios.

## Stack
- **Backend:** Node.js + Express.js + MySQL (mysql2)
- **Frontend:** React.js + CSS puro (SIN Tailwind, SIN frameworks de estilos)
- **Auth:** Google OAuth 2.0 (estudiantes) + JWT + bcrypt (empresas)
- **Archivos:** Multer para subida de CVs en PDF

## Estructura
```
bolsa-empleo/
├── backend/
│   ├── src/
│   │   ├── index.js          # Entry point, Express app
│   │   ├── config/
│   │   │   ├── database.js   # Pool MySQL
│   │   │   └── passport.js   # Google OAuth strategy
│   │   ├── middleware/
│   │   │   └── auth.js       # verificarToken, verificarRol
│   │   └── routes/
│   │       ├── auth.js        # Login Google, registro/login empresa
│   │       ├── ofertas.js     # CRUD ofertas (público + empresa)
│   │       ├── postulaciones.js # Postularse, historial
│   │       ├── empresas.js    # Panel empresa (mis ofertas, postulantes)
│   │       └── admin.js       # Aprobar empresas, moderar, usuarios
│   ├── migrations/001_initial.sql
│   └── seeds/001_data.sql
├── frontend/
│   ├── src/
│   │   ├── App.js             # Router principal
│   │   ├── services/AuthContext.js  # Auth + API helper
│   │   ├── pages/             # Páginas por vista
│   │   ├── components/        # Componentes reutilizables
│   │   └── styles/global.css  # Estilos globales
│   └── public/index.html
└── CLAUDE.md
```

## Modelo de datos
4 tablas en MySQL: usuario, empresa, oferta, postulacion.
Ver `backend/migrations/001_initial.sql` para esquema completo.

## Roles de usuario
- **estudiante:** Login con Google OAuth (dominio institucional). Busca ofertas, se postula con CV.
- **empresa:** Registro con email/password. Requiere aprobación admin. Publica ofertas, gestiona postulantes.
- **admin:** Aprueba empresas, modera ofertas, gestiona usuarios.

## Convenciones de código

### Backend
- Rutas REST: `/api/[recurso]`
- Respuestas: `{ dato }` en éxito, `{ error: 'mensaje' }` en error
- Auth: header `Authorization: Bearer <token>`
- Queries directas con mysql2/promise (sin ORM)
- Validación básica en cada endpoint

### Frontend
- CSS puro en `styles/global.css` — NO usar Tailwind ni styled-components
- Clases CSS descriptivas: `.card`, `.btn-primary`, `.form-input`
- Componentes funcionales con hooks
- Estado global de auth en AuthContext
- API helper: `import { api } from '../services/AuthContext'`
- Uso: `const data = await api('/ofertas')` o `await api('/ofertas', { method: 'POST', body: JSON.stringify(data) })`

## Comandos
```bash
# Setup
cd backend && cp .env.example .env  # Editar con datos reales
mysql -u root -p < migrations/001_initial.sql
npm install && npm run dev

# En otra terminal
cd frontend && npm install && npm start
```

## Qué NO hacer
- No usar TypeScript
- No usar Tailwind CSS ni ningún framework de estilos
- No usar ORM (Sequelize, Prisma) — queries directas con mysql2
- No agregar funcionalidades fuera del alcance (mensajería, notificaciones, IA, pagos)
- No crear app móvil nativa
- No agregar multilenguaje

## Qué SÍ priorizar
- Que funcione el flujo completo: registro empresa → aprobación → publicar oferta → estudiante busca → aplica
- Código simple y legible
- Validaciones básicas en formularios
- Diseño responsivo con CSS puro
- Manejo de errores con mensajes claros al usuario
