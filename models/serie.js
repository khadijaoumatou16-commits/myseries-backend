// backend/models/serie.js
import mongoose from "mongoose";

const subtitleSchema = new mongoose.Schema({
  lang: String,
  label: String,
  url: String
}, { _id: true });

const episodioSchema = new mongoose.Schema({
  numero: Number,
  titulo: String,
  enlace: String,
  subtitles: [subtitleSchema]
}, { _id: true });

const serieSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  pais: String,
  idioma: String,
  imagen: String,
  episodios: [episodioSchema],
  creadaEn: { type: Date, default: Date.now }
});

export default mongoose.model("Serie", serieSchema);