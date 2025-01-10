import React, { useRef,useEffect, useState} from "react";
import {getData,saveData,editData, incrementValue,decrementValue,deleteItemAndRes} from '../../../services/firebaseDB/FirebaseService.js';
import FormInventario from '../../formularios/FormInventario.js';
import CustomConfirmDialog from '../../customMessage/CustomConfirmDialog.js';
import RegistroInven from './RegistroInven.js'
import iconDelete from '../../../assets/iconDelete.png';
import iconEdit from '../../../assets/iconEdit.png';
import iconChangeStorage from '../../../assets/iconChangeStorage.png';
import FormInOutStorage from '../../formularios/FormInOutStorage.js'


function Inventario ()  {
    const [showRegistro, setShowRegistro] = useState(false);
    const [itemsData, setitemsData] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedItem, setSelectItem] = useState({nombre:"",unidad:"",cantidad:0});
    const [isFormItemOpen, setIsFormItemOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isFormInOutStorageOpen, setIsFormInOutStorageOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const componenteRef = useRef(null);


    useEffect(() => {
        function handleClickOutside(event) {
          if (componenteRef.current && !componenteRef.current.contains(event.target)) {
            setIsFormItemOpen(false);
            setIsConfirmDialogOpen(false);
            setIsFormInOutStorageOpen(false);
          }
        }
          document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    useEffect(() => {
      async function getInventarioData() {
        const result = await getData("inventario");
        if(result === null)
          setitemsData([]);
        else
          setitemsData(result);
      }
      getInventarioData();
    }, [reload]);

    async function saveNewItem(item){
      setIsFormItemOpen(false);
      const idNewProduct = await saveData("inventario", item)
      const newItems = [...itemsData]
      newItems.push({...item , id : idNewProduct})
      setitemsData(newItems)
    }
    
    async function editItemById(item){
      setIsFormItemOpen(false);
      let itemCopy = { ...item };  
      delete itemCopy.id;
      const indexProduct =  itemsData.findIndex(i=> i.id === item.id);
      itemsData[indexProduct] = item;
      setitemsData(itemsData)
      editData("inventario", item.id , itemCopy)

    }

    async function deleteItem(){
      setIsConfirmDialogOpen(false);
      const index = itemsData.findIndex(item => item.id === selectedItem.id)
      itemsData.splice(index,1)
      await deleteItemAndRes("inventario","entSalInventario",selectedItem.id)
      setitemsData(itemsData);
    }

    function cancelDeleteItem(){
      setIsConfirmDialogOpen(false);
    }

    async function changeQuantity(body) {
      setIsFormInOutStorageOpen(false);
      const index = itemsData.findIndex(product => product.id === body.idP)
      if(body.isEntrada){
        itemsData[index].cantidad +=body.cantidad;
        incrementValue("inventario",body.idP, "cantidad", body.cantidad)
      }
      else{
        itemsData[index].cantidad -=body.cantidad;
        decrementValue("inventario",body.idP, "cantidad", body.cantidad)
      }    
      saveData("entSalInventario", body)
    }

    function backToInventario(){
      setShowRegistro(false);
      setReload(!reload);
    }

    const itemsFiltered = itemsData.filter((item) => {
        const nombreMaches = item.nombre.toLowerCase().includes(filter.toLowerCase());
        return nombreMaches;
      });

  return (
    <div>
    {!showRegistro &&
    <div className="body_for_Tables">
            <div className="containerFiltros"> 
                <button className="button_Registro" style={{width:150}} 
                        onClick={()=> setShowRegistro(true)}>Ver S/E Inventario</button>
                <button className="button_Registro" style={{width:150}} 
                        onClick={()=>{setSelectItem({nombre:"",unidad:"vacio",cantidad:0}); setIsFormItemOpen(true); }}>Nuevo item</button>
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
                        <th>Unidad</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   itemsFiltered.map(data =>
                        <tr key ={data.id} >
                            <td>{data.nombre}</td>
                            <td>{data.unidad}</td>
                            <td>{data.cantidad}</td>
                            <td style={{ width: 200 }}>
                              <div className="container_Iconos">
                                  <img src={iconChangeStorage} alt="iconChangeCant" className='icon' 
                                  onClick={()=> {setSelectItem(data); setIsFormInOutStorageOpen(true);}}/>
                                
                                  <img src={iconEdit} alt="iconAddClient" className='icon' 
                                  onClick={()=> {setSelectItem(data); setIsFormItemOpen(true); }}/>

                                  <img src={iconDelete} alt="iconAddClient" className='icon' 
                                  onClick={()=> {setSelectItem(data); setIsConfirmDialogOpen(true)}}/>
                              </div>
                            </td>
                        </tr>
                        )
                }
                    </tbody>
                </table>
            </div>
            {isFormInOutStorageOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormInOutStorage
                changeQuantity={changeQuantity}
                body={selectedItem}
                /></div></div>
            )}
            
            {isConfirmDialogOpen && (<div className="overlay"><div ref={componenteRef}> 
                <CustomConfirmDialog
                message= {"¿Confirma borrar el item '" + selectedItem.nombre +"'?"}
                onConfirm={deleteItem}
                onCancel={cancelDeleteItem}
                /></div></div>
            )}
            {isFormItemOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormInventario
                saveNewItem= {saveNewItem}
                editItemById= {editItemById} 
                itemBody = {selectedItem}
                /></div></div>
            )}  
      </div>
    }
    {showRegistro &&
      <RegistroInven backToInventario={backToInventario}/>
    }
    </div>
  );
};

export default Inventario;