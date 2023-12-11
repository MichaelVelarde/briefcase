import React, { useRef,useEffect, useState } from "react";
import './Almacen.css'; // Import the CSS file for styling
import { getData,removeData,updateByIdAnValue , editData, saveData } from "../../../services/mongodbService"
import { formatNumber,numberToMounth} from "../../../services/formatService"
import deleteIcon from '../../../assets/deleteIcon.png';
import editIcon from '../../../assets/editIcon.png';
import addDateIcon from '../../../assets/addDateIconWhite.png';
import FormNewDate from "../../formSeguimiento/FormNewDate";
import FormVenta from "../../formRegistro/FormVenta";
import Compradores from "./Compradores";
import CustomConfirmDialog from '../../customDialogs/CustomConfirmDialog';

function Ventas ()  {
    const [ventasData, setventasData] = useState([]);
    const [isFormNewDateOpen, setisFormNewDateOpen] = useState(false);
    const [isFromNewVentaOpen, setisFromNewVentaOpen] = useState(false);
    const [showCompradores, setShowCompradores] = useState(false);
    const [dateSelected, setDateSelected] = useState(getCurrentDate());
    const componenteRef = useRef(null);
    const [reload, setReload] = useState(true);
    const [editBody,setEditBody] = useState({fecha :"null"})
    const [ventaSelected,setventaSelected] = useState({})
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const ventaFiltered = ventasData.filter((data) => {
        const dateMaches = data.fecha.includes(dateSelected.slice(-7));
        return dateMaches;
    });

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const formattedDate = `${year}-${month}`;
        
        return formattedDate;
    }
    useEffect(() => {
        function handleClickOutside(event) {
          if (componenteRef.current && !componenteRef.current.contains(event.target)) {
            setisFormNewDateOpen(false);
            setisFromNewVentaOpen(false);
          }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    useEffect(() => {
        async function getDataTable() {
            try {
                const result = await getData("Registro/Venta"); 
                if(result === null)
                    setventasData([]);
                else{
                    setventasData(result);
                }   
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataTable();
        setReload(false)
    }, [ventasData.length,reload]);
    
    async function removeVentaById(body){
        try {
            await updateByIdAnValue("Registro/Almacen",body.mineral._id,body.cantidad); 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        try {
            await removeData("Registro/Venta",body._id); 
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    async function newVenta(body){
        setisFromNewVentaOpen(false);
        try {
            await updateByIdAnValue("Registro/Almacen",body.mineral._id,-body.cantidad); 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        try {
          await saveData("Registro/Venta",body); 
          setReload(true);      
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }
    function changeToVentas(){
      setShowCompradores(false);
    }
    async function editVentaById(body){
        setisFromNewVentaOpen(false);
        let id = body._id;
        delete body._id;
        try {
            await editData("Registro/Venta",body,id); 
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const pickDate = async (date) => {
        setisFormNewDateOpen(false);
        setDateSelected (date)
    };
    const handleOpenConfirmDialog = (personal) => {
        setventaSelected(personal);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirm = async () => {
        await removeVentaById(ventaSelected)
        setIsConfirmDialogOpen(false);
    };

    const handleCancel = () => {
        setIsConfirmDialogOpen(false);
    };

  return (
    <div>
        {!showCompradores &&
        <div>   
          <div className="container_deFiltrosAlmacen"> 
          <button className="button_Registro"  onClick={()=>{setEditBody({fecha :"null"}); setisFromNewVentaOpen(true); }}>Nueva Venta</button>
          <button className="button_Registro" onClick={()=> setShowCompradores(true)} >Clientes</button>
          <img className= "icon2" style={{marginLeft:10}} alt="AddDate" src={addDateIcon} onClick={() =>setisFormNewDateOpen(true)}/>
              <div className="FilterDate_forRegistro">
                  {numberToMounth(dateSelected.slice(-2))} de {dateSelected.slice(0,4)}
              </div>
          </div> 
          <div  className="tabla-container" style={{padding:0}}>       
                  <table className="tabla">
                      <thead>
                      <tr>
                          <th>Fecha</th>
                          <th>Cliente</th>
                          <th>Mineral</th>
                          <th>Cantidad</th>
                          <th>Precio</th>
                          <th>Total (bs)</th>
                          <th>Acciones</th>
                      </tr>
                      </thead>               
                      <tbody>
                      {   ventaFiltered.map(data =>
                          <tr key ={data._id} >
                              <td>{data.fecha}</td>
                              <td>{data.comprador.nombre}</td>
                              <td>{data.mineral.nombre}</td>
                              <td>{formatNumber(data.cantidad)}</td>
                              <td>{formatNumber(data.precioUnitario)}</td>
                              <td>{formatNumber(data.precioUnitario*data.cantidad)}</td>
                              <td>
                                  <div className="container_Iconos">
                                      <img className= "icon" style={{marginRight:10}} alt="deleteData" src={deleteIcon} onClick={()=>handleOpenConfirmDialog(data)}/>
                                      <img className= "icon" alt="editData" src={editIcon} onClick={()=>{setEditBody(data); setisFromNewVentaOpen(true); }} />
                                  </div>
                              </td>
                          </tr>
                          )
                  }
                      </tbody>
                  </table>
              </div>
            </div>}
            {isFormNewDateOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormNewDate pickDate={pickDate} actualDate={dateSelected} /></div></div>
            )}
            {isFromNewVentaOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormVenta editBody={editBody} nextDay ={getNextDay(ventasData,dateSelected)} date={dateSelected} newVenta = {newVenta} editVentaById={editVentaById} /></div></div>
            )}
             {showCompradores &&
             <Compradores changeToVentas={changeToVentas}/>}
             {isConfirmDialogOpen && (<div className="overlay"><div ref={componenteRef}> 
                <CustomConfirmDialog
                message= {"Borrar la venta con fecha: " + ventaSelected.fecha +"?"}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                /></div></div>
            )}
    </div>
  );
};
function getNextDay(tableData,date) {
    let dateMaches = tableData.filter((data) => {
        return data.fecha.includes(date)
      });
    if(dateMaches.length>0){
        return 1+Number(dateMaches[dateMaches.length-1].fecha.slice(-2));
    }
    return 1;
}
export default Ventas;