import "./ticketFromServer.css"

import axios, { regresaMensajeDeError } from "../../../utils/axios";

import { formateaCurrency, formateaCaracteresEspeciales, formateaFechaEspaniol, formateaTextoWhatsAppABold, formateaQuitaEspaciosEnBlanco } from '../../../utils/formatea';
import { SE_APLICA_DESCUENTO } from '../../../utils/seAplicaDescuento';

/*******************************    React     *******************************/
import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
/****************************************************************************/

/*************************    Offline/Online     ****************************/
import { useNavigatorOnLine } from '../../../hooks/useNavigatorOnLine';
import OfflineFallback from '../../../components/offlineFallback/OfflineFallback';
/****************************************************************************/

import SnackBarCustom from '../../../components/snackBarCustom/SnackBarCustom';
import TicketFromServerProduct from './ticketFromServerProduct/TicketFromServerProduct';


/**************************    Framer-Motion    *****************************/
import { domAnimation, LazyMotion, m } from 'framer-motion';
import SkeletonElement from '../../../components/skeletons/SkeletonElement';

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

function TicketFromServer() {

  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/


  /**************************    useParams    **********************************/
  // orderId es la _id del Pedido que viene en el URL, me sirve para
  // obtener el Ticket de la BD

  const {orderId } = useParams();
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
  const avoidRerenderfetchTicketDeVenta = useRef(false);
  /*****************************************************************************/  

    /*****************************    useState    ********************************/

  // iconoSnackBarDeExito es boolean que indica si tuvo exito o no la operacion
  // de AXIOS

  // fechaActual es la fecha del dia de hoy
  // mensajeWhatsApp es el ticket del Pedido que se manda a WhatsApp
  // clientData son los datos generales del cliente

  
  const [iconoSnackBarDeExito, setIconoSnackBarDeExito] = useState (true);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [fechaActual, setFechaActual] = useState(
          formateaFechaEspaniol(new Date(Date.now())));

  const [mensajeWhatsApp, setMensajeWhatsApp] = useState('');

  const [ ticketDeVenta, setTicketDeVenta ] = useState([{}]);

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
  // fetchTicketDeVenta mandao cargar desde la BD el Cliente que me ineteresa
  // actualizar
  /**************************************************************************/

  useEffect (() => {

    if (!isOnline) {
      return;
    }

    if (avoidRerenderfetchTicketDeVenta.current) {
      return;
    }

    const fetchTicketDeVenta = async () => {

      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderfetchTicketDeVenta.current = true;

      try {
   
        const res = await axios.get (`/api/v1/clients/${clientId}`);
  
        // console.log(res.data.data.data);
        setClientData(res.data.data.data);

        const resTicket = await axios.get (`/api/v1/sales/ticket-from-server/${orderId}`);
  
        // console.log("2")
        // console.log("res Ticket", resTicket?.data?.data?.ticketDeVenta);
        console.log("res Ticket",resTicket);
        setTicketDeVenta(resTicket.data.data.ticketDeVenta);

        //////
        let mensaje =`${formateaTextoWhatsAppABold("EL JUANJO | DULCERIA")}%0a%0a`;
        mensaje+=`Fecha: ${formateaTextoWhatsAppABold(fechaActual)}%0a`;
        mensaje+=`Vendedor: ${formateaCaracteresEspeciales(theBasket.userName)}%0a`;
        mensaje+=`Estatus: ${theBasket.estatusPedido === 1 ? "Por Entregar" : "Entregado"}%0a%0a`;
        mensaje+=`Order Id: ${orderId}%0a`;
  
        mensaje+=`${formateaTextoWhatsAppABold(formateaCaracteresEspeciales(res.data.data.data.businessName))}%0a`;
        mensaje+=`${formateaCaracteresEspeciales(res.data.data.data.ownerName)}%0a`;
        mensaje+=`${formateaCaracteresEspeciales(res.data.data.data.businessAddress)}%0a`;
        mensaje+=`${formateaCaracteresEspeciales(res.data.data.data.cellPhone)}%0a`;
        mensaje+=`${res.data.data.data.esMayorista ? "Mayorista" : "Minorista"}%0a%0a`;

        mensaje+=`Total de Productos: ${resTicket?.data?.data?.ticketDeVenta[0]?.TotalProducto}%0a%0a`;

        resTicket?.data?.data?.ticketDeVenta[0]?.productOrdered?.forEach( product => {
          // console.log("product", product)
          mensaje+=`SKU: ${product.sku}%0a`;

          mensaje+=`${formateaTextoWhatsAppABold(formateaCaracteresEspeciales(product.productName))}%0a`;

          mensaje+=`${formateaTextoWhatsAppABold("Cantidad:")} ${formateaTextoWhatsAppABold(product.quantity)}%0a`;
          
          mensaje+=`Precio Unitario: ${formateaCurrency(product.priceDeVenta)}%0a`;

          if (product.descuento > 0) {
            mensaje+=`Sub total: ${formateaCurrency(product.subTotal)}%0a`;
      
              
            mensaje+=`Descuento (-): ${formateaCurrency(product.descuento)}%0a`;
          }
          mensaje+="----------------------------------------%0a"
      
          mensaje+=`Total: ${formateaCurrency(product.total)}%0a%0a`;
        })

        if (resTicket?.data?.data?.ticketDeVenta[0]?.TotalDescuento) {
          // mensaje+=`${theBasket.seAplicaDescuento ? `Se Aplica ${SE_APLICA_DESCUENTO}% de Descuento` : ""}%0a`;
          mensaje+=`${`Se Aplica ${SE_APLICA_DESCUENTO}% de Descuento`}%0a%0a`;
  
          mensaje+=`Total Venta: ${formateaCurrency(resTicket?.data?.data?.ticketDeVenta[0]?.TotalVenta)}%0a`;
        
          mensaje+=`Total Descuento (-): ${formateaCurrency(resTicket?.data?.data?.ticketDeVenta[0]?.TotalDescuento)}%0a`;
        }
  
        mensaje+="----------------------------------------%0a"
        
        mensaje+=`${formateaTextoWhatsAppABold("Total Pedido:")} ${formateaTextoWhatsAppABold(formateaCurrency(resTicket?.data?.data?.ticketDeVenta[0]?.TotalPedido))}%0a`;
      
        // console.log("mensaje", mensaje);
  
        setMensajeWhatsApp(mensaje);
        //////

        
      }
      catch (err) {
        console.log(err);
        setIconoSnackBarDeExito(false);
        setMensajeSnackBar (regresaMensajeDeError(err));
        setOpenSnackbar(true);
      }
    }

    fetchTicketDeVenta();
   
  }, [isOnline, orderId, fechaActual, theBasket, clientId]);


  return (
    <>
      {
        isOnline && (
          <LazyMotion features={domAnimation} >

            <m.div  className='ticketFromServer'
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
            >
              <SnackBarCustom 
                openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} mensajeSnackBar={mensajeSnackBar} 
                iconoSnackBarDeExito={iconoSnackBarDeExito} /> 

              <main className='ticketFromServer__main'>
                <div className="ticketFromServer__container">
                  {
                    mensajeWhatsApp !== "" 
                    ?
                      <>
                        <h1 className='ticketFromServer__title'>El Juanjo | Dulcería</h1>

                        <br/>
                        <div className="ticketFromServer__headerInfo">
                          <p>
                            <span className="ticketFromServer__headerInfo-title">Fecha: </span>
                            {fechaActual}
                          </p>
                          <p>
                            <span className="ticketFromServer__headerInfo-title">Vendedor: </span>
                            {theBasket.userName}
                          </p>
                          <p>
                            <span className="ticketFromServer__headerInfo-title">Estatus: </span>
                            {theBasket.estatusPedido === 1 ? "Por Entregar" : "Entregado"}
                          </p>
                          <p>
                            <span className="ticketFromServer__headerInfo-title">Order Id: </span>
                            {orderId}
                          </p>
                        </div>

                        <div className="ticketFromServer__businessInfo">
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
                          <p className="businessInfo__esMayorista">
                            {clientData.esMayorista ? "Mayorista" : "Minorista"}
                          </p>
                          
                          <br/>
                          <p className=''>{`Total de Productos: ${ticketDeVenta[0]?.TotalProducto}`}</p>
                        </div>
                        {
                          ticketDeVenta[0]?.productOrdered?.map((product, index)=> {
                            // console.log("product", product)
                            return ( 
                              <TicketFromServerProduct
                                key={index}
                                index={index} 
                                productOrdered={product} 
                                seAplicaDescuento={ticketDeVenta[0]?.TotalDescuento > 0 ? true : false}
                              />
                            )
                          })
                        } 

                        <div className="ticketFromServer__totalPedido">
                          {
                            ticketDeVenta[0]?.TotalDescuento > 0 && (
                              <p className='styleSeAplicaDescuento'>
                                Se Aplica {SE_APLICA_DESCUENTO}% de Descuento
                              </p>
                            )
                          }

                          {/* Total Venta */}
                          {
                            ticketDeVenta[0]?.TotalDescuento > 0 && (
                                
                                <div className="ticketFromServer__totalPedido__container">
                                  <span className="ticketFromServer__totalPedido__item">
                                    Total Venta: 
                                  </span>
                                  
                                  <span className="ticketFromServer__totalPedido__currency">
                                    {
                                      formateaCurrency(ticketDeVenta[0]?.TotalVenta)
                                    }
                                  </span>
                                </div>
                            )
                          }

                          {/* Total Descuento */}
                          {
                            ticketDeVenta[0]?.TotalDescuento > 0 && (
                                <div className="ticketFromServer__totalPedido__container">
                                  <span className="ticketFromServer__totalPedido__item">
                                    Total Descuento (-): 
                                  </span>
                                  
                                  <span className="ticketFromServer__totalPedido__currency">
                                    {
                                      formateaCurrency(ticketDeVenta[0]?.TotalDescuento)
                                    }
                                  </span>
                                </div>
                            )
                          }

                          {/* Total Pedido = Total Venta - Total Descuento */}
                          <div className="ticketFromServer__totalPedido__container">
                            <span className=
                              {
                                `ticketFromServer__totalPedido__item 
                                ${
                                    ticketDeVenta[0]?.TotalDescuento > 0 
                                    ? 'ticketFromServer__pedidoTotal' 
                                    : ''
                                }`
                              }
                            >                          
                              Total Pedido:  
                            </span>
                            
                            <span className= 
                              {
                                `ticketFromServer__totalPedido__currency 
                                ${
                                    ticketDeVenta[0]?.TotalDescuento > 0 
                                    ? 'ticketFromServer__pedidoTotal' 
                                    : ''
                                }`
                              }
                            >
                              {/* {`$${totalBasket - totalDescuento}`} */}
                              {
                                formateaCurrency(ticketDeVenta[0]?.TotalPedido)
                              }
                            </span>         
                          </div>

                        </div>  
                        <div className="whatsapp_item">
                          {/* Nota: replace(/\s+/g,'') se usa para quitar los espacios
                              en blanco que pueda tener el número de celular para poder
                              mandar el mensaje a Whatsapp */}
                          {
                            // clientData?.cellPhone !== ""
                            // ? 
                            //   <a
                            //     className="whatsapp_link"
                            //     // href={`https://wa.me/52${clientData?.cellPhone?.replace(/\s+/g,'')}?text=${mensajeWhatsApp}`}
                            //     href={`https://wa.me/52${formateaQuitaEspaciosEnBlanco(clientData?.cellPhone)}?text=${mensajeWhatsApp}`}
                            //     target="_blank"
                            //     rel="noopener noreferrer"
                            //     >Mandar Ticket a Whatsapp {clientData.cellPhone}
                            //   </a>
                            // : 
                            <p className='ticketFromServer__avisoClienteSinCelular'>
                                El cliente No tiene Número de Celular asignado, edita al cliente para poder mandarle el Ticket
                              </p>
                          }
                        </div>
                          
                        <div className="ticketFromServer__inicioButton-container">                     
                          <Link 
                              className='ticketFromServer__inicioButton' 
                              to={
                                  {
                                  pathname: '/search-client',
                                  state: {
                                    openVentana: "CrearPedido"
                                  }
                              }
                            }>Crear Nuevo Pedido
                          </Link>
                        </div>                    
                      </>                    
                    
                    :
                      <SkeletonElement type="rectangular" 
                            width="auto" height="auto" /> 
                  }

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

export default TicketFromServer