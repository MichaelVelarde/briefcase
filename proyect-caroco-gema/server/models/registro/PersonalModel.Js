const mongoose = require("mongoose");

const personalSchema = mongoose.Schema(
  { ci: {
        type: Number,
        required: [true, "Agrega el valor del ci"],
    },
    telefono: {
        type: Number,
        required: [true, "Agrega un telefono"],
    },
    nombre: {
      type: String,
      required: [true, "Agrega un valor para nombre"],
    },
    cargo: {
      type: String,
      required: [true, "Agrega el cargo del empleado"],
    },
    salario: {
        type: Number,
        required: [true, "Agrega el valor del salario"],
    }
  }
);

module.exports = mongoose.model("Personal", personalSchema);

