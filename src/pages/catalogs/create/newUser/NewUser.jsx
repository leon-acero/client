import "./newUser.css";
import axios from "axios";
import { useState, useRef, useEffect } from 'react';

// import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const INITIAL_STATE = { 
  ownerName: "", 
  businessName: "", 
  businessAddress: "",
  cellPhone: "", 
  fixedPhone: "",
  email: "", 
  esMayorista: false,
  // imageCover: ""
}

export default function NewUser() {

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  const inputRef = useRef(null);

  useEffect(()=>{
    inputRef.current.focus();
  },[])


  const [data, setData] = useState(INITIAL_STATE);

  const saveClient = async (e) => {
    e.preventDefault();
    try {
          setIsSaving(true);

          const res = await axios({
            withCredentials: true,
            method: 'POST',
            // url: `http://127.0.0.1:8000/api/v1/clients/`,
            url: `https://eljuanjo-dulces.herokuapp.com/api/v1/clients/`,
            data: {
                  ownerName: data.ownerName, 
                  businessName: data.businessName, 
                  businessAddress: data.businessAddress,
                  cellPhone: data.cellPhone, 
                  fixedPhone: data.fixedPhone,
                  email: data.email, 
                  esMayorista: data.esMayorista,
                  imageCover: "" ,
            }})
  
          setIsSaving(false);

          if (res.data.status === 'success') {
            // alert ('Logged in succesfully!');
              // console.log(res.data.data.data);
              // console.log ('El cliente fue creado con éxito!');
              setOpenSnackbar(true);

              setData(INITIAL_STATE);
              inputRef.current.focus();
          } 
      }
      catch(err) {
        setIsSaving(false);
        console.log(err);
      }
  }

  function handleChange(event) {
    // console.log(event)
    const {name, value, type, checked} = event.target
    setData(prevFormData => {
        return {
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }
    })
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const action = (
    <>
      {/* <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
        UNDO
      </Button> */}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <div className="newUser">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message="Cliente Creado"
        action={action}
      />

      <h1 className="newUserTitle">Nuevo Cliente</h1>

      <form className="newUserForm" onSubmit={saveClient}>
        <div className="newUserItem">
          <label>Negocio *</label>
          <input 
              ref={inputRef}
              type="text" 
              placeholder="Mi Tiendita" 
              onChange={handleChange}
              name="businessName"
              value={data.businessName || ''}  
              required
              onInvalid={e=> e.target.setCustomValidity('Escribe el Nombre del Negocio')} 
              onInput={e=> e.target.setCustomValidity('')}   
          />
        </div>
        <div className="newUserItem">
          <label>Contacto *</label>
          <input 
              type="text" 
              placeholder="Carlos Treviño" 
              onChange={handleChange}
              name="ownerName"
              value={data.ownerName || ''}  
              required
              onInvalid={e=> e.target.setCustomValidity('El Nombre del Contacto debe tener entre 5 y 80 caracteres')} 
              onInput={e=> e.target.setCustomValidity('')} 
              minLength="5"
              maxLength="80"
          />
        </div>
        <div className="newUserItem">
          <label>Dirección</label>
          <input 
              type="text" 
              placeholder="Av. Juárez 2222 Col. Centro, Monterrey, N.L." 
              onChange={handleChange}
              name="businessAddress"
              value={data.businessAddress || ''}  
              onInvalid={e=> e.target.setCustomValidity('La Dirección debe tener menos de 100 caracteres')} 
              onInput={e=> e.target.setCustomValidity('')} 
              maxLength="100"                 
          />
        </div>
        <div className="newUserItem">
          <label>Celular</label>
          <input 
              type="text" 
              placeholder="81 80 118990" 
              onChange={handleChange}
              name="cellPhone"
              value={data.cellPhone || ''}  
              onInvalid={e=> e.target.setCustomValidity('El Número de Celular debe ser menor a 20 caracteres')} 
              onInput={e=> e.target.setCustomValidity('')} 
              maxLength="20"    
          />
        </div>
        <div className="newUserItem">
          <label>Teléfono</label>
          <input 
              type="text" 
              placeholder="81 12 345678" 
              onChange={handleChange}
              name="fixedPhone"
              value={data.fixedPhone || ''}   
              onInvalid={e=> e.target.setCustomValidity('El Número de Teléfono debe ser menor a 20 caracteres')} 
              onInput={e=> e.target.setCustomValidity('')} 
              maxLength="20"             
          />
        </div>
        <div className="newUserItem">
          <label>Email</label>
          <input 
              type="email" 
              placeholder="carlos.trevino@gmail.com" 
              onChange={handleChange}
              name="email"
              value={data.email || ''}                
          />
        </div>

        <div className="newUserItem">
            <label htmlFor="esMayorista">¿Es Mayorista?</label>
            <input 
                type="checkbox" 
                id="esMayorista" 
                checked={data.esMayorista}
                onChange={handleChange}
                name="esMayorista"
                value={data.esMayorista}
            />
        </div>
        {/* <div className="newUserItem">
          <label htmlFor="esmayorista">¿Es Mayorista?</label>
              <select 
                  className="newUserSelect"
                  id="esmayorista" 
                  value={data.esMayorista}
                  onChange={handleChange}
                  name="esmayorista"
              >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
              </select>          
        </div> */}
        <button className="newUserButton" disabled={isSaving}>Crear</button>
      </form>
    </div>
  );
}
