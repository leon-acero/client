import "./searchClient.css"
import axios, { regresaMensajeDeError } from '../../../utils/axios';

/*************************    Offline/Online     ****************************/
import { useNavigatorOnLine } from '../../../hooks/useNavigatorOnLine';
import OfflineFallback from '../../../components/offlineFallback/OfflineFallback';
/****************************************************************************/


/*******************************    React     *******************************/
import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
/****************************************************************************/

/***************************    Components     ******************************/
import Table from '../../../components/table/Table';
import SkeletonElement from '../../../components/skeletons/SkeletonElement';
import SnackBarCustom from '../../../components/snackBarCustom/SnackBarCustom';
// import ClientFound from '../clientFound/ClientFound';
/****************************************************************************/

/**************************    Snackbar    **********************************/
// import Snackbar from '@mui/material/Snackbar';
// import IconButton from '@mui/material/IconButton';
// import {FaTimes} from "react-icons/fa";
// import { Alert } from '@mui/material';
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
  }
};
/****************************************************************************/


export default function SearchClient() {


  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/

  /****************************    useLocation    *****************************/
  // Estos datos del Cliente los obtengo con useLocation los cuales los mandé
  // desde NewOrUpdateClient.jsx

  const { openVentana } = useLocation().state;

  console.log("openVentana SC", openVentana);

  /**************************    useState    **********************************/
  // query guarda lo que el usuario capturó para iniciar la busqueda
  
  // data es un Array con el resultado de la búsqueda
  
  // isSearching es un boolean para saber si se esta realizando una búsqueda

  // iconoSnackBarDeExito es boolean que indica si tuvo exito o no la operacion
  // de AXIOS

  const [query, setQuery] = useState("");
  // const [data, setData] = useState([]);
  const [data, setData] = useState(null);
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
    inputRef?.current?.focus();
  },[])
  /*****************************************************************************/

  
  /***************************     handleSearch    **************************/
  // Es el handle que se encarga de hacer la búsqueda
  /**************************************************************************/
  const handleSearch = async (event) => {
    event.preventDefault();

    if (isSearching)
      return;

    // console.log("query", query);
    // const regExOptions = `businessName[regex]=(?i)${query}&sort=businessName`;

    try {
      if (query.length > 2) {
        setIsSearching(true);
  
        setData(null);
        
        // const res = await axios ({
        //   withCredentials: true,
        //   method: 'GET',
        //   // url: `http://127.0.0.1:8000/api/v1/clients?q=${query}`
        //   // url: `http://127.0.0.1:8000/api/v1/clients?${regExOptions}`

        //   url: `http://127.0.0.1:8000/api/v1/clients/search-client/${query}`
        //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/clients/search-client/${query}`
  
        // });

        const res = await axios.get (`/api/v1/clients/search-client/${query}`);
        
        // console.log(res.data.data.data);

        setIsSearching(false);
        setData(res.data.data.data);
        
        if (res.data.data.data.length === 0) {
          setIconoSnackBarDeExito(false);
          setMensajeSnackBar("No se encontró un Negocio con esa búsqueda.")
          setOpenSnackbar(true);
        }
        // inputRef?.current?.focus();
      }

    }
    catch (err) {
      console.log("err");
      setIsSearching(false);
      // setMensajeSnackBar("Hubo un error al realizar la búsqueda. Vuelva a intentar.")
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
            <m.div className='searchClient'
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
      
              <h1 className="searchClientTitle">
                  {
                    openVentana === "CrearPedido" 
                    ? "Busca Cliente para Crear o Entregar Pedido" 
                    : openVentana === "EditarCliente" 
                    ? "Busca Cliente para Editarlo"
                    : "Error, repórtalo"
                  }
              </h1>

              <form className='searchClientInput' onSubmit={handleSearch}>
                {/* <label>Buscar Cliente</label> */}
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ejemplo: Abarrotes El Puerto"
                  className="clientSearchInput"                  
                  onChange={(e) => setQuery(e.target.value.toLowerCase())}
                  required
                  onInvalid={e=> e.target.setCustomValidity('El Nombre del Negocio debe tener entre 3 y 80 caracteres')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  minLength="3"
                  maxLength="80"
                />
                <button className="btnSearchClient" disabled={isSearching}>
                  {isSearching ? 'Buscando...' : 'Buscar'}
                </button>
              </form>
              
              {
                data && <Table data={data} openVentana={openVentana} />
              }
      
              {
                isSearching && <SkeletonElement 
                                  type="rectangular" 
                                  width="100%" height="5.6rem" 
                                />
              }
              {/* <p>{data.id} {data.businessName} {data.cellPhone}</p> */}
      
              {/* <div className="container__ClientsFound">
                {
                  data.map(client=> 
                    (
                      <ClientFound 
                            key={client.id} 
                            id={client.id} 
                            businessName={client.businessName} 
                            cellPhone={client.cellPhone} 
                            esMayorista={client.esMayorista} />
                    ) 
                  )
                }
              </div> */}
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

