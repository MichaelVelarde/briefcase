import React ,{useEffect,useState} from "react";
import "./FormNewDate.css"

const FormNewDate= ({pickDate, actualDate}) => {
    const [todayDate, setTodayDate] = useState("");

    useEffect(() => {
        setTodayDate(actualDate)
    }, [actualDate]);

    const handleSubmit  = async (e) => {
        e.preventDefault();
        pickDate(todayDate)
    };


  return (
    <div className="form_New_Date_container">
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Seleccionar Fecha</div>
        <input className="input_Date" type="month" id="datePicker" value={todayDate} onChange={(e)=> setTodayDate(e.target.value)} />
            <center>
                <button type="submit">Escoger</button>
            </center>
        </form>
    </div>
  );
};

export default FormNewDate;