const mongoose = require("mongoose");

const tablaSchema = mongoose.Schema(
  { 
    fecha: {
      type: String,
      required: [true, "Agrega una fecha"],
    },
    volumen: {
      type: Number,
    },
    mineralObtenido: {
      type: [{_id: String, cant: Number , nombre : String}],
    },
    insumos: {
      type: [{_id: String, cant: Number , nombre : String}],
    },
    maquinaria: {
      type: [{_id: String, horas: Number , nombre : String}],
    },
    personal: {
      type: [{_id: String, horas: Number , nombre : String}],
    },
  }
);

module.exports = tablaSchema;

