import React, { useState} from "react";
import Almacen from "./modulos/Almacen";
import Maquinaria from "./modulos/Maquinaria";
import Personal from "./modulos/Personal";
import './Registro.css'; 
import Alimentacion from "./modulos/Alimentacion";
import GastoGeneral from "./modulos/GastosGenerales";
import Ventas from "./modulos/Ventas";

const Registro = () => { 
  const [registroSelected, setRegistroSelected] = useState('Almacen');
    
  return (
    <div className='body'>
      <ul className="ul2">
        {registroSelected === "Almacen"
            ? <li  className="registroActual" >Almacen</li>
            : <li onClick={()=>setRegistroSelected("Almacen")}>Almacen</li>
        }
        {registroSelected === "Maquina"
            ? <li  className="registroActual" >Maquinaria</li>
            : <li onClick={()=>setRegistroSelected("Maquina")}>Maquinaria</li>
        }
        {registroSelected === "Personal"
            ? <li  className="registroActual" >Personal</li>
            : <li onClick={()=>setRegistroSelected("Personal")}>Personal</li>
        }
        {registroSelected === "Alimentacion"
            ? <li  className="registroActual" >Alimentacion</li>
            : <li onClick={()=>setRegistroSelected("Alimentacion")}>Alimentacion</li>
        }
        {registroSelected === "GastosGenerales"
            ? <li  className="registroActual" >Gastos Generales</li>
            : <li onClick={()=>setRegistroSelected("GastosGenerales")}>Gastos Generales</li>
        }
        {registroSelected === "Ventas"
            ? <li  className="registroActual" >Ventas</li>
            : <li onClick={()=>setRegistroSelected("Ventas")}>Ventas</li>
        }
        
      </ul>  
      
      {registroSelected === "Almacen" && 
          <Almacen />
        }
      {registroSelected === "Maquina" && 
        <Maquinaria />
      }
      {registroSelected === "Personal" && 
        <Personal />
      }
      {registroSelected === "Alimentacion" && 
        <Alimentacion />
      }
      {registroSelected === "GastosGenerales" && 
        <GastoGeneral />
      }
      {registroSelected === "Ventas" && 
        <Ventas />
      }
      
    </div>
  );
};
  
export default Registro;