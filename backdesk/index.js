import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import userRoutes from "./src/api/routes/user.routes.js";
import obraRoutes from "./src/api/routes/obra.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/obras", obraRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("Servidor de Galería de Arte activo");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
