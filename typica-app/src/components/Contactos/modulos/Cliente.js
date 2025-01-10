import React, { useRef,useEffect, useState } from "react";
import {getData,saveData,editData,deleteData} from '../../../services/firebaseDB/FirebaseService.js';
import FromClient from '../../formularios/FromClient.js';
import CustomConfirmDialog from '../../customMessage/CustomConfirmDialog.js';
import iconDelete from '../../../assets/iconDelete.png';
import iconEdit from '../../../assets/iconEdit.png';

import '../../Tabla.scss'

function Cliente ()  {
    const [clientesData, setclientesData] = useState([]);
    const [selectedClient, setSelectedClient] = useState({nombre:"",nit:"",telefono:""});
    const [filter, setFilter] = useState('');
    const [isFormClientOpen, setIsFormClientOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const componenteRef = useRef(null);

    useEffect(() => {
      async function getClientesData() {
        const result = await getData("clientes");
        if(result === null)
          setclientesData([]);
        else
          setclientesData(result);
      }
      getClientesData();
    }, []);
    
    useEffect(() => {
        function handleClickOutside(event) {
          if (componenteRef.current && !componenteRef.current.contains(event.target)) {
            setIsFormClientOpen(false);
            setIsConfirmDialogOpen(false);
          }
        }
          document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    async function saveNewClient(client){
        setIsFormClientOpen(false);
        const idNewClient = await saveData("clientes", client)
        const newClientes = [...clientesData]
        newClientes.push({...client , id : idNewClient})
        setclientesData(newClientes)
    }

    async function editClientById(client){
      setIsFormClientOpen(false);
      let clienteCopy = { ...client };  
      delete clienteCopy.id;
      const indexClient =  clientesData.findIndex(c=> c.id === client.id);
      clientesData[indexClient] = client;
      setclientesData(clientesData);
      editData("clientes", client.id , clienteCopy);
    }

    async function deleteClient(){
      setIsConfirmDialogOpen(false);
      const index = clientesData.findIndex(client => client.id === selectedClient.id)
      clientesData.splice(index,1)
      deleteData("clientes",selectedClient.id)
      setclientesData(clientesData);
    }

    function cancelDeleteClient(){
      setIsConfirmDialogOpen(false);
    }

    const clientesfiltrados = clientesData.filter((item) => {
        const nombreMaches = item.nombre.toLowerCase().includes(filter.toLowerCase());
        return nombreMaches;
    });

  return (
    <div className="body_for_Tables">
            <div className="containerFiltros"> 
                <button onClick={()=> {setSelectedClient({nombre:"",nit:"",telefono:""}); setIsFormClientOpen(true)}} className="button_Registro" style={{width:150}} >Nuevo cliente</button>
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
                        <th>Nit</th>
                        <th>Nombre</th>
                        <th>Telefono</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   clientesfiltrados.map(data =>
                        <tr key ={data.id} >
                            <td>{data.nit}</td>
                            <td>{data.nombre}</td>
                            <td>{data.telefono}</td>
                            <td style={{ width: 150 }}>
                                <div className="container_Iconos">
                                  <img src={iconEdit} alt="iconAddClient" className='icon' 
                                  onClick={()=> {setSelectedClient(data);setIsFormClientOpen(true);}}/>

                                  <img src={iconDelete} alt="iconAddClient" className='icon' 
                                  onClick={()=> {setSelectedClient(data); setIsConfirmDialogOpen(true);}}/>
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
                message= {"¿Confirma borrar el cliente '" + selectedClient.nombre +"'?"}
                onConfirm={deleteClient}
                onCancel={cancelDeleteClient}
                /></div></div>
            )}

            {isFormClientOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FromClient
                saveNewClient= {saveNewClient}
                editClientById= {editClientById} 
                clientBody = {selectedClient}
                /></div></div>
            )}
    </div>
  );
};

  
export default Cliente;