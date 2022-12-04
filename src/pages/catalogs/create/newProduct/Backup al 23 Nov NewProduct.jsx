import "./newProduct.css";
import axios from "axios";

/**************************    React    **********************************/
import { useEffect, useRef, useState } from 'react';
/****************************************************************************/

/**************************    Snackbar    **********************************/
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import {FaTimes} from "react-icons/fa";
import { Alert } from '@mui/material';
/****************************************************************************/


const INITIAL_STATE = {
  productName: "",
  inventarioActual: 0,
  inventarioMinimo: 0,
  priceMenudeo: 0,
  priceMayoreo: 0,
  costo: 0,
  sku: 0
    // imageCover: ""
}

export default function NewProduct() {

  /**************************    useRef    **********************************/
  // inputRef lo uso para que al cargar la pagina ponga el focus en el nombre
  // del producto

  const inputRef = useRef(null);
  /*****************************************************************************/


  /**************************    useState    **********************************/
  
  // mensajeSnackBar es el mensaje que se mostrara en el SnackBar, puede ser 
  // de exito o de error segun si se grabó la informacion en la BD

  // updateSuccess es boolean que indica si tuvo exito o no el grabado en la BD
  
  // data es un Object con toda la informacion a grabar en la BD

  // openSnackbar es boolean que manda abrir y cerrar el Snackbar

  // isSaving es un boolean para saber si esta grabando la informacion en la BD
  // lo uso para deshabilitar el boton de Grabar y que el usuario no le de click
  // mientras se esta guardando en la BD
  const [data, setData] = useState (INITIAL_STATE);
  const [isSaving, setIsSaving] = useState(false);

  const [updateSuccess, setUpdateSuccess] = useState (true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  /*****************************************************************************/


  /**************************    useEffect    **********************************/
  // Al cargar la pagina pone el focus en el nombre del producto
  useEffect(()=>{
    inputRef.current.focus();
  },[])
  /*****************************************************************************/

  /************************     handleSubmit    *******************************/
  // Aqui guardo la informacion en la BD, puede ser exitoso o haber error
  /****************************************************************************/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSaving)
      return;

    try {
      setIsSaving(true);

      const res = await axios({
        withCredentials: true,
        method: 'POST',
        url: `http://127.0.0.1:8000/api/v1/products/`,
        // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/products/`,
        data: {
              sku: data.sku,
              productName: data.productName, 
              inventarioActual: data.inventarioActual, 
              inventarioMinimo: data.inventarioMinimo,
              priceMenudeo: data.priceMenudeo, 
              priceMayoreo: data.priceMayoreo === null || data.priceMayoreo === "" || data.priceMayoreo === undefined ? 0 : data.priceMayoreo,
              costo: data.costo, 
              // imageCover: "" 
        }})

      setIsSaving(false);

      if (res.data.status === 'success') {
        // alert ('Logged in succesfully!');
        // console.log(res.data.data.data);
        // console.log ('El cliente fue creado con éxito!');
        setUpdateSuccess(true);
        setMensajeSnackBar("El Producto fue creado")
        setOpenSnackbar(true);

        setData(INITIAL_STATE);
        inputRef.current.focus();
      } 
    }
    catch(err) {
      setIsSaving(false);
      setUpdateSuccess(false);
      setMensajeSnackBar("Hubo un error al grabar el producto. Revisa que estes en línea.");
      setOpenSnackbar(true);
      console.log(err);
    }
  }


  /************************     handleChange    *****************************/
  // Se encarga de guardar en setData, la informacion de cada input
  /**************************************************************************/  

  function handleChange(event) {
    // console.log(event)
    const {name, value, type, checked} = event.target
    setData(prevFormData => {
        return {
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }
    })
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
    <div className="newProduct">
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
            severity= {updateSuccess ?  "success" : "error"} 
            action={action}
            sx={{ fontSize: '1.4rem', backgroundColor:'#333', color: 'white', }}
        >{mensajeSnackBar}
        </Alert>
      </Snackbar>

      <h1 className="addProductTitle">Nuevo Producto</h1>

      <form className="addProductForm" onSubmit={handleSubmit}>
        <div className="addProductItem">
          <label>SKU *</label>
          <input 
              ref={inputRef}
              type="text" 
              placeholder="12345" 
              onChange={handleChange}
              name="sku"
              value={data.sku || ''}
              required
              onInvalid={e=> e.target.setCustomValidity('El SKU debe tener por lo menos 1 caracter')} 
              onInput={e=> e.target.setCustomValidity('')} 
              minLength="1"
              maxLength="5"
          />
        </div>        
        <div className="addProductItem">
          <label>Nombre *</label>
          <input 
              type="text" 
              placeholder="Mazapan" 
              onChange={handleChange}
              name="productName"
              value={data.productName || ''}
              required
              onInvalid={e=> e.target.setCustomValidity('El Nombre del Producto debe tener entre 5 y 40 caracteres')} 
              onInput={e=> e.target.setCustomValidity('')} 
              minLength="5"
              maxLength="40"
          />
        </div>
        <div className="addProductItem">
          <label>Inventario Actual *</label>
          <input 
              type="number" 
              pattern="/[^0-9]|(?<=\..*)\./g" 
	            step="1" 
              min="1"
              max="999999" 
              placeholder="123" 
              onChange={handleChange}
              name="inventarioActual"
              value={data.inventarioActual || ''}  
              required
              onInvalid={e=> e.target.setCustomValidity('Escribe el Inventario Actual')} 
              onInput={e=> e.target.setCustomValidity('')} 
          />
        </div>
        <div className="addProductItem">
          <label>Inventario Minimo *</label>
          <input 
              type="number" 
              pattern="/[^0-9]|(?<=\..*)\./g" 
	            step="1" 
              min="1"
              max="999999" 
              placeholder="123" 
              onChange={handleChange}
              name="inventarioMinimo"
              value={data.inventarioMinimo || ''}  
              required         
              onInvalid={e=> e.target.setCustomValidity('Escribe el Inventario Mínimo')} 
              onInput={e=> e.target.setCustomValidity('')}      
          />
        </div>       
        <div className="addProductItem">
          <label>Precio Menudeo *</label>
          <input 
              type="number" 
              pattern="/[^0-9.]|(?<=\..*)\./g" 
	            step="0.01" 
              min="1"
              max="999999"
              placeholder="123" 
              onChange={handleChange}
              name="priceMenudeo"
              value={data.priceMenudeo || ''}   
              required 
              onInvalid={e=> e.target.setCustomValidity('Escribe el Precio al Menudeo')} 
              onInput={e=> e.target.setCustomValidity('')} 
          />
        </div>
        <div className="addProductItem">
          <label>Precio Mayoreo</label>
          <input 
              type="number" 
              pattern="/[^0-9.]|(?<=\..*)\./g" 
	            step="0.01" 
              min="1"
              max="999999"
              placeholder="123" 
              onChange={handleChange}
              name="priceMayoreo"
              value={data.priceMayoreo || ''}                            
          />
        </div>      
        <div className="addProductItem">
          <label>Costo *</label>
          <input 
              type="number" 
              pattern="/[^0-9.]|(?<=\..*)\./g" 
	            step="0.01" 
              min="1"
              max="999999"             
              placeholder="123" 
              onChange={handleChange}
              name="costo"
              value={data.costo || ''}     
              required 
              onInvalid={e=> e.target.setCustomValidity('Escribe el Costo del Producto')} 
              onInput={e=> e.target.setCustomValidity('')} 
          />
        </div>  
        {/* <div className="addProductItem">
          <label>Imagen</label>
          <input type="file" id="file" />
        </div>         */}
        <button className="addProductButton" disabled={isSaving}>{isSaving ? 'Grabando...' : 'Crear'}</button>
      </form>
    </div>
  );
}
