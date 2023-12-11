import React, { useRef,useEffect, useState } from "react";
import './Almacen.css'; // Import the CSS file for styling
import { getData,removeData,editData,saveData} from "../../../services/mongodbService"
import { formatNumber,numberToMounth} from "../../../services/formatService"
import deleteIcon from '../../../assets/deleteIcon.png';
import editIcon from '../../../assets/editIcon.png';
import addDateIcon from '../../../assets/addDateIconWhite.png'
import FormNewDate from "../../formSeguimiento/FormNewDate";
import FormGastoGeneral from "../../formRegistro/FormGastoGeneral";
import CustomConfirmDialog from '../../customDialogs/CustomConfirmDialog';

function GastoGeneral ()  {
    const [gastoGeneralData, setgastoGeneralData] = useState([]);
    const [isFormNewDateOpen, setisFormNewDateOpen] = useState(false);
    const [isFromNewGastoGeneralOpen, setIsFromNewGastoGeneralOpen] = useState(false);
    const [dateSelected, setDateSelected] = useState(getCurrentDate());
    const componenteRef = useRef(null);
    const [reload, setReload] = useState(true);
    const [editBody,setEditBody] = useState({fecha :"null"})
    const [gastoGeneralSelected,setGastoGeneralSelected] = useState({})
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const gastoFiltered = gastoGeneralData.filter((data) => {
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
            setIsFromNewGastoGeneralOpen(false);
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
                const result = await getData("Registro/GastoGeneral"); 
                if(result === null)
                    setgastoGeneralData([]);
                else{
                    setgastoGeneralData(result);
                }   
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataTable();
        setReload(false)
    }, [gastoGeneralData.length,reload]);

    async function removeGastoById(id){
        try {
            await removeData("Registro/GastoGeneral",id); 
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    async function newGastoGeneral(body){
        setIsFromNewGastoGeneralOpen(false);
        try {
          await saveData("Registro/GastoGeneral",body); 
          setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }
    async function editGastoGeneralById(body){
        setIsFromNewGastoGeneralOpen(false);
        let id = body._id;
        delete body._id;
        try {
            await editData("Registro/GastoGeneral",body,id); 
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const pickDate = async (date) => {
        setisFormNewDateOpen(false);
        setDateSelected (date)
      };
    const handleOpenConfirmDialog = (gastoGeneral) => {
        setGastoGeneralSelected(gastoGeneral);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirm = async () => {
        await removeGastoById(gastoGeneralSelected._id)
        setIsConfirmDialogOpen(false);
    };

    const handleCancel = () => {
        setIsConfirmDialogOpen(false);
    };
  return (
    <div>
        <div className="container_deFiltrosAlmacen"> 
            <button className="button_Registro" style={{width:130}} onClick={()=>{setEditBody({fecha :"null"}); setIsFromNewGastoGeneralOpen(true); }} >Nuevo gasto</button>
            <img className= "icon2" style={{marginLeft:30}} alt="AddDate" src={addDateIcon} onClick={() =>setisFormNewDateOpen(true)}/>
            <div className="FilterDate_forRegistro">
                {numberToMounth(dateSelected.slice(-2))} de {dateSelected.slice(0,4)}
            </div>
        </div> 
        <div  className="tabla-container" style={{paddingTop:0}}>       
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Detalle</th>
                        <th>Gasto (bs)</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   gastoFiltered.map(data =>
                        <tr key ={data._id} >
                            <td>{data.fecha}</td>
                            <td>{data.detalle}</td>
                            <td>{formatNumber(data.gasto)}</td>
                            <td>
                                <div className="container_Iconos">
                                    <img className= "icon" style={{marginRight:10}} alt="deleteData" src={deleteIcon} onClick={()=>handleOpenConfirmDialog(data)} />
                                    <img className= "icon" alt="editData" src={editIcon} onClick={ ()=> {setEditBody(data);setIsFromNewGastoGeneralOpen(true); } }/>
                                </div>
                            </td>
                        </tr>
                        )
                }
                    </tbody>
                </table>
            </div>
            {isFormNewDateOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormNewDate pickDate={pickDate} actualDate={dateSelected} /></div></div>
            )}
            {isFromNewGastoGeneralOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormGastoGeneral editBody={editBody} nextDay ={getNextDay(gastoGeneralData,dateSelected )} date={dateSelected} newGastoGeneral = {newGastoGeneral} editGastoGeneralById={editGastoGeneralById} /></div></div>
            )}
            {isConfirmDialogOpen && (<div className="overlay"><div ref={componenteRef}> 
                <CustomConfirmDialog
                message= {"¿Borrar el gasto general con fecha: " + gastoGeneralSelected.fecha +"?"}
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
  
export default GastoGeneral;