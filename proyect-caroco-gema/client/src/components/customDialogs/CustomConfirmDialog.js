import React from 'react';
import "./CustomConfirmDialog.css"

const CustomConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="custom-confirm-dialog">
      <p style={{margin:5 , fontSize:18} }>{message}</p>
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