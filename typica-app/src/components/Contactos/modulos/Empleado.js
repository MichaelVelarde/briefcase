import React, { useRef, useEffect, useState } from "react";
import FormEmpleado from '../../formularios/FormEmpleado.js';
import {getData,saveData,editData,deleteData,getVendedorPorDefecto} from '../../../services/firebaseDB/FirebaseService.js';
import CustomConfirmDialog from '../../customMessage/CustomConfirmDialog.js';
import iconDelete from '../../../assets/iconDelete.png';
import iconEdit from '../../../assets/iconEdit.png';
import iconUserSet from '../../../assets/iconUserSet.png';
import iconUserNotSet from '../../../assets/iconUserNotSet.png';
import '../../Tabla.scss'


function Empleado ()  {
    
    const [empleadosData, setEmpleadosData] = useState([]);
    const [empleadoDefault,setEmpleadoDefault ] = useState({id:"empty"})
    const [filter, setFilter] = useState('');
    const [isFromEmpleadoOpen, setIsFromEmpleadoOpen] = useState(false);
    const [selectedEmpleado, setselectedEmpleado] = useState({nombre:"",ci:"",telefono:""});
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const componenteRef = useRef(null);

    useEffect(() => {
      async function getEmpleadosData() {
        const result = await getData("empleados");
        if(result === null)
          setEmpleadosData([]);
        else
          setEmpleadosData(result);
      }
      async function getEmpleadoDefault() {
        const result = await getVendedorPorDefecto();
        if(result !== null)
          setEmpleadoDefault(result)
      }
      getEmpleadoDefault();
      getEmpleadosData();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
          if (componenteRef.current && !componenteRef.current.contains(event.target)) {
            setIsFromEmpleadoOpen(false);
            setIsConfirmDialogOpen(false)
          }
        }
          document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    async function saveNewEmpleado(empleado){
        setIsFromEmpleadoOpen(false);
        const idNewEmpleado = await saveData("empleados", empleado)
        const newEmpleados = [...empleadosData];
        newEmpleados.push({...empleado , id : idNewEmpleado});
        setEmpleadosData(newEmpleados);
    }
    
    async function editEmpleadoById(empleado){
        setIsFromEmpleadoOpen(false);
        let empleadoCopy = { ...empleado };  
        delete empleadoCopy.id;
        const indexClient =  empleadosData.findIndex(e=> e.id === empleado.id);
        empleadosData[indexClient] = empleado;
        setEmpleadosData(empleadosData);
        editData("empleados", empleado.id , empleadoCopy);
    }

    async function deleteEmpleado(){
      setIsConfirmDialogOpen(false);
      const index = empleadosData.findIndex(empleado => empleado.id === selectedEmpleado.id)
      empleadosData.splice(index,1)
      deleteData("empleados",selectedEmpleado.id)
      setEmpleadosData(empleadosData);
    }

    async function cancelDeleteEmpleado(){
      setIsConfirmDialogOpen(false);
    }
    async function setEmpleadoAsDefault(empleado) {
      setEmpleadoDefault(empleado)
      editData("DatosEstaticos", "keyDefaultSeller" , empleado);
    }


    const empleadosfiltrados = empleadosData.filter((item) => {
        const nombreMaches = item.nombre.toLowerCase().includes(filter.toLowerCase());
        return nombreMaches;
      });

  return (
    <div className="body_for_Tables">
            <div className="containerFiltros"> 
                <button  onClick={()=>{ setselectedEmpleado({nombre:"",ci:"",telefono:""});setIsFromEmpleadoOpen(true) }}
                className="button_Registro" style={{width:150}} >Nuevo empleado</button>
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
                    <tr key="Empleados_headers">
                        <th>CI</th>
                        <th>Nombre</th>
                        <th>Telefono</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   empleadosfiltrados.map(data =>
                        <tr key ={data.id} >
                            <td>{data.ci}</td>
                            <td>{data.nombre}</td>
                            <td>{data.telefono}</td>
                            <td style={{ width: 150 }}>
                                <div className="container_Iconos">
                                  {empleadoDefault.id === data.id
                                    ? <img src={iconUserSet} alt="iconSelectedEmpleado" className='icon' />
                                    : <img src={iconUserNotSet} alt="iconAddClient" className='icon' 
                                    onClick={()=> {setEmpleadoAsDefault(data)}}/>
                                  }
                                  
                                  <img src={iconEdit} alt="iconAddClient" className='icon' 
                                  onClick={()=> {setselectedEmpleado(data);setIsFromEmpleadoOpen(true);}}/>

                                  <img src={iconDelete} alt="iconAddClient" className='icon' 
                                  onClick={()=> {setselectedEmpleado(data); setIsConfirmDialogOpen(true);}}/>
                                  
                                </div>
                            </td>
                        </tr>
                        )
                }
                    </tbody>
                </table>
            </div>
          {isConfirmDialogOpen && (<div className="overlay"><div ref={componenteRef}> 
              <CustomConfirmDialog
              message= {"¿Confirma borrar el empleado '" + selectedEmpleado.nombre +"'?"}
              onConfirm={deleteEmpleado}
              onCancel={cancelDeleteEmpleado}
              /></div></div>
          )}
          {isFromEmpleadoOpen && (<div className="overlay"><div ref={componenteRef}> 
            <FormEmpleado
            saveNewEmpleado= {saveNewEmpleado}
            editEmpleadoById= {editEmpleadoById} 
            empleadoBody = {selectedEmpleado}
            /></div></div>
          )}
    </div>
  );
};

  
export default Empleado;