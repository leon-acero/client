import "./splashScreenAlt.css"
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

function SplashScreenAlt() {
  return (
    <LazyMotion features={domAnimation} >
      <m.div 
            className='splashScreenAlt'
            variants={svgVariants}
            initial="hidden"
            animate="visible" 
      >
        <div className='splashScreenAlt__leftPanel'>
          <div className='laptops'>

            <h3 className='splashScreenAlt__subTitulo'>EL JUANJO</h3>

            <div className='container_titulo'>
              <h1 className='splashScreenAlt__titulo'>Satisfacemos la pasión</h1>
              <h1 className='splashScreenAlt__titulo'>por los dulces</h1>
            </div>
            <div className='container_slogan'>
              <p className='slogan'>Llevamos dulces a tiendas y negocios en el área Metropolitana de Monterrey.</p>
            </div>
          </div>
          <Link className='hero__loginButton' to="/login">Iniciar sesión</Link>
        </div>
        <img className='splashScreenAlt__mujer-modelo' src="/img/website/modelo-con-paleta-recortado.png" alt="" />
      </m.div>

    </LazyMotion>
  )
}

export default SplashScreenAlt