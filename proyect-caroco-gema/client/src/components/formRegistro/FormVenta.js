import React ,{ useEffect, useState } from "react";
import { getData,updateByIdAnValue} from "../../services/mongodbService"

const FormVenta = ({nextDay,date,newVenta,editBody,editVentaById}) => {
    const [compradorArray, setCompradorArray] = useState([]); 
    const [compradorSelected, setCompradorSelected] = useState("vacio");
    const [mineralArray, setMineralArray] = useState([]);  
    const [mineralSelected, setmineralSelected] = useState("vacio"); 

    const listaSelect =  (comprador) => comprador.map( (comprador)=>
    <option key={comprador._id} value={comprador._id}> {comprador.nombre}</option>)

    const [formData, setFormData] = useState( {
        fecha :1,
        cantidad: 1,
        precioUnitario: 1,
        comprador : {},
        mineral : {}
      });
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
    });};

    const handleSubmit  = async (e) => {
        e.preventDefault();
        if(compradorSelected === "vacio" || mineralSelected ==="vacio" )
            console.log("debe seleccionar comprador y mineral")
        else if(formData._id){
            formData.comprador=getCompradorData(compradorSelected);
            formData.mineral=getMineralData(mineralSelected);
            console.log(editBody.mineral._id +" !== "+ mineralSelected)
            if (editBody.cantidad !== formData.cantidad){
                console.log("entre al cantidad no igual")
                try {
                    await updateByIdAnValue("Registro/Almacen",formData.mineral._id,editBody.cantidad-formData.cantidad); 
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            editVentaById(formData);
        }
        else{
            formData.comprador=getCompradorData(compradorSelected);
            formData.mineral=getMineralData(mineralSelected);
            let copiaData = JSON.parse(JSON.stringify(formData));
            if(copiaData.fecha<10)
                copiaData.fecha = date +"-0"+ copiaData.fecha ;
            else
                copiaData.fecha = date +"-"+ copiaData.fecha ;
            newVenta(copiaData);    
        }   
    };

    function getCompradorData(id){
        let index = compradorArray.findIndex( comprador => comprador._id === id)
        return {_id: compradorArray[index]._id ,nombre: compradorArray[index].nombre }
    }
    function getMineralData(id){
        let index = mineralArray.findIndex( mineral => mineral._id === id)
        return {_id: mineralArray[index]._id ,nombre: mineralArray[index].nombre }
    }
    function getMineralCant(id){
        let index = mineralArray.findIndex( mineral => mineral._id === id)
        if(mineralArray[index])
            return mineralArray[index].cantidad;
        else return 1;
    }
    useEffect(() => {
        async function getCompadoresTable() {
            try {
                const result = await getData("Registro/CompradorVenta"); // Replace with your endpoint
                if(result === null)
                    setCompradorArray([]);
                else{
                    setCompradorArray(result);
                }   
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        async function getDataTable() {
            try {
                const result = await getData("Registro/Almacen"); // Replace with your endpoint
                if(result === null)
                    setMineralArray([]);
                else{
                    setMineralArray(result.filter(item => item.tipo === 'Mineral'));
                }   
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getCompadoresTable();
        getDataTable();
    }, []);
    

    useEffect(() => {
      if(editBody.fecha !== "null" ){
        setFormData(editBody);
        setCompradorSelected(editBody.comprador._id)
        setmineralSelected(editBody.mineral._id)
      }
      else
        setFormData({
            fecha :nextDay,
            cantidad: 0,
            precioUnitario: 0,
            comprador : {},
            mineral : {}
          } );
    }, [editBody,nextDay,date]);

  return (
    <div className="formProcesoo_container" style={{width:"40%",left:"30%", maxHeight:"60%"}}>
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Nuevo venta</div>
            <div className="line_container">
                {editBody.fecha !== "null"
                    ?<><h3>Fecha</h3><p className ="text" >{formData.fecha}</p></>
                    :<>
                    <h3>Día</h3>
                    <input
                    type="number"
                    id="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    name="fecha"
                    min="1"
                    max="31"
                    className="input_nombre_tipo"
                    required
                    /></>
                }
            </div>
            {(editBody.fecha !== "null")
                ?<div className="line_container">
                <h3>Mineral:</h3>
                <p className ="text" >{editBody.mineral.nombre}</p>
                </div>
                : <div className="line_container">
                <h3>Escoge un mineral</h3>
                {mineralArray.length>0  &&
                    <>
                        <div className ="box2" style={{width:"40%"}}>
                            <select className ="select_Class" value={mineralSelected} onChange={(e)=> setmineralSelected(e.target.value)} >
                                <option key="vacio" value="vacio"> Mineral...</option>
                                {listaSelect(mineralArray)}
                            </select>
                        </div>
                    </>
                }
                </div>
            }
           
            {(editBody.fecha !== "null")
                ?<div className="line_container">
                    <h3>Cantidad</h3>
                    <input
                    type="number"
                    id="cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                    name="cantidad"
                    min={1}
                    max={editBody.cantidad +getMineralCant(mineralSelected)}
                    step=".01"
                    className="input_nombre_tipo"
                    required
                    />
                </div>
                :<div className="line_container">
                <h3>Cantidad</h3>
                <input
                type="number"
                id="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                name="cantidad"
                min={1}
                max={getMineralCant(mineralSelected)}
                step=".01"
                className="input_nombre_tipo"
                required
                />
                </div>
            }
            <div className="line_container">
                <h3>Precio Unitario</h3>
                <input
                type="number"
                id="precioUnitario"
                min={0.01}
                value={formData.precioUnitario}
                onChange={handleChange}
                name="precioUnitario"
                step=".01"
                className="input_nombre_tipo"
                required
                />
            </div>
            <div className="line_container">
                    <h3>Escoge un comprador</h3>
                    {compradorArray.length>0  &&
                        <>
                            <div className ="box2" style={{width:"40%"}}>
                                <select className ="select_Class" value={compradorSelected} onChange={(e)=> setCompradorSelected(e.target.value)} >
                                    <option key="vacio" value="vacio"> Comprador...</option>
                                    {listaSelect(compradorArray)}
                                </select>
                            </div>
                        </>
                    }
                </div>
                

            <center>
                <button type="submit">Guardar</button>
            </center>
        </form>
    </div>
  );
};

export default FormVenta;