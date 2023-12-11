const mongoose = require("mongoose");

const proveedorSchema = mongoose.Schema(
  { 
    nombre: {
      type: String,
      required: [true, "Agrega un nombre"],
    },
    telefono: {
        type: Number,
        required: [true, "Agrega un valor a telefono"],
    },
    comentario: {
      type: String,
      required: [true, "Agrega un cometario"],
    },
    direccion: {
        type: String,
        required: [true, "Agrega la direcion del proveedor"],
      },
  }
);

module.exports = mongoose.model("Proveedor", proveedorSchema);

