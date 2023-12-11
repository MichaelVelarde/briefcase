const mongoose = require("mongoose");

const mantenimientoSchema = mongoose.Schema(
  { 
    maquina: {
      type: String,
      required: [true, "Agrega el nombre de la maquina"],
    },
    fecha: {
      type: String,
      required: [true, "Agrega la fecha del mantenimiento"],
    },
    repuestos: {
        type: [{_id: String, nombre: String, cantidad: Number}],
        required: [true, "Agrega los repuestos"],
    },
  }
);

module.exports = mongoose.model("Mantenimiento", mantenimientoSchema);

