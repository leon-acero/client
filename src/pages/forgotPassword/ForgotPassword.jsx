import "./forgotPassword.css";
import axios, { FRONT_END_URL, regresaMensajeDeError } from '../../utils/axios';

/*************************    Offline/Online     ****************************/
import { useNavigatorOnLine } from '../../hooks/useNavigatorOnLine';
import OfflineFallback from '../../components/offlineFallback/OfflineFallback';
/****************************************************************************/


/*******************************    React     *******************************/
import { useState, useRef, useEffect } from 'react'
/****************************************************************************/


/**************************    Snackbar    **********************************/
// import Snackbar from '@mui/material/Snackbar';
// import IconButton from '@mui/material/IconButton';
// import {FaTimes} from "react-icons/fa";
// import { Alert } from '@mui/material';
/****************************************************************************/

import SnackBarCustom from '../../components/snackBarCustom/SnackBarCustom';

/**************************    Framer-Motion    *****************************/
import { domAnimation, LazyMotion, m } from 'framer-motion';


const containerVariants = {
  hidden: { 
    opacity: 0, 
  },
  visible: { 
    opacity: 1, 
    transition: { duration: .4, delay: 0.5 }
  }
};
/****************************************************************************/


function ForgotPassword() {

  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/


  /**************************    useState    **********************************/
  // email guarda lo que el usuario capturó para iniciar la busqueda
  // iconoSnackBarDeExito es boolean que indica si tuvo exito o no la operacion
  // de AXIOS

  // data es un Array con el resultado de la búsqueda
  // isSearching es un boolean para saber si se esta realizando una búsqueda

  const [email, setEmail] = useState("");
  // const [data, setData] = useState([]);
  // const [data, setData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [iconoSnackBarDeExito, setIconoSnackBarDeExito] = useState (true);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  /*****************************************************************************/

  /*****************************    useRef    **********************************/
  // inputRef lo uso para que al cargar la pagina ponga el focus en el Buscar
  // el Negocio

  const inputRef = useRef(null);
  /*****************************************************************************/

  /**************************    useEffect    **********************************/
  // Al cargar la pagina pone el focus en el buscar el Negocio
  useEffect(()=>{

    if (!isOnline) {
      return;
    }

    inputRef?.current?.focus();
  },[isOnline])
  /*****************************************************************************/


  /***************************     handleSearch    **************************/
  // Es el handle que se encarga de hacer la búsqueda
  /**************************************************************************/
  const handleForgotPassword = async (event) => {
    event.preventDefault();

    if (isSearching)
      return;

    console.log("email", email);
    // const regExOptions = `businessName[regex]=(?i)${email}&sort=businessName`;

    try {
      if (email.length > 2) {
        setIsSearching(true);
  
        // setData(null);
        
        const res = await axios.post('/api/v1/users/forgotPassword', {
          email: email,
          urlEncoded: FRONT_END_URL
        });
        
        console.log("response", res);
        console.log("respuesta", res.data);

        if (res.data.status === 'success') {
          // let timeout = 1500;
          if (!res.data.problemWithEmail) {
            console.log("The Email was sent succesfully!");

            setIconoSnackBarDeExito(true);
            setMensajeSnackBar("El correo fue enviado. Favor de revisar tu correo y sigue las instrucciones para cambiar tu password. Si no ves el correo checa tu bandeja de Spam o Junk.")
            setOpenSnackbar(true);
          }
          else
          {
            console.log("There was an error sending the email. Please try again later.");

            setIconoSnackBarDeExito(false);
            setMensajeSnackBar("Hubo un error al enviar el correo. Vuelve a intentarlo.")
            setOpenSnackbar(true);
            // timeout = 7000;
          }
          // window.setTimeout ( () =>{
          // 	location.assign('/');
          // }, timeout);
        }  

        setIsSearching(false);
        // setData(res.data.data.data);
        
        // if (res.data.data.data.length === 0) {
        //   setMensajeSnackBar("No se encontró un Negocio con esa búsqueda.")
        //   setOpenSnackbar(true);
        // }
        // inputRef?.current?.focus();
      }

    }
    catch (err) {
      console.log("err", err);
      console.log("Hubo un error al mandar el correo electrónico");

      setIsSearching(false);
      
      setIconoSnackBarDeExito(false);
      setMensajeSnackBar (regresaMensajeDeError(err));
      setOpenSnackbar(true);
    }
  }

  /************************     handleCloseSnackbar    **********************/
  // Es el handle que se encarga cerrar el Snackbar
  /**************************************************************************/
  // const handleCloseSnackbar = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }

  //   setOpenSnackbar(false);
  // };

  /*****************************     action    ******************************/
  // Se encarga agregar un icono de X al SnackBar
  /**************************************************************************/  
  // const action = (
  //   <>
  //     <IconButton
  //       size="small"
  //       aria-label="close"
  //       color="inherit"
  //       onClick={handleCloseSnackbar}
  //     >
  //       <FaTimes />
  //     </IconButton>
  //   </>
  // );

  return (

    <>
      {
        isOnline && (
          <LazyMotion features={domAnimation}>
            <m.div className='forgotPassword'
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <SnackBarCustom 
                openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} mensajeSnackBar={mensajeSnackBar} 
                iconoSnackBarDeExito={iconoSnackBarDeExito} />
              {/* <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
              >
                <Alert 
                    severity= {iconoSnackBarDeExito ?  "success" : "error"} 
                    action={action}
                    sx={{ fontSize: '1.4rem', backgroundColor:'#333', color: 'white', }}
                >{mensajeSnackBar}
                </Alert>
              </Snackbar> */}
      
              <h2 className='forgotPassword__title'>Olvidaste tu Password</h2>
              <form className='formForgotPassword' onSubmit={handleForgotPassword}>
                <label className='labelCorreoElectronico' htmlFor="email">Correo Electrónico:</label>
                <input
                  className="inputUserForgotPassword"                  
                  ref={inputRef}
                  type="email"
                  value={email || ''}
                  name="email"
                  id="email"
                  placeholder="eljuanjo@ejemplo.com"
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  required
                  onInvalid={e=> e.target.setCustomValidity('El Correo Electrónico es inválido, debe tener entre 3 y 80 caracteres')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  minLength="3"
                  maxLength="80"
                  autoComplete="off" 
                />
                <button className="btnForgotPassword" disabled={isSearching}>
                  {isSearching ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
            </m.div>
      
          </LazyMotion> 
        )
      }
      {
        !isOnline && <OfflineFallback />
      }
    </>
 
  )
}

export default ForgotPassword