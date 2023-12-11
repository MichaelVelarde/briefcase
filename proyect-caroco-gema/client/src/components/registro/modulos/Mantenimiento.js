import React, { useEffect, useState } from "react";
import { getData,removeData,updateByIdAnValue} from "../../../services/mongodbService"
import deleteIcon from '../../../assets/deleteIcon.png';
import CustomConfirmDialog from '../../customDialogs/CustomConfirmDialog';

function Mantenimiento ({changeToMaquinas})  {
    const [mantenimientoData, setMantenimientoData] = useState([]);
    const [reload, setReload] = useState(true);
    const [mantenimientoSelect,setMantenimientoSelect] = useState({})
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    
    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getData("Registro/Mantenimiento");
                if (result === null)
                    setMantenimientoData([]);
                else 
                    setMantenimientoData(result.reverse());
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
        setReload(false);
    }, [mantenimientoData.length, reload]);

    async function removeMaquinaById(mante){
        await reverceRepuestosAlmacen(mante.repuestos)
        try {
            await removeData("Registro/Mantenimiento",mante._id); 
            setReload(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    async function reverceRepuestosAlmacen(arregloRepuesto){
        arregloRepuesto.forEach(async rep=>{
                try {
                    await updateByIdAnValue("Registro/Almacen",rep._id,rep.cantidad); 
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            
        })
    }

    const handleOpenConfirmDialog = (mante) => {
        setMantenimientoSelect(mante);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirm = async () => {
        await removeMaquinaById(mantenimientoSelect)
        setIsConfirmDialogOpen(false);
    };

    const handleCancel = () => {
        setIsConfirmDialogOpen(false);
    };

  return (
    <div>
            <div className="container_deFiltrosAlmacen"> 
                <button className="button_Registro" style={{width:100}} onClick={()=>{changeToMaquinas() }}>Maquinas</button>
            </div>
        <div  className="tabla-container" style={{paddingTop:0}}>       
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Maquina</th>
                        <th>Fecha</th>
                        <th>Repuestos</th>
                        <th>Cantidades</th>
                        <th>Borrar</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   mantenimientoData.map(data =>
                        <tr key ={data._id} >
                            <td>{data.maquina}</td>
                            <td>{data.fecha}</td>
                            <td>{data.repuestos.map(repuesto =>{
                                    if(data.repuestos[data.repuestos.length-1]._id !== repuesto._id)
                                        return repuesto.nombre +" , "
                                    return repuesto.nombre
                                })}</td>
                            <td>{data.repuestos.map(repuesto =>{
                                    if(data.repuestos[data.repuestos.length-1]._id !== repuesto._id)
                                        return repuesto.cantidad +" , "
                                    return repuesto.cantidad
                                })}</td>
                            <td>
                                <div className="container_Iconos">
                                    <img className= "icon" style={{marginRight:10}} alt="deleteData" src={deleteIcon} onClick={()=>handleOpenConfirmDialog(data)}/>
                                </div>
                            </td>
                        </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
            {isConfirmDialogOpen && (<div className="overlay">
                <CustomConfirmDialog
                message= {"¿Borrar el mantenimiento de " + mantenimientoSelect.maquina +"?"}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                /></div>
            )}
    </div>
  );
};

  
export default Mantenimiento;