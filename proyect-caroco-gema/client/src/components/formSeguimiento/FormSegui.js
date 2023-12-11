import React , { useEffect, useState } from "react";
import "./FormSegui.css"
import addIcon from '../../assets/addIcon.png';
import quitarIcon from '../../assets/quitarIcon.png';
import { getData,saveData ,editData, updateByIdAnValue} from "../../services/mongodbService"

const FormSegui = (parent) => {
  //Resumen arrays
  const [resumenItems, setResumenItems] = useState([]);
  const [resumenMaquinas, setResumenMaquinas] = useState([]);
  const [resumenPersonal, setResumenPersonal] = useState([]);

  //other vars
  const [reload, setReload] = useState(true);
  const [formData, setFormData] = useState({ fecha : 1, volumen : 0
  });
  const [insumos, setInsumo] = useState([]);
  const [insumoSelect, setInsumoSelect] = useState("vacio");
  const [insumosArreglo, setInsumosArreglo] = useState([]); 

  const [mineralObtenido,setMineral] = useState([]);
  const [mineralObtenidoSelect, setMineralObtenidoSelect] = useState("vacio");
  const [mineralObtenidoArreglo, setMineralObtenidoArreglo] = useState([]); 

  const [maquinaria, setMaquina] = useState([]);
  const [maquinariaSelect, setMaquinariaSelect] = useState("vacio");
  const [maquinariaArreglo, setMaquinariaArreglo] = useState([]); 

  const [personal, setPersonal] = useState([]);
  const [personalSelect, setPersonalSelect] = useState("vacio");
  const [personalArreglo, setPersonalArreglo] = useState([]); 

  const [editar, setEditar] = useState(false);
  useEffect(() => {
    const  getDataDB = ()=>{
        async function getResumenMensual() {
            try {
                const resumenItem = await getData("Resumen/Item"); // Replace with your endpoint
                const resumenMaquinaria = await getData("Resumen/Maquinaria"); // Replace with your endpoint
                const resumenPersonal = await getData("Resumen/Personal"); // Replace with your endpoint
                if(resumenItem !== null)
                    setResumenItems(resumenItem)
                if(resumenMaquinaria !== null)
                    setResumenMaquinas(resumenMaquinaria)
                if(resumenPersonal !== null)
                    setResumenPersonal(resumenPersonal)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        async function getInsumosAndMinerales() {
            try {
                const result = await getData("Registro/Almacen"); // Replace with your endpoint
                if(result === null){
                    setInsumosArreglo([]);
                    setMineralObtenidoArreglo([])
                }
                else{
                    setInsumosArreglo(result.filter(item => item.tipo === 'Insumo'));
                    setMineralObtenidoArreglo(result.filter(item => item.tipo === 'Mineral'));
                }   
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        async function getMaquinaria() {
            try {
                const result = await getData("Registro/Maquinaria"); // Replace with your endpoint
                if(result === null)
                    setMaquinariaArreglo([]);
                else{
                    setMaquinariaArreglo(result);
                }   
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        async function getPersonal() {
            try {
                const result = await getData("Registro/Personal"); // Replace with your endpoint
                if(result === null)
                    setPersonalArreglo([]);
                else{
                    setPersonalArreglo(result);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        getResumenMensual();

        if(parent.proceso.maquinaria)
            getMaquinaria()
        if(parent.proceso.personal)
            getPersonal()
        if(parent.proceso.insumo || parent.proceso.mineralObtenido )
            getInsumosAndMinerales();
    }
    getDataDB();
    setFormData({ fecha : parent.nextDay, volumen : 0
    });
  }, [parent.nextDay,parent.date,parent.proceso.maquinaria,parent.proceso.personal,parent.proceso.mineralObtenido,parent.proceso.insumo]);
  
  useEffect(() => {
    function editFormDate (){
        let body = parent.editItem;
        if(body._id){
            setFormData(body);
            setInsumo(body.insumos);
            setMaquina(body.maquinaria);
            setMineral(body.mineralObtenido);
            setPersonal(body.personal);
            setEditar(true);
            setReload(true);
        }
    }
    editFormDate();
  }, [parent.editItem ]);

  useEffect(() => {
    setReload(false);
  }, [reload ]);

    const listaSelect =  (item) => item.map( (i)=>
    <option key={i._id} value={i._id}> {i.nombre}</option>)
    

    const handleSubmit  = (e) => {
        e.preventDefault();
        if(editar){
            let copiaData = JSON.parse(JSON.stringify(formData));
            let id = copiaData._id;
            delete copiaData._id;
            saveEditData(copiaData,id);
        }
        else{
            let copiaData = JSON.parse(JSON.stringify(formData));
            if(copiaData.fecha<10)
                copiaData.fecha = parent.date +"-0"+ copiaData.fecha ;
            else
                copiaData.fecha = parent.date +"-"+ copiaData.fecha ;
            if(!parent.proceso.volumen )
                delete copiaData.volumen;

            if(copiaData.personal)
                saveDataResumenPersonal(copiaData.personal);
            if(copiaData.maquinaria)
                saveDataResumenMaquinas(copiaData.maquinaria);
            if(copiaData.mineralObtenido ||copiaData.insumos)
                saveDataResumenItem(copiaData.mineralObtenido, copiaData.insumos);
            saveFormData(copiaData);  
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: Number(value),
        });
    };

    const handleChange2 = (e,items) => {
        const { name, value, id } = e.target;
        const index = items.findIndex( i=> i._id === id)
        if(index !== -1){
            if(name ==="insumos" ||name ==="mineralObtenido" )
                items[index].cant = Number(value)
            else
                items[index].horas = Number(value)
            setFormData(
                {
                    ...formData,
                    [name]: items,
                });
        }     
    };
    const removeInsumo  = (id, items)=>{
       const index = items.findIndex(i => i._id ===id);
       items.splice(index, 1);
       setReload(true);
    };
    const setNuevoInsumo  = (cantidad,items,itemsArreglo,itemSelect,funcionSetSelectEmpty )=>{
        const index = itemsArreglo.findIndex(i => i._id ===itemSelect);
        if(index !== -1){
            if(cantidad)
                items.push({_id: "", nombre : "", cant: 0})
            else
                items.push({_id: "", nombre : "", horas: 0})
            items[items.length-1].nombre = itemsArreglo[index].nombre;
            items[items.length-1]._id = itemsArreglo[index]._id;
            funcionSetSelectEmpty("vacio");
            setReload(true);
        }
    };
    //{_id: String, nombre : String , horas : Number}
    async function saveDataResumenPersonal(personal) {
        let auxResumenPersonal;
        let indexItems = resumenPersonal.findIndex(resumen => resumen._id ===parent.date);
        if(indexItems!==-1)
            auxResumenPersonal = resumenPersonal[indexItems];
        else
            auxResumenPersonal = {_id : parent.date ,personal: [] }

        personal.forEach(persona => {
            let indexMin = auxResumenPersonal.personal.findIndex(item => item._id ===persona._id); 
            if(indexMin!==-1)
            auxResumenPersonal.personal[indexMin].horas += persona.horas;
            else
            auxResumenPersonal.personal.push({_id: persona._id, nombre : persona.nombre , horas : persona.horas})
        })
        if(indexItems!==-1)
            await editData("Resumen/Personal",auxResumenPersonal ,auxResumenPersonal._id); 
        else 
            await saveData("Resumen/Personal",auxResumenPersonal); 
    }

    async function saveDataResumenMaquinas(maquinas) {
        let auxResumenMaquinas;
        let indexItems = resumenMaquinas.findIndex(resumen => resumen._id ===parent.date);
        if(indexItems!==-1)
            auxResumenMaquinas = resumenMaquinas[indexItems];
        else
            auxResumenMaquinas = {_id : parent.date ,maquinas: [] }

        maquinas.forEach(maquina => {
            let indexMin = auxResumenMaquinas.maquinas.findIndex(item => item._id ===maquina._id); 
            if(indexMin!==-1)
                auxResumenMaquinas.maquinas[indexMin].horas += maquina.horas;
            else
                auxResumenMaquinas.maquinas.push({_id: maquina._id, nombre : maquina.nombre , horas : maquina.horas})
        })
        if(indexItems!==-1)
            await editData("Resumen/Maquinaria",auxResumenMaquinas ,auxResumenMaquinas._id); 
        else 
            await saveData("Resumen/Maquinaria",auxResumenMaquinas); 
    }

    async function saveDataResumenItem(mineralesObetenidos, insumos) {
        let auxResumenItems;
        let indexItems = resumenItems.findIndex(resumen => resumen._id ===parent.date);
        if(indexItems!==-1)
            auxResumenItems = resumenItems[indexItems];
        else
            auxResumenItems = {_id : parent.date ,items: [] }
        if(mineralesObetenidos)
        mineralesObetenidos.forEach(mineral => {
            let indexMin = auxResumenItems.items.findIndex(item => item._id ===mineral._id); 
            if(indexMin!==-1)
                auxResumenItems.items[indexMin].cantidad += mineral.cant;
            else
                auxResumenItems.items.push({_id: mineral._id, nombre : mineral.nombre , cantidad : mineral.cant})
        })
        if(insumos)
        insumos.forEach(insumo => {
            let indexMin = auxResumenItems.items.findIndex(item => item._id ===insumo._id); 
            if(indexMin!==-1)
                auxResumenItems.items[indexMin].cantidad += insumo.cant;
            else
                auxResumenItems.items.push({_id: insumo._id, nombre : insumo.nombre , cantidad : insumo.cant})
        })

        if(indexItems!==-1)
            await editData("Resumen/Item",auxResumenItems ,auxResumenItems._id); 
        else 
            await saveData("Resumen/Item",auxResumenItems); 
    }

    function getArrayFilter(array, arraySelected){
        let aux = [];
        arraySelected.forEach(element => {
            aux.push(element._id)
        });
        let aux2= [];
        array.forEach(item => {
            if(!aux.includes(item._id) )
                aux2.push(item)
        });
        return aux2;
    }
    
    async function saveFormData(body) {
        try {
            if(body.mineralObtenido)
                await incrementAlmacenMinerales(body.mineralObtenido);
            if(body.insumos)
                await reduceAlmacenInsumos(body.insumos);
            await saveData(parent.collection.replace(" ", ""),body); 
            parent.addItem();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    async function reduceAlmacenInsumos(items){
        items.forEach( async item =>{
            await updateByIdAnValue("Registro/almacen", item._id,-item.cant)
        })
    }
    async function incrementAlmacenMinerales(items){
        items.forEach( async item =>{
            await updateByIdAnValue("Registro/almacen", item._id,item.cant)
        })
    }

    async function saveEditData(body, id){
        try {
            await editData(parent.collection.replace(" ", ""),body ,id); 
            parent.addItem();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    function getCantidadMaxInsumo(id){
        let index = insumosArreglo.findIndex( insumo => insumo._id === id)
        return insumosArreglo[index].cantidad
    }
  return (
    <div className="body_form">
            
        {editar
            ?<div className="Form_Title">Editar registro de {parent.proceso.nombre}</div>
            :<div className="Form_Title">Nuevo registro de {parent.proceso.nombre}</div>
        }
        <form onSubmit={handleSubmit} autoComplete="off">
            <div className="line_container"> 
                
                {editar
                    ?<><h3>Fecha</h3><p className ="text" >{formData.fecha}</p></>
                    :<>
                    <h3>Día</h3>
                    <input
                    type="number"
                    id="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    name="fecha"
                    min={parent.nextDay}
                    max="31"
                    className="input_Container"
                    required
                    /></>
                }
            </div>
            {parent.proceso.volumen &&
                <div className="line_container">
                <h3>Volumen</h3>
                <input
                    type="number"
                    id="volumen"
                    min="1"
                    value={formData.volumen}
                    onChange={handleChange}
                    name="volumen"
                    className="input_Container"
                    required
                />
                </div>
            }
            {parent.proceso.insumo &&
            <>
                <div className="line_container">
                    <h3>Lista de Insumos:</h3>
                    {(insumosArreglo.length>0 && insumosArreglo.length !==insumos.length) &&
                        <>
                            <div className ="box2">
                                <select className ="select_Class" value={insumoSelect} onChange={(e)=> setInsumoSelect(e.target.value)} >
                                    <option key="vacio" value="vacio"> Escoge un insumo</option>
                                    {listaSelect(getArrayFilter(insumosArreglo,insumos))}
                                </select>
                            </div>
                            {(insumoSelect !=="vacio") &&
                                <img  className="icon" alt="addInsumo" src={addIcon} onClick={() =>{setNuevoInsumo(true,insumos,insumosArreglo,insumoSelect, setInsumoSelect)}}/>
                            }
                        </>
                    }
                </div>
                {insumos.map( insumo=>
                    <div className="line_container" key={insumo._id}>
                            <p className ="text" >{insumo.nombre}</p>
                        
                            <input
                                    type="number"
                                    value={insumo.cant}
                                    id= {insumo._id}
                                    min="1"
                                    step=".01"
                                    max = {getCantidadMaxInsumo(insumo._id)}
                                    onChange={event => handleChange2(event,insumos)}
                                    name="insumos"
                                    className="input_Container"
                                    required
                            />
                            <img className= "icon" alt="removeInsumo" src={quitarIcon} onClick={() =>{removeInsumo(insumo._id, insumos)}}/>
                    </div>
                )}
            </>}
            {parent.proceso.mineralObtenido &&
            <>
                <div className="line_container">
                    <h3>Lista de Minerales:</h3>
                    {(mineralObtenidoArreglo.length>0 && mineralObtenidoArreglo.length !==mineralObtenido.length) &&
                        <>
                            <div className ="box2">
                                <select className ="select_Class" value={mineralObtenidoSelect} onChange={(e)=> setMineralObtenidoSelect(e.target.value)} >
                                    <option key="Vacio2" value="vacio"> Escoge un mineral</option>
                                    {listaSelect(getArrayFilter(mineralObtenidoArreglo,mineralObtenido))}
                                </select>
                            </div>
                            {(mineralObtenidoSelect !=="vacio") &&
                                <img  className="icon" alt="addInsumo" src={addIcon} onClick={() =>{setNuevoInsumo(true,mineralObtenido,mineralObtenidoArreglo,mineralObtenidoSelect, setMineralObtenidoSelect)}}/>
                            }
                        </>
                    }
                </div>
                {mineralObtenido.map( mineral=>
                    <div className="line_container" key={mineral._id}> 
                        <p className ="text" >{mineral.nombre}</p>
                        <input
                            type="number"
                            value={mineral.cant}
                            id= {mineral._id}
                            min="1"
                            step=".01"
                            onChange={event => handleChange2(event,mineralObtenido)}
                            name="mineralObtenido"
                            className="input_Container"
                            required
                        />
                        <img className= "icon" alt="removeInsumo" src={quitarIcon} onClick={() =>{removeInsumo(mineral._id, mineralObtenido)}}/>
                    </div>
                )}
            </>}
            {parent.proceso.personal &&
            <>
                <div className="line_container">
                    <h3>Lista del Personal</h3>
                    {(personalArreglo.length>0 && personalArreglo.length !==personal.length) &&
                        <>
                            <div className ="box2">
                                <select className ="select_Class" value={personalSelect} onChange={(e)=> setPersonalSelect(e.target.value)} >
                                    <option key="Vacio2" value="vacio"> Escoge un trabajador</option>
                                    {listaSelect(getArrayFilter(personalArreglo,personal))}
                                </select>
                            </div>
                            {(personalSelect !=="vacio") &&
                                <img  className="icon" alt="addInsumo" src={addIcon} onClick={() =>{setNuevoInsumo(false,personal,personalArreglo,personalSelect, setPersonalSelect)}}/>
                    
                            }
                        </>
                    }
                </div>
                {personal.map( per=>
                    <div className="line_container" key={per._id}>
                        <p className ="text" >{per.nombre}</p>
                        <input
                                type="number"
                                value={per.horas}
                                id= {per._id}
                                min="1"
                                step=".01"
                                onChange={event => handleChange2(event,personal)}
                                name="personal"
                                className="input_Container"
                                required
                            />
                        <img className= "icon" alt="removeInsumo" src={quitarIcon} onClick={() =>{removeInsumo(per._id, personal)}}/>
                    </div>
                )}
            </>}
            {parent.proceso.maquinaria &&
            <>
             <div className="line_container">
                <h3>Lista de Maquinaria</h3>
                {(maquinariaArreglo.length>0 && maquinariaArreglo.length !==maquinaria.length)  &&
                    <>
                        <div className ="box2">
                            <select className ="select_Class" value={maquinariaSelect} onChange={(e)=> setMaquinariaSelect(e.target.value)} >
                                <option key="Vacio4" value="vacio"> Escoge una maquina</option>
                                {listaSelect(getArrayFilter(maquinariaArreglo,maquinaria))}
                            </select>
                        </div>
                        {(maquinariaSelect !=="vacio") &&
                            <img  className="icon" alt="addInsumo" src={addIcon} onClick={() =>{setNuevoInsumo(false,maquinaria,maquinariaArreglo,maquinariaSelect, setMaquinariaSelect)}}/>
               
                        }
                    </>
                }
            </div>
            {maquinaria.map( maquina=>
                <div className="line_container" key={maquina._id}>
                    <p className ="text" >{maquina.nombre}</p>  
                    <input
                            type="number"
                            value={maquina.horas}
                            id= {maquina._id}
                            min="1"
                            step=".01"
                            onChange={event => handleChange2(event,maquinaria)}
                            name="maquinaria"
                            className="input_Container"
                            required
                        />
                    <img className= "icon" alt="removeInsumo" src={quitarIcon} onClick={() =>{removeInsumo(maquina._id, maquinaria)}}/> 
                </div>
            )}
            </>}
            <div className="button_Container">
                {editar
                ?<button type="submit">Editar</button>
                :<button type="submit">Guardar</button>
                }   
            </div>
        </form>
    </div>
  );
};

export default FormSegui;