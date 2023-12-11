import React ,{ useRef,useEffect, useState } from "react";
import ResumenSeguimiento from "./ResumenSeguimiento.js"
import { getData, saveData, editData} from "../../services/mongodbService"
import {formatNumber,numberToMounth } from "../../services/formatService"
import FormNewDate from "../formSeguimiento/FormNewDate";
import iconNotShow from '../../assets/iconNotShow.png'
import iconShow from '../../assets/iconShow.png'
import addDateIcon from '../../assets/addDateIconWhite.png'
import './Resumen.css'

const Resumen = () => {
    //Alimentacion
    const [showAlimentacionTable, setShowAlimentacionTable] = useState(false);
    const [alimentacionCostoTotal, setAlimentacionCostoTotal] = useState(0);
    const [alimentacionTotal, setAlimentacionTotal] = useState( {cena:0,almuerzo:0,desayuno:0});
    const [alimentacionCurrectPrice, setAlimentacionCurrectPrice] = useState( {cena:0,almuerzo:0,desayuno:0});
    const [arrayAlimentacion, setArrayAlimentacion] = useState();
    const [alimentacionPrecios, setAlimentacionPrecios] = useState();
    //Compras
    const [showComprasTable, setShowComprasTable] = useState(false);
    const [comprasCostoTotal, setComprasCostoTotal] = useState(0);
    const [comprasArray, setComprasArray] = useState();
    const  [comprasCurrectDate, setComprasCurrectDate] = useState([]);
    //Ventas
    const [showVentasTable, setShowVentasTable] = useState(false);
    const [ventasGananciaTotal, setVentasGananciaTotal] = useState(0);
    const [ventaArray, setVentaArray] = useState();
    const  [ventasCurrectDate, setventasCurrectDate] = useState([]);
    //Persoanl
    const [showPersonalTable, setShowPersonalTable] = useState(false);
    const [personalGastoTotal, setPersonalGastoTotal] = useState(0);
    const [personalArray, setPersonalArray] = useState({undefined});
    const [personalActivoArray, setPersonalActivoArray] = useState([]);
    //GastoGeneral
    const [showGastosTable, setShowGastosTable] = useState(false);
    const [gastoGeneralTotal, setGastoGeneralTotal] = useState(0);
    const [gastoGeneralArray, setGastoGeneralArray] = useState();
    const  [gastoGeneralCurrectDate, setGastoGeneralCurrectDate] = useState([]);
    //Date, reload and more
    const [dataCalculed , setDataCalculed] = useState(false);
    const [registroSelected, setRegistroSelected] = useState('Finanzas');
    const [isFormNewDateOpen, setisFormNewDateOpen] = useState(false);
    const componenteRef = useRef(null);
    const [dateSelected, setDateSelected] = useState(getCurrentDate());
    const [reload, setReload] = useState(true);

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const formattedDate = `${year}-${month}`;
        return formattedDate;
    }
    useEffect(() => {
        function handleClickOutside(event) {
          if (componenteRef.current && !componenteRef.current.contains(event.target)) {
            setisFormNewDateOpen(false);
          }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    function calcularCurrentDate(){
        calcularAlmentacionMes(); 
        calcularComprasEsteMes();
        calcularVentasEsteMes();
        calcularGastoGeneralEsteMes();
        calcularPersonalGastoTotal();
        setDataCalculed(true);
    }
    async function savePersonalActivos(){
        let newArrayPersonalActivos = {_id: dateSelected , personal : []}
        personalArray.forEach(per =>{
            newArrayPersonalActivos.personal.push({ _id : per._id , activo : per.activo});
        })
        await editData("Resumen/PersonalActivo",newArrayPersonalActivos,newArrayPersonalActivos._id)
    }
    function changePersonalValue(idPersona) {
        let updatedGastoTotalPersonal = personalGastoTotal;
        const updatedPersonalArray = [...personalArray];
        const index = updatedPersonalArray.findIndex( personal => personal._id === idPersona);
        updatedPersonalArray[index].activo = !updatedPersonalArray[index].activo;
        if(updatedPersonalArray[index].activo)
            updatedGastoTotalPersonal += updatedPersonalArray[index].salario;
        else 
            updatedGastoTotalPersonal -= updatedPersonalArray[index].salario;
        setPersonalGastoTotal(updatedGastoTotalPersonal);
        setPersonalArray(updatedPersonalArray);
    }  
    
    async function calcularPersonalGastoTotal() {
        let totalCosto= 0;
        const index = personalActivoArray.findIndex( personal => personal._id === dateSelected);
        let auxArray = [];

        personalArray.forEach(element => {
            if( index === -1){
                auxArray.push({_id :element._id , activo : true })
                element["activo"] = true;
                totalCosto= element.salario + totalCosto ;
            }
            else if(personalActivoArray[index].personal.find( per => per._id === element._id).activo){
                totalCosto= element.salario + totalCosto ;
                element["activo"] = true;
            }
            else 
                element["activo"] = false; 
       });
       if( index === -1){
            const bodyPeronal = {_id: dateSelected , personal :auxArray }
            let auxPersonalActivo = personalActivoArray;
            auxPersonalActivo.push(bodyPeronal)
            await saveData("Resumen/PersonalActivo",bodyPeronal); 
            setPersonalActivoArray(auxPersonalActivo);
       }
       setPersonalGastoTotal(totalCosto);
    }
    function calcularComprasEsteMes() {
        let comprasThisDate = []
        let totalCosto= 0;
        comprasArray.forEach(element => {
            if(element.fecha.includes(dateSelected)){
                comprasThisDate.push(element);
                totalCosto= (element.cantidad * element.precio) + totalCosto
            }
       });
       setComprasCostoTotal(totalCosto);
       setComprasCurrectDate(comprasThisDate);
    }
    function calcularVentasEsteMes() {
        let ventasThisDate = [];
        let totalGanancia= 0;
        ventaArray.forEach(element => {
            if(element.fecha.includes(dateSelected)){
                ventasThisDate.push(element);
                totalGanancia = totalGanancia +(element.cantidad * element.precioUnitario)
            }
       });
       setVentasGananciaTotal(totalGanancia);
       setventasCurrectDate(ventasThisDate);
    }
    function calcularGastoGeneralEsteMes() {
        let gastosThisDate = [];
        let gastoTotal =0;
        gastoGeneralArray.forEach(element => {
            if(element.fecha.includes(dateSelected)){
                gastosThisDate.push(element);
                gastoTotal = gastoTotal + element.gasto;
            }      
       });
       setGastoGeneralTotal(gastoTotal)
       setGastoGeneralCurrectDate(gastosThisDate);
    }
    function calcularAlmentacionMes() {
        let aliTotal = {cena:0,almuerzo:0,desayuno:0}
        arrayAlimentacion.forEach(element => {
            if(element.fecha.includes(dateSelected)){
                aliTotal.almuerzo = aliTotal.almuerzo + element.almuerzo;
                aliTotal.cena = aliTotal.cena + element.cena;
                aliTotal.desayuno = aliTotal.desayuno + element.desayuno;
            }
       });
       let indexAli = alimentacionPrecios.findIndex( element => element.fecha.includes(dateSelected));
       setAlimentacionTotal(aliTotal);
       if(indexAli!==-1){
        setAlimentacionCurrectPrice(alimentacionPrecios[indexAli]);
        setAlimentacionCostoTotal(((aliTotal.cena * alimentacionPrecios[indexAli].cena)+(aliTotal.almuerzo * alimentacionPrecios[indexAli].almuerzo)+(aliTotal.desayuno * alimentacionPrecios[indexAli].desayuno))); 
       }
       else{
        setAlimentacionCurrectPrice({cena:0,almuerzo:0,desayuno:0});
        setAlimentacionCostoTotal(0);
       }
      }
    const pickDate = async (date) => {
        setAlimentacionCostoTotal(0);
        setComprasCostoTotal(0);
        setVentasGananciaTotal(0);
        setPersonalGastoTotal(0);
        setGastoGeneralTotal(0);
        setDataCalculed(false);
        setisFormNewDateOpen(false);
        setDateSelected (date)
    };

    useEffect(() => {
        async function getDataTable() {
            try {
                const alimentacion = await getData("Registro/Alimentacion"); 
                const preciosAli = await getData("Registro/AlimentacionPrecio"); 
                const compras = await getData("Registro/ComprasAlmacen"); 
                const ventas = await getData("Registro/Venta");
                const gastosgeneral = await getData("Registro/GastoGeneral");
                const personal = await getData("Registro/Personal");
                const personalActivo = await getData("Resumen/PersonalActivo");
                setPersonalActivoArray(personalActivo);
                setArrayAlimentacion(alimentacion);
                setAlimentacionPrecios(preciosAli);
                setComprasArray(compras);
                setVentaArray(ventas);
                setGastoGeneralArray(gastosgeneral);
                setPersonalArray(personal);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataTable();
        setReload(false);
    }, []);

    useEffect(() => {
        setReload(false);
    }, [reload]);
    
  return (
   <div>
            <ul className="ul3">
            {registroSelected === "Finanzas"
                ? <li  className="registroActual" >Resumen finanzas</li>
                : <li onClick={()=>setRegistroSelected("Finanzas")}>Resumen finanzas</li>
            }
            {registroSelected === "Seguimiento"
                ? <li  className="registroActual" >Resumen seguimiento</li>
                : <li onClick={()=>setRegistroSelected("Seguimiento")}>Resumen seguimiento</li>
            }
            </ul> 

        {(!reload && registroSelected === "Finanzas" ) &&
        <>
        <div className="container_deFiltrosAlmacen"> 
          <button className="button_Registro" style={{width:150}} onClick={ ()=>{ calcularCurrentDate() }}>Calcular datos</button>   
          <img className= "icon2" style={{marginLeft:10}} alt="AddDate" src={addDateIcon} onClick={() =>setisFormNewDateOpen(true)}/>
              <div className="FilterDate_forRegistro">
                  {numberToMounth(dateSelected.slice(-2))} de {dateSelected.slice(0,4)}
              </div>
          </div>   
        <div  className="tabla-container" style={{paddingTop:0}}>    
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Seccion</th>
                        <th>Tipo </th>
                        <th>Monto</th>
                    </tr>
                    </thead>               
                    <tbody>
                        <tr>
                            <td>Personal</td>
                            <td>Gasto</td>
                            <td style={{color:"red"}}>{formatNumber(personalGastoTotal)}</td>
                        </tr>
                        <tr>
                            <td>Compras</td>
                            <td>Gasto</td>
                            <td style={{color:"red"}}>{formatNumber(comprasCostoTotal)}</td>
                        </tr>
                        <tr>
                            <td>Alimentacion</td>
                            <td>Gasto</td>
                            <td style={{color:"red"}}>{formatNumber(alimentacionCostoTotal)}</td>
                        </tr>
                        <tr>
                            <td>Gastos generales</td>
                            <td>Gasto</td>
                            <td style={{color:"red"}}>{formatNumber(gastoGeneralTotal)}</td>
                        </tr>
                        <tr>
                            <td>Ventas</td>
                            <td>Ganancia</td>
                            <td >{formatNumber(ventasGananciaTotal)}</td>
                        </tr>
                        <tr>
                            <td>--</td>
                            <td><b>Utilidad</b></td>
                            <td><b>{formatNumber((ventasGananciaTotal-comprasCostoTotal-alimentacionCostoTotal-gastoGeneralTotal-personalGastoTotal ))}</b></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {dataCalculed &&
            <>
            {showPersonalTable 
                ?<div className="line_For_Table_Title">Tabla de personal
                <img className= "icons_showTable"  alt="notshowAli" src={iconNotShow}  onClick={ ()=> {setShowPersonalTable(false) } } />
                <button className="button_save_activos"  onClick={ ()=>{ savePersonalActivos() }}>Guardar Cambios</button> </div>
                :<div className="line_For_Table_Title">Tabla de personal<img className= "icons_showTable"  alt="showAli"  src={iconShow}  onClick={ ()=> {setShowPersonalTable(true) } } /></div>
            }
            {showPersonalTable &&
            <div  className="tabla-container" style={{paddingTop:0}}>       
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Activo</th>
                        <th>C.I.</th>
                        <th>Nombre</th>
                        <th>Cargo</th>
                        <th>Gasto(bs)</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   personalArray.map(data =>
                        <tr key ={data._id} >
                            <td onClick={()=>changePersonalValue(data._id)}>{data.activo 
                                ?<>Si</>
                                :<>No</>}
                            </td>
                            <td>{data.ci}</td>
                            <td>{data.nombre}</td>
                            <td>{data.cargo}</td>
                            <td>{data.activo 
                                ?<>{formatNumber(data.salario)}</>
                                :<>0</>}</td>
                        </tr>
                        )}
                        <tr>
                            <td> -- </td>
                            <td> -- </td>
                            <td> -- </td>
                            <td> <b>Total</b></td>
                            <td>{formatNumber(personalGastoTotal)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>}
            {showGastosTable 
                ?<div className="line_For_Table_Title">Tabla de gastos<img className= "icons_showTable"  alt="notshowAli" src={iconNotShow}  onClick={ ()=> {setShowGastosTable(false) } } /></div>
                :<div className="line_For_Table_Title">Tabla de gastos<img className= "icons_showTable"  alt="showAli"  src={iconShow}  onClick={ ()=> {setShowGastosTable(true) } } /></div>
            }
            {showGastosTable &&
            <div  className="tabla-container" style={{paddingTop:0}}>       
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Detalle</th>
                        <th>Gasto (bs)</th>
                    </tr>
                    </thead>               
                    <tbody>
                    {   gastoGeneralCurrectDate.map(data =>
                        <tr key ={data._id} >
                            <td>{data.fecha}</td>
                            <td>{data.detalle}</td>
                            <td>{formatNumber(data.gasto)}</td>
                        </tr>
                        )}
                        <tr>
                            <td> -- </td>
                            <td> <b>Total</b></td>
                            <td>{formatNumber(gastoGeneralTotal)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>}
        {showAlimentacionTable 
            ?<div className="line_For_Table_Title">Tabla de alimentacion<img className= "icons_showTable"  alt="notshowAli" src={iconNotShow}  onClick={ ()=> {setShowAlimentacionTable(false) } } /></div>
            :<div className="line_For_Table_Title">Tabla de alimentacion<img className= "icons_showTable"  alt="showAli"  src={iconShow}  onClick={ ()=> {setShowAlimentacionTable(true) } } /></div>
        }
        {showAlimentacionTable &&
        <div  className="tabla-container" style={{paddingTop:0}}>    
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Plato</th>
                        <th>Cantidad </th>
                        <th>Precio unitario</th>
                        <th>Total (bs) </th>
                    </tr>
                    </thead>               
                    <tbody>
                        <tr>
                            <td>Desayuno</td>
                            <td>{alimentacionTotal.desayuno}</td>
                            <td>{alimentacionCurrectPrice.desayuno}</td>
                            <td>{formatNumber(alimentacionTotal.desayuno * alimentacionCurrectPrice.desayuno)}</td>
                        </tr>
                        <tr>
                            <td>Almuerzo</td>
                            <td>{alimentacionTotal.almuerzo}</td>
                            <td>{alimentacionCurrectPrice.almuerzo}</td>
                            <td>{formatNumber(alimentacionTotal.almuerzo * alimentacionCurrectPrice.almuerzo)}</td>
                        </tr>
                        <tr>
                            <td>Cena</td>
                            <td>{alimentacionTotal.cena}</td>
                            <td>{alimentacionCurrectPrice.cena}</td>
                            <td>{formatNumber(alimentacionTotal.cena * alimentacionCurrectPrice.cena)}</td>
                        </tr>
                        <tr>
                            <td>--</td>
                            <td>--</td>
                            <td> <b>Total</b></td>
                            <td>{formatNumber(alimentacionCostoTotal)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>}
        {showComprasTable 
            ?<div className="line_For_Table_Title">Tabla de compras<img className= "icons_showTable" alt="notshowAli" src={iconNotShow}  onClick={ ()=> {setShowComprasTable(false) } } /></div>
            :<div className="line_For_Table_Title">Tabla de compras<img className= "icons_showTable"  alt="showAli"  src={iconShow}  onClick={ ()=> {setShowComprasTable(true) } } /></div>
        }
        {showComprasTable &&
            <div  className="tabla-container" style={{paddingTop:0}}>    
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Item</th>
                        <th>Cantidad </th>
                        <th>Precio unitario</th>
                        <th>Total (bs) </th>
                    </tr>
                    </thead>               
                    <tbody>
                    {comprasCurrectDate.map(data =>
                        <tr>
                            <td>{data.item.nombre}</td>
                            <td>{formatNumber(data.cantidad)}</td>
                            <td>{formatNumber(data.precio)}</td>
                            <td>{formatNumber(data.precio*data.cantidad)}</td>
                        </tr>
                        )}
                        <tr>
                            <td>--</td>
                            <td>--</td>
                            <td><b>Total</b></td>
                            <td>{formatNumber(comprasCostoTotal)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            }
            {showVentasTable 
                ?<div className="line_For_Table_Title">Tabla de ventas<img className= "icons_showTable"  alt="notshowAli" src={iconNotShow}  onClick={ ()=> {setShowVentasTable(false) } } /></div>
                :<div className="line_For_Table_Title">Tabla de ventas<img className= "icons_showTable"  alt="showAli"  src={iconShow}  onClick={ ()=> {setShowVentasTable(true) } } /></div>
            }
            {showVentasTable &&
            <div  className="tabla-container" style={{paddingTop:0}}>    
                <table className="tabla">
                    <thead>
                    <tr>
                        <th>Item</th>
                        <th>Cantidad </th>
                        <th>Precio unitario</th>
                        <th>Total (bs) </th>
                    </tr>
                    </thead>               
                    <tbody>
                    {ventasCurrectDate.map(data =>
                        <tr>
                            <td>{data.mineral.nombre}</td>
                            <td>{formatNumber(data.cantidad)}</td>
                            <td>{formatNumber(data.precioUnitario)}</td>
                            <td>{formatNumber(data.precioUnitario*data.cantidad)}</td>
                        </tr>
                        )}
                        <tr>
                            <td>--</td>
                            <td>--</td>
                            <td><b>Total</b></td>
                            <td>{formatNumber(ventasGananciaTotal)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>}

            </>}
            </>}
            {registroSelected === "Seguimiento" && 
                <ResumenSeguimiento />
            }
            {isFormNewDateOpen && (<div className="overlay"><div ref={componenteRef}> 
                <FormNewDate pickDate={pickDate} actualDate={dateSelected} /></div></div>
            )}

   </div>
  );
};

export default Resumen;