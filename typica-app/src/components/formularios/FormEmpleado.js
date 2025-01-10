import React ,{useState } from "react";
import "./FormStyle.scss"


const FormEmpleado = ({saveNewEmpleado,editEmpleadoById, empleadoBody}) => {

    const [formDataEmpleado, setformDataEmpleado] = useState(empleadoBody);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setformDataEmpleado({
            ...formDataEmpleado,
            [name]: value,
        });
    };

    const handleSubmit  = async (e) => {
        e.preventDefault();
        if(formDataEmpleado.id)
            editEmpleadoById(formDataEmpleado);
        else
            saveNewEmpleado(formDataEmpleado);
    };

  return (
    <div className="body_form" >
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Datos Empleado</div>
            <div className="line_container">
                <h3>Nombre:</h3>
                <input
                type="text"
                id="nombre"
                value={formDataEmpleado.nombre}
                onChange={handleChange}
                name="nombre"
                className="input_Container"
                required
                />
            </div>
            <div className="line_container">
                <h3>CI:</h3>
                <input
                type="text"
                id="ci"
                value={formDataEmpleado.ci}
                onChange={handleChange}
                name="ci"
                className="input_Container"
                required
                />
            </div>
            <div className="line_container">
                <h3>Telefono:</h3>
                <input
                type="text"
                id="telefono"
                value={formDataEmpleado.telefono}
                onChange={handleChange}
                name="telefono"
                className="input_Container"
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

export default FormEmpleado;