import "./table.css"
import { Link } from 'react-router-dom';

const Table = ({ data }) => {

  return (
    
    <table>
      <tbody>
        {data?.length > 0 && 
          <tr>
            <th>Acción</th>
            <th>Negocio</th>
            <th>Contacto</th>
            <th>Celular</th>
          </tr>
        }
        {data.map(client => (
          <tr key={client.id}>
            <td>
              <Link className="abrirCliente__link" to={{
                    pathname: `/new-or-update-order/${client.id}`,
                    state: {
                            clientId: client.id,
                            businessName: client.businessName, 
                            cellPhone: client.cellPhone, 
                            esMayorista: client.esMayorista,
                            businessImageCover: client.imageCover
                    }
                  }}>Abrir
              </Link>
            </td>
            <td>{client.businessName}</td>
            <td>{client.ownerName}</td>
            <td>{client.cellPhone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
