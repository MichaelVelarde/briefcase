const mongoose = require("mongoose");

const resumenMaquinaSchema = mongoose.Schema(
  { _id: {
        type: String,
        required: [true, "Agrega la fecha de venta"],
    },
    maquinas: {
      type: [{_id: String, nombre : String  , horas : Number}],
      required: [true, "Agrega el arreglo de insumos"],
    },
  }
);

module.exports = mongoose.model("ResumenMaquina", resumenMaquinaSchema);

