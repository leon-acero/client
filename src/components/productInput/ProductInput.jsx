import "./productInput.css"
import Card from '../card/Card';

export default function ProductInput({ 
  index, 
  product, 
  addProductToBasket,
  esMayorista,
  isSaving,
  isDeleting}) {

  const uniqueKey = `product-${product.id}`;

  return (
    <Card uniqueKey={uniqueKey} 
          product={product} 
          esMayorista={esMayorista} 
          addProductToBasket={addProductToBasket}
          isSaving={isSaving}
          isDeleting={isDeleting} />
  )
}
