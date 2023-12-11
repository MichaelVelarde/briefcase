import React, { useRef,useEffect, useState } from "react";
import { getData} from "../../services/mongodbService"
import {numberToMounth } from "../../services/formatService"
import FormNewDate from "../formSeguimiento/FormNewDate";
import addDateIcon from '../../assets/addDateIconWhite.png'

function ResumenSeguimiento ()  {
    const [filteredItems, setfilteredItems] = useState([]);
    const [filteredMaquinas, setfilteredMaquinas] = useState([]);
    const [FilteredPersonal, setFilteredPersonal] = useState([]);
    const [almacen, setAlmacen] = useState([]);
    const [maquinas, setMaquinas] = useState([]);
    const [personal, setPersonal] = useState([]);
    const [itemsData, setItemsData] = useState([]);
    const [maquinasData, setMaquinasData] = useState([]);
    const [personalData, setPersonalData] = useState([]);
    const [reload, setReload] = useState(true);
    const [isFormNewDateOpen, setisFormNewDateOpen] = useState(false);
    const [dateSelected, setDateSelected] = useState(getCurrentDate());
    const componenteRef = useRef(null);

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const formattedDate = `${year}-${month}`;
        return formattedDate;
    }
    function changeFechaData (){
        let todayDate = dateSelected;
        let selectedItems=[];
        let selectedMaquinas=[];
        let selectedPersonal=[];
        itemsData.forEach(item => {
            if(item._id === todayDate)
                selectedItems=item.items;
        });
        maquinasData.forEach(maquina => {
            if(maquina._id === todayDate)
                selectedMaquinas = maquina.maquinas
        });
        personalData.forEach(per => {
            if(per._id === todayDate)
                selectedPersonal = per.personal
        });
        if(almacen.length>0){
            for (let index = 0; index < selectedItems.length; index++) {
                let idItem= selectedItems[index]._id;
                let indexAlmacen = almacen.findIndex(almacen => almacen._id === idItem);
                if(indexAlmacen !== -1 &&  selectedItems[index].cantidad>0 )
                    selectedItems[index] = {_id : selectedItems[index]._id , cantidad : selectedItems[index].cantidad , nombre : selectedItems[index].nombre , unidad: almacen[indexAlmacen].unidad, tipo: almacen[indexAlmacen].tipo }
                else
                    selectedItems.splice(index, 1) 
                }
        }
        if(maquinas.length>0){
            for (let index = 0; index < selectedMaquinas.length; index++) {
                let idItem= selectedMaquinas[index]._id;
                let indexMaquina = maquinas.findIndex(maquina => maquina._id === idItem);
                if(indexMaquina !== -1 &&  selectedMaquinas[index].horas>0)
                    selectedMaquinas[index] = {_id : selectedMaquinas[index]._id , horas : selectedMaquinas[index].horas , nombre : selectedMaquinas[index].nombre , propiedades: maquinas[indexMaquina].propiedades, costo: maquinas[indexMaquina].costo }
                else
                    selectedMaquinas.splice(index, 1) 
            }
        }
        if(personal.length>0){
            for (let index = 0; index < selectedPersonal.length; index++) {
                let idItem= selectedPersonal[index]._id;
                let indexPersonal = personal.findIndex(per => per._id === idItem);
                if(indexPersonal !== -1&&  selectedPersonal[index].horas>0 )
                    selectedPersonal[index] = {_id : selectedPersonal[index]._id , horas : selectedPersonal[index].horas , nombre : selectedPersonal[index].nombre , cargo: personal[indexPersonal].cargo, salario: personal[indexPersonal].salario }
                else 
                    selectedPersonal.splice(index, 1)    
            }
        }
        setfilteredItems(selectedItems);
        setfilteredMaquinas(selectedMaquinas);
        setFilteredPersonal(selectedPersonal);
    }
    
    const pickDate = async (date) => {
        setisFormNewDateOpen(false);
        setDateSelected (date)
    };
    useEffect(() => {
        function handleClickOutside(event) {
          if (componenteRef.current && !componenteRef.current.contains(event.target)) {
            setisFormNewDateOpen(false);
          }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    useEffect(() => {
        function getCurrentDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); 
            const formattedDate = `${year}-${month}`;
            return formattedDate;
        }
        function firstData (resItems,resMaquinas,resPersonal,almacen,maquinas,personal){
            let todayDate = getCurrentDate();
            let selectedItems=[];
            let selectedMaquinas=[];
            let selectedPersonal=[];
            if(resItems!==null){ 
                setItemsData(resItems);
                resItems.forEach(item => {
                    if(item._id === todayDate)
                        selectedItems=item.items;
                });
            }
            
            if(resMaquinas!==null){
                resMaquinas.forEach(maquina => {
                    if(maquina._id === todayDate)
                        selectedMaquinas= maquina.maquinas
                });
                setMaquinasData(resMaquinas);
            }
            if(resPersonal!==null){
                resPersonal.forEach(per => {
                    if(per._id === todayDate)
                        selectedPersonal = per.personal
                });
                setPersonalData(resPersonal);
            }
            
            if(almacen!==null){
                setAlmacen(almacen);
                for (let index = 0; index < selectedItems.length; index++) {
                    let idItem= selectedItems[index]._id;
                    let indexAlmacen = almacen.findIndex(almacen => almacen._id === idItem);
                    if(indexAlmacen !== -1 &&  selectedItems[index].cantidad>0 )
                        selectedItems[index] = {_id : selectedItems[index]._id , cantidad : selectedItems[index].cantidad , nombre : selectedItems[index].nombre , unidad: almacen[indexAlmacen].unidad, tipo: almacen[indexAlmacen].tipo }
                    else{
                        selectedItems.splice(index, 1) 
                        index --;
                    }
                    }
            }
            if(maquinas!==null){
                setMaquinas(maquinas);
                for (let index = 0; index < selectedMaquinas.length; index++) {
                    let idItem= selectedMaquinas[index]._id;
                    let indexMaquina = maquinas.findIndex(maquina => maquina._id === idItem);
                    if(indexMaquina !== -1 &&  selectedMaquinas[index].horas>0)
                        selectedMaquinas[index] = {_id : selectedMaquinas[index]._id , horas : selectedMaquinas[index].horas , nombre : selectedMaquinas[index].nombre , propiedades: maquinas[indexMaquina].propiedades, costo: maquinas[indexMaquina].costo }
                    else{
                        selectedMaquinas.splice(index, 1);
                        index --;
                    }
                        
                }
            }
            if(personal!==null){
                setPersonal(personal);
                for (let index = 0; index < selectedPersonal.length; index++) {
                    let idItem= selectedPersonal[index]._id;
                    let indexPersonal = personal.findIndex(per => per._id === idItem);
                    console.log(personal + " ??? " +idItem);
                    if(indexPersonal !== -1 &&  selectedPersonal[index].horas>0 )
                        selectedPersonal[index] = {_id : selectedPersonal[index]._id , horas : selectedPersonal[index].horas , nombre : selectedPersonal[index].nombre , cargo: personal[indexPersonal].cargo, salario: personal[indexPersonal].salario }
                    else {
                        selectedPersonal.splice(index, 1);
                        index --;
                    }
                            
                }
            }
            setfilteredItems(selectedItems);
            setfilteredMaquinas(selectedMaquinas);
            setFilteredPersonal(selectedPersonal);
            setReload(false);
        }
        async function getDataTable() {
            try {
                const maquinas = await getData("Registro/Maquinaria");
                const personal = await getData("Registro/Personal"); 
                const almacen = await getData("Registro/Almacen");
                const resItems = await getData("Resumen/Item");
                const resMaquinas = await getData("Resumen/Maquinaria");
                const resPersonal = await getData("Resumen/Personal"); 
                firstData(resItems,resMaquinas,resPersonal,almacen,maquinas,personal)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataTable();
    }, [reload]);

  return (
    <div>
        <div className="container_deFiltrosAlmacen"> 
          <button className="button_Registro" style={{width:150}} onClick={ ()=>{ changeFechaData() }}>Cambiar fecha</button>   
          <img className= "icon2" style={{marginLeft:10}} alt="AddDate" src={addDateIcon} onClick={() =>setisFormNewDateOpen(true)}/>
              <div className="FilterDate_forRegistro">
                  {numberToMounth(dateSelected.slice(-2))} de {dateSelected.slice(0,4)}
              </div>
          </div>
        {!reload &&
        <>        <div  className="tabla-container" style={{paddingTop:0}}>       
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Trabajador</th>
                        <th>Cargo</th>
                        <th>Salario</th>
                        <th>Horas Mes</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   FilteredPersonal.map(data =>
                       
                        <tr key ={data._id} >
                            <td>{data.nombre}</td>
                            <td>{data.cargo}</td>
                            <td>{data.salario}</td>
                            <td>{data.horas}</td>
                        </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
            <div  className="tabla-container" style={{paddingTop:0}}>       
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Maquina</th>
                        <th>Caracteristicas</th>
                        <th>Valor</th>
                        <th>Horas Mes</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   filteredMaquinas.map(data =>
                        
                        <tr key ={data._id} >
                            <td>{data.nombre}</td>
                            <td>{data.propiedades}</td>
                            <td>{data.costo}</td>
                            <td>{data.horas}</td>
                        </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
            <div  className="tabla-container" style={{paddingTop:0}}>       
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Item</th>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Unidad</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   filteredItems.map(data =>
                        <tr key ={data._id} >
                            <td>{data.nombre}</td>
                            <td>{data.tipo}</td>
                            <td>{data.cantidad}</td>
                            <td>{data.unidad}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            </>
             }

            {isFormNewDateOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormNewDate pickDate={pickDate} actualDate={dateSelected} /></div></div>
            )}
    </div>
  );
};

  
export default ResumenSeguimiento;