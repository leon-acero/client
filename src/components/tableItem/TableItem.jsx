import "./tableItem.css"
import { Link } from 'react-router-dom';
import {clsx} from "clsx";
import { formateaThousand } from '../../utils/formatea';


const TableItem = ({ data }) => {

  return (
    <div className='tableItem'>
      <table className='tableItem__table'>
        <tbody className='tableItem__tbody'>
          {
            data?.length > 0 && (
              <tr className='tableItem__tr'>
                <th className='tableItem__th'>Acción</th>
                <th className='tableItem__th'>Producto</th> 
                <th className='tableItem__th'>Inv. Actual</th> 
                <th className='tableItem__th'>Inv. Mínimo</th> 
              </tr>
            )
          }
          {
            data.map(product => (
              <tr className='tableItem__tr' key={product.id}>
                <td className='tableItem__td'>
                  <Link className="abrirItem__link" to={`/product/${product.id}`}
                  >Abrir
                  </Link>
                </td>
                <td className='tableItem__td'> {product.productName}</td>
                <td className={clsx (
                    { 
                      inventarioActualNegativo: 
                      parseInt(product.inventarioActual, 10) < parseInt(product.inventarioMinimo, 10), 
                      tableItem__td: true,
                    })}>{formateaThousand(product.inventarioActual)}
                </td>
                <td className='tableItem__td'>{formateaThousand(product.inventarioMinimo)}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default TableItem;
