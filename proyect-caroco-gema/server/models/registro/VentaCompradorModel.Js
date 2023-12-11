const mongoose = require("mongoose");

const compadorSchema = mongoose.Schema(
  { nit: {
        type: Number,
        required: [true, "Agrega el valor del nit"],
    },
    nombre: {
      type: String,
      required: [true, "Agrega un valor para nombre"],
    },
    telefono: {
      type: Number,
      required: [true, "Agrega el telefono"],
    },
    direccion: {
        type: String,
        required: [true, "Agrega la direccion"],
    },
    comentario: {
        type: String,
        required: [true, "Agrega un valor a comentario"],
    }
  }
);

module.exports = mongoose.model("CompradorVenta", compadorSchema);

