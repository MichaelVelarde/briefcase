import React, { useRef,useEffect, useState } from "react";
import {getData,deleteData,getItem, incrementValue,decrementValue} from '../../../services/firebaseDB/FirebaseService.js'
import CustomConfirmDialog from '../../customMessage/CustomConfirmDialog.js';
import iconDelete from '../../../assets/iconDelete.png';



function RegistroProducts ({backToProducts})  {
    const [productosRegistroData, setProductosRegistroData] = useState([]);
    const [selectedProduct, setselectedProduct] = useState({});
    const [filter, setFilter] = useState('');
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isConfirmDialogOpen2, setIsConfirmDialogOpen2] = useState(false);
    const componenteRef = useRef(null);

    useEffect(() => {
      async function getRegistrosProductos() {
        const result = await getData("entSalProductos");
        if(result === null)
            setProductosRegistroData([]);
        else
            setProductosRegistroData(result);
      }
      getRegistrosProductos();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
          if (componenteRef.current && !componenteRef.current.contains(event.target)) {
            setIsConfirmDialogOpen(false);
            setIsConfirmDialogOpen2(false);
          }
        }
          document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    async function deleteItemRegistro(){
        const productAux = await getItem("productos" ,selectedProduct.idP);
        if(!selectedProduct.isEntrada || selectedProduct.cantidad <= productAux.cantidad){
          const index = productosRegistroData.findIndex(item => item.id === selectedProduct.id)
          if(selectedProduct.isEntrada)
            decrementValue("productos",selectedProduct.idP, "cantidad", selectedProduct.cantidad)
          else
            incrementValue("productos",selectedProduct.idP, "cantidad", selectedProduct.cantidad)
          productosRegistroData.splice(index,1)
          deleteData("entSalProductos",selectedProduct.id )
          setProductosRegistroData(productosRegistroData);
          setIsConfirmDialogOpen(false);
        }
        else{
          setIsConfirmDialogOpen(false);
          setIsConfirmDialogOpen2(true);
        }
    }

    function cancelDeleteRegistro(){
        console.log(selectedProduct)
        setIsConfirmDialogOpen(false);
    }

    const inventarioResFiltered = productosRegistroData.filter((item) => {
        const nombreMaches = item.nombre.toLowerCase().includes(filter.toLowerCase());
        return nombreMaches;
    });

  return (
    <div className="body_for_Tables">
            <div className="containerFiltros"> 
                <button onClick={()=>backToProducts()} className="button_Registro" style={{width:150}} >Productos</button>
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
                        <th>Comentario</th>
                        <th>Cantidad</th>
                        <th>E/S</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Borrar</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   inventarioResFiltered.map(data =>
                        <tr key ={data.id} >
                            <td>{data.nombre}</td>
                            <td>{data.comentario}</td>
                            <td>{data.cantidad}</td>
                            <td>{data.isEntrada ?"Entrada" : "Salida"}</td>
                            <td>{data.fecha}</td>
                            <td>{data.hora}</td>
                            <td style={{ width: 100 }}>
                                  <img src={iconDelete} alt="iconAddClient" style={{width:25 , height:25}}
                                  onClick={()=> {setselectedProduct(data); setIsConfirmDialogOpen(true);}}/>
                            </td>
                        </tr>
                        )
                }
                    </tbody>
                </table>
            </div>

            {isConfirmDialogOpen && (<div className="overlay"><div ref={componenteRef}> 
                <CustomConfirmDialog
                message= {"¿Confirma borrar el registro del producto '" + selectedProduct.nombre +"'?"}
                onConfirm={deleteItemRegistro}
                onCancel={cancelDeleteRegistro}
                /></div></div>
            )}
            {isConfirmDialogOpen2 && (<div className="overlay"><div ref={componenteRef}> 
                <CustomConfirmDialog
                message= {"El producto '" + selectedProduct.nombre +"' no tiene suficiente cantidad para borrar este registro"}
                onCancel={()=>setIsConfirmDialogOpen2(false)}
                /></div></div>
            )}
    </div>
  );
};

  
export default RegistroProducts;