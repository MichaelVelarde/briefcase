import React, { useRef,useEffect, useState } from "react";
import './Almacen.css'; // Import the CSS file for styling
import { getData,saveData,editData,removeData } from "../../../services/mongodbService"
import deleteIcon from '../../../assets/deleteIcon.png';
import editIcon from '../../../assets/editIcon.png';
import FormProveedor from "../../formRegistro/FormProveedor";

function Proveedores ({changeToAlmacen})  {
    const [ProveedorData, setProveedorData] = useState([]);
    const [filter, setFilter] = useState('');
    const [isFormProveedorOpen, setIsFormProveedorOpen] = useState(false);
    const [editBody,setEditBody] = useState({nombre :""})
    const [reload, setReload] = useState(true);
    const componenteRef = useRef(null);

    const ProveedorFiltered = ProveedorData.filter((item) => {
        const nombreMaches = item.nombre.toLowerCase().includes(filter.toLowerCase());
        return nombreMaches;
      });
      useEffect(() => {
          function handleClickOutside(event) {
            if (componenteRef.current && !componenteRef.current.contains(event.target)) {
                setIsFormProveedorOpen(false);
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
                const result = await getData("Registro/Proveedor"); // Replace with your endpoint
                if(result === null)
                    setProveedorData([]);
                else{
                    setProveedorData(result);
                }   
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataTable();
        setReload(false);
    }, [ProveedorData.length,reload]);

    async function newProveedor(body){
        setIsFormProveedorOpen(false);
        try {
          await saveData("Registro/Proveedor",body); 
          setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }
    async function editProveedorById(body){
        setIsFormProveedorOpen(false);
        try {
            await editData("Registro/Proveedor",body,body._id);
            setReload(true);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    async function removeProveedorById(id){
        try {
            await removeData("Registro/Proveedor",id);
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

  return (
    <div>
            <div className="container_deFiltrosAlmacen"> 
                <button className="button_Registro" style={{width:150}} onClick={()=>{setEditBody({nombre :""});setIsFormProveedorOpen(true); }} >Nuevo proveedor</button>
                <button className="button_Registro" onClick={()=> changeToAlmacen()}  >Almacen</button>
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
                        <th>Telefono</th>
                        <th>Dirección</th>
                        <th>Comentario</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   ProveedorFiltered.map(data =>
                        <tr key ={data._id} >
                            <td>{data.nombre}</td>
                            <td>{data.telefono}</td>
                            <td>{data.direccion}</td>
                            <td>{data.comentario}</td>
                            <td>
                                <div className="container_Iconos">
                                    <img className= "icon" style={{marginRight:10}} alt="deleteData" src={deleteIcon} onClick={()=>removeProveedorById(data._id)} />
                                    <img className= "icon" alt="editData" src={editIcon}  onClick={ ()=> {setEditBody(data);setIsFormProveedorOpen(true); } } />
                                </div>
                            </td>
                        </tr>
                        )
                }
                    </tbody>
                </table>
            </div>
            {isFormProveedorOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormProveedor newProveedor = {newProveedor} editBody={editBody} editProveedorById={editProveedorById} /></div></div>
            )}

            
    </div>
  );
};

  
export default Proveedores;