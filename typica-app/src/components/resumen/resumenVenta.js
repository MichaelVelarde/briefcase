import React, { useRef, useEffect, useState  } from 'react';
import iconDate from '../../assets/iconDate.png'
import iconVerMas from '../../assets/iconVerMas.png'
import iconDelete from '../../assets/iconDelete.png'
import iconPdf from '../../assets/iconPdf.png'
import iconPrinter from '../../assets/iconPrinter.png'
import {getData,deleteData, saveData} from '../../services/firebaseDB/FirebaseService.js';
import {numberToMounth,getCurrentDate} from '../../services/FunctionsTools.js'
import {printResumenVentasWithEpson, printResumenDiaPdf,printVentaPdf,printVentaWithEpson} from "../../services/printingPdf/PrintingPdf.js"
import VerResumenVenta from './VerResumenVenta.js'
import CustomConfirmDialog from '../customMessage/CustomConfirmDialog.js';
import SelectDataMessage from '../customMessage/SelectDataMessage.js'


function ResumenVenta ()  {
    const [ventasData, setVentasData] = useState([]);
    const [showVentasEliminadas,setShowVentasEliminadas ] = useState(false);
    const [ventasCompletas, setVentasCompletas] = useState([]);
    const [ventasBorradas, setVentasBorradas] = useState([]);
    const [selectedVenta, setSelectedVenta] = useState("");
    const [dateSelected, setDateSelected] = useState(getCurrentDate());
    const [isPickDateFormOpen, setIsPickDateFormOpen] =  useState(false); 
    const [isResumenVentaOpen, setIsResumenVentaOpen] =  useState(false); 
    const [isDeleteMessageOpen, setIsDeleteMessageOpen] =  useState(false); 
    const [isMonthFiltered, setIsMonthFiltered] =  useState(false); 
    const [filter, setFilter] = useState('');
    const componenteRef = useRef(null);

    /*const ventaFiltered = ventasData.filter((data) => {
      const dateMaches = data.fecha.includes(dateSelected);
      return dateMaches;
    });*/

    const ventaFiltered = ventasData.filter((ventaData) => {
      const dateMaches = ventaData.fecha.includes(dateSelected);
      if(filter !=="" && dateMaches){
        const nroVentaStr = ventaData.nroVenta.toString(); // Convert nroVenta to string
        const filterStr = filter.toString(); // Convert filter to string
        return nroVentaStr.includes(filterStr);
      }
      else return dateMaches;
    });

  useEffect(() => {
    async function getVentasData() {
      const result = await getData("ventas");
      if(result === null){
        setVentasData([]);
        setVentasCompletas([]);
      }
      else{
        const ventasSorted = result.sort((a, b) => b.nroVenta - a.nroVenta)
        setVentasData(ventasSorted);
        setVentasCompletas(ventasSorted);
      }
    }
    async function getVentasEliminadasData() {
      const result = await getData("ventasEliminadas");
      if(result === null)
        setVentasBorradas([]);
      else
        setVentasBorradas(result.sort((a, b) => b.nroVenta - a.nroVenta));      
    }
    getVentasEliminadasData();
    getVentasData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (componenteRef.current && !componenteRef.current.contains(event.target)) {
        setIsResumenVentaOpen(false);
        setIsPickDateFormOpen(false);
        setIsDeleteMessageOpen(false);
      }
    }
      document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  async function deleteVenta(){
    setIsDeleteMessageOpen(false);
    const index = ventasData.findIndex(venta => venta.id === selectedVenta.id)
    ventasData.splice(index,1)
    setVentasData(ventasData);
    let copiaVenta = { ...selectedVenta };  
    delete copiaVenta.id;
    const idVentaEliminada = await saveData("ventasEliminadas",copiaVenta )
    const newVentasElimnadas = [...ventasBorradas]
    newVentasElimnadas.push({...copiaVenta , id : idVentaEliminada})
    setVentasBorradas(newVentasElimnadas)
    deleteData("ventas", selectedVenta.id);
  }

  async function cancelDeleteVenta(){
    setIsDeleteMessageOpen(false);
  }
  const changeDate = (date) => {
    setIsPickDateFormOpen(false);
    setDateSelected(date)
  };
  function cerrarVerVenta(){
    setIsResumenVentaOpen(false);
  }
  /*
  function generarResumenVentas(pdf){
    let auxRes = {fecha:dateSelected , efectivo: 0, tarjeta:0 ,qr: 0 ,vendedores:[], ventas :[] }
    let indexVendedor;
    ventaFiltered.forEach(venta =>{
      //Suma metodo de pago
      if(venta.metodoPago === "Efectivo")
        auxRes.efectivo += (venta.subTotal - venta.descuento);
      if(venta.metodoPago === "Tarjeta")
        auxRes.tarjeta += (venta.subTotal - venta.descuento);
      if(venta.metodoPago === "Qr")
        auxRes.qr += (venta.subTotal - venta.descuento);
      //Suma vendedor venta
      indexVendedor = auxRes.vendedores.findIndex(v  => v.id === venta.vendedor.id)

      if(indexVendedor <0)
        auxRes.vendedores.push({id:venta.vendedor.id , nombre: venta.vendedor.nombre , monto:(venta.subTotal - venta.descuento) })
      else
        auxRes.vendedores[indexVendedor].monto += (venta.subTotal - venta.descuento);
      //Add Venta
      auxRes.ventas.push({nroVenta: venta.nroVenta , subTotal: venta.subTotal , descuento: venta.descuento, productos: venta.productos })
    })
    //console.log(auxRes);
    if(pdf)
      printResumenDiaPdf(auxRes);
    else
      printResumenVentasWithEpson(auxRes);
  }*/

  function generarResumenVentas2(pdf){
    let auxRes = {fecha:dateSelected , efectivo: 0, tarjeta:0 ,qr: 0 ,vendedores:[], ventas :[], productos:[] }
    let indexVendedor;
    ventaFiltered.forEach(venta =>{
      //Suma metodo de pago
      if(venta.metodoPago === "Efectivo")
        auxRes.efectivo += (venta.subTotal - venta.descuento);
      if(venta.metodoPago === "Tarjeta")
        auxRes.tarjeta += (venta.subTotal - venta.descuento);
      if(venta.metodoPago === "Qr")
        auxRes.qr += (venta.subTotal - venta.descuento);
      //Suma vendedor venta
      indexVendedor = auxRes.vendedores.findIndex(v  => v.id === venta.vendedor.id)

      if(indexVendedor <0)
        auxRes.vendedores.push({id:venta.vendedor.id , nombre: venta.vendedor.nombre , monto:(venta.subTotal - venta.descuento) })
      else
        auxRes.vendedores[indexVendedor].monto += (venta.subTotal - venta.descuento);
      //Add Venta
      venta.productos.forEach( producto =>{
        let productId = producto.id;
        let descAux = ""
        if(venta.descuento !==0){
          descAux = (venta.descuento/venta.subTotal) * 100;
          productId =producto.id+"Desc:"+descAux
        }
        let index = auxRes.productos.findIndex(p => p.id === productId)

        if(index !== -1)
          auxRes.productos[index].cantidad += producto.cantidad;
        else{
          if(venta.descuento ===0)
            auxRes.productos.push({...producto, desc: 0})
          else
            auxRes.productos.push({...producto ,desc:descAux, id : productId})            
        }
      })
      auxRes.ventas.push({nroVenta: venta.nroVenta , subTotal: venta.subTotal , descuento: venta.descuento })

    })
    console.log(auxRes)
    if(pdf)
      printResumenDiaPdf(auxRes);
    else
      printResumenVentasWithEpson(auxRes);
  }
  
  function cambiarVentasMostradas(){
    if(showVentasEliminadas)
      setVentasData(ventasCompletas);
    else
      setVentasData(ventasBorradas);
    setShowVentasEliminadas(!showVentasEliminadas);
  }
  function calcularElTotalMes(ventasMes){
    let sumatoria = 0;
    ventasMes.forEach(venta => {
      sumatoria += (venta.subTotal - venta.descuento);
    });
    return sumatoria.toFixed(2);
  }

  return (
    <div>
         <ul className="ul2">
            {!showVentasEliminadas
                ? <>
                  <li  className="registroActual" >Ventas</li>
                  <li onClick={()=>cambiarVentasMostradas()}>Ventas eliminadas</li>
                </>
                : <>
                  <li onClick={()=>cambiarVentasMostradas()}>Ventas</li>
                  <li  className="registroActual" >Ventas eliminadas</li>
                </>
            }
        </ul>  
        <div className="body_for_Tables">
          {isMonthFiltered 
          ?<> 
            <div className="containerFiltros" style={{width:"95%" ,marginLeft:"2.5%", height:45 , justifyContent:'center', alignItems:'center'}}>
                <p><strong>{!showVentasEliminadas ? "Ventas: " : "Ventas eliminadas: "}</strong> {ventaFiltered.length}</p> 
                <p style={{marginLeft:20 , marginRight: 20}}><strong>Total(bs):</strong> {calcularElTotalMes(ventaFiltered)}</p> 
                <img  style={{width:25 , marginLeft:70,height:25, cursor:"pointer"}} alt="AddDate" src={iconDate} onClick={()=>setIsPickDateFormOpen(true)}/>
                <div style={{ marginLeft:10}}>
                    {numberToMounth(dateSelected.slice(-2))} de {dateSelected.slice(0,4)}
                </div>
                <div className="flter_withLbael" style={{marginTop:5 , marginLeft:20 }}>
                  <b>Filtrar:</b>  
                  <input 
                  className='filter_box'
                  type="number"
                  value={filter}
                  onChange={event => setFilter(event.target.value)}
                  placeholder="...numero de venta"
                  />
                </div>
            </div>
            <ul className="ul3" style={{ height:25 , width:"95%" ,marginLeft:"2.5%" }} >
              <li onClick={()=> {setIsMonthFiltered(!isMonthFiltered); setDateSelected(getCurrentDate())}}> Resumen diario </li>
              <li  className="registroActual" >Resumen mensual</li>
            </ul> 
          </>
          : <> 
          <div className="containerFiltros" style={{width:"95%" ,marginLeft:"2.5%",  height:45 , justifyContent:'center', alignItems:'center' }}>
            {(!showVentasEliminadas && ventaFiltered.length>0) &&
              <>
                <button className="button_Registro" style={{width:160 ,margin:0}} onClick={()=>generarResumenVentas2(false)}
                >Imprimir resumen</button>
                <button className="button_Registro" style={{width:130 ,margin:0, marginLeft:10}} onClick={()=>generarResumenVentas2(true)}
                >Pdf resumen</button>
              </>
            }
            <p style={{marginLeft:50}}><strong>{!showVentasEliminadas ? "Ventas: " : "Ventas eliminadas: "}</strong> {ventaFiltered.length}</p> 
            <p style={{marginLeft:20, marginRight:20}}><strong>Total(bs):</strong> {calcularElTotalMes(ventaFiltered)}</p> 
            <img  style={{width:25 , marginLeft:20,height:25, cursor:"pointer"}} alt="AddDate" src={iconDate} onClick={()=>setIsPickDateFormOpen(true)}/>
            <div style={{ marginLeft:10}}>
               {dateSelected.slice(-2)} de {numberToMounth(dateSelected.slice(5,7))} de {dateSelected.slice(0,4)}
          </div>
          <div className="flter_withLbael" style={{marginTop:5 , marginLeft:10 }}>
                  <b>Filtrar:</b>  
                  <input 
                  className='filter_box'
                  type="number"
                  value={filter}
                  onChange={event => setFilter(event.target.value)}
                  placeholder="...numero de venta"
                  />
                </div>
        </div>
        
        <ul className="ul3" style={{ height:25,width:"95%" ,marginLeft:"2.5%" }} >
              <li className="registroActual" > Resumen diario </li>
              <li  onClick={()=> {setIsMonthFiltered(!isMonthFiltered); setDateSelected(getCurrentDate().slice(0,7))}}  >Resumen mensual</li>
            </ul>  
        </>
      }
        <div  className="tabla-container" style={{paddingTop:0}}>       
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Nro. Venta</th>
                        <th>Cliente</th>
                        <th>Vendedor</th>
                        <th>Metodo(Pago)</th>
                        <th>Total</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   ventaFiltered.map(venta =>
                        <tr key ={venta.id} >
                            <td>{venta.nroVenta}</td>
                            <td>{venta.cliente.nombre}</td>
                            <td>{venta.vendedor.nombre}</td>
                            <td>{venta.metodoPago}</td>
                            <td>{venta.subTotal - venta.descuento}</td>
                            <td>{venta.fecha}</td>
                            <td>{venta.hora}</td>
                            <td style={{ width: 190 }} >
                                <div className="container_Iconos">
                                  <img onClick={()=>{setSelectedVenta(venta); setIsResumenVentaOpen(true)}} className="icon" alt="verMasVenta" src={iconVerMas} />
                                  <img onClick={()=>{printVentaWithEpson(venta)}} className="icon" alt="prinVentaPrinter" src={iconPrinter} />
                                  <img onClick={()=>{printVentaPdf(venta)}} className="icon" alt="printVentaPdf" src={iconPdf} />
                                  {!showVentasEliminadas &&
                                    <img onClick={()=>{setSelectedVenta(venta); setIsDeleteMessageOpen(true)}}  className="icon" alt="borrarVenta" src={iconDelete} />}
                                </div>
                            </td>
                        </tr>
                        )
                }
                    </tbody>
                </table>
            </div>
            </div>
            {isDeleteMessageOpen && (<div className="overlay"><div ref={componenteRef}> 
                <CustomConfirmDialog
                message= {"¿Confirma borrar la venta numero: '" + selectedVenta.nroVenta +"'?"}
                onConfirm={deleteVenta}
                onCancel={cancelDeleteVenta}
                /></div></div>
            )}
            {isPickDateFormOpen && (<div className="overlay"><div ref={componenteRef}> 
                <SelectDataMessage changeDate={changeDate} actualDate={dateSelected} /></div></div>
            )}
            {isResumenVentaOpen &&
            <div className="overlay"><div ref={componenteRef}> 
            <VerResumenVenta
              bodyVenta= {selectedVenta}
              volverResumen= {cerrarVerVenta} 
            />
            </div></div>
            }
    </div>
  );
};

  
export default ResumenVenta;