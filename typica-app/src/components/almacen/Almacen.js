import React, { useState} from "react";
import Inventario from "./modulos/Inventario.js";
import Productos from "./modulos/Productos.js";
import './Almacen.scss'; 

const Almacen = () => { 
  const [moduloSelected, setmoduloSelected] = useState('Inventario');
    
  return (
    <div>
      <div className='body'>
        <ul className="ul2">
          {moduloSelected === "Inventario"
              ? <li  className="registroActual" >Inventario</li>
              : <li onClick={()=>setmoduloSelected("Inventario")}>Inventario</li>
          }
          {moduloSelected === "Productos"
              ? <li  className="registroActual" >Productos</li>
              : <li onClick={()=>setmoduloSelected("Productos")}>Productos</li>
          }
        </ul>  
        {moduloSelected === "Inventario" && 
            <Inventario />
        } 
        {moduloSelected === "Productos" && 
            <Productos />
        }      
      </div>
    </div>
  );
};
  
export default Almacen;