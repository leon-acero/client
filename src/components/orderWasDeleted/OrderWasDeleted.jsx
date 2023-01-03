import "./orderWasDeleted.css"

/*************************    Offline/Online     ****************************/
import { useNavigatorOnLine } from '../../hooks/useNavigatorOnLine';
import OfflineFallback from '../offlineFallback/OfflineFallback';
/****************************************************************************/

/**************************    React    *************************************/
import { useContext } from 'react';
import { Link } from 'react-router-dom'
/****************************************************************************/

/**************************    Context API    *******************************/
import { stateContext } from '../../context/StateProvider';
/****************************************************************************/

import { useMatchMedia } from '../../hooks/useMatchMedia';


/**************************    Framer-Motion    *****************************/
import { domAnimation, LazyMotion, m } from 'framer-motion';

const svgVariants = {
  hidden: { 
    opacity: 0, 
  },
  visible: { 
    opacity: 1, 
    transition: { delay: .5, duration: 2 }
  }
};
/****************************************************************************/


function OrderWasDeleted() {

  // 860px
  const isDesktopResolution = useMatchMedia("(min-width:53.75em)", true);


  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/


  /****************************    useContext    *******************************/
  // El id del usuario de la App, es decir el id del Vendedor que esta usando la App

  const { currentUser } = useContext(stateContext);
  /*****************************************************************************/  

  return (
    <>
      {
        isOnline && (
            <LazyMotion features={domAnimation} >
              <m.div 
                    className='orderWasDeleted'
                    variants={svgVariants}
                    initial="hidden"
                    animate="visible" 
              >
                <div className='orderWasDeleted__leftPanel'>
                  <div className='orderWasDeleted__laptops'>
        
                    <h3 className='orderWasDeleted__subTitulo'>EL JUANJO</h3>
        
                    <div className='orderWasDeleted_container_titulo'>
                      <h1 className='orderWasDeleted__titulo'>El pedido fue borrado</h1>
                      {/* <h1 className='orderWasDeleted__titulo'>no existe o no esta disponible</h1> */}
                    </div>
                    {/* <div className='orderWasDeleted_container_slogan'>
                      <p className='orderWasDeleted_slogan'>Ir al Inicio</p>
                    </div> */}
                  </div>
                  {
                    currentUser?.role === "admin" &&
                      <Link 
                          className='orderWasDeleted__inicioButton' 
                          to= {
                                isDesktopResolution ? "/dashboard" : "/"
                              }>
                                { isDesktopResolution ? "Ir a Home" : "Ir al Inicio" }
                      </Link>
                  }
                  {
                    currentUser?.role === "vendedor" &&
                      <Link 
                          className='orderWasDeleted__inicioButton' 
                          to="/">Ir al Inicio
                      </Link>
                  }
                </div>
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

export default OrderWasDeleted