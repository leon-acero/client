import "./client.css";
import defaultCameraImage from "../../../../camera.webp"
import axios, { regresaMensajeDeError } from '../../../../utils/axios';

/*************************    Offline/Online     ****************************/
import { useNavigatorOnLine } from '../../../../hooks/useNavigatorOnLine';
import OfflineFallback from '../../../../components/offlineFallback/OfflineFallback';
/****************************************************************************/

/**************************    React    **********************************/
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from "react-router-dom";
/****************************************************************************/

/************************    React Icons    *********************************/
import {FaHouzz, FaEnvelope, FaBarcode, FaLocationArrow, FaChrome, FaMobileAlt, FaPhoneAlt, FaCloudUploadAlt} from "react-icons/fa";
/****************************************************************************/

// /**************************    Snackbar    **********************************/
// import Snackbar from '@mui/material/Snackbar';
// import IconButton from '@mui/material/IconButton';
// import {FaTimes} from "react-icons/fa";
// import { Alert } from '@mui/material';
// /****************************************************************************/

/**************************    Components    *********************************/
import SnackBarCustom from '../../../../components/snackBarCustom/SnackBarCustom';
import ItemShowInfo from '../../../../components/itemShowInfo/ItemShowInfo';
import InputTypeText from '../../../../components/inputTypeText/InputTypeText';
/****************************************************************************/


