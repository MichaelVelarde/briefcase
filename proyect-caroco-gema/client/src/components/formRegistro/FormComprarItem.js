import React ,{ useEffect, useState } from "react";
import { getData} from "../../services/mongodbService";

const FormComprarItem = ({newRegistro,itemSelected}) => {
    const [proveedorSelect, setproveedorSelect] = useState("vacio");
    const [proveedorsArrey, setproveedorsArrey] = useState([]); 
    const [formData, setFormData] = useState({ fecha: "",item :{_id:"", nombre: ""} ,proveedor : {},cantidad: 0,precio: 0,});

    function getCurrentDate() {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    const listaSelect =  (proveedor) => proveedor.map( (proveedor)=>
    <option key={proveedor._id} value={proveedor._id}> {proveedor.nombre}</option>)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit  = async (e) => {
        e.preventDefault();
        formData.proveedor = getProveedor(proveedorSelect);
        newRegistro(formData);
    };
    function getProveedor(id){
        let index = proveedorsArrey.findIndex( proveedor => proveedor._id === id)
        return {_id: proveedorsArrey[index]._id ,nombre: proveedorsArrey[index].nombre }
    }
    useEffect(() => {
        async function getProveedores() {
            try {
                const result = await getData("Registro/Proveedor"); // Replace with your endpoint
                if(result === null)
                    setproveedorsArrey([{_id:"Sin llave", nombre:"Sin Proveedor"}]);
                else{
                    result.push({_id:"Sin llave", nombre:"Sin Proveedor"})
                    setproveedorsArrey(result);
                }   
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getProveedores();
    }, []);

    useEffect(() => {
        setFormData({
            fecha: getCurrentDate(),
            item :itemSelected,
            proveedor : {},
            cantidad: 0,
            precio: 0,
          });
        setproveedorSelect("Sin llave");
    }, [itemSelected]);

  return (
    <div className="formProcesoo_container" style={{width:"40%",left:"30%"}}>
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Compra de {formData.item.nombre}</div>
            <div className="line_container">
                <h3>Fecha</h3>
                <input name="fecha" className="input_Date_Maquina" type="date" id="fecha" value={formData.fecha} onChange={(e)=> handleChange(e)} />
            </div>
            <div className="line_container">
                <h3>Proveedor</h3>
                {proveedorsArrey.length>0  &&
                    <div className ="box2" style={{width:"40%"}}>
                        <select className ="select_Class" value={proveedorSelect} onChange={(e)=> setproveedorSelect(e.target.value)} >
                            {listaSelect(proveedorsArrey)}
                        </select>
                    </div>
                }
            </div>
            <div className="line_container">
                <h3>Cantidad</h3>
                <input
                type="number"
                id="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                name="cantidad"
                min={0}
                step=".01"
                className="input_nombre_tipo"
                required
                />
            </div>
            <div className="line_container">
                <h3>Precio</h3>
                <input
                type="number"
                id="precio"
                value={formData.precio}
                onChange={handleChange}
                name="precio"
                min={0}
                step=".01"
                className="input_nombre_tipo"
                required
                />
            </div>
            

            <center>
                <button type="submit">Guardar</button>
            </center>
        </form>
    </div>
  );
};

export default FormComprarItem;