import React, {useRef, useEffect, useState } from "react";
import './Tabla.css'; // Import the CSS file for styling
import { getData , removeData, updateByIdAnValue } from "../../services/mongodbService"
import { formatNumber} from "../../services/formatService"
import CustomConfirmDialog from '../customDialogs/CustomConfirmDialog';
import FormSegui from "../formSeguimiento/FormSegui";
import deleteIcon from '../../assets/deleteIcon.png';

function TablaA (collection)  {
    const [almacenData, setAlmacenData] = useState([]);
    const [loading, setloading] = useState(true);
    const [tableData, setDataTable] = useState([]);
    const [reload, setReload] = useState(true);
    const [editDataSelect, setEditDataSelect] = useState({});
    const [dataSelect, setdataSelect] = useState({fecha:"0"});
    const [isConfirmDialogOpen2, setIsConfirmDialogOpen2] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isFormNewDataTableOpen, setIsFormNewDataTableOpen] = useState(false);
    
    const componenteRef = useRef(null);

    const tableFiltered = tableData.filter((data) => {
        const dateMaches = data.fecha.includes(collection.date);
        return dateMaches;
      });

    const handleOpenConfirmDialog = (obj) => {
        let cantErase = false;
        obj.mineralObtenido.forEach(mineral =>{
            let index = almacenData.findIndex( item => item._id === mineral._id)
            if(almacenData[index].cantidad < mineral.cant ){
                setdataSelect(mineral);
                cantErase = true;
            }
        })
        if(!cantErase){
            setdataSelect(obj);
            setIsConfirmDialogOpen(true);
        }   
        else
            setIsConfirmDialogOpen2(true);
    };

    const handleConfirm = async () => {
        if(dataSelect.personal)
            reduceHorasPersonal(dataSelect.personal);
        if(dataSelect.maquinaria)
            reduceHorasMaquinaria(dataSelect.maquinaria);
        if(dataSelect.mineralObtenido)
            reduceAlmacenMinerales(dataSelect.mineralObtenido);
        if(dataSelect.insumos)
            incrementAlmacenInsumos(dataSelect.insumos);
        await removeData(collection.value.nombre.replace(" ", ""), dataSelect._id)
        setIsConfirmDialogOpen(false);
        setReload(true);
    };
    async function reduceHorasMaquinaria(maquinaria){
        maquinaria.forEach( async maquina =>{
            await updateByIdAnValue("Resumen/Maquinaria/"+collection.date, maquina._id,-maquina.horas);
        })
    }
    async function reduceHorasPersonal(personal){
        personal.forEach( async per =>{
            await updateByIdAnValue("Resumen/Personal/"+collection.date, per._id,-per.horas);
        })
    }

    async function incrementAlmacenInsumos(items){
        items.forEach( async item =>{
            await updateByIdAnValue("Registro/almacen", item._id,item.cant)
            await updateByIdAnValue("Resumen/Item/"+collection.date, item._id,-item.cant);
        })
    }
    async function reduceAlmacenMinerales(items){
        items.forEach( async item =>{
            await updateByIdAnValue("Registro/almacen", item._id,-item.cant)
            await updateByIdAnValue("Resumen/Item/"+collection.date, item._id,-item.cant)
        })
    }

    const handleCancel = () => {
        setIsConfirmDialogOpen2(false);
        setIsConfirmDialogOpen(false);
    };

    const newItem = () => {
        setIsFormNewDataTableOpen(false);
        setReload(true);
      };
    function getMaxLegthData( data){
        let maxLegth = 0
        if(data.insumos.length>maxLegth)
            maxLegth = data.insumos.length;
        if(data.mineralObtenido.length>maxLegth)
            maxLegth = data.mineralObtenido.length;
        if(data.maquinaria.length>maxLegth)
            maxLegth = data.maquinaria.length;
        if(data.personal.length>maxLegth)
            maxLegth = data.personal.length;

        return  maxLegth;
    }
    function getValueVolumen( value, index){
        if(index===0)
            return value;
        else
            return "-----"
    }
    function getDataArrayNombre( array,index){
        if(array.length>index)
            return array[index].nombre;
        else
            return "-----"
    }
    function getDataArrayCant( array,index){
        if(array.length>index)
            return formatNumber(array[index].cant);
        else
            return "-----"
    }
    function getDataArrayHoras( array,index){
        if(array.length>index)
            return formatNumber(array[index].horas);
        else
            return "-----"
    }
    const tableComplete = []
    tableFiltered.map(data =>{
        for (let index = 0; index < getMaxLegthData(data); index++) {
            tableComplete.push(
                <tr key ={data._id + index} >
                            <td>{Number(data.fecha.slice(-2))}</td>
                            { collection.value.volumen  &&
                               <td>{getValueVolumen(data.volumen,index)}</td> 
                            }
                                
                            {collection.value.mineralObtenido &&
                            <>  
                                <td>{getDataArrayNombre(data.mineralObtenido,index)}</td>
                                <td>{getDataArrayCant(data.mineralObtenido,index)}</td>
                            </>
                            }
                            {collection.value.insumo &&
                            <>
                                <td>{getDataArrayNombre(data.insumos,index)}</td>
                                <td>{getDataArrayCant(data.insumos,index)}</td>
                            </>
                            }
                            {collection.value.maquinaria &&
                            <>
                                <td>{getDataArrayNombre(data.maquinaria,index)}</td>
                                <td>{getDataArrayHoras(data.maquinaria,index)}</td>
                            </>
                            }
                            {collection.value.personal &&
                            <>
                                <td>{getDataArrayNombre(data.personal,index)}</td>
                                <td>{getDataArrayHoras(data.personal,index)}</td>
                            </>
                            }
                            <td>
                                <div className="container_Iconos">
                                    <img className= "icon" style={{marginRight:10}} alt="deleteData" src={deleteIcon} onClick={() =>handleOpenConfirmDialog(data)}/>
                               </div>
                            </td>
                        </tr>
              );
        
        }
        return tableComplete;
        
    }
    )
    useEffect(() => {
        async function getDataTable() {
            try {
                const result = await getData(collection.value.nombre.replace(" ", "")); // Replace with your endpoint
                const almacen = await getData("Registro/Almacen"); 
                if(result !== null){
                    setAlmacenData(almacen);
                    setDataTable(result);
                    setloading(false);
                }   
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataTable();
        setReload(false);
    }, [collection.value.nombre,reload]);

    useEffect(() => {
        function handleClickOutside(event) {
          if (componenteRef.current && !componenteRef.current.contains(event.target)) {
            setIsConfirmDialogOpen2(false);
            setIsConfirmDialogOpen(false);
            setIsFormNewDataTableOpen(false);
            setReload(true);
          }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

  return (
    <div>
        { !loading  &&
            <>
            <div className="container_ButtonAdd"> 
                <button className="button_Registro" onClick={()=>{ setEditDataSelect({});setIsFormNewDataTableOpen(true) }}>Nuevo dato</button>
            </div>
            <div  className="tabla-container" style={{paddingTop:0}}>
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Dia</th>
                        {collection.value.volumen &&
                            <th>Volumen</th>
                        }
                        {collection.value.mineralObtenido &&
                            <>
                            <th>Mineral</th>
                            <th>Cantidad</th>
                            </>
                        }
                        {collection.value.insumo &&
                           <>
                             <th>Insumo</th>
                             <th>Cantidad</th>
                           </>
                        }
                        {collection.value.maquinaria &&
                           <>
                           <th>Maquinaria</th>
                           <th>Horas</th>
                           </>
                        }
                        {collection.value.personal &&
                           <>
                           <th>Personal</th>
                           <th>Horas</th>
                           </>
                        }
                        <th >Borrar</th>
                        
                    </tr>
                    </thead>
                    <tbody>{tableComplete}</tbody>
                    
                </table>
            </div>
            </>
        }
        {isConfirmDialogOpen2 && (<div className="overlay"><div ref={componenteRef}> 
        <CustomConfirmDialog
          message= {"No hay suficiente '"+dataSelect.nombre+"' en almacen para borrar el registro"}
          onCancel={handleCancel}
        /></div></div>
        )

        }
        {isConfirmDialogOpen && (<div className="overlay"><div ref={componenteRef}> 
        <CustomConfirmDialog
          message= {"¿Borrar "+collection.value.nombre+" con fecha: "+dataSelect.fecha+"?"}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        /></div></div>
        )}
        {isFormNewDataTableOpen && (<div className="overlay"><div ref={componenteRef}> 
            <FormSegui editItem={editDataSelect} nextDay={getNextDay(tableData,collection.date)} addItem= {newItem} collection={collection.value.nombre.trim()}  proceso={collection.value} date={collection.date} /></div></div>
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
  
export default TablaA;
/*<tbody>
                    {   tableFiltered.map(data =>
                        <tr key ={data._id} >
                            <td>{Number(data.fecha.slice(-2))}</td>
                            {collection.value.volumen &&
                                <td>{data.volumen}</td>
                            }
                            {collection.value.mineralObtenido &&
                            <>
                                <td>{data.mineralObtenido.map(mineral =>{
                                    if(data.mineralObtenido[data.mineralObtenido.length-1]._id !== mineral._id)
                                        return mineral.nombre +" , "
                                    return mineral.nombre
                                })}</td>
                                <td>{data.mineralObtenido.map(mineral =>{
                                    if(data.mineralObtenido[data.mineralObtenido.length-1]._id !== mineral._id)
                                        return formatNumber(mineral.cant)  +" , "
                                    return formatNumber(mineral.cant)
                                })}</td>
                            </>
                            }
                            {collection.value.insumo &&
                            <>
                                <td>{data.insumos.map(insumo =>{
                                if(data.insumos[data.insumos.length-1]._id !== insumo._id)
                                    return insumo.nombre +" , "
                                return insumo.nombre
                                })}</td>
                                <td> {data.insumos.map(insumo =>{
                                    if(data.insumos[data.insumos.length-1]._id !== insumo._id)
                                        return formatNumber(insumo.cant) +" , "
                                    return formatNumber(insumo.cant) 
                                })}</td>
                            </>
                            }
                            {collection.value.maquinaria &&
                            <>
                                <td>{data.maquinaria.map(maquina =>{
                                    if(data.maquinaria[data.maquinaria.length-1]._id !== maquina._id)
                                        return maquina.nombre +" , "
                                    return maquina.nombre
                                })}</td>
                                <td>{data.maquinaria.map(maquina =>{
                                    if(data.maquinaria[data.maquinaria.length-1]._id !== maquina._id)
                                        return maquina.horas +" , "
                                    return maquina.horas
                                })}</td>
                            </>
                            }
                            {collection.value.personal &&
                            <>
                                <td>{data.personal.map(persona =>{
                                    if(data.personal[data.personal.length-1]._id !== persona._id)
                                        return persona.nombre +" , "
                                    return persona.nombre
                                })}</td>
                                <td>{data.personal.map(persona =>{
                                    if(data.personal[data.personal.length-1]._id !== persona._id)
                                        return persona.horas +" , "
                                    return persona.horas
                                })}</td>
                            </>
                            }
                            <td>
                                <div className="container_Iconos">
                                    <img className= "icon" style={{marginRight:10}} alt="deleteData" src={deleteIcon} onClick={() =>handleOpenConfirmDialog(data)}/>
                               </div>
                            </td>
                        </tr>)
                }
                    </tbody>*/