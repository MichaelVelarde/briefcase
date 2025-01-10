import React, { useRef, useEffect, useState  } from 'react';
import iconReduce from '../../assets/iconReduce.png';
import { printComandaWithEpson} from '../../services/printingPdf/PrintingPdf.js';
import {getCurrentTime, getCurrentDate} from '../../services/FunctionsTools.js';
import {getData,saveData,editData,decrementValue,getNroVenta, getCategoriaProductos,incrementValue,getVendedorPorDefecto} from '../../services/firebaseDB/FirebaseService.js';
import FromClient from '../formularios/FromClient.js';
import iconQuitar2 from '../../assets/iconQuitar2.png';
import iconEdit from '../../assets/iconEdit.png';
import iconAddClient from '../../assets/iconAddClient.png';
import './Venta.scss'; // Importar el archivo CSS para los estilos
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const emptyDataForComanda ={
  cliente : {nombre:'', nit:'' , telefono:''},
  vendedor :{nombre:"empty"},
  fecha: '',
  metodoPago : "Efectivo",
  hora: '',
  nroVenta: 1,
  subTotal: 0,
  descuento:0,
  productos: [],
}

const Venta = () => {
  const [initialComanda, setInitialComanda] = useState({...emptyDataForComanda});
  const [pageIsLoading, setPageIsLoading] = useState(false);
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [comanda, setComanda] = useState({...emptyDataForComanda});
  const [clientesData, setclientesData] = useState([]);
  const [categories, setCategorias] = useState(["Todos"]);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormClientOpen, setIsFormClientOpen] = useState(false);
  const [isComandaAnEdit, setIsComandaAnEdit]  = useState(false);
  const [comandaEditProducts ,setComandaEditProducts ] = useState([]);
  const componenteRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getProductosData() {
      const result = await getData("productos");
      if(result === null)
        setProducts([]);
      else
        setProducts(result);
    }
    async function getClientesData() {
      const result = await getData("clientes");
      if(result === null)
        setclientesData([]);
      else
        setclientesData(result);
    }
    async function getInitialComanda() {
      const data = location.state?.data;
      const result = await getNroVenta();
      const result2 = await getVendedorPorDefecto();
      if(data !== undefined){
        setComanda({...data})
        setComandaEditProducts(data.productos.map(product => ({ ...product })));
        setIsComandaAnEdit(true)
        if(result === null)
          if( result2 === null)
            setInitialComanda({...initialComanda})
          else
            setInitialComanda({...initialComanda, vendedor:result2})
        else
          if( result2=== null)
            setInitialComanda({...initialComanda, nroVenta : result.nroVenta })
          else
            setInitialComanda({...initialComanda, nroVenta : result.nroVenta , vendedor:result2})
      }
      else{
        if(result === null)
          if( result2 === null)
            setComanda({...initialComanda})
          else
            setComanda({...initialComanda, vendedor:result2})
        else
          if( result2=== null)
            setComanda({...initialComanda, nroVenta : result.nroVenta })
          else
            setComanda({...initialComanda, nroVenta : result.nroVenta , vendedor:result2})
      }
    }
    async function getCategorias() {
      const result = await getCategoriaProductos();
      if(result !== null){
        result.categoria.push("Todos");
        setCategorias(result.categoria);
      }
    }
    getCategorias();
    getInitialComanda();
    getClientesData();
    getProductosData();
  }, []);

  async function saveNewClient(client){
    setIsFormClientOpen(false);
    const idNewClient = await saveData("clientes", client)
    const newClientes = [...clientesData]
    newClientes.push({...client , id : idNewClient})
    setclientesData(newClientes)
    setIsFormClientOpen(false);
    setComanda({ ...comanda ,cliente :client });
  }
  
  async function editClientById(client){
    setIsFormClientOpen(false);
    let clienteCopy = { ...client };  
    delete clienteCopy.id;
    const indexClient =  clientesData.findIndex(c=> c.id === client.id);
    clientesData[indexClient] = client;
    setclientesData(clientesData);
    editData("clientes", client.id , clienteCopy);
    setComanda({ ...comanda ,cliente :client });
  }


  useEffect(() => {
    function handleClickOutside(event) {
      if (componenteRef.current && !componenteRef.current.contains(event.target)) {
        setIsFormClientOpen(false);
      }
    }
      document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClientSelect = (client) => {
    setComanda({ ...comanda ,cliente :client });
    setSearchTerm('');
  };
  const deselectClient = () => {
    setComanda({ ...comanda ,cliente :{nombre:'', nit:'' , telefono:''} });
    setSearchTerm('');
  };
  
  const filteredClients = clientesData.filter(client =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredProducts = products.filter((item) => {
    const nombreMatches = item.nombre.toLowerCase().includes(filter.toLowerCase());
    if (selectedCategory === "Todos") {
      return nombreMatches; // Filter by text if "Todos" is selected
    } else {
      return item.categoria === selectedCategory && nombreMatches; // Filter by category and text
    }
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };
  
  const reduceCantidadProduct = (product) =>{
    let comandaProducts = [...comanda.productos];
    let productIndex = comandaProducts.findIndex((p) => p.id === product.id);
    if (productIndex === -1) { 
      console.log("Como paso este suceso")
      return
    };

    let precioProduct = comandaProducts[productIndex].precio;

    if(product.contable){
      const newProducts = products.map((p) =>
        p.id === product.realId ? { ...p, cantidad: p.cantidad + 1 } : p
      );
      setProducts(newProducts);
    }

    if( comandaProducts[productIndex].cantidad >1)
      comandaProducts[productIndex] = {
        ...comandaProducts[productIndex],
        cantidad: comandaProducts[productIndex].cantidad - 1,
      };
    else
      comandaProducts.splice(productIndex,1)

    setComanda({ ...comanda ,subTotal: comanda.subTotal - precioProduct , productos: comandaProducts });
  }

  async function saveComandaAnVentaRapida(){
    setPageIsLoading(true);
    const comandaData = {...comanda , fecha: getCurrentDate(), hora:getCurrentTime()}
    setComanda({...initialComanda, nroVenta : comandaData.nroVenta+1 , vendedor : comandaData.vendedor});
    comandaData.productos.forEach( p=>{
      if(p.contable)
        decrementValue("productos", p.realId, "cantidad", p.cantidad)
    })
    incrementValue("DatosEstaticos", "keyNroVenta","nroVenta", 1)
    const idComanda = await saveData("comandas", comandaData)
    setPageIsLoading(false);
    navigate('/cobrarComanda', { state: { data: {...comandaData, id : idComanda} } })
  }


  async function saveComanda(needPrintPdf) {

    const comandaData = {...comanda , fecha: getCurrentDate(), hora:getCurrentTime()}
    setComanda({...initialComanda, nroVenta : comandaData.nroVenta+1 , vendedor : comandaData.vendedor});
    comandaData.productos.forEach( p=>{
      if(p.contable)
        decrementValue("productos", p.realId, "cantidad", p.cantidad)
    })
    incrementValue("DatosEstaticos", "keyNroVenta","nroVenta", 1)
    saveData("comandas", comandaData)
    if(needPrintPdf)
      await printComandaWithEpson(comandaData)
  }

  async function editComanda( needPrintPdf) {
    let comandaCopy = { ...comanda };  
    delete comandaCopy.id;
    let auxProductosEdit = comandaEditProducts.filter(product => product.contable);
    let auxProductsComanda = comanda.productos.filter(product => product.contable);
    auxProductsComanda.forEach( p=>{
      let indexP = auxProductosEdit.findIndex(auxP => auxP.id === p.id)
      if(indexP !== -1){
        auxProductosEdit[indexP].cantidad -= p.cantidad
        if(auxProductosEdit[indexP].cantidad > 0)
          incrementValue("productos", p.realId, "cantidad", auxProductosEdit[indexP].cantidad)
        if(auxProductosEdit[indexP].cantidad < 0)
          decrementValue("productos", p.realId, "cantidad", (-1*auxProductosEdit[indexP].cantidad))
        auxProductosEdit.splice(indexP,1)
      }
      else
        decrementValue("productos", p.realId, "cantidad", p.cantidad)      
    })
    if(auxProductosEdit.length>0)
      auxProductosEdit.forEach( pAux=>incrementValue("productos", pAux.realId, "cantidad", pAux.cantidad))

    editData("comandas",comanda.id, comandaCopy)
    setIsComandaAnEdit(false)
    setComanda({...initialComanda})
    
    if(needPrintPdf)
      await printComandaWithEpson(comandaCopy)
  }
  
  const addProduct = (product) => {
    if (product.cantidad > 0 || !product.contable ) {
      let idProduct = product.id;
      let precioProduct = product.precio;
      let nombreProduct = product.nombre;

      if(product.extras[0]!=="empty"){
        product.extras.forEach(extra => {
          if(checkedItems[product.id + extra.desc] || false){
            idProduct += extra.desc;
            precioProduct+= extra.precio;
            nombreProduct += " + " +extra.desc
          }
        });
      }
      let newComandaProductos = [...comanda.productos];
      let productIndex = newComandaProductos.findIndex((p) => p.id === idProduct);

      if (productIndex !== -1) {
        newComandaProductos[productIndex] = {
          ...newComandaProductos[productIndex],
          cantidad: newComandaProductos[productIndex].cantidad + 1,
        };
      } else 
        newComandaProductos.push({ ...product,nombre: nombreProduct ,realId: product.id, id:idProduct , precio : precioProduct, cantidad: 1 });

      setComanda({ ...comanda ,subTotal: comanda.subTotal+ precioProduct , productos: newComandaProductos });
      if(product.contable){
        const newProducts = products.map((p) =>
          p.id === product.id ? { ...p, cantidad: p.cantidad - 1 } : p
        );
        setProducts(newProducts);
      }
    }
    else return;
  };
  return (
    <>
    {pageIsLoading 
      ?<div className="spinner-container">
        <div className="spinner"></div>
      </div>
      :<div className="venta-container"> 
      <div className='menu-container'>    
        <div className='menu-title-line'>
          <h1>Menu</h1>
            <select className="select-category-box" onChange={handleCategoryChange} value={selectedCategory}>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            <div className="flter_withLbael" style={{marginTop:5 , marginLeft:5 }}>
                    Filtrar:  
                    <input 
                    className='filter_box'
                    type="text"
                    value={filter}
                    onChange={event => setFilter(event.target.value)}
                    placeholder="...producto"
                    />
            </div>
            <button className='ver_comandas_button' style={{marginTop:10, width : "20%"}}  onClick={()=>navigate('/cobrarComanda')}>Ver comandas </button>
        </div>
        <div className="product-cards">
          {filteredProducts.length ===0 &&
          <h1>No se encontraron productos.</h1>}
          {filteredProducts.map(product => (
            <div  key={product.id} className="product-card">
              <h2>{product.nombre}</h2>
              <p>Precio: {product.precio.toFixed(2)} Bs</p>
              {product.contable &&
                <p>Cantidad: {product.cantidad} </p>
              }
              {product.extras[0] !=="empty" &&
              <>
              {product.extras.map(extra => (
                <div key={product.id +extra.desc}>
                  <input
                    type="checkbox"
                    name={product.id + extra.desc}
                    checked={checkedItems[product.id +extra.desc] || false}
                    onChange={handleCheckboxChange}
                  />
                  <label>{extra.desc} + {extra.precio} Bs</label>
                </div>))}
              </>}
              <button onClick={()=> addProduct(product)}> Agregar</button>
            </div>
          ))}
        </div>
      </div>
      <div className="comanda-info" >
        <div className='client-info'>
          {comanda.cliente.nombre === "" && <>
            <div className='same_line2'>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar cliente..."
              />
              <img src={iconAddClient} alt="iconAddClient" className='icon'  onClick={()=>{ setIsFormClientOpen(true) }}/>
            </div>
            {searchTerm && (
              <ul className="client-list">
                {filteredClients.map(client => (
                  <li key={client.id} onClick={() => handleClientSelect(client)}>
                    {client.nombre} - Nit: {client.nit}
                  </li>
                ))}
              </ul>
            )}
          </>
          }
          {comanda.cliente.nombre !== "" && (<>
              <div className='same_line2'>
                <p><strong>Nombre:</strong> {comanda.cliente.nombre}</p>
                <img onClick={()=> deselectClient()} src={iconQuitar2} alt="iconQuitarClient" className='icon'/>
                <img onClick={()=>{setIsFormClientOpen(true) }} src={iconEdit} alt="iconEditClient" className='icon'/>
              </div>
              <div className='same_line'>
                <p><strong>NIT/CI:</strong> {comanda.cliente.nit}</p>
                <p><strong>Telefono:</strong> {comanda.cliente.telefono}</p>
              </div>
              <div className='same_line'>
                <p><strong>Nro. venta:</strong> {comanda.nroVenta}</p>
                <p><strong>SubTotal:</strong> {comanda.subTotal} Bs.</p>
              </div>
              </>
          )}
        </div>
       
          <div className="products-list">
          {comanda.productos.length>0 &&
            <div className="product-item">
              <div className="product-cell"><strong>Cantidad</strong></div>
              <div className="product-cell"><strong>Nombre</strong></div>
              <div className="product-cell"><strong>Precio</strong></div>
              <div className="product-cell"><strong>Cancel</strong></div>
            </div>
          }
          {comanda.productos.map((producto, index) => (
            <div key={index} className="product-item">
              <div className="product-cell">{producto.cantidad}</div>
              <div className="product-cell">{producto.nombre}</div>
              <div className="product-cell">{(producto.cantidad * producto.precio).toFixed(2)}</div>
              <div className="product-cell">
                <img src={iconReduce} alt="iconReduceProduct" className='icon' onClick={()=> reduceCantidadProduct(producto)}/>
              </div>
            </div>
          ))}
        </div>
        {isComandaAnEdit 
          ?<>
            <center style={{marginTop:"auto"}} >
              <button className='comanda_button_class'  onClick={()=> {setComanda({...initialComanda}); setIsComandaAnEdit(false) }} >Cancelar edicion</button>
            </center>
            { (comanda.cliente.nombre !=="" && comanda.productos.length>0) &&
              <div className='buttons_comanda-container' style={{marginTop:5}}>
                  <button className='comanda_button_class' onClick={async()=> editComanda(true) } >Imprimir Comanda</button>
                  <button className='comanda_button_class' onClick={async()=>  editComanda(false)}>Editar Comanda</button>
              </div>}
          </>
          :<>
            { (comanda.cliente.nombre !=="" && comanda.productos.length>0) &&
            <>
            <center style={{marginTop:"auto"}} ><button className='comanda_button_class' onClick={()=>  saveComandaAnVentaRapida()} >Venta Rapida</button></center>
              <div className='buttons_comanda-container' style={{marginTop:5}} >
                  <button className='comanda_button_class' onClick={async()=>  saveComanda(true)} >Imprimir Comanda</button>
                  <button className='comanda_button_class' onClick={async()=>   saveComanda(false)}> Crear Comanda</button>
              </div>
            </>    
            }
          </>
        }
      </div>
      {isFormClientOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FromClient
                saveNewClient= {saveNewClient}
                editClientById= {editClientById} 
                clientBody = {comanda.cliente}
                /></div></div>
        )}
    </div>
    }
    </>
  );
};

export default Venta;
