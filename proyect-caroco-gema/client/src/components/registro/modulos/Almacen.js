import React, {useRef, useEffect, useState } from "react";
import './Almacen.css'; // Import the CSS file for styling
import { getData,saveData,editData,removeData,updateByIdAnValue} from "../../../services/mongodbService";
import {formatNumber} from "../../../services/formatService"
import FormAlmacen from "../../formRegistro/FormAlmacen";
import deleteIcon from '../../../assets/deleteIcon.png';
import editIcon from '../../../assets/editIcon.png';
import addToStorage from '../../../assets/addToStorage.png';
import Proveedores from "./Proveedores";
import FormComprarItem from "../../formRegistro/FormComprarItem";
import ComprasAlmacen from "./ComprasAlmacen";
import CustomConfirmDialog from '../../customDialogs/CustomConfirmDialog';

function Almacen ()  {
    const [almacenData, setalmacenData] = useState([]);
    const [filter, setFilter] = useState('');
    const [isFormAlmacenOpen, setIsFormAlmacenOpen] = useState(false);
    const [isFormRegistroOpen, setIsFormRegistroOpen] = useState(false);
    const componenteRef = useRef(null);
    const [reload, setReload] = useState(true);
    const [showProveedores, setShowProveedores] = useState(false);
    const [showCompras, setShowCompras] = useState(false);
    const [editBody,setEditBody] = useState({nombre :""})
    const [itemSelected,setItemSelected] = useState({})
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
          if (componenteRef.current && !componenteRef.current.contains(event.target)) {
            setIsFormAlmacenOpen(false);
            setIsFormRegistroOpen(false);
          }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    const almacenFiltered = almacenData.filter((item) => {
        const nombreMaches = item.nombre.toLowerCase().includes(filter.toLowerCase());
        return nombreMaches;
      });
    useEffect(() => {
        async function getDataTable() {
            try {
                const result = await getData("Registro/Almacen"); // Replace with your endpoint
                if(result !== null){
                    setalmacenData(result);
                }   
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataTable();
        setReload(false);
    }, [almacenData.length,reload]);
    
    async function newItem(body){
        setIsFormAlmacenOpen(false);
        try {
          await saveData("Registro/Almacen",body); 
          setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }
    async function editItemById(body){
        setIsFormAlmacenOpen(false);
        let id = body._id;
        delete body._id;
        try {
            await editData("Registro/Almacen",body,id); 
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    async function removeItemById(id){
        try {
            await removeData("Registro/Almacen",id); 
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    async function newRegistro(body){
        setIsFormRegistroOpen(false);
        try {
          await saveData("Registro/ComprasAlmacen",body); 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        try {
            await updateByIdAnValue("Registro/Almacen",body.item._id,body.cantidad); 
            setReload(true);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
    }

    function changeToAlmacen(){
        if(showCompras){
            setShowCompras(false);
            setReload(true);
        }
        else
            setShowProveedores(false);  
    }
    const handleOpenConfirmDialog = (item) => {
        setItemSelected(item);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirm = async () => {
        await removeItemById(itemSelected._id)
        setIsConfirmDialogOpen(false);
    };

    const handleCancel = () => {
        setIsConfirmDialogOpen(false);
    };

  return (
    <div>
        {(!showProveedores && !showCompras) && 
        <>
            <div className="container_deFiltrosAlmacen"> 
                <button className="button_Registro" onClick={()=>{setEditBody({nombre :""});setIsFormAlmacenOpen(true); }}>Nuevo item</button>
                <button className="button_Registro" style={{width:80}} onClick={()=>{ setShowCompras(true)}}>Compras</button>
                <button className="button_Registro" onClick={()=> setShowProveedores(true)} >Proveedores</button>
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
                            <th>Tipo</th>
                            <th>Cantidad</th>
                            <th>Unidad</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>               
                        <tbody>
                        {   almacenFiltered.map(data =>
                            <tr key ={data._id} >
                                <td>{data.nombre}</td>
                                <td>{data.tipo}</td>
                                {data.cantidad <= data.cantidadMinima 
                                    ?<td style={{color:"red"}}>{formatNumber(data.cantidad)}</td>
                                    :<td>{formatNumber(data.cantidad)}</td>
                                }
                                <td>{data.unidad}</td>
                                <td>
                                    <div className="container_Iconos">
                                        <img className= "icon" style={{marginRight:10}} alt="deleteData" src={deleteIcon} onClick={()=>handleOpenConfirmDialog(data)} />
                                        <img className= "icon" style={{marginRight:10}} alt="editData" src={editIcon} onClick={ ()=> {setEditBody(data);setIsFormAlmacenOpen(true); } } />
                                        <img className= "icon" alt="addCant" src={addToStorage} onClick={ ()=> {setItemSelected({_id:data._id , nombre : data.nombre});setIsFormRegistroOpen(true); } } />
                                    </div>
                                </td>
                            </tr>
                            )
                    }
                        </tbody>
                    </table>
                </div>
            </>
            }
            {showProveedores &&
             <Proveedores changeToAlmacen={changeToAlmacen}/>}
            {showCompras &&
             <ComprasAlmacen changeToAlmacen={changeToAlmacen}/>}
            {isFormAlmacenOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormAlmacen newItem = {newItem} editBody={editBody} editItemById={editItemById} /></div></div>
            )}
            {isFormRegistroOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormComprarItem newRegistro = {newRegistro} itemSelected={itemSelected} /></div></div>
            )}
            {isConfirmDialogOpen && (<div className="overlay"><div ref={componenteRef}> 
                <CustomConfirmDialog
                message= {"¿Borrar " + itemSelected.nombre +"?"}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                /></div></div>
            )}
            
    </div>
  );
};

  
export default Almacen;