import "./login.css"
import axios, { regresaMensajeDeError } from "../../utils/axios";

/*************************    Offline/Online     ****************************/
import { useNavigatorOnLine } from '../../hooks/useNavigatorOnLine';
import OfflineFallback from '../../components/offlineFallback/OfflineFallback';
/****************************************************************************/


/****************************    React    **********************************/
import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
/****************************************************************************/

/****************************    Context API    *****************************/
import { stateContext } from '../../context/StateProvider';
/****************************************************************************/


/**************************    Snackbar    **********************************/
// import Snackbar from '@mui/material/Snackbar';
// import IconButton from '@mui/material/IconButton';
// import {FaTimes} from "react-icons/fa";
// import { Alert } from '@mui/material';
/****************************************************************************/

/***************************    Components     ******************************/
import SnackBarCustom from '../../components/snackBarCustom/SnackBarCustom';
/****************************************************************************/


/**************************    Framer-Motion    *****************************/

import { domAnimation, LazyMotion, m } from 'framer-motion';

const containerVariants = {
  hidden: { 
    opacity: 0, 
  },
  visible: { 
    opacity: 1, 
    transition: { duration: .4, delay: 0.5 }
  },
  exit: {
    opacity: 0,
    transition: { duration: .4, ease: 'easeInOut' }
  }
};
/****************************************************************************/



export default function Login() {

  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/


  /****************************    useState    ********************************/
  // iconoSnackBarDeExito es boolean que indica si tuvo exito o no la operacion
  // de AXIOS

  const [iconoSnackBarDeExito, setIconoSnackBarDeExito] = useState (true);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(
    {
      email: "",
      password: ""
    }
  )
  /****************************************************************************/

  /**************************    useHistory    ********************************/
  const history = useHistory();
  /****************************************************************************/


  /**************************    useRef    **********************************/
  // inputRef lo uso para que al cargar la pagina ponga el focus en el nombre
  // del cliente

  const inputRef = useRef(null);
  /*****************************************************************************/

  /**************************    useContext    *********************************/
  const { setCurrentUser } = useContext(stateContext);
  /*****************************************************************************/


  /**************************    useEffect    **********************************/
  // Al cargar la pagina pone el focus en el Username
  useEffect(()=>{
    
    if (!isOnline) {
      return;
    }

    inputRef.current.focus();
  },[isOnline])
  /*****************************************************************************/


 
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

  /***************************     handleSubmit    **************************/
  // Es el handle que se encarga de loggear al Usuario
  /**************************************************************************/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading)
      return;

    try {
      // console.log("email", data.email)
      // console.log("password", data.password)

      // const  res = await axios({
      //   withCredentials: true,
      //   method: 'POST',
      //   // Este url es para Development
      //   url: 'http://127.0.0.1:8000/api/v1/users/login',
      //   // url: 'https://eljuanjo-dulces.herokuapp.com/api/v1/users/login',
      //   // Este url es para Production
      //   // url: '/api/v1/users/login',
      //   data: {
      //     email : data.email,
      //     password : data.password
      //   }	
      // });

      setIsLoading(true);

      const res = await axios.post ('/api/v1/users/login', 
          {    
            email : data.email,
            password : data.password
          }	 
      );

      setIsLoading(false);

      // console.log("res", res);
      // console.log("res", res.data.data);

      if (res.data.status === 'success') {
        // alert ('Logged in succesfully!');
          // console.log(res.data.data.data);
          console.log ('El usuario fue loggeado con éxito!');
          // setMensajeSnackBar("Cliente loggedo")
          // setOpenSnackbar(true);

          // console.log(res.data.data.user);

          setCurrentUser(res.data.data.user);       

          if (res.data.data.user.role === "admin") {
            history.replace("/dashboard");
          }
          else if (res.data.data.user.role === "vendedor") {
            history.replace("/");
          }
      } 
    }
    catch(err) {      
      console.log(err);
      setIsLoading(false);
      
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
  //       {/* <CloseIcon fontSize="small" /> */}
  //       <FaTimes />
  //     </IconButton>
  //   </>
  // );


  return (
    <>
      {
        isOnline && (
          <LazyMotion features={domAnimation}>

            <m.div className="login"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
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
              </Snackbar>    */}
      
              <main className="main">
                <div className="login-form">
                  <h2 className="heading-secondary ma-bt-lg">Inicia sesión</h2>
      
                  <form onSubmit={handleSubmit}>
                    <div className="form__group">
                      <label htmlFor="email" className="form__label" >Correo Electrónico</label>
                      <input 
                        ref={inputRef}
                        type="email" 
                        id="email" 
                        className="form__input" 
                        placeholder='micorreo@ejemplo.com' 
                        required 
                        onChange={handleChange}
                        name="email"
                        value={data.email || ''}
                        onInvalid={e=> e.target.setCustomValidity('El Email debe tener entre 5 y 20 caracteres')} 
                        onInput={e=> e.target.setCustomValidity('')} 
                        minLength="5"
                        maxLength="20"
                      />
                    </div>
                    <div className="form__group">
                      <label htmlFor="password" className="form__label" >Password</label>
                      <input 
                        type="password" 
                        id="password" 
                        className="form__input" 
                        placeholder='••••••••' 
                        required 
                        minLength="8" 
                        onChange={handleChange}
                        name="password"
                        onInvalid={e=> e.target.setCustomValidity('El Password debe ser de mínimo 8 caracteres')} 
                        onInput={e=> e.target.setCustomValidity('')} 
                        value={data.password || ''}
                      />
                    </div>
                    <div className="form__group ma-bt-md">
                      <Link 
                            className="forgot-password" 
                            to="/forgot-password">¿Olvidaste tu Password?
                      </Link>
                    </div>
                    <div className="form__group">
                      <button className="btn btn--green" disabled={isLoading}>{isLoading ? 'Entrando a El Juanjo' : 'Iniciar mi sesión'}</button>
                    </div>
                  </form>
                </div>
              </main>
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