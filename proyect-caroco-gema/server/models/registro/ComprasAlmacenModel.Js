const mongoose = require("mongoose");

const comprasSchema = mongoose.Schema(
  { 
    fecha: {
      type: String,
      required: [true, "Agrega una fecha"],
    },
    item: {
        type: {_id : String , nombre : String},
        required: [true, "Agrega un item"],
    },
    proveedor: {
      type: {_id : String , nombre : String},
      required: [true, "Agrega un proveedor"],
    },
    cantidad: {
        type: Number,
        required: [true, "Agrega un valor a cantidad"],
    },
    precio: {
      type: Number,
      required: [true, "Agrega un valor a precio"],
    }
  }
);

module.exports = mongoose.model("ComprasAlmacen", comprasSchema);

