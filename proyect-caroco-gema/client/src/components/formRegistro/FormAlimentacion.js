import React ,{ useEffect, useState } from "react";

const FormAlimentacion = ({nextDay,date,newAlimentacion,editBody,editAlimentacionById}) => {

    const [formData, setFormData] = useState( {
        fecha :1,
        desayuno : 0,
        almuerzo : 0,
        cena: 0,
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
            editAlimentacionById(formData);
        else{
            let copiaData = JSON.parse(JSON.stringify(formData));
            if(copiaData.fecha<10)
                copiaData.fecha = date +"-0"+ copiaData.fecha ;
            else
                copiaData.fecha = date +"-"+ copiaData.fecha ;
            newAlimentacion(copiaData);
        }   
    };

    useEffect(() => {
      if(editBody.fecha !== "null" )
        setFormData(editBody);
      else
        setFormData({
            fecha :nextDay,
            desayuno : 0,
            almuerzo : 0,
            cena: 0,
          } );  
    }, [editBody,nextDay]);

  return (
    <div className="formProcesoo_container" style={{width:"30%",left:"33%"}}>
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Datos alimentacion</div>
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
                    min={nextDay}
                    max="31"
                    className="input_nombre_tipo"
                    required
                    /></>
                }
            </div>
            <div className="line_container">
                <h3>Desayuno</h3>
                <input
                type="number"
                id="desayuno"
                value={formData.desayuno}
                onChange={handleChange}
                name="desayuno"
                min={0}
                className="input_nombre_tipo"
                required
                />
            </div>
            <div className="line_container">
                <h3>Almuerzo</h3>
                <input
                type="number"
                id="almuerzo"
                min={0}
                value={formData.almuerzo}
                onChange={handleChange}
                name="almuerzo"
                className="input_nombre_tipo"
                required
                />
            </div>
            <div className="line_container">
                <h3>Cena</h3>
                <input
                type="number"
                id="cena"
                min={0}
                value={formData.cena}
                onChange={handleChange}
                name="cena"
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

export default FormAlimentacion;