export default function Client() {

  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/


  /**************************    useRef    **********************************/
  // avoidRerenderFetchClient evita que se mande llamar dos veces al
  // cliente y por lo mismo que se pinte dos veces
  
  const avoidRerenderFetchClient = useRef(false);
  /*****************************************************************************/

  /**************************    useState    **********************************/
  // fileBlob es la imagen del Producto que muestro en pantalla cuando recien
  // escojo una foto y antes de que actualice en la base de datos. Esto es con
  // el fin de que el usuario vea la imagen que escogió

  // mensajeSnackBar es el mensaje que se mostrara en el SnackBar, puede ser 
  // de exito o de error segun si se grabó la informacion en la BD

  // iconoSnackBarDeExito es boolean que indica si tuvo exito o no el grabado en la BD
  
  // clientData es un Object con toda la informacion a grabar en la BD

  // openSnackbar es boolean que manda abrir y cerrar el Snackbar

  // isSaving es un boolean para saber si esta grabando la informacion en la BD
  // lo uso para deshabilitar el boton de Grabar y que el usuario no le de click
  // mientras se esta guardando en la BD  const [file, setFile] = useState(null);
 
  const [fileBlob, setFileBlob] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  const [iconoSnackBarDeExito, setIconoSnackBarDeExito] = useState (true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");

  // imageCover sirve un DOBLE proposito, como String y como Archivo
  // es decir al cargar el Component o Pagina es un String: "camera.webp"
  // el cual muestra una imagen default antes de que se cargue la foto SI es que
  // existe una foto en el File System para el Producto

  // El segundo propósito es como File, es decir, el usuario al seleccionar
  // una imagen, ahora imageCover contiene toda la informacion de la imagen
  // no solo el nombre de la imagen, ahora cuando se actualice la informacion
  // imageCover sera usado para separar el nombre de la imagen que se guardara
  // en MongoDB, y el archivo fisico que se guardara en el Web Server (File System)  
  const [clientData, setClientData] = useState(
    {
      _id: 0,
      sku: 0,
      ownerName: "", 
      businessName: "", 
      businessAddress: "",
      cellPhone: "", 
      fixedPhone: "",
      email: "", 
      esMayorista: false,
      imageCover: ""
    }
  )
  /*****************************************************************************/

  /**************************    useParams    **********************************/
  // clientId es la clave de cliente que viene en el URL, me sirve para
  // saber que cliente se actualizara en la BD

  const {clientId } = useParams();
  /*****************************************************************************/

  /************************     handleSubmit    *******************************/
  // Aqui guardo la informacion en la BD, puede ser exitoso o haber error
  /****************************************************************************/

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSaving)
      return;

    if (!isOnline) {
      setIconoSnackBarDeExito(false);
      setMensajeSnackBar("No estas en línea, checa tu conexión a Internet.")
      setOpenSnackbar(true);
      return;
    }

    try {
        // console.log("imageCover", file)
        // console.log("imageCover", file.name)

        setIsSaving(true);

        const formData = new FormData();

        formData.append("_id", clientData._id);        
        formData.append("sku", clientData.sku);
        formData.append("ownerName", clientData.ownerName);
        formData.append("businessName", clientData.businessName);
        formData.append("businessAddress", clientData.businessAddress);
        formData.append("cellPhone", clientData.cellPhone);
        formData.append("fixedPhone", clientData.fixedPhone);
        formData.append("email", clientData.email);
        formData.append("esMayorista", clientData.esMayorista);

        // Aqui como mencione al inicio imageCover tiene toda la informacion
        // de la foto, y para actualizar la foto, en el productController
        // primero subo la foto en memoria en el Web Server, luego le cambio
        // el formato a webp y le hago un resize, y ajusta la calidad de la foto
        // y ahora si la guardo en el Web Server, por ultimo le asigno un nombre
        // a la imageCOver y la guardo en la BD
        // es por esto que aqui guardo la imageCover en "photo" porque NO es
        // el field final, se tiene que hacer todo el proceso anterior
        formData.append("photo", clientData.imageCover);

        // if (clientData.imageCover !== "")
        //   formData.append("imageCover", clientData.imageCover);

        // const res = await axios({
        //   withCredentials: true,
        //   method: 'PATCH',
        //   url: `http://127.0.0.1:8000/api/v1/clients/${clientId}`,
        //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/clients/${clientId}`,
        //   data: formData
        // })

        const res = await axios.patch (`/api/v1/clients/${clientId}`, formData );

        setIsSaving(false);

        if (res.data.status === 'success') {
          // console.log(res.data.data.data);
          console.log ('El cliente fue actualizado con éxito!');
          setIconoSnackBarDeExito(true);
          setMensajeSnackBar("Cliente actualizado")
          setOpenSnackbar(true);
        } 
      }
      catch(err) {
        setIsSaving(false);

        setIconoSnackBarDeExito(false);
        setMensajeSnackBar (regresaMensajeDeError(err));
        setOpenSnackbar(true);
        console.log(err);
      }
  }


  /************************     useEffect    *******************************/
  // fetchClient mandao cargar desde la BD el Cliente que me ineteresa
  // actualizar
  /**************************************************************************/

  useEffect (() => {

    if (!isOnline) {
      return;
    }

    if (avoidRerenderFetchClient.current) {
      return;
    }

    const fetchClient = async () => {

      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderFetchClient.current = true;

      try {
        // console.log("cargar cliente")
        // const res = await axios ({
        //   withCredentials: true,
        //   method: 'GET',
        //   url: `http://127.0.0.1:8000/api/v1/clients/${clientId}`
        //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/clients/${clientId}`
        // });
  
        const res = await axios.get (`/api/v1/clients/${clientId}`);
  
  
        // console.log(res.data.data.data);
        setClientData(res.data.data.data)
      }
      catch (err) {
        console.log(err);   
        
        setIconoSnackBarDeExito(false);
        setMensajeSnackBar (regresaMensajeDeError(err));
        setOpenSnackbar(true);
      }
    }

    fetchClient();
   
  }, [clientId, isOnline]);


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
    setClientData(prevFormData => {
        return {
            ...prevFormData,
            imageCover: e.target.files[0]
        }
    })

  }

  /************************     handleChange    *****************************/
  // Se encarga de guardar en setClientData, la informacion de cada input
  /**************************************************************************/

  function handleChange(event) {
    // console.log(event)
    const {name, value, type, checked} = event.target
    setClientData(prevFormData => {
        return {
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
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
  // </>
  // );

  return (
 
    <>
      {
        isOnline && (
          <div  className="client">
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

            <div className="clientTitleContainer">
              <h1 className="clientTitle">Editar Cliente</h1>
              <Link to="/new-client">
                <button className="clientAddButton">Crear</button>
              </Link>
            </div>

            <div className="clientContainer">
              <div className="clientShow">
                <div className="clientShowTop">
                  <img
                    className="clientShowImg"
                    src= {
                            // fileBlob ? fileBlob : `http://127.0.0.1:8000/img/clients/${clientData.imageCover}`
                            // fileBlob ? fileBlob : `${clientData.imageCover}`
                            fileBlob ? fileBlob : clientData.imageCover ?
                            `${clientData.imageCover}` : defaultCameraImage
                        }
                    alt={clientData.businessName}
                  /> 
      
                  <div className="clientShowTopTitle">
                    <span className="clientShowClientname">{clientData.businessName}</span>
                    <span className="clientShowClientTitle">{clientData.ownerName}</span>
                  </div>
                </div>
                <div className="clientShowBottom">
                  <span className="clientShowTitle">Detalle</span>
                  <ItemShowInfo CustomIcon={FaBarcode} labelData= {"SKU:"} 
                  itemData={clientData.sku} alinearSpaceBetween={false} />
 
                  <ItemShowInfo CustomIcon={FaLocationArrow} labelData= {""} 
                  itemData={clientData.businessAddress} alinearSpaceBetween={false} />

                  <ItemShowInfo CustomIcon={FaHouzz} labelData= {""} 
                  itemData={clientData.esMayorista ? "Es Mayorista" : "Es Minorista"} 
                  alinearSpaceBetween={false} />
 
                  <ItemShowInfo CustomIcon={FaChrome} labelData= {""} 
                  itemData={clientData.slug} alinearSpaceBetween={false} />
 
      
                  <span className="clientShowTitle">Contacto</span>
                  <ItemShowInfo CustomIcon={FaMobileAlt} labelData= {""} 
                  itemData={clientData.cellPhone} alinearSpaceBetween={false} />

                  <ItemShowInfo CustomIcon={FaPhoneAlt} labelData= {""} 
                  itemData={clientData.fixedPhone} alinearSpaceBetween={false} />
 
                  <ItemShowInfo CustomIcon={FaEnvelope} labelData= {""} 
                  itemData={clientData.email} alinearSpaceBetween={false} />
 
                </div>
              </div>
              <div className="clientUpdate">
                <span className="clientUpdateTitle">Editar</span>
      
                <form className="clientUpdateForm" onSubmit={handleSubmit}>
                  <div className="clientUpdateLeft">
                    <div className="clientUpdateItem">
                      <label>SKU *</label>
                      <input
                        className="clientUpdateInput"                  
                        // type="text"
                        placeholder={clientData.sku}
                        onChange={handleChange}
                        name="sku"
                        value={clientData.sku || ''}
                        required
                        onInvalid={e=> e.target.setCustomValidity('El SKU debe tener por lo menos 1 caracter. El valor mínimo es 1 y el máximo es 999,999')} 
                        onInput={e=> e.target.setCustomValidity('')} 
                        autoComplete="off"
                        // minLength="1"
                        // maxLength="25"

                        type="number" 
                        pattern="/[^0-9]|(?<=\..*)\./g" 
                        step="1" 
                        min="1"
                        max="999999"
                      />
                    </div>              
                    <div className="clientUpdateItem">
                      <InputTypeText 
                          label={"Negocio *"}
                          placeholder={clientData.businessName}
                          setItemData={setClientData}
                          name={"businessName"}
                          value={clientData.businessName}
                          mensajeDeError={'El Nombre del Negocio debe tener entre 5 y 80 caracteres'}
                          minLength={"5"} 
                          maxLength={"80"}
                          isRequired={true} 
                          pattern="^.{5,80}$" />
                    </div>
                    <div className="clientUpdateItem">
                      <InputTypeText 
                          label={"Contacto *"}
                          placeholder={clientData.ownerName}
                          setItemData={setClientData}
                          name={"ownerName"}
                          value={clientData.ownerName}
                          mensajeDeError={'El Nombre del Contacto debe tener entre 5 y 80 caracteres'}
                          minLength={"5"} 
                          maxLength={"80"} 
                          isRequired={true}
                          pattern="^.{5,80}$" />
                    </div>
                    <div className="clientUpdateItem">
                      <label>Email</label>
                      <input
                        className="clientUpdateInput"
                        type="email"
                        placeholder={clientData.email}
                        onChange={handleChange}
                        name="email"
                        // title="Escribe un correo válido"
                        // onInvalid={e=> e.target.setCustomValidity('Escribe un correo válido')} 
                        // onInput={e=> e.target.setCustomValidity('')} 
                        value={clientData.email || ''}  
                        autoComplete="off"                
                        />
                    </div>
                    <div className="clientUpdateItem">
                      <InputTypeText 
                          label={"Celular"}
                          placeholder={clientData.cellPhone}
                          setItemData={setClientData}
                          name={"cellPhone"}
                          value={clientData.cellPhone}
                          mensajeDeError={'El Número de Celular debe ser menor a 20 caracteres'}
                          minLength={"0"} 
                          maxLength={"20"} 
                          isRequired={false}
                          pattern="^.{0,20}$" />
                    </div>
                    <div className="clientUpdateItem">
                      <InputTypeText 
                          label={"Teléfono Fijo"}
                          placeholder={clientData.fixedPhone}
                          setItemData={setClientData}
                          name={"fixedPhone"}
                          value={clientData.fixedPhone}
                          mensajeDeError={'El Número de Teléfono Fijo debe ser menor a 20 caracteres'}
                          minLength={"0"} 
                          maxLength={"20"} 
                          isRequired={false} 
                          pattern="^.{0,20}$" />
                    </div>              
                    <div className="clientUpdateItem">
                      <InputTypeText 
                          label={"Dirección"}
                          placeholder={clientData.businessAddress}
                          setItemData={setClientData}
                          name={"businessAddress"}
                          value={clientData.businessAddress}
                          mensajeDeError={'La Dirección debe tener menos de 100 caracteres'}
                          minLength={"0"} 
                          maxLength={"100"} 
                          isRequired={false} 
                          pattern="^.{0,100}$" />
                    </div>
                    
                    <div className="clientUpdateItemCheckbox">
                      <label htmlFor="esMayorista" className="labelCheckboxUpdate">¿Es Mayorista?</label>
                      <input
                          className="inputCheckboxDataType"
                          type="checkbox" 
                          id="esMayorista" 
                          checked={clientData.esMayorista}
                          onChange={handleChange}
                          name="esMayorista"
                          value={clientData.esMayorista}
                      />
                    </div>
                  </div>
                  <div className="clientUpdateRight">
                    <div className="clientUpdateUpload">
                      <img
                        className="clientUpdateImg"
                        src= {
                                // fileBlob ? fileBlob : `http://127.0.0.1:8000/img/clients/${clientData.imageCover}`
                                fileBlob ? fileBlob : clientData.imageCover ?
                                `${clientData.imageCover}` : defaultCameraImage
                            }
                        alt={clientData.businessName}
                      /> 
      
                      <label htmlFor="photo">
                        <FaCloudUploadAlt className="clientUpdateIcon__upload" />
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
                    <button className="clientUpdateButton" disabled={isSaving}>{isSaving ? 'Grabando...' : 'Actualizar'}</button>
                  </div>
                </form>
              </div>
            </div>          
          </div>         
        )
      }
      {
        !isOnline && <OfflineFallback />       
      }
    </>
  );
}
