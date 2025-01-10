import React ,{useState,useEffect } from "react";
import "./FormStyle.scss"
import {getCategoriaProductos} from '../../services/firebaseDB/FirebaseService.js';
import iconReduceExtra from "../../assets/iconReduce2.png"
import iconAddExtra from "../../assets/iconMas2.png"


const FormProducto = ({saveNewProduct,editProductById, productBody}) => {

    const [formDataProduct, setformDataProduct] = useState(productBody);
    const [categorias, setCategorias] = useState(["Sin Categoria"]);

    useEffect(() => {
        async function getCategorias() {
          const result = await getCategoriaProductos();
          if(result !== null)
            setCategorias(result.categoria);
        }
        getCategorias();
      }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformDataProduct({
            ...formDataProduct,
            [name]: value,
        });
    };
    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setformDataProduct({
            ...formDataProduct,
            [name]: parseFloat(value),
        });
    };

    const handleChange3 = (e) => {
        const { name, value, id } = e.target;
        setformDataProduct(prevState => {
            const newExtras = [...prevState.extras];
            newExtras[id] = {
                ...newExtras[id],
                [name]: value
            };
            return {
                ...prevState,
                extras: newExtras
            };
        });
    };
    
    const handleChange4 = (e) => {
        const { name, value, id } = e.target;
        setformDataProduct(prevState => {
            const newExtras = [...prevState.extras];
            newExtras[id] = {
                ...newExtras[id],
                [name]: parseFloat(value)
            };
            return {
                ...prevState,
                extras: newExtras
            };
        });
    };

    function reduceExtraProduct(extraIndex){
        setformDataProduct(prevState => {
            let newExtras = [...prevState.extras];
            if(newExtras.length===1)
                return {
                    ...prevState,
                    extras: ["empty"]
                };
            else{
                newExtras.splice(extraIndex,1)
                return {
                    ...prevState,
                    extras: newExtras
                };
            }
        });
    }

    function addEmptyExtraToProduct(){
        if (formDataProduct.extras[0] !== 'empty')
            setformDataProduct(prevState => {
                let newExtras = [...prevState.extras];
                newExtras.push({desc : '' , precio : 0})
                return {
                    ...prevState,
                    extras: newExtras
                };
            });
        else
            setformDataProduct({
                ...formDataProduct,
                extras: [{desc : '' , precio : 0}],
            });
    }

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setformDataProduct({
            ...formDataProduct,
            [name]: checked,
        });
    };

    const handleSubmit  = async (e) => {
        e.preventDefault();
        if(formDataProduct.categoria.length === 0)
            formDataProduct.categoria="Sin Categoria"; 
        if(formDataProduct.id)
            editProductById(formDataProduct);
        else
            saveNewProduct(formDataProduct);
    };

  return (
    <div className="body_form" >
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Datos producto</div>
            <div className="line_container">
                <h3>Nombre:</h3>
                <input
                type="text"
                id="nombreProducto"
                value={formDataProduct.nombre}
                onChange={handleChange}
                name="nombre"
                className="input_Container"
                required
                />
            </div>
            <div className="line_container">
                <h3>Precio:</h3>
                <input
                type="number"
                min={0.0}
                step="any"
                id="precioProducto"
                value={formDataProduct.precio}
                onChange={handleChange2}
                name="precio"
                className="input_Container"
                required
                />
            </div>
            <div className="line_container">
                <h3>Categoria</h3>
                    <div className ="box2" style={{width: "51%"}}>
                        <select className ="select_Class" value={formDataProduct.categoria} onChange={(e)=> setformDataProduct({...formDataProduct, categoria: e.target.value})} >
                            <option key="vacio" value="vacio">Selecciona una categoria</option>
                            {   categorias.map( categoria=>
                                <option key={categoria} value={categoria}> {categoria}</option>
                            )}
                        </select>
                    </div>
            </div>
            <div className="line_container">
                <h3 style={{width:'30%'}}>Producto contable:</h3>
                {formDataProduct.id 
                    ? <p style={{width:50}}>{formDataProduct.contable ? "Si" : "No"}</p>
                    :<input
                        style={{width:25, height:25}}
                        type="checkbox"
                        name="contable"
                        checked={formDataProduct.contable}
                        onChange={handleCheckboxChange}
                    />
                }
                {formDataProduct.contable &&
                    <p><strong>Cantidad:</strong> {formDataProduct.cantidad}</p>
                }
            </div>
            {formDataProduct.extras[0] !== "empty" 
                ? <>
                {formDataProduct.extras.map( (extra, index) =>
                    <div key= {index} className="line_container">
                        <h3>Extra {index +1}:</h3>
                        <input
                            type="text"
                            id={index}
                            value={extra.desc}
                            onChange={handleChange3}
                            name="desc"
                            className="input_Container2"
                            required
                            />
                        <strong>Costo:</strong> 
                        <input
                            type="number"
                            min={0}
                            id={index}
                            value={extra.precio}
                            onChange={handleChange4}
                            name="precio"
                            className="input_Container2"
                            required
                        />
                        <div className="containerIcons">
                            <img  onClick={()=>reduceExtraProduct(index)}  src={iconReduceExtra} alt="iconQuitarExtra" className='iconForm'/>
                            {index+1 === formDataProduct.extras.length &&
                                <img onClick={()=>addEmptyExtraToProduct()} style={{marginLeft:15}}src={iconAddExtra} alt="iconAddExtra" className='iconForm'/>
                            }
                        </div>
                    </div>
                )}
            </>
                : <div className="line_container">
                        <h3 style={{width:'30%'}}>Agregar Extra </h3>
                        <img onClick={()=>addEmptyExtraToProduct()} src={iconAddExtra} alt="iconAddExtra" className='iconForm'/>
                   </div>
                }
            <center>
                <button  type="submit">Guardar</button>
            </center>
        </form>
    </div>
  );
};

export default FormProducto;