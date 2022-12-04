import "./clientFound.css"
import React from 'react'
// import MailOutline from "@mui/icons-material/MailOutline";
import { Link } from 'react-router-dom';


export default function ClientFound({id, businessName, cellPhone, esMayorista}) {
  return (
    <div className='clientFound'>
      <p key={id} className="clientFoundStyle">
        {businessName} {cellPhone} {esMayorista ? "Mayorista" : "Minorista"}
        <Link className="clientFoundStyle__link" to={{
                    pathname: `/new-order/${id}`,
                    state: {businessName, cellPhone, esMayorista} // your data array of objects
                  }}>Crear Pedido
        </Link>
      </p>
        
    </div>
  )
}
