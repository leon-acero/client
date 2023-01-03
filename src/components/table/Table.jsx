import "./table.css"
import { Link } from 'react-router-dom';

const Table = ({ data, openVentana }) => {

  console.log("data", data);
  console.log("openVentana", openVentana);

  return (
    
    <table className='table__table'>
      <tbody className='table__tbody'>
        {data?.length > 0 && 
          <tr className='table__tr'>
            <th className='table__th'>Acción</th>
            <th className='table__th'>Negocio</th>
            <th className='table__th'>Contacto</th>
            <th className='table__th'>Celular</th>
          </tr>
        }
        {data.map(client => (
          <tr className='table__tr' key={client.id}>
            <td className='table__td'>
              {/* Ya no necesito mandar businessName, cellPhone, etc porque
                  es necesario al abrir la pagina /new-or-update-order
                  que vuelva a cargar el cliente, esto es porque hay un
                  boton de Editar y si edito el cliente y regreso a 
                  /new-or-update-order necesito volver a cargar el cliente */}
              {
                openVentana === "CrearPedido" && (
                    <Link className="abrirCliente__link" 
                          to={{
                                pathname: `/new-or-update-order/${client.id}`,
                                state: {
                                        clientId: client.id,
                                        // businessName: client.businessName, 
                                        // cellPhone: client.cellPhone, 
                                        // esMayorista: client.esMayorista,
                                        // businessImageCover: client.imageCover,
                                        // client: client
                                }
                          }}>Abrir
                    </Link>
                )
              }
              {
                openVentana === "EditarCliente" && (
                  <Link className="abrirCliente__link" 
                        to={`/client/${client.id}`}>Abrir
                  </Link>
                )
              }
            </td>
            <td className='table__td'>{client.businessName}</td>
            <td className='table__td'>{client.ownerName}</td>
            <td className='table__td'>{client.cellPhone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
