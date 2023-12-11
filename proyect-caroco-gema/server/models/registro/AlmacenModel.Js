const mongoose = require("mongoose");

const itemSchema = mongoose.Schema(
  { 
    nombre: {
      type: String,
      required: [true, "Agrega un nombre"],
    },
    cantidad: {
        type: Number,
        required: [true, "Agrega un valor a cantidad"],
    },
    cantidadMinima: {
      type: Number,
      required: [true, "Agrega un valor a cantidad"],
    },
    unidad: {
        type: String,
        required: [true, "Agrega un valor a unidad"],
    },
    tipo: {
        type: String,
        required: [true, "Agrega un valor a tipo"],
    }
  }
);

module.exports = mongoose.model("Almacen", itemSchema);

