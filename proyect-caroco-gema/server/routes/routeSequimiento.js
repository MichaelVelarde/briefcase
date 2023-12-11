const express = require("express");
const mongoose = require("mongoose");
const tablaSchema = require("../models/seguimiento/SeguimientoModel");

const asyncHandler = require("express-async-handler");

const router = express.Router();

// This section will help you get a list of all the records.
router.route("/:colection").get(asyncHandler(async (req, res) => {
  const data = await getAll(req.params.colection);
  res.status(200).json(data);
}));

router.route("/:colection").post(asyncHandler(async (req, res) => {
  const bodyData = req.body;
  try {
    // Validar el cuerpo de la solicitud con respecto al esquema
    const newData = createData(req.params.colection,bodyData);
    await newData.validate();

    // Los datos son válidos, puedes guardarlos en la base de datos
    const result = await newData.save();

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

router.route("/:colection/:id").get(asyncHandler(async (req, res) => {
  const result = await searchById(req.params.colection,req.params.id);
  if (!result) {
    res.status(404);
    throw new Error("Data not found");
  }
  res.status(200).json(result);
}))

router.route("/:colection/:id").put(
  asyncHandler(async (req, res) => {
    const result = await searchById(req.params.colection,req.params.id);
    if (!result) {
      res.status(404);
      throw new Error("Contact not found");
    }
    const updateResult = await updateById (req.params.colection,req.params.id ,req.body );

    res.status(200).json(updateResult);
  })
)
router.route("/:colection/:id").delete(
  asyncHandler(async (req, res) => {
    const data = await searchById(req.params.colection,req.params.id);
    if (!data) {
      res.status(404);
      throw new Error("Contact not found");
    }
    await deleteById(req.params.colection,req.params.id);
    res.status(200).json(data);
  })
)

async function  getAll(collention ){
  try {
    const nuevoModelo = mongoose.model(collention, tablaSchema);
    return await nuevoModelo.find({});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al guardar el documento: ' + error.message);
  }
}

function createData(collention, body){
  const nuevoModelo = mongoose.model(collention, tablaSchema);
  return new nuevoModelo(body);
}

async function  searchById(collention , id){
  const nuevoModelo = mongoose.model(collention, tablaSchema);
  return await nuevoModelo.findById(id);
}

async function  updateById(collention , id , body){
  const nuevoModelo = mongoose.model(collention, tablaSchema);
  return await nuevoModelo.findByIdAndUpdate( id, body);
}
async function  deleteById(collention , id){
  const nuevoModelo = mongoose.model(collention, tablaSchema);
  return await nuevoModelo.deleteOne({ _id: id });
}

module.exports = router;