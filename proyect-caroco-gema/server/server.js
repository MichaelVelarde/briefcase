const express = require("express");
const connectDb = require("./db/mongoDb");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require("cors");

connectDb();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
//Resumen general
app.use("/api/Resumen/PersonalActivo", require("./routes/resumenGeneral/routePersonalActivo"));
app.use("/api/Resumen/Item", require("./routes/resumenGeneral/routeResumenItem"));
app.use("/api/Resumen/Maquinaria", require("./routes/resumenGeneral/routeResumenMaquinaria"));
app.use("/api/Resumen/Personal", require("./routes/resumenGeneral/routeResumenPersonal"));
//Registro
app.use("/api/Registro", require("./routes/routeRegistro"));
//Seguimiento
app.use("/api/FechaDeTabla", require("./routes/routeFechaDeTabla"));
app.use("/api/TablasProceso", require("./routes/routeTablasProceso"));
app.use("/api", require("./routes/routeSequimiento"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});