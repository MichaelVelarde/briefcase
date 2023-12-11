import React ,{ useEffect, useState } from "react";

const FormPersonal = ({newEmpleado,editBody,editEmpleadoById}) => {

    const [formData, setFormData] = useState( {
        ci :0,
        telefono :0,
        nombre :"",
        cargo : "",
        salario : 1,
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
            editEmpleadoById(formData);
        else
            newEmpleado(formData);
    };

    useEffect(() => {
      if(editBody.nombre.length>0 )
      setFormData(editBody);
    }, [editBody]);

  return (
    <div className="formProcesoo_container" style={{width:"40%",left:"30%"}}>
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Nuevo empleado</div>
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
                <h3>ci</h3>
                <input
                type="number"
                id="ci"
                value={formData.ci}
                onChange={handleChange}
                name="ci"
                min={0}
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
                <h3>Cargo</h3>
                <input
                type="text"
                id="cargo"
                value={formData.cargo}
                onChange={handleChange}
                name="cargo"
                className="input_nombre_tipo"
                required
                />
            </div>
            <div className="line_container">
                <h3>Salario</h3>
                <input
                type="number"
                id="salario"
                value={formData.salario}
                onChange={handleChange}
                name="salario"
                min={1}
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

export default FormPersonal;