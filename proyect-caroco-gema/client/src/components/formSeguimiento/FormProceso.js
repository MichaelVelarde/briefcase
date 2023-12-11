import React ,{useState } from "react";
import "./FormProceso.css"

const FormProceso = ({newProceso}) => {

    const [formData, setFormData] = useState( {
        nombre :"",
        volumen : false,
        mineralObtenido : false,
        insumo: false,
        maquinaria: false,
        personal: false
      });

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
    });};
    
    const handleChangeCheckBox = (e) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            [name]: checked,
    });};

    const handleSubmit  = async (e) => {
        e.preventDefault();
       newProceso(formData);
    };

  return (
    <div className="formProcesoo_container">
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Nueva Tabla</div>
            < div className="line_formProceso">  
                <p className ="text2" >Nombre</p>
                <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                name="nombre"
                className="input_nombre_proceso"
                required
                />
            </div>
            < div className="line_formProceso"> 
                <input type="checkbox" id="cboxVolumen" checked={formData.volumen} name="volumen" onChange={handleChangeCheckBox} />
                <label htmlFor="cboxVolumen">Volumen</label>
            </div>
            < div className="line_formProceso"> 
                <input type="checkbox" id="cboxInsumo" checked={formData.insumo} name="insumo" onChange={handleChangeCheckBox}  />
                <label htmlFor="cboxInsumo">Insumo</label>
            </div>
            < div className="line_formProceso"> 
                <input type="checkbox" id="cboxMineral" checked={formData.mineralObtenido} name="mineralObtenido" onChange={handleChangeCheckBox}  />
                <label htmlFor="cboxMineral">Mineral Obtenido</label>
            </div>
            < div className="line_formProceso"> 
                <input type="checkbox" id="cboxMaquinaria" checked={formData.maquinaria} name="maquinaria" onChange={handleChangeCheckBox} />
                <label htmlFor="cboxMaquinaria">Maquinaria</label>
            </div>
            < div className="line_formProceso"> 
                <input type="checkbox" id="cboxPersonal" checked={formData.personal}  name="personal" onChange={handleChangeCheckBox}/>
                <label htmlFor="cboxPersonal">Personal</label>
            </div>
            <center>
                <button type="submit">Guardar</button>
            </center>
        </form>
    </div>
  );
};

export default FormProceso;