import React ,{ useEffect, useState } from "react";

const FormGastoGeneral = ({newGastoGeneral,editBody,editGastoGeneralById, nextDay, date}) => {

    const [formData, setFormData] = useState( {
        fecha :"",
        detalle : "",
        gasto : 0
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
            editGastoGeneralById(formData);
        else{
            let copiaData = JSON.parse(JSON.stringify(formData));
            if(copiaData.fecha<10)
                copiaData.fecha = date +"-0"+ copiaData.fecha ;
            else
                copiaData.fecha = date +"-"+ copiaData.fecha ;
            newGastoGeneral(copiaData);
        }   
    };

    useEffect(() => {
      if(editBody.fecha !== "null" )
        setFormData(editBody);
        else
        setFormData({
            fecha :nextDay,
            detalle : "",
            gasto : 0
          } );
    }, [editBody,nextDay]);

  return (
    <div className="formProcesoo_container" style={{width:"40%",left:"30%"}}>
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Nuevo gasto general</div>
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
            <div className="line_container">
                <h3>Detalle</h3>
                <input
                type="text"
                id="detalle"
                value={formData.detalle}
                onChange={handleChange}
                name="detalle"
                className="input_nombre_tipo"
                required
                />
            </div>
            <div className="line_container">
                <h3>Gasto</h3>
                <input
                type="number"
                id="gasto"
                value={formData.gasto}
                onChange={handleChange}
                name="gasto"
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

export default FormGastoGeneral;