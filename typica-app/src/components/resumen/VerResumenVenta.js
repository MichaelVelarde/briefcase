import React from "react";


function VerResumenVenta ({bodyVenta, volverResumen})  {

return (
    <div className="comanda-info" style={{width:500,height:"100%", maxHeight:"93vh"}}>
        <div className='client-info'>
            <div className='same_line'>
                <p><strong>Cliente:</strong> {bodyVenta.cliente.nombre}</p>
                <p><strong>NIT/CI:</strong> {bodyVenta.cliente.nit}</p>
            </div>
            <div className='same_line'>
                <p><strong>Vendedor:</strong> {bodyVenta.vendedor.nombre}</p>
                <p><strong>Metodo de pago:</strong> {bodyVenta.metodoPago}</p>
            </div>
            <div className='same_line'style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
                <p><strong>Nro. venta:</strong> {bodyVenta.nroVenta}</p>
                <p><strong>Fecha:</strong> {bodyVenta.fecha}</p>
                <p ><strong>Hora:</strong> {bodyVenta.hora}</p>
            </div>
            <div className='same_line' style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
                <p><strong>SubTotal:</strong> {bodyVenta.subTotal}</p>
                <p ><strong>Descuento:</strong> {bodyVenta.descuento}</p>
                <p ><strong>Total:</strong> {bodyVenta.subTotal-bodyVenta.descuento}</p>
            </div>
        </div>
        <div className="products-list" style={{gridTemplateColumns:"1fr 2fr 1fr"}}>
            <div className="product-item">
                <div className="product-cell"><strong>Cantidad</strong></div>
                <div className="product-cell"><strong>Nombre</strong></div>
                <div className="product-cell"><strong>Precio</strong></div>
            </div>
        {bodyVenta.productos.map((producto, index) => (
            <div key={index} className="product-item">
            <div className="product-cell">{producto.cantidad}</div>
            <div className="product-cell">{producto.nombre}</div>
            <div className="product-cell">{(producto.cantidad * producto.precio).toFixed(2)}</div>
            </div>
        ))}
        </div>
        <center>
            <button className='comanda_button_class'    onClick={()=>volverResumen()}>Cerrar venta</button>
        </center>
    </div> 
);
};

  
export default VerResumenVenta;
