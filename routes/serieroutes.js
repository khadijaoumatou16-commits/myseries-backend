import express from "express";
import multer from "multer";
import Serie from "../models/serie.js";

const router = express.Router();

// ==========================
// 📦 CONFIGURACIÓN DE MULTER
// ==========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "video") cb(null, "uploads/videos/");
    else if (file.fieldname === "subtitles") cb(null, "uploads/subtitles/");
    else cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage });

// ==========================
// 🎬 CREAR NUEVA SERIE
// ==========================
router.post("/crear", upload.single("imagen"), async (req, res) => {
  try {
    const { titulo, descripcion, pais, idioma } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const nuevaSerie = new Serie({
      titulo,
      descripcion,
      pais,
      idioma,
      imagen,
      episodios: [],
    });

    await nuevaSerie.save();
    res.status(201).json({ mensaje: "✅ Serie creada correctamente", serie: nuevaSerie });
  } catch (error) {
    console.error("❌ Error al crear serie:", error);
    res.status(500).json({ error: "Error al crear la serie" });
  }
});

// ==========================
// 🎞 AÑADIR EPISODIO CON SUBTÍTULOS
// ==========================
router.post(
  "/:serieId/episodios",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "subtitles", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { serieId } = req.params;
      const { numero, titulo, subData } = req.body;

      const serie = await Serie.findById(serieId);
      if (!serie) return res.status(404).json({ error: "Serie no encontrada" });

      // 🎥 Enlace del video
      const enlace = req.files["video"]
        ? `/uploads/videos/${req.files["video"][0].filename}`
        : null;

      // 📝 Recuperar info de subtítulos desde el JSON
      let subtitles = [];
      if (subData) {
        try {
          subtitles = JSON.parse(subData);
        } catch {
          console.error("⚠ Error al parsear subData JSON");
        }
      }

      // 📂 Añadir URL de archivos .vtt subidos
      if (req.files["subtitles"]) {
        req.files["subtitles"].forEach((file, i) => {
          if (subtitles[i]) {
            subtitles[i].url = `/uploads/subtitles/${file.filename}`;
          }
        });
      }

      // Guardar episodio completo
      serie.episodios.push({ numero, titulo, enlace, subtitles });

      await serie.save();
      res.status(201).json({ mensaje: "✅ Episodio y subtítulos guardados", serie });
    } catch (error) {
      console.error("❌ Error al subir episodio:", error);
      res.status(500).json({ error: "Error al subir episodio" });
    }
  }
);

// ==========================
// 📋 OBTENER SERIES
// ==========================
router.get("/", async (req, res) => {
  try {
    const series = await Serie.find();
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las series" });
  }
});

// ==========================
// 🔍 OBTENER SERIE POR ID
// ==========================
router.get("/:id", async (req, res) => {
  try {
    const serie = await Serie.findById(req.params.id);
    if (!serie) return res.status(404).json({ error: "Serie no encontrada" });
    res.json(serie);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la serie" });
  }
});

export default router;