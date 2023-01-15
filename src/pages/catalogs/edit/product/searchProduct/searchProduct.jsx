import "./searchProduct.css"
import axios, { regresaMensajeDeError } from '../../../../../utils/axios';

/*************************    Offline/Online     ****************************/
import { useNavigatorOnLine } from '../../../../../hooks/useNavigatorOnLine';
import OfflineFallback from '../../../../../components/offlineFallback/OfflineFallback';
/****************************************************************************/

/*******************************    React     *******************************/
import { useState, useRef, useEffect } from 'react'
/****************************************************************************/

/***************************    Components     ******************************/
import TableItem from '../../../../../components/tableItem/TableItem';
import SkeletonElement from '../../../../../components/skeletons/SkeletonElement';
import SnackBarCustom from '../../../../../components/snackBarCustom/SnackBarCustom';
/****************************************************************************/

/**************************    Framer-Motion    *****************************/
import { domAnimation, LazyMotion, m } from 'framer-motion';


const containerVariants = {
  hidden: { 
    opacity: 0, 
  },
  visible: { 
    opacity: 1, 
    transition: { duration: .4, delay: 0.5 }
  }
};
/****************************************************************************/


export default function SearchProduct() {


  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/

  /**************************    useState    **********************************/
  // query guarda lo que el usuario capturó para iniciar la busqueda

  // iconoSnackBarDeExito es boolean que indica si tuvo exito o no la operacion 
  // de Axios

  // data es un Array con el resultado de la búsqueda
  
  // isSearching es un boolean para saber si se esta realizando una búsqueda

  const [query, setQuery] = useState("");
  // const [data, setData] = useState([]);
  const [data, setData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  const [iconoSnackBarDeExito, setIconoSnackBarDeExito] = useState (true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  /*****************************************************************************/


  /*****************************    useRef    **********************************/
  // inputRef lo uso para que al cargar la pagina ponga el focus en el Buscar
  // el producto

  const inputRef = useRef(null);
  /*****************************************************************************/

  /**************************    useEffect    **********************************/
  // Al cargar la pagina pone el focus en el buscar el producto
  useEffect(()=>{
    inputRef?.current?.focus();
  },[])
  /*****************************************************************************/

  
  /***************************     handleSearch    **************************/
  // Es el handle que se encarga de hacer la búsqueda
  /**************************************************************************/
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

        const res = await axios.get (`/api/v1/products/search-product/${query}`);
        
        // console.log(res.data.data.data);

        setIsSearching(false);
        setData(res.data.data.data);
        
        if (res.data.data.data.length === 0) {
          setIconoSnackBarDeExito(false);
          setMensajeSnackBar("No se encontró un Producto con esa búsqueda.")
          setOpenSnackbar(true);
        }
        // inputRef?.current?.focus();
      }

    }
    catch (err) {
      console.log("err");
      setIsSearching(false);
      // setMensajeSnackBar("Hubo un error al realizar la búsqueda. Vuelva a intentar.")
      setIconoSnackBarDeExito(false);
      setMensajeSnackBar (regresaMensajeDeError(err));
      setOpenSnackbar(true);
    }
  }


  /************************     handleCloseSnackbar    **********************/
  // Es el handle que se encarga cerrar el Snackbar
  /**************************************************************************/
  // const handleCloseSnackbar = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }

  //   setOpenSnackbar(false);
  // };

  /*****************************     action    ******************************/
  // Se encarga agregar un icono de X al SnackBar
  /**************************************************************************/  
  // const action = (
  //   <>
  //     <IconButton
  //       size="small"
  //       aria-label="close"
  //       color="inherit"
  //       onClick={handleCloseSnackbar}
  //     >
  //       <FaTimes />
  //     </IconButton>
  //   </>
  // );

  return (
    <>
      {
        isOnline && (
          <LazyMotion features={domAnimation}>
            <m.div className='searchProduct'
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <SnackBarCustom 
                  openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} mensajeSnackBar={mensajeSnackBar} 
                  iconoSnackBarDeExito={iconoSnackBarDeExito} />

              {/* <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
              >
                <Alert 
                    severity= {iconoSnackBarDeExito ?  "success" : "error"}
                    action={action}
                    sx={{ fontSize: '1.4rem', backgroundColor:'#333', color: 'white', }}
                >{mensajeSnackBar}
                </Alert>
              </Snackbar> */}
      
              <h1 className="searchProductTitle">Busca Producto para Editarlo</h1>

              <form className='searchProductInput' onSubmit={handleSearch}>
                {/* <label>Buscar Producto</label> */}
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ejemplo: Totito Sabor Plátano"
                  className="productSearchInput"                  
                  onChange={(e) => setQuery(e.target.value.toLowerCase())}
                  required
                  onInvalid={e=> e.target.setCustomValidity('El Nombre del Producto debe tener entre 3 y 40 caracteres')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  minLength="3"
                  maxLength="40"
                />
                <button className="btnSearchProduct" disabled={isSearching}>
                  {isSearching ? 'Buscando...' : 'Buscar'}
                </button>
              </form>
              
              {
                data && <TableItem data={data} />
              }
      
              {
                isSearching && <SkeletonElement 
                                  type="rectangular" 
                                  width="100%" height="5.6rem" 
                                />
              }
            </m.div>
      
          </LazyMotion>
        )
      }
      {
        !isOnline && <OfflineFallback />  
      }
    </>
  )
}

