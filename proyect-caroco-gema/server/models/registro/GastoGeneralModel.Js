const mongoose = require("mongoose");

const gastoSchema = mongoose.Schema(
  { 
    fecha: {
      type: String,
      required: [true, "Agrega la fecha"],
    },
    detalle: {
      type: String,
      required: [true, "Agrega el detalle del gasto extra"],
    },
    gasto: {
        type: Number,
        required: [true, "Agrega el valor de gasto"],
    }
  }
);

module.exports = mongoose.model("GastoGeneral", gastoSchema);

