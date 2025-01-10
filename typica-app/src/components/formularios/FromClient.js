import React ,{useState } from "react";
import "./FormStyle.scss"
//newItem,editBody,editItemById

const FromClient = ({saveNewClient,editClientById, clientBody}) => {

    const [formDataClient, setFormDataClient] = useState(clientBody);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDataClient({
            ...formDataClient,
            [name]: value
        });
    };


    const handleSubmit  = async (e) => {
        e.preventDefault();
        let updatedFormData = { ...formDataClient };

        if (formDataClient.nit === "")
            updatedFormData.nit = "S/N";
        
        if (formDataClient.telefono === "")
            updatedFormData.telefono = "---";
    
        if (updatedFormData.id)
            editClientById(updatedFormData);
        else
            saveNewClient(updatedFormData);
    };


  return (
    <div className="body_form" >
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Datos cliente</div>
            <div className="line_container">
                <h3>Nombre:</h3>
                <input
                type="text"
                id="nombre"
                value={formDataClient.nombre}
                onChange={handleChange}
                name="nombre"
                className="input_Container"
                required
                />
            </div>
            <div className="line_container">
                <h3>NIT/CI:</h3>
                <input
                type="text"
                id="nit"
                value={formDataClient.nit}
                onChange={handleChange}
                name="nit"
                className="input_Container"
                />
            </div>
            <div className="line_container">
                <h3>Telefono:</h3>
                <input
                type="text"
                id="telefono"
                value={formDataClient.telefono}
                onChange={handleChange}
                name="telefono"
                className="input_Container"
                />
            </div>
            <center>
                <button type="submit">Guardar</button>
            </center>
        </form>
    </div>
  );
};

export default FromClient;