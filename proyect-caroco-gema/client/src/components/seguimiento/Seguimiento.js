import React, { useState,useEffect,useRef} from "react";
import TablaA from "../tablasSeguimiento/TablaA";
import './Seguimiento.css'; // Import the CSS file for styling
import FormProceso from "../formSeguimiento/FormProceso";
import FormNewDate from "../formSeguimiento/FormNewDate";
import addTabletIcon from '../../assets/addTableIcon.png';
import addDateIcon from '../../assets/addDateIcon.png';
import deleteIcon from '../../assets/deleteIcon.png';
import { saveData,getData,removeData } from "../../services/mongodbService"
import { numberToMounth } from "../../services/formatService"
import CustomConfirmDialog from '../customDialogs/CustomConfirmDialog';

const Seguimiento = () => { 
    const [reload, setReload] = useState(true);
    const [processSelected, setProcessSelected] = useState('vacio');
    const [dateSelected, setDateSelected] = useState(getCurrentDate());
    const [tablasProceso, setTablasProceso] = useState([]);
    const [isFormProcesoOpen, setIsFormProcesoOpen] = useState(false);
    const [isFormNewDateOpen, setisFormNewDateOpen] = useState(false);
    const [isConfirmDialogOpen2, setIsConfirmDialogOpen2] = useState(false);
    const componenteRef = useRef(null);

    function getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); 
      const formattedDate = `${year}-${month}`;
    
      return formattedDate;
    }

    const newProceso = async (body) => {
      setIsFormProcesoOpen(false);
      try {
        await saveData("TablasProceso",body); 
        setReload(true);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
    };
    const pickDate = async (date) => {
      setisFormNewDateOpen(false);
      setDateSelected (date)
    };

  const handleOpenConfirmDialog2 = () => {
    setIsConfirmDialogOpen2(true);
  };

  const handleConfirm2 = async () => {
      let key = tablasProceso.find( date => date.nombre === processSelected)._id;
      await removeData("TablasProceso", key)
      setIsConfirmDialogOpen2(false);
      setReload(true);
  };

  const handleCancel2 = () => {
      setIsConfirmDialogOpen2(false);
  };
    useEffect(() => {
      async function getProcesosData() {
        try {
            const result = await getData("TablasProceso");
            if(result === null)
                setTablasProceso([]);
            else{
                setTablasProceso(result);
                setProcessSelected(result[result.length-1].nombre)
            }   
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }
      getProcesosData();
      setReload(false);
    }, [reload ]);



    useEffect(() => {
      function handleClickOutside(event) {
        if (componenteRef.current && !componenteRef.current.contains(event.target)) {
          setIsFormProcesoOpen(false);
          setisFormNewDateOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
    

  return (
    <div className='body'>
        <div className='multi-menu'>
              <img className= "icon2"  alt="addAProces" src={addTabletIcon} onClick={() =>setIsFormProcesoOpen(true)}/>
              <img className= "icon2" alt="deleteProcess" src={deleteIcon} onClick={() =>handleOpenConfirmDialog2()}/>
              <div className ="box">
                  <select  value={processSelected} onChange={(e)=> setProcessSelected(e.target.value)}>
                        {tablasProceso.length>0
                          ? <>{   tablasProceso.map( proceso=>
                                <option key={proceso.nombre} value={proceso.nombre}> {proceso.nombre}</option>
                          )}</>
                          :  <option key="Tabla Vacia" value="vacio"> Agrega un proceso</option>
                        }
                  </select>
              </div>
          
            
                <img className= "icon2" style={{marginLeft:30}} alt="AddDate" src={addDateIcon} onClick={() =>setisFormNewDateOpen(true)}/>
                <p style={{padding:0 , margin:0}}>
                       {numberToMounth(dateSelected.slice(-2))} de {dateSelected.slice(0,4)}
                </p>  
        </div>
        {isFormProcesoOpen && (<div className="overlay"><div ref={componenteRef}> 
          <FormProceso newProceso={newProceso} /></div></div>
        )}
        {isFormNewDateOpen && (<div className="overlay"><div ref={componenteRef}> 
          <FormNewDate pickDate={pickDate} actualDate={dateSelected}/></div></div>
        )}

        {isConfirmDialogOpen2 && (<div className="overlay"><div ref={componenteRef}> 
        <CustomConfirmDialog
          message= {"¿Seguro que desea borrar el proceso "+processSelected+"?"}
          onConfirm={handleConfirm2}
          onCancel={handleCancel2}
        /></div></div>
        )}
        
        
        {tablasProceso.length>0 &&
            <TablaA value={tablasProceso.find(proceso => proceso.nombre === processSelected)} date={dateSelected} />
         }
         
    </div>
  );
};  

export default Seguimiento;