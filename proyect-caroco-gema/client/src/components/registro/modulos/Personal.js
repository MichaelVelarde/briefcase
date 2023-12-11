import React, { useRef,useEffect, useState } from "react";
import './Almacen.css'; // Import the CSS file for styling
import { getData,saveData,editData,removeData } from "../../../services/mongodbService"
import { formatNumber} from "../../../services/formatService"
import deleteIcon from '../../../assets/deleteIcon.png';
import editIcon from '../../../assets/editIcon.png';
import FormPersonal from "../../formRegistro/FormPersonal";
import CustomConfirmDialog from '../../customDialogs/CustomConfirmDialog';

function Personal ()  {
    const [personalData, setPersonalData] = useState([]);
    const [filter, setFilter] = useState('');
    const [isFormPersonalOpen, setIsFormPersonalOpen] = useState(false);
    const [editBody,setEditBody] = useState({nombre :""})
    const [reload, setReload] = useState(true);
    const componenteRef = useRef(null);
    const [personalaSelected,setPersonalaSelected] = useState({})
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const personalFiltered = personalData.filter((item) => {
        const nombreMaches = item.nombre.toLowerCase().includes(filter.toLowerCase());
        return nombreMaches;
      });
    
      
  
      useEffect(() => {
          function handleClickOutside(event) {
            if (componenteRef.current && !componenteRef.current.contains(event.target)) {
                setIsFormPersonalOpen(false);
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
                const result = await getData("Registro/Personal"); // Replace with your endpoint
                if(result !== null)
                    setPersonalData(result);
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataTable();
        setReload(false);
    }, [personalData.length,reload]);

    async function newEmpleado(body){
        setIsFormPersonalOpen(false);
        try {
          await saveData("Registro/Personal",body); 
          setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }
    async function editEmpleadoById(body){
        setIsFormPersonalOpen(false);
        try {
            await editData("Registro/Personal",body,body._id);
            setReload(true);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    async function removeEmpleadoById(id){
        try {
            await removeData("Registro/Personal",id);
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleOpenConfirmDialog = (personal) => {
        setPersonalaSelected(personal);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirm = async () => {
        await removeEmpleadoById(personalaSelected._id)
        setIsConfirmDialogOpen(false);
    };

    const handleCancel = () => {
        setIsConfirmDialogOpen(false);
    };

  return (
    <div>
            <div className="container_deFiltrosAlmacen"> 
                <button className="button_Registro" style={{width:150}} onClick={()=>{setEditBody({nombre :""});setIsFormPersonalOpen(true); }} >Nuevo empleado</button>
                <div className="flter_withLbael">
                    Filtrar:  
                    <input 
                    className='filter_box'
                    type="text"
                    value={filter}
                    onChange={event => setFilter(event.target.value)}
                    placeholder="...nombre"
                    />
                </div>
            </div>
        
        <div  className="tabla-container" style={{paddingTop:0}}>       
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>C.I.</th>
                        <th>Nombre</th>
                        <th>Telefono</th>
                        <th>Cargo</th>
                        <th>Salario(bs)</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   personalFiltered.map(data =>
                        <tr key ={data._id} >
                            <td>{data.ci}</td>
                            <td>{data.nombre}</td>
                            <td>{data.telefono}</td>
                            <td>{data.cargo}</td>
                            <td>{formatNumber(data.salario)}</td>
                            <td>
                                <div className="container_Iconos">
                                    <img className= "icon" style={{marginRight:10}} alt="deleteData" src={deleteIcon} onClick={()=>handleOpenConfirmDialog(data)} />
                                    <img className= "icon" alt="editData" src={editIcon}  onClick={ ()=> {setEditBody(data);setIsFormPersonalOpen(true); } } />
                                </div>
                            </td>
                        </tr>
                        )
                }
                    </tbody>
                </table>
            </div>

            {isFormPersonalOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormPersonal newEmpleado = {newEmpleado} editBody={editBody} editEmpleadoById={editEmpleadoById} /></div></div>
            )}
            {isConfirmDialogOpen && (<div className="overlay"><div ref={componenteRef}> 
                <CustomConfirmDialog
                message= {"¿Borrar " + personalaSelected.nombre +"?"}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                /></div></div>
            )}
    </div>
  );
};

  
export default Personal;