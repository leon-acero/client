import "./ticketFromServerProduct.css"

import { formateaCurrency } from '../../../../utils/formatea';

function ticketFromServerProduct( 
  {
    index, 
    productOrdered,
    seAplicaDescuento
  }
) {

  const uniqueKey = `ticketFromServerProduct-${productOrdered.product}`;

  return (
    <div className="ticketFromServerProduct" key={uniqueKey}>

      <div className="ticketFromServerProduct__info">
        <p className="ticketFromServerProduct__itemOrdered">
          SKU: {productOrdered.sku}
        </p>

        <p className="ticketFromServerProduct__productName">
          {productOrdered.productName}
        </p>

        <p className="ticketFromServerProduct__productName">
          Cantidad: {productOrdered.quantity}
        </p>

        {/* Precio Unitario */}
        <div className="ticketFromServerProduct__itemContainer">
          <span className="ticketFromServerProduct__itemOrdered">
            Precio Unitario: 
          </span>

          <span className="ticketFromServerProduct__currency">
            { formateaCurrency(productOrdered.priceDeVenta) }
          </span>
        </div> 

        {/* sub Total = Precio Unitario X Cantidad */}
        {
          productOrdered.descuento > 0 && (
              <div className="ticketFromServerProduct__itemContainer">
                <span className="ticketFromServerProduct__itemOrdered">
                  Sub total:
                </span> 
                
                <span className="ticketFromServerProduct__currency"> 
                {
                  formateaCurrency(productOrdered.subTotal)
                } 
                </span>
                           
              </div>
          )
        }

        {/* Descuento */}
        {
          productOrdered.descuento > 0 && (
              <div className="ticketFromServerProduct__itemContainer">
                <span className="ticketFromServerProduct__itemOrdered">
                  Descuento (-):
                </span>  

                <span className="ticketFromServerProduct__currency"> 
                  {
                    formateaCurrency(productOrdered.descuento)
                  }
                </span>  
              </div>
          )
        }

        {/* Total = sub Total - Descuento */}
        <div className="ticketFromServerProduct__itemContainer">
          <span 
                className="ticketFromServerProduct__itemOrdered ticketFromServerProduct__productTotal"
          >
            Total:
          </span> 
          
          <span 
                className="ticketFromServerProduct__currency ticketFromServerProduct__productTotal">
              {
                formateaCurrency(productOrdered.total)
              }
          </span>            
                               
        </div>
      </div>
    </div>  
  )
} 


export default ticketFromServerProduct