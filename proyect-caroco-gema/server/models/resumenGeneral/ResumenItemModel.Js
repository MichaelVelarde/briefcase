const mongoose = require("mongoose");

const resumenItemSchema = mongoose.Schema(
  { _id: {
        type: String,
        required: [true, "Agrega la fecha de venta"],
    },
    items: {
      type: [{_id: String, nombre : String , cantidad : Number}],
      required: [true, "agrega el arreglo de items"],
    },
  }
);

module.exports = mongoose.model("ResumenItem", resumenItemSchema);

