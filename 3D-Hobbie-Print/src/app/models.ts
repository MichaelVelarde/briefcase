export class Cotizacion {
    constructor(
      public id : number ,
      public keyCliente : string,
      public nombre :  string,
      public fechaEntrega :  string,
      public factura : boolean,
      public seEntrego : boolean,
      public precioPintado : number,
      public precio : number ,
      public costo : number ,
      public numeroPartes : number, 
      public cotizadoPor: string,
      public idDb? : string,
    ){        
    }
}
export class Parte {
    constructor(
      public id : number ,
      public escala : number ,
      public nombre : string,
      public material : string,
      public detalles : string,
      public soporte : boolean,
      public costoMaterial : number,
      public precio : number, 
      public costo : number, 
      public cantidad : number, 
      public cantidadImpresa : number, 
      public horasDeImpresion : number,
      public gramos : number,
      public estado : number,
      public dimensiones : Array<number>,
      public idDb? : string,
    ){        
    }
}
export class Cliente {
    constructor(
      public id : number ,
      public nombre :  string,
      public ciudad :  string,
      public nit :  string,
      public telefono :  string,
      public idDb? : string,
    ){        
    }
}
export class Modelo3d {
  constructor( 
    public id : number ,
    public nombre :  string,
    public precio :  number,
    public costo :  number,
    public keysParte :  string[],
    public idDb? : string,
  ){        
  }
}
export class Venta {
  constructor( 
    public id : number ,
    public keyCliente : string,
    public nombre :  string,
    public fechaEntrega :  string,
    public factura : boolean,
    public seEntrego : boolean,
    public precioPintado : number,
    public precio : number ,
    public costo : number ,
    public realizadaPor: string,
    public keysModelo3D: string[],
    public idDb? : string,
  ){        
  }
}
export class GastoExtra {
    constructor(
      public id : number ,
      public gasto :  number,
      public fecha :  string,
      public descripcion :  string,
      public prestador :  string,
      public idDb? : string,
    ){        
    }
}
export class Mes {
    constructor(
      public fecha : string ,
      public ganancia :  number,
      public gastos :  number,
      public idDb? : string,
    ){        
    }
}
export class GastoExtraMes {
  constructor(  
    public date: string,
    public gasto: number,
  ){
  }
}
export class Constantes {
    constructor(
      public correa : number ,
      public heatbed : number ,
      public imprevistos : number ,
      public inversion : number ,
      public kwH  : number ,
      public nozzle : number ,
      public tuboGarganta : number ,
      public costosMateriales : Array<number> ,
      public socios : Array<string> ,
      public idDb? : string,
    ){        
    }
}

export class ImageSnippet {
    constructor(public src: string, public file: File) {}
}
export const firebaseUrls = {
    cotizaciones : 'Cotizaciones',
    ventas : 'Ventas',
    clientes: 'Clientes',
    partes : 'Partes',
    partesVendidas : 'PartesVendidas',
    modelo3d : 'Modelo3d',
    modelo3dVendido : 'Modelo3dVendido',
    constantes: 'Constantes',
    meses: 'Meses',
    gastosExtra: 'GastosExtra',
    keyConstantes : 'KeyOriginal'
};