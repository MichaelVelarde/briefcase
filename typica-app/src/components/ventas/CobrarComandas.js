import React, { useState, useEffect , useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {getData,saveData,deleteData,incrementValue} from '../../services/firebaseDB/FirebaseService.js';
import { printComandaWithEpson, printVentaWithEpson} from '../../services/printingPdf/PrintingPdf.js'
import CustomConfirmDialog from "../customMessage/CustomConfirmDialog.js"
import iconQuitar2 from '../../assets/iconQuitar2.png';
import iconEdit from '../../assets/iconEdit.png';
import iconQr from '../../assets/iconQr.png';
import iconCash from '../../assets/iconCash.png';
import iconCreditCard from '../../assets/iconCreditCard.png';
import './CobrarComanda.scss'; // Importar el archivo CSS para los estilos


  
const CobrarComandas = () => {
  const [listComandas, setListComandas] = useState([]);
  const [filtrarPorNroVenta, setFiltrarPorNroVenta] = useState(false);
  const [filter, setFilter] = useState('');
  const [empleadosData, setempleadosData] = useState([]);
  const [selectedComanda, setSelectedComanda] = useState({cliente:{nombre :"empty"}});
  const [searchTerm, setSearchTerm] = useState('');
  const [isCurrency, setIsCurrency] = useState(true); // True for Bs, false for %
  const [discount, setDiscount] = useState(0);
  const [montoPago, setMontoPago] = useState(0);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const componenteRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (componenteRef.current && !componenteRef.current.contains(event.target)) {
        setIsConfirmDialogOpen(false);
      }
    }
      document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    async function searchForComandaData() {
      const data = location.state?.data;
      if(data !== undefined){
        setSelectedComanda(data); 
        setDiscount(0); 
        setMontoPago(0)
      }
    }

    async function getComandasData() {
      const result = await getData("comandas");
      if(result === null)
        setListComandas([]);
      else
        setListComandas(result.sort((a, b) => b.nroVenta - a.nroVenta));
    }
    async function getEmpleadosData() {
      const result = await getData("empleados");
      if(result === null)
        setempleadosData([]);
      else
        setempleadosData(result);
    }
    searchForComandaData();
    getEmpleadosData();
    getComandasData();
  }, []);

  async function generateVenta(needPrint){
    const index = listComandas.findIndex(comanda => comanda.id === selectedComanda.id)
    listComandas.splice(index,1)
    setListComandas(listComandas);
    let comandaCopy = { ...selectedComanda };  
    delete comandaCopy.id;
    saveData("ventas" , comandaCopy);
    deleteData("comandas",selectedComanda.id )
    if(needPrint)
      printVentaWithEpson(selectedComanda);
    setSelectedComanda({cliente:{nombre :"empty"}});
  }

  async function deleteComanda() {
    setIsConfirmDialogOpen(false);
    const index = listComandas.findIndex(comanda => comanda.id === selectedComanda.id)
    listComandas.splice(index,1)
    setListComandas(listComandas);
    selectedComanda.productos.forEach( p=>{
      if(p.contable)
        incrementValue("productos", p.realId, "cantidad", p.cantidad)
    })
    deleteData("comandas", selectedComanda.id);
    setSelectedComanda({cliente:{nombre :"empty"}});
  }
  function cancelDeleteComanda(){
    setIsConfirmDialogOpen(false);
  }


  const handleToggle = () => {
    setIsCurrency(!isCurrency);
    setSelectedComanda({...selectedComanda, descuento: 0})
    setDiscount(0); // Reset discount when toggling
  };

  const deSelectEmpleado = () => {
    setSelectedComanda({ ...selectedComanda ,vendedor :{nombre:'empty'} });
    setSearchTerm('');
  };

  const handleInputChange = (e) => {
    const valueDiscount = parseFloat(e.target.value);
    if(isCurrency){
        if(valueDiscount>selectedComanda.subTotal){
            setSelectedComanda({...selectedComanda, descuento: selectedComanda.subTotal})
            setDiscount(selectedComanda.subTotal);
        }
        else{
            setDiscount(valueDiscount ||0);
            setSelectedComanda({...selectedComanda, descuento: valueDiscount ||0})
        }    
    }
    else{
        if(valueDiscount>100){
            setSelectedComanda({...selectedComanda, descuento: selectedComanda.subTotal})
            setDiscount(100);
        }
        else{
            setDiscount(valueDiscount ||0);
            setSelectedComanda({...selectedComanda, descuento: selectedComanda.subTotal*(valueDiscount/100) ||0})
        }
    }
  };
  const incrementDiscount = (value) => {
    if(isCurrency){
        if((discount + value)<= selectedComanda.subTotal){
            setSelectedComanda({...selectedComanda, descuento: discount + value})
            setDiscount(discount + value);
        }
        else{
            setSelectedComanda({...selectedComanda, descuento: selectedComanda.subTotal})
            setDiscount(selectedComanda.subTotal);
        }
    } 
    else
        if((discount + value)<100){
            setDiscount(discount + value);
            setSelectedComanda({...selectedComanda, descuento: selectedComanda.subTotal*((discount + value)/100) ||0})
        }
        else{
            setDiscount(100);
            setSelectedComanda({...selectedComanda, descuento: selectedComanda.subTotal})
        }
            
  };


  const handleEmpleadoSelect = (empleado) => {
    setSelectedComanda({ ...selectedComanda ,vendedor :empleado });
    setSearchTerm('');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredClients = empleadosData.filter(empleado =>
    empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const comandasFiltradas = listComandas.filter((comanda) => {
    const filterStr = filter.toString();
    let result = false;
    if(filtrarPorNroVenta)
      result = comanda.nroVenta.toString().includes(filterStr);
    else
      result = comanda.cliente?.nombre?.toLowerCase().includes(filterStr.toLowerCase());
      
    return result; // Check if nroVenta contains the filter
  });
  
  return (
    <div className="venta-container"> 
     <div className='menu-container'>  
        <div className='same_line2'>
          <button className='ver_comandas_button' style={{marginLeft:0,marginBottom:12, width:"23%"}} onClick={()=>navigate('/venta')}>Punto de venta</button>
          <div className="switch-container">
            <label className="switch">
              <input type="checkbox" checked={filtrarPorNroVenta} onChange={()=>{setFiltrarPorNroVenta(!filtrarPorNroVenta); setFilter('')}} />
              <span className="slider"></span>
            </label>
            <p>{filtrarPorNroVenta ? "Nro. Venta" : "Cliente"}</p>
          </div>
          {filtrarPorNroVenta 
            ?<div className="flter_withLbael" style={{marginTop:5 , marginLeft:5 }}> 
            <input 
            className='filter_box'
            type="number"
            value={filter}
            onChange={event => setFilter(event.target.value)}
            placeholder="...numero de venta"
            />
            </div>
            :<div className="flter_withLbael" style={{marginTop:5 , marginLeft:5 }}> 
            <input 
            className='filter_box'
            type="text"
            value={filter}
            onChange={event => setFilter(event.target.value)}
            placeholder="...nombre cliente"
            />
            </div>
          }
          
        </div>
        {comandasFiltradas.length === 0
        && <h1>No se encontro ninguna comanda.</h1>
        }
       <div className="sales-container">
      {comandasFiltradas.map((sale) => (
        <div className="sale-box" key={sale.id}>
            <p>
                <strong>Comanda</strong> 
            </p> 
            <img onClick={()=>{setSelectedComanda(sale); setIsConfirmDialogOpen(true)}}src={iconQuitar2} alt="iconQuitarClient" className='icon'/>
            <img onClick={() => navigate('/venta', { state: { data: sale } })} src={iconEdit} alt="iconEditComanda" className='icon2'/>
            <p>
                <strong>Nro Venta:</strong> {sale.nroVenta}
            </p>
            <p>
                <strong>Cliente:</strong> {sale.cliente.nombre}
            </p>
            <p>
                <strong>Fecha:</strong> {sale.fecha}
            </p>
            <p>
                <strong>Hora:</strong> {sale.hora}
            </p>
            <p>
                <strong>Subtotal:</strong> {sale.subTotal.toFixed(2)} Bs.
            </p>
            <p>
                <strong>Productos:</strong> {sale.productos.length}
            </p>
            <button onClick={()=>printComandaWithEpson(sale)}>Imprimir </button>
            <button style={{marginLeft:"6%"}} onClick={()=> {setSelectedComanda(sale); setDiscount(0); setMontoPago(0)}}>Vender</button>
        </div>
      ))}
    </div>
    </div>
        {selectedComanda.cliente.nombre !=="empty" && !isConfirmDialogOpen &&
        <div className="comanda-info" >
          <div className='client-info'>
          {selectedComanda.vendedor.nombre === "empty" && <>
            <div className='same_line2'>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Seleccionar vendedor..."
              />
            </div>
            {searchTerm && (
              <ul className="client-list">
                {filteredClients.map(empleado => (
                  <li key={empleado.id} onClick={() => handleEmpleadoSelect(empleado)}>
                    {empleado.nombre} - Ci: {empleado.ci}
                  </li>
                ))}
              </ul>
            )}
          </>
          }
           {selectedComanda.vendedor.nombre !== "empty" &&
                <div className='same_line2'>
                    <p><strong>Vendedor:</strong> {selectedComanda.vendedor.nombre}</p>
                    <p style={{marginLeft:10}} ><strong>Ci:</strong> {selectedComanda.vendedor.ci}</p>
                    <img onClick={()=> deSelectEmpleado()} src={iconQuitar2} alt="iconQuitarClient" className='icon'/>         
                </div>
           }
              <div className='same_line'>
                <p><strong>Cliente:</strong> {selectedComanda.cliente.nombre}</p>
                <p><strong>Nit:</strong> {selectedComanda.cliente.nit}</p>
              </div>
              <div className='same_line3'>
                <p><strong>Nro Venta:</strong>{selectedComanda.nroVenta}</p>
                <p><strong>Fecha:</strong> {selectedComanda.fecha}</p>
                <p><strong>Hora:</strong> {selectedComanda.hora}</p>
              </div>
      </div>
        <div className="products-list" style={{gridTemplateColumns:"1fr 2fr 1fr"}}>
            <div className="product-item" >
              <div className="product-cell"><strong>Cantidad</strong></div>
              <div className="product-cell"><strong>Nombre</strong></div>
              <div className="product-cell"><strong>Precio</strong></div>
            </div>
          {selectedComanda.productos.map((producto, index) => (
            <div key={index} className="product-item" >
              <div className="product-cell">{producto.cantidad}</div>
              <div className="product-cell">{producto.nombre}</div>
              <div className="product-cell">{(producto.cantidad * producto.precio).toFixed(2)}</div>
            </div>
          ))}
        </div>
      <div className='same_line'>
          <p> <strong>Descuento:</strong> {selectedComanda.descuento.toFixed(2)}</p>
          <p> <strong>SubTotal:</strong> {selectedComanda.subTotal.toFixed(2)}</p>
      </div>
      <div className="discount-feature">
        <div className="toggle-container">
            <button className={`toggle-switch ${isCurrency ? 'currency' : 'percentage'}`} onClick={handleToggle}>
              {isCurrency ? 'Bs' : '%'}
            </button>
          <input
            type="number"
            value={discount}
            onChange={handleInputChange}
            min="0"
            className="discount-input"
          />
        </div>
        <div className="increment-buttons">
          {[0.5,1, 5, 10, 50, 100].map((value) => (
            <button key={value} onClick={() => incrementDiscount(value)}>
              +{value}
            </button>
          ))}
        </div>
      </div>
        <div className='same_line2'>
          <p style={{marginTop:20}}> <strong>Metodo de pago:</strong></p>
          <div className={`box_container_iconMetodo ${selectedComanda.metodoPago === 'Efectivo' ? 'selected2' : ''}`}
            onClick={()=> setSelectedComanda({...selectedComanda, metodoPago: "Efectivo"})}>
            <img src={iconCash} alt="iconMetodoCash" style={{width:60,height:50, marginLeft:5 , marginTop:5}} />
          </div>
          <div className={`box_container_iconMetodo ${selectedComanda.metodoPago === 'Tarjeta' ? 'selected2' : ''}`}
            onClick={()=> setSelectedComanda({...selectedComanda, metodoPago: "Tarjeta"})}>
            <img src={iconCreditCard} alt="iconMetodoCard" style={{width:60,height:50, marginLeft:5 , marginTop:5}} />
          </div>
          <div className={`box_container_iconMetodo ${selectedComanda.metodoPago === 'Qr' ? 'selected2' : ''}`}
            onClick={()=> setSelectedComanda({...selectedComanda, metodoPago: "Qr"})}>
            <img src={iconQr} alt="iconMetodoQr" style={{width:60,height:50, marginLeft:5 , marginTop:5}} />
          </div>
        </div>
        {selectedComanda.metodoPago ==="Efectivo" &&
        <div className='same_line2'> 
          <p style={{marginRight:10}}><strong>Monto:</strong></p>
          <input
            type="number"
            value={montoPago}
            onChange={(e)=> setMontoPago(parseFloat(e.target.value))}
            min="0"
            className="discount-input"
            style={{marginRight:10}}
          />
          <div className="increment-buttons">
            {[0.5, 1, 2, 5, 10, 50, 100].map((value) => (
              <button key={value} onClick={() => setMontoPago( montoPago + value)}>
                +{value}
              </button>
            ))}
          </div>
        </div>
        }
        {selectedComanda.metodoPago ==="Efectivo" &&
          <p><strong>{(selectedComanda.subTotal-selectedComanda.descuento)<=montoPago ? 'Cambio' : 'Falta'}: </strong>
          {(selectedComanda.subTotal-selectedComanda.descuento)<=montoPago 
          ?montoPago - (selectedComanda.subTotal-selectedComanda.descuento) : (selectedComanda.subTotal-selectedComanda.descuento)- montoPago}
          </p>
          
        }
        <p style={{fontSize:20}}> <strong>Total Bs:</strong> {(selectedComanda.subTotal-selectedComanda.descuento).toFixed(2)}</p>
        {selectedComanda.vendedor.nombre !=="empty" &&
          <div className='buttons_comanda-container'>
            <button className='comanda_button_class'
                onClick={()=>generateVenta(true)} >Imprimir venta</button>
            <button className='comanda_button_class'
                onClick={()=>generateVenta(false)} >Completar venta</button>
          </div>
        }  

         </div>}
        {isConfirmDialogOpen && (<div className="overlay"><div ref={componenteRef}> 
              <CustomConfirmDialog
              message= {"¿Cancelar la comanda numero: '" + selectedComanda.nroVenta +"'?"}
              onConfirm={deleteComanda}
              onCancel={cancelDeleteComanda}
              /></div></div>
          )}
    </div>
  );
};

export default CobrarComandas;
