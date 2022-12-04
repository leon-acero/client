import "./card.css"
import { BASE_URL } from '../../utils/axios'

export default function Card(
  { 
    uniqueKey, 
    product, 
    esMayorista, 
    addProductToBasket 
  }) {
  
  return (
    <div key={uniqueKey} className="card">
      <img 
        // src={`/img/products/${product.imageCover}`} 
        // src={`http://127.0.0.1:8000/img/products/${product.imageCover}`} 
        src={`${BASE_URL}/img/products/${product.imageCover}`} 
        className="card--image" 
        alt={product.productName} />

      <div className="card--stats">
        <div className="card--stats__info">
          <p>SKU: {product.sku}</p>
          <p>{product.productName}</p>
          <p>${esMayorista 
                ? product.priceMayoreo 
                : product.priceMenudeo}
          </p>
        </div>

        <button className="buttonAddProductToBasket" 
                onClick={()=>addProductToBasket(product.id)}>Agregar al Carrito
        </button>
      </div>
    </div>  

)
}
