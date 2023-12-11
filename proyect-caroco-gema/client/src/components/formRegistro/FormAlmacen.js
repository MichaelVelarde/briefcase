import React ,{ useEffect, useState } from "react";

const FormAlmacen = ({newItem,editBody,editItemById}) => {
    //
    const tipos = ["Insumo" , "Repuesto", "Mineral", "Otro"];
    const unidades = ["Litro" , "Kilo", "Gramo", "Glb"];

    const [formData, setFormData] = useState( {
        nombre :"",
        tipo : "",
        unidad: "",
        cantidad: 0,
        cantidadMinima: 0
      });
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
    });};
    const handleSubmit  = async (e) => {
        e.preventDefault();
        if(formData._id)
            editItemById(formData);
        else
            newItem(formData);
    };
    useEffect(() => {
      if(editBody.nombre.length>0 )
        setFormData(editBody);
    }, [editBody]);

  return (
    <div className="formProcesoo_container" style={{width:"40%",left:"30%"}}>
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Nuevo item</div>
            <div className="line_container">
                <h3>Nombre</h3>
                <input
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
                <h3>Min. Cantidad</h3>
                <input
                type="number"
                id="cantidadMinima"
                value={formData.cantidadMinima}
                onChange={handleChange}
                name="cantidadMinima"
                min={0}
                step=".01"
                className="input_nombre_tipo"
                required
                />
            </div>
            <div className="line_container">
                <h3>Tipo</h3>
                    <div className ="box2" style={{width: "40%"}}>
                        <select className ="select_Class" value={formData.tipo} onChange={(e)=>  setFormData({...formData, tipo: e.target.value})} >
                            <option key="vacio" value="vacio">Selecciona un tipo</option>
                            {   tipos.map( tipo=>
                                <option key={tipo} value={tipo}> {tipo}</option>
                            )}
                        </select>
                    </div>
            </div>
            <div className="line_container">
                <h3>Unidad</h3>
                    <div className ="box2" style={{width: "40%"}}>
                        <select className ="select_Class" value={formData.unidad} onChange={(e)=> setFormData({...formData, unidad: e.target.value})} >
                            <option key="vacio" value="vacio">Selecciona la unidad</option>
                            {   unidades.map( unidad=>
                                <option key={unidad} value={unidad}> {unidad}</option>
                            )}
                        </select>
                    </div>
            </div>

            <center>
                <button type="submit">Guardar</button>
            </center>
        </form>
    </div>
  );
};

export default FormAlmacen;