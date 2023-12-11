import React ,{ useEffect, useState } from "react";

const FormPreciosAli = ({preciosBody,savePrecios}) => {

    const [formData, setFormData] = useState( {
        _id :"vacio",
        desayuno : 1,
        almuerzo : 1,
        cena : 1,
      });
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
    });};

    const handleSubmit  = async (e) => {
        e.preventDefault();
        savePrecios(formData)
    };

    useEffect(() => {
      setFormData(preciosBody);
    }, [preciosBody]);

  return (
    <div className="formProcesoo_container"  style={{width:"30%",left:"33%"}}>
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Editar Precios</div>
            <div className="line_container">
                <h3>Desayuno</h3>
                <input
                type="number"
                id="desayuno"
                value={formData.desayuno}
                onChange={handleChange}
                name="desayuno"
                min={1}
                step=".01"
                className="input_nombre_tipo"
                required
                />
            </div>
            <div className="line_container">
                <h3>Almuerzo</h3>
                <input
                type="number"
                id="almuerzo"
                value={formData.almuerzo}
                onChange={handleChange}
                name="almuerzo"
                min={1}
                step=".01"
                className="input_nombre_tipo"
                required
                />
            </div>
            <div className="line_container">
                <h3>Cena</h3>
                <input
                type="number"
                id="cena"
                value={formData.cena}
                onChange={handleChange}
                name="cena"
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

export default FormPreciosAli;