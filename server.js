// ===== IMPORTACIONES =====
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import seriesRoutes from "./routes/serieroutes.js";

// ===== CONFIGURACIÓN DEL SERVIDOR =====
dotenv.config();


const app = express();
// ===== CONFIGURAR CORS =====
app.use(cors({
  origin: [
    "https://myseries-frontend.vercel.app", // frontend en producción
    "http://localhost:5500"                 // para pruebas locales
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

// ===== MIDDLEWARES =====
app.use(express.json());

// ===== RUTAS =====
app.use("/api/series", seriesRoutes);

// ===== RUTA BASE =====
app.get("/", (req, res) => {
  res.send("🚀 API MySeries funcionando correctamente.");
});

// ===== CONEXIÓN A MONGODB =====
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas correctamente");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar con MongoDB:", error);
  });
