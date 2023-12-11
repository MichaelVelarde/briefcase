import React ,{ useEffect, useState } from "react";

const FormProveedor = ({newProveedor,editBody,editProveedorById}) => {

    const [formData, setFormData] = useState( {
        nombre :"",
        telefono :0,
        direccion :"",
        comentario : "",
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
            editProveedorById(formData);
        else
            newProveedor(formData);
    };

    useEffect(() => {
      if(editBody.nombre.length>0 )
      setFormData(editBody);
    }, [editBody]);

  return (
    <div className="formProcesoo_container" style={{width:"40%",left:"30%"}}>
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Nuevo Proveedor</div>
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
                <h3>Telefono</h3>
                <input
                type="number"
                id="telefono"
                value={formData.telefono}
                onChange={handleChange}
                name="telefono"
                min={0}
                className="input_nombre_tipo"
                required
                />
            </div>
            <div className="line_container">
                <h3>Dirección</h3>
                <input
                type="text"
                id="direccion"
                value={formData.direccion}
                onChange={handleChange}
                name="direccion"
                min={1}
                className="input_nombre_tipo"
                required
                />
            </div>
            <div className="line_container">
                <h3>Comentario</h3>
                <input
                type="text"
                id="comentario"
                value={formData.comentario}
                onChange={handleChange}
                name="comentario"
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

export default FormProveedor;