import { Link } from 'react-router-dom'
import "./splashScreenAlt.css"

function SplashScreenAlt() {
  return (
    <div className='splashScreenAlt'>
      <div className='splashScreenAlt__leftPanel'>
        <div className='laptops'>

          <h3 className='splashScreenAlt__subTitulo'>EL JUANJO</h3>

          <div className='container_titulo'>
            <h1 className='splashScreenAlt__titulo'>Satisfacemos la pasión</h1>
            <h1 className='splashScreenAlt__titulo'>por los dulces</h1>
          </div>
          <div className='container_slogan'>
            <p className='slogan'>Llevamos los dulces más deliciosos a tiendas y negocios.</p>
          </div>
        </div>
        <Link className='hero__loginButton' to="/login">Iniciar sesión</Link>
      </div>
      <img className='splashScreenAlt__mujer-modelo' src="/img/website/modelo-con-paleta-recortado.png" alt="" />
    </div>
  )
}

export default SplashScreenAlt