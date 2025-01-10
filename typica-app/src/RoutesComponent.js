import React, {  useState }from 'react';
// We use Route in order to define the different routes of our application
import {Route, Routes } from "react-router-dom";
 
// Pages imports
import Dashboard from "./components/dashboard/Dashboard.js"
import Venta from "./components/ventas/Venta.js"
import CobrarComandas from "./components/ventas/CobrarComandas.js"
import Contactos from "./components/Contactos/Contactos.js"
import Almacen from "./components/almacen/Almacen.js"
import ResumenVenta from "./components/resumen/ResumenVenta.js"
import "./App.scss"

 
const RouteComponent = () => {
    const [isMinimized, setIsMinimized] = useState(true);

    const handleToggle = () => {
        setIsMinimized(!isMinimized);
    };
  

 return (   
      <div className="app-container">
        <Dashboard isMinimized={isMinimized} toggleMenu={handleToggle} />
        <div className={`main-content ${isMinimized ? 'minimized' : ''}`}>
          <Routes>
            <Route path="/venta" element={<Venta />} />
            <Route path="/contactos" element={<Contactos />} />
            <Route path="/almacen" element={<Almacen />} />
            <Route path="/resumenVenta" element={<ResumenVenta />} />
            <Route path="/cobrarComanda" element={<CobrarComandas />} />
            <Route path="/*" element={<Venta />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
 );
};
 
export default RouteComponent;