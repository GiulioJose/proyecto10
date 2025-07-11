// src/api/routes/obra.routes.js
import express from "express";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";
import {
  createObra,
  aprobarObra,
  toggleFavorito,
  getObras,
  getObraById,
  getObrasMiasAprobadas,
  getObrasMiasPendientes,
  getObrasFavoritas,
  getObrasPendientes,
  editarObra,
  eliminarObra,
  buscarObras
} from "../controllers/obra.controller.js";

import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage });

// 🔸 Crear una nueva obra – requiere login
router.post("/", verifyToken, upload.single("imagen"), createObra);

// 🔸 Obtener todas las obras aprobadas (uso público en el home)
router.get("/", getObras);

// 🔸 Obtener mis obras aprobadas – requiere login
router.get("/mias/aprobadas", verifyToken, getObrasMiasAprobadas);

// 🔸 Obtener mis obras pendientes – requiere login
router.get("/mias/pendientes", verifyToken, getObrasMiasPendientes);

// 🔸 Obtener mis obras favoritas – requiere login
router.get("/favoritos", verifyToken, getObrasFavoritas);

// 🔸 Obtener todas las obras pendientes (solo admin)
router.get("/pendientes", verifyToken, isAdmin, getObrasPendientes);

// 🔸 Aprobar una obra – solo admin
router.patch("/:id/aprobar", verifyToken, isAdmin, aprobarObra);

// 🔸 Editar obra – autor si pendiente o admin
router.patch("/:id", verifyToken, editarObra);

// 🔸 Añadir o quitar favoritos – requiere login
router.patch("/:id/favorito", verifyToken, toggleFavorito);

// 🔸 Eliminar obra – autor si pendiente o admin
router.delete("/:id", verifyToken, eliminarObra);

// 🔸 Buscar obras (autenticado)
router.get("/buscar", verifyToken, buscarObras);

// 🔸 Obtener detalle de obra – requiere login
router.get("/:id", verifyToken, getObraById);

export default router;
