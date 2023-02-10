import "./offlineFallback.css"

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


function OfflineFallback() {
  return (
    <LazyMotion features={domAnimation} >
    <m.div 
          className='offlineFallback'
          variants={svgVariants}
          initial="hidden"
          animate="visible" 
    >
      <div className='offlineFallback__leftPanel'>
        <div className='offlineFallback__laptops'>

          <h3 className='offlineFallback__subTitulo'>EL JUANJO</h3>

          <div className='offlineFallback_container_titulo'>        
            <h1 className='offlineFallback__titulo'>No estas conectado a la Red</h1>
          </div>

          <h1 className='offlineFallback__posiblesSoluciones'>Posibles Soluciones</h1>

          <div className='offlineFallback_container_slogan'>
            <p className='offlineFallback_slogan'>1. Si estas usando Wi-Fi checa tu conexión.</p>
            <p className='offlineFallback_slogan'>2. Si estas usando datos checa si tienes saldo y haz una recarga de ser necesario.</p>
            <p className='offlineFallback_slogan'>3. Si estas en un lugar con mala recepción muévete de lugar.</p>
          </div>
        </div>
      </div>
    </m.div>
  </LazyMotion>
  )
}

export default OfflineFallback