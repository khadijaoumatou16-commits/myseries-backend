// =============================
// 🌍 IMPORTACIONES
// =============================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import serieRoutes from "./routes/serieroutes.js";

dotenv.config();

const app = express();

// =============================
// 📂 CONFIGURACIÓN DE RUTAS Y DIRECTORIOS
// =============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// ⚙️ MIDDLEWARES
// =============================

// 🌐 Configuración de CORS
const allowedOrigins = [
  "https://myseries-frontend.vercel.app", // tu frontend desplegado en Vercel
  "http://localhost:5173",                // opcional: para desarrollo local
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("❌ Bloqueado por CORS:", origin);
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// 📂 Servir archivos estáticos (videos, subtítulos, imágenes, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =============================
// 📦 RUTAS API
// =============================
app.use("/api/series", serieRoutes);

// =============================
// 🏠 RUTA PRINCIPAL
// =============================
app.get("/", (req, res) => {
  res.send("✅ Servidor funcionando correctamente (MySeries Backend)");
});

// =============================
// ⚙️ CONFIGURACIONES DE ENTORNO
// =============================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// =============================
// 🧠 CONEXIÓN A MONGODB
// =============================
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

// =============================
// ⚠️ MANEJADOR DE ERRORES NO CONTROLADOS
// =============================
process.on("unhandledRejection", (reason) => {
  console.error("⚠️ Promesa no manejada:", reason);
});
