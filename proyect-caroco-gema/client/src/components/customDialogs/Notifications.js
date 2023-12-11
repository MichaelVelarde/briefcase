import React from 'react';
import iconLowCantidad from '../../assets/iconItemCantLow.png';
import iconRepair from '../../assets/iconRepair.png'
import "./Notifications.css"

const Notifications = ({ arrayItems,arrayMante, close}) => {
  return (
    <div className="container_Alters">
     <div className="Form_Title">Alertas</div>
      {arrayItems.map( element =>
        <div className='line_alert' key={element._id}>
            <img className= "icon_alert" alt="iconLowCantidad" src={iconLowCantidad}  />
            <div className='container_TitleAndComent'> 
               <div className='text_title_Alert'> Cantidad baja de '{element.nombre}'</div>
               <div className='text_desc_Alert'> Cantidad actual : {element.cantidad} </div>
            </div>
        </div>
      )
      }
      {arrayMante.map( element =>
        <div className='line_alert' key={element._id}>
            <img className= "icon_alert" alt="iconRepair" src={iconRepair}  />
            <div className='container_TitleAndComent'> 
               <div className='text_title_Alert'> Hacer mantenimiento a '{element.nombre}'</div>
               <div className='text_desc_Alert'> Fecha mantenimiento : {element.mantenimiento} </div>
            </div>
        </div>
      )
      }
      <div className='buttons_container'>
        {close &&
          <button  onClick={close}>Cerrar</button>
        }
      </div>
    </div>
  );
};

export default Notifications;