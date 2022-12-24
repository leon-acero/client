import "./pageNotFound.css"

import { Link } from 'react-router-dom'

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

function PageNotFound() {
  return (
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
                <h1 className='pageNotFound__titulo'>no existe</h1>
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

export default PageNotFound