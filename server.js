// ====== IMPORTACIONES ======
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import seriesRoutes from "./routes/serieroutes.js";

dotenv.config();

// ====== CONFIGURACIÓN DEL SERVIDOR ======
const app = express();

// ✅ Configurar CORS ANTES que cualquier otra cosa
app.use(cors({
  origin: [
    "https://myseries-frontend.vercel.app", // Frontend en producción
    "http://localhost:5500" // Para pruebas locales
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

// Middleware
app.use(express.json());
// Rutas
app.use("/api/series", seriesRoutes);

// ====== RUTA BASE ======
app.get("/", (req, res) => {
  res.send("Servidor MySeries funcionando correctamente ✅");
});

// ====== CONEXIÓN A MONGODB ======
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas");
    app.listen(PORT, () =>
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));
  
