import "./client.css";
// import axios from "axios";

/**************************    React    **********************************/
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from "react-router-dom";
/****************************************************************************/

/************************    React Icons    *********************************/
import {FaHouzz, FaEnvelope, FaBarcode, FaLocationArrow, FaChrome, FaMobileAlt, FaPhoneAlt, FaCloudUploadAlt} from "react-icons/fa";
/****************************************************************************/

/**************************    Snackbar    **********************************/
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import {FaTimes} from "react-icons/fa";
import { Alert } from '@mui/material';
import axios, { BASE_URL } from '../../../../utils/axios';
/****************************************************************************/



export default function Client() {


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

  // updateSuccess es boolean que indica si tuvo exito o no el grabado en la BD
  
  // clientData es un Object con toda la informacion a grabar en la BD

  // openSnackbar es boolean que manda abrir y cerrar el Snackbar

  // isSaving es un boolean para saber si esta grabando la informacion en la BD
  // lo uso para deshabilitar el boton de Grabar y que el usuario no le de click
  // mientras se esta guardando en la BD  const [file, setFile] = useState(null);
 
  const [fileBlob, setFileBlob] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState (true);

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
      imageCover: "camera.webp"
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
          setUpdateSuccess(true);
          setMensajeSnackBar("Cliente actualizado")
          setOpenSnackbar(true);
        } 
      }
      catch(err) {
        setIsSaving(false);
        setUpdateSuccess(false);
        // setMensajeSnackBar("Hubo un error al grabar el cliente. Revisa que estes en línea.");

        let mensajeSnackBar = "";

        if (err.name) 
          mensajeSnackBar += `Name: ${err.name}. `

        if (err.code)
          mensajeSnackBar += `Code: ${err.code}. `;

        if (err.statusCode) 
          mensajeSnackBar += `Status Code: ${err.statusCode}. `;

        if (err.status) 
          mensajeSnackBar += `Status: ${err.status}. `;

        if (err.message) 
          mensajeSnackBar += `Mensaje: ${err.message}. `;

        // console.log("mensajeSnackBar", mensajeSnackBar);
        
        // Error de MongoDB dato duplicado
        /*if (err.response?.data?.error?.code === 11000 || 
            err.response.data.message.includes('E11000')) {
              mensajeSnackBar = 'El Sku ya existe, elije otro Sku.';
        
              setMensajeSnackBar(mensajeSnackBar);
        }
        else */
        if (err.response.data.message){
          setMensajeSnackBar(err.response.data.message)
        }
        else if (err.code === "ERR_NETWORK")
          setMensajeSnackBar ("Error al conectarse a la Red. Si estas usando Wi-Fi checa tu conexión. Si estas usando datos checa si tienes saldo. O bien checa si estas en un lugar con mala recepción de red y vuelve a intentar.");
        else {
          // setMensajeSnackBar(`Error: ${err}`)      
          setMensajeSnackBar (mensajeSnackBar);
        }

        setOpenSnackbar(true);
        console.log(err);
      }
  }


  /************************     useEffect    *******************************/
  // fetchClient mandao cargar desde la BD el Producto que me ineteresa
  // actualizar
  /**************************************************************************/

  useEffect (() => {

    if (avoidRerenderFetchClient.current) {
      return;
    }

    const fetchClient = async () => {

      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderFetchClient.current = true;

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

    fetchClient();
   
  }, [clientId]);


  /************************     handleImageCoverChange    ********************/
  // Se encarga de manejar la actualizacion de la foto del Producto y 
  // que se muestre en pantalla
  /**************************************************************************/
  function handleImageCoverChange (e) {

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
    <div className="client">

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
                      fileBlob ? fileBlob : `${BASE_URL}/img/clients/${clientData.imageCover}`
                   }
              alt=""
            /> 

            <div className="clientShowTopTitle">
              <span className="clientShowClientname">{clientData.businessName}</span>
              <span className="clientShowClientTitle">{clientData.ownerName}</span>
            </div>
          </div>
          <div className="clientShowBottom">
            <span className="clientShowTitle">Detalle</span>
            <div className="clientShowInfo">
              <FaBarcode className="clientShowIcon" />
              <span className="clientShowInfoTitle">SKU: {clientData.sku}</span>
            </div>
            <div className="clientShowInfo">
              <FaLocationArrow className="clientShowIcon" />
              <span className="clientShowInfoTitle">{clientData.businessAddress}</span>
            </div>
            <div className="clientShowInfo">
              <FaHouzz className="clientShowIcon" />
              <span className="clientShowInfoTitle">{clientData.esMayorista ? "Es Mayorista" : "Es Minorista"}</span>
            </div>
            <div className="clientShowInfo">
              <FaChrome className="clientShowIcon" />
              <span className="clientShowInfoTitle">{clientData.slug}</span>
            </div>           

            <span className="clientShowTitle">Contacto</span>
            <div className="clientShowInfo">
              <FaMobileAlt className="clientShowIcon" />
              <span className="clientShowInfoTitle">{clientData.cellPhone}</span>
            </div>
            <div className="clientShowInfo">
              <FaPhoneAlt className="clientShowIcon" />
              <span className="clientShowInfoTitle">{clientData.fixedPhone}</span>
            </div>
            <div className="clientShowInfo">
              <FaEnvelope className="clientShowIcon" />
              <span className="clientShowInfoTitle">{clientData.email}</span>
            </div>
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
                  type="text"
                  placeholder={clientData.sku}
                  onChange={handleChange}
                  name="sku"
                  value={clientData.sku || ''}
                  required
                  onInvalid={e=> e.target.setCustomValidity('El SKU debe tener por lo menos 1 caracter')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  autocomplete="off"
                  minLength="1"
                  maxLength="25"
                />
              </div>              
              <div className="clientUpdateItem">
                <label>Negocio *</label>
                <input
                  className="clientUpdateInput"                  
                  type="text"
                  placeholder={clientData.businessName}
                  onChange={handleChange}
                  name="businessName"
                  value={clientData.businessName || ''}
                  required
                  onInvalid={e=> e.target.setCustomValidity('El Nombre del Negocio debe tener entre 5 y 80 caracteres')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  minLength="5"
                  maxLength="80"
                  autocomplete="off"
                />
              </div>
              <div className="clientUpdateItem">
                <label>Contacto *</label>
                <input
                  className="clientUpdateInput"
                  type="text"
                  placeholder={clientData.ownerName}
                  onChange={handleChange}
                  name="ownerName"
                  value={clientData.ownerName || ''}
                  required
                  onInvalid={e=> e.target.setCustomValidity('El Nombre del Contacto debe tener entre 5 y 80 caracteres')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  minLength="5"
                  maxLength="80"
                  autocomplete="off"
                />
              </div>
              <div className="clientUpdateItem">
                <label>Email</label>
                <input
                  className="clientUpdateInput"
                  type="email"
                  placeholder={clientData.email}
                  onChange={handleChange}
                  name="email"
                  value={clientData.email || ''}  
                  autocomplete="off"                
                />
              </div>
              <div className="clientUpdateItem">
                <label>Celular</label>
                <input
                  className="clientUpdateInput"
                  type="text"
                  placeholder={clientData.cellPhone}
                  onChange={handleChange}
                  name="cellPhone"
                  value={clientData.cellPhone || ''}  
                  onInvalid={e=> e.target.setCustomValidity('El Número de Celular debe ser menor a 20 caracteres')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  maxLength="20"
                  autocomplete="off"     
                />
              </div>
              <div className="clientUpdateItem">
                <label>Teléfono Fijo</label>
                <input
                  className="clientUpdateInput"
                  type="text"
                  placeholder={clientData.fixedPhone}
                  onChange={handleChange}
                  name="fixedPhone"
                  value={clientData.fixedPhone || ''} 
                  onInvalid={e=> e.target.setCustomValidity('El Número de Teléfono debe ser menor a 20 caracteres')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  maxLength="20"
                  autocomplete="off"                                   
                />
              </div>              
              <div className="clientUpdateItem">
                <label>Dirección</label>
                <input
                  className="clientUpdateInput"
                  type="text"
                  placeholder={clientData.businessAddress}
                  onChange={handleChange}
                  name="businessAddress"
                  value={clientData.businessAddress || ''}   
                  onInvalid={e=> e.target.setCustomValidity('La Dirección debe tener menos de 100 caracteres')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  maxLength="100"
                  autocomplete="off"               
                />
              </div>
              
              <div className="clientUpdateItemCheckbox">
                <label htmlFor="esMayorista" className="labelCheckbox">¿Es Mayorista?</label>
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
              {/* <div className="clientUpdateItem">
                <label>Es Mayorista</label>
                <select className="newClientSelect" name="esmayorista" id="esmayorista">
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div> */}

              {/* <input
                type="text"
                placeholder={data.imageCover}
                onChange={handleChange}
                name="imageCover"
                value={data.imageCover}
            /> */}
            </div>
            <div className="clientUpdateRight">
              <div className="clientUpdateUpload">
                <img
                  className="clientUpdateImg"
                  src= {
                          // fileBlob ? fileBlob : `http://127.0.0.1:8000/img/clients/${clientData.imageCover}`
                          fileBlob ? fileBlob : `${BASE_URL}/img/clients/${clientData.imageCover}`
                       }
                  alt=""
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
  );
}
