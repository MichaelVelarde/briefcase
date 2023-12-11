import React ,{ useEffect, useState } from "react";
import {  getData,saveData, updateByIdAnValue} from "../../services/mongodbService";

const FormMantenimiento = (parent) => {
    const [respuestosArrey, setRespuestosArrey] = useState([]); 

    const [formData, setFormData] = useState( {maquina : "" , repuestos : [] , fecha :"", mantenimiento:""});
    
    const handleChange = (e) => {
        const { id, value } = e.target;
        let index = formData.repuestos.findIndex(repuesto=> repuesto._id === id)
        formData.repuestos[index].cantidad= Number(value)
    };
    function getMaxCantidadRepuesto (id){
        let index = respuestosArrey.findIndex(repuesto => repuesto._id === id);
        if(index>=0)
            return respuestosArrey[index].cantidad;
        else 
            return 0;
    }
    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    

    const handleSubmit  = async (e) => {
        e.preventDefault();
        let copiaMaquina = parent.maquina;
        copiaMaquina.mantenimiento = formData.mantenimiento;
        delete formData.mantenimiento;
        formData.repuestos = await  UseRepuestosAlmacen(formData.repuestos);
        try {
            let result = await saveData("Registro/Mantenimiento",formData); 
            console.log(result)
          } catch (error) {
              console.error('Error fetching data:', error);
          }
        parent.editMaquinaById(copiaMaquina);
    };
    async function UseRepuestosAlmacen(arregloRepuesto){
        let newArrey = []
        arregloRepuesto.forEach(async rep=>{
            if(rep.cantidad>0){
                newArrey.push(rep);
                try {
                    await updateByIdAnValue("Registro/Almacen",rep._id,-rep.cantidad); 
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        })
        return newArrey;
    }

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
        let arrayRepuestos =[];
        parent.maquina.repuestos.forEach(repuesto => {
            arrayRepuestos.push({_id:repuesto._id, nombre : repuesto.nombre, cantidad :0});
        });
        setFormData({maquina :  parent.maquina.nombre , repuestos : arrayRepuestos , fecha :  parent.maquina.mantenimiento,mantenimiento:""});
      }, [parent]);
    
  return (
    <div className="container_Maquina_Form" >
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Mantenimiento {formData.maquina}</div>
            <div className="line_container"> <h3>Lista de repuestos:</h3></div>
            {formData.repuestos.map( respuesto=>
                <div className="line_container">
                <h3>{respuesto.nombre}</h3>
                <input
                type="number"
                key={respuesto._id}
                id= {respuesto._id}
                value={respuesto.cantidad}
                onChange={handleChange}
                name="cantidad"
                min={0}
                max={getMaxCantidadRepuesto(respuesto._id)}
                className="input_nombre_tipo"
                required
                />
                </div>   
                )}
            
            <div className="line_container">
                <h3>Fecha de mantenimiento</h3>
                <input style={{width:"35%"}} name="fecha" className="input_Date_Maquina" type="month"key="fechaunica" id="fecha" value={formData.fecha} onChange={(e)=> handleChange2(e)} />
            </div>
            <div className="line_container">
                <h3>Proximo mantenimiento</h3>
                <input style={{width:"35%"}} name="mantenimiento" className="input_Date_Maquina" type="month"key="manteunica" id="Mante" value={formData.mantenimiento} onChange={(e)=> handleChange2(e)} />
            </div>
            
            <center>
                <button type="submit">Guardar</button>
            </center>
        </form>
    </div>
  );
};

export default FormMantenimiento;