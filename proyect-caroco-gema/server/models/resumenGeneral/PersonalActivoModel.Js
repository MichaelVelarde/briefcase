const mongoose = require("mongoose");

const personalActivoSchema = mongoose.Schema(
  { _id: {
        type: String,
        required: [true, "Agrega la fecha de venta"],
    },
    personal: {
      type: [{_id: String , activo : Boolean}],
      required: [true, "agrega el arreglo de items"],
    },
  }
);

module.exports = mongoose.model("PersonalActivo", personalActivoSchema);

