export class Proforma {
  constructor(
    public nro : number ,
    public articulosids : Array<number>,
    public articulosNombres : Array<string>,
    public articulosCant :  Array<number>,
    public articulosPrecios : Array<number>, 
    public nombreCliente: string,
    public nitCliente: string,
    public costo: string,
  ){
  }
}
export class Venta {
    constructor(
      public id : number,
      public articuloskeys : Array<any>,
      public articulosCant :  Array<any>,
      public articulosCantCadaLocal :  Array<any>,
      public articulosLocalesKeys :  Array<any>,
      public articulosPrecios : Array<any>,
      public articulosCostoInversion :Array<any>,
      public articulosDescuentos :  Array<any>,   
      public keyCliente: string,
      public vendedor: string,
      public date: string,
      public costo: string,
      public costoEnvio: string,
      public interior: boolean,
      public factura: boolean,
      public seEntrego: boolean,  
      public idDB? : string, 

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
  export class Mes {
    constructor(  
      public gananciasMes: string,
      public inversion: string,
      public date: string,
      public id?: string,
    ){
    }
  }
  export class CuentaEmpresa {
    constructor(  
      public fondos: number,
      public id?: string,
    ){
    }
  }
  export class Cliente {
    constructor(  
      public nit: string,
      public nombre: string,
      public ciudad: string,
      public telefono: string,
      public id?: string,
    ){
    }
  }
  export class User {
    constructor(  
      public id: string,
      public user: string,
      public password: string,
      public admin: boolean,
    ){
    }
  }
  export class Inventario {
    constructor(  
      public nombre: string,
      public precio: string,
      public costoInversion: number,
      public nameImage: string,
      public unidad: string,
      public id: number,
      public cantTotal: number,
      public almacenesCantidades:  Array<any>,
      public almacenesKeys:  Array<any>,
      public idDb?: string,
    ){
    }
  }
  
  export class Almacen {
    constructor(  
      public direccion: string,
      public nombre: string,
      public ciudad : string,
      public idDb?: string,
    ){
    }
  }
  export class GastoExtra {
    constructor(  
      public costo: string,
      public date: string,
      public descripcion: string,
      public creador: string,
      public idDb?: string,
    ){
    }
  }
  export class ItemSacado {
    constructor(  
      public date: string,
      public articulosCant:  Array<any>,
      public articulosCantCadaLocal:  Array<any>,
      public articulosKeysCadaLocal:  Array<any>,
      public articuloskeys:  Array<any>,
      public id?: string,
    ){
    }
  }
  export class Log {
    constructor(  
      public userIdDb: string,
      public accion: string,
      public date: string, 
      public time: string,
      public idDb?: string,
    ){
    }
  }
  export class ImageSnippet {
    constructor(public src: string, public file: File) {}
  }
  export const firebaseUrls = {
    cuentaEmpresa : 'CuentaEmpresa',
    almacenes: 'Almacenes',
    clientes: 'Clientes',
    gastosExtra: 'GastosExtra2',
    inventario: 'Inventario',
    itemsSacados: 'ItemsSacados2',
    log: 'Log',
    meses: 'Meses',
    usuarios: 'Usuarios',
    ventas: 'Ventas',
  };