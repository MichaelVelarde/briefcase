import React, { useRef,useEffect, useState } from "react";
import {getData,saveData,editData,deleteItemAndRes, incrementValue,decrementValue} from '../../../services/firebaseDB/FirebaseService.js';
import RegistroProducts from './RegistroProducts.js'
import FormProducto from '../../formularios/FormProducto.js';
import iconChangeStorage from '../../../assets/iconChangeStorage.png';
import CustomConfirmDialog from '../../customMessage/CustomConfirmDialog.js';
import FormInOutStorage from '../../formularios/FormInOutStorage.js'
import iconDelete from '../../../assets/iconDelete.png';
import iconEdit from '../../../assets/iconEdit.png';


function Productos ()  {
    const [showRegistro, setShowRegistro] = useState(false);
    const [productData, setProductData] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedProduct, setSelectProduct] = useState({nombre: '',categoria: "",contable: true, precio: 0 , cantidad: 0, extras : ["empty"]});
    const [isFormProductOpen, setisFormProductOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isFormInOutStorageOpen, setIsFormInOutStorageOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const componenteRef = useRef(null);


    useEffect(() => {
      function handleClickOutside(event) {
        if (componenteRef.current && !componenteRef.current.contains(event.target)) {
          setisFormProductOpen(false);
          setIsConfirmDialogOpen(false);
          setIsFormInOutStorageOpen(false);
        }
      }
        document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    useEffect(() => {
      async function getProductosData() {
        const result = await getData("productos");
        if(result === null)
            setProductData([]);
        else
            setProductData(result);
      }
      getProductosData();
    }, [reload]);


    async function saveNewProduct(product){
        setisFormProductOpen(false);
        const idNewProduct = await saveData("productos", product)
        const newProducts = [...productData]
        newProducts.push({...product , id : idNewProduct})
        setProductData(newProducts)
        
    }
    
    async function editProductById(product){
        setisFormProductOpen(false);
        let productCopy = { ...product };  
        delete productCopy.id;
        const indexProduct =  productData.findIndex(p=> p.id === product.id);
        productData[indexProduct] = product;
        setProductData(productData)
        editData("productos", product.id , productCopy)
    }
    async function deleteProduct(){
      setIsConfirmDialogOpen(false);
      const index = productData.findIndex(product => product.id === selectedProduct.id)
      productData.splice(index,1)
      await deleteItemAndRes("productos","entSalProductos", selectedProduct.id)
      setProductData(productData);
    }
  
    function cancelDeleteProduct(){
      setIsConfirmDialogOpen(false);
    }
    async function changeQuantity(body) {
      setIsFormInOutStorageOpen(false);
      const index = productData.findIndex(product => product.id === body.idP)
      if(body.isEntrada){
        productData[index].cantidad +=body.cantidad;
        incrementValue("productos",body.idP, "cantidad", body.cantidad)
      }
      else{
        productData[index].cantidad -=body.cantidad;
        decrementValue("productos",body.idP, "cantidad", body.cantidad)
      }    
      saveData("entSalProductos", body)
    }

    function getExtrasText(extras, text) {
        if (extras.length === 1) 
            return text + extras[0].desc;
         else 
            return getExtrasText(extras.slice(1), text + extras[0].desc + ", ");
    }


    const productsFiltered = productData.filter((item) => {
        const nombreMaches = item.nombre.toLowerCase().includes(filter.toLowerCase());
        return nombreMaches;
      });
    function backToProducts(){
      setShowRegistro(false);
      setReload(!reload)
    }

  return (
    <div>
      {!showRegistro &&
    <div className="body_for_Tables">
            <div className="containerFiltros"> 
                <button className="button_Registro" style={{width:150}} 
                        onClick={()=> setShowRegistro(true)}>Ver S/E Productos</button>
                <button className="button_Registro" style={{width:150}} 
                      onClick={()=>{setSelectProduct({nombre: '',categoria: "",contable: true, precio: 0 , cantidad: 0, extras : ["empty"]}); setisFormProductOpen(true); }} 
                      >Nuevo producto</button>
                <div className="flter_withLbael">
                    Filtrar:  
                    <input 
                    className='filter_box'
                    type="text"
                    value={filter}
                    onChange={event => setFilter(event.target.value)}
                    placeholder="...nombre"
                    />
                </div>
            </div>
        
        <div  className="tabla-container" style={{paddingTop:0}}>       
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Categoria</th>
                        <th>Extras</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   productsFiltered.map(data =>
                        <tr key ={data.id} >
                            <td>{data.nombre}</td>
                            <td>{data.precio}</td>
                            {data.contable 
                                ?   <td>{data.cantidad}</td>
                                :   <td> ---</td>
                            }
                            <td>{data.categoria}</td>
                            {data.extras[0] ==="empty" 
                                ?   <td> ---</td>
                                :   <td> {getExtrasText(data.extras, "")}</td>
                            }
                            <td style={{ width: 200 }}>
                              <div className="container_Iconos">
                                {data.contable  && <>
                                  <img src={iconChangeStorage} alt="iconAddClient" className='icon' 
                                  onClick={()=> {setSelectProduct(data); setIsFormInOutStorageOpen(true);}}/>
                                </>}
                                  <img src={iconEdit} alt="iconAddClient" className='icon' 
                                  onClick={()=>{setSelectProduct(data); setisFormProductOpen(true); }} />

                                  <img src={iconDelete} alt="iconAddClient" className='icon' 
                                  onClick={()=>{setSelectProduct(data); setIsConfirmDialogOpen(true); }} />
                              </div>
                            </td>
                        </tr>
                        )
                }
                    </tbody>
                </table>
            </div>
            {isConfirmDialogOpen && (<div className="overlay"><div ref={componenteRef}> 
                <CustomConfirmDialog
                message= {"¿Confirma borrar el producto '" + selectedProduct.nombre +"'?"}
                onConfirm={deleteProduct}
                onCancel={cancelDeleteProduct}
                /></div></div>
            )}
            {isFormInOutStorageOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormInOutStorage
                changeQuantity={changeQuantity}
                body={selectedProduct}
                /></div></div>
            )}
            
            {isFormProductOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormProducto
                saveNewProduct= {saveNewProduct}
                editProductById= {editProductById} 
                productBody = {selectedProduct}
                /></div></div>
            )} 
            
       </div>
    }
    {showRegistro &&
    <RegistroProducts backToProducts={backToProducts}/>
    }
    </div>
  );
};

export default Productos;