  export const getCurrentTime =  () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  }

  export const getCurrentDate =  () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  } 
  export const numberToMounth =  (numeroMes) => {
    switch (numeroMes) {
      case '01':
        return 'Enero';
      case '02':
        return 'Febrero';
      case '03':
        return 'Marzo';
      case '04':
        return 'Abril';
      case '05':
        return 'Mayo';
      case '06':
        return 'Junio';
      case '07':
        return 'Julio';
      case '08':
        return 'Agosto';
      case '09':
        return 'Septiembre';
      case '10':
        return 'Octubre';
      case '11':
        return 'Noviembre';
      case '12':
        return 'Diciembre';
      default:
        return 'Mes no válido';
    }
  }
