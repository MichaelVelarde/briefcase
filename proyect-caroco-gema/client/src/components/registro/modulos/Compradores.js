import React, { useRef,useEffect, useState } from "react";
import './Almacen.css'; // Import the CSS file for styling
import { getData,removeData , editData, saveData } from "../../../services/mongodbService"
import deleteIcon from '../../../assets/deleteIcon.png';
import editIcon from '../../../assets/editIcon.png';
import FormComprador from "../../formRegistro/FormComprador";

function Compradores ({changeToVentas})  {
    const [compradorData, setCompradorData] = useState([]);
    const [isFormNewCompradorOpen, setIsFormNewCompradorOpen] = useState(false);
    const componenteRef = useRef(null);
    const [reload, setReload] = useState(true);
    const [editBody,setEditBody] = useState({nombre :""})

    useEffect(() => {
        function handleClickOutside(event) {
          if (componenteRef.current && !componenteRef.current.contains(event.target)) {
            setIsFormNewCompradorOpen(false);
          }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    useEffect(() => {
        async function getCompradoresTable() {
            try {
                const result = await getData("Registro/CompradorVenta"); 
                if(result === null)
                    setCompradorData([]);
                else{
                    setCompradorData(result);
                }   
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getCompradoresTable();
        setReload(false)
    }, [compradorData.length,reload]);
    
    async function removeCompradorById(id){
        try {
            await removeData("Registro/CompradorVenta",id); 
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    async function newComprador(body){
        setIsFormNewCompradorOpen(false);
        try {
          await saveData("Registro/CompradorVenta",body); 
          setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }
    async function editCompradorById(body){
        setIsFormNewCompradorOpen(false);
        let id = body._id;
        delete body._id;
        try {
            await editData("Registro/CompradorVenta",body,id); 
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
  return (
    <div>
        <div className="container_deFiltrosAlmacen"style={{height:40}}  > 
        <button className="button_Registro"  style={{width:150}} onClick={()=>{setEditBody({nombre :""}); setIsFormNewCompradorOpen(true); }}>Nuevo cliente</button>
        <button className="button_Registro" onClick={()=>changeToVentas()} >Ventas</button>
        </div> 
        { ( compradorData.length !==0) &&<div  className="tabla-container" style={{padding:0}}>       
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Telefono</th>
                        <th>Nombre</th>
                        <th>Nit</th>
                        <th>Direccion</th>
                        <th>Comentario</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   compradorData.map(data =>
                        <tr key ={data._id} >
                            <td>{data.telefono}</td>
                            <td>{data.nombre}</td>
                            <td>{data.nit}</td>
                            <td>{data.direccion}</td>
                            <td>{data.comentario}</td>
                            <td>
                                <div className="container_Iconos">
                                    <img className= "icon" style={{marginRight:10}} alt="deleteData" src={deleteIcon} onClick={()=>removeCompradorById(data._id)}/>
                                    <img className= "icon" alt="editData" src={editIcon} onClick={()=>{setEditBody(data); setIsFormNewCompradorOpen(true); }} />
                                </div>
                            </td>
                        </tr>
                        )
                }
                    </tbody>
                </table>
            </div>}
            {isFormNewCompradorOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormComprador newComprador = {newComprador} editBody={editBody} editCompradorById={editCompradorById} /></div></div>
            )}
    </div>
  );
};

export default Compradores;