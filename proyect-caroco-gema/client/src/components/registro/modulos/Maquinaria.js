import React, { useEffect, useState,useRef } from "react";
import FormMaquina from "../../formRegistro/FromMaquina"
import FormMantenimiento from "../../formRegistro/FormMantenimiento"
import { getData,removeData, editData, saveData } from "../../../services/mongodbService"
import { formatNumber  } from "../../../services/formatService"
import deleteIcon from '../../../assets/deleteIcon.png';
import editIcon from '../../../assets/editIcon.png';
import iconRepair from '../../../assets/iconRepair.png';
import CustomConfirmDialog from '../../customDialogs/CustomConfirmDialog';
import Mantenimiento from "./Mantenimiento";

function Maquinaria ()  {
    const [maquinariaData, setMaquinariaData] = useState([]);
    const [filter, setFilter] = useState('');
    const [reload, setReload] = useState(true);
    const componenteRef = useRef(null);
    const [isFormMaquinaOpen, setIsFormMaquinaOpen] = useState(false);
    const [editBody,setEditBody] = useState({nombre :""})
    const [maquinariaSelected,setMaquinariaSelected] = useState({})
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isFormMantenimientoOpen, setIsFormMantenimientoOpen] = useState(false);
    const [showMantenimiento, setShowMantenimiento] = useState(false);
    
    

    const maquinariaFiltered = maquinariaData.filter((maquina) => {
        const nombreMaches = maquina.nombre.toLowerCase().includes(filter.toLowerCase());
        return nombreMaches;
      });

    async function removeMaquinaById(id){
        try {
            await removeData("Registro/Maquinaria",id); 
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(() => {
        function handleClickOutside(event) {
          if (componenteRef.current && !componenteRef.current.contains(event.target)) {
            setIsFormMaquinaOpen(false);
            setIsFormMantenimientoOpen(false);
            setReload(true);
          }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getData("Registro/Maquinaria");
                if (result === null)
                setMaquinariaData([]);
                else {
                setMaquinariaData(result);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
        setReload(false);
    }, [maquinariaData.length, reload]);

    async function newMaquina(body){
        setIsFormMaquinaOpen(false);
        try {
          await saveData("Registro/Maquinaria",body); 
          setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }
    function changeToMaquinas(){
      setShowMantenimiento(false)
    }

    async function editMaquinaById(body){
        setIsFormMaquinaOpen(false);
        setIsFormMantenimientoOpen(false);
        let id = body._id;
        delete body._id;
        try {
            await editData("Registro/Maquinaria",body,id); 
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleOpenConfirmDialog = (maquina) => {
        setMaquinariaSelected(maquina);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirm = async () => {
        await removeMaquinaById(maquinariaSelected._id)
        setIsConfirmDialogOpen(false);
    };

    const handleCancel = () => {
        setIsConfirmDialogOpen(false);
    };

  return (
    <div>
         {!showMantenimiento && <>
            <div className="container_deFiltrosAlmacen">
                <button className="button_Registro" style={{width:150}} onClick={()=>{setEditBody({nombre :""});setIsFormMaquinaOpen(true); }}>Nueva maquina</button>
                <button className="button_Registro" style={{width:130}} onClick={()=>{setShowMantenimiento(true)}}>Mantenimientos</button>
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
                        <th>Nombre</th>
                        <th>Costo(bs)</th>
                        <th>Propiedades</th>
                        <th>Mantenimiento</th>
                        <th>Repuestos</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   maquinariaFiltered.map(data =>
                        <tr key ={data._id} >
                            <td>{data.nombre}</td>
                            <td>{formatNumber(data.costo)}</td>
                            <td>{data.propiedades}</td>
                            <td>{data.mantenimiento}</td>
                            <td>{data.repuestos.map(repuesto =>{
                                    if(data.repuestos[data.repuestos.length-1]._id !== repuesto._id)
                                        return repuesto.nombre +" , "
                                    return repuesto.nombre
                                })}</td>
                            <td>
                                <div className="container_Iconos">
                                    <img className= "icon" style={{marginRight:10}} alt="deleteData" src={deleteIcon} onClick={()=>handleOpenConfirmDialog(data)}/>
                                    <img className= "icon" style={{marginRight:10}}  alt="editData" src={editIcon} onClick={ ()=> {setEditBody(data); setIsFormMaquinaOpen(true); } } />
                                    <img className= "icon" style ={{width:26,height:26}}alt="iconRepair" src={iconRepair} onClick={ ()=> { setEditBody(data); setIsFormMantenimientoOpen(true);} } />
                                </div>
                            </td>
                        </tr>
                        )
                }
                    </tbody>
                </table>
            </div>
            </>}
            {isFormMaquinaOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormMaquina newMaquina = {newMaquina}  editMaquinaById={editMaquinaById} editBody={editBody} /></div></div>
            )}
            {isFormMantenimientoOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormMantenimiento  maquina={editBody} editMaquinaById={editMaquinaById} /></div></div>
            )}
            {isConfirmDialogOpen && (<div className="overlay"><div ref={componenteRef}> 
                <CustomConfirmDialog
                message= {"¿Borrar " + maquinariaSelected.nombre +"?"}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                /></div></div>
            )}
            {showMantenimiento &&
                <Mantenimiento changeToMaquinas={changeToMaquinas}/>}

        
    </div>
  );
};

  
export default Maquinaria;