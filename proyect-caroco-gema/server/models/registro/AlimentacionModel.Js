const mongoose = require("mongoose");

const alimentacionSchema = mongoose.Schema(
  { 
    fecha: {
      type: String,
      required: [true, "Agrega una fecha"],
    },
    desayuno: {
      type: Number,
      required: [true, "Agrega un valor a desayuno"],
    },
    almuerzo: {
        type: Number,
        required: [true, "Agrega un valor a almuerzo"],
    },
    cena: {
        type: Number,
        required: [true, "Agrega un valor a cena"],
    }
  }
);

module.exports = mongoose.model("Alimentacion", alimentacionSchema);

