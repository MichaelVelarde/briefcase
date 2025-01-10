import React, {  useState }from 'react';
import logoImage from '../../assets/logoTypica.jpg';
import menuIcon from '../../assets/iconSideMenu.png';
import ventaIcon from '../../assets/ventaIcon.png';
import invenIcon from '../../assets/inventarioIcon.png';
import clientesIcon from '../../assets/clientesIcon.png';
import resumenIcon from '../../assets/resumenIcon.png';
import { Link } from 'react-router-dom';
import './Dashboard.scss'; // Import the CSS file for styling
//import configIcon from '../../assets/configIcon.png';


const Dashboard = ({ isMinimized, toggleMenu }) => {
  const [paginaSelected, setPaginaSelected] = useState("Ventas");


  return (
    <div className={`side-menu ${isMinimized ? 'minimized' : ''}`}>
      <div className="menu-header">
        {!isMinimized &&
            <img src={logoImage} alt="Logo" className='LogoTypica' />
        }
        <button onClick={toggleMenu} className="toggle-button">
          <img src={menuIcon} alt="iconMenu" className='iconMenu'/>
        </button>
      </div>
        <Link  onClick={()=>setPaginaSelected("Ventas")} to="/venta"
         className={`menu-item link-reset ${paginaSelected === 'Ventas' ? 'selected' : ''}`}>
          <img src={ventaIcon} alt="iconMenu" className='icon'/>
          {!isMinimized &&
            <div className="module">Punto de venta</div>
          }
        </Link>
        <Link onClick={()=>setPaginaSelected("Almacen")} to="/Almacen" 
        className={`menu-item link-reset ${paginaSelected === 'Almacen' ? 'selected' : ''}`}>
          <img src={invenIcon} alt="iconMenu" className='icon'/>
          {!isMinimized &&
            <div className="module">Almacen</div>
          } 
        </Link>
        <Link onClick={()=>setPaginaSelected("Contactos")} to="/contactos"  
        className={`menu-item link-reset ${paginaSelected === 'Contactos' ? 'selected' : ''}`}>
        <img src={clientesIcon} alt="iconMenu" className='icon'/>
        {!isMinimized &&
          <div className="module">Contactos</div>
        }
      </Link>
      <Link onClick={()=>setPaginaSelected("resumenVenta")}  to="/resumenVenta"
      className={`menu-item link-reset ${paginaSelected === 'resumenVenta' ? 'selected' : ''}`}>
        <img src={resumenIcon} alt="iconMenu" className='icon'/>
        {!isMinimized &&
          <div className="module">Resumen ventas</div>
        }
      </Link>
    </div>    
  );
};  
/* footer for late maybe
<div className="menu-footer">
        <Link onClick={()=>setPaginaSelected("Administrar")} 
         className={`menu-item link-reset ${paginaSelected === 'Administrar' ? 'selected' : ''}`}>
          <img src={configIcon} alt="iconMenu" className='icon'/>
          <div className="module">Administrar</div>
        </Link>
      </div>
*/
export default Dashboard; 