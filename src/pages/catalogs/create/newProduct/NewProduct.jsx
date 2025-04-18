import "./newProduct.css";
import defaultCameraImage from "../../../../camera.webp"

import axios, { regresaMensajeDeError } from '../../../../utils/axios';

/*************************    Offline/Online     ****************************/
import { useNavigatorOnLine } from '../../../../hooks/useNavigatorOnLine';
import OfflineFallback from '../../../../components/offlineFallback/OfflineFallback';
/****************************************************************************/


/**************************    React    **********************************/
import { useEffect, useRef, useState } from 'react';
/****************************************************************************/

/**************************    Snackbar    **********************************/
// import Snackbar from '@mui/material/Snackbar';
// import IconButton from '@mui/material/IconButton';
// import { FaTimes} from "react-icons/fa";
// import { Alert } from '@mui/material';
/****************************************************************************/

import {FaCloudUploadAlt} from "react-icons/fa";
import SnackBarCustom from '../../../../components/snackBarCustom/SnackBarCustom';


const INITIAL_STATE = {
  productName: "",
  inventarioActual: 0,
  inventarioMinimo: 0,
  priceMenudeo: 0,
  priceMayoreo: 0,
  costo: 0,
  sku: 0,
  imageCover: ""
}

export default function NewProduct() {

  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/


  /**************************    useRef    **********************************/
  // inputRef lo uso para que al cargar la pagina ponga el focus en el nombre
  // del producto

  const inputRef = useRef(null);
  /*****************************************************************************/


  /**************************    useState    **********************************/
  
  // mensajeSnackBar es el mensaje que se mostrara en el SnackBar, puede ser 
  // de exito o de error segun si se grabó la informacion en la BD

  // iconoSnackBarDeExito es boolean que indica si tuvo exito o no el grabado en la BD
  
  // itemData es un Object con toda la informacion a grabar en la BD

  // openSnackbar es boolean que manda abrir y cerrar el Snackbar

  // isSaving es un boolean para saber si esta grabando la informacion en la BD
  // lo uso para deshabilitar el boton de Grabar y que el usuario no le de click
  // mientras se esta guardando en la BD

  // fileBlob es la imagen del Producto que muestro en pantalla cuando recien
  // escojo una foto y antes de que actualice en la base de datos. Esto es con
  // el fin de que el usuario vea la imagen que escogió

  const [itemData, setItemData] = useState (INITIAL_STATE);
  const [isSaving, setIsSaving] = useState(false);

  const [iconoSnackBarDeExito, setIconoSnackBarDeExito] = useState (true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  const [fileBlob, setFileBlob] = useState(null);

  /*****************************************************************************/


  /**************************    useEffect    **********************************/
  // Al cargar la pagina pone el focus en el nombre del producto
  useEffect(()=>{
    inputRef?.current?.focus();
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

      const formData = new FormData();
        
      formData.append("sku", itemData.sku);
      formData.append("productName", itemData.productName);
      formData.append("inventarioActual", itemData.inventarioActual);
      formData.append("inventarioMinimo", itemData.inventarioMinimo);
      formData.append("priceMenudeo", itemData.priceMenudeo);
      formData.append("priceMayoreo", itemData.priceMayoreo === null || itemData.priceMayoreo === "" || itemData.priceMayoreo === undefined ? 0 : itemData.priceMayoreo);
      formData.append("costo", itemData.costo);

      // Aqui como mencione al inicio imageCover tiene toda la informacion
      // de la foto, y para actualizar la foto, en el productController
      // primero subo la foto en memoria en el Web Server, luego le cambio
      // el formato a webp y le hago un resize, y ajusta la calidad de la foto
      // y ahora si la guardo en el Web Server, por ultimo le asigno un nombre
      // a la imageCOver y la guardo en la BD
      // es por esto que aqui guardo la imageCover en "photo" porque NO es
      // el field final, se tiene que hacer todo el proceso anterior
      formData.append("photo", itemData.imageCover);

      // if (itemData.imageCover !== "")
      //   formData.append("imageCover", itemData.imageCover);

      // const res = await axios({
      //   withCredentials: true,
      //   method: 'POST',
      //   url: `http://127.0.0.1:8000/api/v1/products/`,
      //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/products/`,
      //   data: formData
      // })

      // console.log("formData", formData);


      const res = await axios.post ('/api/v1/products/', formData );

      setIsSaving(false);

      if (res.data.status === 'success') {
        // alert ('Logged in succesfully!');
        // console.log(res.data.data.data);
        // console.log ('El cliente fue creado con éxito!');
        setIconoSnackBarDeExito(true);
        setMensajeSnackBar("El Producto fue creado")
        setOpenSnackbar(true);

        setItemData(INITIAL_STATE);
        setFileBlob(null);
        // inputRef?.current?.focus();
      } 
    }
    catch(err) {
      console.log(err);

      setIsSaving(false);

      setIconoSnackBarDeExito(false);
      setMensajeSnackBar (regresaMensajeDeError(err));
      setOpenSnackbar(true);
    }
  }


  /************************     handleChange    *****************************/
  // Se encarga de guardar en setItemData, la informacion de cada input
  /**************************************************************************/  

  function handleChange(event) {
    // console.log(event)
    const {name, value, type, checked} = event.target
    setItemData(prevFormData => {
        return {
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }
    })
  }

  /************************     handleImageCoverChange    ********************/
  // Se encarga de manejar la actualizacion de la foto del Producto y 
  // que se muestre en pantalla
  /**************************************************************************/
  function handleImageCoverChange (e) {

    if (!e.target.files[0])
      return;

    setFileBlob(URL.createObjectURL(e.target.files[0]));

    // console.log("fileImageCover", URL.createObjectURL(e.target.files[0]))
    // Actualizo el imageCover
    setItemData(prevFormData => {
        return {
            ...prevFormData,
            imageCover: e.target.files[0]
        }
    })

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
          <div className="newProduct">
      
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
      
            <h1 className="newProductTitle">Nuevo Producto</h1>
      
            <form className="newProductForm" onSubmit={handleSubmit}>
              <div className="newProductLeft">
                <div className="newProductItem">
                  <label>SKU *</label>
                  <input 
                      ref={inputRef}
                      // type="text" 
                      placeholder="123456" 
                      onChange={handleChange}
                      name="sku"
                      value={itemData.sku || ''}
                      required
                      onInvalid={e=> e.target.setCustomValidity('El SKU debe tener por lo menos 1 caracter. El valor mínimo es 1 y el máximo es 999,999')} 
                      onInput={e=> e.target.setCustomValidity('')} 
                      // minLength="1"
                      // maxLength="5"
                      autoComplete="off"

                      type="number" 
                      pattern="/[^0-9]|(?<=\..*)\./g" 
                      step="1" 
                      min="1"
                      max="999999"
                  />
                </div>        
                <div className="newProductItem">
                  <label>Nombre *</label>
                  <input 
                      type="text" 
                      placeholder="Mazapan" 
                      onChange={handleChange}
                      name="productName"
                      value={itemData.productName || ''}
                      required
                      onInvalid={e=> e.target.setCustomValidity('El Nombre del Producto debe tener entre 5 y 40 caracteres')} 
                      onInput={e=> e.target.setCustomValidity('')} 
                      minLength="5"
                      maxLength="40"
                      autoComplete="off"
                  />
                </div>
                <div className="newProductItem">
                  <label>Inventario Actual *</label>
                  <input 
                      type="number" 
                      pattern="/[^0-9]|(?<=\..*)\./g" 
                      step="1" 
                      min="1"
                      max="999999" 
                      placeholder="123456" 
                      onChange={handleChange}
                      name="inventarioActual"
                      value={itemData.inventarioActual || ''}  
                      required
                      onInvalid={e=> e.target.setCustomValidity('Escribe el Inventario Actual')} 
                      onInput={e=> e.target.setCustomValidity('')}
                      autoComplete="off" 
                  />
                </div>
                <div className="newProductItem">
                  <label>Inventario Minimo *</label>
                  <input 
                      type="number" 
                      pattern="/[^0-9]|(?<=\..*)\./g" 
                      step="1" 
                      min="1"
                      max="999999" 
                      placeholder="123456" 
                      onChange={handleChange}
                      name="inventarioMinimo"
                      value={itemData.inventarioMinimo || ''}  
                      required         
                      onInvalid={e=> e.target.setCustomValidity('Escribe el Inventario Mínimo')} 
                      onInput={e=> e.target.setCustomValidity('')}
                      autoComplete="off"      
                  />
                </div>       
                <div className="newProductItem">
                  <label>Precio Menudeo *</label>
                  <input 
                      type="number" 
                      pattern="/[^0-9.]|(?<=\..*)\./g" 
                      step="0.01" 
                      min="1"
                      max="999999"
                      placeholder="123456" 
                      onChange={handleChange}
                      name="priceMenudeo"
                      value={itemData.priceMenudeo || ''}   
                      required 
                      onInvalid={e=> e.target.setCustomValidity('Escribe el Precio al Menudeo')} 
                      onInput={e=> e.target.setCustomValidity('')}
                      autoComplete="off" 
                  />
                </div>
                <div className="newProductItem">
                  <label>Precio Mayoreo</label>
                  <input 
                      type="number" 
                      pattern="/[^0-9.]|(?<=\..*)\./g" 
                      step="0.01" 
                      min="1"
                      max="999999"
                      placeholder="123456" 
                      onChange={handleChange}
                      name="priceMayoreo"
                      value={itemData.priceMayoreo || ''}
                      autoComplete="off"                            
                  />
                </div>      
                <div className="newProductItem">
                  <label>Costo *</label>
                  <input 
                      type="number" 
                      pattern="/[^0-9.]|(?<=\..*)\./g" 
                      step="0.01" 
                      min="1"
                      max="999999"             
                      placeholder="123456" 
                      onChange={handleChange}
                      name="costo"
                      value={itemData.costo || ''}     
                      required 
                      onInvalid={e=> e.target.setCustomValidity('Escribe el Costo del Producto')} 
                      onInput={e=> e.target.setCustomValidity('')}
                      autoComplete="off" 
                  />
                </div>  
              </div>
      
              <div className="newProductRight">
                <div className="newProductUpload">
                  <img
                    className="newProductImg"
                    src= {
                            // fileBlob ? fileBlob : `http://127.0.0.1:8000/img/products/${itemData.imageCover}`
                            // fileBlob ? fileBlob : `${BASE_URL}/img/products/${itemData.imageCover}`
                            fileBlob ? fileBlob : defaultCameraImage
                          }
                    alt="Imagen del Producto o Imagen Default"
                  />                
                    {/* <FaCloudUploadAlt style={{"fontSize": "3rem", "cursor": "pointer", "color": "#343a40"}} /> */}
                  <label htmlFor="photo"
                         className="newProductUpload__label">
                    <FaCloudUploadAlt 
                            className="newProductIcon__upload"  
                    />
                  </label>
                  <input  type="file" 
                          accept="image/*" 
                          id="photo" 
                          name="photo" 
                          style={{ display: "none" }} 
                          onChange={(e)=>handleImageCoverChange(e)}
                  />
                </div>   
      
                <button className="newProductButton" disabled={isSaving}>{isSaving ? 'Grabando...' : 'Crear'}</button>
              </div>
            </form>
          </div>
        )
      } 
      {
        !isOnline && <OfflineFallback />
      }
    </>

  );
}
