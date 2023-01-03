import "./ticketProduct.css"
// import defaultCameraImage from "../../../../camera.webp"

// import { NumericFormat } from 'react-number-format';
import { formateaCurrency } from '../../../../utils/formatea';

function TicketProduct( 
  {
    index, 
    productOrdered,
    seAplicaDescuento
  }
) {

  const uniqueKey = `ticketProduct-${productOrdered.product}`;

  return (
    <div className="ticketProduct" key={uniqueKey}>
        
      {/* <img 
          src={productOrdered.imageCover ? `${productOrdered.imageCover}` : defaultCameraImage} 
          className="productOrdered--image" 
          alt={productOrdered.productName} /> */}

      <div className="ticketProduct__info">
        <p className="ticketProduct__itemOrdered">SKU: {productOrdered.sku}</p>
        <p className="ticketProduct__productName">{productOrdered.productName}</p>
        <p className="ticketProduct__productName">Cantidad: {productOrdered.quantity}</p>

        {/* Precio Unitario */}
        <div className="ticketProduct__itemContainer">
          <span className="ticketProduct__itemOrdered">Precio Unitario: </span>

          <span className="ticketProduct__currency">
            { formateaCurrency(productOrdered.priceDeVenta) }
            {/* <NumericFormat 
                value={productOrdered.priceDeVenta} 
                decimalScale={2} 
                thousandSeparator="," 
                prefix={'$'} 
                decimalSeparator="." 
                displayType="text" 
                renderText={(value) => <span>{value}</span>}
              /> */}
          </span>
        </div> 

        {/* sub Total = Precio Unitario X Cantidad */}
        {
          productOrdered.descuento > 0 && (
              <div className="ticketProduct__itemContainer">
                <span className="ticketProduct__itemOrdered">Sub total:</span> 
                {
                  productOrdered.quantity === undefined || 
                  productOrdered.quantity === "" || 
                  productOrdered.quantity === null           
                  ? "" 
                  : <span className="ticketProduct__currency"> 
                  {
                    formateaCurrency(productOrdered.quantity  * productOrdered.priceDeVenta)
                    // <NumericFormat 
                    //   value={productOrdered.quantity  * productOrdered.priceDeVenta} 
                    //   decimalScale={2} 
                    //   thousandSeparator="," 
                    //   prefix={'$'} 
                    //   decimalSeparator="." 
                    //   displayType="text" 
                    //   renderText={(value) => <span>{value}</span>}
                    // />
                  } 
                  </span>
                }           
              </div>
          )
        }

        {/* Descuento */}
        {
          productOrdered.descuento > 0 && (
              <div className="ticketProduct__itemContainer">
                <span className="ticketProduct__itemOrdered">Descuento (-):</span>  
                  {/* {seAplicaDescuento  */}
                  {seAplicaDescuento 
                        ? <span className="ticketProduct__currency"> 
                        {
                          formateaCurrency(productOrdered.descuento)
                          // <NumericFormat 
                          //   value={productOrdered.descuento} 
                          //   decimalScale={2} 
                          //   thousandSeparator="," 
                          //   prefix={'$'} 
                          //   decimalSeparator="." 
                          //   displayType="text" 
                          //   renderText={(value) => <span>{value}</span>}
                          // />
                        }
                        </span>
                        : ""
                  }
              </div>
          )
        }

        {/* Total = sub Total - Descuento */}
        <div className="ticketProduct__itemContainer">
          <span className="ticketProduct__itemOrdered ticketProduct__productTotal">Total:</span> {
            (productOrdered.quantity !== undefined && 
              productOrdered.quantity !== "" && 
              productOrdered.quantity !== null ) && seAplicaDescuento
              ? <span className="ticketProduct__currency ticketProduct__productTotal">
                {
                  formateaCurrency(productOrdered.quantity  * productOrdered.priceDeVenta - productOrdered.descuento)
                  // <NumericFormat 
                  //   value={productOrdered.quantity  * productOrdered.priceDeVenta - productOrdered.descuento} 
                  //   decimalScale={2} 
                  //   thousandSeparator="," 
                  //   prefix={'$'} 
                  //   decimalSeparator="." 
                  //   displayType="text" 
                  //   renderText={(value) => <span>{value}</span>}
                  //   />
                }
                </span>
              : <span className="ticketProduct__currency ticketProduct__productTotal">
                {
                  formateaCurrency(productOrdered.quantity  * productOrdered.priceDeVenta)
                  // <NumericFormat 
                  //   value={productOrdered.quantity  * productOrdered.priceDeVenta} 
                  //   decimalScale={2} 
                  //   thousandSeparator="," 
                  //   prefix={'$'} 
                  //   decimalSeparator="." 
                  //   displayType="text" 
                  //   renderText={(value) => <span>{value}</span>}
                  // />
                }
              </span>
            }                     
        </div>
      </div>
    </div>  
  )
} 


export default TicketProduct