const mongoose = require("mongoose");

const ventaSchema = mongoose.Schema(
  { fecha: {
        type: String,
        required: [true, "Agrega la fecha de venta"],
    },
    comprador: {
      type: {_id: String, nombre : String},
      required: [true, "Agrega un comprador"],
    },
    mineral: {
      type: {_id: String, nombre : String },
      required: [true, "Agrega el mineral"],
    },
    cantidad: {
        type: Number,
        required: [true, "Agrega la cantidad"],
    },
    precioUnitario: {
        type: Number,
        required: [true, "Agrega el precio unitario"],
    }
  }
);

module.exports = mongoose.model("Venta", ventaSchema);

