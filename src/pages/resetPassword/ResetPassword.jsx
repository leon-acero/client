import "./resetPassword.css"
import axios, { regresaMensajeDeError } from '../../utils/axios';

import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useNavigatorOnLine } from '../../hooks/useNavigatorOnLine';

/**************************    Snackbar    **********************************/
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import {FaTimes} from "react-icons/fa";
import { Alert } from '@mui/material';
/****************************************************************************/


function ResetPassword() {

  /**********************    useNavigatorOnLine    ****************************/
  // Para saber si el Usuario esta Online
  const isOnline = useNavigatorOnLine();
  /****************************************************************************/


  /****************************    useState    *******************************/

  const [isSending, setIsSending] = useState(false);
  const [data, setData] = useState(
    {
      password: "",
      confirmPassword: ""
    }
  )

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  /****************************************************************************/


  /****************************    useParams    *******************************/
  // history lo uso para redireccionar la página a /search-client cuando el pedido
  // haya sido borrado 
  const history = useHistory();
  /*****************************************************************************/  

  
  /**************************    useParams    **********************************/
  // resetToken es el Reset Token viene en el URL, me sirve para

  const {resetToken } = useParams();
  /*****************************************************************************/


  /************************     handleSubmit    *******************************/
  // Aqui guardo la informacion en la BD, puede ser exitoso o haber error
  /****************************************************************************/

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSending)
      return;

    if (!isOnline) {
      setMensajeSnackBar("No estas en línea, checa tu conexión a Internet.")
      setOpenSnackbar(true);
      return;
    }

    try {

        if (resetToken === "") {
          setMensajeSnackBar("No existe un Token para hacer el cambio de Password.")
          setOpenSnackbar(true);
          return;
        }

        setIsSending(true);

        const res = await axios.patch (`/api/v1/users/resetPassword/${resetToken}`, {    
          password : data.password,
          confirmPassword : data.confirmPassword
        });

        console.log("res", res);

        setIsSending(false);

        if (res.data.status === 'success') {
          // console.log(res.data.data.data);
          console.log ('El pasword fue actualizado con éxito!');
          setMensajeSnackBar("Password actualizado. Vuelve a iniciar Sesión.")
          setOpenSnackbar(true);

          // Redirecciono después de 5 segundos a SearchClient osea /search-client
          setTimeout(()=>{
            history.replace("/login");
          }, 5000);
        } 
      }
      catch(err) {
        console.log(err);
        setIsSending(false);
        setMensajeSnackBar (regresaMensajeDeError(err));
        setOpenSnackbar(true);
      }
  }
  
  /***************************     handleChange    **************************/
  // Es el handle que se encarga de la captura de los inputs
  /**************************************************************************/
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

  /************************     handleCloseSnackbar    **********************/
  // Es el handle que se encarga cerrar el Snackbar
  /**************************************************************************/
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  /*****************************     action    ******************************/
  // Se encarga agregar un icono de X al SnackBar
  /**************************************************************************/
  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <FaTimes />
      </IconButton>
  </>
  );


  return (
    <div className='resetPassword'>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
            // severity= {updateSuccess ?  "success" : "error"} 
            severity= {"success"} 
            action={action}
            sx={{ fontSize: '1.4rem', backgroundColor:'#333', color: 'white', }}
        >{mensajeSnackBar}
        </Alert>
      </Snackbar>

      <main className="main-resetPassword">
        <div className="form-resetPassword">
          <h2 className='heading-secondary ma-bt-lg'>Cambia tu Password</h2>

          <form className='form--reset-password' onSubmit={handleSubmit}>
            <div className='form__group'>
              <label 
                    htmlFor='password' 
                    className='form__label' >Password
              </label>
              <input 
                    id="password" 
                    className='form__input' 
                    type="password" 
                    placeholder='••••••••' 
                    required 
                    minLength="8"
                    value={data.password || ''}
                    name="password"
                    onInvalid={e=> e.target.setCustomValidity('El Password debe ser de mínimo 8 caracteres')} 
                    onInput={e=> e.target.setCustomValidity('')} 
                    onChange={handleChange} />
            </div>
            <div className='form__group ma-bt-md'>
              <label 
                    htmlFor='confirmPassword' 
                    className='form__label'>Confirma el Password
              </label>
              <input 
                    id="confirmPassword" 
                    className='form__input' 
                    type="password" 
                    placeholder='••••••••' 
                    required 
                    minLength="8"
                    value={data.confirmPassword || ''}
                    name="confirmPassword"
                    onInvalid={e=> e.target.setCustomValidity('La confirmación del Password debe ser de mínimo 8 caracteres')} 
                    onInput={e=> e.target.setCustomValidity('')}
                    onChange={handleChange} />
            </div>
            <div className='form__group form__button'>
              <button className='btn btn--green' disabled={isSending}>{isSending ? 'Enviando...' : 'Enviar'}</button>
            </div>
          </form>

        </div>
      </main>
    </div>
  )
}

export default ResetPassword