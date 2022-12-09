import "./newClient.css";
import defaultCameraImage from "../../../../camera.webp"

// import axios from "axios";
import axios, { regresaMensajeDeError } from '../../../../utils/axios';


/**************************    React    **********************************/
import { useEffect, useRef, useState } from 'react';
/****************************************************************************/

/**************************    Snackbar    **********************************/
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import {FaCloudUploadAlt, FaTimes} from "react-icons/fa";
import { Alert } from '@mui/material';
/****************************************************************************/


const INITIAL_STATE = { 
  ownerName: "", 
  businessName: "", 
  businessAddress: "",
  cellPhone: "", 
  fixedPhone: "",
  email: "", 
  esMayorista: false,
  sku: 0,
  imageCover: ""
}

export default function NewClient() {

  /**************************    useRef    **********************************/
  // inputRef lo uso para que al cargar la pagina ponga el focus en el nombre
  // del cliente

  const inputRef = useRef(null);
  /*****************************************************************************/


  /**************************    useState    **********************************/
  
  // mensajeSnackBar es el mensaje que se mostrara en el SnackBar, puede ser 
  // de exito o de error segun si se grabó la informacion en la BD

  // updateSuccess es boolean que indica si tuvo exito o no el grabado en la BD
  
  // itemData es un Object con toda la informacion a grabar en la BD

  // openSnackbar es boolean que manda abrir y cerrar el Snackbar

  // isSaving es un boolean para saber si esta grabando la informacion en la BD
  // lo uso para deshabilitar el boton de Grabar y que el usuario no le de click
  // mientras se esta guardando en la BD

  const [itemData, setItemData] = useState (INITIAL_STATE);
  const [isSaving, setIsSaving] = useState(false);

  const [updateSuccess, setUpdateSuccess] = useState (true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  const [fileBlob, setFileBlob] = useState(null);

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

      const formData = new FormData();

      formData.append("sku", itemData.sku);
      formData.append("ownerName", itemData.ownerName);
      formData.append("businessName", itemData.businessName);
      formData.append("businessAddress", itemData.businessAddress);
      formData.append("cellPhone", itemData.cellPhone);
      formData.append("fixedPhone", itemData.fixedPhone);
      formData.append("email", itemData.email);
      formData.append("esMayorista", itemData.esMayorista);
      formData.append("photo", itemData.imageCover);

      // if (itemData.imageCover !== "")
      //   formData.append("imageCover", itemData.imageCover);


      // const res = await axios({
      //   withCredentials: true,
      //   method: 'POST',
      //   url: `http://127.0.0.1:8000/api/v1/clients/`,
      //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/clients/`,
      //   data: formData
      // })

      const res = await axios.post ('/api/v1/clients/', formData );

      setIsSaving(false);

      if (res.data.status === 'success') {
        // alert ('Logged in succesfully!');
        // console.log(res.data.data.data);
        console.log ('El cliente fue creado con éxito!');
        setUpdateSuccess(true);
        setMensajeSnackBar("El Cliente fue creado")
        setOpenSnackbar(true);

        setItemData(INITIAL_STATE);
        setFileBlob(null);
        inputRef.current.focus();
      } 
    }
    catch(err) {
      console.log(err);

      setIsSaving(false);
      setUpdateSuccess(false);
      // setMensajeSnackBar("Hubo un error al grabar el cliente. Revisa que estes en línea.");

      // let mensajeSnackBar = "";

      // if (err.name) 
      //   mensajeSnackBar += `Name: ${err.name}. `

      // if (err.code)
      //   mensajeSnackBar += `Code: ${err.code}. `;

      // if (err.statusCode) 
      //   mensajeSnackBar += `Status Code: ${err.statusCode}. `;

      // if (err.status) 
      //   mensajeSnackBar += `Status: ${err.status}. `;

      // if (err.message) 
      //   mensajeSnackBar += `Mensaje: ${err.message}. `;

      // // console.log("mensajeSnackBar", mensajeSnackBar);
      
      // // Error de MongoDB dato duplicado
      // /*if (err.response?.data?.error?.code === 11000 || 
      //     err.response.data.message.includes('E11000')) {
      //       mensajeSnackBar = 'El Sku ya existe, elije otro Sku.';
      
      //       setMensajeSnackBar(mensajeSnackBar);
      // }
      // else */
      // console.log("err.response.data.message", err?.response?.data?.message);
      
      // if (err?.code === "ECONNABORTED") {
      //   setMensajeSnackBar("El tiempo establecido para cargar los datos expiró, checa si estas en un lugar con mala de recepción de red y vuelve a intentar.");
      // }
      // else if (err?.response?.data?.message){
      //   setMensajeSnackBar(err.response.data.message)
      // }
      // else if (err.code === "ERR_NETWORK")
      //   setMensajeSnackBar ("Error al conectarse a la Red. Si estas usando Wi-Fi checa tu conexión. Si estas usando datos checa si tienes saldo. O bien checa si estas en un lugar con mala recepción de red y vuelve a intentar.");
      // else {
      //   // setMensajeSnackBar(`Error: ${err}`)      
      //   setMensajeSnackBar (mensajeSnackBar);
      // }

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

    // // Actualizo el imageCover
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
    <div className="newClient">

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

      <h1 className="newClientTitle">Nuevo Cliente</h1>

      <form className="newClientForm" onSubmit={handleSubmit}>
        <div className="newClientLeft">
          <div className="newClientItem">
            <label>SKU *</label>
            <input 
                className="inputGeneralDataType"
                ref={inputRef}
                type="text" 
                placeholder="12345" 
                onChange={handleChange}
                name="sku"
                value={itemData.sku || ''}  
                required
                onInvalid={e=> e.target.setCustomValidity('Escribe el SKU')} 
                onInput={e=> e.target.setCustomValidity('')}   
                autoComplete="off"
                minLength="1"
                maxLength="25"
            />
          </div>
          <div className="newClientItem">
            <label>Negocio *</label>
            <input 
                className="inputGeneralDataType"
                type="text" 
                placeholder="Mi Tiendita" 
                onChange={handleChange}
                name="businessName"
                value={itemData.businessName || ''}  
                required
                onInvalid={e=> e.target.setCustomValidity('El Nombre del Negocio debe tener entre 5 y 80 caracteres')} 
                onInput={e=> e.target.setCustomValidity('')}   
                minLength="5"
                maxLength="80"
                autoComplete="off"
            />
          </div>
          <div className="newClientItem">
            <label>Contacto *</label>
            <input 
                className="inputGeneralDataType"
                type="text" 
                placeholder="Carlos Treviño" 
                onChange={handleChange}
                name="ownerName"
                value={itemData.ownerName || ''}  
                required
                onInvalid={e=> e.target.setCustomValidity('El Nombre del Contacto debe tener entre 5 y 80 caracteres')} 
                onInput={e=> e.target.setCustomValidity('')} 
                minLength="5"
                maxLength="80"
                autoComplete="off"
            />
          </div>
          <div className="newClientItem">
            <label>Dirección</label>
            <input 
                className="inputGeneralDataType"
                type="text" 
                placeholder="Av. Juárez 2222 Col. Centro, Monterrey, N.L." 
                onChange={handleChange}
                name="businessAddress"
                value={itemData.businessAddress || ''}  
                onInvalid={e=> e.target.setCustomValidity('La Dirección debe tener menos de 100 caracteres')} 
                onInput={e=> e.target.setCustomValidity('')} 
                maxLength="100"
                autoComplete="off"         
            />
          </div>
          <div className="newClientItem">
            <label>Celular</label>
            <input 
                className="inputGeneralDataType"
                type="text" 
                placeholder="81 80 118990" 
                onChange={handleChange}
                name="cellPhone"
                value={itemData.cellPhone || ''}  
                onInvalid={e=> e.target.setCustomValidity('El Número de Celular debe ser menor a 20 caracteres')} 
                onInput={e=> e.target.setCustomValidity('')} 
                maxLength="20"
                autoComplete="off"
            />
          </div>
          <div className="newClientItem">
            <label>Teléfono Fijo</label>
            <input 
                className="inputGeneralDataType"
                type="text" 
                placeholder="81 12 345678" 
                onChange={handleChange}
                name="fixedPhone"
                value={itemData.fixedPhone || ''}   
                onInvalid={e=> e.target.setCustomValidity('El Número de Teléfono debe ser menor a 20 caracteres')} 
                onInput={e=> e.target.setCustomValidity('')} 
                maxLength="20"
                autoComplete="off"       
            />
          </div>
          <div className="newClientItem">
            <label>Email</label>
            <input 
                className="inputGeneralDataType"
                type="email" 
                placeholder="carlos.trevino@gmail.com" 
                onChange={handleChange}
                name="email"
                value={itemData.email || ''}   
                autoComplete="off"             
            />
          </div>

          <div className="newClientItemCheckbox">
              <label htmlFor="esMayorista" className="labelCheckbox">¿Es Mayorista?</label>
              <input 
                  className="inputCheckboxDataType"
                  type="checkbox" 
                  id="esMayorista" 
                  checked={itemData.esMayorista}
                  onChange={handleChange}
                  name="esMayorista"
                  value={itemData.esMayorista}
              />
          </div>
        </div>

        <div className="newClientRight">
          <div className="newClientUpload">
            <img
              className="newClientImg"
              src= {
                      // fileBlob ? fileBlob : `http://127.0.0.1:8000/img/clients/${itemData.imageCover}`
                      // fileBlob ? fileBlob : `${BASE_URL}/img/clients/${itemData.imageCover}`
                      fileBlob ? fileBlob : defaultCameraImage
                    }
              alt=""
            />                
            <label htmlFor="photo">
              <FaCloudUploadAlt style={{"fontSize": "3rem", "cursor": "pointer"}} />
            </label>
            <input  
                    className="inputGeneralDataType"
                    type="file" 
                    accept="image/*" 
                    id="photo" 
                    name="photo" 
                    style={{ display: "none" }} 
                    onChange={(e)=>handleImageCoverChange(e)}
            />
          </div>   

          <button className="newClientButton" disabled={isSaving}>{isSaving ? 'Grabando...' : 'Crear'}</button>
        </div>
      </form>
    </div>
  );
}
