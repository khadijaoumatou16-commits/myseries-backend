// ====== IMPORTACIONES ======
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import seriesRoutes from "./routes/serieroutes.js";

dotenv.config();

// ====== CONFIGURACIÓN DEL SERVIDOR ======
const app = express();

// ====== MIDDLEWARES ======
app.use(express.json());

// ✅ CORS (configuración completa y segura)
const allowedOrigins = [
  "https://myseries-frontend.vercel.app", // frontend en producción
  "http://localhost:5500",                // pruebas locales
  "http://127.0.0.1:5500"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ✅ Manejo automático para preflight (solicitudes OPTIONS)
app.options("*", (req, res) => {
  res.sendStatus(200);
});

// ====== RUTAS ======

app.use(`/api/series`, seriesRoutes);
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

// ====== RUTA BASE ======
app.get("/", (req, res) => {
  res.send("Servidor MySeries funcionando correctamente ✅");
});
