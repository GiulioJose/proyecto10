# 🖼️ Proyecto 10 – Galería de Obras

Una plataforma de gestión de obras de arte donde usuarios pueden subir, editar, eliminar y explorar obras, así como marcarlas como favoritas. Cuenta con control de roles (usuario / admin), carga de imágenes en Cloudinary, vistas dinámicas y una experiencia fluida tanto para el visitante como para el administrador.

---

## 📜 Justificación temática

Este proyecto adapta la consigna de “gestión de eventos” a una **galería de obras de arte**. En lugar de asistentes a eventos, los usuarios pueden:

- Subir y gestionar obras (como creadores del evento)
- Marcar obras como favoritas (equivalente a manifestar interés o asistencia)
- Explorar obras en detalle
- Administrar usuarios (si tienen rol `admin`)

> 🎨 Las “obras” reemplazan a los “eventos” de la consigna, y los “favoritos” cumplen el rol de asistentes interesados.

---

## 🧠 Funcionalidades principales

- Registro e inicio de sesión con JWT
- Subida de obras con imagen (Cloudinary)
- Vista pública de obras aprobadas
- Edición/eliminación de obras propias (si no están aprobadas)
- Vista de detalles individuales de cada obra
- Marcado como obra favorita
- Buscador por múltiples campos
- Panel de administración (usuarios y obras pendientes)
- Vista de obras personales aprobadas y pendientes
- Control de roles (`user` y `admin`)
- Indicadores de carga (`loading`)
- Manejo de errores en frontend y backend
- Componentes reutilizables y fetch centralizado

---

## 🧪 Usuarios de prueba

```plaintext
👑 Admin:
  Email:    user1@mail.com
  Password: 123456

👤 Usuario 1:
  Email:    user2@mail.com
  Password: 123456

👤 Usuario 2:
  Email:    user3@mail.com
  Password: 123456
```

---

## 🧰 Tecnologías utilizadas

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Token (JWT)
- Bcrypt
- Cloudinary + Multer
- Dotenv, CORS

### Frontend
- Vite
- JavaScript Vanilla
- SCSS modular
- Fetch centralizado (`apiFetch`)
- Componentes JS reutilizables
- SessionStorage

---

## 🚀 Instalación y ejecución local

### 1. Backend

```bash
cd backdesk
npm install
npm run dev
```

📝 Asegúrate de tener `backdesk/.env` con tus claves:

```ini
CLOUDINARY_NAME=...
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...
JWT_SECRET=...
MONGODB_URI=...
```

### 2. Frontend

```bash
cd frontdesk
npm install
npm run dev
```

---

## 🔒 Seguridad y avisos

- El archivo `backdesk/.env` se incluye intencionalmente para revisión del proyecto.
- Las rutas están protegidas mediante middleware (`verifyToken`, `isAdmin`).
- El frontend gestiona los tokens en `sessionStorage`.

---

## 📁 Estructura del proyecto

```bash
proyecto10/
│
├── backdesk/        # Backend con Express y MongoDB
│   ├── src/api/...  # Controllers, routes, models
│   ├── .env         # ⚠️ Incluido solo para corrección
│
├── frontdesk/       # Frontend con Vite y Vanilla JS
│   ├── src/js/...   # Views, components, utils
│   ├── src/styles/  # Estilos SCSS modularizados
│
├── .gitignore       # Unificado y ajustado
└── README.md
```

---

## 🔐 Rutas y permisos

### 🧑 Usuario autenticado (`user`)
- `POST /api/obras`: subir nueva obra (queda pendiente)
- `PATCH /api/obras/:id`: editar solo sus obras pendientes
- `DELETE /api/obras/:id`: eliminar sus obras pendientes
- `PATCH /api/obras/:id/favorito`: marcar/desmarcar como favorita
- `GET /api/obras/favoritos`: ver obras favoritas
- `GET /api/obras/mias/aprobadas`: ver obras propias aprobadas
- `GET /api/obras/mias/pendientes`: ver obras propias pendientes
- `GET /api/obras/:id`: ver detalle si es pública o suya
- `GET /api/obras/buscar?q=...`: buscar por cualquier campo

### 👑 Admin
Todo lo anterior, más:
- `GET /api/obras/pendientes`: ver todas las obras no aprobadas
- `PATCH /api/obras/:id/aprobar`: aprobar obra
- `GET /api/users`: ver todos los usuarios
- `PATCH /api/users/:id/role`: cambiar rol de usuario
- `DELETE /api/users/:id`: eliminar usuario

---

## 📌 Requisitos cumplidos

- [x] Modelos: usuario + obra
- [x] Hash de contraseñas con Bcrypt
- [x] JWT para autenticación
- [x] Middleware de token + rutas protegidas
- [x] Subida de imágenes (Cloudinary)
- [x] Controladores que filtran, ordenan y agrupan
- [x] Relaciones entre colecciones (subidaPor)
- [x] Registro que también inicia sesión
- [x] Exploración de detalles de obra
- [x] Lista de favoritos como asistencia
- [x] Manejo de errores claro (frontend y backend)
- [x] Loading en todos los procesos asíncronos
- [x] Código reutilizado, fetch centralizado
- [x] Componentización aplicada
