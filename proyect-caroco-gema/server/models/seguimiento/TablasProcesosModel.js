const mongoose = require("mongoose");

const procesoSchema = mongoose.Schema(
  { 
    nombre: {
      type: String,
      required: [true, "Agrega un nombre"],
    },
    volumen: {
        type: Boolean,
        required: true,
    },
    mineralObtenido: {
        type: Boolean,
        required: true,
    },
    insumo: {
        type: Boolean,
        required: true,
    },
    maquinaria: {
        type: Boolean,
        required: true,
    },
    personal: {
        type: Boolean,
        required: true,
    },
  }
);

module.exports = mongoose.model("TablaProceso", procesoSchema);

