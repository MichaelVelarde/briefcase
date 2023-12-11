
const express = require("express");
const mongoose = require("mongoose");
const resumenPersonalSchema = require("../../models/resumenGeneral/ResumenPersonalModel.Js");

const asyncHandler = require("express-async-handler");

const router = express.Router();

// This section will help you get a list of all the records.
router.route("/").get(asyncHandler(async (req, res) => {
  try {
    const result =await resumenPersonalSchema.find();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
  }
}));

router.route("/").post(asyncHandler(async (req, res) => {
  const bodyData = req.body;
  try {
    const result = await resumenPersonalSchema.create(bodyData);
    res.status(201).json({result});
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Maneja errores de validación del esquema
      res.status(400).json({ error: 'Datos no válidos', details: error.message });
    } else {
      // Maneja otros errores, como errores al guardar en la base de datos
      res.status(500).json({ error: 'No se pudo guardar el usuario' });
    }
  }
}))

router.route("/:id").get(asyncHandler(async (req, res) => {
  const result = await resumenPersonalSchema.findById(req.params.id);
  if (!result) {
    res.status(404);
    throw new Error("Data not found");
  }
  res.status(200).json(result);
}))

router.route("/:id/:idPeronal/:horas").put(
    asyncHandler(async (req, res) => {  
      const filtro = { _id: req.params.id, 'personal._id': req.params.idPeronal };
      const update = { $inc: { "personal.$.horas": req.params.horas} }
      const updateResult = await resumenPersonalSchema.updateOne(filtro, update);
      res.status(200).json(updateResult);
    })
  )

router.route("/:id").put(
  asyncHandler(async (req, res) => {
    const result = await resumenPersonalSchema.findById(req.params.id);
    if (!result) {
      res.status(404);
      throw new Error("Contact not found");
    }
    const updateResult = await resumenPersonalSchema.findByIdAndUpdate(req.params.id,req.body)

    res.status(200).json(updateResult);
  })
)
router.route("/:id").delete(
  asyncHandler(async (req, res) => {
    const data = await resumenPersonalSchema.findById(req.params.id);
    if (!data) {
      res.status(404);
      throw new Error("Contact not found");
    }
    await resumenPersonalSchema.deleteOne({ _id: req.params.id });
    res.status(200).json(data);
  })
)

module.exports = router;