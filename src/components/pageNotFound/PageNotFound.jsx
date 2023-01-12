import "./pageNotFound.css"

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


function PageNotFound() {

  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/

  console.log("NO ENCONTRE")
  return (

    <>
      {
        isOnline && (
          <LazyMotion features={domAnimation} >
            <m.div 
                  className='pageNotFound'
                  variants={svgVariants}
                  initial="hidden"
                  animate="visible" 
            >
              <div className='pageNotFound__leftPanel'>
                <div className='pageNotFound__laptops'>

                  <h3 className='pageNotFound__subTitulo'>EL JUANJO</h3>

                  <div className='pageNotFound_container_titulo'>
                    <h1 className='pageNotFound__titulo'>La página que solicitaste</h1>
                    <h1 className='pageNotFound__titulo'>no existe o no esta disponible</h1>
                  </div>
                  <div className='pageNotFound_container_slogan'>
                    <p className='pageNotFound_slogan'>Vuelve a Iniciar Sesión.</p>
                  </div>
                </div>
                <Link className='pageNotFound__loginButton' to="/login">Iniciar sesión</Link>
              </div>
              {/* <img className='pageNotFound__Offline_NotFound' src="/img/website/Offline.webp" alt="" /> */}
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

export default PageNotFound