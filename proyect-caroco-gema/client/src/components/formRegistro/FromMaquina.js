import React ,{ useEffect, useState } from "react";
import "./FormMaquina.css"
import { getData} from "../../services/mongodbService";
import addIcon from '../../assets/addIcon.png';
import quitarIcon from '../../assets/quitarIcon.png';

const FormMaquina = (parent) => {
    const [respuestoSelect, setRespuestoSelect] = useState("vacio");
    const [respuestosArrey, setRespuestosArrey] = useState([]); 

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const formattedDate = `${year}-${month}`;
      
        return formattedDate;
    }
    
    const listaSelect =  (maquina) => maquina.map( (m)=>
    <option key={m._id} value={m._id}> {m.nombre}</option>)

    const [formData, setFormData] = useState( {
        nombre : "",
        costo : 1,
        propiedades: "",
        mantenimiento: getCurrentDate(),
        repuestos : []
    });
    const removeMaquina  = (id)=>{
        const index = formData.repuestos.findIndex(i => i._id ===id);
        formData.repuestos.splice(index, 1);
     };
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
    const setNuevaMaquina  = ()=>{
        const index = respuestosArrey.findIndex(i => i._id ===respuestoSelect);
        if(index !== -1){
            formData.repuestos.push({_id: "", nombre : ""})
            formData.repuestos[formData.repuestos.length-1].nombre = respuestosArrey[index].nombre;
            formData.repuestos[formData.repuestos.length-1]._id = respuestosArrey[index]._id;
            setRespuestoSelect("vacio");
        }
    };
    
    const handleChange = (e) => {
    const { name, value } = e.target;
    if (name!=="costo")
        setFormData({
            ...formData,
            [name]: value,
        });
    else
        setFormData({
            ...formData,
            [name]: Number(value),
        });
        
    };

    const handleSubmit  = async (e) => {
        e.preventDefault();
        if(formData._id)
            parent.editMaquinaById(formData);
        else
            parent.newMaquina(formData);
    };
    useEffect(()=>{
        async function getDataTable() {
            try {
                const result = await getData("Registro/Almacen"); // Replace with your endpoint
                if(result === null)
                    setRespuestosArrey([]);
                else{
                    setRespuestosArrey(result.filter(item => item.tipo === 'Repuesto'));
                }   
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataTable();
    })
    useEffect(() => {
      let body =parent.editBody;
      if(body._id){
        setFormData({ ...body });
      }
    }, [parent.editBody]);

  return (
    <div className="container_Maquina_Form" >
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Nueva maquina</div>
            <div className="line_container" >
                <h3>Nombre</h3>
                <input
                style={{width:"50%"}}
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                name="nombre"
                className="input_nombre_tipo"
                required
                />
            </div>
            <div className="line_container">
                <h3>Costo</h3>
                <input
                style={{width:"50%"}}
                type="number"
                id="costo"
                value={formData.costo}
                onChange={handleChange}
                name="costo"
                min={1}
                step=".01"
                className="input_nombre_tipo"
                required
                />
            </div>
            <div className="line_container">
                <h3>Caracteristicas</h3>
                <input
                style={{width:"50%"}}
                type="text"
                id="propiedades"
                value={formData.propiedades}
                onChange={handleChange}
                name="propiedades"
                className="input_nombre_tipo"
                required
                />
            </div>
            <div className="line_container">
                <h3>Prox. mantenimiento</h3>
                <input style={{width:"50%"}} name="mantenimiento" className="input_Date_Maquina" type="month" id="Mante" value={formData.mantenimiento} onChange={(e)=> handleChange(e)} />
            </div>
            <div className="line_container">
                    <h3>Lista de repuestos:</h3>
                    {(respuestosArrey.length>0 && respuestosArrey.length !==formData.repuestos.length) &&
                        <>
                            <div className ="box2" style={{width:'50%'}}>
                                <select className ="select_Class" value={respuestoSelect} onChange={(e)=> setRespuestoSelect(e.target.value)} >
                                    <option key="vacio" value="vacio"> Escoge un repuesto</option>
                                    {listaSelect(getArrayFilter(respuestosArrey,formData.repuestos))}
                                </select>
                            </div>
                            {(respuestoSelect !=="vacio") &&
                                <img  className="icon" alt="addInsumo" src={addIcon} onClick={() =>{setNuevaMaquina()}}/>
                            }
                        </>
                    }
                </div>
                {formData.repuestos.map( respuesto=>
                    <div className="line_container" key={respuesto._id}>
                            <p style={{lineHeight:1,fontSize:14 }} className ="text" >{respuesto.nombre}</p>
                            <img className= "icon" alt="removeMaquina" src={quitarIcon} onClick={() =>{removeMaquina(respuesto._id)}}/>
                    </div>
                )}
            <center>
                <button type="submit">Guardar</button>
            </center>
        </form>
    </div>
  );
};

export default FormMaquina;