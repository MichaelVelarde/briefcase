import React, { useRef,useEffect, useState } from "react";
import './Almacen.css'; // Import the CSS file for styling
import { getData,removeData,updateByIdAnValue } from "../../../services/mongodbService"
import {formatNumber } from "../../../services/formatService"
import deleteIcon from '../../../assets/deleteIcon.png';
import CustomConfirmDialog from '../../customDialogs/CustomConfirmDialog';

function ComprasAlmacen ({changeToAlmacen})  {
    const [almacenData, setAlmacenData] = useState([]);
    const [comprasData, setcomprasData] = useState([]);
    const [filter, setFilter] = useState('');
    const [reload, setReload] = useState(true);
    const [itemSelected,setItemSelected] = useState({})
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isConfirmDialogOpen2, setIsConfirmDialogOpen2] = useState(false);
    const componenteRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
          if (componenteRef.current && !componenteRef.current.contains(event.target)) {
            setIsConfirmDialogOpen(false);
            setIsConfirmDialogOpen2(false);
          }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    const comprasFiltered = comprasData.filter((compra) => {
        const nombreMaches = compra.item.nombre.toLowerCase().includes(filter.toLowerCase());
        return nombreMaches;
      });
    useEffect(() => {
        async function getComprasTable() {
            try {
                const almacen = await getData("Registro/Almacen"); 
                const result = await getData("Registro/ComprasAlmacen"); // Replace with your endpoint
                if(result !== null){
                    setAlmacenData(almacen);
                    setcomprasData(result.reverse());
                } 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getComprasTable();
        setReload(false);
    }, [comprasData.length,reload]);


    const handleOpenConfirmDialog = (item) => {
        let cantErase = false;
        let index = almacenData.findIndex( data => data._id === item.item._id)
        if(almacenData[index].cantidad < item.cantidad ){
            setItemSelected(item.item);
            cantErase = true;
        }
        if(!cantErase){
            setItemSelected(item);
            setIsConfirmDialogOpen(true);
        }   
        else
            setIsConfirmDialogOpen2(true);

        
    };

    const handleConfirm = async () => {
        await removeCompraById(itemSelected)
        setIsConfirmDialogOpen(false);
    };

    const handleCancel = () => {
        setIsConfirmDialogOpen(false);
        setIsConfirmDialogOpen2(false);
    };

    async function removeCompraById(compra){
        try {
            await updateByIdAnValue("Registro/Almacen",compra.item._id,-compra.cantidad); 
          } catch (error) {
              console.error('Error fetching data:', error);
          }
        try {
            await removeData("Registro/ComprasAlmacen",compra._id);
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        
    }

  return (
    <div>
            <div className="container_deFiltrosAlmacen"> 
                <button className="button_Registro"  onClick={()=>{ changeToAlmacen()}} >Almacen</button>
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
                        <th>Fecha</th>
                        <th>Item</th>
                        <th>Proveedor</th>
                        <th>Cantidad</th>
                        <th>Precio(bs)</th>
                        <th>Total(bs)</th>
                        <th>Borrar</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   comprasFiltered.map(data =>
                        <tr key ={data._id} >
                            <td>{data.fecha}</td>
                            <td>{data.item.nombre}</td>
                            <td>{data.proveedor.nombre}</td>
                            <td>{formatNumber(data.cantidad)}</td>
                            <td>{formatNumber(data.precio)}</td>
                            <td>{formatNumber(data.precio*data.cantidad)}</td>
                            <td>
                             <img className= "icon" alt="deleteData" src={deleteIcon} onClick={ ()=> {handleOpenConfirmDialog(data); } }/>
                            </td>
                        </tr>
                        )
                }
                    </tbody>
                </table>
            </div>
            {isConfirmDialogOpen2 && (<div className="overlay"><div ref={componenteRef}> 
                <CustomConfirmDialog
                message= {"Insuficiente cantidad de '"+itemSelected.nombre+"' para borrar la compra."}
                onCancel={handleCancel}
                /></div></div>
            )}
            {isConfirmDialogOpen && (<div className="overlay"><div ref={componenteRef}> 
                <CustomConfirmDialog
                message= {"¿Borrar la compra de " + itemSelected.item.nombre +"?"}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                /></div></div>
            )}
    </div>
  );
};

  
export default ComprasAlmacen;