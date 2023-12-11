import React, { useRef,useEffect, useState } from "react";
import './Alimentacion.css'; // Import the CSS file for styling
import { getData ,saveData,editData,removeData } from "../../../services/mongodbService"
import {numberToMounth} from "../../../services/formatService"
import deleteIcon from '../../../assets/deleteIcon.png';
import editIcon from '../../../assets/editIcon.png';
import addDateIcon from '../../../assets/addDateIconWhite.png';
import FormAlimentacion from "../../formRegistro/FormAlimentacion";
import FormNewDate from "../../formSeguimiento/FormNewDate";
import FormPreciosAli from "../../formRegistro/FormPreciosAli";
import CustomConfirmDialog from '../../customDialogs/CustomConfirmDialog';

function Alimentacion ()  {
    const [alimetacionData, setAlimentacionData] = useState([]);
    const [alimetacionPrecioData, setalimetacionPrecioData] = useState([]);
    const [dateSelected, setDateSelected] = useState(getCurrentDate());
    const [isFormNewDateOpen, setisFormNewDateOpen] = useState(false);
    const [isFormAlimentacionOpen, setIsFormAlimentacionOpen] = useState(false);
    const [isFormEditPrecioOpen, setFormEditPrecioOpen] = useState(false);
    const componenteRef = useRef(null);
    const [reload, setReload] = useState(true);
    const [editBody,setEditBody] = useState({fecha :"null"})
    const [alimentacionaSelected,setAlimentacionaSelected] = useState({})
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    
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
            setIsFormAlimentacionOpen(false);
            setisFormNewDateOpen(false);
            setFormEditPrecioOpen(false);
          }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);


    const alimentacionFitered = alimetacionData.filter((data) => {
        const dateMaches = data.fecha.includes(dateSelected.slice(-7));
        return dateMaches;
      });
    const getAlimentosPrecio = alimetacionPrecioData.find((data) => {
      const dateMached = data.fecha ===dateSelected.slice(-7);
      return dateMached;
    });
    useEffect(() => {
        async function getDataTable() {
            try {
                const result = await getData("Registro/Alimentacion"); 
                const result2 = await getData("Registro/AlimentacionPrecio"); 
                if(result === null)
                    setAlimentacionData([]);
                else{
                    setAlimentacionData(result);
                    setalimetacionPrecioData(result2);
                }   
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataTable();
        setReload(false);
    }, [alimetacionData.length, reload]);

    const pickDate = async (date) => {
        setisFormNewDateOpen(false);
        setDateSelected (date)
      };
    async function newAlimentacion(body){
        setIsFormAlimentacionOpen(false);
        if(alimentacionFitered.length===0){
          await createPreciosForThisDate();
        } 
        try {
          await saveData("Registro/Alimentacion",body); 
          setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }
    async function createPreciosForThisDate(){
      let body = {fecha:dateSelected.slice(-7), desayuno:8, almuerzo:12,cena:8 }
      if(alimetacionPrecioData.length>0){
        body.desayuno = alimetacionPrecioData[alimetacionPrecioData.length-1].desayuno;
        body.almuerzo = alimetacionPrecioData[alimetacionPrecioData.length-1].almuerzo;
        body.cena = alimetacionPrecioData[alimetacionPrecioData.length-1].cena;
      }  
      try {
        await saveData("Registro/AlimentacionPrecio",body); 
      } catch (error) {
          console.error('Error fetching data:', error);
      }
    }
    async function removeAlmentosPrecio(){
      let index = alimetacionPrecioData.findIndex(ali => ali.fecha === dateSelected.slice(-7) )
      try {
        await removeData("Registro/AlimentacionPrecio",alimetacionPrecioData[index]._id); 
      } catch (error) {
          console.error('Error fetching data:', error);
      }
    }

    async function editAlimentacionById(body){
        setIsFormAlimentacionOpen(false);
        let id = body._id;
        delete body._id;
        try {
            await editData("Registro/Alimentacion",body,id); 
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    async function removeAlimentacionById(id){
        if(alimentacionFitered.length===1)
          await removeAlmentosPrecio();
        try {
            await removeData("Registro/Alimentacion",id); 
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    async function savePrecios(body){
        setFormEditPrecioOpen(false);
        let id = body._id;
        delete body._id;
        try {
            await editData("Registro/AlimentacionPrecio",body,id); 
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleOpenConfirmDialog = (alimentacion) => {
      setAlimentacionaSelected(alimentacion);
      setIsConfirmDialogOpen(true);
    };

    const handleConfirm = async () => {
        await removeAlimentacionById(alimentacionaSelected._id)
        setIsConfirmDialogOpen(false);
    };

    const handleCancel = () => {
        setIsConfirmDialogOpen(false);
    };
    

  return (
    <div>
        <div className="container_deFiltrosAlmacen"> 
            <button className="button_Registro" style={{width:130}} onClick={()=>{setEditBody({fecha :"null"}); setIsFormAlimentacionOpen(true); }} >Agregar datos</button>
            {alimentacionFitered.length>0 &&
              <button className="button_Registro" style={{width:130}} onClick={()=>{setFormEditPrecioOpen(true); }} >Cambiar Precios</button>
            }
            <img className= "icon2" style={{marginLeft:30}} alt="AddDate" src={addDateIcon} onClick={() =>setisFormNewDateOpen(true)}/>
            <div className="FilterDate_forRegistro">
                {numberToMounth(dateSelected.slice(-2))} de {dateSelected.slice(0,4)}
            </div>
        </div> 
        <div  className="tabla-container" style={{paddingTop:0}}>       
                <table className="tabla">
                    <thead>
                      {alimentacionFitered.length>0
                        ?<tr>
                          <th>Fecha</th>
                          <th>Desayuno ({getAlimentosPrecio.desayuno } bs)</th>
                          <th>Almuerzo ({getAlimentosPrecio.almuerzo } bs)</th>
                          <th>Cena ({getAlimentosPrecio.cena } bs)</th>
                          <th>Acciones</th>
                        </tr>
                        :<tr>
                          <th>Fecha</th>
                          <th>Desayuno</th>
                          <th>Almuerzo</th>
                          <th>Cena</th>
                          <th>Acciones</th>
                        </tr>
                      }

                    </thead>               
                    <tbody>
                    {   alimentacionFitered.map(data =>
                        <tr key ={data._id} >
                            <td>{data.fecha}</td>
                            <td>{data.desayuno}</td>
                            <td>{data.almuerzo}</td>
                            <td>{data.cena}</td>
                            <td>
                                <div className="container_Iconos">
                                    <img className= "icon" style={{marginRight:10}} alt="deleteData" src={deleteIcon} onClick={()=>handleOpenConfirmDialog(data)} />
                                    <img className= "icon" alt="editData" src={editIcon} onClick={ ()=> {setEditBody(data);setIsFormAlimentacionOpen(true); } } />
                                </div>
                            </td>
                        </tr>
                        )
                }
                    </tbody>
                </table>
            </div>

            {isFormAlimentacionOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormAlimentacion editBody={editBody} nextDay ={getNextDay(alimetacionData,dateSelected )} date={dateSelected} newAlimentacion = {newAlimentacion} editAlimentacionById={editAlimentacionById} /></div></div>
            )}
            {isFormNewDateOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormNewDate pickDate={pickDate} actualDate={dateSelected}/></div></div>
            )}
            {isFormEditPrecioOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormPreciosAli preciosBody={getAlimentosPrecio} savePrecios={savePrecios} /></div></div>
            )}
            {isConfirmDialogOpen && (<div className="overlay"><div ref={componenteRef}> 
                <CustomConfirmDialog
                message= {"¿Borrar el registro con fecha: " + alimentacionaSelected.fecha +"?"}
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
  
export default Alimentacion;