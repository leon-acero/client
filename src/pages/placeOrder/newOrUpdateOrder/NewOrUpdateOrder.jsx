import "./newOrUpdateOrder.css"
import axios from '../../../utils/axios';

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';

// import axios from "axios";
// import { Skeleton } from '@mui/material';

import { domAnimation, LazyMotion, m } from 'framer-motion';
import SkeletonElement from '../../../components/skeletons/SkeletonElement';
import { FaArrowLeft } from 'react-icons/fa';


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

  const history = useHistory();
  
  // const [ultimosCincoPedidos, setUltimosCincoPedidos] = useState([]);
  const [ultimosCincoPedidos, setUltimosCincoPedidos] = useState(null);
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

  useEffect (()=>{

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

      }
    }

    fetchUltimosCincoPedidosPorEntregar ();
  }, [clientId])

  const handleGoBackOnePage = () => {

    // history.go(-1);
    history.goBack();
  }

  return (
    <LazyMotion features={domAnimation} >
      <m.div className="newOrUpdateOrder"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="regresarAPaginaAnterior">
          <FaArrowLeft onClick={handleGoBackOnePage} className="arrowLeftGoBack" />
        </div>
        {/* <h2><span>PASO 2: </span>CREA UN NUEVO PEDIDO O SELECCIONA UNO POR ENTREGAR</h2> */}
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

          {/* <p className='pedidosPorEntregar__title'>Pedidos Por Entregar por Fecha</p> */}
          
            {
              ultimosCincoPedidos?.length > 0 && (
                <div className="pedidosPorEntregar__container">
                  <p className="pedidosPorEntregar__title">Pedidos Por Entregar por Fecha</p>

                  <div className="ultimosCincoPedidos_group">
                    {ultimosCincoPedidos
                    ?              
                      ultimosCincoPedidos.map((current, index) =>  
                        
                          <Link 
                                  key={index} 
                                  className="linkNuevoPedido" 
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
                            <button className='linkActualizarPedido__button'>
                              {
                                (new Date (current._id.Fecha)).toString().split(" ", 5).join(" ")
                              }
                            </button> 
                          </Link>
                        
                      ) 
                    : <SkeletonElement type="rectangular" width="20rem" height="auto" />
                    }
                  </div>              
                </div>                
              )
            }
          
        </div>
      </m.div>
    </LazyMotion>

  )
}
