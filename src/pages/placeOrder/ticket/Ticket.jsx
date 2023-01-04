import "./ticket.css"
import axios, { regresaMensajeDeError } from "../../../utils/axios";
import { formateaCurrency, formateaCaracteresEspeciales, formateaFechaEspaniol } from '../../../utils/formatea';
import { SE_APLICA_DESCUENTO } from '../../../utils/seAplicaDescuento';

/*******************************    React     *******************************/
import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
/****************************************************************************/

/*************************    Offline/Online     ****************************/
import { useNavigatorOnLine } from '../../../hooks/useNavigatorOnLine';
import OfflineFallback from '../../../components/offlineFallback/OfflineFallback';
/****************************************************************************/


/**************************    Snackbar    **********************************/
// import Snackbar from '@mui/material/Snackbar';
// import IconButton from '@mui/material/IconButton';
// import {FaTimes} from "react-icons/fa";
// import { Alert } from '@mui/material';
/****************************************************************************/

import TicketProduct from './ticketProduct/TicketProduct';
import SnackBarCustom from '../../../components/snackBarCustom/SnackBarCustom';
// import { NumericFormat } from 'react-number-format';


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


function Ticket() {

  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/


  /****************************    useLocation    *****************************/
  // Estos datos del Cliente los obtengo con useLocation los cuales los mandé
  // desde UpdateOrder.jsx

  const { clientId,
          theBasket,
          mensajeDeExito } = useLocation().state;

  /****************************************************************************/

  /**************************    useRef    **********************************/
  // avoidRerenderMensajeDeExito evita que se mande llamar dos veces useEffect
  // avoidRerenderCalculoDeSumasYDescuento evita que se mande llamar dos veces useEffect
  
  const avoidRerenderMensajeDeExito = useRef(false);
  const avoidRerenderFetchClient = useRef(false);
  /*****************************************************************************/  


  /*****************************    useState    ********************************/

  // iconoSnackBarDeExito es boolean que indica si tuvo exito o no la operacion
  // de AXIOS

  // totalBasket es el Total del Pedido sin tomar en cuenta el Total Descuento
  // totalDescuento es el total del Descuento del Pedido si aplica
  // fechaActual es la fecha del dia de hoy
  // mensajeWhatsApp es el ticket del Pedido que se manda a WhatsApp
  // clientData son los datos generales del cliente

  const [totalBasket, setTotalBasket] = useState (0);
  const [totalDescuento, setTotalDescuento] = useState (0);

  const [iconoSnackBarDeExito, setIconoSnackBarDeExito] = useState (true);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // const [fechaActual, setFechaActual] = useState(
  //         new Date(Date.now()).toString().split(" ", 5).join(" "))
  const [fechaActual, setFechaActual] = useState(
          formateaFechaEspaniol(new Date(Date.now())));


  const [mensajeWhatsApp, setMensajeWhatsApp] = useState('');

  const [clientData, setClientData] = useState(
    {
      _id: 0,
      sku: 0,
      ownerName: "", 
      businessName: "", 
      businessAddress: "",
      cellPhone: "", 
      fixedPhone: "",
      email: "", 
      esMayorista: false,
      imageCover: ""
    }
  )
  /*****************************************************************************/

  /**************************    useEffect    **********************************/
  useEffect(()=>{
    if (!isOnline) {
      return;
    }

    if (avoidRerenderMensajeDeExito.current) {
      return;
    }

    avoidRerenderMensajeDeExito.current = true;

    setIconoSnackBarDeExito(true);
    setMensajeSnackBar(mensajeDeExito);
    setOpenSnackbar(true);
  }, [mensajeDeExito, isOnline])
  /*****************************************************************************/  


  /************************     useEffect    *******************************/
  // fetchClient mandao cargar desde la BD el Cliente que me ineteresa
  // actualizar
  /**************************************************************************/

  useEffect (() => {

    if (!isOnline) {
      return;
    }

    if (avoidRerenderFetchClient.current) {
      return;
    }

    console.log("useEffect 1")

    const fetchClient = async () => {

      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderFetchClient.current = true;

      try {
   
        const res = await axios.get (`/api/v1/clients/${clientId}`);
  
        // console.log(res.data.data.data);
        setClientData(res.data.data.data);

        //////////

        const generarTicket = (sumTotalSinDescuento, sumDescuento) => {

          // console.log("useEffect 2")
          // if (!isOnline) {
          //   return;
          // }
        
          // if (avoidRerenderMensajeWhatsApp.current) {
          //   return;
          // }
        
          // avoidRerenderMensajeWhatsApp.current = true;
        
          // console.log("clientData", clientData);
    
          let mensaje ="El Juanjo | Dulcería%0a%0a";
          mensaje+=`Fecha: ${fechaActual}%0a`;
          mensaje+=`Vendedor: ${formateaCaracteresEspeciales(theBasket.userName)}%0a`;
          mensaje+=`Estatus: ${theBasket.estatusPedido === 1 ? "Por Entregar" : "Entregado"}%0a%0a`;
    
          mensaje+=`${formateaCaracteresEspeciales(res.data.data.data.businessName)}%0a`;
          mensaje+=`${formateaCaracteresEspeciales(res.data.data.data.ownerName)}%0a`;
          mensaje+=`${formateaCaracteresEspeciales(res.data.data.data.businessAddress)}%0a`;
          mensaje+=`${formateaCaracteresEspeciales(res.data.data.data.cellPhone)}%0a`;
          mensaje+=`${res.data.data.data.esMayorista ? "Mayorista" : "Minorista"}%0a%0a`;
    
        
          theBasket?.productOrdered?.forEach( product => {
            // console.log("product", product)
            mensaje+=`SKU: ${product.sku}%0a`;
            mensaje+=`${formateaCaracteresEspeciales(product.productName)}%0a`;
            mensaje+=`Cantidad: ${product.quantity}%0a`;
            mensaje+=`Precio Unitario: ${formateaCurrency(product.priceDeVenta)}%0a`;

            if (theBasket.seAplicaDescuento) {
              mensaje+=`Sub total: ${product.quantity === undefined || 
                product.quantity === "" || 
                product.quantity === null           
                ? "" 
                : formateaCurrency(product.quantity  * product.priceDeVenta)}%0a`;
        
                
              mensaje+=`Descuento (-): ${theBasket.seAplicaDescuento ? formateaCurrency(product.descuento) : ""}%0a`;
            }
            mensaje+="-------------------------%0a"
        
            mensaje+=`Total: ${(  product.quantity !== undefined && 
                                  product.quantity !== "" && 
                                  product.quantity !== null ) && 
                                  theBasket.seAplicaDescuento
              ? formateaCurrency(product.quantity  * product.priceDeVenta - product.descuento)
              : formateaCurrency(product.quantity  * product.priceDeVenta)}%0a%0a`;
          })
        
          // mensaje+=`%0a%0a`;
          if (theBasket.seAplicaDescuento) {
            // mensaje+=`${theBasket.seAplicaDescuento ? `Se Aplica ${SE_APLICA_DESCUENTO}% de Descuento` : ""}%0a`;
            mensaje+=`${`Se Aplica ${SE_APLICA_DESCUENTO}% de Descuento`}%0a`;
    
            mensaje+=`Total Venta: ${formateaCurrency(sumTotalSinDescuento)}%0a`;
          
            mensaje+=`Total Descuento (-): ${formateaCurrency(sumDescuento)}%0a`;
          }
    
          mensaje+="-------------------------%0a"
          
          mensaje+=`Total Pedido: ${formateaCurrency(sumTotalSinDescuento - sumDescuento)}%0a`;
        
          // console.log("mensaje", mensaje);
    
          setMensajeWhatsApp(mensaje);
        }
    
        // console.log("useEffect 3")
        let sumTotalSinDescuento = 0;
        let sumDescuento = 0;
    
        if (theBasket?.productOrdered?.length > 0) {
    
          theBasket?.productOrdered?.forEach(item=> {
            sumTotalSinDescuento += item.quantity === undefined || 
            item.quantity === "" || 
            item.quantity === null 
            ? 0 
            : item.quantity  * item.priceDeVenta;
      
            // if (seAplicaDescuento) {
            if (theBasket.seAplicaDescuento) {
              sumDescuento += item.quantity === undefined || 
              item.quantity === "" || 
              item.quantity === null 
              ? 0 
              : item.descuento = (item.priceDeVenta * item.quantity) * (SE_APLICA_DESCUENTO/100);
            }
            else {
              item.descuento = 0;
            }
            // console.log(sumTotalSinDescuento);
            // setTotalBasket(sumTotalSinDescuento);
          })
          // setTotalBasket(sumTotalSinDescuento - sumDescuento);
          setTotalBasket(sumTotalSinDescuento);
          setTotalDescuento (sumDescuento);
          generarTicket (sumTotalSinDescuento, sumDescuento)
        }
        else
        {
          setTotalBasket(0);
          setTotalDescuento(0);
        }
        //////////
      }
      catch (err) {
        console.log(err);
        setIconoSnackBarDeExito(false);
        setMensajeSnackBar (regresaMensajeDeError(err));
        setOpenSnackbar(true);
      }
    }

    fetchClient();
   
  }, [clientId, isOnline, fechaActual, theBasket]);


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
            <LazyMotion features={domAnimation} >

              <m.div className="ticket"
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
                </Snackbar>  */}
        
                <main className='ticket__main'>
                  <div className="ticket__container">
                    <h1 className='ticket__title'>El Juanjo | Dulcería</h1>

                    <br/>
                    <div className="ticket__headerInfo">
                      <p>
                        <span className="ticket__headerInfo-title">Fecha: </span>{fechaActual}
                      </p>
                      <p>
                        <span className="ticket__headerInfo-title">Vendedor: </span>{theBasket.userName}
                      </p>
                      <p>
                        <span className="ticket__headerInfo-title">Estatus: </span>{theBasket.estatusPedido === 1 ? "Por Entregar" : "Entregado"}
                      </p>
                    </div>

                    <div className="ticket__businessInfo">
                      <div className="editarCliente">
                        <p className="businessInfo__businessName">
                          {clientData.businessName}
                        </p>
                        <Link to={"/client/" + clientData._id}>
                          <button className="clientListEdit">Editar</button>
                        </Link>


                      </div>
                      <p className=''>{clientData.ownerName}</p>
                      <p className=''>{clientData.businessAddress}</p>
                      <p className="businessInfo__cellPhone">Celular (Whatsapp): {clientData.cellPhone}</p>
                      <p className="businessInfo__esMayorista">{clientData.esMayorista ? "Mayorista" : "Minorista"}</p>
                      
                      {/* <br/>
                      <p>Fecha: {fechaActual}</p>
                      <p>Vendedor: {theBasket.userName}</p>
                      <p className="">Estatus: {theBasket.estatusPedido === 1 ? "Por Entregar" : "Entregado"}</p> */}
                    </div>
                    {
                      theBasket?.productOrdered?.map((product, index)=> {
                        // console.log("product", product)
                        return ( 
                          <TicketProduct 
                            key={index}
                            index={index} 
                            productOrdered={product} 
                            seAplicaDescuento={theBasket.seAplicaDescuento}
                          />
                        )
                      }
                    )
                    } 
        
                    <div className="ticket__totalPedido">
                      {
                        theBasket.seAplicaDescuento && <p className='styleSeAplicaDescuento'>Se Aplica {SE_APLICA_DESCUENTO}% de Descuento</p>
                      }

                      {/* Total Venta */}
                      {
                        totalDescuento > 0 && (
                            
                            <div className="ticket__totalPedido__container">
                              <span className="ticket__totalPedido__item">Total Venta: </span>
                              
                              <span className="ticket__totalPedido__currency">
                                {
                                  formateaCurrency(totalBasket)
                                  // `$${totalBasket}`
                                  // <NumericFormat 
                                  //   value={totalBasket} 
                                  //   decimalScale={2} 
                                  //   thousandSeparator="," 
                                  //   prefix={'$'} 
                                  //   decimalSeparator="." 
                                  //   displayType="text" 
                                  //   renderText={(value) => <span>{value}</span>}
                                  // />
                                }
                              </span>
                            </div>
                        )
                      }
        
                      {/* Total Descuento */}
                      {
                        totalDescuento > 0 && (
                            <div className="ticket__totalPedido__container">
                              <span className="ticket__totalPedido__item">Total Descuento (-): </span>
                              
                              <span className="ticket__totalPedido__currency">
                                {
                                  formateaCurrency(totalDescuento)
                                  // `- $${totalDescuento}`
                                  // <NumericFormat 
                                  //   value={totalDescuento} 
                                  //   decimalScale={2} 
                                  //   thousandSeparator="," 
                                  //   prefix={'$'} 
                                  //   decimalSeparator="." 
                                  //   displayType="text" 
                                  //   renderText={(value) => <span>{value}</span>}
                                  // />
                                }
                              </span>
                            </div>
                        )
                      }
        
                      {/* Total Pedido = Total Venta - Total Descuento */}
                      <div className="ticket__totalPedido__container">
                        <span className={`ticket__totalPedido__item ${totalDescuento > 0 ? 'ticket__pedidoTotal' : ''}`}>Total Pedido: </span>
                        
                        <span className={`ticket__totalPedido__currency ${totalDescuento > 0 ? 'ticket__pedidoTotal' : ''}`}>
                          {/* {`$${totalBasket - totalDescuento}`} */}
                          {formateaCurrency(totalBasket - totalDescuento)}
                          {/* <NumericFormat 
                            value={totalBasket - totalDescuento} 
                            decimalScale={2} 
                            thousandSeparator="," 
                            prefix={'$'} 
                            decimalSeparator="." 
                            displayType="text" 
                            renderText={(value) => <span>{value}</span>}
                          /> */}
                        </span>         
                      </div>
        
                    </div>  
                    <div className="whatsapp_item">
                      {/* Nota: replace(/\s+/g,'') se usa para quitar los espacios
                          en blanco que pueda tener el número de celular para poder
                          mandar el mensaje a Whatsapp */}
                      {
                        clientData?.cellPhone !== ""
                        ? 
                          <a
                            className="whatsapp_link"
                            href={`https://wa.me/52${clientData?.cellPhone?.replace(/\s+/g,'')}?text=${mensajeWhatsApp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            >Mandar Ticket a Whatsapp {clientData.cellPhone}
                          </a>
                        : <p className='ticket__avisoClienteSinCelular'>El cliente No tiene Número de Celular asignado, edita al cliente para poder mandarle el Ticket</p>
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

export default Ticket