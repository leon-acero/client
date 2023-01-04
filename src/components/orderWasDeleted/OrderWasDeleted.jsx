import "./orderWasDeleted.css"

/*************************    Offline/Online     ****************************/
import { useNavigatorOnLine } from '../../hooks/useNavigatorOnLine';
import OfflineFallback from '../offlineFallback/OfflineFallback';
/****************************************************************************/

/**************************    React    *************************************/
import { Link } from 'react-router-dom'
/****************************************************************************/

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


  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
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
                    <Link 
                        className='orderWasDeleted__inicioButton' 
                        to={
                            {
                            pathname: '/search-client',
                            state: {
                              openVentana: "CrearPedido"
                            }
                        }
                      }>Crear Nuevo Pedido
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