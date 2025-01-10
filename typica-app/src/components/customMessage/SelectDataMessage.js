import React ,{useEffect,useState} from "react";
import "./SelectDataMessage.scss"

const SelectDataMessage= ({changeDate, actualDate}) => {
    const [todayDate, setTodayDate] = useState("");

    useEffect(() => {
        setTodayDate(actualDate)
    }, [actualDate]);

    const handleSubmit  = async (e) => {
        e.preventDefault();
        changeDate(todayDate)
    };


  return (
    <div className="form_New_Date_container">
        <form onSubmit={handleSubmit} autoComplete="off">
        <div className="Form_Title">Seleccionar Fecha</div>
        {todayDate.length<8 
            ?<input className="input_Date" type="month" id="datePicker" value={todayDate} onChange={(e)=> setTodayDate(e.target.value)} />
            :<input className="input_Date" type="date" id="datePicker" value={todayDate} onChange={(e)=> setTodayDate(e.target.value)} />
        }
            <center>
                <button type="submit">Escoger</button>
            </center>
        </form>
    </div>
  );
};

export default SelectDataMessage;