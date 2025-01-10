import React ,{useState } from "react";
import "./FormStyle.scss"

const FormInventario = ({saveNewItem,editItemById, itemBody}) => {

    const [formDataItem, setformDataItem] = useState(itemBody);
    const unidades = ["Litro" , "Kilo", "Global"];


    const handleChange = (e) => {
        const { name, value } = e.target;
        setformDataItem({
            ...formDataItem,
            [name]: value,
        });
    };

    const handleSubmit  = async (e) => {
        e.preventDefault();
        if(formDataItem.unidad!== "vacio"){
            if(formDataItem.id)
                editItemById(formDataItem);
            else
                saveNewItem(formDataItem);
        }
        
    };

  return (
    <div className="body_form" >
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Datos item</div>
            <div className="line_container">
                <h3>Nombre:</h3>
                <input
                type="text"
                id="nombre"
                value={formDataItem.nombre}
                onChange={handleChange}
                name="nombre"
                className="input_Container"
                required
                />
            </div>
            <div className="line_container">
                <h3>Unidad</h3>
                    <div className ="box2" style={{width: "51%"}}>
                        <select className ="select_Class" value={formDataItem.unidad} onChange={(e)=> setformDataItem({...formDataItem, unidad: e.target.value})} >
                            <option key="vacio" value="vacio">Selecciona la unidad</option>
                            {   unidades.map( unidad=>
                                <option key={unidad} value={unidad}> {unidad}</option>
                            )}
                        </select>
                    </div>
            </div>
            <div className="line_container">
                <h3>Cantidad:</h3>
                <p>{formDataItem.cantidad}</p>
            </div>
            <center>
                <button type="submit">Guardar</button>
            </center>
        </form>
    </div>
  );
};

export default FormInventario;