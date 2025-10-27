import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import serieRoutes from "./routes/serieroutes.js";

dotenv.config();

const app = express();

// 🧩 __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⚙️ Middlewares
app.use(cors());
app.use(express.json());

// 🗂️ Servir archivos estáticos (videos, subtítulos, imágenes, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 📦 Rutas API
app.use("/api/series", serieRoutes);

// 🌍 Ruta raíz
app.get("/", (req, res) => {
  res.send("✅ Servidor funcionando correctamente");
});

// ⚙️ Variables de entorno
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// 🧠 Conexión a MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas correctamente");
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB Atlas:", err.message);
  });

// 🧩 Manejador global de errores no controlados
process.on("unhandledRejection", (reason) => {
  console.error("⚠️ Promesa no manejada:", reason);
});
