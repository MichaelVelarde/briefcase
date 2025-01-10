import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import logoTypica from "../../assets/logoTypica.png"

export const printVentaPdf = async (venta) => {
      let bodyProducts =[];
      venta.productos.forEach( (producto) =>{
        bodyProducts.push([`${producto.nombre}`,`${producto.cantidad}`,`${producto.precio.toFixed(2)}`,`${(producto.cantidad * producto.precio).toFixed(2)}`])
      })

      const pageHeight = 105 + (venta.productos.length *4.25)
      let pageOrientation = "portrait"

      const doc = new jsPDF({
        orientation: pageOrientation,
        unit: "mm",
        format: [80, pageHeight]
      });

      const imgWidth = 30; // Width of the image in the PDF
      const imgHeight = 37.5; // Height of the image in the PDF
      const xCenter = (80 - imgWidth) / 2;  // Calculate x position to center the image
      doc.addImage(logoTypica, 'PNG', xCenter, 0, imgWidth, imgHeight, undefined,'FAST'); 
      
      let line = 40;
      const lineHeight =4;
      const lineGapText = '--------------------------------------------------------------------------'
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('VENTA', doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
      line+=lineHeight;
      doc.text('PEDIDO: '+venta.nroVenta, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
      line+=lineHeight;
      doc.text('FECHA: '+venta.fecha+' - HORA: '+venta.hora, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
      line+=lineHeight;
      doc.text(lineGapText, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
      autoTable(doc, {
        theme : 'plain',
        styles: { fontSize:8 , cellPadding: 0.5 },
        startY: line,
        tableWidth: 'auto',
        margin: { left: 5, right: 3},
        head: [['DETALLE', 'CANT', 'P.UNIT', 'TOTAL']],
        body: bodyProducts,
      })
      const tableHeight = doc.lastAutoTable.finalY - line;
      line+=tableHeight + lineHeight;
      doc.text('Subtotal (Bs):       '+venta.subTotal.toFixed(2), 73, line, { align: 'right' });
      line+=lineHeight;
      doc.text('Descuento (Bs):       '+venta.descuento.toFixed(2), 73, line, { align: 'right' });
      line+=lineHeight;
      doc.text('Total (Bs):        '+(venta.subTotal - venta.descuento).toFixed(2), 73, line, { align: 'right' });
      line+=lineHeight;
      doc.text(lineGapText, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
      line+=lineHeight;
      doc.text('Metodo de pago: '+venta.metodoPago,doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
      line+=lineHeight;
      doc.text('Vendedor: '+ venta.vendedor.nombre, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
      line+=lineHeight;
      doc.text(lineGapText, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
      line+=lineHeight;
      doc.text('NIT/CI: '+venta.cliente.nit, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
      line+=lineHeight;
      doc.text('SEÑOR(ES): '+ venta.cliente.nombre, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
      doc.save("ventaNro" +venta.nroVenta+ ".pdf");

}

/*
export const printComandaPdf = async (comanda) => {
  
   let bodyProducts =[];
   comanda.productos.forEach( (producto) =>{
     bodyProducts.push([`${producto.cantidad}`,`${producto.nombre}`])
   })
   const pageHeght = 40 + (comanda.productos.length *4.25)
   let pageOrientation = "portrait"
   if(pageHeght <80)
      pageOrientation = "landscape"
    
   const doc = new jsPDF({
    orientation: pageOrientation,
    unit: "mm",
    format: [80, pageHeght]
    });
   
   let line = 8;
   const lineHeight =4;
   const lineGapText = '--------------------------------------------------------------------------'
   doc.setFont('helvetica', 'normal');
   doc.setFontSize(8);
   doc.text('COMANDA', doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
   line+=lineHeight;
   doc.text('PEDIDO: '+comanda.nroVenta, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
   line+=lineHeight;
   doc.text('FECHA: '+comanda.fecha+' - HORA: '+comanda.hora, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
   line+=lineHeight;
   doc.text(lineGapText, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
   autoTable(doc, {
     theme : 'plain',
     styles: { fontSize:8 , cellPadding: 0.5 },
     startY: line,
     tableWidth: 'auto',
     margin: { left: 5, right: 1},
     head: [['CANT', 'PRODUCTO']],
     body: bodyProducts,
   })
   const tableHeight = doc.lastAutoTable.finalY - line;
   line+=tableHeight + lineHeight;
   doc.text(lineGapText, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
   line+=lineHeight;
   doc.text('CLIENTE: '+comanda.cliente.nombre, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
   doc.save("comandaNro" +comanda.nroVenta+ ".pdf");

}*/

export const printResumenDiaPdf = async (resumen) => {
  let bodyVentas =[];
  let bodyproductos =[];
  resumen.ventas.forEach( (venta) =>{
    bodyVentas.push([`Nro: ${venta.nroVenta}`,`${parseFloat(venta.descuento).toFixed(2)}`,`${parseFloat(venta.subTotal).toFixed(2)}`,`${parseFloat(venta.subTotal-venta.descuento).toFixed(2)}`])
  })
  resumen.productos.forEach( (product) =>{
    bodyproductos.push([`${product.nombre}`,`${parseFloat(product.desc).toFixed(1)}%`,`${product.cantidad}`,`${parseFloat((product.cantidad*product.precio)*(1-(product.desc/100))).toFixed(2)}`])
  })

  const pageHeight  = 98 + (resumen.ventas.length *4.25) +(resumen.vendedores.length*4)+(resumen.productos.length*4.25);
  let pageOrientation = "portrait"
   
  const doc = new jsPDF({
    orientation: pageOrientation,
    unit: "mm",
    format: [80, pageHeight ]
  });

  const imgWidth = 30; // Width of the image in the PDF
  const imgHeight = 37.5; // Height of the image in the PDF
  const xCenter = (80 - imgWidth) / 2;  // Calculate x position to center the image
  doc.addImage(logoTypica, 'PNG', xCenter, 0, imgWidth, imgHeight, undefined,'FAST'); 
      
  let line = 40;
  const lineHeight =4;
  const lineGapText = '--------------------------------------------------------------------------'
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('RESUMEN', doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
  line+=lineHeight;
  doc.text('FECHA: '+resumen.fecha, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
  line+=lineHeight;
  doc.text(lineGapText, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
  autoTable(doc, {
    theme : 'plain',
    styles: { fontSize:8 , cellPadding: 0.5 },
    startY: line,
    tableWidth: 'auto',
    margin: { left: 5, right: 1},
    head: [['N. VENTA', 'DESCUENTO', 'SUBTOTAL', 'TOTAL']],
    body: bodyVentas,
  })
  line+=(doc.lastAutoTable.finalY - line) + lineHeight;
  doc.text(lineGapText, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
  line+=lineHeight;
  autoTable(doc, {
    theme : 'plain',
    styles: { fontSize:8 , cellPadding: 0.5 },
    startY: line,
    tableWidth: 'auto',
    margin: { left: 5, right: 1},
    head: [['PRODUCTO', 'DESC', 'CANT', 'TOTAL(BS)']],
    body: bodyproductos,
  })
  line+=(doc.lastAutoTable.finalY - line) + lineHeight;
  doc.text(lineGapText, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
  line+=lineHeight;
  doc.text('MONTO POR METODO DE PAGO', doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
  line+=lineHeight;
  doc.text('Efectivo: '+resumen.efectivo, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
  line+=lineHeight;
  doc.text('Tarjeta: '+resumen.tarjeta, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
  line+=lineHeight;
  doc.text('Qr: '+resumen.qr, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
  line+=lineHeight;
  doc.text('Total(Bs): '+(resumen.qr +resumen.tarjeta +resumen.efectivo), doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
  line+=lineHeight;
  doc.text(lineGapText, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
  line+=lineHeight;
  doc.text('MONTO POR VENDEDOR', doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
  resumen.vendedores.forEach( vendedor => {
    line+=lineHeight;
    doc.text(vendedor.nombre+': ' +vendedor.monto, doc.internal.pageSize.getWidth() / 2, line, { align: 'center' });
  })
  doc.save("resumenVentas" +resumen.fecha+ ".pdf");
}
export const printResumenVentasWithEpson = async (resumen) => {
  let arrHtml = getResumenVentasHtmlContent2(resumen);
  if (!(arrHtml instanceof Array)) throw 'Este argumento debe ser un Array'
  const ipcRenderer = window.ipcRenderer;
  try {
    const response = await ipcRenderer.invoke('print-command', arrHtml);
    console.log(response); // Should log "Print job completed!"
  } catch (error) {
    console.error('Printing failed:', error);
  }
}

export const printVentaWithEpson = async (venta) => { 
  let arrHtml = getVentaHtmlContent(venta);
  if (!(arrHtml instanceof Array)) throw 'Este argumento debe ser un Array'
  const ipcRenderer = window.ipcRenderer;
  try {
    const response = await ipcRenderer.invoke('print-command', arrHtml);
    console.log(response); // Should log "Print job completed!"
  } catch (error) {
    console.error('Printing failed:', error);
  }
};

export const printComandaWithEpson = async (comanda) => { 
  let arrHtml = getComandaHtmlContent(comanda);
  if (!(arrHtml instanceof Array)) throw 'Este argumento debe ser un Array'
  const ipcRenderer = window.ipcRenderer;
  try {
    const response = await ipcRenderer.invoke('print-command', arrHtml);
    console.log(response); // Should log "Print job completed!"
  } catch (error) {
    console.error('Printing failed:', error);
  }
};
               
const getResumenVentasHtmlContent2 = (resumen)=>{
  let htmlResumen = `
  <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Hello World!</title>
          <style>
                * {
                      font-size: 11px;
                      font-family: 'helvetica';
                    }
                    table {
                      width: 100%;
                      table-layout: fixed; /* Ensure the table fills the available space */
                    }

                    p {
                      margin: 1px;
                      padding: 0;
                    }

                    td.nVenta,
                    th.nVenta{
                      width: 117px;
                      max-width: 117px;
                      word-break: break-all;
                      text-align: center; /* Ensure these columns are centered */
                    }

                    td.descuento,
                    th.descuento,
                    td.subtotal,
                    th.subtotal,
                    td.total,
                    th.total {
                      width: 45px;
                      max-width: 45px;
                      word-break: break-all;
                      text-align: center; /* Ensure these columns are centered */
                    }
  
                    .centrado {
                      text-align: center;
                      align-content: center;
                    }
                    .derecha {
                      text-align: right;
                      align-content: right;
                    }
                    .ticket {
                      margin-left: 10px;
                      width: 252px; 
                      max-width: 252px;
                    }
  
                    .titulo-comanda {
                      font-size: 14px;
                      font-weight: bold;
                    }  
                    img {
                      max-width: inherit;
                      width: inherit;
                    }
                    .divider {
                        border-top: 1px dashed black; /* Dashed border for divider */
                        margin: 3px 0;
                    }
  
                    @media print{
                    .oculto-impresion, .oculto-impresion *{
                        display: none !important;
                    }
                    }
            </style>
      </head>
      <body>
          <div class="ticket">
              <img src="https://drive.google.com/thumbnail?id=1bXwYUiBDYu2lstF7SpfERwo4zHwmAx7_&sz=s512" alt="TypicaLogo">
              <p class="centrado titulo-comanda">RESUMEN</p>
              <p class="centrado">Fecha: ${resumen.fecha}</p>
              <div class="divider"></div>
              <table>
              <thead>
                  <tr>
                  <th class="producto">Producto</th>
                  <th class="descuento">Desc</th>
                  <th class="subtotal">Cant</th>
                  <th class="total">Total</th>
                  </tr>
              </thead>
                <tbody>
              ${resumen.productos.map(producto => `
                <tr>
                  <td class="producto">${producto.nombre}</td>
                  <td class="descuento">${parseFloat(producto.desc).toFixed(1)}%</td>
                  <td class="subtotal">${producto.cantidad}</td>
                  <td class="total">${parseFloat((producto.cantidad*producto.precio)*(1-(producto.desc/100))).toFixed(2)}</td>
                </tr>`).join('')}
            </tbody>
              </table>
              <div class="divider"></div>
              <p class="centrado">MONTO POR METODO DE PAGO</p>
              <p class="centrado">Efectivo: ${resumen.efectivo}</p>
              <p class="centrado">Tarjeta: ${resumen.tarjeta}</p>
              <p class="centrado">Qr: ${resumen.qr}</p>
              <p class="centrado">Total(Bs):  ${(resumen.qr +resumen.tarjeta +resumen.efectivo)}</p>
              <div class="divider"></div>
              <p class="centrado">MONTO POR VENDEDOR</p>
              ${resumen.vendedores.map(vendedor => `
                  <p class="centrado">${vendedor.nombre}: ${vendedor.monto}</p>`).join('')}            
          </div>
      </body>
      </html>
  `
  return [htmlResumen];
}

const  getVentaHtmlContent = (venta)=> {

    let htmlVenta = `
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Hello World!</title>
            <style>
                  * {
                        font-size: 12px;
                        font-family: 'helvetica';
                      }
                      table {
                        width: 100%;
                        table-layout: fixed; /* Ensure the table fills the available space */
                      }

                      p {
                        margin: 1px;
                        padding: 0;
                      }

                      td.detalle,
                      th.detalle {
                        width: auto; /* Allow this column to take up the remaining space */
                        word-break: break-word; /* Ensure text wraps */
                      }

                      td.cantidad,
                      th.cantidad,
                      td.precio,
                      th.precio,
                      td.total,
                      th.total {
                        width: 50px;
                        max-width: 50px;
                        word-break: break-all;
                        text-align: center; /* Ensure these columns are centered */
                      }
    
                      .centrado {
                        text-align: center;
                        align-content: center;
                      }
                      .derecha {
                        text-align: right;
                        align-content: right;
                      }
                      .ticket {
                        margin-left: 10px;
                        width: 252px; 
                        max-width: 252px;
                      }
    
                      .titulo-comanda {
                        font-size: 14px;
                        font-weight: bold;
                      }  
                      img {
                        max-width: inherit;
                        width: inherit;
                      }
                      .divider {
                          border-top: 1px dashed black; /* Dashed border for divider */
                          margin: 3px 0;
                      }
    
                      @media print{
                      .oculto-impresion, .oculto-impresion *{
                          display: none !important;
                      }
                      }
              </style>
        </head>
        <body>
            <div class="ticket">
            <img src="https://drive.google.com/thumbnail?id=1bXwYUiBDYu2lstF7SpfERwo4zHwmAx7_&sz=s512" alt="TypicaLogo">
                <p class="centrado titulo-comanda">VENTA</p>
                <p class="centrado">PEDIDO: ${venta.nroVenta}<br>FECHA: ${venta.fecha} - HORA: ${venta.hora}</p>
                <div class="divider"></div>
                <table>
                <thead>
                    <tr>
                    <th class="detalle">DETALLE</th>
                    <th class="cantidad">CANT</th>
                    <th class="precio">P.UNIT</th>
                    <th class="total">TOTAL</th>
                    </tr>
                </thead>
                  <tbody>
                ${venta.productos.map(producto => `
                  <tr>
                    <td class="detalle">${producto.nombre}</td>
                    <td class="cantidad">${parseFloat(producto.cantidad).toFixed(2)}</td>
                    <td class="precio">${parseFloat(producto.precio).toFixed(2)}</td>
                    <td class="total">${parseFloat(producto.cantidad * producto.precio).toFixed(2)}</td>
                  </tr>`).join('')}
              </tbody>
                </table>
                <p class="derecha">Subtotal (Bs):  ${parseFloat(venta.subTotal).toFixed(2)}</p>
                <p class="derecha">Descuento (Bs):   ${parseFloat(venta.descuento).toFixed(2)}</p>
                <p class="derecha">Total (Bs):  ${parseFloat(venta.subTotal - venta.descuento).toFixed(2)}</p>
                <div class="divider"></div>
                <p class="centrado">Metodo de pago: ${venta.metodoPago}</p>
                <p class="centrado">Vendedor: ${venta.vendedor.nombre}</p>
                <div class="divider"></div>
                <p class="centrado">NIT/CI: ${venta.cliente.nit}</p>
                <p class="centrado">SEÑOR(ES): ${venta.cliente.nombre}</p>
                <p class="centrado">¡GRACIAS POR SU COMPRA!</p>
            </div>
        </body>
        </html>
    `
      return [htmlVenta];
    }
        
   const getComandaHtmlContent = (comanda)=> {

    let htmlComanda = `
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Hello World!</title>
          <style>
                  * {
                        font-size: 12px;
                        font-family: 'helvetica';
                      }
                      table {
                          width: 100%;
                          table-layout: fixed; /* Ensure the table fills the available space */
                      }
                      p {
                        margin: 1px;
                        padding: 0;
                      }

                      td.producto,
                      th.producto {
                        width: 189px;
                        max-width: 189px;
                      }

                      td.cantidad,
                      th.cantidad {
                        width: 63px;
                        max-width: 63px;
                        word-break: break-all;
                      }

                      td.precio,
                      th.precio {
                        width: 63px;
                        max-width: 63px;
                        word-break: break-all;
                      }

                      .centrado {
                        text-align: center;
                        align-content: center;
                      }
                      .ticket {
                        margin-left: 10px;
                        width: 252px; 
                        max-width: 252px;
                      }

                      .titulo-comanda {
                        font-size: 14px;
                        font-weight: bold;
                      }  
                      img {
                        max-width: inherit;
                        width: inherit;
                      }
                        
                      td {
                          text-align: center;
                          vertical-align: middle;
                      }
                      .divider {
                          border-top: 1px dashed black; /* Dashed border for divider */
                          margin: 3px 0;
                      }

                      @media print{
                      .oculto-impresion, .oculto-impresion *{
                          display: none !important;
                      }
                      }
              </style>
        </head>
        <body>
            <div class="ticket">
                <p class="centrado titulo-comanda">COMANDA</p>
                <p class="centrado">PEDIDO: ${comanda.nroVenta}<br>FECHA: ${comanda.fecha} - HORA: ${comanda.hora}</p>
                <div class="divider"></div>
                <table>
                <thead>
                    <tr>
                    <th class="cantidad">CANT</th>
                    <th class="producto">PRODUCTO</th>
                    </tr>
                </thead>
                <tbody>
                ${comanda.productos.map(producto => `
                  <tr>
                    <td class="cantidad">${parseFloat(producto.cantidad).toFixed(2)}</td>
                    <td class="producto">${producto.nombre}</td>
                  </tr>`).join('')}
              </tbody>
                </table>
                <div class="divider"></div>
                <p class="centrado">SEÑOR(ES): ${comanda.cliente.nombre}</p>
            </div>
        </body>
        </html>
    `
      return [htmlComanda];
    }

