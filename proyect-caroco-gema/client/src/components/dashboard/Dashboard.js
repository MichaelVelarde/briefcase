import React, { useRef,useEffect, useState }from 'react';
import { getData} from "../../services/mongodbService"
import logoImage from '../../assets/logoSinFondo.png';
import iconAlert from '../../assets/iconAlert.png';
import { NavLink ,useLocation  } from "react-router-dom";
import Notifications from "../customDialogs/Notifications"
import './Dashboard.css'; // Import the CSS file for styling

const Dashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [reload, setReload] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [alertaItems, setAlertaItems] = useState([]);
  const [alertasMante, setAlertasMante] = useState([]);
  const componenteRef = useRef(null);

  function closeNotifications(){
    setShowNotifications(false);
  }
  useEffect(() => {
    function handleClickOutside(event) {
      if (componenteRef.current && !componenteRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); 
      const formattedDate = `${year}-${month}`;
      
      return formattedDate;
    }
    function getAlertas(almacen,maquinas){
      let today = getCurrentDate();
      let alertaItems= [];
      let alertaMante= [];
      almacen.forEach(element => {
        if(element.cantidad < element.cantidadMinima)
          alertaItems.push(element);
      });
      maquinas.forEach(element => {
        if(element.mantenimiento <= today)
          alertaMante.push(element);
      });
      setAlertaItems(alertaItems);
      setAlertasMante(alertaMante);
    }
    async function getDataTable() {
        try {
            const almacen = await getData("Registro/Almacen"); 
            const maquinas = await getData("Registro/Maquinaria"); 
            if(almacen !== null && maquinas != null)
                getAlertas(almacen,maquinas)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    getDataTable();
    setReload(false);
}, [reload]);

  return (
    <div>
      <div className="Dashboard_container">
        <div className="name_company">  
          <img src={logoImage} alt="Logo" className='LogoCaroco' />
        </div>
        <nav>
          <ul>
            { ( alertaItems.length>0 || alertasMante.length>0) &&
              <img src={iconAlert} alt="alerta" className='icon_Alert'onClick={()=>{setReload(true); setShowNotifications(true)}} />
            }
            {currentPath ==='/Seguimiento' || currentPath ==='/' 
              ?<li  className='border' >Seguimiento</li>
              :<li><NavLink to="/Seguimiento">Seguimiento</NavLink></li>
            }
            {currentPath ==='/Registro' 
              ?<li  className='border' >Registro</li>
              :<li><NavLink to="/Registro">Registro</NavLink></li>
            }
            {currentPath ==='/ResumenMensual' 
              ?<li  className='border' >Resumen Mensual</li>
              :<li><NavLink to="/ResumenMensual">Resumen Mensual</NavLink></li>
            }

          </ul>
        </nav>
      </div>
      {showNotifications && (<div className="overlay"><div ref={componenteRef}> 
        <Notifications  arrayItems= {alertaItems}  arrayMante= {alertasMante} close ={closeNotifications}  /></div></div>
            )}


    </div>
  );
};  

export default Dashboard;