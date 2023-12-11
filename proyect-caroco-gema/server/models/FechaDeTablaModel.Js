const mongoose = require("mongoose");

const fechaSchema = mongoose.Schema(
  { 
    fecha: {
      type: String,
      required: [true, "Agrega una fecha"],
    },
    
  }
);

module.exports = mongoose.model("FechaDeTabla", fechaSchema);

