import "./searchClient.css"
// import axios from "axios";

import { useState, useRef, useEffect } from 'react'
import Table from '../../../components/table/Table';
// import ClientFound from '../clientFound/ClientFound';

/**************************    Snackbar    **********************************/
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import {FaTimes} from "react-icons/fa";
import { Alert } from '@mui/material';
/****************************************************************************/

import { domAnimation, LazyMotion, m } from 'framer-motion';
import SkeletonElement from '../../../components/skeletons/SkeletonElement';
import axios from '../../../utils/axios';


const containerVariants = {
  hidden: { 
    opacity: 0, 
  },
  visible: { 
    opacity: 1, 
    transition: { duration: .4, delay: 0.5 }
  }
};

export default function SearchClient() {

  const [query, setQuery] = useState("");
  // const [data, setData] = useState([]);
  const [data, setData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);


  /**************************    useState    **********************************/
  // inputRef lo uso para que al cargar la pagina ponga el focus en el Buscar
  // el Negocio

  const inputRef = useRef(null);
  /*****************************************************************************/

  /**************************    useEffect    **********************************/
  // Al cargar la pagina pone el focus en el buscar el Negocio
  useEffect(()=>{
    inputRef.current.focus();
  },[])
  /*****************************************************************************/

  
  const handleSearch = async (event) => {
    event.preventDefault();

    if (isSearching)
      return;

    // console.log("query", query);
    // const regExOptions = `businessName[regex]=(?i)${query}&sort=businessName`;

    try {
      if (query.length > 2) {
        setIsSearching(true);
  
        setData(null);
        
        // const res = await axios ({
        //   withCredentials: true,
        //   method: 'GET',
        //   // url: `http://127.0.0.1:8000/api/v1/clients?q=${query}`
        //   // url: `http://127.0.0.1:8000/api/v1/clients?${regExOptions}`

        //   url: `http://127.0.0.1:8000/api/v1/clients/search-client/${query}`
        //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/clients/search-client/${query}`
  
        // });

        const res = await axios.get (`/api/v1/clients/search-client/${query}`);
        
        // console.log(res.data.data.data);

        setIsSearching(false);
        setData(res.data.data.data);
        if (res.data.data.data.length === 0) {
          setMensajeSnackBar("No se encontró un Negocio con esa búsqueda.")
          setOpenSnackbar(true);
        }
        inputRef.current.focus();
      }

    }
    catch (err) {
      setIsSearching(false);
      setMensajeSnackBar("Hubo un error al realizar la búsqueda. Vuelva a intentar.")
      setOpenSnackbar(true);
      console.log("err");
    }
  }

  /************************     handleCloseSnackbar    **********************/
  // Es el handle que se encarga cerrar el Snackbar
  /**************************************************************************/
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  /*****************************     action    ******************************/
  // Se encarga agregar un icono de X al SnackBar
  /**************************************************************************/  
  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <FaTimes />
      </IconButton>
    </>
  );

  return (
    <LazyMotion features={domAnimation}>
      <m.div className='searchClient'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
        >
          <Alert 
              severity= {"success"} 
              action={action}
              sx={{ fontSize: '1.4rem', backgroundColor:'#333', color: 'white', }}
          >{mensajeSnackBar}
          </Alert>
        </Snackbar>

        {/* <h2><span>PASO 1: </span>BUSCAR Y ELEGIR UN NEGOCIO</h2> */}
        <form className='searchClientInput' onSubmit={handleSearch}>
          {/* <label>Buscar Cliente</label> */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar Negocio, ejemplo: Abarrotes El Puerto"
            className="clientSearchInput"                  
            onChange={(e) => setQuery(e.target.value.toLowerCase())}
            required
            onInvalid={e=> e.target.setCustomValidity('El Nombre del Negocio debe tener entre 3 y 80 caracteres')} 
            onInput={e=> e.target.setCustomValidity('')} 
            minLength="3"
            maxLength="80"
          />
          <button className="btnSearchClient" disabled={isSearching}>
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
        
        {
          data && <Table data={data} />
        }

        {
          isSearching && <SkeletonElement 
                            type="rectangular" 
                            width="100%" height="5.6rem" 
                          />
        }
        {/* <p>{data.id} {data.businessName} {data.cellPhone}</p> */}

        {/* <div className="container__ClientsFound">
          {
            data.map(client=> 
              (
                <ClientFound 
                      key={client.id} 
                      id={client.id} 
                      businessName={client.businessName} 
                      cellPhone={client.cellPhone} 
                      esMayorista={client.esMayorista} />
              ) 
            )
          }
        </div> */}
      </m.div>

    </LazyMotion>
  )
}

