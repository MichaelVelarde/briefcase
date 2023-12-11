const mongoose = require("mongoose");

const alimentacionPreciosSchema = mongoose.Schema(
  {
    fecha: {
      type: String,
      required: [true, "Agrega el precio de desayuno"],
    },
    desayuno: {
      type: Number,
      required: [true, "Agrega el precio de desayuno"],
    },
    almuerzo: {
        type: Number,
        required: [true, "Agrega el precio de almuerzo"],
    },
    cena: {
        type: Number,
        required: [true, "Agrega el precio de cena"],
    }
  }
);

module.exports = mongoose.model("AlimentacionPrecio", alimentacionPreciosSchema);

