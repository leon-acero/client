import "./newOrUpdateOrder.css"
import axios, { regresaMensajeDeError } from '../../../utils/axios';

import { useNavigatorOnLine } from '../../../hooks/useNavigatorOnLine';
import OfflineFallback from '../../../components/offlineFallback/OfflineFallback';

/*******************************    React     *******************************/
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
/****************************************************************************/

/**************************    Snackbar    **********************************/
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import {FaTimes} from "react-icons/fa";
import { Alert } from '@mui/material';
/****************************************************************************/

/***************************    Components     ******************************/
import SkeletonElement from '../../../components/skeletons/SkeletonElement';
/****************************************************************************/

/**************************    Framer-Motion    *****************************/
import { domAnimation, LazyMotion, m } from 'framer-motion';
/****************************************************************************/

/*******************************    React Icons    *************************/
import { FaArrowLeft } from 'react-icons/fa';
/****************************************************************************/


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


export default function NewOrUpdateOrder() {

  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/

  /**************************    useHistory    ********************************/
  const history = useHistory();
  /*****************************************************************************/

  /**************************    useRef    **********************************/
  // ultimosCincoPedidos es un Array que contiene las Fechas de los ultimos 5 pedidos

  // const [ultimosCincoPedidos, setUltimosCincoPedidos] = useState([]);
  const [ultimosCincoPedidos, setUltimosCincoPedidos] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  /*****************************************************************************/


  /**************************    useRef    **********************************/
  // avoidRerenderFetchClient evita que se mande llamar dos veces al
  // cliente y por lo mismo que se pinte dos veces
  
  const avoidRerenderFetchClient = useRef(false);
  /*****************************************************************************/

  /****************************    useLocation    *****************************/
  // Estos datos del Cliente los obtengo con useLocation los cuales los mandé
  // desde clientFound.jsx

  const {clientId, businessName, cellPhone, esMayorista, businessImageCover} = useLocation().state;
  /****************************************************************************/


  /****************************    useEffect    *******************************/
  // fetchUltimosCincoPedidosPorEntregar carga los ultimos 5 pedidos por Entregar
  // de un cliente
   
  useEffect (()=>{

    if (!isOnline) {
      return;
    }

    if (avoidRerenderFetchClient.current) {
      return;
    }

    const fetchUltimosCincoPedidosPorEntregar = async ()=> {
      
      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderFetchClient.current = true;

      try {
        setUltimosCincoPedidos(null);

        // const res = await axios ({
        //   withCredentials: true,
        //   method: 'GET',
        //   // url: `http://127.0.0.1:8000/api/v1/sales/ultimos-cinco-pedidos-por-entregar/${clientId}`
        //   url: `https://eljuanjo-dulces.herokuapp.com/api/v1/sales/ultimos-cinco-pedidos-por-entregar/${clientId}`
        // });

        const res = await axios.get (`/api/v1/sales/ultimos-cinco-pedidos-por-entregar/${clientId}`);


        // console.log("res",res.data.data.ultimosCincoPedidosPorEntregar);
        setUltimosCincoPedidos(res.data.data.ultimosCincoPedidosPorEntregar);   
      }
      catch (err) {
        console.log(err);
        setMensajeSnackBar (regresaMensajeDeError(err));
        setOpenSnackbar(true);
      }
    }

    fetchUltimosCincoPedidosPorEntregar ();
  }, [clientId, isOnline])
  /****************************************************************************/

  /**********************    handleGoBackOnePage    *************************/
  // Me regreso en la Historia una pagina
  const handleGoBackOnePage = () => {
    // history.go(-1);
    history.goBack();
  }
  /**************************************************************************/

  
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
    <>
      {
        isOnline && (
          <LazyMotion features={domAnimation} >
            <m.div className="newOrUpdateOrder"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
              >
                <Alert 
                    severity= {"error"} 
                    action={action}
                    sx={{ fontSize: '1.4rem', backgroundColor:'#333', color: 'white', }}
                >{mensajeSnackBar}
                </Alert>
              </Snackbar>
      
              <div className="regresarAPaginaAnterior">
                <FaArrowLeft onClick={handleGoBackOnePage} className="arrowLeftGoBack" />
              </div>
      
              <main className="main-newOrUpdateOrder">
                <div className="form-newOrUpdateOrder">
                  <div className="businessInfo">
                    <div className="editarCliente">
                      <p className="businessInfo__businessName">{businessName}</p>
                      <Link to={"/client/" + clientId}>
                        <button className="clientListEdit">Editar</button>
                      </Link>
                    </div>
                    <p className="businessInfo__cellPhone">{cellPhone}</p>
                    <p className="businessInfo__esMayorista">{esMayorista ? "Mayorista" : "Minorista"}</p>
                  </div>
      
                  <div className="ultimosPedidos__container">
                    <Link className="linkNuevoPedido" to={{
                          // pathname: `/new-order/${clientId}`,
                          pathname: `/update-order/client/${clientId}`,
                          state: {
                                  clientId,
                                  businessName, 
                                  cellPhone, 
                                  esMayorista,
                                  usarComponenteComo: "nuevoPedido",
                                  businessImageCover,
                                  // en un nuevo pedido NO uso fecha, solo en actualizar
                                  // le paso de todos modos una fecha para que no haya undefined
                                  fecha: new Date()
                          }
                        }}><button className="linkNuevoPedido__button">Nuevo Pedido</button>
                    </Link>
                    
                      {
                        // ultimosCincoPedidos?.length > 0 && (
                          <div className="pedidosPorEntregar__container">
                            <p className="pedidosPorEntregar__title">Pedidos Por Entregar por Fecha</p>
      
                            <div className="ultimosCincoPedidos_group">
                              {
                                !ultimosCincoPedidos 
                                ?
                                  <SkeletonElement type="rectangular" width="20rem" height="auto" /> 
                                :
                                ultimosCincoPedidos?.length > 0 
                                ? 
                                  (
                                    ultimosCincoPedidos.map((current, index) =>                                  
                                      <Link 
                                        key={index} 
                                        className="linkActualizarPedido__button" 
                                        to={{
                                          pathname: `/update-order/client/${clientId}`,
                                          state: {
                                            clientId: clientId,
                                            businessName: businessName, 
                                            cellPhone: cellPhone, 
                                            esMayorista: esMayorista,
                                            businessImageCover: businessImageCover,
                                            fecha: current._id.Fecha,
                                            usarComponenteComo: "actualizarPedido"
                                          }
                                        }}
                                      >
                                        {
                                          (new Date (current._id.Fecha)).toString().split(" ", 5).join(" ")
                                        } 
                                      </Link>                             
                                    ) 
                                  ) 
                                :
                                  <p className='sinPedidosPorEntregar'>No hay pedidos por Entregar</p>                                      
                              }
                            </div>              
                          </div>                
                        // )
                      }              
                  </div>            
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
