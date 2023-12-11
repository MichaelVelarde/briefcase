const mongoose = require("mongoose");

const maquinaSchema = mongoose.Schema(
  { 
    nombre: {
      type: String,
      required: [true, "Agrega un nombre unico para identificar a la maquina"],
    },
    costo: {
      type: Number,
      required: [true, "Agrega un valor a precio"],
    },
    propiedades: {
        type: String,
        required: [true, "Agrega las propiedades de la maquina"],
    },
    mantenimiento: {
        type: String,
        required: [true, "Agrega una para programar un mantenimiento"],
    },
    repuestos: {
        type: [{_id: String, nombre : String}],
        required: [true, "Agrega los repuestos de la maquina"],
    }
  }
);

module.exports = mongoose.model("Maquinaria", maquinaSchema);

