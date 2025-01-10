import React from 'react';
import "./CustomConfirmDialog.scss"

const CustomConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="custom-confirm-dialog">
      <center><p style={{margin:15 , fontSize:18} }>{message}</p></center>
      <div className='buttons_container'>
        {onCancel &&
          <button  onClick={onCancel}>Cancelar</button>
        }
        {onConfirm &&
          <button  onClick={onConfirm}>Confirmar</button>
        }
      </div>
    </div>
  );
};

export default CustomConfirmDialog;