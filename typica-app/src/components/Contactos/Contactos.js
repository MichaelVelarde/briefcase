import React, { useState} from "react";
import Cliente from "./modulos/Cliente.js";
import Empleado from "./modulos/Empleado.js"; 

const Contactos = () => { 
  const [moduloSelected, setmoduloSelected] = useState('Cliente');
    
  return (
    <div>
      <div className='body'>
        <ul className="ul2">
          {moduloSelected === "Cliente"
              ? <li  className="registroActual" >Clientes</li>
              : <li onClick={()=>setmoduloSelected("Cliente")}>Clientes</li>
          }
          {moduloSelected === "Empleados"
              ? <li  className="registroActual" >Empleados</li>
              : <li onClick={()=>setmoduloSelected("Empleados")}>Empleados</li>
          }
        </ul>  
        {moduloSelected === "Cliente" && 
            <Cliente />
        } 
        {moduloSelected === "Empleados" && 
            <Empleado />
        }      
      </div>
    </div>
  );
};
  
export default Contactos;