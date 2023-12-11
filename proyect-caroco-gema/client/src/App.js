import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Dashboard from "./components/dashboard/Dashboard";
import Seguimiento from "./components/seguimiento/Seguimiento";
import Registro from "./components/registro/Registro";
import Resumen from "./components/resumenMensual/Resumen";
 
const App = () => {
 return (
   <div>
     <Dashboard/>
     <Routes>
       <Route path="/" element={<Seguimiento />} />
       <Route path="/Seguimiento" element={<Seguimiento />} />
       <Route path="/Registro" element={<Registro />} />
       <Route path="/ResumenMensual" element={<Resumen />} />
     </Routes>
   </div>
 );
};
 
export default App;