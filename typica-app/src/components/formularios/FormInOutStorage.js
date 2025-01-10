import React ,{useState } from "react";
import {getCurrentDate,getCurrentTime} from '../../services/FunctionsTools.js'
import "./FormStyle.scss"


const FormInOutStorage = ({changeQuantity , body}) => {

    const [formChangeOnQuantity, setFormChangeOnQuantity] = useState({comentario:"" , cantidad:0 , isEntrada : true});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormChangeOnQuantity({
            ...formChangeOnQuantity,
            [name]: value,
        });
    };
    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setFormChangeOnQuantity({
            ...formChangeOnQuantity,
            [name]: parseFloat(value),
        });
    };

    const handleSubmit  = async (e) => {
        e.preventDefault();
        //add date
        const registerBody = {...formChangeOnQuantity ,idP:body.id , nombre: body.nombre ,fecha: getCurrentDate() , hora:getCurrentTime()}
        changeQuantity(registerBody)
    };

  return (
    <div className="body_form" >
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">{formChangeOnQuantity.isEntrada ? "Entrada": "Salida"} de '{body.nombre}'</div>
            <div className="line_container">
                {formChangeOnQuantity.isEntrada 
                    ?<h3 >Entrada</h3>
                    :<h3 >Salida</h3>
                }
                <label className="switch">
                    <input type="checkbox" 
                        checked={formChangeOnQuantity.isEntrada}
                        onChange={(e)=>setFormChangeOnQuantity({...formChangeOnQuantity ,isEntrada:e.target.checked})}
                    />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="line_container">
                <h3>Comentario:</h3>
                <input
                type="text"
                id="comentario"
                value={formChangeOnQuantity.comentario}
                onChange={handleChange}
                name="comentario"
                className="input_Container"
                required
                />
            </div>
            {formChangeOnQuantity.isEntrada 
            ? <div className="line_container">
                <h3>Cantidad:</h3>
                    <input
                    type="number"
                    min={0}
                    id="cantidad"
                    step="any"
                    value={formChangeOnQuantity.cantidad}
                    onChange={handleChange2}
                    name="cantidad"
                    className="input_Container"
                    required
                    />
                </div>
            :<div className="line_container">
                <h3>Cantidad:</h3>
                    <input
                    type="number"
                    min={0}
                    max={body.cantidad}
                    id="cantidad"
                    step="any"
                    value={formChangeOnQuantity.cantidad}
                    onChange={handleChange2}
                    name="cantidad"
                    className="input_Container"
                    required
                    />
                </div>
            }
           
            <center>
                <button type="submit">Guardar</button>
            </center>
        </form>
    </div>
  );
};

export default FormInOutStorage;