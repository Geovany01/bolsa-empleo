# Bolsa de Empleo Universitaria

Plataforma web para conectar empresas con estudiantes universitarios. Las empresas publican ofertas laborales y los estudiantes se postulan usando su cuenta institucional de Google.

## Requisitos previos

- Node.js 18+
- MySQL 8+
- Cuenta de Google Cloud (para OAuth)

## Instalación

### 1. Clonar y configurar

```bash
git clone <url-del-repo>
cd bolsa-empleo
```

### 2. Base de datos

```bash
mysql -u root -p < backend/migrations/001_initial.sql
```

### 3. Backend

```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales de MySQL y Google OAuth
npm install
npm run dev
```

### 4. Frontend

```bash
cd frontend
npm install
npm start
```

La app estará en `http://localhost:3000` y la API en `http://localhost:3001`.

## Configurar Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear proyecto → APIs y servicios → Credenciales
3. Crear ID de cliente OAuth 2.0 (tipo: aplicación web)
4. URI de redirección: `http://localhost:3001/api/auth/google/callback`
5. Copiar Client ID y Client Secret al `.env`

## Estructura del proyecto

```
backend/    → API REST (Node.js + Express + MySQL)
frontend/   → SPA (React + CSS)
CLAUDE.md   → Instrucciones para Claude Code
```

## Equipo

| Integrante | Rol 1 | Rol 2 |
|---|---|---|
| A | Project Manager | QA / Tester |
| B | Backend Developer | DBA |
| C | Frontend Developer | DevOps |
| D | UX/UI Designer | Documentador Técnico |
