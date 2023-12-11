
const express = require("express");
const mongoose = require("mongoose");
const almacenSchema = require("../models/registro/AlmacenModel.Js");
const comprasSchema = require("../models/registro/ComprasAlmacenModel.Js");
const AlimentacionSchema = require("../models/registro/AlimentacionModel.Js");
const AlimentacionPreciosSchema = require("../models/registro/AlimentacionPreciosModel.Js");
const compradorVentaSchema = require("../models/registro/VentaCompradorModel.Js");
const GastoGeneralSchema = require("../models/registro/GastoGeneralModel.Js");
const maquinariaSchema = require("../models/registro/MaquinariaModel.Js");
const personalSchema = require("../models/registro/PersonalModel.Js");
const ventaSchema = require("../models/registro/VentaModel.Js");
const proveedorSchema = require("../models/registro/ProveedorModel.Js");
const mantenimientoSchema = require("../models/registro/MantenimientoModel.Js");


const asyncHandler = require("express-async-handler");

const router = express.Router();

// This section will help you get a list of all the records.
router.route("/:db").get(asyncHandler(async (req, res) => {
  try {
    const result =await getAllData(req.params.db)
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
  }
}));

router.route("/:db").post(asyncHandler(async (req, res) => {
  const bodyData = req.body;
  try {
    const result = await createNewData(req.params.db, bodyData);
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

router.route("/:db/:id").get(asyncHandler(async (req, res) => {
  const result = await getById(req.params.db, req.params.id);
  if (!result) {
    res.status(404);
    throw new Error("Data not found");
  }
  res.status(200).json(result);
}))

router.route("/Almacen/:id/:value").put(
    asyncHandler(async (req, res) => {  
      const filtro = { _id : req.params.id}
      const update = { $inc: { cantidad: req.params.value } }
      const updateResult = await almacenSchema.updateOne(filtro, update);
      res.status(200).json(updateResult);
    })
  )
  
router.route("/:db/:id").put(
  asyncHandler(async (req, res) => {
    const result = await getById(req.params.db, req.params.id);
    if (!result) {
      res.status(404);
      throw new Error("Contact not found");
    }
    const updateResult = await updateById(req.params.db,req.params.id,req.body);

    res.status(200).json(updateResult);
  })
)
router.route("/:db/:id").delete(
  asyncHandler(async (req, res) => {
    const data =  getById(req.params.db, req.params.id);
    if (!data) {
      res.status(404);
      throw new Error("Contact not found");
    }
    await deleteOneById(req.params.db, req.params.id);
    res.status(200).json(data);
  })
)

async function getAllData(collection){
    switch (collection) {
        case "Almacen":
            return await almacenSchema.find();
        case "ComprasAlmacen":
            return await comprasSchema.find();
        case "Alimentacion":
            return await AlimentacionSchema.find();
        case "AlimentacionPrecio":
            return await AlimentacionPreciosSchema.find();
        case "CompradorVenta":
            return await compradorVentaSchema.find();
        case "GastoGeneral":
            return await GastoGeneralSchema.find();
        case "Maquinaria":
            return await maquinariaSchema.find();
        case "Mantenimiento":
            return await mantenimientoSchema.find();
        case "Personal":
            return await personalSchema.find();
        case "Venta":
            return await ventaSchema.find();
        case "Proveedor":
            return await proveedorSchema.find();
        default:
            return null;
    }
}
async function createNewData(collection, body){

    switch (collection) {
        case "Almacen":
            return await almacenSchema.create(body);
        case "ComprasAlmacen":
            return await comprasSchema.create(body);
        case "Alimentacion":
            return await AlimentacionSchema.create(body);
        case "AlimentacionPrecio":
            return await AlimentacionPreciosSchema.create(body);
        case "CompradorVenta":
            return await compradorVentaSchema.create(body);
        case "GastoGeneral":
            return await GastoGeneralSchema.create(body);
        case "Maquinaria":
            return await maquinariaSchema.create(body);
        case "Mantenimiento":
            return await mantenimientoSchema.create(body);
        case "Personal":
            return await personalSchema.create(body);
        case "Venta":
            return await ventaSchema.create(body);
        case "Proveedor":
            return await proveedorSchema.create(body);
        default:
            return null;
    }
}
async function getById(collection, id){
    switch (collection) {
        case "Almacen":
            return await almacenSchema.findById(id);
        case "ComprasAlmacen":
            return await comprasSchema.findById(id);
        case "Alimentacion":
            return await AlimentacionSchema.findById(id);
        case "AlimentacionPrecio":
            return await AlimentacionPreciosSchema.findById(id);
        case "CompradorVenta":
            return await compradorVentaSchema.findById(id);
        case "GastoGeneral":
            return await GastoGeneralSchema.findById(id);
        case "Maquinaria":
            return await maquinariaSchema.findById(id);
        case "Mantenimiento":
            return await mantenimientoSchema.findById(id);
        case "Personal":
            return await personalSchema.findById(id);
        case "Venta":
            return await ventaSchema.findById(id);
        case "Proveedor":
            return await proveedorSchema.findById(id);
        default:
            return null;
    }
}
async function updateById(collection, id, body){
    switch (collection) {
        case "Almacen":
            return await almacenSchema.findByIdAndUpdate(id,body);
        case "ComprasAlmacen":
            return await comprasSchema.findByIdAndUpdate(id,body);
        case "Alimentacion":
            return await AlimentacionSchema.findByIdAndUpdate(id,body);
        case "AlimentacionPrecio":
            return await AlimentacionPreciosSchema.findByIdAndUpdate(id,body);
        case "CompradorVenta":
            return await compradorVentaSchema.findByIdAndUpdate(id,body);
        case "GastoGeneral":
            return await GastoGeneralSchema.findByIdAndUpdate(id,body);
        case "Maquinaria":
            return await maquinariaSchema.findByIdAndUpdate(id,body);
        case "Mantenimiento":
            return await mantenimientoSchema.findByIdAndUpdate(id,body);
        case "Personal":
            return await personalSchema.findByIdAndUpdate(id,body);
        case "Venta":
            return await ventaSchema.findByIdAndUpdate(id,body);
        case "Proveedor":
            return await proveedorSchema.findByIdAndUpdate(id,body);
        default:
            return null;
    }
}
async function deleteOneById(collection, id){
    switch (collection) {
        case "Almacen":
            return await almacenSchema.deleteOne({ _id: id });
        case "ComprasAlmacen":
            return await comprasSchema.deleteOne({ _id: id });
        case "Alimentacion":
            return await AlimentacionSchema.deleteOne({ _id: id });
        case "AlimentacionPrecio":
            return await AlimentacionPreciosSchema.deleteOne({ _id: id });
        case "CompradorVenta":
            return await compradorVentaSchema.deleteOne({ _id: id });
        case "GastoGeneral":
            return await GastoGeneralSchema.deleteOne({ _id: id });
        case "Maquinaria":
            return await maquinariaSchema.deleteOne({ _id: id });
        case "Mantenimiento":
            return await mantenimientoSchema.deleteOne({ _id: id });
        case "Personal":
            return await personalSchema.deleteOne({ _id: id });
        case "Venta":
            return await ventaSchema.deleteOne({ _id: id });
        case "Proveedor":
            return await proveedorSchema.deleteOne({ _id: id });
        default:
            return null;
    }
}
module.exports = router;